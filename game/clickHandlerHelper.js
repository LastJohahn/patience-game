import {deal} from "./script.js"

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

export {noClickHereCheck, dealOut, cardsToMoveFinder}