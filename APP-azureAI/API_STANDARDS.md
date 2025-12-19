# OMLE API Standards: API_STANDARDS.md

Version: 1.0.0  
Last Updated: 2025-12-18

This document outlines the standard API interaction patterns for the **Open Mnemonic Learning Ecosystem (OMLE)**.

---

## 1. Authentication & Security
- **Backend API**: All sensitive operations and data fetching must go through the **Core Backend API**.
- **Client Access**: 
    - Clients **should not** connect directly to Firestore via the Web SDK for data fetching.
    - All requests (Read/Write) must be proxied through the Backend to ensure centralized logging, validation, and AI triggering.
    - **Identity**: For the initial phase, use **Firebase Anonymous Authentication** to track progress without requiring email/password.

---

## 2. Core Endpoints (Generator)

### POST `/api/generate/mnemonic`
Triggers the LLM to generate etymological analysis and mnemonic story.
- **Payload**: `{ "word": "string" }`
- **Behavior**: Returns 201 Created and saves data to Firestore. If existing, returns cached data.

### POST `/api/generate/image`
Triggers image generation and optional GitHub upload.
- **Payload**: `{ "word": "string", "provider": "string (optional)" }`
- **Behavior**: Uploads to GitHub with timestamped filename and updates Firestore.

---

## 3. Client Interaction Pattern (The Decoupled Way)

Clients should follow this flow for a premium experience:

1.  **Check Cache (Firestore)**: Use `db.collection('mnemonic_generations').where('word', '==', word)` to find existing data.
2.  **Display UI**: If data exists, render immediately using [SCHEMA.md](SCHEMA.md).
3.  **Trigger Fallback**: If no data exists:
    - Call Core Backend `/api/generate/mnemonic`.
    - Show a "Generating..." loading state.
    - Listen for the Firestore document update to refresh the UI automatically.

---

## 4. Error Handling Standards
- **429 Too Many Requests**: Clients must implement exponential backoff.
- **503 Service Unavailable**: Generator is down; Clients should offer offline placeholders if available.
