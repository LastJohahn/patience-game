import Deck from "./deck.js";

const cardStack1 = document.querySelector("#card-stack-1");
const cardStack2 = document.querySelector("#card-stack-2");
const cardStack3 = document.querySelector("#card-stack-3");
const cardStack4 = document.querySelector("#card-stack-4");
const cardStack5 = document.querySelector("#card-stack-5");
const cardStack6 = document.querySelector("#card-stack-6");
const cardStack7 = document.querySelector("#card-stack-7");
const cardStack8 = document.querySelector("#card-stack-8");
const cardStack9 = document.querySelector("#card-stack-9");
const cardStack10 = document.querySelector("#card-stack-10");

let wholeDeck, dealDeck, inHand;

startGame();
firstDeal();

function startGame() {
  wholeDeck = new Deck();
  wholeDeck.shuffle();
  dealDeck = new Deck(wholeDeck.cards.slice(0, 50));
  inHand = new Deck(wholeDeck.cards.slice(50, wholeDeck.numberOfCards));
}

function firstDeal() {
  const cardStacks = [
    cardStack1,
    cardStack2,
    cardStack3,
    cardStack4,
    cardStack5,
    cardStack6,
    cardStack7,
    cardStack8,
    cardStack9,
    cardStack10,
  ];
  do {
    cardStacks[0].appendChild(dealDeck.pop().getHTML());
    cardStacks.shift();
    for (let i = 0; i < cardStacks.length - 1; i++) {
      for (let j = 0; j < 2; j++) {
        let currCard = dealDeck.pop().getHTML();
        currCard.classList.add("is-flipped");
        cardStacks[i].appendChild(currCard);
      }
    }
    cardStacks[cardStacks.length - 1].appendChild(dealDeck.pop().getHTML());
    cardStacks.pop();
  } while (cardStacks.length >= 2);
}
