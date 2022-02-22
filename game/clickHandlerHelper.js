import {deal, moveTogetherClassAdder, moveTogetherClassMaker, moveTogetherClassRemover} from "./script.js"

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

export {noClickHereCheck, dealOut, cardsToMoveFinder, cardMoveLoop}