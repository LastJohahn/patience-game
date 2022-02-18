import Deck from "./deck.js";
import { noClickHereCheck } from "./clickHandlerHelper.js";

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
const suitNames = [{"♠": "spades"}, {"♣": "clubs"}, {"♥": "hearts"}, {"♦": "diamonds"}]

body.addEventListener("click", clickHandler);

body.addEventListener("dblclick", doubleClickHandler)

function clickHandler(event) {
  // don't work if you click something not part of the game
  noClickHereCheck(event);
  // deal
  if (event.target.classList.contains("deck-stack")) {
    deal();
    return;
  }
  // flip card
  if (clickCount === 0 && event.target.classList.contains("is-flipped") 
  && event.target === event.target.parentNode.lastChild) {
    flipCard(event.target)
    return;
  }
  // first click to select what to move
  if (clickCount === 0 && event.target.classList.contains("is-open")) {
    clickCount++;
    selected = event.target;
    console.log(selected, "firstclick");
    return;
  // second click to select where to move it
  }  else if (clickCount === 1) {
    let moveTo = event.target;
    console.log(moveTo.classList, "secondclick");
    // stack of cards movement 
    if (selected.classList.length > 3) {
      const children = selected.parentNode.children;
      const cardsToMove = []
      let selectedI;
      for (let i = 0; i < children.length; i++) {
        if (children[i].dataset === selected.dataset)  {
          selectedI = i;
        }
        if (children[i].classList[3] === selected.classList[3] && i >= selectedI) {
          cardsToMove.push(children[i])
        }
      }
      // logic for moving card stack that isn't topped by king
      if (      
        // check if it is a card that is not king or ace moving onto card in game area
        middleCards.includes(selected.dataset.value[0]) &&
        moveTo.parentNode.classList.contains("card-stack") &&
        // check if it's the right black/red combo
        moveTo.classList[1] != selected.classList[1]
        // check if the selected card is one smaller than the moveTo card
        && refIndexes.indexOf(moveTo.dataset.value[0]) -
          refIndexes.indexOf(selected.dataset.value[0]) === 1) {
            for (let i = 0 ; i < cardsToMove.length; i ++) {
              if (moveTo.classList.length <= 3) {
                moveTogetherClassRemover(cardsToMove[i]);
                moveTogetherClassMaker(moveTo, cardsToMove[i]);
                moveTo.parentNode.appendChild(cardsToMove[i]);
              } else if (moveTo.classList.length > 3){
                moveTogetherClassRemover(cardsToMove[i]);
                moveTogetherClassAdder(moveTo, cardsToMove[i]);
                moveTo.parentNode.appendChild(cardsToMove[i]);
              }
            }
            clickCount = 0;
            return;
          } else if ( moveTo.classList.contains("card-stack") 
          && moveTo.childElementCount === 0 
          && selected.dataset.value[0] === "K"
          ) {
            for (let i = 0; i < cardsToMove.length; i++) {
              moveTo.appendChild(cardsToMove[i])
            }
            clickCount = 0;
            return;
          }
        }
    // single card movement
    // check if it is an ace moving to an empty ace stack
    if (
      moveTo.classList.contains("ace-stack") &&
      selected.dataset.value[0] === "A" &&
      moveTo.children.length === 0
    ) {
      moveTo.appendChild(selected);
      // check if it is single card that can go onto ace up top
    } else if (moveTo.parentNode.classList.contains("ace-stack")
    // check if same suit
    && selected.dataset.value.slice(-1) === moveTo.dataset.value.slice(-1)
    // check if one larger than card already on acestack
    && refIndexes.indexOf(selected.dataset.value[0]) -
    refIndexes.indexOf(moveTo.dataset.value[0]) === 1
    ) {
      moveTogetherClassRemover(selected);
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
      moveTo.parentNode.appendChild(selected);
      // checks if card already has tag for card stack
      if (moveTo.classList.length <= 3 && selected.classList.length <= 3) {
        moveTogetherClassMaker(moveTo, selected);
      } else if (moveTo.classList.length > 3 && selected.classList.length <= 3) {
        moveTogetherClassAdder(moveTo, selected)
      // checks if selected already has tag for card stack and moveTo doesn't
      } else if (moveTo.classList.length <= 3 && selected.classList.length > 3) {
        moveTogetherClassRemover(selected);
        moveTogetherClassMaker(moveTo, selected)
      // reverse from previous else if
      } else if (moveTo.classList.length > 3 && selected.classList.length > 3) {
        moveTogetherClassRemover(selected);
        moveTogetherClassAdder(moveTo, selected)
      }
    // check if it is a king being moved to an empty card slot
    } else if (
      // check if moveTo is a card stack that is empty
      moveTo.classList.contains("card-stack") && moveTo.childElementCount === 0 
      // check if it is a king being moved
      && selected.dataset.value[0] === "K") {
      moveTo.appendChild(selected)
    }
    clickCount = 0;

  }
}

function doubleClickHandler(event) {}

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

function deal() {
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
  if (inHand.numberOfCards >= 10) {
  for (let i = 0; i < cardStacks.length; i++) {
    if (cardStacks[i].children.length === 0 || cardStacks[i].firstChild.classList.contains("is-open")) {
      if (cardStacks[i].children.length === 0 || cardStacks[i].firstChild.dataset.value[0] != "K") {
        let dealCard = inHand.pop().getHTML();
        flipCard(dealCard);
        cardStacks[i].appendChild(dealCard);
      }
    } else if (cardStacks[i].firstChild.classList.contains("is-flipped")) {
      let dealCard = inHand.pop().getHTML();
      flipCard(dealCard);
      cardStacks[i].appendChild(dealCard);
    }
  }
  deckStack.removeChild(deckStack.firstChild);
  inHandLengthSetter();
} else if (inHand.numberOfCards >= 0) {
  do {
      if (cardStacks[0].children.length === 0 || cardStacks[0].firstChild.classList.contains("is-open")) {
        if (cardStacks[0].children.length === 0 || cardStacks[0].firstChild.dataset.value[0] != "K") {
          let dealCard = inHand.pop().getHTML();
          flipCard(dealCard);
          cardStacks[0].appendChild(dealCard);
        }
      } else if (cardStacks[0].firstChild.classList.contains("is-flipped")) {
        let dealCard = inHand.pop().getHTML();
        flipCard(dealCard);
        cardStacks[0].appendChild(dealCard);
      }
      cardStacks.splice(0,1);
  }
  while (inHand.numberOfCards != 0)
  deckStack.removeChild(deckStack.firstChild);
  inHandLengthSetter();
}
}

function flipCard(card) {
  card.classList.remove("is-flipped");
  card.classList.add("is-open");
  return;
}

function moveTogetherClassMaker(moveTo, selected) {
    const newClassArray = moveTo.dataset.value.split("");
    let suit = newClassArray.pop()
    for (let i = 0;  i < suitNames.length; i++) {
     if (suitNames[i][suit]) {
       suit = suitNames[i][suit]
     }  
    }
    newClassArray.push(suit);
    const newClass = (newClassArray.join("").replace(/\s+/g, ''))
    moveTo.classList.add(newClass);
    selected.classList.add(newClass);
    return moveTo, selected
}

function moveTogetherClassRemover(card) {
  if (card.classList.length > 3) {
    let classToRemove = card.classList[3];
    card.classList.remove(classToRemove);
  }
  return;
}

function moveTogetherClassAdder(moveTo, selected) {
  selected.classList.add(moveTo.classList[3])
}