import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
const browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu-sandbox','--remote-debugging-port=9333',`--user-data-dir=${process.cwd()}/.browser-profile`,'--no-first-run','--no-default-browser-check','about:blank'],{windowsHide:true,stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let ws;try{
let pages;for(let i=0;i<30;i++){try{pages=await (await fetch('http://127.0.0.1:9333/json')).json();break}catch{await delay(500)}}
if(!pages)throw Error('Chrome debugging endpoint unavailable');
ws=new WebSocket(pages.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pending=new Map(),errors=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+m.params.exceptionDetails.exception?.description)};
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4173'});await delay(6000);
const click=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const assert=async(expr,message)=>{if(!await evaluate(expr))throw Error(message)};
const textIs=async phrase=>assert(`document.querySelector('.sensor-stage strong').textContent.includes(${JSON.stringify(phrase)})`,'State missing: '+phrase);
await click('.exhibit-shortcuts button:first-child');await delay(300);
await assert(`document.querySelector('#panel-title').textContent==='Meet WoofGuardian'`,'Wrong title');
await textIs('Ready');await click('.portfolio-panel .primary-button');await textIs('grape');await click('.portfolio-panel .primary-button');await textIs('LED');
await click('.guardian-connectivity input');await textIs('LED');await click('.portfolio-panel .primary-button');await textIs('waiting for Wi-Fi');await assert(`document.querySelector('.portfolio-panel .primary-button').disabled`,'Disconnected sync should block delivery');
await click('.guardian-connectivity input');await textIs('synced');await click('.portfolio-panel .primary-button');await textIs('delivered');await click('.guardian-connectivity input');await textIs('waiting');await click('.guardian-reset');await textIs('Ready');
await click('.sensor-tabs button:nth-child(2)');await textIs('inside');await click('.portfolio-panel .primary-button');await textIs('outside');await click('.portfolio-panel .primary-button');await textIs('inside');
await click('.sensor-tabs button:nth-child(3)');await textIs('asleep');await click('.portfolio-panel .primary-button');await textIs('active inference');await assert(`document.querySelector('.guardian-estimate').textContent.includes('not a measured')`,'Runtime caveat missing');
await assert(`document.querySelector('.guardian-results').textContent.includes('94.98%')&&document.querySelector('.guardian-results').textContent.includes('233 ms')`,'Results missing');
await assert(`document.querySelector('.portfolio-panel').textContent.includes('Milbert S. De Paz')&&document.querySelector('.portfolio-panel').textContent.includes('Justin Nillasca')`,'Team credit missing');
for(const width of [1440,390,320]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});await click('.sensor-tabs button:first-child');await delay(300);await evaluate(`document.querySelector('.portfolio-panel').scrollTop=0`);await assert(`document.querySelector('.portfolio-panel').scrollWidth<=document.querySelector('.portfolio-panel').clientWidth`,'Panel overflow');
 await writeFile('qa-guardian-'+width+'.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
}
await click('.close-button');await click('nav button:first-child');await delay(250);await assert(`Array.from(document.querySelectorAll('.project-card h3')).some(x=>x.textContent==='WoofGuardian')&&!document.querySelector('.portfolio-panel').textContent.includes('YOLOv11')&&!document.querySelector('.portfolio-panel').textContent.includes('Meow Guardian')`,'Stale project copy');
await evaluate(`Array.from(document.querySelectorAll('.project-card')).find(x=>x.querySelector('h3').textContent==='WoofGuardian').querySelector('summary').click()`);
await evaluate(`Array.from(document.querySelectorAll('.project-card')).find(x=>x.querySelector('h3').textContent==='WoofGuardian').querySelector('.project-story button').click()`);await assert(`document.querySelector('#panel-title').textContent==='Meet WoofGuardian'`,'Story link failed');
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});await assert(`!document.querySelector('[role=dialog]')`,'Escape failed');
if(errors.length)throw Error(errors.join('\n'));console.log('WoofGuardian content, team attribution, connected/offline alerts, geofence, motion, story links, and 1440/390/320px checks passed');await send('Browser.close');
}finally{ws?.close();browser.kill()}
