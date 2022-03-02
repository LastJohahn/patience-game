const SUITS = ["♠", "♣", "♥", "♦"];
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export default class Deck {
  constructor(cards = doubleDeck()) {
    this.cards = cards;
  }

  get numberOfCards() {
    return this.cards.length;
  }

  pop() {
    return this.cards.shift();
  }

  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}

class Card {
  constructor(suit, value, deckNumber) {
    this.suit = suit;
    this.value = value;
    this.deckNumber = deckNumber
  }

  get colour() {
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red";
  }

  getHTML() {
    const cardDiv = document.createElement("div");
    cardDiv.id = `${this.value}${this.suit}${this.deckNumber}`
    cardDiv.innerText = this.suit;
    cardDiv.classList.add("card", this.colour, "is-open");
    cardDiv.dataset.value = `${this.value} ${this.suit}`;
    cardDiv.draggable = true;
    return cardDiv;
  }
}

function freshDeck(deckNumber) {
  return SUITS.flatMap((suit) => {
    return VALUES.map((value) => {
      return new Card(suit, value, deckNumber);
    });
  });
}

function doubleDeck() {
  let firstDeck = freshDeck(0);
  let secondDeck = freshDeck(1);
  let bothDecks = firstDeck.concat(secondDeck);
  return bothDecks;
}
