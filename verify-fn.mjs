import { chromium } from 'playwright';
const B='http://127.0.0.1:4321';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const fails=[];
const log=(k,v)=>{ if(v===false) fails.push(k); console.log((v===true?'PASS  ':v===false?'FAIL  ':'      ')+k+(typeof v==='string'?': '+v:'')); };

// --- with JS ---
const page = await browser.newPage({ viewport:{width:1440,height:900} });
await page.goto(`${B}/blog/type-unification/`, { waitUntil:'networkidle' });
log('popovers created', await page.locator('.footnote-popover').count() === 5);
const ref = page.locator('a[data-footnote-ref]').first();
log('no popover open initially', await page.locator('.footnote-popover:popover-open').count() === 0);
await ref.hover();
await page.waitForTimeout(400);
const open = page.locator('.footnote-popover:popover-open');
log('popover opens on hover', await open.count() === 1);
const txt = ((await open.first().textContent()) || '').trim();
log('popover text', txt.slice(0,60).replace(/\s+/g,' '));
log('popover has footnote content', txt.length > 20);
log('backref arrow stripped', !(await open.first().locator('a[data-footnote-backref]').count()));
const box = await open.first().boundingBox();
log('popover on screen', Boolean(box && box.x>=0 && box.y>=0 && box.x+box.width<=1440));
// keyboard dismiss
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
log('Escape closes popover', await page.locator('.footnote-popover:popover-open').count() === 0);
// focus opens (keyboard users)
await ref.focus();
await page.waitForTimeout(300);
log('focus opens popover', await page.locator('.footnote-popover:popover-open').count() === 1);
// original footnote list untouched
log('footnote list still intact', await page.locator('section[data-footnotes] li[id^="user-content-fn-"]').count() === 5);
log('backrefs still present in real list', await page.locator('section[data-footnotes] a[data-footnote-backref]').count() > 0);

// --- without JS: anchors must still work ---
const nojs = await browser.newContext({ javaScriptEnabled:false, viewport:{width:1440,height:900} });
const p2 = await nojs.newPage();
await p2.goto(`${B}/blog/type-unification/`, { waitUntil:'domcontentloaded' });
log('no-JS: no popovers injected', await p2.locator('.footnote-popover').count() === 0);
const href = await p2.locator('a[data-footnote-ref]').first().getAttribute('href');
log('no-JS: ref is still an anchor', String(href));
log('no-JS: anchor target exists', await p2.locator(href).count() === 1);

await browser.close();
console.log('\n'+(fails.length?`${fails.length} FAILED: ${fails.join(', ')}`:'all checks passed'));
process.exit(fails.length?1:0);
