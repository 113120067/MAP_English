# Kids Vocabulary Project - Development Handoff

**Purpose**: This document serves as a guide for future AI agents and developers to understand the current state, architecture, and pending tasks of the Kids Vocabulary Application.

## 🏗️ Architecture Overview

The system consists of two main components:

1.  **Frontend (`app-kids-vocab`)**:
    *   **Stack**: React, Vite, TypeScript, Vanilla CSS.
    *   **Role**: UI/UX, Input, Text-to-Speech (Web Speech API), Audio Recording (Practice Mode).
    *   **Key Components**:
        *   `App.tsx`: Main logic, state container.
        *   `MagicCard.tsx`: The core UI comp showing Image, Mnemonics, and controls.
        *   `useSpeechRecognition.ts`: Hook for microphone handling.

2.  **Backend (`map-core-backend`)**:
    *   **Stack**: Node.js (Express), Firebase Admin SDK.
    *   **Role**: API Gateway, Image Generation (Pollinations), Data Persistence (Firestore), GitHub Storage (Backup).
    *   **Key Services**:
        *   `kids-vocab.service.js`: Main logic for word generation/retrieval.
        *   `image-report-service.js`: Handles reporting, archiving, and deletion of bad content.
        *   `ghost-cleanup-service.js`: Background job to clean up stuck generations.
        *   `llm-service.js`: Interfaces with LLM for etymology/mnemonic generation.

---

## ✅ Feature Inventory (Current Status)

| Feature | Status | Description |
| :--- | :--- | :--- |
| **Image Gen** | ✅ Live | Generates simple, kid-friendly cartoon images via Pollinations. |
| **Magic Card** | ✅ Live | Displays Word, Image, Phonetics, Etymology, and Mnemonic Story. |
| **TTS** | ✅ Live | Text-to-Speech for word pronunciation. |
| **Practice Mode** | ✅ Live | Microphone integration. Listens to user speech and gives visual feedback (Red/Green). |
| **Reporting** | ✅ Live | User can flag images. Reports saved to `image_reports`. |
| **Auto-Healing** | ✅ Live | Reported images are automatically **archived** and **deleted** from active DB to force regeneration. |
| **Ghost Cleanup** | ✅ Live | Background service (every 10m) cleans up stuck 'planned' records. |

---

## 🚧 Known Issues / Technical Debt

1.  **Practice Mode Validation**: Currently uses simple substring matching (`includes()`). Could be improved with Levenshtein distance or phoneme matching for better accuracy.
2.  **Audio Feedback**: Practice mode is purely visual. Adding sound effects (Ding/Buzz) would improve UX for kids.
3.  **Authentication**: Currently open API. No user accounts. Rate limiting depends on IP.
4.  **Data Consistency**: If GitHub upload fails but Firestore succeeds, image might be missing. The frontend handles this gracefully (loading spinner), but backend retry logic could be robust.

---

## 🗺️ Roadmap / Next Steps

### 1. Enhanced Practice Mode (Priority: Medium)
*   **Goal**: Make it a game.
*   **Todo**: Add scoring (Stars 1-3), streak counter, and audio feedback.

### 2. Admin Dashboard (Priority: Low)
*   **Goal**: Manage reported content.
*   **Todo**: A simple page to view `image_reports` and `mnemonic_archive`, potentially restoring falsely reported items.

### 3. User Accounts (Priority: High for Production)
*   **Goal**: Save history across devices.
*   **Todo**: Integrate Firebase Auth (Google Sign-in) on Frontend.

---

## 🛠️ Environment Variables Required

**Backend (`.env`)**:
```env
PORT=3001
FIREBASE_SERVICE_ACCOUNT_KEY=...
GITHUB_TOKEN=...
GITHUB_OWNER=...
GITHUB_REPO=...
```

**Frontend**:
*   None currently (hardcoded to `localhost:3001` or relative path). **TODO**: Extract API URL to `.env`.
