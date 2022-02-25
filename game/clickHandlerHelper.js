import {deal, moveTogetherClassAdder, moveTogetherClassMaker, moveTogetherClassRemover, refIndexes, middleCards} from "./script.js"

function noClickHereCheck(event) {
    if (
        !event.target.classList.contains("is-open") &&
        !event.target.classList.contains("ace-stack") &&
        !event.target.classList.contains("card-stack") &&
        !event.target.classList.contains("is-flipped") &&
        !event.target.classList.contains("deck-stack")
      ) {
        return;
      }
}

function dealOut(event) {
    if (event.target.classList.contains("deck-stack")) {
        deal();
        return;
      }
}

function cardsToMoveFinder(selected) {
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
  return cardsToMove;
}

function cardMoveLoop(cardsToMove, moveTo) {
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
}

function moveToAceStack(selected, moveTo) {
  if (
    // check if it is an ace moving to an empty ace stack
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
  } 
}

function middleCardMove(selected, moveTo) {
  if (
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
    // checkMoveTogetherClass(selected, moveTo)
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
}
return;
}

// function checkMoveTogetherClass(card, moveTo) {
//   if (moveTo.classList.length <= 3 && card.classList.length <= 3) {
//     moveTogetherClassMaker(moveTo, card);
//   } else if (moveTo.classList.length > 3 && card.classList.length <= 3) {
//     moveTogetherClassAdder(moveTo, card)
//   // checks if card already has tag for card stack and moveTo doesn't
//   } else if (moveTo.classList.length <= 3 && card.classList.length > 3) {
//     moveTogetherClassRemover(card);
//     moveTogetherClassMaker(moveTo, card)
//   // reverse from previous else if
//   } else if (moveTo.classList.length > 3 && card.classList.length > 3) {
//     moveTogetherClassRemover(card);
//     moveTogetherClassAdder(moveTo, card)
//   }
// }

export {noClickHereCheck, dealOut, cardsToMoveFinder, cardMoveLoop, moveToAceStack, middleCardMove}