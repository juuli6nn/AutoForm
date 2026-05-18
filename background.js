chrome.runtime.onInstalled.addListener(() => {
  console.log('Auto Fill Evaluation Extension Installed');
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: fillFormContent,
        args: [request.value]
      });
    });
  }
});

// Content script function that will be injected
function fillFormContent(value) {
  console.log('Starting form fill with value:', value);
  
  // Function to trigger change event
  const triggerChange = (element) => {
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  };

  // Handle Google Forms specifically first
  const isGoogleForm = window.location.hostname.includes('docs.google.com') || 
                      window.location.hostname.includes('forms.google.com');
  
  if (isGoogleForm) {
    console.log('Detected Google Form');
    
    // Method 1: Direct radio button selection
    const allRadioButtons = document.querySelectorAll('div[role="radio"]');
    console.log('Found Google Form radio buttons:', allRadioButtons.length);
    
    // Group radio buttons by their question
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

    // Fill each question
    questionGroups.forEach((radios, container) => {
      const sortedRadios = radios.sort((a, b) => {
        const aIndex = Array.from(container.querySelectorAll('div[role="radio"]')).indexOf(a);
        const bIndex = Array.from(container.querySelectorAll('div[role="radio"]')).indexOf(b);
        return aIndex - bIndex;
      });
      
      const index = Math.min(parseInt(value) - 1, sortedRadios.length - 1);
      if (sortedRadios[index]) {
        console.log('Clicking radio button at index:', index);
        sortedRadios[index].click();
      }
    });

    // Method 2: Alternative approach using aria-label
    const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    const targetLabel = ratingLabels[parseInt(value) - 1];
    
    const labeledRadios = document.querySelectorAll(`div[role="radio"][aria-label*="${targetLabel}"]`);
    console.log('Found labeled radio buttons:', labeledRadios.length);
    labeledRadios.forEach(radio => {
      radio.click();
    });

    // Method 3: Try to find and click the radio button container
    const radioContainers = document.querySelectorAll('.freebirdFormviewerViewItemsRadioOptionContainer');
    console.log('Found radio containers:', radioContainers.length);
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

  // Handle regular forms
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  console.log('Found regular radio buttons:', radioButtons.length);
  
  // Group radio buttons by name
  const radioGroups = {};
  radioButtons.forEach(radio => {
    if (!radioGroups[radio.name]) {
      radioGroups[radio.name] = [];
    }
    radioGroups[radio.name].push(radio);
  });

  // Fill each group
  Object.values(radioGroups).forEach(group => {
    const sortedGroup = group.sort((a, b) => a.value - b.value);
    const index = Math.min(parseInt(value) - 1, sortedGroup.length - 1);
    if (sortedGroup[index]) {
      sortedGroup[index].checked = true;
      triggerChange(sortedGroup[index]);
    }
  });

  // Try to fill select dropdowns
  const dropdowns = document.querySelectorAll('select');
  console.log('Found dropdowns:', dropdowns.length);
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

  // Try to fill number inputs
  const numberInputs = document.querySelectorAll('input[type="number"]');
  console.log('Found number inputs:', numberInputs.length);
  numberInputs.forEach(input => {
    const max = parseInt(input.max) || 5;
    const min = parseInt(input.min) || 1;
    const normalizedValue = Math.min(Math.max(parseInt(value), min), max);
    input.value = normalizedValue;
    triggerChange(input);
  });

  // Try to fill text inputs that might be for ratings
  const textInputs = document.querySelectorAll('input[type="text"]');
  console.log('Found text inputs:', textInputs.length);
  textInputs.forEach(input => {
    const label = input.previousElementSibling?.textContent?.toLowerCase() || '';
    const placeholder = input.placeholder?.toLowerCase() || '';
    const name = input.name?.toLowerCase() || '';
    const id = input.id?.toLowerCase() || '';

    if (label.includes('rating') || 
        placeholder.includes('rating') || 
        name.includes('rating') ||
        id.includes('rating') ||
        label.includes('score') || 
        placeholder.includes('score') ||
        name.includes('score') ||
        id.includes('score')) {
      input.value = value;
      triggerChange(input);
    }
  });

  console.log('Form fill completed');
}