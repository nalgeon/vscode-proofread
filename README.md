# Proofread and translate text in VS Code

This extension offers _Proofread_ and _Translate_ commands in VS Code. It's a simple alternative to DeepL, Grammarly, and other similar tools.

To proofread or translate text, select it in the editor and run _Proofread: Proofread Text_ or _Proofread: Translate Text_ from the command palette. That's it!

https://github.com/user-attachments/assets/f270d60f-674c-4dfb-8fef-ef22779f12bd

Notable features:

-   Configurable language model and prompts (with good defaults).
-   Supports any target language provided by OpenAI (default is English).

⚠️ This extension uses the OpenAI API, so you'll need an API key (the extension will ask you for it). You can get an API key in the [OpenAI Settings](https://platform.openai.com/settings/organization/api-keys). Please note that this is a **paid feature**, and OpenAI will charge you for using their API.

## Installation

Open the VS Code Marketplace (`Ctrl+Shift+X` / `Cmd+Shift+X`), search for the extension by typing "proofread" or "nalgeon.proofread", and click _Install_. Get an API key from OpenAI, and you're all set!

## Commands

Run these commands from the VS Code command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).

**Proofread: Proofread Text**

Proofreads the selected text and prints the suggested changes below it.

**Proofread: Translate Text**

Translates the selected text and overwrites it with the translation.

**Proofread: Change OpenAI API Key**

Sets the new value of the API key.

## Settings

`proofread.openai.model`

Name of the OpenAI model to use. Default: `gpt-4o`

`proofread.openai.temperature`

Sampling temperature to use (between 0 and 2). Higher values make the output more random, while lower values make it more focused and predictable. Default: `0`

`proofread.openai.timeout`

Timeout in seconds for OpenAI API requests. Default: `30`

`proofread.language`

The language to proofread or translate the text into. Default: `English (US)`

`proofread.prompt.proofread`

The prompt to send to the OpenAI API for proofreading.

`proofread.prompt.translate`

The prompt to send to the OpenAI API for translation.

## License

Created by [Anton Zhiyanov](https://antonz.org/). Released under the MIT License.
