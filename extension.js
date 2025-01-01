const vscode = require("vscode");

module.exports = {
    activate,
};

const log = vscode.window.createOutputChannel("Proofread");
const askers = {
    copilot: askCopilot,
    openai: askOpenAI,
};

async function activate(context) {
    let proofreadCmd = vscode.commands.registerCommand(
        "proofread.proofreadText",
        async () => {
            await proofread(context);
        }
    );
    context.subscriptions.push(proofreadCmd);

    let translateCmd = vscode.commands.registerCommand(
        "proofread.translateText",
        async () => {
            await translate(context);
        }
    );
    context.subscriptions.push(translateCmd);

    let changeApiKeyCmd = vscode.commands.registerCommand(
        "proofread.setApiKey",
        async () => {
            await setApiKey(context);
        }
    );
    context.subscriptions.push(changeApiKeyCmd);
}

async function proofread(context) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const config = vscode.workspace.getConfiguration("proofread");
    const prompt = config.get("prompt.proofread");

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    const vendor = config.get("ai.vendor");
    const ask = askers[vendor];
    if (!ask) {
        vscode.window.showErrorMessage(`No such vendor: ${vendor}`);
        return;
    }

    try {
        const result = await ask(context, prompt, selectedText);
        editor.edit((editBuilder) => {
            editBuilder.insert(selection.end, `\n\n${result}`);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
}

async function translate(context) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const config = vscode.workspace.getConfiguration("proofread");
    const prompt = config.get("prompt.translate");

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    const vendor = config.get("ai.vendor");
    if (vendor !== "openai") {
        vscode.window.showErrorMessage(
            "Translation is only supported with OpenAI. Change the 'proofread.ai.vendor' setting to 'openai' or refer to the readme for more details."
        );
        return;
    }

    try {
        const result = await askOpenAI(context, prompt, selectedText);
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, result);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
}

async function setApiKey(context) {
    const apikey = await vscode.window.showInputBox({
        placeHolder: "Enter your OpenAI API key (leave empty to delete)",
        ignoreFocusOut: true,
        password: true,
    });

    if (apikey) {
        await context.secrets.store("proofread.ai.apikey", apikey);
    } else {
        await context.secrets.delete("proofread.ai.apikey");
    }
}

async function askCopilot(context, prompt, query) {
    const config = vscode.workspace.getConfiguration("proofread");
    const modelName = config.get("ai.model");
    const temperature = config.get("ai.temperature");

    log.appendLine(
        `Asking Copilot: model=${modelName}, temperature=${temperature}, prompt_len=${prompt.length}, query_len=${query.length}`
    );

    const [model] = await vscode.lm.selectChatModels({
        vendor: "copilot",
        family: modelName,
    });
    if (!model) {
        throw new Error(`No such model: ${modelName}`);
    }

    const messages = [
        vscode.LanguageModelChatMessage.User(prompt),
        vscode.LanguageModelChatMessage.User(query),
    ];

    const response = await model.sendRequest(
        messages,
        {
            modelOptions: {
                temperature: temperature,
            },
        },
        new vscode.CancellationTokenSource().token
    );

    let responseText = "";
    for await (const fragment of response.text) {
        responseText += fragment;
    }
    return responseText;
}

async function askOpenAI(context, prompt, query) {
    const apikey = await context.secrets.get("proofread.ai.apikey");
    if (!apikey) {
        throw new Error(
            "OpenAI API key is not set. Get the key from https://platform.openai.com/account/api-keys and run the 'Proofread: Set API Key' command to set it."
        );
    }

    const config = vscode.workspace.getConfiguration("proofread");
    const modelName = config.get("ai.model");
    const temperature = config.get("ai.temperature");

    const language = config.get("language");
    prompt = prompt.replace("{}", language);

    const controller = new AbortController();
    const timeoutSec = config.get("ai.timeout");
    const timeoutId = setTimeout(() => controller.abort(), timeoutSec * 1000);

    log.appendLine(
        `Asking OpenAI: model=${modelName}, temperature=${temperature}, prompt_len=${prompt.length}, query_len=${query.length}`
    );

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikey}`,
        },
        body: JSON.stringify({
            model: modelName,
            temperature: temperature,
            messages: [
                {
                    role: "developer",
                    content: prompt,
                },
                {
                    role: "user",
                    content: query,
                },
            ],
        }),
        signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message);
    }
    return data.choices[0].message.content.trim();
}
