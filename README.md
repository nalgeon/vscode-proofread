# Proofread and translate text in VS Code

This extension offers _Proofread text_ and _Translate text_ commands in VS Code. It's a simple alternative to DeepL, Grammarly, and other similar tools.

Notable features:

-   Uses Copilot, Ollama, or OpenAI for proofreading.
-   Configurable language model and prompts (with good defaults).
-   Supports many target languages (default is English).

⚠️ By default, this extension uses the Copilot API. It's free with a limit of 50 requests per month, or unlimited for paid Copilot subscribers. Unfortunately, Copilot only supports proofreading, not translation. To use the extension for translation, switch to Ollama or OpenAI (see details below).

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

## Using Ollama

Ollama runs AI models locally on your machine. Here's how to set it up:

1. Download and install [Ollama](https://ollama.com/) for your operating system.
2. Set the [environment variables](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-configure-ollama-server) to use less memory:

```
OLLAMA_KEEP_ALIVE = 1h
OLLAMA_FLASH_ATTENTION = 1
```

3. Restart Ollama.
4. Download the AI model Gemma 2:

```
ollama pull gemma2:2b
```

5. Change the Proofread settings:

```
proofread.ai.vendor = ollama
proofread.ai.model = gemma2:2b
```

That's it!

Gemma 2 is a lightweight model that uses about 1GB of memory and works quickly without a GPU. For good results, send only a few paragraphs at a time for proofreading or translation.

For larger documents or improved results, try models like `mistral` or `mistral-nemo`.

## Using OpenAI

OpenAI offers state-of-the-art AI models through an API. Here's how to switch to it:

1. Get an API key from the [OpenAI Settings](https://platform.openai.com/account/api-keys).
2. When you have the key, set it using the _Proofread: Set OpenAI API Key_ command.
3. Change the Proofread setting `proofread.ai.vendor` to `openai`.

That's it!

⚠️ OpenAI is a **paid service**; they charge for API use.

## Settings

`proofread.ai.vendor`

Name of the AI model provider. Must be either `copilot`, `ollama`, or `openai`. Default: `copilot`

`proofread.ai.url`

Custom URL of the AI API endpoint (leave empty to use the default URL).

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
