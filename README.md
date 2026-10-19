# OnGround.ai — AI-Powered Call Centre

An AI-assisted call centre application designed to simplify customer calling workflows, prioritize leads, manage follow-ups, and improve team collaboration through a unified workspace.

<p align="center">
  <a href="https://ongroundai-zeta.vercel.app/"><strong>🚀 Live Demo</strong></a>
  &nbsp; | &nbsp;
  <a href="https://github.com/NHacker7/OnGround.ai"><strong>GitHub Repository</strong></a>
</p>

## Overview

OnGround.ai brings essential call centre workflows into one interface, including call planning, missed-call follow-ups, call history, lead prioritization, scheduling, and team collaboration through Pulse.

The application includes an interactive dashboard, lead management interface, calling controls, and an AI-oriented workspace. The calling workflow also demonstrates AI voice playback through the laptop speakers.

**Live application:** https://ongroundai-zeta.vercel.app/

## Features

### 1. Dashboard
- Key performance indicator (KPI) cards.
- Call activity and progress indicators.
- Waiting leads and pending tasks.
- Monthly earnings summary.
- Seven-day call activity and customer satisfaction (CSAT) charts.

### 2. Calls to Make
- Prioritized lead list.
- Lead information and score indicators.
- Expandable lead rows.
- Pagination for navigating leads.

### 3. Incoming Calls
- Missed and incoming call records.
- Potential value associated with missed calls.
- Callback actions for individual records.

### 4. Recent Calls
- Call history with call type, time, and duration.
- Selectable call records for reviewing details.

### 5. Calendar
- Monthly calendar view.
- Event indicators on relevant dates.
- Today shortcut and previous/next month navigation.

### 6. Pulse Workspace
- AvaniBot assistant interface.
- Role-based and task-oriented agent sections.
- Team channels and discussions.
- Kudos section for recognizing team contributions.

### 7. Pulse Channels
- Channel-specific conversations.
- Pinned requests requiring input.
- Confirm and Reschedule actions.
- Message composer, timestamps, and distinct message bubbles.

### 8. Leads Modal
- Customer and lead information.
- Ideal Customer Profile (ICP) score and lead intent score.
- Expandable ICP breakdown and buying-signal sections.
- Previous/next lead navigation.
- Lead-related alerts and contextual information.

### 9. AI Voice Demonstration
- AI voice playback through the laptop speakers during the calling workflow.
- Spoken AI output as part of the calling demonstration.

The live website demonstrates the deployed application interface. Features dependent on backend services, credentials, or live telephony may require additional configuration and testing.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Builds the interactive, component-based user interface. |
| TypeScript | Adds static typing to improve code reliability and maintainability. |
| Vite | Provides frontend development and build tooling. |
| Tailwind CSS | Supports consistent styling and responsive layouts. |
| Node.js | Provides the server-side JavaScript runtime. |
| Express | Handles backend routes and API endpoints, where configured. |
| Local mock data | Supports demonstrations without requiring a production database. |
| Browser audio APIs | Support audio playback in the browser, where implemented. |
| Twilio | Optional telephony integration when configured with valid credentials. |
| OpenAI API | Optional AI response generation if implemented and configured. |
| Vercel | Hosts the deployed frontend and provides a public website URL. |

### Why This Stack?

- **React:** Enables reusable components and interactive screens.
- **TypeScript:** Helps catch programming errors and improves maintainability.
- **Vite:** Provides a fast development workflow and optimized frontend builds.
- **Tailwind CSS:** Makes consistent styling and responsive design easier.
- **Node.js and Express:** Support backend endpoints and external integrations.
- **Local mock data:** Allows the application to be demonstrated without depending on live customer records.
- **Vercel:** Makes the frontend accessible through a public deployment URL.

The exact technologies used for AI speech generation, speech recognition, and audio playback depend on the implemented code and configuration.

## Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm, included with Node.js.
- [Git](https://git-scm.com/)
- A code editor such as Visual Studio Code or Google Antigravity.

### 1. Clone the repository

```bash
git clone https://github.com/NHacker7/OnGround.ai.git
cd OnGround.ai
```

### 2. Install dependencies

```bash
npm install
```

If the frontend and backend use separate `package.json` files, install their dependencies in the relevant directories too.

### 3. Configure environment variables

Check the project's environment example files and source code for the required variables.

Possible variables for optional integrations include:

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
AGENT_PHONE_NUMBER=
OPENAI_API_KEY=
```

These are examples only. Use the exact variables required by the implementation.

Never commit populated `.env` files, API keys, passwords, or authentication tokens to GitHub.

### 4. Run the application

For a standard Vite frontend, the development command is usually:

```bash
npm run dev
```

If the backend runs separately, start it using the script defined in its `package.json`.

Check the project's actual scripts if these commands differ.

### 5. Build the application

Run the build commands configured in the project's `package.json` files. For a standard Vite frontend, this is commonly:

```bash
npm run build
```

## Implementation Status

### Completed / Demonstrated

- Dashboard with KPI cards, progress information, tasks, earnings, and seven-day charts.
- Calls to Make interface with prioritized leads and pagination.
- Incoming and missed-call interface with callback actions.
- Recent call history and call details.
- Calendar month view and navigation.
- Pulse workspace with AvaniBot, agents, channels, and Kudos.
- Pulse channel view with pinned requests and a message composer.
- Leads modal with ICP and lead intent scores, expandable sections, and lead navigation.
- AI voice playback through the laptop speakers during the calling workflow.
- Public frontend deployment on Vercel.

### Skipped, Optional, or Limited

- **Live telephone calls:** Require a configured telephony provider and successful connection testing.
- **Recipient-side AI audio:** Must be verified separately from laptop speaker playback.
- **Production AI conversations:** Depend on the actual AI integration and configuration.
- **Speech recognition and two-way conversation:** Should only be considered complete if microphone input is processed and the AI responds to the user's speech.
- **Production database:** Persistent multi-user storage is not assumed unless implemented.
- **Production authentication:** Secure user accounts and role-based access require separate verification.
- **Backend deployment:** Must be configured separately if the frontend depends on a continuously running backend that is not hosted by the current deployment.

These limitations should be updated as additional features are implemented and verified.

## AI Tools Used

### Google Antigravity
Used as an AI-assisted development environment to help implement features, refine the interface, inspect code, and assist with debugging.

### ChatGPT
Used for feature planning, implementation guidance, troubleshooting, UI refinement, and documentation.

### OpenAI API — Optional Runtime Integration
An OpenAI API integration may support application-level AI responses if implemented and configured. Using ChatGPT during development is separate from integrating an AI API into the running application.

## Future Improvements

- Complete and validate live telephony integration.
- Verify AI audio delivery to the intended call recipient.
- Improve speech recognition and conversational voice workflows where required.
- Add a production database for persistent call and lead records.
- Implement secure authentication and role-based access control.
- Add automated tests for important interactions.
- Configure backend hosting and monitoring where required.

## Security

- Never commit API keys, passwords, authentication tokens, or populated `.env` files.
- Store secrets in environment variables or an appropriate secrets manager.
- Use mock data for demonstrations unless real customer data is explicitly authorized and securely managed.

## Disclaimer

OnGround.ai is a development and demonstration application. Features that depend on external APIs, credentials, or live telephony must be configured and tested separately. Demonstration audio, mock records, and sample lead scores should not be interpreted as proof of a live telephone connection or verified customer assessments.

## Links

- **Live Demo:** https://ongroundai-zeta.vercel.app/
- **GitHub Repository:** https://github.com/NHacker7/OnGround.ai

## License

No license has been specified. Unless a license is added to the repository, all rights remain with the copyright holder.
