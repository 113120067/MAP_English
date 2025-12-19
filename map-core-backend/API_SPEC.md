# MAP Core Backend API Specification

This document defines the API endpoints for the MAP English Ecosystem.

## Base URL
- Local: `http://localhost:3001/api/v1`
- Production: `https://<azure-app>.azurewebsites.net/api/v1`

## Authentication
Currently, the API is public (open) for checking out POC features.
Future versions will require an `Authorization` header with a Bearer token or API Key.

---

## 1. Kids Vocabulary Generator
### Generate Mnemonic Card
Generates a child-friendly image and mnemonic data for a given word.

- **Endpoint**: `POST /kids/generate`
- **Content-Type**: `application/json`

#### Request Body
```json
{
  "word": "apple"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "word": "apple",
    "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZjr...", // Base64 for immediate display
    "generated_image_url": "https://raw.githubusercontent.com/...", // Permanent URL (async)
    "source": "kids-v2",
    "version": 1
  }
}
```

#### Response (Error - 400/500)
```json
{
  "success": false,
  "error": "Missing word parameter"
}
```
