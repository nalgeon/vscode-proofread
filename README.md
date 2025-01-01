# Proofread and translate text in VS Code

This extension offers _Proofread_ and _Translate_ commands in VS Code. It's a simple alternative to DeepL, Grammarly, and other similar tools.

To proofread or translate text, select it in the editor and run _Proofread: Proofread Text_ or _Proofread: Translate Text_ from the command palette. That's it!

Notable features:

-   Configurable language model and prompts (with good defaults).
-   Supports many target languages (default is English).

⚠️ By default, this extension uses the Copilot API. It's free with a limit of 50 requests per month, or unlimited for paid Copilot subscribers. Unfortunately, Copilot only supports proofreading, not translation. To use the extension for translation, switch to the OpenAI API (see the `proofread.ai.vendor` setting below).

## Installation

Open the VS Code marketplace (`Ctrl+Shift+X` / `Cmd+Shift+X`), search for the extension by typing "proofread" or "nalgeon.proofread", and click _Install_. You're all set!

## Commands

Run these commands from the VS Code command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).

**Proofread: Proofread Text**

Proofreads the selected text and prints the suggested changes below it.

**Proofread: Translate Text**

Translates the selected text and overwrites it with the translation. Only available if `proofread.ai.vendor` set to `openai`.

**Proofread: Set OpenAI API Key**

Sets the value of the OpenAI API key. Only required if `proofread.ai.vendor` set to `openai`.

## Settings

`proofread.ai.vendor`

Name of the AI model provider. Must be either `copilot` or `openai`. Default: `copilot`

To use both proofreading and translation, change this setting to `openai`. You'll need an API key from the [OpenAI Settings](https://platform.openai.com/account/api-keys). When you have the key, set it using the _Proofread: Set OpenAI API Key_ command.

Please note that using OpenAI is a **paid feature**; they will charge you for using the API.

`proofread.ai.model`

Name of the AI model to use. Default: `gpt-4o`

`proofread.ai.temperature`

Sampling temperature to use (between 0 and 2). Higher values make the output more random, while lower values make it more focused and predictable. Default: `0`

`proofread.ai.timeout`

Timeout for AI API requests in seconds. Default: `30`

`proofread.language`

The language to proofread or translate the text into. Default: `English (US)`

`proofread.prompt.proofread`

The prompt to send to the OpenAI API for proofreading.

`proofread.prompt.translate`

The prompt to send to the OpenAI API for translation.

## License

Created by [Anton Zhiyanov](https://antonz.org/). Released under the MIT License.
