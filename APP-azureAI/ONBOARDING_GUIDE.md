# OMLE App Onboarding Guide: ONBOARDING_GUIDE.md

Welcome, Developer! This guide will help you build and launch your first app within the **Open Mnemonic Learning Ecosystem (OMLE)** in 4 easy steps.

---

## 🚀 1. Setup Your Environment
Clone the **App Starter Kit** (React + Vite) or start from scratch.
- **Firebase**: Obtain the shared Firebase project configuration from the Admin.
- **Backend URL**: Set your `.env` to point to the **Core Backend (Generator)**.

---

## 🛠️ 2. Build With the Protocol
Ensure your app correctly handles data according to the standards:
- **Data Structure**: Follow [SCHEMA.md](SCHEMA.md) for all vocab and story rendering.
- **Data Access**: **Mandatory API Usage**. Do not fetch data from Firestore directly. Call the Core Backend endpoints for all data needs.
- **Generation Logic**: If a word is missing, call the Core Backend as specified in [API_STANDARDS.md](API_STANDARDS.md).
- **Authentication**: Use the shared Firebase project with **Anonymous Login** enabled to track user progress.

---

## 📦 3. Create Your Manifest
Add an `omle.json` file to your project. This is your "App Store Identity".
- **Permissions**: Clearly state if you need to read mnemonics or write user progress.
- **Type**: Is your app a **Client** (Learning interface) or a **Generator** (Content creator)?

---

## 🌍 4. Launch & Integrate
1.  **Deploy**: Host your app on **Azure Static Web Apps** (free tier).
2.  **Register**: Submit your `omle.json` to the `map-appstore` registry repo via a Pull Request.
3.  **Audit**: Once approved, your app will be accessible via the **Global Launcher**.

---

## 📚 Reference Links
- [Data Schema](SCHEMA.md)
- [API Standards](API_STANDARDS.md)
- [App Store Protocol](APP_STORE_PROTOCOL.md)
- [Mnemonic Spec](兒童英文學習App_開發規格書_v1.0.md)
