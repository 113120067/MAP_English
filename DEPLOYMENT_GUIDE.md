# ☁️ Azure 部署指南 (Azure Deployment Guide)

本指南將協助您將 **MAP English** 專案佈署到 Azure 雲端平台。
我們會使用 **Azure Static Web Apps** 託管前端，並使用 **Azure App Service** 託管後端。

---

## 📋 準備工作

1.  **Azure 帳號**：確保您有一個 Azure 帳號 (可使用免費額度)。
2.  **GitHub 帳號**：確保此專案程式碼已上傳到您的 GitHub Repository。

---

## 🚀 第一部分：後端佈署 (Azure App Service)

後端是 Node.js 應用程式，我們使用 Azure App Service (Web Apps) 來執行。

### 步驟 1：建立 App Service
1.  登入 [Azure Portal](https://portal.azure.com)。
2.  搜尋並點選 **"App Services"**。
3.  點擊 **"+ Create"** -> **"Web App"**。
4.  填寫基本資訊：
    *   **Subscription**: 選擇您的訂閱。
    *   **Resource Group**: 建立一個新的 (例如: `rg-map-english`)。
    *   **Name**: 輸入唯一的後端名稱 (例如: `map-core-backend-rick`).
    *   **Publish**: 選擇 `Code`。
    *   **Runtime stack**: 選擇 `Node 20 LTS` (或 Node 18)。
    *   **Operating System**: 選擇 `Linux`。
    *   **Region**: 選擇離您最近的 (例如 `Japan East` 或 `East Asia`)。
    *   **Pricing Plan**: 選擇 `Free F1` (免費) 或 `Basic B1` (付費，效能較好)。
5.  點擊 **"Review + create"**，然後點擊 **"Create"**。

### 步驟 2：設定環境變數 (Environment Variables)
1.  資源建立完成後，進入該 App Service 的頁面。
2.  左側選單找到 **"Settings"** -> **"Environment variables"**。
3.  點擊 **"Add"**，依序新增以下變數 (參考您的 `.env` 檔案)：

    | Name | Value (範例) | 說明 |
    |------|-------------|------|
    | `PORT` | `3001` | 建議設定 |
    | `FIREBASE_SERVICE_ACCOUNT` | `{ "type": "service_account", ... }` | 請將 JSON 內容壓縮成一行字串 |
    | `CLIENT_ID` | `...` | **[NEW]** Azure Immersive Reader Client ID |
    | `CLIENT_SECRET` | `...` | **[NEW]** Azure Immersive Reader Client Secret |
    | `TENANT_ID` | `...` | **[NEW]** Azure Immersive Reader Tenant ID |
    | `SUBDOMAIN` | `...` | **[NEW]** Azure Immersive Reader Subdomain |
    | `GITHUB_TOKEN` | `ghp_xxxxx` | 您的 GitHub Token |
    | `GITHUB_OWNER` | `113120067` | GitHub username |
    | `GITHUB_REPO` | `vocabulary-images` | 儲存圖片的 Repo |
    | `OPENAI_API_KEY` | `sk-xxxxx` | (如果使用 OpenAI) |
    | `AZURE_OPENAI_ENDPOINT` | `...` | (如果使用 Azure OpenAI) |
    | `AZURE_OPENAI_API_KEY` | `...` | (如果使用 Azure OpenAI) |

4.  新增完畢後，記得點擊上方的 **"Apply"**。

### 步驟 3：連結 GitHub 進行自動佈署 (CI/CD)
1.  左側選單找到 **"Deployment"** -> **"Deployment Center"**。
2.  **Source** 選擇 **GitHub**。
3.  登入並授權 GitHub。
4.  設定佈署來源：
    *   **Organization**: 您的 GitHub 帳號。
    *   **Repository**: 選擇本專案 Repo (例如 `MAP_English`)。
    *   **Branch**: 選擇 `main` (或您開發的分支)。
5.  點擊 **"Save"**。
    *   *Azure 會自動在您的 GitHub Repo 中新增一個 `.github/workflows` 檔案，並開始第一次佈署。*

---

## 🌐 第二部分：前端佈署 (Azure Static Web Apps)

前端包含多個獨立應用程式，您需要為**每一個資料夾**分別建立一個 Azure Static Web App。

### 步驟 1：建立 Static Web App (重複此步驟於每個 APP)
1.  在 Azure Portal 搜尋並點選 **"Static Web Apps"**。
2.  點擊 **"+ Create"**。
3.  填寫基本資訊：
    *   **Resource Group**: 選擇剛才建立的 (例如 `rg-map-english`)。
    *   **Name**: 輸入前端名稱 (例如: `app-kids-vocab-rick`)。
    *   **Plan type**: 選擇 `Free`。
    *   **Data center region**: 選擇 `East Asia` (或其他)。
4.  **Deployment details** (連結 GitHub)：
    *   選擇 **"GitHub"** 並登入。
    *   **Organization**: 您的 GitHub 帳號。
    *   **Repository**: 選擇本專案 Repo。
    *   **Branch**: 選擇 `main`。
5.  **Build Details** (這是區分不同 APP 的關鍵)：
    *   **Build Presets**: 選擇 `React`。
    *   **App location**: 依照您要佈署的 APP 填寫路徑：
        *   App Store: `map-appstore`
        *   Immersive Reader: `app-immersive-reader`
        *   Kids Vocab: `app-kids-vocab`
        *   MapWords: `map-words-poc`
    *   **Output location**: `dist`
6.  點擊 **"Review + create"**，然後點擊 **"Create"**。

### 步驟 2：設定前端環境變數
1.  進入該 Static Web App 的 **"Environment variables"**。
2.  針對不同的 APP，設定對應的變數：

#### 對於所有前端 APP (Kids Vocab, Reader, App Store):
| Name | Value | 說明 |
|------|-------|------|
| `VITE_API_URL` | `https://map-core-backend.azurewebsites.net` | 後端 API 網址 |

#### ⭐️ 特別注意：App Store (`map-appstore`)
App Store 需要知道其他 APP 的網址才能正確連結：
| Name | Value | 說明 |
|------|-------|------|
| `VITE_APP_KIDS_VOCAB_URL` | `https://white-sea-xxx.azurestaticapps.net` | Kids Vocab 的網址 |
| `VITE_APP_IMMERSIVE_READER_URL` | `https://proud-hill-xxx.azurestaticapps.net` | Immersive Reader 的網址 |
| `VITE_APP_MAPWORDS_URL` | `https://jolly-river-xxx.azurestaticapps.net` | MapWords 的網址 |

4.  點擊 **"Save"**。
    *   *注意：Static Web Apps 的環境變數變更後，通常需要重新跑一次 GitHub Action (Redeploy) 才會生效。*

---

## ✅ 驗證佈署

1.  等待 GitHub Actions 全部執行完畢 (前端和後端各有一個 Workflow)。
2.  打開 **Azure Static Web App** 提供的 URL (前端網址)。
3.  嘗試產生一個單字卡。
    *   檢查瀏覽器 Console (F12)。
    *   確認 API 請求是發送到 `https://map-core-backend-rick.azurewebsites.net/...` 而不是 `localhost`。
4.  如果圖片成功產生並顯示，恭喜您！佈署成功！🎉

---

## 🛠 常見問題排除

*   **後端連不上 (CORS Error)**：
    *   如果瀏覽器顯示 CORS 錯誤，請到 Azure App Service (後端) -> **Settings** -> **CORS**。
    *   勾選 "Enable Access-Control-Allow-Credentials"。
    *   在 "Allowed Origins" 加入您的前端網址 (Static Web App URL)。
*   **後端休眠 (Cold Start)**：
    *   免費版 (Free Tier) 後端若一段時間沒人用會休眠，第一次呼叫可能會 timeout 或等待 20 秒，這是正常的。
