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

export {noClickHereCheck, dealOut}