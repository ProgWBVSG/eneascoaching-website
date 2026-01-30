<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1C141dRO030koDegNVlPbjxCfm7Hhc_rm

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Agentic Workflow
This project follows a strict agentic workflow:
- `directivas/`: Contains Standard Operating Procedures (SOPs) for tasks.
- `scripts/`: Contains Python scripts implementing the logic from directives.
- `.tmp/`: Temporary files generated during execution.
