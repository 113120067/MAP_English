# Modular App Strategy: From Monolith to Ecosystem

為了實現「每個功能都是獨立 APP」的願景，並確保未來開發與維護的便利性，我們建議採用 **「前後端分離 (Decoupled Architecture)」** 策略。

## 1. 核心架構變革 (Architectural Shift)

目前 `Immersive Viewer` 是傳統的 **Monolith (單體式)** 架構 (Node.js + Pug 混在一起)。
未來的目標是 **Ecosystem (生態系)** 架構：

| 舊架構 (Legacy) | 新架構 (Future Ecosystem) | 優點 |
| :--- | :--- | :--- |
| **All-in-One** | **Distrubuted Apps** | 單一功能故障不影響整體 |
| Server-Side Rendering (Pug) | Client-Side Rendering (React) | 互動性更強，開發者更熟悉 |
| 部署單一伺服器 | 前端部署到 CDN (Azure SWA) | 速度快，成本極低 (前端免費) |
| 開發者需懂整包 Code | 開發者只需懂自己的 App | 降低開源門檻 |

## 2. 應用程式拆分藍圖 (App Separation Roadmap)

我們將 `Immersive Viewer` 轉型為純粹的 **"API Core"**，並將畫面拆出來變成獨立專案。

### 🏭 Core Backend (原 Immersive Viewer)
*   **角色**: 僅提供 API，不再回傳 HTML。
*   **新職責**:
    *   `POST /api/generate/mnemonic`: 產生記憶法
    *   `POST /api/generate/image`: 產生圖片
    *   `GET /api/progress`: 讀取進度
*   **部署**: Azure App Service / Container Apps

### 📱 Independent Apps (新 React 專案)

| App 名稱 | 來源功能 | 技術堆疊 | 部署目標 |
| :--- | :--- | :--- | :--- |
| **Kids Vocab Creator** | `/kids-vocabulary` | React + Vite | Azure Static Web App |
| **Mnemonic Factory** | `/mnemonic` | React + Vite | Azure Static Web App |
| **Vision Lens** | `/vision-analyzer` | React + Vite | Azure Static Web App |
| **Classroom Admin** | `/classroom` | React + Vite | Azure Static Web App |

## 3. 開發者體驗 (Developer Experience)

為了讓未來開發者方便，我們將提供標準的 **"App Starter Kit"**：

1.  **Clone Template**: `npm create map-app-starter`
2.  **Config**: 設定 `.env` 指向 Core Backend URL。
3.  **Develop**: 專注寫 React UI，完全不用管後端 AI 怎麼接。
4.  **Publish**: 在 `map-appstore` 提交 Pull Request 上架。

## 4. Azure 部署策略 (Deployment Strategy)

這種架構在 Azure 上最省錢且好管理：

*   **所有的 App (前端)**: 全部部署到 **Azure Static Web Apps** (支援免費層)。
    *   *優勢*: GitHub Push 自動部署，自動 SSL，全球 CDN。
*   **Core Backend**: 部署到 **Azure App Service (B1/B2)** 或 **Container Apps**。
    *   *優勢*: 集中管理 API Key，便於監控用量。

## 5. 實作步驟 (Action Plan)

建議先挑選 **"Kids Vocabulary Generator"** 作為第一個示範拆分的對象：

1.  **Backend Refactor**: 在 Immersive Viewer 新增 `/api/kids/generate` 路由 (回傳 JSON 而不是 render view)。
2.  **Frontend Create**: 建立新 Repo `app-kids-vocab` (React)。
3.  **Integration**: 前端呼叫後端 API。
4.  **Deploy & Register**: 部署後將網址註冊到 App Store。

這樣您就擁有了一個「真正獨立」的 App，且隨時可以「下架」或「更新」它，完全不影響其他功能。
