const templePhotos = [
  {id:'chai', name:'วัดไชยวัฒนาราม', description:'กลุ่มพระปรางค์และอาคารอิฐ', question:'วัดไชยวัฒนารามในภาพอยู่ในจังหวัดใด?', choices:['พระนครศรีอยุธยา','เชียงใหม่','สุโขทัย'], correct:0},
  {id:'sanphet', name:'วัดพระศรีสรรเพชญ์', description:'เจดีย์ทรงระฆังเรียงกันสามองค์', question:'เจดีย์ใหญ่สามองค์ในภาพเป็นจุดเด่นของวัดใด?', choices:['วัดมหาธาตุ','วัดพระศรีสรรเพชญ์','วัดพนัญเชิง'], correct:1},
  {id:'mahathat', name:'วัดมหาธาตุ', description:'เศียรพระโอบล้อมด้วยรากไม้', question:'เศียรพระในรากไม้ในภาพอยู่ที่วัดใด?', choices:['วัดมหาธาตุ','วัดอรุณราชวราราม','วัดพระแก้ว'], correct:0}
];

function templeImage(photo) {
  return `<img src="assets/${photo.id}-photo.jpg" alt="${photo.description}">`;
}

function preparePhotoRound(title, heading, instruction, photos, startLabel, startRound) {
  open(title, `<h2>${heading}</h2><p>${instruction}</p><div class="photo-preview" id="photo-preview">${photos.map(templeImage).join('')}</div><p class="photo-source">ภาพจาก Wikimedia Commons · <a href="photo-credits.html">ดูเครดิตผู้ถ่าย</a></p><p id="photo-status" role="status">กำลังโหลดภาพ…</p><button id="begin" class="primary wide" disabled>${startLabel}</button>`);
  const button = $('#begin');
  const status = $('#photo-status');
  const images = [...document.querySelectorAll('#photo-preview img')];
  Promise.all(images.map(image => image.decode())).then(() => {
    if (!button.isConnected) return;
    status.textContent = 'ภาพพร้อมแล้ว กดเริ่มเมื่อต้องการจับเวลา';
    button.disabled = false;
    button.onclick = startRound;
  }).catch(() => {
    if (!button.isConnected) return;
    status.textContent = 'โหลดภาพไม่สำเร็จ ลองเปิดเกมอีกครั้ง';
    button.textContent = 'ลองโหลดภาพอีกครั้ง';
    button.disabled = false;
    button.onclick = () => preparePhotoRound(title, heading, instruction, photos, startLabel, startRound);
  });
}

function quiz() {
  const photo = templePhotos[Math.floor(Math.random() * templePhotos.length)];
  preparePhotoRound('จุดแวะ 01 / 3 · QUICK QUIZ', 'ตอบไว รู้ใจอยุธยา', 'ดูภาพแล้วตอบคำถามให้ถูกภายใน 10 วินาที', [photo], 'เริ่มจับเวลา', () => {
    open('ตอบให้ถูก รับ 1 แสตมป์', `<div class="timer"><span id="seconds">10</span> <small>วินาที</small></div><div class="question-photo">${templeImage(photo)}</div><h2>${photo.question}</h2>${photo.choices.map((answer, i) => `<button class="answer" data-answer="${i}">${answer}</button>`).join('')}`);
    const timeout = () => retry('หมดเวลาแล้ว ลองอีกครั้งได้เลย', quiz);
    const alive = countdown(10, timeout);
    document.querySelectorAll('[data-answer]').forEach(button => {
      button.onclick = () => {
        if (!alive()) return timeout();
        clearInterval(timer);
        if (Number(button.dataset.answer) === photo.correct) finish('quiz');
        else retry('ยังไม่ถูก ลองคำถามใหม่กัน', quiz);
      };
    });
  });
}

function match() {
  preparePhotoRound('จุดแวะ 02 / 3 · MATCH & DISCOVER', 'จับคู่ภาพกับชื่อวัด', 'แตะภาพถ่าย แล้วเลือกชื่อวัดให้ตรงกันทั้ง 3 คู่ ภายใน 30 วินาที', templePhotos, 'เริ่มจับคู่', startMatching);
}

function startMatching() {
  const pictures = shuffle([...templePhotos]).map(photo => `<button class="tile photo-tile" data-id="${photo.id}" data-kind="image">${templeImage(photo)}</button>`);
  const labels = shuffle([...templePhotos]).map(photo => `<button class="tile" data-id="${photo.id}" data-kind="name">${photo.name}</button>`);
  open('จับคู่ให้ครบ รับ 1 แสตมป์', `<div class="timer"><span id="seconds">30</span> <small>วินาที</small></div><p>แตะภาพ 1 ใบ แล้วเลือกชื่อวัดที่ตรงกัน</p><div class="match-grid">${pictures.join('')}${labels.join('')}</div><p id="match-status" aria-live="polite">จับคู่แล้ว 0 / 3 คู่</p>`);
  let selected = null;
  let pairs = 0;
  const timeout = () => retry('หมดเวลาแล้ว ลองจับคู่ใหม่', match);
  const alive = countdown(30, timeout);
  document.querySelectorAll('.tile').forEach(button => {
    button.onclick = () => {
      if (!alive()) return timeout();
      if (!selected || selected.dataset.kind === button.dataset.kind) {
        selected?.classList.remove('selected');
        selected = button;
        button.classList.add('selected');
        return;
      }
      selected.classList.remove('selected');
      if (selected.dataset.id === button.dataset.id) {
        selected.disabled = button.disabled = true;
        selected.classList.add('matched');
        button.classList.add('matched');
        pairs++;
        $('#match-status').textContent = `จับคู่แล้ว ${pairs} / 3 คู่`;
        if (pairs === 3) return finish('match');
      } else {
        $('#match-status').textContent = 'ยังไม่ตรงกัน ลองเลือกใหม่ได้เลย';
      }
      selected = null;
    };
  });
}
