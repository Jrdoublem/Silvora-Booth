// Game state, passport, journey map, mascot, stamps and the prize draw.
const icon=name=>`<svg class="ui-icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const KEY='silvora-booth-v1';
const PRIZES=['ขนม','ลูกอม','สติ๊กเกอร์'];
const tasks=[
  {id:'quiz',icon:'compass',title:'ตอบไว รู้ใจอยุธยา',short:'ตอบคำถาม',hint:'ทายภาพใน 10 วิ',ink:'#b0563a',tilt:-9},
  {id:'match',icon:'map',title:'จับคู่ แลนด์มาร์ก',short:'จับคู่ภาพ',hint:'3 คู่ใน 30 วิ',ink:'#2f6b55',tilt:7},
  {id:'page',icon:'heart',title:'กดไลค์เพจ Silvora',short:'กดไลค์เพจ',hint:'ไลค์เพจแล้วกลับมา',ink:'#3f5a8a',tilt:-4}
];
// A passport-style rubber stamp for a finished task. Ink texture comes from #stamp-ink in index.html.
let stampUid=0;
function stampArt(t,withLabel){
  const n=tasks.indexOf(t)+1,arc=`stamp-arc-${++stampUid}`;
  return `<svg class="stamp-art" viewBox="0 0 120 120" style="color:${t.ink}" aria-hidden="true"><g filter="url(#stamp-ink)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="60" r="56" stroke-width="3.4"/><circle cx="60" cy="60" r="45" stroke-width="1.3"/><path id="${arc}" d="M13.5 60a46.5 46.5 0 1 1 93 0a46.5 46.5 0 1 1-93 0" stroke="none"/><text fill="currentColor" stroke="none" font-family="system-ui,sans-serif" font-size="10" font-weight="800"><textPath href="#${arc}" textLength="288" lengthAdjust="spacing">SILVORA • AYUTTHAYA • STOP 0${n} •</textPath></text><use href="assets/icons.svg#${t.icon}" x="${withLabel?44:40}" y="${withLabel?22:36}" width="${withLabel?32:40}" height="${withLabel?32:40}" stroke-width="2"/>${withLabel?`<path d="M17 63h86l-5 10 5 10H17l5-10Z" stroke-width="1.6"/><text x="60" y="77.5" text-anchor="middle" fill="currentColor" stroke="none" font-size="11.5" font-weight="700">${t.short}</text><path d="M48 93h24M56 98h8" stroke-width="1.4"/>`:'<path d="m30 60-5-3v6Zm60 0 5-3v6Z" fill="currentColor" stroke="none"/>'}</g></svg>`;
}
const TASK_IDS=tasks.map(t=>t.id);

let state={stamps:[],prize:null},timer=null,session=0,justEarned=null,lastSpeech='';
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&Array.isArray(saved.stamps)){state={stamps:[...new Set(saved.stamps.filter(x=>TASK_IDS.includes(x)))],prize:PRIZES.includes(saved.prize)?saved.prize:null}}}catch{}

const $=s=>document.querySelector(s),modal=$('#modal');
const has=id=>state.stamps.includes(id);
const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{toast('บันทึกไม่ได้ กรุณาเปิดหน้านี้ค้างไว้')}}
function toast(s,iconName){$('#toast').innerHTML=(iconName?icon(iconName)+' ':'')+s;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',3500)}

function renderPassport(n){
  $('#count').textContent=`${n} / 3 ดวง`;
  $('#stamps').innerHTML=tasks.map(t=>`<div class="stamp ${has(t.id)?'done':''}" data-stamp="${t.id}"><div class="seal" style="--tilt:${t.tilt}deg">${has(t.id)?stampArt(t,false):icon(t.icon)}</div>${t.short}</div>`).join('');
  $('#progress').style.width=`${n/3*100}%`;
  $('#progress-text').textContent=n===3?'ครบแล้ว! กล่องของขวัญพร้อมให้คุณเปิด':`อีก ${3-n} ดวง ก็ได้ลุ้นของขวัญแล้ว`;
}
function renderJourney(){
  $('#journey-map').innerHTML=`<span class="eyebrow">YOUR JOURNEY THROUGH AYUTTHAYA</span><div class="route-stops"><svg class="route-line" viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden="true"><path d="M60 45C140 0 190 90 300 45S460 0 540 45"/></svg>${tasks.map((t,i)=>{const done=has(t.id);return `<button class="route-stop ${done?'visited':''}" data-stop="${t.id}" aria-label="${t.title}${done?' รับแสตมป์แล้ว':''}"><span class="stop-number">จุดแวะ 0${i+1}</span><span class="stop-medallion">${icon(done?'check':t.icon)}</span><strong>${t.short}</strong><span class="stop-status">${done?'ประทับตราแล้ว':t.hint}</span></button>`}).join('')}</div>`;
}
// The mascot's speech follows the player's progress.
function companionSpeech(n){
  if(state.prize)return['ขอบคุณที่มาเที่ยวด้วยกันนะ!',`คุณได้${state.prize} รับของได้ที่บูธ Silvora เลย<br>แล้วแวะมาเที่ยวอยุธยาด้วยกันอีกนะ`];
  if(n===3)return['ครบ 3 ดวงแล้ว เย้!','เก่งมากเลย เลื่อนลงไปเปิด<br>กล่องของขวัญกันเถอะ'];
  if(n===2){const left=tasks.find(t=>!has(t.id));return['อีกดวงเดียวเท่านั้น!',`เหลือแค่ “${left.short}” แล้ว<br>กล่องของขวัญรออยู่ข้างหน้า`]}
  if(n===1)return['ได้ดวงแรกแล้ว เก่งมาก!','อีก 2 ดวง ก็ได้เปิดกล่องของขวัญ<br>ไปจุดแวะต่อไปกันเลย'];
  return['ไปเก็บแสตมป์ด้วยกันนะ!','เล่นด้วยเครื่องนี้จนจบนะ แสตมป์จะจำไว้ให้<br>แตะจุดแวะไหนก่อนก็ได้เลย'];
}
function renderCompanion(n){
  const [title,text]=companionSpeech(n),speech=title+text;
  if(speech===lastSpeech)return;
  $('#companion-title').textContent=title;$('#companion-text').innerHTML=text;
  // Replay the little "speaking" animation, but not on the first paint.
  if(lastSpeech){const box=$('.travel-companion');box.classList.remove('speaking');void box.offsetWidth;box.classList.add('speaking')}
  lastSpeech=speech;
}
function renderGift(n){
  $('#draw').disabled=n<3||!!state.prize;
  $('#draw').innerHTML=state.prize?`เปิดกล่องแล้ว ${icon('check')}`:n===3?`เปิดกล่องสุ่มของฉัน ${icon('gift')}`:`เก็บอีก ${3-n} แสตมป์เพื่อเปิดกล่อง`;
  $('#prize-result').innerHTML=state.prize?`คุณได้รับ <strong>${state.prize}</strong> รับของได้ที่บูธเลย`:'';
}
// The hero button follows progress: start the next unfinished stop, or go to the gift.
const nextTask=()=>tasks.find(t=>!has(t.id));
function renderStart(n){$('#start').innerHTML=`${state.prize?'ดูของขวัญของฉัน':n===3?'เปิดกล่องของขวัญ':n?'ไปจุดแวะต่อไป':'เริ่มการเดินทาง'} ${icon('arrow')}`}
function render(){const n=state.stamps.length;renderStart(n);renderPassport(n);renderJourney();renderCompanion(n);renderGift(n)}

function open(label,html){clearInterval(timer);session++;$('#modal-label').textContent=label;$('#modal-body').innerHTML=html;if(!modal.open)modal.showModal()}
function countdown(seconds,expired){let end=Date.now()+seconds*1000;const tick=()=>{const left=Math.max(0,Math.ceil((end-Date.now())/1000));const el=$('#seconds');if(el)el.textContent=left;if(left===0){clearInterval(timer);expired()}};tick();timer=setInterval(tick,200);return()=>Date.now()<end}
function retry(message,fn){open('TRY AGAIN',`<div class="result"><div class="result-icon">${icon('sun')}</div><h2>${message}</h2><p>ค่อย ๆ เล่น เก็บแสตมป์ได้แน่นอน</p><button class="primary wide" id="again">ลองอีกครั้ง</button></div>`);$('#again').onclick=fn}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}

// quiz(), match() live in photo-games.js and page() in visit.js; they are looked up when tapped.
function startTask(id){if(has(id))return toast('จุดแวะนี้ได้รับแสตมป์แล้ว','check');({quiz,match,page})[id]()}

function confetti(startAt=0){
  const colors=['#c59a50','#35594b','#ab5b3c','#e9c56b','#7f9c8a','#d98b6a'];
  return `<div class="confetti" aria-hidden="true">${Array.from({length:30},(_,i)=>`<i style="--x:${Math.round(Math.random()*96)}%;--d:${(startAt+Math.random()*.5).toFixed(2)}s;--t:${(1.3+Math.random()*1.1).toFixed(2)}s;--r:${Math.round(Math.random()*720-360)}deg;--s:${(.7+Math.random()*.6).toFixed(2)};--c:${colors[i%colors.length]}"></i>`).join('')}</div>`;
}
function finish(id){
  if(!has(id)){state.stamps.push(id);justEarned=id;save()}
  render();
  const n=state.stamps.length;
  open('STAMP COLLECTED',`<div class="result stamp-celebration">${n===3?confetti():''}<div class="stamp-impact" style="--tilt:${tasks.find(t=>t.id===id).tilt}deg">${stampArt(tasks.find(t=>t.id===id),true)}</div><h2>${n===3?'ครบ 3 ดวงแล้ว!':'ประทับความสนุกแล้ว!'}</h2><p>${tasks.find(t=>t.id===id).short} สำเร็จแล้ว<br>ตอนนี้มี ${n} / 3 ดวง</p><button class="primary wide" id="continue">${n===3?'ไปเปิดกล่องของขวัญ':'แวะจุดต่อไป'} ${icon('arrow')}</button></div>`);
  $('#continue').onclick=()=>{modal.close();$(n===3?'.gift':'#journey-map').scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'center'})};
}
// After the stamp dialog closes, press the new stamp into the passport and the map.
function pressNewStamp(){
  if(!justEarned)return;
  for(const el of [$(`[data-stamp="${justEarned}"]`),$(`[data-stop="${justEarned}"]`)])el?.classList.add('just-earned');
  justEarned=null;
}

// Draw sequence (CSS timed): box shakes 0–0.9s while names roll, lid flies off at ~1s,
// light rays + the prize pop out, confetti falls, then the result text appears at ~1.7s.
const PRIZE_ICONS={'ขนม':'cookie','ลูกอม':'candy','สติ๊กเกอร์':'sticker'};
function animatedGift(prize){return `<div class="opening-gift" aria-hidden="true"><div class="gift-rays"></div><div class="gift-halo"></div><span class="gift-spark one">${icon('spark')}</span><span class="gift-spark two">${icon('spark')}</span><span class="gift-spark three">${icon('spark')}</span><div class="gift-box"><div class="box-base"><i></i></div><div class="box-lid"><span class="bow-left"></span><span class="bow-right"></span><i></i></div><span class="gift-emblem">${icon('gift')}</span></div><span class="prize-pop">${icon(PRIZE_ICONS[prize]||'gift')}</span></div>`}
function prizeRoller(prize){
  const names=[];for(let i=0;i<3;i++)names.push(...shuffle([...PRIZES]));names.push(prize);
  return `<div class="prize-roller" aria-hidden="true"><span>กำลังสุ่ม</span><div class="roller-window"><div class="roller-strip" style="--steps:${names.length-1}">${names.map(n=>`<b>${n}</b>`).join('')}</div></div></div>`;
}
function openReward(){
  if(state.stamps.length!==3||state.prize)return;
  // Save first so closing, reloading, or tapping twice cannot change this draw.
  state.prize=PRIZES[Math.floor(Math.random()*PRIZES.length)];
  save();render();
  open('A SOUVENIR FROM AYUTTHAYA',`<div class="result reward-opening">${confetti(1.05)}${animatedGift(state.prize)}${prizeRoller(state.prize)}<div class="reward-reveal"><span class="eyebrow">ของขวัญจากการเดินทางครั้งนี้</span><h2>คุณได้รับ${state.prize}!</h2><p>รับของรางวัลได้ที่บูธ Silvora เลย<br>ผลสุ่มบันทึกไว้แล้ว กลับมาดูได้เสมอ</p><button class="primary wide" id="done">เก็บของขวัญของฉัน</button></div></div>`);
  $('#done').onclick=()=>modal.close();
}

// Staff-only reset, protected by a PIN. After PIN_TRIES wrong attempts the reset locks
// for PIN_LOCK_MS; the lock is stored so reloading the page does not clear it.
// The PIN sits in this file, so it only keeps players from resetting by accident or on a whim.
const STAFF_PIN='1010',PIN_TRIES=3,PIN_LOCK_MS=5*60*1000,LOCK_KEY='silvora-staff-lock';
function pinLock(){let l=null;try{l=JSON.parse(localStorage.getItem(LOCK_KEY))}catch{}if(!l||typeof l.fails!=='number')l={fails:0,until:0};if(l.until&&l.until<=Date.now())l={fails:0,until:0};return l}
function savePinLock(l){try{localStorage.setItem(LOCK_KEY,JSON.stringify(l))}catch{}}
function checkStaffPin(pin){// 'ok' | 'wrong' | 'locked'
  const l=pinLock();
  if(l.until)return'locked';
  if(pin===STAFF_PIN){savePinLock({fails:0,until:0});return'ok'}
  l.fails++;if(l.fails>=PIN_TRIES)l.until=Date.now()+PIN_LOCK_MS;
  savePinLock(l);return l.until?'locked':'wrong';
}
function resetGame(){state={stamps:[],prize:null};justEarned=null;save();render()}
function openReset(){
  const l=pinLock();
  if(l.until){open('STAFF ONLY',`<div class="result"><div class="result-icon">${icon('clock')}</div><h2>ล็อกการเริ่มใหม่ชั่วคราว</h2><p>ใส่รหัสผิดครบ ${PIN_TRIES} ครั้ง<br>ลองใหม่ได้ในอีก ${Math.ceil((l.until-Date.now())/60000)} นาที</p></div>`);return}
  open('STAFF ONLY',`<h2>เริ่มรอบใหม่</h2><p>สำหรับเจ้าหน้าที่ แสตมป์และผลรางวัลบนเครื่องนี้จะถูกล้าง</p><form id="pin-form" class="pin-form"><input id="pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="รหัสเจ้าหน้าที่ 4 หลัก" aria-label="รหัสเจ้าหน้าที่" required><p id="pin-error" class="pin-error" role="alert">${l.fails?`ใส่ได้อีก ${PIN_TRIES-l.fails} ครั้ง`:''}</p><button class="primary wide">ยืนยันเริ่มใหม่</button></form>`);
  $('#pin-form').onsubmit=e=>{
    e.preventDefault();
    const result=checkStaffPin($('#pin').value.trim());
    if(result==='ok'){resetGame();modal.close();toast('เริ่มรอบใหม่แล้ว');return}
    if(result==='locked')return openReset();
    $('#pin-error').textContent=`รหัสไม่ถูกต้อง เหลืออีก ${PIN_TRIES-pinLock().fails} ครั้ง`;
    $('#pin').value='';$('#pin').focus?.();
  };
}

$('#journey-map').onclick=e=>{const b=e.target.closest('[data-stop]');if(b)startTask(b.dataset.stop)};
$('#draw').onclick=openReward;
$('#close').onclick=()=>modal.close();
modal.addEventListener('close',()=>{clearInterval(timer);session++;pressNewStamp()});
$('#start').onclick=()=>{const t=nextTask();if(t)return startTask(t.id);$('.gift').scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'center'})};
$('#help').onclick=()=>open('HOW TO PLAY',`<h2>เล่น สะสม แล้วลุ้นของขวัญ</h2><ol class="howto">${[['compass','ตอบคำถามให้ถูกภายใน 10 วินาที'],['map','จับคู่ภาพกับชื่อสถานที่ 3 คู่ใน 30 วินาที'],['heart','กดไลค์เพจ Silvora แล้วกลับมารับแสตมป์อัตโนมัติ'],['gift','ครบ 3 แสตมป์ เปิดกล่องสุ่ม 1 ครั้ง แล้วรับของที่บูธ']].map(([ic,text])=>`<li>${icon(ic)}<span>${text}</span></li>`).join('')}</ol><p class="note">แสตมป์เก็บไว้ในเบราว์เซอร์เครื่องนี้ กรุณาเล่นด้วยเครื่องเดิมจนจบ และอย่าล้างข้อมูลเว็บไซต์ระหว่างเล่น</p>`);
$('#reset').onclick=openReset;
render();
