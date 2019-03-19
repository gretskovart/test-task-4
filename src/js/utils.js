// Прижимаем слайдер-панель на нижнем экране
import constants from './constants';

const SLIDER_PANEL = constants.slider.BAR;

const fixSliderpanel = () => {
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
    SLIDER_PANEL.style.position = `fixed`;
  } else {
    SLIDER_PANEL.style.position = `absolute`;
  }
};

fixSliderpanel();

window.onscroll = () => {
  fixSliderpanel();
};
