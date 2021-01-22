import Phaser from 'phaser';
import { cardBase } from '@/components/Card/Card.render';
import { IMAGES } from '@/components/Game/constant';
import { Card } from '@/components/Card/Card.model';

function getPositionOfCard(scene: Phaser.Scene, index: number): number {
  const gameWidth = scene.game.config.width;
  const centerWidth: number = <number>gameWidth / 2;
  let posX;
  if (index % 2 === 0) {
    posX = centerWidth - Math.ceil(index / 2) * (147 - 37);
  } else {
    posX = centerWidth + Math.ceil(index / 2) * (147 - 37);
  }
  return posX;
}

export function createPlayerCards(
  scene: Phaser.Scene,
  cards: Card[],
): Phaser.GameObjects.Container[] {
  const enemyCards: Phaser.GameObjects.Container[] = [];
  for (let i = 0; i < cards.length; i += 1) {
    const posX = getPositionOfCard(scene, i);
    enemyCards.push(
      cardBase({
        scene,
        posX,
        posY: 620,
        card: cards[i],
      }),
    );
  }
  return enemyCards;
}
