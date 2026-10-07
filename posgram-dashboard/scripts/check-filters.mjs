import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,...(process.env.POSGRAM_BROWSER_PATH?{executablePath:process.env.POSGRAM_BROWSER_PATH}:{})});
const errors=[];
async function open(width){const page=await browser.newPage({viewport:{width,height:1080},deviceScaleFactor:1});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});return page}
const select=(page,name)=>page.getByRole('combobox',{name,exact:true});
async function options(page,name){return select(page,name).locator('option').allTextContents()}
async function noOverflow(page){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Document overflow')}
async function verifyScope(page){
 const params=await page.evaluate(()=>({stage:document.querySelector('.segmented .selected').textContent==='Pretest'?'pre':'post',category:document.querySelector('[aria-label="Kategori asesmen"]').value,subject:document.querySelector('[aria-label="Mata pelajaran"]').value,packageId:document.querySelector('[aria-label="Paket soal"]').value,period:document.querySelector('[aria-label="Periode"]').value}));
 const expected=await page.evaluate(async params=>{const {getDashboard,students}=await import('/src/data.js');return getDashboard({...params,roster:students})},params);
 assert.equal(await page.locator('.gauge-center strong').innerText(),expected.school.score==null?'—':`${Math.round(expected.school.score)}%`);
 assert.deepEqual(await page.locator('.subject-title h3').allTextContents(),expected.subjects.map(s=>s.name));
 assert.equal(await page.locator('.metric-value strong').first().innerText(),String(expected.school.measured));
 assert.equal(await page.locator('.metric-value strong').nth(1).innerText(),String(expected.assessmentCount));
 assert.equal(await page.locator('.metric-value strong').nth(2).innerText(),String(expected.classRows.filter(c=>c.measured).length));
 assert.deepEqual(await page.locator('.sessions-grid strong').allTextContents(),[expected.operations.pre.completed,expected.operations.pre.ongoing,expected.operations.post.completed,expected.operations.post.unscheduled].map(String));
 for(let i=0;i<3;i++)assert.equal(await page.locator('.class-readiness-table tbody tr').nth(i).locator('td').nth(2).innerText(),String(expected.classRows[i].measured));
 assert.equal(await page.locator('.status-totals strong').count(),expected.school.measured?3:0);
}
try{
 for(const width of [1920,1440,1024,768,390,320]){
  const page=await open(width);
  assert.deepEqual(await page.locator('.hierarchical-filters select').evaluateAll(items=>items.map(el=>el.options[el.selectedIndex].text)),['Semua Kategori','Semua Mapel','Semua Paket','TA 2026/2027']);
  await noOverflow(page);
  if(width===1920||width===390){await page.screenshot({path:`qa-evidence/filters-default-${width}.png`,fullPage:true,animations:'disabled'});await page.locator('.filterbar').screenshot({path:`qa-evidence/filters-toolbar-${width}.png`,animations:'disabled'})}
  await select(page,'Kategori asesmen').selectOption('Tryout');
  assert.deepEqual(await options(page,'Mata pelajaran'),['Semua Mapel','Matematika','Bahasa Indonesia']);
  await select(page,'Mata pelajaran').selectOption('Matematika');
  assert.deepEqual(await options(page,'Paket soal'),['Semua Paket','Paket TKA Matematika A']);
  await select(page,'Paket soal').selectOption('math-a');
  await noOverflow(page);await verifyScope(page);
  assert.ok((await page.locator('.priority-name>span').allTextContents()).every(s=>s.startsWith('Matematika')));
  await select(page,'Mata pelajaran').selectOption('Bahasa Indonesia');
  assert.equal(await select(page,'Paket soal').inputValue(),'all');
  assert.deepEqual(await options(page,'Paket soal'),['Semua Paket','Paket TKA Bahasa Indonesia A']);
  await verifyScope(page);
  assert.ok((await page.locator('.priority-name>span').allTextContents()).every(s=>s.startsWith('Bahasa Indonesia')));
  await select(page,'Kategori asesmen').selectOption('Latihan');
  await select(page,'Mata pelajaran').selectOption('Literasi Gizi');
  await select(page,'Paket soal').selectOption('nutrition-a');
  await select(page,'Kategori asesmen').selectOption('Tryout');
  assert.equal(await select(page,'Mata pelajaran').inputValue(),'all');assert.equal(await select(page,'Paket soal').inputValue(),'all');
  await select(page,'Mata pelajaran').selectOption('Matematika');await select(page,'Paket soal').selectOption('math-a');
  await select(page,'Periode').selectOption('custom');
  const picker=page.getByRole('dialog',{name:'Custom periode',exact:true});await picker.waitFor();
  if(width<=760){const toolbarBox=await page.locator('.hierarchical-filters').boundingBox(),pickerBox=await picker.boundingBox();assert.ok(Math.abs(pickerBox.y-toolbarBox.y-toolbarBox.height-8)<=1,'Mobile date picker must be anchored below the filter bar')}
  await picker.getByLabel('Tanggal mulai',{exact:true}).fill('2026-12-31');await picker.getByLabel('Tanggal akhir',{exact:true}).fill('2026-10-01');
  await picker.getByRole('button',{name:'Terapkan',exact:true}).click();assert.ok(await picker.getByRole('alert').isVisible());
  await picker.getByLabel('Tanggal mulai',{exact:true}).fill('2026-10-01');await picker.getByLabel('Tanggal akhir',{exact:true}).fill('2026-12-31');
  await noOverflow(page);
  if(width===1920||width===390)await page.screenshot({path:`qa-evidence/filters-date-picker-${width}.png`,animations:'disabled'});
  await picker.getByRole('button',{name:'Terapkan',exact:true}).click();
  assert.equal(await select(page,'Periode').inputValue(),'custom');assert.equal(await select(page,'Periode').locator('option:checked').innerText(),'1 Okt – 31 Des 2026');
  await noOverflow(page);
  assert.deepEqual(await page.locator('.sessions-grid strong').allTextContents(),['0','1','0','0']);
  await page.locator('.sessions-section').getByRole('button',{name:'Lihat Detail',exact:true}).click();
  await page.getByRole('heading',{name:'Riwayat & Status Asesmen',exact:true}).waitFor();
  assert.equal(await page.locator('.assessment-history tbody tr').count(),2);assert.ok((await page.locator('.history-package').allTextContents()).every(s=>s==='Paket TKA Matematika A'));
  await page.getByRole('button',{name:'Kembali ke Kesiapan TKA',exact:true}).click();
  await page.getByRole('heading',{name:'Ringkasan Kesiapan Awal TKA',exact:true}).waitFor();
  await page.evaluate(()=>window.scrollTo(0,0));
  if(width===1920||width===390){await page.screenshot({path:`qa-evidence/filters-active-${width}.png`,fullPage:true,animations:'disabled'});await page.locator('.filterbar').screenshot({path:`qa-evidence/filters-toolbar-active-${width}.png`,animations:'disabled'})}
  await page.getByRole('button',{name:'Edit custom periode',exact:true}).click();
  await picker.getByLabel('Tanggal mulai',{exact:true}).fill('2027-02-01');await picker.getByLabel('Tanggal akhir',{exact:true}).fill('2027-02-28');
  await picker.getByRole('button',{name:'Terapkan',exact:true}).click();
  assert.ok(await page.getByText('Belum ada data untuk filter yang dipilih.',{exact:true}).isVisible());
  assert.ok(await page.getByText('Ubah kategori, mata pelajaran, paket, atau periode untuk melihat data lainnya.',{exact:true}).isVisible());
  assert.equal(await page.locator('.gauge-center strong').innerText(),'—');assert.equal(await page.locator('.readiness-context>.badge').count(),0);
  assert.deepEqual(await page.locator('.sessions-grid strong').allTextContents(),['0','0','0','0']);
  if(width===1920||width===390)await page.screenshot({path:`qa-evidence/filters-empty-${width}.png`,fullPage:true,animations:'disabled'});
  await select(page,'Periode').selectOption('2025');assert.equal(await page.locator('.filter-empty-state').count(),0);await verifyScope(page);
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log('Passed: all four dependent filters, child resets, all sections/history scoped, custom date validation/range/empty state, 1920/1440/1024/768/390/320px, no console errors or document overflow.');
}finally{await browser.close()}
