function injectModal() {
  let wrap = document.createElement('div');
  wrap.innerHTML = `
  <style>
  .ld-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .3);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }
  .ld-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    width: 200px;
    height: 200px;
  }
  .ld-panel input {
    display: inline-block;
    outline: none;
    width: 100px;
    height: 15px;
    background: #eee;
  }
  .ld-btn-group {
    margin-top: 4px;
  }

  .ld-setted::before {
    content: '';
    width: 10px;
    height: 10px;
    background: red;
  }
  #ld-setting {
    position: fixed;
    z-index: 9990;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 20px;
    user-select: none;
  }
  </style>
  <div class="ld-modal" style="display:none;">
  <div class="ld-panel">
    <span>抢券时间：</span>
    <div>年<input type="text" id="ld-year"></div>
    <div>月<input type="text" id="ld-month"></div>
    <div>日<input type="text" id="ld-date"></div>
    <div>时<input type="text" id="ld-hour"></div>
    <div>分<input type="text" id="ld-min"></div>
    <div>秒<input type="text" id="ld-sec"></div>
    <div class="ld-btn-group">
        <button id="ld-sure">确认</button>
        <button id="ld-cancel">取消</button>
    </div>
  </div>
</div>
`;
  if (!document.querySelector('.ld-modal')) {
    document.body.appendChild(wrap);
  }
}

function genClickTask(prevCoupon) {
  let tag = document.createElement('div');
  tag.innerHTML = 'ing';
  tag.style.display = 'inline-block';
  tag.style.width = '40px';
  tag.style.background = '#fff';
  tag.style.color = '#000';
  tag.style.position ='absolute';
  tag.style.zIndex = 999;
  tag.style.left = prevCoupon.pageX + 'px';
  tag.style.top = prevCoupon.pageY + 'px';
  document.body.appendChild(tag);
  console.log(tag.style.left);
  console.log(tag.style.top);

  // prevCoupon.target.addEventListener('click', () => {
  //   console.log('time to excute');
  // });
  function excute() {
    prevCoupon.target.click();
    setTimeout(() => {
      document.body.removeChild(tag);
    }, 30);
  }

  countDown(prevCoupon.time, excute);
}

function countDown(time, excute) {
  let now = Date.now();
  let fiveSec = 5000;
  if (time - now <= 0) {
    excute();
    return;
  }

  if (time - now > fiveSec) {
    setTimeout(() => {
      countDown(time, excute);
    }, fiveSec);
  } else {
    setTimeout(() => {
      excute();
    }, time - now);
  }
}

function inject() {
  injectModal();
  if (window.ldCoupon) {
    return;
  }
  window.ldCoupon = 12;


  let modal = document.querySelector('.ld-modal');
  let prevCoupon = {};

  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  window.addEventListener('mousemove', (e) => {
    if (modal.style.display === 'none') {
      prevCoupon.clientX = e.clientX;
      prevCoupon.clientY = e.clientY;
      prevCoupon.pageY = e.pageY;
      prevCoupon.pageX = e.pageX;
    }
  });

  window.addEventListener('mousedown', (e) => {
    if (3 === e.which) {
      if (modal.style.display === 'none') {
        let target = document.elementFromPoint(prevCoupon.clientX, prevCoupon.clientY);
        prevCoupon.target = target;
        modal.style.display = 'flex';
      } else {
        modal.style.display = 'none';
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    if (81 === e.which) {
      if (modal.style.display === 'none') {
        let target = document.elementFromPoint(prevCoupon.clientX, prevCoupon.clientY);
        prevCoupon.target = target;
        modal.style.display = 'flex';
      } else {
        modal.style.display = 'none';
      }
    }
  });

  document.querySelector('#ld-cancel').addEventListener('click', () => {
    prevCoupon = {};
    modal.style.display = 'none';
  });

  document.querySelector('#ld-sure').addEventListener('click', () => {
    let year = Number(document.querySelector('#ld-year').value);
    let month = Number(document.querySelector('#ld-month').value);
    let date = Number(document.querySelector('#ld-date').value);
    let hour = Number(document.querySelector('#ld-hour').value);
    let min = Number(document.querySelector('#ld-min').value);
    let sec = Number(document.querySelector('#ld-sec').value);

    // 生成定时任务
    let time = new Date(year, month - 1, date, hour, min, sec, 0);
    prevCoupon.time = time;
    genClickTask(prevCoupon);

    prevCoupon = {};
    modal.style.display = 'none';
  });
}


inject();
