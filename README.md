# OnGround.ai — AI-Powered Call Centre

An AI-assisted call centre application designed to help teams manage customer calls, organize leads, track follow-ups, and collaborate through a unified workspace.

## Overview

OnGround.ai brings essential call centre workflows into one interface, including call planning, missed-call follow-ups, call history, lead prioritization, scheduling, and team collaboration through Pulse.

The application includes an interactive dashboard, lead management interface, calling controls, and an AI-oriented workspace. It supports local demonstration data so the user interface and workflows can be explored during development and presentation.

## Features

### 1. Dashboard
- Overview of call centre performance using KPI cards.
- Call activity and progress indicators.
- Waiting leads and pending tasks.
- Monthly earnings summary.
- Seven-day call activity and CSAT charts.

### 2. Calls to Make
- Prioritized list of leads to contact.
- Lead information and score indicators.
- Expandable lead rows.
- Pagination for navigating leads.

### 3. Incoming Calls
- View missed and incoming call records.
- Display potential value associated with missed calls.
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
- Channel-specific conversation view.
- Pinned tasks and requests requiring input.
- Confirm and Reschedule actions.
- Message composer, timestamps, and distinct message bubbles.

### 8. Leads Modal
- Customer and lead information.
- Ideal Customer Profile (ICP) score and lead intent score.
- Expandable ICP breakdown and buying-signal sections.
- Previous/next lead navigation.
- Lead-related alerts and contextual information.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Builds the interactive, component-based user interface. |
| TypeScript | Adds static typing to improve code reliability and maintainability. |
| Vite | Provides a fast development server and frontend build process. |
| Tailwind CSS | Supports consistent styling and responsive layouts. |
| Node.js | Runs the server-side JavaScript/TypeScript environment. |
| Express | Handles backend HTTP routes and API endpoints, where configured. |
| Local mock data | Supports demonstrations and testing without requiring a production database. |
| Web Audio API | Supports browser-generated audio for simulated calling experiences. |
| Twilio integration | Provides an optional architecture for real telephone calls when valid credentials and required configuration are available. |
| OpenAI API integration | Optional AI response generation where configured. |

### Why This Stack?

- **React** makes it easier to build reusable UI components and interactive screens.
- **TypeScript** helps catch common programming errors and makes a growing application easier to maintain.
- **Vite** simplifies frontend development and provides fast builds.
- **Tailwind CSS** makes it easier to maintain a consistent design across all eight screens.
- **Node.js and Express** provide a way to implement server-side endpoints and integrate external services.
- **Local mock data** allows the application to be demonstrated without depending on live customer records or paid services.

## Getting Started

### Prerequisites

Install the following software:

- [Node.js](https://nodejs.org/) — preferably the version supported by the project's dependencies.
- npm, included with Node.js.
- [Git](https://git-scm.com/) to clone the repository.
- A code editor such as Visual Studio Code or an IDE such as Google Antigravity.

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/NHacker7/OnGround.ai.git
cd OnGround.ai
```

### 2. Install dependencies

From the project root, run:

```bash
npm install
```

If the frontend and backend use separate `package.json` files, install dependencies in each directory as well.

### 3. Configure environment variables

Check the project's environment example files and documentation. If the relevant integrations are needed, create the required local environment file without committing it to GitHub.

Possible configuration variables include:

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
AGENT_PHONE_NUMBER=
OPENAI_API_KEY=
```

These variables are optional only where the application code supports operating without them. Use the exact variable names expected by the current code.

**Security:** Never commit actual credentials, API keys, passwords, or populated `.env` files to the repository.

### 4. Run the application

Inspect `package.json` for the scripts provided by the project.

For a standard Vite frontend, the development command is usually:

```bash
npm run dev
```

If the backend is a separate service, open another terminal and use the backend's configured development script. The actual command may differ depending on the project's current scripts.

Vite will print the local development URL in the terminal, commonly `http://localhost:5173`.

### 5. Build the application

Run the available build scripts from the project root:

```bash
npm run build:frontend
npm run build:backend
```

These commands should be used if they are defined in the project's `package.json`. If not, use the build scripts actually provided by the repository.

## Implementation Status

### Completed features

- Dashboard with KPI cards, progress information, tasks, earnings, and seven-day charts.
- Calls to Make interface with ranked leads and pagination.
- Incoming and missed-call interface with callback actions.
- Recent call history and call details.
- Calendar month navigation and event indicators.
- Pulse home with AvaniBot, role agents, task agents, channels, and Kudos.
- Pulse channel view with pinned requests, conversation messages, and a reply composer.
- Leads modal with ICP and lead intent scores, expandable buying signals, and lead navigation.
- Consistent forest-green sidebar, light content surfaces, and restrained purple accents.
- Local demonstration data for supported workflows.

*The items above describe the implemented application scope. Verify the current repository before treating every interaction as fully tested.*

### Skipped, optional, or limited features

- **Live telephone calling:** Requires valid telephony provider credentials and the appropriate configuration. Without these, calling may operate in simulation mode.
- **Production AI voice conversations:** Depend on the configured AI integration and, where applicable, telephony setup.
- **Production database and authentication:** A production-ready database, persistent multi-user accounts, and deployment security are not assumed by this README.
- **Real customer and lead data:** Demonstration records and scores must not be interpreted as verified customer information or actual AI assessments.
- **External integrations:** Features that require credentials or third-party services may be unavailable until configured.

These limitations should be updated if the corresponding features are implemented and verified.

## AI Tools Used

### Google Antigravity
Used as an AI-assisted development environment to help inspect the project, implement application features, refine the interface, and assist with debugging and build checks.

### ChatGPT
Used as a development assistant to help plan application features, refine UI requirements, prepare implementation prompts, troubleshoot issues, and document the project.

### OpenAI API — Optional Runtime Integration
The application architecture may use an OpenAI API integration for AI-generated responses when configured. This is separate from using ChatGPT during development. API availability and costs depend on the account, model, and configuration.

## Project Structure

The application includes a React/TypeScript frontend and a server-side component. The exact structure should be confirmed from the repository.

Typical responsibilities include:

- `src/` — frontend pages, components, application state, and services.
- `server/` — backend routes and integrations, where present.
- `public/` — static assets, where present.
- `package.json` — project dependencies and scripts.
- `.env.example` — placeholder environment configuration, if included.

## Future Improvements

- Integrate a production database for persistent lead and call records.
- Add secure authentication and role-based access control.
- Complete and validate real telephony integration.
- Improve AI voice workflows and human handoff.
- Add automated tests for key user interactions.
- Add production deployment, monitoring, and error reporting.

## Disclaimer

OnGround.ai is a development project and demonstration application. Features that depend on third-party APIs, credentials, or live telephony must be configured and tested separately. Simulated calls, sample data, and placeholder scores are not evidence of live calls or verified customer assessments.

## License

No license has been specified yet. Unless a license is added to this repository, all rights remain with the copyright holder.

---

**Repository:** https://github.com/NHacker7/OnGround.ai
