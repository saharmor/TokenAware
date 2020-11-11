function roundNum(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

function checkIfPageLoaded() {
  if (!$('.slider-container')[0]) {
    return false;
  }
  return true;
}

function countWords() {
  const responseLen = Number($('.slider-container .text-input')[0]["value"].trim());
  const bestOf = Number($('.slider-container .text-input')[5]["value"].trim());
  const engine = $('.engine-select').find('[class$="singleValue"]')[0].textContent;
  const engineFactor = enginesCreditsMapping[engine];

  let promptTokensSize = 0;
  $('span[data-text=true]').each(function () {
    promptTokensSize += $(this).text().length / 4;
  });

  const completionSize = (responseLen * bestOf);
  const billedCreditsTotal = roundNum((promptTokensSize / engineFactor) + (completionSize / engineFactor));
  const billedCreditsStrBreakdown = `${roundNum(promptTokensSize / engineFactor)} prompt + ${roundNum(completionSize / engineFactor)} completion`;
  const billedCreditsElement = `<div class="tokens-div"> Billed credits: <u>${Math.ceil(billedCreditsTotal)}</u> (${billedCreditsStrBreakdown})</div>`
  if ($('.tokens-div').length) {
    $('.tokens-div').replaceWith(billedCreditsElement);
  } else {
    $('.pg-header-section.pg-header-title').append(billedCreditsElement);
  }

  checkMaxTokensError(promptTokensSize + responseLen);
}

function checkMaxTokensError(promptTokensSize) {
  const elementAlreadyExist = $('.exceeded-prompts-error-msg').length;
  if (promptTokensSize > maxTokenSize) {
    const exceededTokensMsg = `<div class="exceeded-prompts-error-msg"><b>Prompt exceeds maximum of ${maxTokenSize} tokens (${Math.ceil(Math.abs(maxTokenSize - promptTokensSize))} too much)</b></div>`
    if (!elementAlreadyExist) {
      $('.pg-header-section.pg-header-title').append(exceededTokensMsg);
    } else {
      $('.exceeded-prompts-error-msg').replaceWith(exceededTokensMsg);
    }
  } else {
    $('.exceeded-prompts-error-msg').remove();
  }
}

if (document.readyState !== 'complete') {
  window.addEventListener('load', registerWhenPageLoad);
} else {
  registerWhenPageLoad();
}

function registerEditorListeners() {
  $('div[data-contents=true]').on('DOMSubtreeModified paste', function () {
    countWords();
  });

  $('.engine-select').find('[class$="singleValue"]').on('DOMSubtreeModified', function () {
    countWords();
  });

  $('.app-select-container').find('[class$="singleValue"]').on('DOMSubtreeModified', function () {
    countWords();
  });

  $('.slider-container').on('DOMSubtreeModified input change paste propertychange', function () {
    countWords();
  });

  $('.rc-slider').on('click mousedown mousemove', function () {
    countWords();
  });

  countWords();
}

function registerWhenPageLoad() {
  setTimeout(function () {
    if (!checkIfPageLoaded()) {
      setTimeout(function () {
        registerWhenPageLoad();
      }, pageLoadWaitIntervals);
      return;
    }
    registerEditorListeners();
  }, pageLoadWaitIntervals);
}
