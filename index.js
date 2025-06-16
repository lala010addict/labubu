// Cache DOM selectors and constants
const NEXT_BUTTON_SELECTOR = 'img.index_nextImg__PTfZF';
const NEXT_BUTTON_SRC = 'https://cdn-global.popmart.com/images/boxPC/bigBox/thBoxNextArrow.png';
const CONTAINER_SELECTOR = 'div.index_bigBoxContainer__dCOK3';
const TARGET_IMAGE_PATTERN = 'box_pic_with_shadow____.png';

let attempts = 0;
const maxAttempts = 2000;
let nextButtonRetries = 0;
const maxNextButtonRetries = 3;

// Cache DOM elements
let container = null;
let nextButton = null;

function findNextButton() {
  if (nextButton) return nextButton;
  
  nextButton = Array.from(document.querySelectorAll(NEXT_BUTTON_SELECTOR))
    .find(img => img.style.display === 'block' && img.src === NEXT_BUTTON_SRC);
  return nextButton;
}

function retryFindNextButton() {
  if (nextButtonRetries >= maxNextButtonRetries) {
    console.log('❌ Next button not found after all retries.');
    nextButtonRetries = 0;
    return;
  }

  const retryNextBtn = findNextButton();
  
  if (retryNextBtn && attempts < maxAttempts) {
    retryNextBtn.click();
    attempts++;
    nextButtonRetries = 0;
    setTimeout(tryClickTargetImage, 300);
  } else {
    nextButtonRetries++;
    setTimeout(retryFindNextButton, 300);
  }
}

function tryClickTargetImage() {
  // Get container if not cached
  if (!container) {
    container = document.querySelector(CONTAINER_SELECTOR);
    if (!container) {
      console.log('❌ Image container not found.');
      return;
    }
  }

  // Use a more efficient query selector
  const targetImg = container.querySelector(`img[src*="${TARGET_IMAGE_PATTERN}"]`);

  if (targetImg) {
    // Scroll and click simultaneously
    targetImg.scrollIntoView({ behavior: 'auto', block: 'center' });
    
    // Multiple click methods in parallel
    targetImg.click();
    targetImg.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    targetImg.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
    targetImg.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
    
    // Quick retry if needed
    setTimeout(() => {
      if (document.querySelector(`img[src*="${TARGET_IMAGE_PATTERN}"]`)) {
        tryClickTargetImage();
      }
    }, 10);
  } else {
    const nextBtn = findNextButton();
    
    if (nextBtn && attempts < maxAttempts) {
      console.log(`🔁 Attempt ${attempts + 1}: Image not found. Clicking next...`);
      nextBtn.click();
      attempts++;
      setTimeout(tryClickTargetImage, 300);
    } else if (attempts >= maxAttempts) {
      console.log('🛑 Reached max attempts. Stopping.');
    } else {
      console.log('⏳ Next button not found, starting retry sequence...');
      nextButtonRetries = 0;
      setTimeout(retryFindNextButton, 300);
    }
  }
}

// Start the process
tryClickTargetImage();



