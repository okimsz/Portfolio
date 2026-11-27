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
await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4173'});await delay(7000);
console.log('Initial',await evaluate(`({canvas:!!document.querySelector('canvas'),fallback:!!document.querySelector('.scene-fallback'),title:document.title})`));
const resumeResponse=await fetch('http://127.0.0.1:4173/Mico-Alano-Resume.pdf');
if(!resumeResponse.ok||!Buffer.from(await resumeResponse.arrayBuffer()).subarray(0,5).equals(Buffer.from('%PDF-')))throw Error('Resume download is not a PDF');
for(let i=0;i<30&&!await evaluate(`!!document.querySelector('canvas')`);i++)await delay(1000);
if(!await evaluate(`!!document.querySelector('canvas')`)){console.log('Errors',errors,'Page',await evaluate(`document.body.innerText`));throw Error('3D canvas did not load')}
await writeFile('qa-desktop.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
if(!await evaluate(`!!document.querySelector('.cat-bubble')`))throw Error('Cat bubble missing');
for(const [name,x,y] of [['Hearth',960,655],['Shelter',992,638],['Solaris',1027,625]]){
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});await delay(200);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1});await delay(200);
  const selected=await evaluate(`document.querySelector('.experiment-picker button[aria-pressed=true] strong')?.textContent`);
  if(selected!==name)throw Error('Shelf raycast failed: '+name+' got '+selected);
  console.log('Shelf click',name);
  await evaluate(`document.querySelector('.close-button').click()`);await delay(2200);
}
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:920,y:355});await delay(400);
console.log('3D hover',await evaluate(`document.querySelector('.object-tooltip')?.textContent`));
await send('Input.dispatchMouseEvent',{type:'mousePressed',x:920,y:355,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:920,y:355,button:'left',clickCount:1});await delay(300);
if(await evaluate(`document.querySelector('[role=dialog] h2')?.textContent`)!=='Featured projects')throw Error('Monitor raycast click failed');
await evaluate(`document.querySelector('.close-button').click()`);await delay(1800);
await send('Input.dispatchMouseEvent',{type:'mousePressed',x:850,y:595,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:850,y:595,button:'left',clickCount:1});await delay(400);
console.log('Cat fact after click',await evaluate(`document.querySelector('.cat-bubble button').textContent`));
for(const label of ['Projects','Achievements','Skills','About me','Contact']){await evaluate(`Array.from(document.querySelectorAll('nav button')).find(x=>x.textContent==='${label}').click()`);await delay(200);console.log('Panel',label,await evaluate(`({title:document.querySelector('[role=dialog] h2')?.textContent,focusInside:document.querySelector('[role=dialog]')?.contains(document.activeElement)})`));await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});if(await evaluate(`!!document.querySelector('[role=dialog]')`))throw Error('Escape failed')}
await evaluate(`document.querySelector('.theme-button').click()`);await delay(1500);console.log('Night',await evaluate(`document.querySelector('main').classList.contains('night')`));await writeFile('qa-night.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
await evaluate(`document.querySelector('.theme-button').click()`);await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await delay(1500);await writeFile('qa-mobile.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));console.log('Mobile',await evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth,navButtons:document.querySelectorAll('nav button').length})`));console.log('Runtime errors',errors);if(errors.length)process.exitCode=1;
await evaluate(`Array.from(document.querySelectorAll('nav button')).find(x=>x.textContent==='Playground').click()`);await delay(400);
for(const [name,url] of [['Hearth','https://refrigerator-1.onrender.com'],['Shelter','https://roof-panels.onrender.com'],['Solaris','https://solar-water-heater.onrender.com']]){
  await evaluate(`Array.from(document.querySelectorAll('.experiment-picker button')).find(x=>x.textContent.includes('${name}')).click()`);await delay(200);
  const link=await evaluate(`({url:document.querySelector('.experiment-copy .primary-button').getAttribute('href'),target:document.querySelector('.experiment-copy .primary-button').target,imageLoaded:document.querySelector('.experiment-preview img').naturalWidth>0,overflow:document.querySelector('[role=dialog]').scrollWidth>document.querySelector('[role=dialog]').clientWidth})`);
  if(link.url!==url||link.target!=='_blank'||!link.imageLoaded||link.overflow)throw Error('Playground card failed: '+JSON.stringify(link));
  console.log('Playground',name,link);
}
await writeFile('qa-playground-mobile.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await delay(1000);
await writeFile('qa-playground-desktop.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
if(errors.length)throw Error('Runtime errors: '+errors.join('; '));
await send('Browser.close');
}finally{ws?.close();browser.kill()}

