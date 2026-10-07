import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,...(process.env.POSGRAM_BROWSER_PATH?{executablePath:process.env.POSGRAM_BROWSER_PATH}:{})});
const errors=[];
async function open(width){
 const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 return page;
}
try{
 for(const width of [1920,390,320]){
  const page=await open(width),card=page.locator('.readiness'),info=page.getByRole('button',{name:'Kategori kesiapan terukur',exact:true});
  assert.equal(await card.locator('.gauge-center strong').innerText(),'44%');
  assert.equal(await card.locator('.gauge-center>span').count(),0);
  assert.equal(await card.locator('.readiness-context>.badge').innerText(),'Kesiapan Rendah');
  assert.match(await card.locator('.readiness-basis').innerText(),/Berdasarkan 11 murid\s+yang telah memiliki nilai asesmen/);
  assert.doesNotMatch(await card.innerText(),/Menggambarkan murid yang sudah terukur/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await card.screenshot({path:`qa-evidence/readiness-status-${width}.png`});
  await info.hover();
  await page.getByRole('tooltip').waitFor();
  assert.equal(await page.getByRole('tooltip').locator('.readiness-category-item').count(),3);
  assert.deepEqual(await page.getByRole('tooltip').locator('.readiness-category-item>div>span').allTextContents(),['Nilai < 65','Nilai 65–84','Nilai ≥ 85']);
  if(width===1920||width===390)await page.screenshot({path:`qa-evidence/readiness-tooltip-${width}.png`});
  await info.focus();
  await info.press('Escape');
  assert.equal(await page.getByRole('tooltip').count(),0);
  await info.click();
  assert.equal(await page.getByRole('dialog').getByRole('heading').innerText(),'Kategori Kesiapan');
  assert.equal(await page.getByRole('dialog').locator('.readiness-category-item').count(),3);
  if(width===390)await page.getByRole('dialog').screenshot({path:'qa-evidence/readiness-category-dialog-mobile.png'});
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(),0);
  await page.close();
 }
 const page=await open(390);
 async function render(score,measured){
  await page.evaluate(async({score,measured})=>{
   const {MeasuredReadiness}=await import('/src/App.jsx');
   const React=await import('/node_modules/.vite/deps/react.js');
   const ReactDOM=await import('/node_modules/.vite/deps/react-dom_client.js');
   if(!window.readinessTestRoot){const mount=document.createElement('div');mount.style.cssText='padding:18px';document.body.replaceChildren(mount);document.body.style.paddingTop='0';window.readinessTestRoot=(ReactDOM.createRoot||ReactDOM.default.createRoot)(mount)}
   window.readinessTestRoot.render(React.default.createElement(MeasuredReadiness,{school:{score,measured,sufficient:measured>=3,dataState:measured===0?'empty':measured<3?'limited':'available'}}));
  },{score,measured});
 }
 for(const [score,label] of [[64,'Kesiapan Rendah'],[65,'Siap dengan Penguatan'],[84,'Siap dengan Penguatan'],[85,'Sangat Siap'],[0,'Kesiapan Rendah']]){
  await render(score,11);
  await page.getByText(`${score}%`,{exact:true}).waitFor();
  assert.equal(await page.locator('.readiness-context>.badge').innerText(),label);
  if(score===65||score===85)await page.locator('.readiness').screenshot({path:`qa-evidence/readiness-category-${score}.png`});
 }
 for(const score of [null,0]){
  await render(score,0);
  await page.getByText('Belum ada data kesiapan',{exact:true}).waitFor();
  assert.equal(await page.locator('.gauge-center strong').innerText(),'—');
  assert.equal(await page.locator('.readiness-context>.badge').count(),0);
  assert.match(await page.locator('.readiness').innerText(),/Nilai kesiapan akan tampil setelah murid memiliki hasil asesmen\./);
  assert.equal(await page.locator('.readiness .card-footnote').count(),0);
 }
 await page.locator('.readiness').screenshot({path:'qa-evidence/readiness-empty-mobile.png'});
 await page.close();
 assert.deepEqual(errors,[]);
 console.log('Passed: desktop/mobile/320px, hover/focus/click/Escape, readiness boundaries, valid zero, empty state, disclaimer removed, no overflow or console errors.');
}finally{await browser.close()}
