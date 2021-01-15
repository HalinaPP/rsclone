import { createHtmlElement } from '@/utils/utils';
import { renderAuthForms } from '@/components/Auth/Auth.render';
import { isUserAuthenticate } from '@/components/Auth/Auth.services';
import { createMenuPage } from '@/components/Menu/Menu.render';

export const renderMain = (link: string): HTMLElement => {
  const mainEl: HTMLElement = createHtmlElement('main', 'main');
  mainEl.id = 'main';

  isUserAuthenticate().then(status => {
    if (status) {
      switch (link) {
        case '/test-page':
          mainEl.innerHTML =
            '<div style="color:#fff; font-size:30px;font-weight:bold">TEST PAGE</div>';
          break;
        case '/hoba-page':
          mainEl.innerHTML =
            '<div style="color:#fff; font-size:30px;font-weight:bold">HOBA PAGE</div>';
          break;

        default:
          mainEl.appendChild(createMenuPage());
      }
    } else {
      mainEl.appendChild(renderAuthForms());
    }
  });

  return mainEl;
};
