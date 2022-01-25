import Deck from "./deck.js";

const body = document.querySelector("body");
const deckStack = document.querySelector(".deck-stack");
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

let clickCount = 0;
let wholeDeck, dealDeck, inHand, inHandLength, selected;

startGame();
firstDeal();

const middleCards = ["2", "3", "4", "5", "6", "7", "8", "9", "1", "J", "Q"];
const refIndexes = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "1",
  "J",
  "Q",
  "K",
];

body.addEventListener("click", clickHandler);

function clickHandler(event) {
  // don't work if you click something that shouldn't be moved
  if (
    !event.target.classList.contains("is-open") &&
    !event.target.classList.contains("ace-stack") &&
    !event.target.classList.contains("card-stack") &&
    !event.target.classList.contains("is-flipped")
  ) {
    return;
  }
  // first click to select what to move
  if (clickCount === 0 && event.target.classList.contains("is-open")) {
    clickCount++;
    selected = event.target;
    console.log(selected, "firstclick");
    return;
    // logic for flipping single card that is closed
  } else if (clickCount === 0 && event.target.classList.contains("is-flipped")){
    let toFlip = event.target;
    toFlip.classList.remove("is-flipped");
    toFlip.classList.add("is-open");
    return;
    // second click to select where to move it
  } else if (clickCount === 1) {
    let moveTo = event.target;
    console.log(moveTo.classList, "secondclick");
    // check if it is an ace moving to an empty ace stack
    if (
      moveTo.classList.contains("ace-stack") &&
      selected.dataset.value[0] === "A" &&
      moveTo.children.length === 0
    ) {
      moveTo.appendChild(selected);
      // check if it is single card that can go onto ace up top
    } else if ( moveTo.parentNode.classList.contains("ace-stack")
    // check if same suit
    && selected.dataset.value.slice(-1) === moveTo.dataset.value.slice(-1)
    && refIndexes.indexOf(selected.dataset.value[0]) -
    refIndexes.indexOf(moveTo.dataset.value[0]) === 1
    ) {
      moveTo.parentNode.appendChild(selected)
    // check if it is a middle card being moved
    } else if (
      // check if it is a card that is not king or ace moving onto card in game area
      middleCards.includes(selected.dataset.value[0]) &&
      moveTo.parentNode.classList.contains("card-stack") &&
      // check if it's the right black/red combo
      moveTo.classList[1] != selected.classList[1]
      // check if the selected card is one smaller than the moveTo card
      && refIndexes.indexOf(moveTo.dataset.value[0]) -
        refIndexes.indexOf(selected.dataset.value[0]) === 1
    ) {
      moveTo.parentNode.appendChild(selected)
    // check if it is a king being moved to an empty card slot
    } else if (
      // check if moveTo is a card stack that is empty
      moveTo.classList.contains("card-stack") && moveTo.childElementCount === 0 
      // check if it is a king being moved
      && selected.dataset.value[0] === "K") {
      moveTo.appendChild(selected)
    }
    /* 
      logic: 
      move ace
        can only go up to free ace spot in top row
      move between ace & king
        can only go to an ace stack where the top most card is same suit and one smaller
        or onto card on game area that is diff colour and one larger
      move king
        can only go to an ace stack where the top most card is same suit and one smaller
        or onto empty card stack in game area
    */
    clickCount = 0;
  }
}

function startGame() {
  wholeDeck = new Deck();
  wholeDeck.shuffle();

  dealDeck = new Deck(wholeDeck.cards.slice(0, 50));
  inHand = new Deck(wholeDeck.cards.slice(50, wholeDeck.numberOfCards));

  inHandLengthSetter();
}

function inHandLengthSetter() {
  inHandLength = document.createTextNode(inHand.numberOfCards);
  deckStack.appendChild(inHandLength);
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
        currCard.classList.remove("is-open");
        currCard.classList.add("is-flipped");
        cardStacks[i].appendChild(currCard);
      }
    }
    cardStacks[cardStacks.length - 1].appendChild(dealDeck.pop().getHTML());
    cardStacks.pop();
  } while (cardStacks.length >= 2);
}
