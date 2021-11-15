import Deck from "./deck.js";

let wholeDeck, dealDeck, inHand;

startGame();

function startGame() {
  wholeDeck = new Deck();
  wholeDeck.shuffle();
  dealDeck = new Deck(wholeDeck.cards.slice(0, 50));
  inHand = new Deck(wholeDeck.cards.slice(50, wholeDeck.numberOfCards));
}
