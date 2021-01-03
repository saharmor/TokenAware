function checkIfPageLoaded() {
  return $('.slider-container')[0];
}

function isKnownEngine(engineName) {
  return (Object.keys(enginesCreditsMapping).includes(engineName) || freeEngines.includes(engineName));
}

function changeContent(content) {
  const wrappedContent = `<div class="tokens-div">${content}</div>`
  if ($('.tokens-div').length) {
    $('.tokens-div').replaceWith(wrappedContent);
  } else {
    $('.pg-header-section.pg-header-title').append(wrappedContent);
  }
}

function updateTokensUsage(engineName) {
  const responseLen = Number($('.slider-container .text-input')[0]["value"].trim());
  const bestOf = Number($('.slider-container .text-input')[5]["value"].trim());
  const engineFactor = enginesCreditsMapping[engineName];
  const tokenCosts = engineFactor / 1000;

  let promptTokensSize = 0;
  $('span[data-text=true]').each(function () {
    promptTokensSize += $(this).text().length / 4;
  });

  const completionSize = (responseLen * bestOf);
  const promptsBilled = parseFloat((promptTokensSize * tokenCosts).toFixed(3));
  const completionBilled = parseFloat((completionSize * tokenCosts).toFixed(3));
  let usageCosts = promptsBilled + completionBilled;
  if (usageCosts < 0.01) {
    usageCosts = "<0.01";
  } else {
    usageCosts = parseFloat((usageCosts).toFixed(2));
  }
  const usageCostsStrBreakdown = `${promptsBilled} prompt + ${completionBilled} completion`;
  const usageCostsElement = `Usage costs: <u>$${usageCosts}</u> (${usageCostsStrBreakdown})`
  changeContent(usageCostsElement);
  checkMaxTokensWarning(promptTokensSize + responseLen);
}

function countWords() {
  const engineName = $('.engine-select').find('[class$="singleValue"]')[0].textContent;
  if (!isKnownEngine(engineName)) {
    changeContent(`Unknown engine <u>${engineName}</u>`);
  } else {
    if (freeEngines.includes(engineName)) {
      changeContent(`<u>${engineName}</u> is currently free to use🎉`);
    } else {
      updateTokensUsage(engineName);
    }
  }
}

function checkMaxTokensWarning(promptTokensSize) {
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
