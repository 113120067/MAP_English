# System Comparison: Kids Vocabulary Features

| Feature | Legacy System (Immersive Viewer) | New System (App Kids Vocab) | Architecture Shift |
| :--- | :--- | :--- | :--- |
| **Tech Stack** | Node.js + Pug (Server-Side Rendering) + jQuery | React + Vite (Single Page App) | **Decoupled**: Frontend is now a standalone static app. |
| **Data Flow** | Frontend logic heavily mixed with generic backend routes. Complex fallback logic in client JS. | Clean API consumer. All generation/storage logic hidden behind `POST /api/v1/kids/generate`. | **Separation of Concerns**: Client is dumb, Backend is smart. |
| **Image Generation** | Mixed. Frontend tries GitHub first, then Backend, then fallback to local Pollinations URL generation. | **Unified**. Frontend just asks API. API handles Cache/Gen/Upload/Fallback transparently. | **Simplified Client**: No leaking of API keys or complex logic to browser. |
| **Speech** | Web Speech API directly in class. | Custom React Hook (`useSpeech`). | **Reusable**: Logic encapsulated in hook. |
| **Storage** | GitHub (Client-side upload + Backend upload mixed). | GitHub (Backend-side only). | **Security**: No GitHub tokens exposed or managed in Client code. |
| **User Experience** | Page reloads for some actions. "Heavy" feel. | Instant interactions (React). "App-like" feel. | **Performance**: Smoother UI. |

## Feature Parity Check

| Feature | Legacy | New (POC) | Status |
| :--- | :--- | :--- | :--- |
| **Word Input** | ✅ Yes | ✅ Yes | Parity |
| **Image Gen** | ✅ Yes | ✅ Yes | Parity |
| **History** | ✅ Yes (LocalStorage) | ✅ Yes (LocalStorage) | Parity |
| **TTS (Speak)** | ✅ Yes | ✅ Yes | Parity |
| **Quick Chips** | ❌ No (Hardcoded buttons in Pug?) | ✅ Yes (Dynamic Chips) | **Improved** |
| **Voice Selection** | ✅ Yes | ✅ Yes | Parity |
| **Practice Mode** | ✅ Yes (Speech Recog) | ❌ Planned | *To be implemented* |
| **Report Image** | ✅ Yes | ❌ Planned | *To be ported* |
