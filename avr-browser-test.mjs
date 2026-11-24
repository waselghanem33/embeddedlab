import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000/avr-studio.html');
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Firmware loaded'));
 for(let i=0;i<25;i++)await page.locator('#step').click();
 assert.match(await page.locator('#regs').innerText(),/OCR1A = 64/);
 await page.locator('#press').click();await page.locator('#step').click();
 assert.match(await page.locator('#regs').innerText(),/OCR1A = 192/);
 await page.locator('#release').click();await page.locator('#clear').click();
 assert.match(await page.locator('#electrical').innerText(),/Button disconnected/);
 await page.locator('#press').click();await page.locator('#step').click();
 assert.match(await page.locator('#regs').innerText(),/OCR1A = 192/);
 await page.locator('#release').click();await page.locator('#example').click();
 assert.match(await page.locator('#electrical').innerText(),/LED path connected/);
 assert.deepEqual(errors,[]);console.log('Browser smoke tests passed');
}finally{await browser.close()}
