# 自媒體帳號健檢 · social-account-audit

> 用 Claude（當指揮官，指揮一群 AI）幫你的社群帳號做一場**完整健檢**——先訪談你的目標，再研究你想打的受眾、看這個領域整體怎麼做、找出你的定位縫隙與優勢，最後產出一套可執行的「定位包 → 30 天內容 → 變現路線」。
>
> 這是**方法論 + 可照做的 Prompt + 空白模板**，不是玄學。你不用會寫 code，跟著 6 步走就好。
> 產完健檢，接上姊妹專案 **[social-cards-engine](https://github.com/DennisWei9898/social-cards-engine)** 找出你的風格、直接生 30 天 IG 圖卡。

MIT License · by [@now6pm](https://www.instagram.com/now6pm/)

---

## 這是給誰的

- 帳號經營一陣子，數字卻不上不下，**講不出到底卡在哪**的人
- 想靠自媒體變現/開課/接案，但**不知道自己的定位對不對**的人
- 想用 AI 幫自己「一個人做出一支團隊的產出」的**超級個體**

## 核心心法：你當指揮官，AI 當團隊

一般人把 AI 當聊天機器人，問一句答一句。
這套流程讓 **Claude 當「指揮官」**：它只做規劃、審查、拍板，把粗活（研究、比對、產出）派給便宜又快的 AI 去跑，最後再叫一個獨立的 AI 驗收。
**你全程只做一件事：當那個做決定的人。**

---

## 6 步健檢流程

```
① 訪談 · 鎖定目標        → 你到底想幹嘛（變現？漲粉？開課？接案？）
② 讀現況 · 帳號體檢      → 你現在的 bio / 內容 / 表現最好與最差的貼文
③ 研究 · 派 AI 三路並行  → 受眾在乎什麼 · 這領域整體怎麼做 · 你的 niche 縫隙
④ 找優勢 · 定位縫隙      → 哪一塊沒人好好佔，剛好是你的強項
⑤ 產出 · 01–06 交付物    → 定位包 / persona / 平台 / 30天日曆 / 變現 / 可重跑流程
⑥ 接圖卡引擎 · 產 30 天  → 用 social-cards-engine 找出風格、生 30 天 IG 圖卡
```

### 產出的 6 份交付物
| # | 交付物 | 是什麼 |
|---|---|---|
| 01 | 定位包 | 一句話定位 + bio（做什麼＋給誰＋單一 CTA）+ 內容支柱 |
| 02 | Personas | 誰願意付費、痛點、付費意願證據 |
| 03 | 平台決策 | 適合你的引流/變現平台選擇與理由 |
| 04 | 30 天內容日曆 | 每天發什麼：平台/格式/hook/CTA/漏斗階段 |
| 05 | 變現時間表 | 0–3–6 個月里程碑（含數字目標，不喊空話） |
| 06 | 可重跑流程 | 把這套健檢沉澱成你自己能重跑的 SOP |

---

## 📖 完全新手看這份：圖文手冊
不知道怎麼開始？先看 **[`handbook/帳號健檢新手手冊.pdf`](./handbook/)**——10 頁 A4 圖文，一步一步帶你從零跑到生出 30 天圖卡，完全不用寫 code。

## 兩種用法（挑一種）

- **A · Claude Code 用戶（推薦）**：安裝 [`skill/`](./skill/) 這個 skill，直接說一句「**健檢我的帳號**」就啟動整套 loop——它會當指揮官派 AI 研究、產出、再換一個 AI 驗收。安裝：
  ```
  cp -r skill ~/.claude/skills/social-account-audit
  ```
- **B · 一般 claude.ai 用戶**：不用安裝，照 [`prompts/`](./prompts/) 的 Prompt 一步步貼給對話。

> 兩種底層是同一套 **loop engineering**：指揮官只規劃/審查/拍板、粗活派給便宜快的 AI、**產出與驗收用不同 context 的 AI 分離**。skill 版把它自動化，prompt 版讓你手動跑。

## 快速開始（跟 Claude 一起跑）

1. **填訪談表**：打開 [`INTERVIEW.md`](./INTERVIEW.md)，回答關於你目標與現況的問題。
2. **匯出你的帳號數據**：用 IG/Threads 內建 Insights 匯出，或截圖近 12 則貼文的主題與互動。
   > ⚠️ **安全鐵則**：**不要**讓 AI 自動登入你的帳號抓資料（有實測封號案例，屬平台自動化偵測風險）。一律手動匯出 / 貼截圖。
3. **照 [`prompts/`](./prompts/) 逐步跑**：每一步都有可直接複製的 Prompt，貼給 Claude 就會派 AI 幫你研究、產出。
4. **填 [`templates/`](./templates/) 的 01–06**：Claude 產出的東西填進模板，就是你的健檢報告。
5. **接圖卡引擎**：把 01 定位包的風格與 04 日曆丟進 [social-cards-engine](https://github.com/DennisWei9898/social-cards-engine)，生 30 天 IG 圖卡。

---

## 目錄

- [`skill/`](./skill/) — **可安裝的 Claude Code skill**（loop-engineering 版，一句話啟動整套健檢）
- [`INTERVIEW.md`](./INTERVIEW.md) — ① 訪談：鎖定你的目標與現況
- [`PROCESS.md`](./PROCESS.md) — 完整方法論（6 步逐步拆解 + 品味/紅線）
- [`prompts/`](./prompts/) — 每一步可直接複製的 Claude Prompt
- [`templates/`](./templates/) — 01–06 空白模板
- [`example.md`](./example.md) — 作者拿自己 @now6pm 帳號跑的實例摘要

## 為什麼開源

真本事的人，大方開源也不怕你抄——難的不是這套流程，是你有沒有真的動手幫自己健檢一次。
拿去用，不用謝我。想一起玩，來 [1,800 人 Claude Code 讀書會](https://www.instagram.com/now6pm/)。

## License
MIT
