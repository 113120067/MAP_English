# OMLE Data Protocol: SCHEMA.md

Version: 1.0.0  
Last Updated: 2025-12-18

This document defines the formal data structures for the **Open Mnemonic Learning Ecosystem (OMLE)**. All Generator (Backend) and Client (Frontend) implementations must adhere to these schemas to ensure compatibility.

---

## 1. Story (教材故事)
Core entity representing a learning unit composed of bilingual text passages.

**Firestore Collection**: `stories`

```json
{
  "id": "string (unique identifier)",
  "title": {
    "en": "string (English title)",
    "zh": "string (Traditional Chinese title)"
  },
  "level": "string (easy | medium | hard)",
  "content": [
    {
      "order": "number (sequential index)",
      "en": "string (Original sentence)",
      "zh": "string (Translated sentence)"
    }
  ],
  "author": "string (optional)",
  "createdAt": "ISO8601 Timestamp"
}
```

---

## 2. Vocabulary (詞彙與記憶法)
Represents a specific word with its etymological analysis, mnemonic associations, and media.

**Firestore Collection**: `mnemonic_generations` (or `vocabulary`)

```json
{
  "word": "string (canonical word)",
  "phonetic": "string (KK phonetics, e.g., [kæt])",
  "pos": "string (part of speech: noun, verb, adj, etc.)",
  "translation": "string (primary translation)",
  "example": {
    "en": "string (English example sentence)",
    "zh": "string (Chinese translation)"
  },
  "analysis": {
    "parts": "array of strings (prefix/root/suffix)",
    "theme": "string (conceptual category)"
  },
  "teaching": {
    "connection": "string (The mnemonic story/association)",
    "visual": "string (The visual description used for generation)"
  },
  "imageUrl": "string (Direct URL to GitHub/Azure/DALL-E image)",
  "audioUrl": "string (URL to Azure Speech generated audio, optional)",
  "status": "string (planned | painted | uploaded)",
  "timestamp": "ISO8601 Timestamp"
}
```

---

## 3. Challenge (語言挑戰)
Interactive quiz or task associated with a story or vocabulary set.

**Firestore Collection**: `challenges`

```json
{
  "id": "string (unique identifier)",
  "storyId": "string (reference to story.id)",
  "type": "string (multiple_choice | translation | listening | speaking)",
  "level": "number (1, 2, or 3)",
  "question": "string (The prompt/question text)",
  "options": [
    {
      "id": "string (e.g., A, B, C)",
      "text": "string (Option content)"
    }
  ],
  "answer": "string (Correct option ID or full text)",
  "imageUrl": "string (Optional image for visual challenge)",
  "audioUrl": "string (Required for listening challenge)"
}
```

---

## 4. User Progress (學習歷程)
Shared state documenting user accomplishments across different OMLE clients.

**Firestore Collection**: `user_progress`

```json
{
  "uid": "string (Firebase Auth ID)",
  "completedStories": ["array of story IDs"],
  "masteredVocabulary": ["array of words"],
  "stats": {
    "totalStars": "number",
    "badges": ["array of badge IDs"],
    "lastActive": "ISO8601 Timestamp"
  }
}
```
