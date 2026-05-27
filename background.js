chrome.runtime.onInstalled.addListener(() => {
  console.log('Auto Fill Evaluation Extension Installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: fillFormContent,
        args: [request.value, request.type || "rating"]
      });
    });
  }
});

function fillFormContent(value, type = "rating") {
  const triggerChange = (element) => {
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  };

  const isGoogleForm = window.location.hostname.includes('docs.google.com') ||
                      window.location.hostname.includes('forms.google.com');

  if (isGoogleForm) {
    const allRadioButtons = document.querySelectorAll('div[role="radio"]');

    // Group radio buttons by their parent question container
    const questionGroups = new Map();
    allRadioButtons.forEach(radio => {
      const questionContainer = radio.closest('.freebirdFormviewerViewItemsItemItem');
      if (questionContainer) {
        if (!questionGroups.has(questionContainer)) {
          questionGroups.set(questionContainer, []);
        }
        questionGroups.get(questionContainer).push(radio);
      }
    });

    questionGroups.forEach((radios, container) => {
      const sortedRadios = radios.sort((a, b) => {
        const aIndex = Array.from(container.querySelectorAll('div[role="radio"]')).indexOf(a);
        const bIndex = Array.from(container.querySelectorAll('div[role="radio"]')).indexOf(b);
        return aIndex - bIndex;
      });

      const index = Math.min(parseInt(value) - 1, sortedRadios.length - 1);
      if (sortedRadios[index]) {
        sortedRadios[index].click();
      }
    });

    // Fallback: click by aria-label if direct index didn't work
    const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    const targetLabel = ratingLabels[parseInt(value) - 1];

    const labeledRadios = document.querySelectorAll(`div[role="radio"][aria-label*="${targetLabel}"]`);
    labeledRadios.forEach(radio => radio.click());

    // Another fallback: match by position within each option container
    const radioContainers = document.querySelectorAll('.freebirdFormviewerViewItemsRadioOptionContainer');
    radioContainers.forEach(container => {
      const radio = container.querySelector('div[role="radio"]');
      if (radio) {
        const index = Array.from(container.parentElement.querySelectorAll('.freebirdFormviewerViewItemsRadioOptionContainer')).indexOf(container);
        if (index === parseInt(value) - 1) {
          radio.click();
        }
      }
    });
  }

  // FEU Tech evaluation forms use radio buttons with numeric values
  const serviceRadioButtons = document.querySelectorAll('input[type="radio"]');

  const radioGroups = {};
  serviceRadioButtons.forEach(radio => {
    if (!radioGroups[radio.name]) radioGroups[radio.name] = [];
    radioGroups[radio.name].push(radio);
  });

  Object.values(radioGroups).forEach(group => {
    const sortedGroup = group.sort((a, b) => (parseInt(a.value)||0) - (parseInt(b.value)||0));

    // Rating questions have 4 options (SD/D/A/SA); frequency questions have 5.
    // We check option count instead of question text because rating statements
    // can contain words like "visit" or "term" that would cause false matches.
    const isFrequencyGroup = sortedGroup.length === 5;
    const isRatingGroup    = sortedGroup.length === 4;

    if (type === "frequency" && !isFrequencyGroup) return;
    if (type === "rating"    && !isRatingGroup)    return;

    let targetValue;
    if (type === "frequency") {
      targetValue = parseInt(value);
    } else {
      // Form uses a 1–4 scale, so cap any 5-star input at 4 (Strongly Agree)
      targetValue = Math.min(parseInt(value), 4);
    }

    const targetRadio = sortedGroup.find(r => parseInt(r.value) === targetValue);
    if (targetRadio) {
      targetRadio.checked = true;
      targetRadio.click();
      triggerChange(targetRadio);
    }
  });

  // Auto-check the data privacy checkbox if present
  const privacyCheckbox = document.querySelector('input[type="checkbox"]');
  if (privacyCheckbox && !privacyCheckbox.checked) {
    privacyCheckbox.checked = true;
    privacyCheckbox.click();
    triggerChange(privacyCheckbox);
  }

  const dropdowns = document.querySelectorAll('select');
  dropdowns.forEach(dropdown => {
    const options = Array.from(dropdown.options);
    const matchingOption = options.find(opt =>
      opt.value === value ||
      opt.text.includes(value) ||
      opt.text.toLowerCase().includes('rating') ||
      opt.text.toLowerCase().includes('score')
    );
    if (matchingOption) {
      dropdown.value = matchingOption.value;
      triggerChange(dropdown);
    }
  });

  const numberInputs = document.querySelectorAll('input[type="number"]');
  numberInputs.forEach(input => {
    const max = parseInt(input.max) || 5;
    const min = parseInt(input.min) || 1;
    const normalizedValue = Math.min(Math.max(parseInt(value), min), max);
    input.value = normalizedValue;
    triggerChange(input);
  });

  const textInputs = document.querySelectorAll('input[type="text"]');
  textInputs.forEach(input => {
    const label = input.previousElementSibling?.textContent?.toLowerCase() || '';
    const placeholder = input.placeholder?.toLowerCase() || '';
    const name = input.name?.toLowerCase() || '';
    const id = input.id?.toLowerCase() || '';

    if (label.includes('rating') || placeholder.includes('rating') ||
        name.includes('rating')  || id.includes('rating') ||
        label.includes('score')  || placeholder.includes('score') ||
        name.includes('score')   || id.includes('score')) {
      input.value = value;
      triggerChange(input);
    }
  });
}
