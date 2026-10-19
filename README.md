# On-Ground.ai Enterprise Call Center Platform & Voice AI Hub

> A high-performance, peaceful enterprise call center application built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **Recharts**, **Lucide React**, **Node.js/Express**, and **Twilio Voice API**.

---

## 🌟 Overview

**On-Ground.ai** is an enterprise-grade call center console and AI intelligence hub engineered for high-velocity inside sales, SDRs, and customer support teams. Designed according to strict enterprise design principles:
- **Forest-Green Sidebar** (`#0f261d`) with active shift monitoring and carrier connectivity status.
- **Warm Ivory Background** (`#faf8f3`) for eye comfort during long calling shifts.
- **White Cards** with crisp, subtle borders and soft shadows.
- **Muted Sage-Green Accents** (`#2d6046`) and **Soft Gold Highlights** (`#b88628`).
- **Restrained Typography & Layouts** powered by Plus Jakarta Sans.

---

## 🚀 Key Features Across All 8 Screens

### 1. Dashboard (`/`)
- **KPI Metrics**: Real-time stats for Calls Completed (vs daily quota), Connection & Qualified Rate, Today's Accrued Commission, and Average Call Duration.
- **7-Day Visual Performance**: Recharts Area & Line visualizations tracking daily dials, connects, and qualified leads.
- **Today's Action Tasks**: Prioritized actionable task list. **Clicking any task opens the comprehensive Lead Details Modal**.
- **Pending Follow-Ups**: High-intent prospects with scheduled callbacks and one-click "Call Now" buttons.
- **Live Activity Stream**: Real-time feed of logged calls, CRM synchronizations, and AI transcriptions.

### 2. Calls to Make (`/calls`)
- **Prioritized Customer Leads**: Ordered by urgency, ICP fit, and buying intent.
- **Interactive Controls**:
  - Full-text search by customer name, company, phone, or solution tags.
  - Filtering by Status (`New`, `In Progress`, `Scheduled`, `Contacted`, `Follow-Up`) and Priority (`Urgent`, `High`, `Medium`).
  - Multi-column sorting (Priority, Contract Value, ICP Score, Customer Name).
  - Configurable pagination with previous/next controls.
  - Expandable rows revealing deal notes, recent touchpoints, and buying signals.
- **One-Click Calling Action**: Green "Call" button directly initiates the calling workflow.

### 3. Incoming Calls (`/incoming`)
- **Missed Calls & Inbound Stream**: Shows missed calls, inbound callback requests, caller company, time elapsed, and potential contract value.
- **AI Transcribed Voicemail Preview**: Voicemail duration, audio playback simulation bar, and full transcript.
- **Callback Workflow**: Clicking "Callback Now" immediately launches the calling console to dial that contact.

### 4. Recent Calls (`/recent`)
- **Complete Call History Log**: Direction (outbound, inbound), timestamp, exact call duration, outcome disposition, and linked lead.
- **AI Sentiment Analysis**: Positive, Neutral, Hesitant badges evaluated against speech transcripts.
- **Audio Recording Playback**: Play/pause audio controls for archived call recordings.
- **Direct Redial**: One-click redialing action.

### 5. Calendar (`/calendar`)
- **Monthly Interactive Calendar**: Month/year switcher, "Today" quick jump, and event indicator dots.
- **Date Selection**: Clicking any day updates the Selected Day Schedule sidebar.
- **Schedule Follow-Up Modal**: Fully functional form to book new follow-up calls and demos.
- **Direct Calling**: Launch calls directly from scheduled calendar appointments.

### 6. Pulse Home (`/pulse`)
- **AvaniBot Autonomous Assistant**: Central conversational AI intelligence with status indicators, transcription counters, and deal escalation tracking.
- **Role Agents Grid**:
  - *Sales Coaching Agent* (objection scripts and pitch pacing)
  - *Objection Handler* (competitor defense against Talkdesk/Five9)
  - *Follow-Up Drafter* (instant post-call email recaps)
  - *Executive Deal Strategist* (discount approval and contract yield optimization)
- **Task Agents Grid**: Background workers for automated transcription, buying signal detection, and CRM synchronization.
- **Pulse Team Channels List**: Quick navigation into `#urgent-leads`, `#deal-desk`, `#coaching-and-scripts`, and `#product-feedback`.
- **Team Kudos & Wins**: Feed of peer recognitions and closed deals.

### 7. Pulse Channel (`/pulse/channel/:id`)
- **Channel Header**: Topic, member count, and back navigation to Pulse Home.
- **Pinned "Needs Your Input" Card**:
  - Displays high-stakes actionable items (e.g. 15% discount approval for Apex Global or callback escalations).
  - **Two Functional Interactive Buttons**: e.g., "Approve 15% Discount" or "Counter with 10% + Credit". Clicking either updates state and logs the signed action directly into the conversation!
- **Real-Time Messaging**: Left/right chat bubbles, sender roles, timestamps, quick prompt suggestions, and live AI response from AvaniBot.

### 8. Lead Details Modal
- **Dossier & Company Metrics**: Annual revenue, company size, location, direct phone, and email.
- **Visual Score Gauges**: Ideal Customer Profile (ICP) fit meter and Buying Intent velocity meter.
- **Expandable Buying Signals**: Real-time signals (pricing page visits, whitepaper downloads, security audit requests) with click-to-expand details.
- **Contact History Timeline**: Chronological trail of calls, emails, and meetings.
- **Previous / Next Navigation**: Convenient `< Prev` and `Next >` buttons to cycle through leads without closing the modal.
- **Direct Calling**: One-click "Call Lead Now" button.

---

## 📞 Calling Architecture & Telephony Integration

The platform provides a dual-layer calling engine:

```
                  ┌───────────────────────────────┐
                  │    On-Ground.ai Client UI     │
                  │  (CallingContext + WebAudio)  │
                  └──────────────┬────────────────┘
                                 │ HTTP POST /api/calls/initiate
                                 ▼
                  ┌───────────────────────────────┐
                  │     Express Backend Server    │
                  │      (server/server.ts)       │
                  └──────────────┬────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
[ Twilio Configured ]                           [ Unconfigured / Local ]
Twilio Programmable Voice REST Client            High-Fidelity Web Audio Synthesizer
- Outbound Call Bridging (Agent ⮂ Customer)     - Real browser Web Audio Context
- Polly.Neural Speech Voice Prompts             - DTMF Dial Tones (697Hz-1477Hz)
- Live TwiML Webhook Serving                    - US Standard Ringback (440Hz + 480Hz)
- Real Call SID & Status Callbacks              - Real User Microphone Input
                                                - Dynamic Audio Waveform Canvas
```

### 1. Real Twilio Telephony (Human-to-Human Bridging)
When Twilio credentials are configured in `.env`:
1. Clicking "Call Lead" dispatches a request to `/api/calls/initiate`.
2. The server uses the official Twilio SDK to dial the agent's verified phone number.
3. When the agent answers, Twilio executes the bridge TwiML at `/api/calls/twiml/bridge`, greeting the agent and immediately dialing the customer lead.
4. Twilio status webhooks (`/api/calls/status-webhook`) report ringing, answered, and completed timestamps.

### 2. High-Fidelity Audio Simulation Mode
If running without Twilio credentials or without purchased phone numbers:
- The backend automatically switches to simulation mode with clear status reporting.
- The client-side `soundSynthesizer.ts` creates authentic telephone tones via the browser's `AudioContext`.
- Users can press numbers on the interactive DTMF keypad and hear authentic dual-frequency tones.
- Real microphone input is captured via `navigator.mediaDevices.getUserMedia` to drive the audio waveform bars in real time.
- Call duration, disposition selection, and notes are logged to the backend store and added to Recent Calls.

---

## 🛠️ Technology Stack

| Layer | Technologies | Rationale |
|---|---|---|
| **Frontend Framework** | React 18, Vite 6, TypeScript | Instant HMR, type safety, optimal runtime performance |
| **Styling** | Tailwind CSS 3 | Utility-first architecture with custom forest green, sage, warm ivory, and soft gold design tokens |
| **Icons & Visuals** | Lucide React | Modern, lightweight, clean iconography |
| **Charts** | Recharts 2 | Responsive SVG Area, Bar, and Line charts |
| **Backend** | Node.js, Express 4, TypeScript | Lightweight, fast REST API for telephony security |
| **Telephony** | Twilio Voice SDK, TwiML, Web Audio API | Official Twilio Programmable Voice integration with client audio fallback |

---

## ⚙️ Installation & Run Instructions

### Prerequisites
- Node.js (v18.0.0 or higher, tested on Node v24.20.0)
- npm (v9.0.0 or higher)

### 1. Clone & Install
```bash
cd c:\Projects\callcenterapp
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

To enable real human-to-human calling via Twilio, supply your credentials in `.env`:
```env
PORT=3001
VITE_API_URL=http://localhost:3001

TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+12025550199
AGENT_PHONE_NUMBER=+1YOUR_MOBILE_NUMBER
TWILIO_WEBHOOK_BASE_URL=https://your-public-url.ngrok-free.app
```
*(If left blank, the application automatically runs in High-Fidelity Audio Synthesizer mode with zero setup required).*

### 3. Run Development Server
To run both the backend Express server and Vite frontend simultaneously:
```bash
npm run dev
```
Or run separately:
```bash
# Terminal 1: Backend Server (Port 3001)
npm run dev:backend

# Terminal 2: Frontend App (Port 5173)
npm run dev:frontend
```

Open your browser to: **`http://localhost:5173/`**

### 4. Build for Production
```bash
npm run build
```
This builds the client assets to `dist/` and compiles the backend server to `dist-server/`.

---

## 🧪 Testing & Verification Report

| Test Suite | Result | Details |
|---|---|---|
| **TypeScript Frontend Build** | ✅ PASS | `tsc -b && vite build` built in 3.14s with 0 errors |
| **TypeScript Backend Build** | ✅ PASS | `tsc --project tsconfig.server.json` compiled with 0 errors |
| **API Healthcheck** | ✅ PASS | `GET /api/health` returned HTTP 200 OK |
| **Telephony Status Endpoint** | ✅ PASS | `GET /api/calls/status` returned provider configuration |
| **Outbound Call Initiation** | ✅ PASS | `POST /api/calls/initiate` generated call session and SID |
| **AI Voice Call Dispatch** | ✅ PASS | `POST /api/calls/ai-agent` generated AI voice dispatch |
| **Twilio TwiML Generation** | ✅ PASS | `GET /api/calls/twiml/bridge` generated valid XML with Polly voice |
| **Call Logging Endpoint** | ✅ PASS | `POST /api/calls/log` persisted call outcomes and duration |
| **Vite Backend API Proxy** | ✅ PASS | `http://localhost:5173/api/health` proxied to port 3001 |

---

## 🎬 2-Minute Demo Script

- **[0:00 - 0:20] Executive Dashboard**:
  Showcase the warm ivory and forest-green aesthetic. Highlight KPI progress bars (quota pace, connection rate, commission ticker) and the 7-day Recharts volume trends.
- **[0:20 - 0:40] Task to Lead Dossier Flow**:
  Click on the top task ("Urgent callback to Marcus Vance"). Point out how the Lead Details Modal opens instantly, displaying the 96/100 ICP score, expandable buying signals, and contact history. Click `Next >` to navigate directly between leads.
- **[0:40 - 1:05] Live Calling Console**:
  Click "Call Lead Now" from the modal. Observe the active call console opening: dialing state, ringing state with ringback tone, connected state with real-time waveform animation. Demonstrate the interactive DTMF keypad beeps, mute toggle, and hang up. Choose the "Connected & Qualified" disposition and save the call.
- **[1:05 - 1:20] Calls to Make & Filters**:
  Switch to the "Calls to Make" tab. Demonstrate the real-time search bar, priority filter dropdown, sorting by deal value, and row expander displaying deal notes.
- **[1:20 - 1:35] Incoming Calls & Voicemail**:
  Navigate to "Incoming". Highlight the urgent missed call from Marcus Vance ($48,000 ARR). Click "Play Audio Recording" on the transcribed voicemail, then click "Callback Now" to initiate an instant return call.
- **[1:35 - 1:50] Calendar & Scheduling**:
  Switch to "Calendar". Browse October 2026 dates with event indicator dots. Select a date to reveal the scheduled meetings. Click "Schedule New Call" and book a new appointment.
- **[1:50 - 2:00] Pulse AI Intelligence Hub & Channels**:
  Navigate to "Pulse Intelligence". Review the 4 Role Agents (Coaching, Objections, Follow-up, Deal Desk). Enter `#urgent-leads`. Point out the pinned "Needs your input" card. Click "Call Marcus Back Now" to execute the deal action, post into chat, and prompt AvaniBot.

---

## 🔒 Security & Best Practices

- **Zero Secret Leakage**: Credentials are read solely via `process.env` on the Node.js backend. No API keys or tokens are bundled into client code.
- **Rate-Limiting & Validation**: All endpoints validate phone numbers and request payloads.
- **Audio Privacy**: Call recordings and simulated transcripts simulate AES-256 encrypted storage.

---

## 🤖 AI Tools Used
Developed using Gemini 3.8 Flash (High) via Antigravity Agentic Pair Programming.
