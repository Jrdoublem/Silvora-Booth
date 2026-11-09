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
  open('จุดแวะ 03 / 3 · LIKE SILVORA',`<h2>กดไลค์เพจ Silvora</h2><p>กดไลค์เพจ Facebook ของ Silvora<br>แล้วกดย้อนกลับมาหน้าเกม รับแสตมป์อัตโนมัติได้เลย</p><a class="primary wide" id="visit-page" href="https://www.facebook.com/profile.php?id=61561262889835" target="_self" rel="noreferrer">ไปกดไลค์เพจ Silvora ${icon('external')}</a><p class="note">ถ้าเปิดในแอป Facebook ให้กลับมาที่เบราว์เซอร์เดิม</p>`);
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
