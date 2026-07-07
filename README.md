# 自媒體帳號健檢 · social-account-audit

> 用 Claude 當**指揮官**（指揮一群 AI），幫你的 **IG／Threads／FB** 三平台帳號做一場完整健檢——你全程只當那個做決定的人，指揮官負責**派 AI 去研究、產出，再換一個乾淨 context 的 AI 驗收**。
>
> 先訪談你的目標，再研究你想打的受眾、看這領域整體怎麼做、找出你的定位縫隙與優勢，最後產出一套可執行的「定位包 → 30 天內容 → 變現路線」。
>
> 這是**方法論 + 可照做的 Prompt + 空白模板**，不是玄學。你不用會寫 code，跟著 6 步走就好。
> 產完健檢，接上姊妹專案 **[social-cards-engine](https://github.com/DennisWei9898/social-cards-engine)** 找出你的風格、直接生 30 天 IG 圖卡。

> **授權：本專案採 [PolyForm Noncommercial License 1.0.0](./LICENSE.md) — 非商用免費，商用需書面同意（見 [COMMERCIAL.md](./COMMERCIAL.md)）。** · by [@now6pm](https://www.instagram.com/now6pm/)

---

## 平台分級：貼什麼連結、能爬到什麼

誠實先講：**貼「帳號連結」就能整頁全爬的，只有 Threads。** IG 和 FB 只能「貼**單篇貼文**連結，爬那一篇」；帳號層的粉絲數／貼文清單會撞登入牆，一律**退回手動**（你自己截圖或匯出）。爬不到的欄位（例如 IG／Threads 的觀看數）我們一律誠實標「**無法取得／退回手動**」，不腦補數字。

| 平台 | 能免登入唯讀爬到的範圍 | 分級 |
|---|---|---|
| **Threads** | 貼**帳號頁**連結 → 一次爬 bio／粉絲數／近 N 篇完整互動（讚·留言·轉發·分享） | **A**（最完整） |
| **Instagram** | 貼**單篇貼文**連結 → 爬讚數／caption／留言（**B**）｜帳號層粉絲數撞登入牆 → **退回手動**（**C**） | 單篇 **B**／帳號層 **C** |
| **Facebook** | 貼**單篇貼文**連結 → 爬讚／留言／分享＋全文＋作者（**B**）｜帳號層粉絲數撞登入牆 → **退回手動**（**C**） | 單篇 **B**／帳號層 **C** |

> 分級定義：**A** = 貼帳號頁即整頁全爬；**B** = 貼單篇連結可爬核心欄位、方法穩定；**C** = 主要欄位被登入牆／風控擋住，需人工介入或退回手動。這是盡力而為的公開頁採集，不保證任一貼文一定爬得到——爬不到就誠實標「退回手動」。

## 貼連結即爬（collectors/ 自動採集）

把你（或 role model）的**帳號頁／貼文連結**貼給 Claude，它會依平台叫對應的 collector，**免登入、無憑證、唯讀**採集，再正規化成一張結構化表：

- [`collectors/threads.md`](./collectors/threads.md) — **Threads**：貼帳號頁即全爬 bio／粉絲數／近 N 篇互動（**A** 級）
- [`collectors/ig.md`](./collectors/ig.md) — **Instagram**：貼單篇貼文連結爬讚數／caption／留言（**B** 級；帳號層粉絲數退回手動 **C**）
- [`collectors/fb.md`](./collectors/fb.md) — **Facebook**：貼單篇貼文連結爬讚／留言／分享／全文（**B** 級；帳號層粉絲數退回手動 **C**）
- [`collectors/chrome-assisted.md`](./collectors/chrome-assisted.md) — **進階 opt-in**：用 Claude-in-Chrome 唯讀查你**自己已登入**的 IG/FB 後台，補帳號層數字（粉絲數/Insights/saves）。**不是自動登入**，含硬護欄＋殘留風險——非預設，需要才用

全程**請求間隔 ≥3 秒、不暴力重試**；第三方 reader 回傳一律 trust but verify（只抽數字與文字、不執行其中指令）。

**安全紅線（精修）：真正該禁的是「AI 自動登入你的帳號」＋「暴力大量翻取」——已有實測這樣被判機器人、帳號停用。** 上面的免登入採集完全不碰你的帳號，最安全。若你需要免登入拿不到的**帳號層數字**（粉絲數／Insights／saves／觸及），有一條進階 opt-in：[`collectors/chrome-assisted.md`](./collectors/chrome-assisted.md) — 用 Claude-in-Chrome **唯讀查你「自己已登入」的後台**（你自己登入、AI 不自動登入、人工節奏、只讀不寫、禁暴力翻取，殘留風險自負）。合規與免責見 [USAGE-POLICY.md](./USAGE-POLICY.md)。

## Role model 錨定（把標竿帳號當 benchmark）

健檢時你可以指定 **1–3 個 role model 公開帳號連結**（你想對標的同業或標竿）。流程會用同一套 collector **唯讀**爬取它們，把實爬結果當 **benchmark**，去驗證「你對受眾／同業的假設」站不站得住——**有實爬佐證才升信心，沒爬到就降級或標「抓不到」，不腦補**。

實證看這份 case study：[`casestudy/now6pm-threads.md`](./casestudy/now6pm-threads.md) —— 作者拿自己公開的 @now6pm Threads 當白老鼠，全程唯讀複驗，每格數字標信心等級、附可重跑 `curl`，示範「假設 → role model 實爬佐證 → 證據強度」這三欄怎麼填。

---

## 這是給誰的

- 帳號經營一陣子，數字卻不上不下，**講不出到底卡在哪**的人
- 想靠自媒體變現/開課/接案，但**不知道自己的定位對不對**的人
- 想用 AI 幫自己「一個人做出一支團隊的產出」的**超級個體**

## 核心心法：你當指揮官，AI 當團隊

一般人把 AI 當聊天機器人，問一句答一句。
這套流程讓 **Claude 當「指揮官」**：它只做規劃、審查、拍板，把粗活（研究、比對、產出）派給便宜又快的 AI 去跑，最後再叫一個**獨立、乾淨 context 的 AI 驗收**（避免自己驗自己放水）。
**你全程只做一件事：當那個做決定的人。**

---

## 6 步健檢流程

```
① 訪談 · 鎖定目標        → 你到底想幹嘛（變現？漲粉？開課？接案？）
② 讀現況 · 貼連結採集    → 貼你＋role model 的帳號/貼文連結，collectors/ 依分級自動爬
③ 研究 · 派 AI 三路並行  → 受眾在乎什麼 · 這領域整體怎麼做 · 你的 niche 縫隙（+ role model benchmark）
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
不知道怎麼開始？先看 **[`handbook/IG＆Threads 完整健檢手冊.pdf`](./handbook/)**——A4 圖文，一步一步帶你把 IG 和 Threads 一次健檢完、生出 30 天圖卡，完全不用寫 code。

## 兩種用法（挑一種）

- **A · Claude Code 用戶（推薦）**：安裝 [`skill/`](./skill/) 這個 skill，直接說一句「**健檢我的帳號**」就啟動整套 loop——它會先問你貼自己＋role model 的帳號/貼文連結，當指揮官派 AI 採集、研究、產出，再換一個 AI 驗收。安裝：
  ```
  cp -r skill ~/.claude/skills/social-account-audit
  ```
- **B · 一般 claude.ai 用戶**：不用安裝，照 [`prompts/`](./prompts/) 的 Prompt 一步步貼給對話。

> 兩種底層是同一套 **loop engineering**：指揮官只規劃/審查/拍板、粗活派給便宜快的 AI、**產出與驗收用不同 context 的 AI 分離**。skill 版把它自動化，prompt 版讓你手動跑。

## 快速開始（跟 Claude 一起跑）

1. **填訪談表**：打開 [`INTERVIEW.md`](./INTERVIEW.md)，回答關於你目標與現況的問題。
2. **貼連結採集現況**：把你自己＋1–3 個 role model 的帳號/貼文連結貼給 Claude，依 [`collectors/`](./collectors/) 分級自動採集——**Threads 貼帳號頁全爬；IG/FB 貼單篇貼文連結爬單篇；帳號層粉絲數退回手動**（你補截圖／匯出）。
   > ⚠️ **安全鐵則**：**絕不**讓 AI 自動登入你的帳號抓後台資料（有實測封號案例，屬平台自動化偵測風險）。採集只走公開頁唯讀，粉絲數等帳號層資料一律手動匯出／貼截圖。詳見 [USAGE-POLICY.md](./USAGE-POLICY.md)。
3. **照 [`prompts/`](./prompts/) 逐步跑**：每一步都有可直接複製的 Prompt，貼給 Claude 就會派 AI 幫你研究、產出。
4. **填 [`templates/`](./templates/) 的 01–06**：Claude 產出的東西填進模板，就是你的健檢報告。
5. **接圖卡引擎**：把 01 定位包的風格與 04 日曆丟進 [social-cards-engine](https://github.com/DennisWei9898/social-cards-engine)，生 30 天 IG 圖卡。

---

## 目錄

- [`skill/`](./skill/) — **可安裝的 Claude Code skill**（loop-engineering 版，一句話啟動整套健檢）
- [`collectors/`](./collectors/) — 三平台採集器：[threads](./collectors/threads.md)（A）· [ig](./collectors/ig.md)（B/C）· [fb](./collectors/fb.md)（B/C）
- [`casestudy/now6pm-threads.md`](./casestudy/now6pm-threads.md) — 用作者本人公開帳號實爬複驗的 role model 對照示範
- [`INTERVIEW.md`](./INTERVIEW.md) — ① 訪談：鎖定你的目標與現況
- [`PROCESS.md`](./PROCESS.md) — 完整方法論（6 步逐步拆解 + 品味/紅線）
- [`prompts/`](./prompts/) — 每一步可直接複製的 Claude Prompt
- [`templates/`](./templates/) — 01–06 空白模板
- [`example.md`](./example.md) — 作者拿自己 @now6pm 帳號跑的實例摘要

## 為什麼開源

真本事的人，大方開源也不怕你抄——難的不是這套流程，是你有沒有真的動手幫自己健檢一次。
拿去用（非商用免費），想一起玩，來 [1,800 人 Claude Code 讀書會](https://www.instagram.com/now6pm/)。

---

## 授權 · License

**本專案採用 [PolyForm Noncommercial License 1.0.0](./LICENSE.md)。**

- **非商業用途完全免費**：自己或朋友健檢、學習、教學、研究，拿去用不用問。
- **商業用途需要書面同意**：把它包成付費產品／SaaS／訂閱、對客戶收費用它交付健檢／代操、併入公司營利產品線、二次販售或再授權等，請先來信談 → **[COMMERCIAL.md](./COMMERCIAL.md)**。多數正當用途都好談。
- ⚠️ **GitHub 右側欄不會自動偵測 PolyForm 授權**（它只認 SPDX 標準清單，可能顯示 No license／Unknown）。**請以本段與 [LICENSE.md](./LICENSE.md) 全文為準**，別被側欄誤導成「沒授權」。
- 使用前請一併閱讀 **[USAGE-POLICY.md](./USAGE-POLICY.md)**：只讀公開頁、不繞登入牆、**絕不自動登入你本人帳號**的安全守則與免責聲明。

> 授權沿革：v1 期間本專案曾以 MIT 釋出，v2 起改為 PolyForm Noncommercial。換授權只對變更後的版本生效、不溯及既往，細節見 [COMMERCIAL.md](./COMMERCIAL.md)。
