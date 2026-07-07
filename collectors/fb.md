# Facebook 免登入唯讀採集指示（collectors/fb.md）

> **一句話**：貼「單篇公開貼文 URL」，可用 `facebook.com/plugins/post.php` 免登入、免 token 爬到讚／留言／分享數 + 貼文全文 + 作者；但帳號層（粉絲數／貼文清單）撞登入牆，退回手動。

## 分級

| 層級 | 能不能免登入採集 | 分級 |
|------|------------------|------|
| **單篇貼文**（有公開貼文連結） | 可爬互動數 + 全文 + 作者（見核心方法） | **B** |
| **帳號層**（帳號頁 / 粉絲數 / 貼文清單 / 追蹤數） | 撞登入牆 → 退回手動 | **C** |

- 本文件所有指令**全程唯讀、免登入、無憑證**。
- 只處理**公開貼文**；不繞過隱私、不抓非公開內容、不自動登入本人帳號。

---

## 核心方法（Post Embed Plugin）

Facebook 的官方貼文嵌入外掛端點 `plugins/post.php` 在 `show_text=true` 下，會把整篇貼文渲染成一段 HTML 回傳，**免登入、免 token**，裡面含互動數（以 `title="讚"` / `title="留言"` / `title="分享"` 標記，數字緊鄰其後）、貼文全文、作者名稱、驗證徽章、媒體型態指示。

```bash
curl -s -G \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15" \
  --data-urlencode "href=<公開貼文URL>" \
  --data-urlencode "show_text=true" \
  "https://www.facebook.com/plugins/post.php"
```

### 怎麼用
1. **必須拿到「單篇貼文 URL」**，形如 `https://www.facebook.com/<page>/posts/<id>/`（貼帳號頁**無效**，見反例①）。
2. 帶上桌面版 Safari `User-Agent`（缺 UA 或用 curl 預設 UA 較易被導向登入牆）。
3. 把回傳 HTML 存檔後解析：
   - 互動數 → 找 `title="讚"` / `title="留言"` / `title="分享"`，**數字緊接在該標記之後**（DOM 順序：`[title="讚"] 數字 [title="留言"] 數字 [title="分享"] 數字`）。
   - 全文 → 貼文正文區塊（含 emoji、換行、內嵌 hashtag 連結）。
   - 屬性多為 HTML entity 編碼（`&#x8b9a;` = 讚），解析前先做 `html.unescape`。
4. **請求間隔 ≥ 3 秒、不暴力重試**。

---

## 可得欄位

以下每個欄位都在 2026-07-07 的實測輸出中找得到對應內容（見文末 code block）：

| 欄位 | 實測對應值（範例貼文） | 來源標記 |
|------|------------------------|----------|
| 作者顯示名稱 | `三立新聞` | `aria-label="三立新聞"` / `title="三立新聞"` |
| 帳號驗證徽章 | `已驗證個人檔案` | `aria-label="已驗證個人檔案"` |
| 貼文全文（含 emoji／換行／內嵌 hashtag） | `▌【 #2026白沙屯媽祖進香 】「三媽同轎」衝進北港朝天宮！…` | 正文區塊 |
| Hashtag 清單 | `#2026白沙屯媽祖進香`、`#后里書僮` | `/hashtag/...` 連結 |
| 心情／讚（reactions）總數 | `3.2 萬` | `title="讚"` 後接數字 |
| 留言數 | `572` | `title="留言"` 後接數字 |
| 分享數 | `1,213` | `title="分享"` 後接數字 |
| 媒體型態指示（照片／影片） | `播放影片`（→ 影片貼文） | `aria-label="播放影片"` |

> 互動數是 Facebook **四捨五入的顯示值**（例：`3.2 萬` 不是精確整數）；留言／分享通常為精確整數（`572` / `1,213`）。reactions 的分項拆解（讚／大心／哈…各多少）**不提供**。

---

## 缺口與限制

誠實揭露，這些**在實測中無法取得或不穩定**：

- **發文時間戳／相對時間 → 本次實測未取得**。此範例（影片貼文）回傳 HTML 內查無 `<abbr>`、`data-utime`、或「X 小時前／X 天前」字串（皆 0 筆）。指揮官版本提到「相對時間」，但本測未出現，可能視貼文型態而定、**尚未驗證**，故列為缺口、不列入可得欄位。
- **原始貼文永久連結（permalink）→ 無法取得**。實測回傳中 `/posts/` 連結、`story_fbid` 皆 0 筆，無穩定 permalink 可回抓。
- **連結預覽（外部連結卡）→ 本測未取得**。此篇為影片貼文，無 `l.facebook.com` link-shim；連結型貼文是否回預覽，**未在本測驗證**。
- **精確互動數 → 無法取得**。reactions 為四捨五入顯示（`3.2 萬`）。
- **帳號層（C 級）→ 撞登入牆，退回手動**。帳號頁粉絲數、追蹤數、貼文清單無法免登入取得。**具體退回手動做法**：請帳號主自己登入 FB／Meta Business Suite，把粉絲數、專頁洞察報告（Insights）**匯出或截圖**再貼進來——絕不代替登入本人帳號自動抓（見「風險」）。
- **oEmbed（`graph.facebook.com/.../oembed_post`）→ 無數據價值**。2026-06 起雖免 token，但只回**嵌入殼 HTML**（iframe / script），**不含**讚／留言／分享數。
- **m.facebook.com / mbasic.facebook.com / RSS → 全死**。實測 mbasic 已導向現代 FB 殼並撞登入牆（見反例②）。
- **需要「單篇貼文 URL」**：貼帳號頁無效（見反例①）。
- **非每篇都行**：貼文關閉嵌入／隱私設定不公開／已刪除 → 回錯誤訊息（見反例①同一段文案），**退回手動**。

> ⚠️ 不保證任一特定貼文一定爬得到；能否取得取決於該貼文是否公開且允許嵌入。爬不到的欄位一律標「無法取得／退回手動」。

---

## 風險

- **唯讀鐵則**：全程唯讀、免登入、無憑證；**禁自動登入本人帳號**（避免觸發帳號風控）。
- **速率**：請求間隔 **≥ 3 秒**、不暴力重試；`plugin` 端點雖公開，高頻同 IP 仍可能被限流或導向登入牆。
- **DOM 依賴脆弱**：解析仰賴 `title="讚/留言/分享"` 與 icon class；Facebook 隨時可能改版使 selector 失效 → 需容錯 + 人工複核數字。
- **資料時效**：回傳為快取顯示值，可能與即時互動數略有落差，且經四捨五入。
- **合法與隱私**：僅存取公開貼文之公開互動數，不繞過隱私、不抓非公開內容；遵守平台條款與當地法規。
- **Lethal Trifecta**：本流程只讀公開資料、不接私人資料、不外送第三方 → 保持三者不同框，勿與私密資料 / 外部通訊管線串接。

---

## 單篇範例輸出（實測）

**實測日期：2026-07-07** ｜ 全程唯讀、免登入、無 token ｜ 範例貼文：`https://www.facebook.com/setnews/posts/1559046246265009/`

```bash
# ── 核心方法：單篇公開貼文（成功）────────────────────────────
curl -s -G \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15" \
  --data-urlencode "href=https://www.facebook.com/setnews/posts/1559046246265009/" \
  --data-urlencode "show_text=true" \
  "https://www.facebook.com/plugins/post.php"
# → HTTP 200，173,767 bytes

# 解析後（屬性經 html.unescape 解碼）真實回傳摘錄：
#   作者     ：三立新聞                 [aria-label="三立新聞" / title="三立新聞"]
#   驗證徽章 ：已驗證個人檔案           [aria-label="已驗證個人檔案"]
#   媒體型態 ：播放影片（→ 影片貼文）   [aria-label="播放影片"]
#   全文     ：▌【 #2026白沙屯媽祖進香 】「三媽同轎」衝進北港朝天宮！超震撼畫面曝光
#             46萬香燈腳齊喊「進喔」送媽祖進廟 完整過程一次看！ #后里書僮 ：畫面真的好震撼
#   Hashtag  ：#2026白沙屯媽祖進香、#后里書僮
#
#   互動列（DOM 內 title 與數字交錯排列，原文即此順序）：
#     [title="讚"] | 3.2 萬 | [title="留言"] | 572 | [title="分享"] | 1,213
#     → 讚(reactions)=3.2 萬   留言=572   分享=1,213

# ── 反例①：把「帳號頁 URL」丟進 plugin（非單篇貼文）→ 失敗 ──
curl -s -G \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15" \
  --data-urlencode "href=https://www.facebook.com/setnews/" \
  --data-urlencode "show_text=true" \
  "https://www.facebook.com/plugins/post.php"
# → HTTP 200，但正文為錯誤訊息：
#   「這則 Facebook 貼文已無法取得使用。很有可能貼文已被移除，或是貼文的隱私設定已更改。」
#   （關閉嵌入 / 隱私不公開 / 已刪除的貼文同樣回這段 → 對應「非每篇都行」）

# ── 反例②：mbasic 已死（撞登入牆）────────────────────────
curl -s -L \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15" \
  "https://mbasic.facebook.com/setnews/posts/1559046246265009/"
# → HTTP 200，386,570 bytes，但回傳為現代 FB 殼（含 "login"/"登入"），
#   貼文正文（"白沙屯"）不存在 → 無法取得，退回手動。
```

> 說明：以上三段 curl 皆為 2026-07-07 實際執行。①成功取得互動數與全文；②③為誠實記錄的失敗反例，佐證「需單篇貼文 URL」「非每篇都行」「m/mbasic 全死」等限制。
