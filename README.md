# AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate everyday workplace tasks using AI — generating emails, summarizing meeting notes, and answering questions through an interactive AI assistant. Built with a clean, SaaS-style dashboard interface, no login required.

## Project Overview

AI Workplace Productivity Assistant is a browser-based productivity tool designed to save professionals time on repetitive communication and documentation tasks. Instead of drafting emails from scratch or manually combing through meeting notes for action items, users can generate polished, editable AI output in seconds — all from a single, distraction-free dashboard.

The app requires no sign-up or account creation. Anyone can open it and start using the tools immediately, with all AI generation happening live per request.

## Features Implemented

- **Smart Email Generator**
  - Generates professional emails from a short description of context and key points
  - Supports multiple tones: Formal, Friendly, and Persuasive
  - Supports different email types: new email, reply, or follow-up
  - Output includes a subject line and full body, fully editable before use

- **Meeting Notes Summarizer**
  - Condenses lengthy meeting notes or transcripts into a short summary
  - Automatically extracts and separates:
    - Action items
    - Decisions made
    - Deadlines
  - All extracted sections are editable and copyable

- **AI Chatbot Interface**
  - Interactive assistant for general workplace questions and tasks
  - Responds dynamically to user prompts (no scripted/generic replies)
  - Suggested prompt chips to help users get started

- **Dashboard & Navigation**
  - Central dashboard with quick access to all tools and session activity overview
  - Persistent sidebar navigation, collapsible on smaller screens
  - Fully responsive layout across desktop, tablet, and mobile

- **Editable AI Outputs**
  - Every AI-generated result (emails, summaries, chat responses) can be edited directly in place before being copied or used

- **Responsible AI Disclaimer**
  - Visible disclaimer on all AI output reminding users to review content before relying on it
  - Dedicated Responsible AI info section explaining data handling and AI limitations

- **No Login Required**
  - No user registration, authentication, or account system — the app is open access with no stored user data

## Technologies and Tools Used

> Update this section to match your final Lovable build if any tools change.

- **Frontend Framework:** React (via Lovable)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Build Tool:** Vite
- **AI Integration:** LLM API call (via Lovable's native AI integration / Supabase edge function) for live email generation, summarization, and chatbot responses
- **Hosting/Deployment:** Lovable-hosted deployment (or exported and deployed via a static host such as Vercel/Netlify)
- **Design Tool:** Lovable (AI-assisted app builder)

## Setup Instructions

### Option 1: Run via Lovable
1. Open the project in [Lovable](https://lovable.dev).
2. Click **Publish** to deploy the app directly, or continue editing via prompts.
3. No environment setup is required for the hosted Lovable preview.

### Option 2: Run locally
1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/ai-workplace-productivity-assistant.git
   cd ai-workplace-productivity-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root and add any required AI API keys, for example:
   ```
   VITE_AI_API_KEY=your_api_key_here
   ```
   > Exact variable names depend on which AI provider is connected in your Lovable/Supabase setup — check your project's integration settings.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or the port shown in your terminal).

5. **Build for production**
   ```bash
   npm run build
   ```

## Disclaimer

This application uses AI to assist with drafting and summarizing workplace content. AI-generated outputs may be inaccurate, incomplete, or contextually inappropriate. Always review, verify, and edit content before relying on it for professional or business decisions. Do not input confidential, sensitive, or personal data you are not authorized to share.

## License

Specify your license here (e.g. MIT).
