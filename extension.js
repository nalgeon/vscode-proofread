const vscode = require("vscode");

module.exports = {
    activate,
};

async function activate(context) {
    let apikey = await context.secrets.get("proofread.openai.apikey");
    if (!apikey) {
        const apikey = await vscode.window.showInputBox({
            placeHolder: "Enter your OpenAI API key",
            ignoreFocusOut: true,
            password: true,
        });

        if (apikey) {
            await context.secrets.store("proofread.openai.apikey", apikey);
        } else {
            vscode.window.showErrorMessage("OpenAI API key is required.");
            return;
        }
    }

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
        "proofread.changeApiKey",
        async () => {
            await changeApiKey(context);
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

    try {
        const result = await fetchResult(context, prompt, selectedText);
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

    try {
        const result = await fetchResult(context, prompt, selectedText);
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, result);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
}

async function changeApiKey(context) {
    const apikey = await vscode.window.showInputBox({
        placeHolder: "Enter your OpenAI API key",
        ignoreFocusOut: true,
        password: true,
    });

    if (apikey) {
        await context.secrets.store("proofread.openai.apikey", apikey);
    }
}

async function fetchResult(context, prompt, query) {
    try {
        const apikey = await context.secrets.get("proofread.openai.apikey");

        const config = vscode.workspace.getConfiguration("proofread");
        const model = config.get("openai.model");
        const temperature = config.get("openai.temperature");

        const language = config.get("language");
        prompt = prompt.replace("{}", language);

        const controller = new AbortController();
        const timeoutSec = config.get("openai.timeout");
        const timeoutId = setTimeout(
            () => controller.abort(),
            timeoutSec * 1000
        );

        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apikey}`,
                },
                body: JSON.stringify({
                    model: model,
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
            }
        );

        clearTimeout(timeoutId);

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.choices[0].message.content.trim();
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out");
        }
        throw new Error(error.message);
    }
}
