// Places on the Silvora Route that have a photo in assets/places/<id>.jpg.
// To add a place: put its photo in assets/places/ and add one entry here.
// `correct` is the index of the right answer in `choices`; choices are shuffled when shown.
const templePhotos = [
  {id:'mahathat', name:'วัดมหาธาตุ', description:'เศียรพระพุทธรูปที่ถูกรากไม้โอบล้อม',
    question:'เศียรพระในรากไม้ในภาพเป็นจุดเด่นของวัดใด?', choices:['วัดมหาธาตุ','วัดธรรมิกราช','วัดท่าการ้อง'], correct:0},
  {id:'sanphet', name:'วัดพระศรีสรรเพชญ์', description:'เจดีย์ทรงลังกาสามองค์เรียงกัน',
    question:'เจดีย์ทรงลังกา 3 องค์เรียงกันในภาพอยู่ที่วัดใด?', choices:['วัดไชยวัฒนาราม','วัดพระศรีสรรเพชญ์','วัดหน้าพระเมรุ'], correct:1},
  {id:'namen', name:'วัดหน้าพระเมรุ', description:'พระพุทธรูปทรงเครื่ององค์ใหญ่ในพระอุโบสถ',
    question:'พระพุทธรูปทรงเครื่องในภาพอยู่ที่วัดใด ซึ่งเป็นวัดที่ไม่ถูกทำลายเมื่อเสียกรุงครั้งที่ 2?', choices:['วัดมหาธาตุ','วัดพระศรีสรรเพชญ์','วัดหน้าพระเมรุ'], correct:2},
  {id:'thammikarat', name:'วัดธรรมิกราช', description:'เจดีย์ที่มีรูปปั้นสิงห์ล้อมรอบฐาน',
    question:'เจดีย์ของวัดธรรมิกราชในภาพ มีรูปปั้นสัตว์ใดล้อมรอบฐาน?', choices:['ช้าง','สิงห์','พญานาค'], correct:1},
  {id:'pomphet', name:'ป้อมเพชร', description:'ป้อมปราการอิฐริมแม่น้ำ',
    question:'ป้อมเพชรในภาพ สร้างขึ้นเพื่อทำหน้าที่อะไร?', choices:['ป้องกันข้าศึกที่มาทางน้ำ','เป็นท่าเรือค้าขาย','เป็นที่ประทับของกษัตริย์'], correct:0},
  {id:'chai', name:'วัดไชยวัฒนาราม', description:'พระปรางค์ประธานและปรางค์รายริมแม่น้ำเจ้าพระยา',
    question:'พระปรางค์ของวัดไชยวัฒนารามในภาพ ได้รับอิทธิพลรูปแบบมาจากที่ใด?', choices:['ปราสาทนครวัด','เจดีย์ชเวดากอง','พระธาตุพนม'], correct:0},
  {id:'takarong', name:'วัดท่าการ้อง', description:'วัดท่าการ้องริมแม่น้ำ',
    question:'วัดท่าการ้องในภาพ ตั้งอยู่ติดแม่น้ำสายใด?', choices:['แม่น้ำเจ้าพระยา','แม่น้ำป่าสัก','แม่น้ำน่าน'], correct:0},
  {id:'prasatnakhonluang', name:'ปราสาทนครหลวง', description:'ปราสาทนครหลวงริมแม่น้ำป่าสัก',
    question:'ปราสาทนครหลวงในภาพ สร้างขึ้นในรัชสมัยของพระมหากษัตริย์พระองค์ใด?', choices:['สมเด็จพระเจ้าปราสาททอง','สมเด็จพระนเรศวรมหาราช','สมเด็จพระนารายณ์มหาราช'], correct:0},
  {id:'watnakhonluang', name:'วัดนครหลวง', description:'อาคารสีเหลืองหลังคาแดงมียอดแหลมในวัดนครหลวง',
    question:'วัดนครหลวงในภาพ เคยมีชื่อเรียกเดิมว่าอะไร?', choices:['วัดพระบาทสี่รอย','วัดมุขราช','วัดพระเมรุราชการาม'], correct:0},
  {id:'maiprachumphon', name:'วัดใหม่ประชุมพล', description:'เจดีย์ประธานก่ออิฐทรงสูงของวัดใหม่ประชุมพล',
    question:'เจดีย์ประธานของวัดใหม่ประชุมพลในภาพ เป็นเจดีย์แบบใด?', choices:['เจดีย์ย่อมุมไม้สิบสอง','เจดีย์ทรงระฆังกลม','พระปรางค์แบบขอม'], correct:0},
  {id:'watklang', name:'วัดกลาง', description:'มณฑปหลังคาทรงจอมของวัดกลาง อำเภอนครหลวง',
    question:'มณฑปของวัดกลางในภาพ ภายในมีประติมากรรมเล่าเรื่องอะไร?', choices:['พระกัสสปะถวายบังคมพระศพพระพุทธเจ้า','พระพุทธเจ้าเสด็จลงจากดาวดึงส์','พระพุทธเจ้าผจญมาร'], correct:0},
];
const MATCH_PAIRS = 3;

function templeImage(photo) {
  return `<img src="assets/places/${photo.id}.jpg" alt="${photo.description}">`;
}

function preparePhotoRound(title, heading, instruction, photos, startLabel, startRound) {
  open(title, `<h2>${heading}</h2><p>${instruction}</p><div class="photo-preview" id="photo-preview">${photos.map(templeImage).join('')}</div><p id="photo-status" role="status">กำลังโหลดภาพ…</p><button id="begin" class="primary wide" disabled>${startLabel}</button>`);
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
  const answers = shuffle(photo.choices.map((text, i) => ({text, right: i === photo.correct})));
  preparePhotoRound('จุดแวะ 01 / 3 · QUICK QUIZ', 'ตอบไว รู้ใจอยุธยา', 'ดูภาพแล้วตอบคำถามให้ถูกภายใน 10 วินาที', [photo], 'เริ่มจับเวลา', () => {
    open('ตอบให้ถูก รับ 1 แสตมป์', `<div class="timer"><span id="seconds">10</span> <small>วินาที</small></div><div class="question-photo">${templeImage(photo)}</div><h2>${photo.question}</h2>${answers.map((answer, i) => `<button class="answer" data-answer="${i}">${answer.text}</button>`).join('')}`);
    const timeout = () => retry('หมดเวลาแล้ว ลองอีกครั้งได้เลย', quiz);
    const alive = countdown(10, timeout);
    document.querySelectorAll('[data-answer]').forEach(button => {
      button.onclick = () => {
        if (!alive()) return timeout();
        clearInterval(timer);
        if (answers[Number(button.dataset.answer)].right) finish('quiz');
        else retry('ยังไม่ถูก ลองคำถามใหม่กัน', quiz);
      };
    });
  });
}

// Each round uses a fresh random set of places.
function match() {
  const set = shuffle([...templePhotos]).slice(0, MATCH_PAIRS);
  preparePhotoRound('จุดแวะ 02 / 3 · MATCH & DISCOVER', 'จับคู่ภาพกับชื่อสถานที่', `แตะภาพถ่าย แล้วเลือกชื่อสถานที่ให้ตรงกันทั้ง ${MATCH_PAIRS} คู่ ภายใน 30 วินาที`, set, 'เริ่มจับคู่', () => startMatching(set));
}

function startMatching(set) {
  const pictures = shuffle([...set]).map(photo => `<button class="tile photo-tile" data-id="${photo.id}" data-kind="image">${templeImage(photo)}</button>`);
  const labels = shuffle([...set]).map(photo => `<button class="tile" data-id="${photo.id}" data-kind="name">${photo.name}</button>`);
  open('จับคู่ให้ครบ รับ 1 แสตมป์', `<div class="timer"><span id="seconds">30</span> <small>วินาที</small></div><p>แตะภาพ 1 ใบ แล้วเลือกชื่อสถานที่ที่ตรงกัน</p><div class="match-grid">${pictures.join('')}${labels.join('')}</div><p id="match-status" aria-live="polite">จับคู่แล้ว 0 / ${set.length} คู่</p>`);
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
        $('#match-status').textContent = `จับคู่แล้ว ${pairs} / ${set.length} คู่`;
        if (pairs === set.length) return finish('match');
      } else {
        $('#match-status').textContent = 'ยังไม่ตรงกัน ลองเลือกใหม่ได้เลย';
      }
      selected = null;
    };
  });
}
