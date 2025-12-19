# Open Mnemonic Learning Ecosystem (OMLE) - Architecture Draft

## 🎯 願景 (Vision)
打造一個模組化、開源的 AI 語言學習生態系。讓開發者可以專注於開發不同的「學習體驗 (Clients)」，而共用同一套強大的「AI 內容生成引擎 (Backend)」與「資料標準 (Protocol)」。

## 🏗️ 系統架構 (System Architecture)

我們採用 **"Data-Centric" (以資料為中心)** 的微服務架構。所有模組透過 **Firebase Firestore** 進行資料交換，互不強制相依。

```mermaid
graph TD
    subgraph "Backend Area (Content Engine)"
        A[Immersive Viewer] -->|Generates| DB[(Shared Firestore)]
        A -->|Uses| AI[OpenAI / Pollinations / Azure]
        A -->|Manages| Teacher[Teacher Dashboard]
    end

    subgraph "Data Layer (The Bridge)"
        DB -->|Schema: MnemonicData| JSON{JSON Protocol}
        DB -->|Schema: UserProgress| UserDB{User Stats}
    end

    subgraph "Frontend Area (Learning Clients)"
        Client1[MapWords (Map Game)] -->|Reads| DB
        Client1 -->|Writes| UserDB
        
        Client2[Flashcard App] -->|Reads| DB
        Client3[VR/AR Viewer] -->|Reads| DB
    end
```

## 🧩 模組角色定義

### 1. The Generator (生產者)
*   **Repo**: `immersive-viewer-antigrovity`
*   **角色**: 內容工廠 (Content Factory)
*   **職責**:
    *   呼叫 LLM 分析單字 (字根/字首/記憶法)。
    *   呼叫 AI 繪圖生成記憶圖片。
    *   清洗並標準化資料，存入 Firestore `mnemonic_generations`。
    *   提供 API 給外部系統 (可選)。

### 2. The Data Protocol (資料協定)
*   **定義**: 這是整合的核心。任何遵守此 JSON 結構的資料，都可以被所有的 Client 讀取。
*   **關鍵欄位**:
    *   `word` (String): 單字
    *   `imageUrl` (String): AI 生成圖
    *   `teaching` (Object): `{ connection (聯想), visual (畫面) }`
    *   `analysis` (Object): `{ parts (拆解), theme (主題) }`

### 3. The Clients (消費者)
*   **Repo**: `map-words-poc` (本次開發專案)
*   **角色**: 學習介面 (Learning Interface)
*   **職責**:
    *   **只讀取，不生成**：Client 端不負責昂貴的 AI 生成，只負責從 Firestore 拉取已經準備好的內容。
    *   **專注體驗**：專注於 UI/UX、遊戲化 (Gamification) 與互動。

## 🤝 開發者整合指南 (Integration Guide)

想要加入這個生態系的開發者，可以選擇兩種路徑：

### 路徑 A: 開發新的 Client (前端開發者)
*   **目標**: 寫一個 Apple Vision Pro 版的單字卡 APP。
*   **做法**:
    1. Clone 專案範本。
    2. 設定 Firebase Config 連接到共享的 Firestore。
    3. 實作 `Data Protocol` 的 UI 顯示邏輯。
    4. **完成！** 因為資料已經在那裡了，開發者完全不需要煩惱如何接 OpenAI API 或生成圖片。

### 路徑 B: 增強 Generator (後端/AI 開發者)
*   **目標**: 增加「日文」支援，或是換成更強的「Midjourney」繪圖引擎。
*   **做法**:
    1. 修改 `immersive-viewer` 的 AI Service。
    2. 保持輸出格式符合 `Data Protocol`。
    3. **完成！** 所有的 Clients (包含地圖、App) 會自動獲得更高畫質的圖片，完全不需要更新 Code。

## 🚀 下一步行動
1.  **標準化文件**: 撰寫 `SCHEMA.md` 詳細定義資料欄位。
2.  **提取 SDK**: 將 `MnemonicsService` (前端讀取邏輯) 抽離成一個獨立的 npm package 或 shared gist，方便快速整合。
4.  **CLI 工具**: 開發 `omle-cli` 讓開發者快速建立新 App 樣板。

## 🛍️ 應用程式商店 (The App Store Model)

我們將這個生態系採用類似 **App Store** 的去中心化概念。任何開發者都可以開發一個「功能 (Feature)」，並將其上架到我們的 **「學習模組註冊表 (Learning Module Registry)」**。

### 1. 模組定義 (Concept)
每一個「功能」都是一個獨立的 **Module**。它可以是：
*   **Producer App**: 例如「進階日文產生器」、「科學百科生成器」。
*   **Consumer App**: 例如「單字塔防遊戲」、「VR 單字卡檢視器」。

### 2. 上架標準 (Manifest Protocol)
開發者只需在自己的 Repo 中提供一個 `omle.json` 描述檔，即可申請上架：

```json
{
  "id": "com.developer.mapwords",
  "name": "MapWords Adventure",
  "type": "client", // or "generator"
  "icon": "https://...",
  "description": "A map-based vocabulary unlocking game.",
  "permissions": ["read:mnemonic", "write:progress"],
  "entryPoint": "https://map-words-poc.azurestaticapps.net"
}
```

### 3. 用戶體驗 (The Launcher)
*   使用者進入主控台 (Main Dashboard)。
*   就像手機桌面一樣，可以看到已安裝的 App (例如 MapWords)。
*   點擊 App 圖示，透過 SSO (Firebase Auth) 無縫跳轉進入該應用程式。

這種架構允許**無限擴充**，且讓每個專案保持獨立運作，互不干擾。


### 第四道防線：AI 合規機器人 (The AI Compliance Bot)
*   **概念**: 我們可以開發一個 GitHub Action 機器人，專門負責 Code Review。
*   **功能**:
    1.  **結構檢查**: 確認 `omle.json` 欄位是否完整。
    2.  **架構嗅探**: 掃描程式碼，如果發現有人試圖繞過 API 直接連資料庫，立刻在 PR 留言警告。
    3.  **進度追蹤**: 根據開發者的 Commit Logs，自動生成週報給您，讓您知道「這個 App 完成度 80% 了」。

## 🗺️ 未來功能藍圖 (Feature Roadmap)

為了引導開源社群參與，我們將未來的擴充方向分為三個維度：

### 1. 內容引擎增強 (Enhancing Generator)
*   **多語言支援 (Multi-language)**: 目前僅支援英文。未來可增加日文、西班牙文的 Prompt 模板。
*   **風格轉換 (Art Styles)**: 讓使用者選擇 "Pixel Art", "Watercolor", "Cyberpunk" 等不同繪圖風格。
*   **真人發音 (AI Voice)**: 從 Web Speech API 升級為 OpenAI TTS 或 Azure Neural Voice，提供更自然的發音。

### 2. 資料協定擴充 (Data Protocol Expansion)
*   **例句庫 (Sentences)**: 除了單字，增加 `sentence` 與 `dialogue` (對話) 的資料結構。
*   **測驗模式 (Quiz Schema)**: 定義標準的「選擇題」或「填空題」資料格式，讓所有 Client 都能自動產生考卷。

### 3. 多元學習終端 (Diverse Clients)
*   **AR 實境學習 (Unity/WebXR)**: 戴上眼鏡，看到真實世界的「椅子」上浮現單字卡 "Chair"。
*   **地理實境遊 (Geolocation)**: (MapWords 進階版) 結合 GPS，必須走到「咖啡廳」才能解鎖 "Coffee" 單字。
*   **間隔重複記憶 (Spaced Repetition)**: 實作 Anki 演算法的純文字 Client，專注於長期記憶。
