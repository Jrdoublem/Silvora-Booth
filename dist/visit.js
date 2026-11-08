// Visit tracking only: this does not read or verify Facebook likes.
const VISIT_KEY='silvora-page-visit-v1';
function pendingVisit(){try{return JSON.parse(sessionStorage.getItem(VISIT_KEY))}catch{return null}}
function markVisitAway(){const visit=pendingVisit();if(visit){try{sessionStorage.setItem(VISIT_KEY,JSON.stringify({left:true}))}catch{}}}
function completeVisit(){
  const visit=pendingVisit();if(!visit?.left)return;
  try{sessionStorage.removeItem(VISIT_KEY)}catch{}
  if(!state.stamps.includes('page'))finish('page');
}
function page(){
  open('จุดแวะ 03 / 3 · VISIT SILVORA',`<h2>แวะเยี่ยมเพจ Silvora</h2><p>เปิดเพจ Facebook เพื่อรู้จัก Silvora ให้มากขึ้น<br>แล้วกดย้อนกลับมาหน้าเกม รับแสตมป์อัตโนมัติได้เลย</p><a class="primary wide" id="visit-page" href="https://www.facebook.com/profile.php?id=61561262889835" target="_self" rel="noreferrer">ไปเยี่ยมชมเพจ Silvora ↗</a><p class="note">แสตมป์นี้สำหรับการเปิดลิงก์เยี่ยมชมเพจ ไม่ได้ตรวจการกดไลค์<br>ถ้าเปิดในแอป Facebook ให้กลับมาเบราว์เซอร์เดิม</p>`);
  $('#visit-page').onclick=event=>{
    try{sessionStorage.setItem(VISIT_KEY,JSON.stringify({left:false}));}
    catch{event.preventDefault();toast('กรุณาอนุญาตการบันทึกข้อมูลเว็บไซต์ แล้วลองใหม่');return}
    modal.close();
  };
}
window.addEventListener('pagehide',markVisitAway);
window.addEventListener('pageshow',completeVisit);
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden')markVisitAway();
  else if(document.visibilityState==='visible')completeVisit();
});
