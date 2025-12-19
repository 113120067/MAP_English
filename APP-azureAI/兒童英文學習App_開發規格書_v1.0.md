
# 兒童英文學習 App 開發規格書（故事閱讀 + 語言挑戰整合）

**版本**：v1.4 (Added JSON Data Schema)
**日期**：2025-12-18  
**作者**：Antigravity (Refined from M365 Copilot draft)

---

## 1. 產品目標與範圍
本規格書定義一款整合**故事閱讀與雙語顯示**與**語言挑戰任務**的兒童英文學習 App。
- **AI 驅動**：利用 **Azure Translator** 提供雙語翻譯、**Azure Speech** 提供朗讀。
- **素材整合**：結合 **GitHub 圖片庫** 作為教材插圖來源。
- **目標受眾**：6–10 歲兒童。

---

## 2. 系統架構與技術堆疊
- **前端 (Frontend)**：**React + Vite** (部署於 Azure SWA)。
- **後端 (Backend)**：**Node.js (Express)** (封裝 Azure AI API)。
- **資料庫 (Database)**：**Firebase Firestore** (專案 ID: `ai-learning-c8e01`)。
- **AI 服務**：Azure Translator, Azure Speech。

---

## 3. 教材規範與範本 (Content Template)

為了符合兒童學習需求，所有教材需包含故事原文、翻譯、詞彙拆解與挑戰題。

### 📖 範本：故事內容
*   **故事標題**：The Little Cat and the Big Box (小貓和大箱子)

| 序號 | 英文原文 | 中文翻譯 |
| :--- | :--- | :--- |
| 1 | One day, a little cat found a big box. | 有一天，一隻小貓找到了一個大箱子。 |
| 2 | The box was brown and very strong. | 箱子是棕色的，而且非常結實。 |
| 3 | The cat jumped into the box. | 小貓跳進了箱子裡。 |
| 4 | It was dark inside, but the cat was happy. | 裡面很黑，但小貓很開心。 |

### 🔤 詞彙表 (具備 KK 與例句)
| 英文單字 | KK 音標 | 詞性 | 中文意思 | 例句 |
| :--- | :--- | :--- | :--- | :--- |
| **cat** | [kæt] | n. | 貓 | The cat is sleeping. |
| **box** | [bɑks] | n. | 箱子 | I put toys in the box. |
| **jump** | [dʒʌmp] | v. | 跳 | The cat can jump high. |
| **happy** | [ˋhæpɪ] | adj. | 開心的 | She is happy today. |

---

## 4. JSON 資料結構 (Data Schema)

為了確保 Generator (後端) 與 Client (前端) 資料對接無誤，定義以下 JSON 格式。

### 4.1 故事 (Story Object)
```json
{
  "id": "story_001",
  "title": { "en": "The Little Cat and the Big Box", "zh": "小貓和大箱子" },
  "level": "easy",
  "content": [
    { "order": 1, "en": "One day, a little cat found a big box.", "zh": "有一天，一隻小貓找到了一個大箱子。" },
    { "order": 2, "en": "The box was brown and very strong.", "zh": "箱子是棕色的，而且非常結實。" }
  ],
  "createdAt": "2025-12-18T00:00:00Z"
}
```

### 4.2 詞彙 (Vocabulary Object)
```json
{
  "word": "jump",
  "phonetic": "[dʒʌmp]",
  "pos": "verb",
  "translation": "跳",
  "example": { "en": "The cat can jump high.", "zh": "這隻貓可以跳很高。" },
  "mnemonic": {
    "teaching": "想像一個人在 U 字型的坑洞跳出來。",
    "imageUrl": "https://raw.githubusercontent.com/.../jump.jpg"
  }
}
```

### 4.3 挑戰題 (Challenge Object)
```json
{
  "storyId": "story_001",
  "type": "multiple_choice", // multiple_choice, translation, listening
  "level": 1,
  "question": "請選出「箱子」的英文？",
  "options": [
    { "id": "A", "text": "cat" },
    { "id": "B", "text": "box" },
    { "id": "C", "text": "jump" }
  ],
  "answer": "B",
  "imageUrl": "https://raw.githubusercontent.com/.../box.jpg"
}
```

---

## 5. 遊戲化語言挑戰 (Gameplay Mechanics)

### 🎯 任務類型範例
*   **Level 1：單字挑戰** (聽音辨圖 / 字義選擇)
*   **Level 2：短句翻譯** (拼字或選擇)
*   **Level 3：聽力測驗** (Azure Speech 互動)

---

## 6. 💡 加值互動設計 (Value-added Features)
1.  **循序漸進**：每完成一段故事，即解鎖下一段與對應的挑戰題。
2.  **即時回饋**：點擊故事中的單字，立即彈出 **KK 音標 + 語音發音 + 例句輔助**。
3.  **語音評測**：整合 Azure Speech STT，讓孩子練習口說。

---

## 7. 資料模型 (Firestore Collections)
- **`stories`** (依 4.1)
- **`vocabulary`** (依 4.2)
- **`challenges`** (依 4.3)
- **`user_progress`**：`{uid, completedStories: [], badges: [], totalStars: 0}`

