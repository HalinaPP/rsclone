import { createBaseCard } from '@/components/Card/Card.render';
import { setScalableCardInContainer } from '@/components/Card/Card.services';
import { Card } from '@/components/Card/Card.model';
import { setColoredDeck, setClickableDeck } from '@/components/Deck/Deck.services';
import { createDeck, createDeckName } from '@/components/Deck/Deck.render';
import { Deck } from '@/components/Deck/Deck.model';
import { createDeleteButton } from '@/components/MyCardsScene/Button/Button.render';
import { 
  CARDS_POS_UP_Y,
  CARDS_POS_DOWN_Y,
  DECKS_OFFSET_Y,
  CARDS_SCALE,
  NUMBER_CARDS_IN_ROW,
  positionDeckName,
  positionDeckContainer,
  NUMBER_CARDS_IN_DECK,
  NAME_CARDS,
  NAME_DECKS,
  ZERO_POSITION_Y,
  TINT_VALUE_CLICK,
  NUMBER_CARDS_ON_PAGE,
} from './constants';
import { CardsPosition, CardsContainerPosition, IMyCardsScene } from './MyCards.model';

function getPositionY(index: number, name: string): number {
  const weightId = Math.floor(index / NUMBER_CARDS_IN_ROW);
  let posY = ZERO_POSITION_Y;
  if (name === NAME_CARDS) {
    if (weightId === 0 || weightId === 2) {
      posY = CARDS_POS_UP_Y;
    } else {
      posY = CARDS_POS_DOWN_Y;
    }
  } else if (name === NAME_DECKS) {
    posY = weightId * DECKS_OFFSET_Y;
  }

  return posY;
}

function getPositionX(index: number, cardsPositionInfo: CardsPosition): number {
  const { OFFSET_X, EXTRA_OFFSET_X, REDUCE_ID_1, REDUCE_ID_2, REDUCE_ID_3 } = cardsPositionInfo;
  let posX;
  if (index <= 2) {
    posX = index * OFFSET_X;
  } else if (index >= 3 && index <= 5) {
    posX = (index - REDUCE_ID_1) * OFFSET_X;
  } else if (index >= 6 && index <= 8) {
    posX = (index - REDUCE_ID_2) * OFFSET_X + EXTRA_OFFSET_X;
  } else {
    posX = (index - REDUCE_ID_3) * OFFSET_X + EXTRA_OFFSET_X;
  }
  return posX;
}

export const renderContainer = (
  scene: IMyCardsScene,
  name: string,
  containerPosition: CardsContainerPosition,
): Phaser.GameObjects.Container => {
  const { CONTAINER_X, CONTAINER_Y } = containerPosition;
  const cardContainer = scene.add.container(CONTAINER_X, CONTAINER_Y);

  return cardContainer;
};

export const renderMyCards = (
  scene: IMyCardsScene,
  name: string,
  allCards: Card[],
  cardsPositionInfo: CardsPosition,
  cardsContainer: Phaser.GameObjects.Container,
): void => {
  let cardsOnOnePage = [];
  let currentPage = 1;
  if (name === NAME_DECKS) {
    const stateCardsOfDecks = scene.getStateCardsOfDecks();
    currentPage = stateCardsOfDecks.CURRENT_PAGE;
  } else if (name === NAME_CARDS) {
    currentPage = scene.getMyCardsCurrentPage();
  }
  cardsOnOnePage = allCards.filter((item, id) =>
    id >= NUMBER_CARDS_ON_PAGE * (currentPage - 1) && id < NUMBER_CARDS_ON_PAGE * currentPage
      ? item
      : '',
  );

  cardsOnOnePage.forEach((item: Card, id: number) => {
    const posX = getPositionX(id, cardsPositionInfo);
    const posY = getPositionY(id, name);
    const card = createBaseCard({
      scene,
      posX,
      posY,
      card: item,
    });
    card.setScale(CARDS_SCALE, CARDS_SCALE);

    if (name === NAME_DECKS) {
      const deleteButton = createDeleteButton(scene, item.id);
      card.add(deleteButton);
    }
    
    cardsContainer.add(card);
   
    setScalableCardInContainer(scene, card, CARDS_SCALE, cardsContainer);
  });
};

export const renderDeck = (
  scene: IMyCardsScene,
  userDecks: Deck[],
  decksContainer: Phaser.GameObjects.Container,
): void => {
  userDecks.forEach(item => {
    const userDeck = createDeck(scene, positionDeckContainer, NUMBER_CARDS_IN_DECK);
    const lastCardInDeck = userDeck.last;
    setColoredDeck(scene, <Phaser.GameObjects.Sprite>lastCardInDeck);

    setClickableDeck(scene, item, <Phaser.GameObjects.Sprite>lastCardInDeck, TINT_VALUE_CLICK);
    const userDeckName = createDeckName(scene, item, positionDeckName);

    decksContainer.add(userDeck);
    userDeck.add(userDeckName);
  });
};
