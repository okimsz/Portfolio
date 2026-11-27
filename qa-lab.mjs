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
await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4173'});await delay(6500);
const click=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const assert=async(expr,message)=>{if(!await evaluate(expr))throw Error(message)};
const shot=async name=>writeFile('qa-lab-'+name+'.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
await assert(`!!document.querySelector('canvas')&&!document.querySelector('.scene-fallback')`,'3D did not load');
await click('.lab-toggle');await delay(500);await assert(`document.querySelectorAll('.lab-annotation').length===3`,'Lab annotations missing');await shot('desktop');
for(const [title,x,y] of [['Inside the chip',1053,441],['Notes from Xinyx',874,366],['Meet Meow Guardian',850,570]]){
await send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1});await delay(200);
await assert(`document.querySelector('#panel-title')?.textContent===${JSON.stringify(title)}`,'3D exhibit click failed: '+title);await click('.close-button');await delay(2000);
}
for(const [i,title] of [[0,'Meet Meow Guardian'],[1,'Inside the chip'],[2,'Notes from Xinyx']]){
await click(`.exhibit-shortcuts button:nth-child(${i+1})`);await delay(300);await assert(`document.querySelector('#panel-title').textContent===${JSON.stringify(title)}`,'Wrong exhibit');
if(i<2){for(let n=1;n<=3;n++){await click(`.sensor-tabs button:nth-child(${n})`);await assert(`document.querySelector('.sensor-tabs button:nth-child(${n})').getAttribute('aria-pressed')==='true'`,'Stage switch failed');if(i===0){await click('.portfolio-panel .primary-button');await assert(`document.querySelector('.sensor-stage').classList.contains('triggered')`,'Sensor state failed')}}}
await shot('exhibit-'+i);await click('.close-button');}
await click('nav button:first-child');await delay(250);await click('.project-story summary');await assert(`document.querySelector('.project-story').innerText.includes('limited public material')`,'Personal Xinyx story missing');await click('.project-story .primary-button');await assert(`document.querySelector('#panel-title').textContent==='Inside the chip'`,'Story exhibit link failed');await click('.close-button');
await click('[aria-label="Reduce motion"]');await assert(`document.querySelector('main').classList.contains('reduced-motion')`,'Reduced motion failed');
for(const index of [1,2,3]){await click('.tour-start');await click(`.tour-picker button:nth-of-type(${index})`);await delay(250);await assert(`!!document.querySelector('.tour-card')`,'Tour did not start');await assert(`document.querySelector('.tour-controls button:nth-child(2)').disabled`,'Reduced motion tour should be manual');await click('.tour-controls button:last-child');await assert(`document.querySelector('.tour-top').textContent.includes('2/')`,'Tour next failed');await click('.tour-controls button:first-child');await assert(`document.querySelector('.tour-top').textContent.includes('1/')`,'Tour back failed');await click('[aria-label="Skip tour"]');await assert(`!document.querySelector('.tour-card')`,'Skip failed')}
await click('[aria-label="Reduce motion"]');await click('.tour-start');await click('.tour-picker button:first-of-type');await click('[aria-label="Pause tour"]');await delay(400);await assert(`!!document.querySelector('[aria-label="Resume tour"]')`,'Pause failed');await click('[aria-label="Resume tour"]');console.log('Checking automatic tour advancement');await delay(20500);await assert(`document.querySelector('.tour-top').textContent.includes('2/')`,'Automatic tour did not advance');await click('[aria-label="Skip tour"]');
for(const width of [390,320]){await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:true});await delay(700);await shot('mobile-'+width);await assert(`document.documentElement.scrollWidth<=innerWidth`,'Page overflow');for(let i=1;i<=3;i++){await click(`.exhibit-shortcuts button:nth-child(${i})`);await delay(150);await assert(`document.querySelector('[role=dialog]').scrollWidth<=document.querySelector('[role=dialog]').clientWidth`,'Exhibit overflow');await click('.close-button')};await click('.tour-start');await click('.tour-picker button:nth-of-type(2)');await delay(500);await shot('tour-'+width);await click('[aria-label="Skip tour"]')}
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.reload');await delay(3000);await assert(`document.querySelector('main').classList.contains('reduced-motion')`,'OS motion preference not respected');
if(errors.length)throw Error(errors.join('\n'));console.log('Lab, sensor demos, chip stages, stories, tours, reduced motion and mobile checks passed');await send('Browser.close');
}finally{ws?.close();browser.kill()}
