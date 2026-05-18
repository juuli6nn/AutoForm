// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const body = document.body;

// Check system preference on load
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDark) {
  body.classList.add('dark');
  sunIcon.style.display = 'none';
  moonIcon.style.display = 'block';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  
  sunIcon.style.display = isDark ? 'none' : 'block';
  moonIcon.style.display = isDark ? 'block' : 'none';
});

// ============================================
// SLIDER VALUE DISPLAY
// ============================================
const slider = document.getElementById('ratingSlider');
const sliderValue = document.getElementById('sliderValue');

slider.addEventListener('input', (e) => {
  sliderValue.textContent = e.target.value;
});

// ============================================
// FILL BUTTON FLASH ANIMATION
// ============================================
const fillButton = document.getElementById('fillCustom');
const fillText = document.getElementById('fillText');
const fillIcon = document.getElementById('fillIcon');

fillButton.addEventListener('click', () => {
  // Add success state
  fillButton.classList.add('success');
  fillText.style.display = 'none';
  fillIcon.style.display = 'block';

  // Remove success state after 1.5s
  setTimeout(() => {
    fillButton.classList.remove('success');
    fillText.style.display = 'block';
    fillIcon.style.display = 'none';
  }, 1500);
});

// ============================================
// ACTION BUTTON HANDLERS (Placeholder)
// ============================================
document.getElementById('fillHighest').addEventListener('click', () => {
  console.log('Fill Highest clicked');
  // Add your fill highest logic here
});

document.getElementById('fillLowest').addEventListener('click', () => {
  console.log('Fill Lowest clicked');
  // Add your fill lowest logic here
});
