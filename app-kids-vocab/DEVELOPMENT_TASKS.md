# Frontend Development Guide - App Kids Vocab

**Scope**: This document focuses exclusively on the `app-kids-vocab` React application.

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Modules approach via separate files)
- **State**: React Context / Local State
- **Speech**: Web Speech API (`useSpeechRecognition.ts`)

---

## 📂 Project Structure
```
src/
├── components/
│   ├── MagicCard.tsx       # Main feature: Word/Image/Etymology display
│   ├── MagicCard.css       # Styles for MagicCard (Animations included)
│   └── ...
├── hooks/
│   └── useSpeechRecognition.ts # Microphone logic
├── App.tsx                 # Main layout & API integration logic
└── assets/                 # Static images
```

---

## ✅ Completed Frontend Features
- [x] **Word Input**: Clean input field with validation.
- [x] **Magic Card UI**: Displays valid word data (Analysis, Teaching, Image).
- [x] **TTS Integration**: "Listen" button working.
- [x] **Practice Mode**: Microphone interaction with visual feedback (Pulse/Glow).
- [x] **Reporting UI**: "Report" button and modal dialog for user feedback.
- [x] **Responsiveness**: Basic mobile adaptation.

---

## 🚀 Frontend Roadmap (Next Steps)

### 1. UI/UX Polish (Immediate Priority)
- [ ] **Sound Effects**: Add audio cues for "Correct Answer" (ding) and "Start Listening" (pop).
- [ ] **Loading Skeletons**: Show a shimmer effect on the Magic Card while `teaching` data is loading asynchronously.
- [ ] **Transitions**: Smooth transition between "Generating..." and "Result Shown".

### 2. Gamification (Medium Priority)
- [ ] **Star Rating**: Give 1-3 stars based on pronunciation accuracy (currently binary correct/incorrect).
- [ ] **Confetti Effect**: Trigger a confetti explosion (e.g., `canvas-confetti`) when the user gets a word right.
- [ ] **Streak Counter**: Display "🔥 5 Words in a Row!" to encourage practice.

### 3. User Personalization (High Priority)
- [ ] **History Tab**: A dedicated visual grid of previously learned words (using `localStorage` or Backend).
- [ ] **Theme Toggle**: Light/Dark mode or "Kids Themes" (Jungle, Space, Ocean).
- [ ] **Settings Modal**: Allow adjusting TTS speed and preferred Voice.

### 4. Technical Tasks
- [ ] **Env Variables**: Extract API URL (`http://localhost:3001/api/v1/kids`) to `import.meta.env.VITE_API_URL`.
- [ ] **Type Safety**: Strictly type all API responses in `types.ts` (currently some generic objects).

---

## 💡 Developer Notes
- **MagicCard Data**: The `analysis` and `teaching` props might be `undefined` initially because the backend generates them in the background. React gracefully to this with fallback UI.
- **Microphone**: Web Speech API requires HTTPS in production (except localhost). Ensure deployment is secure.
