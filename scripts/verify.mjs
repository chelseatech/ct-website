import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.TEST_URL || 'http://127.0.0.1:8790';
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
const results=[];
await mkdir('artifacts',{recursive:true});
try {
 for (const viewport of [{width:1440,height:1000},{width:768,height:1024},{width:390,height:844},{width:320,height:740}]) {
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  const broken=[]; page.on('response',r=>{if(r.status()>=400 && !r.url().includes('/missing-page/'))broken.push(r.url());});
  for(const route of ['/','/services/','/about/']) {
   const response=await page.goto(base+route); assert.equal(response.status(),200);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('form').count(),0);
   assert.match(await page.title(),/Chelsea Tech/);
   assert.ok(await page.locator('meta[name="description"]').getAttribute('content'));
   assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');
   assert.equal(await page.locator('nav [aria-current="page"]').count(),1);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Horizontal overflow '+route);
   const scan=await new AxeBuilder({page}).analyze();
   assert.deepEqual(scan.violations.map(v=>({id:v.id,impact:v.impact})),[]);
   for(const img of await page.locator('img').all()) assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0));
   await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').textContent(),'Skip to content');
   assert.equal(await page.locator(':focus').evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
   await page.keyboard.press('Enter'); assert.equal(await page.locator(':focus').getAttribute('id'),'main');
   await page.screenshot({path:`artifacts/${viewport.width}-${route==='/'?'home':route.split('/')[1]}.png`,fullPage:true});
   results.push({route,viewport,axeViolations:0,overflow:false,status:200});
  }
  await page.goto(base+'/');
  await page.getByRole('link',{name:'Explore our services'}).click(); assert.equal(new URL(page.url()).pathname,'/services/');
  await page.getByRole('link',{name:'About & contact',exact:true}).click();
  await page.getByRole('link',{name:'Email ryan@chelseatech.ca'}).getAttribute('href').then(h=>assert.equal(h,'mailto:ryan@chelseatech.ca'));
  const missing=await page.goto(base+'/missing-page/');assert.equal(missing.status(),404);assert.match(await page.locator('h1').textContent(),/reconnected/);
  assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);
  await context.close();
 }
 const request=await browser.newContext();
 for(const asset of ['/favicon.svg','/connections.svg','/robots.txt'])assert.equal((await request.request.get(base+asset)).status(),200);
 const response=await request.request.get(base+'/'); assert.match(response.headers()['x-robots-tag'],/noindex/);
 await writeFile('artifacts/qa-results.json',JSON.stringify({base,results,checks:['navigation','404 status','static assets','metadata','no forms','skip link and focus','no browser errors','no broken local requests']},null,2));
 console.log(`PASS: ${results.length} page/viewport checks; navigation, metadata, assets, 404, keyboard skip/focus, axe, headers.`);
} finally {await browser.close();}
