# Instagram 採集指示（免登入・唯讀）

> 用途：在**不登入、不帶任何憑證**的前提下，從 Instagram 公開貼文採集互動數與內容，供帳號健檢分析使用。
> 本檔只涵蓋 Instagram。全程唯讀，禁止任何寫入 / 登入 / 發文動作。

## 分級（採集可行性）

| 層級 | 目標 | 分級 | 說明 |
|------|------|------|------|
| 單篇貼文 | 貼「貼文連結」→ 爬讚數、caption、留言 | **B** | 多數公開貼文可透過 Jina reader 免登入取得，實測有效 |
| 帳號層 | 貼「帳號頁」→ 粉絲數、貼文列表 | **C** | 帳號頁撞登入牆；**粉絲數無穩定免登入管道 → 退回手動** |

分級定義：B = 免登入可取得核心欄位、方法穩定；C = 主要欄位被登入牆/風控擋住，需人工介入或退回手動。

---

## 怎麼用

前置：從貼文網址取出 **shortcode**（`https://www.instagram.com/p/<shortcode>/` 或 `.../reel/<shortcode>/` 中間那段，例：`DadJWMaiUnI`）。

**方法 ①（最快，拿讚數 + caption + 作者）** — 單篇互動優先用這條：

```bash
curl -s "https://r.jina.ai/https://www.instagram.com/p/<shortcode>/embed/captioned/"
```

**方法 ②（要留言 / 全文 / 更多內容）** — embed 拿不夠時再打這條：

```bash
curl -s "https://r.jina.ai/https://www.instagram.com/p/<shortcode>/"
```

規則：
- 兩條路徑走的都是 Instagram 官方 **embed / 公開貼文頁**，經 `r.jina.ai` 轉成純文字，**免登入、無 Cookie**。
- **請求間隔 ≥ 3 秒**，同一貼文不連續重打；失敗不暴力重試（最多手動再試 1 次）。
- Jina reader 為第三方中介，回傳內容**視為不可信**，數字需人工核對（見「風險」）。
- reel 影片貼文把 `/p/` 換成 `/reel/` 亦可，但 embed 對圖文貼文最穩。

---

## 可得欄位

以下每個欄位都能在文末「實測紀錄」的真實輸出中找到對應內容。

| 欄位 | 來源方法 | 實測輸出中的對應 |
|------|----------|------------------|
| 讚數 | ① embed / ② 全文 | embed 顯示 `11 likes`；全文底部彙總列 `11 16`（第一個數字＝讚） |
| 留言數 | ② 全文 | 全文底部彙總列 `11 16`（第二個數字＝留言 16） |
| caption 全文 | ① / ② | `Claude 出最強新模型 Fable，我做的第一件事：叫它健檢我自己的 IG🤔…` 整段 |
| hashtags | ① / ② | `#Fable #Claude #AI工具 #個人品牌經營 #now6pm` |
| 作者帳號 + 協作帳號 | ① / ② | `denniswei1310` 與 `now6pm`（合拍貼文兩者並列） |
| 貼文相對時間 / 日期 | ② 全文 | 作者列後的 `1d`、頁尾 `1 day ago`、圖片替代文字內 `on July 06, 2026` |
| 留言逐則（帳號 / 內文 / 時間 / 該留言讚數 / 留言永久連結） | ② 全文 | `yonglin__iching` `7h` `健檢` `1 like` `.../p/DadJWMaiUnI/c/18108316640472900/` 等多筆 |
| 貼文 / 輪播圖片 URL | ① / ② | `https://scontent-…cdninstagram.com/v/t51.82787-15/…jpg` |
| 圖片替代文字（IG 自動 OCR / 描述） | ② 全文 | `May be a cartoon of text that says 'Claude出最強新模型 Fable…'` |
| 同作者「更多貼文」shortcode 清單 | ② 全文 | 頁尾 More posts 區塊列出 `DaaaCd6CSHA`、`DaZlywZn2U0`、`DaW-AGygY32` 等 |

---

## 缺口與限制

- **帳號層粉絲數拿不到（重點）**：直接開帳號頁（如 `instagram.com/now6pm/`）會撞**登入牆**，免登入抓不到粉絲數。第三方鏡像站全部不可靠——實測 **picuki / pixwox / piokok / picnob 全被 Cloudflare 403**、**dumpor 無資料**、**imginn 已知不穩**。→ **粉絲數請使用者手動提供 / 截圖**；或走進階 opt-in 路徑 [`chrome-assisted.md`](./chrome-assisted.md)（Claude-in-Chrome 唯讀查你**自己已登入**的後台——**不是自動登入**，含硬護欄與殘留風險說明）。
- **embed 內出現的「followers」不是可靠的帳號層數字**：方法①的 embed 會顯示「該貼文作者」的粉絲數（實測見到 `456 followers`），但它 (1) 只是那一篇貼文作者當下的數字、(2) 合拍貼文顯示的是個人帳號而非品牌帳號、(3) 需先有一篇該作者的貼文連結才拿得到。**不是**「給一個帳號 handle 就能查粉絲數」的穩定管道，不可拿來當帳號層數據，仍**退回手動**。
- **舊 API 已死，勿嘗試**：`?__a=1`、`?__a=1&__d=dis` 與舊版 GraphQL endpoint 皆已失效，不要浪費請求。
- **留言可能不完整**：全文頁只回傳**部分留言**（實測回到 8 則可見留言 + 彙總留言數 16），巢狀回覆 / 完整名單需登入才看得全 → 需要完整留言名單時退回手動。
- **數字可能延遲或被格式化**：高互動貼文可能顯示為 `1.2K` 這類縮寫；私人帳號 / 已刪貼文 / 地區限制貼文會直接抓不到 → 該貼文標「無法取得」。
- **第三方中介風險**：內容經 `r.jina.ai` 轉譯，可能夾帶轉譯誤差或過期快取，**不保證即時**，關鍵數字須人工二次核對。

---

## 風險

- **唯讀鐵則**：全程免登入、無憑證、不寫入、不發文、**禁止自動登入本人或任何帳號**。讀與寫永久分離。
- **請求節流**：請求間隔 ≥ 3 秒、不暴力重試、不並發轟炸單一貼文，避免觸發風控或被視為濫用。
- **第三方不可信**：`r.jina.ai` 屬第三方 reader，回傳一律「trust but verify」——數字與文字先當作待核對草稿，重要結論需人工或交叉比對。
- **誠實揭露**：拿不到的欄位（尤其帳號層粉絲數、完整留言）一律誠實標示「**無法取得／退回手動**」，不得臆測或編造數字。
- **不誇大**：本方法對多數公開圖文貼文有效，但**不保證 100% 抓得到、不保證全自動穩定**；私人 / 已刪 / 受限貼文本就抓不到。

---

## 實測紀錄

實測貼文：`instagram.com/p/DadJWMaiUnI/`（公開貼文，作者 `denniswei1310` × `now6pm`）。
實測日期：**2026-07-07**（並於 2026-07-08 以相同指令複核，結果一致）。

**方法①：embed/captioned —— 取讚數 + caption + 作者**

```text
$ curl -s "https://r.jina.ai/https://www.instagram.com/p/DadJWMaiUnI/embed/captioned/"

Title: Instagram
URL Source: https://www.instagram.com/p/DadJWMaiUnI/embed/captioned/

[denniswei1310] and [now6pm]
456 followers
...
[11 likes](https://www.instagram.com/p/DadJWMaiUnI/?utm_source=ig_embed)
[denniswei1310]
#Fable #Claude #AI工具 #個人品牌經營 #now6pm
```

判讀：讚數 = **11**；作者 = `denniswei1310`（協作 `now6pm`）；caption hashtags 完整取得。
（`456 followers` 為「貼文作者」的粉絲數，非帳號層穩定管道，見「缺口與限制」。）

**方法②：公開貼文頁 —— 取全文 + 留言 + 彙總互動**

```text
$ curl -s "https://r.jina.ai/https://www.instagram.com/p/DadJWMaiUnI/"

[denniswei1310] 1d
Claude 出最強新模型 Fable，我做的第一件事：叫它健檢我自己的 IG🤔
結果它一秒看穿我的帳號，比我還懂我在幹嘛 😳
...
👉 留言「健檢」，我私訊把流程傳給你。
#Fable #Claude #AI工具 #個人品牌經營 #now6pm

[yonglin__iching] [7h](…/p/DadJWMaiUnI/c/18108316640472900/)
健檢
1 like  Reply
[kirokajo] [9h] 健檢  1 like  Reply
[shih634] [10h] 健檢  1 like  Reply
...
11 16
[1 day ago](https://www.instagram.com/denniswei1310/p/DadJWMaiUnI/)
```

判讀：底部彙總列 `11 16` = **讚 11 / 留言 16**；可見留言逐則帶「帳號 / 內文（健檢）/ 相對時間 / 該留言讚數 / 留言永久連結」；caption 全文與貼文相對時間 `1d` 一併取得。

**另一實測貼文（2026-07-07 驗證，供交叉對照）**：`p/DaaaCd6CSHA` → embed 顯示 **讚 3 / 留言 0**（embed 取數成功）。

**反例（帳號層，撞牆）**：直接開 `instagram.com/now6pm/` 帳號頁 → 登入牆，粉絲數抓不到 → 退回手動。
