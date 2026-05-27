function spawnRipple(el, e) {
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top  - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  el.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

const ratingModeBtn   = document.getElementById('ratingModeBtn');
const frequencyModeBtn= document.getElementById('frequencyModeBtn');
const ratingMode      = document.getElementById('ratingMode');
const frequencyMode   = document.getElementById('frequencyMode');
const segmentTrack    = document.querySelector('.segment-track');

function switchMode(show, hide, btn, otherBtn, trackOffset) {
  hide.classList.remove('active');
  segmentTrack.style.transform = trackOffset;
  btn.classList.add('active');
  otherBtn.classList.remove('active');
  show.classList.add('active');

  const c = document.querySelector('.modes-container');
  c.style.height = show.scrollHeight + 'px';
}

// Measure the tallest panel and set the container height so it doesn't collapse
function seedHeight() {
  const c = document.querySelector('.modes-container');
  [ratingMode, frequencyMode].forEach(p => p.style.visibility = 'visible');
  const h = Math.max(ratingMode.scrollHeight, frequencyMode.scrollHeight);
  [ratingMode, frequencyMode].forEach(p => p.style.visibility = '');
  c.style.height = h + 'px';
}

// Double rAF ensures fonts and layout are fully settled before measuring
requestAnimationFrame(() => requestAnimationFrame(seedHeight));

ratingModeBtn.addEventListener('click', () => {
  if (ratingModeBtn.classList.contains('active')) return;
  switchMode(ratingMode, frequencyMode, ratingModeBtn, frequencyModeBtn, 'translateX(0)');
});

frequencyModeBtn.addEventListener('click', () => {
  if (frequencyModeBtn.classList.contains('active')) return;
  switchMode(frequencyMode, ratingMode, frequencyModeBtn, ratingModeBtn, 'translateX(calc(100% + 8px))');
});

const slider      = document.getElementById('ratingSlider');
const sliderValue = document.getElementById('sliderValue');
const sliderFill  = document.querySelector('.slider-fill');

let lastSliderVal = slider.value;

function updateSlider(value) {
  const pct = ((value - 1) / 4) * 100;
  if (sliderFill) sliderFill.style.width = `${pct}%`;
  sliderValue.style.left = `${pct}%`;

  if (value !== lastSliderVal) {
    sliderValue.textContent = value;
    sliderValue.classList.remove('popping');
    void sliderValue.offsetWidth;
    sliderValue.classList.add('popping');
    lastSliderVal = value;
  }
}

updateSlider(slider.value);
slider.addEventListener('input', (e) => updateSlider(e.target.value));

const fillButton = document.getElementById('fillCustom');
const fillText   = document.getElementById('fillText');
const fillIcon   = document.getElementById('fillIcon');

fillButton.addEventListener('click', (e) => {
  spawnRipple(fillButton, e);
  const rating = slider.value;
  chrome.runtime.sendMessage({ action: 'fillForm', value: rating, type: 'rating' });

  fillButton.classList.add('success');
  fillText.style.display = 'none';
  fillIcon.style.display = 'block';

  setTimeout(() => {
    fillButton.classList.remove('success');
    fillText.style.display = 'block';
    fillIcon.style.display = 'none';
  }, 1500);
});

function wireActionCard(id, value) {
  const btn = document.getElementById(id);
  btn.addEventListener('click', (e) => {
    spawnRipple(btn, e);
    chrome.runtime.sendMessage({ action: 'fillForm', value, type: 'rating' });
  });
}

wireActionCard('fillHighest', '5');
wireActionCard('fillLowest',  '1');

function wireFreqBtn(id, value) {
  const btn = document.getElementById(id);
  btn.addEventListener('click', (e) => {
    spawnRipple(btn, e);
    chrome.runtime.sendMessage({ action: 'fillForm', value, type: 'frequency' });
  });
}

wireFreqBtn('fillWeekly',  '1');
wireFreqBtn('fillMonthly', '2');
wireFreqBtn('fillTerm',    '3');
wireFreqBtn('fillYear',    '4');
wireFreqBtn('fillOthers',  '5');
