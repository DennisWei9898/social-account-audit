// newbie-handbook 渲染器：HTML → A4 PDF（含向量文字、可點連結）+ 逐頁 QA 截圖
// 用法：  node render.mjs [input.html] [output.pdf]
// 預設：  input=index.html  output="<input 檔名>.pdf"
// QA 截圖：輸出 qa-page-NN.png（供逐頁肉眼校稿；交付前請自行刪除）
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const input = process.argv[2] || 'index.html';
const output = process.argv[3] || input.replace(/\.html?$/i, '') + '.pdf';

const inPath = path.resolve(input);
if (!fs.existsSync(inPath)) { console.error('找不到輸入檔:', inPath); process.exit(1); }

// 解析 playwright：先試本地，失敗再抓 global（npm root -g）
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  const groot = execSync('npm root -g').toString().trim();
  const mod = await import(pathToFileURL(path.join(groot, 'playwright', 'index.js')).href);
  chromium = mod.chromium ?? mod.default?.chromium;
}
if (!chromium) { console.error('無法載入 playwright，請先安裝：npm i -g playwright && npx playwright install chromium'); process.exit(1); }

const outDir = path.dirname(path.resolve(output));
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto(pathToFileURL(inPath).href, { waitUntil: 'networkidle' });

await page.pdf({ path: path.resolve(output), format: 'A4', printBackground: true, preferCSSPageSize: true });
console.log('✓ PDF:', path.resolve(output));

const sections = await page.$$('.page');
for (let i = 0; i < sections.length; i++) {
  await sections[i].screenshot({ path: path.join(outDir, `qa-page-${String(i + 1).padStart(2, '0')}.png`) });
}
console.log(`✓ QA 截圖 ${sections.length} 張（qa-page-NN.png，校稿完請刪）`);

await browser.close();
