import constants from './constants';

const slider = constants.slider;

const BAR = slider.BAR;
const PIN = BAR.querySelector(`.slider-panel__btn`);
const LINE = BAR.querySelector(`.slider-panel__line`);
const LINE_FILL = BAR.querySelector(`.slider-panel__line--fill`);

let currentPos = slider.current;
const slidesBlock = document.querySelector(`.slide__3`);
const slideFirst = slidesBlock.querySelector(`.slide__3--1`);
const slideSecond = slidesBlock.querySelector(`.slide__3--2`);
const slideThird = slidesBlock.querySelector(`.slide__3--3`);

const shiftPinPosition = (value) => {
  PIN.style.left = value + `%`;
};

const fillLine = (val) => {
  LINE_FILL.style.width = val + `%`;
};

// Постепенное изменение слайдов
const changeSlide = (val) => {
  let l = null;

  if (val > slider.SLIDE_2) {
    l = (100 - val) * 2;

    slideSecond.style.margin = `0 ` + l + `%`;
    slideThird.style.margin = `0 -` + l + `%`;

  } else if (val < slider.SLIDE_2) {
    l = (val > 0) ? val * 2 : 0;

    slideThird.style.margin = `0 -100%`;
    slideSecond.style.margin = `0 ` + l + `%`;
    slideFirst.style.margin = `0 -` + l + `%`;
  }
};

const checkRange = (val) => {
  if (val <= slider.SLIDE_1) {
    val = slider.SLIDE_1;

  } else if (val >= slider.SLIDE_3) {
    val = slider.SLIDE_3;
  }

  return val;
};

const shiftPinToGrade = () => {
  if (currentPos < slider.TO_START) {
    shiftPinPosition(slider.SLIDE_1);
    fillLine(`0`);

    // Смещаемся к 1-му слайду
    slideFirst.style.margin = `0`;
    slideSecond.style.margin = `0`;
    slideThird.style.margin = `0 -100%`;

  } else if (currentPos >= slider.TO_START && currentPos < slider.TO_FINISH) {
    shiftPinPosition(slider.SLIDE_2);
    fillLine(slider.SLIDE_2);

    // Смещаемся ко 2-му слайду
    slideThird.style.margin = `0 -100%`;
    slideSecond.style.margin = `0 100%`;

  } else if (currentPos >= slider.TO_FINISH) {
    shiftPinPosition(slider.SLIDE_3);
    fillLine(`100`);

    // Смещаемся к 3-му слайду
    slideThird.removeAttribute(`style`);
    slideSecond.removeAttribute(`style`);
  }
};

const sliderPinMouseDownHandler = (downEvt) => {
  // Исключаем лишние события
  if (downEvt.target !== BAR && downEvt.target !== LINE && downEvt.target !== PIN && downEvt.target !== LINE_FILL) {
    return;
  }

  let startPinPosition = downEvt.touches[0].clientX;

  const sliderLineRect = LINE.getBoundingClientRect();

  // Считаем текущее положение ползунка внутри бара
  let currentPinPosition = (startPinPosition - sliderLineRect.left) / sliderLineRect.width * 100;

  // Проверяем - не вышел ли ползунок за границы бара
  currentPinPosition = checkRange(currentPinPosition);

  // Смещаем ползунок
  shiftPinPosition(currentPinPosition);

  // "Закрашиваем" бар
  fillLine(currentPinPosition);

  const sliderPinMoveHandler = (moveEvt) => {
    const shift = startPinPosition - moveEvt.touches[0].clientX;
    startPinPosition = moveEvt.touches[0].clientX;

    let movePosition = (PIN.offsetLeft - shift) / sliderLineRect.width * 100;

    // Проверяем - не вышел ли ползунок за границы бара
    movePosition = checkRange(movePosition);

    changeSlide(movePosition);

    currentPos = movePosition;
    // Смещаем ползунок
    shiftPinPosition(movePosition);

    // "Закрашиваем" бар
    fillLine(movePosition);
  };

  const sliderPinMouseUpHandler = () => {
    // Перемещаем ползунок в ближайшее положение
    shiftPinToGrade();

    window.removeEventListener(`touchmove`, sliderPinMoveHandler, false);
    window.removeEventListener(`touchend`, sliderPinMouseUpHandler, false);
  };

  window.addEventListener(`touchmove`, sliderPinMoveHandler, false);
  window.addEventListener(`touchend`, sliderPinMouseUpHandler, false);
};

window.addEventListener(`touchstart`, sliderPinMouseDownHandler);
