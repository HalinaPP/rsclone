import { createHtmlElement } from '@/utils/utils';
import { createMenuItem } from './MenuItem/MenuItem.render';
import { MENU_PAGE_BGR_URL, menuItemInfo } from './constants';
import './menu.scss';
import { MenuItemType } from './MenuItem/MenuItem.model';

export const createMenuPage = (): HTMLElement => {
  const menuBlock: HTMLElement = createHtmlElement('div', 'menu__wrapper');

  menuItemInfo.forEach((elem: MenuItemType) => {
    const menuItem: HTMLElement = createMenuItem('button', 'menu__button', elem);
    menuBlock.appendChild(menuItem);
  });

  document.body.style.background = MENU_PAGE_BGR_URL;
  document.body.style.backgroundSize = 'cover';

  return menuBlock;
};
