const enginesCreditsMapping = {'davinci': 1, 'curie': 10, 'babbage': 50, 'ada': 75};
const maxTokenSize = 2048;

function roundNum(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

function runOnChange() {
  // check if page is ready
  if (!$('.slider-container')[0]) {
    return;
  }

  countWords();
}

function countWords() {
  const responseLen = Number($('.slider-container')[0].children[0].children[1].textContent.trim());
  const bestOf = $('.slider-container')[5].children[0].children[1].textContent.trim();
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
  window.addEventListener('load', registerEditorListener);
} else {
  registerEditorListener();
}

function registerEditorListener() {
  setTimeout(function () {
    $('div[data-contents=true]').on('DOMSubtreeModified paste', function () {
      runOnChange();
    });

    $('.engine-select').find('[class$="singleValue"]').on('DOMSubtreeModified', function () {
      runOnChange();
    });

    $('.app-select-container').find('[class$="singleValue"]').on('DOMSubtreeModified', function () {
      runOnChange();
    });

    $('.slider-container').on('DOMSubtreeModified', function () {
      runOnChange();
    });

    runOnChange();
  }, 5000);
}
