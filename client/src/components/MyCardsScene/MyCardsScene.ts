import Phaser from 'phaser';
import { IMAGES, SCENES, AUDIO, ATLASES, MENU_IMAGES } from '@/components/Game/constant';
import { setBackground } from '@/utils/utils';
import { Card } from '@/components/Card/Card.model';
import { browserHistory } from '@/router/history';
import { createButton } from '@/components/Button/Button.services';
import { MENU_URL } from '@/router/constants';
import { AUDIO_CONFIG } from '@/constants/constants';
import { create } from './MyCards.render';
import { IMyCardsScene } from './MyCards.model';

export class MyCardsScene extends Phaser.Scene implements IMyCardsScene {
  private userCards: Card[] = [];

  private currentPageMyCards: number;

  constructor() {
    super({
      key: SCENES.MY_CARDS,
      active: false,
      visible: false,
    });
  }

  public getUserCards(): Card[] {
    return this.userCards;
  }

  public setUserCards(value: Card[]): void {
    this.userCards = value;
  }

  public createMenyButton(scene: IMyCardsScene, cardsBgAudio: Phaser.Sound.BaseSound): void {
    const positionMenu = {
      OFFSET_X: 180,
      Y: 20,
    };
    const positionMenuCoords = {
      X: scene.cameras.main.width - positionMenu.OFFSET_X,
      Y: positionMenu.Y,
    };

    const menuButton = createButton(
      scene,
      positionMenuCoords,
      0,
      ATLASES.MENU_ATLAS.NAME,
      MENU_IMAGES.MENU_BUTTON,
      500,
    );

    menuButton.on('pointerup', () => {
      cardsBgAudio.stop();
      browserHistory.push(MENU_URL);
    });
  }

  create(): void {
    this.sound.pauseOnBlur = false;
    const cardsBgAudio = this.sound.add(AUDIO.MYCARDS_BG_AUDIO.NAME, {
      loop: true,
      volume: AUDIO_CONFIG.volume.bg,
    });
    cardsBgAudio.play();
    setBackground(this, IMAGES.MY_CARDS_BACKGROUND.NAME);
    this.createMenyButton(this, cardsBgAudio);
    create(this);
  }
}
