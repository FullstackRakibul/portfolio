import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const viewports = [
    { name: '375-mobile', width: 375, height: 667 },
    { name: '428-mobile', width: 428, height: 926 },
    { name: '768-tablet', width: 768, height: 1024 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    const file = path.join(__dirname, `FINAL-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log(`✅ Screenshot: FINAL-${vp.name}.png`);
  }

  await browser.close();
}

takeScreenshots().catch(console.error);
