import Deck from "./deck.js";
import { noClickHereCheck, dealOut, cardsToMoveFinder, cardMoveLoop, moveToAceStack, middleCardMove } from "./clickHandlerHelper.js";

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

const aceStack1 = document.querySelector("#ace-stack-1")
const aceStack2 = document.querySelector("#ace-stack-2")
const aceStack3 = document.querySelector("#ace-stack-3")
const aceStack4 = document.querySelector("#ace-stack-4")
const aceStack5 = document.querySelector("#ace-stack-5")
const aceStack6 = document.querySelector("#ace-stack-6")
const aceStack7 = document.querySelector("#ace-stack-7")
const aceStack8 = document.querySelector("#ace-stack-8")

const aceStacks = [
  aceStack1, aceStack2, aceStack3, aceStack4, aceStack5, aceStack6, aceStack7, aceStack8
]

let clickCount = 0;
let wholeDeck, dealDeck, inHand, inHandLength, selected;
let dblClick = false;

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

body.addEventListener("dblclick", doubleClickHandler);

body.addEventListener("contextmenu", rightClickHandler);

function dragging() {
  let cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    card.addEventListener("dragstart", function drag(ev) {
      console.log("dragging")
      ev.dataTransfer.setData("text", ev.target.id);
      console.log(ev.dataTransfer.getData("text"));
    })
    card.addEventListener("dragover", function dragOver(ev) {
      ev.preventDefault();
    })
    card.addEventListener("drop", function drop(ev) {
      ev.preventDefault();
      let data = ev.dataTransfer.getData("text");
      console.log(data, "after")
      ev.target.parentNode.appendChild(document.getElementById(data));
    })
  })
}


function clickHandler(event) {

  setTimeout(() => {dblClick = false; return}, 350)
  if (!dblClick) {

  // don't work if you click something not part of the game
  noClickHereCheck(event);

  // deal
  dealOut(event);

  // clickCount = 0; flip card OR set event.target as selected
  if (clickCount === 0 && event.target.classList.contains("is-flipped") 
  && event.target === event.target.parentNode.lastChild) {
    flipCard(event.target)
    return;
  } else if (clickCount === 0 && event.target.classList.contains("is-open")) {
    clickCount++;
    selected = event.target;
    console.log(selected, "firstclick");
    return;
  }

  // clickCount = 1;
  if (clickCount === 1) {
    let moveTo = event.target;
    console.log(moveTo.classList, "secondclick");
    // moving a stack of cards together
    if (selected.classList.length > 3) {
      const cardsToMove = cardsToMoveFinder(selected);
      if (      
        // check if it is a card that is not king or ace moving onto card in game area
        middleCards.includes(selected.dataset.value[0]) &&
        moveTo.parentNode.classList.contains("card-stack") &&
        // check if it's the right black/red combo
        moveTo.classList[1] != selected.classList[1]
        // check if the selected card is one smaller than the moveTo card
        && refIndexes.indexOf(moveTo.dataset.value[0]) -
          refIndexes.indexOf(selected.dataset.value[0]) === 1) {
            cardMoveLoop(cardsToMove, moveTo);
            clickCount = 0;
            return;
          } else if 
          // check if it is king-topped stack moving to empty card stack
          (moveTo.classList.contains("card-stack") 
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

    // moving a single card onto ace stack
    moveToAceStack(selected, moveTo);

    // moving middle card anywhere that isn't ace stack
    middleCardMove(selected, moveTo);
 
    // moving a king onto empty card stack
    if (
      // check if moveTo is a card stack that is empty
      moveTo.classList.contains("card-stack") && moveTo.childElementCount === 0 
      // check if it is a king being moved
      && selected.dataset.value[0] === "K") {
      moveTo.appendChild(selected)
    }
    clickCount = 0;
    }
  }
}


function doubleClickHandler(event) {
  dblClick = true;
  const selected = event.target;
  if (selected.dataset.value[0] === "A") {
    for (let i = 7; i >= 0; i--) {
      if (aceStacks[i].children.length === 0) {
        aceStacks[i].appendChild(selected)
      }
    }
  }
  dblClick = false
  return;
}

function rightClickHandler(event) {
  event.preventDefault();
  clickCount = 0;
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
  dragging();
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
dragging()
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

function moveTogetherClassChecker(card, moveTo) {
  if (moveTo.classList.length <= 3 && card.classList.length <= 3) {
    moveTogetherClassMaker(moveTo, card);
  } else if (moveTo.classList.length > 3 && card.classList.length <= 3) {
    moveTogetherClassAdder(moveTo, card)
  // checks if card already has tag for card stack and moveTo doesn't
  } else if (moveTo.classList.length <= 3 && card.classList.length > 3) {
    moveTogetherClassRemover(card);
    moveTogetherClassMaker(moveTo, card)
  // reverse from previous else if
  } else if (moveTo.classList.length > 3 && card.classList.length > 3) {
    moveTogetherClassRemover(card);
    moveTogetherClassAdder(moveTo, card)
  }
}

export {deal, moveTogetherClassAdder, moveTogetherClassMaker, moveTogetherClassRemover, moveTogetherClassChecker, refIndexes, middleCards}