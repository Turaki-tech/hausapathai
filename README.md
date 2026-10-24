# HausaPath AI

**Understand it. In your own way.**

HausaPath AI is an open-source learning companion prototype for students, starting with learners in Gombe and other Hausa-speaking communities. It uses an open-weight language model to explain a topic in beginner-friendly English, provide a Hausa explanation, or generate a short practice quiz.

## What works

- Simple-English explanations with an analogy, worked example, and recap.
- Hausa explanations with important technical terms preserved in English where useful.
- Five-question practice quizzes with an answer key.
- Responsive web interface for phones and laptops.
- Server-side inference so the Hugging Face token is not exposed in browser JavaScript.

## AI model

- **Model:** `Qwen/Qwen3-4B-Instruct-2507`
- **Model licence:** Apache-2.0 (see the model card on Hugging Face)
- **Inference:** Hugging Face Inference Providers chat-completions API, using the `nscale` provider route.
- **AI role:** The model generates the educational explanation or quiz. The interface and mode-specific instructions are authored in this project.

Provider access, model availability, and pricing can change. Check Hugging Face's current Inference Providers page and your account balance before presenting the app. The application should not be described as offline; answers require internet access and an inference token.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

The site preview opens locally, but AI requests need Netlify Functions. For the full local app:

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Set `HF_TOKEN` in your terminal environment (never paste the token into a source file).
3. Run `netlify dev` from the project directory.

For example, in PowerShell:

```powershell
$env:HF_TOKEN="your_token_here"
netlify dev
```

## Deploy

1. Push this project to a **public GitHub repository**.
2. Import the repository into Netlify.
3. In Netlify, open **Site configuration / Environment variables** (the exact label may vary) and add `HF_TOKEN` with a Hugging Face token that has **Make calls to Inference Providers** permission.
4. Deploy the site and test all three learning modes using a real question.
5. Never put the token into `src/`, `index.html`, a public repository, or the client-side environment.

Hugging Face token settings: https://huggingface.co/settings/tokens
Hugging Face inference documentation: https://huggingface.co/docs/inference-providers/tasks/chat-completion
Model card: https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507
Netlify Functions: https://docs.netlify.com/build/functions/overview/

## Demo script

1. Choose **Simple English** and ask: `Explain recursion in programming with a simple everyday example.`
2. Choose **Explain in Hausa** and ask: `Explain what a database is to a beginner. Keep technical terms in English in brackets.`
3. Choose **Practice quiz** and ask: `Give me a beginner quiz on mean, median, and mode.`
4. Explain to judges that an open-weight model generates the actual content, while the project adds three focused learning workflows for students.

## Limitations and responsible use

- The model can make mistakes, including in Hausa. Learners should verify important information with a teacher or trusted study material.
- This prototype does not use a curated textbook database or verify facts against official course material.
- Do not submit passwords, private records, or other sensitive personal information.
- Model use requires a valid token and may consume provider credits.

## Contributing

Issues and pull requests are welcome. Suggestions include testing Hausa explanations with fluent speakers, adding reviewed bilingual glossaries, and evaluating generated quizzes against course materials.

## Licence

This application's source code is distributed under the MIT License. The language model and hosted inference service have their own terms; see the model card and provider terms for details.
