import constants from './constants';

const screen = constants.screen;
let startPos = null;

// Получаем начальные координаты тач-события
const getStartPos = (evt) => {
  startPos = evt.changedTouches[0].screenY;
};

// Отключаем дефолтный скроллинг
const disableVerticalScrolling = (evt) => {
  evt.preventDefault();
};

const toogleBtnToBottom = () => {
  const btn = document.querySelector(`.slide-down`);

  btn.classList.toggle(`slide-down--hide`);
};

const setPagination = (val) => {
  const paginationPanel = document.querySelector(`.pagination`);
  const markFirst = paginationPanel.querySelector(`.pagination__mark--1`);
  const markSecond = paginationPanel.querySelector(`.pagination__mark--2`);
  const markThird = paginationPanel.querySelector(`.pagination__mark--3`);

  let activeMark = paginationPanel.querySelector(`.pagination__mark--active`);

  const addActiveMark = (mark) => mark.classList.add(`pagination__mark--active`);

  activeMark.classList.remove(`pagination__mark--active`);

  switch (val) {
    case 0:
      addActiveMark(markFirst);
      break;
    case screen.HEIGHT:
      addActiveMark(markSecond);
      break;
    case screen.HEIGHT * 2:
      addActiveMark(markThird);
      break;
  }
};

const changeScreen = (evt) => {
  // Исключаем лишние события
  if (evt.target === constants.slider.BAR || evt.target.parentNode === constants.slider.BAR || evt.target.parentNode.parentNode === constants.slider.BAR) {
    return;
  }

  const currenPos = evt.changedTouches[0].screenY;

  // Если смещаемся вниз
  if (currenPos < startPos && screen.current !== screen.HEIGHT * 2) {
    screen.current = (screen.current === 0) ? screen.HEIGHT : screen.HEIGHT * 2;

    // Скрываем / Показываем ссылку "Листайте вниз"
    toogleBtnToBottom();

  // Или если смещаемся вверх
  } else if (currenPos > startPos && screen.current !== 0) {
    screen.current = (screen.current === screen.HEIGHT) ? 0 : screen.HEIGHT;

    // Скрываем / Показываем ссылку "Листайте вниз"
    toogleBtnToBottom();
  }

  // Меняем экран
  window.scroll({top: screen.current, left: 0, behavior: `smooth`});

  // Устанавливаем пейджинатор в правильное положение
  setPagination(screen.current);
};

window.addEventListener(`touchend`, changeScreen);
window.addEventListener(`touchstart`, getStartPos);
window.addEventListener(`touchmove`, disableVerticalScrolling, {passive: false});
