# OMLE App Store Protocol: APP_STORE_PROTOCOL.md

Version: 1.0.0  
Last Updated: 2025-12-18

This document defines how individual Apps (Client or Generator) are registered and launched within the **OMLE Launcher (App Store)**.

---

## 1. The Manifest: `omle.json`
Every OMLE-compliant app must include an `omle.json` in its root or provide it during registration.

```json
{
  "id": "com.yourname.appname",
  "version": "1.0.0",
  "name": "App Display Name",
  "description": "Short description of the app functionality.",
  "type": "consumer | producer | utility",
  "entryPoint": "https://your-app-url.azurestaticapps.net",
  "icon": "https://path-to-icon.png",
  "permissions": [
    "read:mnemonic",
    "write:progress",
    "cloud:generation"
  ],
  "author": "Developer Name"
}
```

---

## 2. Registration Process (Federated)
1.  **Develop**: Build your app according to [SCHEMA.md](SCHEMA.md) and [API_STANDARDS.md](API_STANDARDS.md).
2.  **Submit**: Open a Pull Request to the `map-appstore` repository, adding your `omle.json` to the `registry/` directory.
3.  **Validate**: Automated GitHub Actions will verify your manifest and technical compliance.
4.  **Publish**: Once merged, your app appears on the **Main Launcher Dashboard**.

---

## 3. SSO & Identity Transfer
To ensure a "Seamless Transition" from the App Store to a specific App:
- The Launcher passes a secure session token or relies on **Firebase Auth Persistence** across subdomains (e.g., `app1.omle.com`, `app2.omle.com`).
- Clients should initialize Firebase with the shared project config to automatically inherit the user session.
