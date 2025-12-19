# OMLE Pre-Development Checklist (開發前確認事項)

在正式啟動開發前，請針對以下技術與架構關鍵點進行最後確認。這將確保後續開發流程順暢，並減少架構調整的成本。

---

## ✅ 1. 技術棧與資料傳輸 (Tech Stack & Data Flow)
- [x] **前端**：React + Vite (部署於 Azure Static Web Apps)。
- [x] **後端**：Node.js (Express) or Azure Functions (處理 AI API 封裝)。
- [x] **資料庫**：Firebase Firestore (作為生態系的資料中心)。
- [x] **GitHub 圖片庫**：已修正檔名衝突 Bug，確保唯一性。

---

## ⚡ 2. 核心架構決策 (Architectural Decisions)
請針對以下兩點進行確認：

- **資料存取策略**：
    - [x] **API 封裝存取**：所有資料必須全經 API (已決定)。
    - [ ] ~~SDK 直接存取~~：(不採用)。

- **單一登入 (SSO) 體驗**：
    - [x] **維持匿名登入**：初期使用 Firebase Anonymous Login (已決定)。
    - [ ] ~~完全無縫~~：(未來再議)。

---

## 📄 3. 下一步執行清單 (Execution Roadmap)
- [ ] **環境準備**：完成 Firebase 專案初始化，並提供 Config 給各開發團隊。
- [ ] **API 範本開發**：建立第一個 Backend API 範本（封裝好的 Azure AI 呼叫）。
- [ ] **App 範例實作**：以《小貓和大箱子》為範例，實作第一個從 Firestore 讀取資料的小 App。

---

## 🎯 確認完畢後
一旦您確認上述策略（特別是 **2. 核心架構決策**），我們即可宣告「規劃動筆」階段結束，正式進入「代碼實作」階段。
