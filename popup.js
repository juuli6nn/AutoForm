document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fillHighest').addEventListener('click', () => {
    fillForm('5');
  });

  document.getElementById('fillLowest').addEventListener('click', () => {
    fillForm('1');
  });

  document.getElementById('fillCustom').addEventListener('click', () => {
    const val = document.getElementById('customRating').value;
    if (val >= 1 && val <= 5) {
      fillForm(val);
    } else {
      alert('Please enter a number between 1 and 5');
    }
  });

  function fillForm(value) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (val) => {
          const dropdowns = document.querySelectorAll('select');
          console.log('Dropdowns found:', dropdowns.length);
          dropdowns.forEach(dropdown => {
            dropdown.value = val;
            dropdown.dispatchEvent(new Event('change'));
          });
        },
        args: [value]
      });
    });
  }
});
