import { Subject, fromEvent } from "rxjs";
import { Wordle } from "./model/wordle";
import WORD_LIST from "./wordList.json";

const wordleGame = new Wordle(5, 6, document);

const getRamdonWord = () =>
  WORD_LIST[Math.round(Math.random() * WORD_LIST.length)];

const rightWord = getRamdonWord();

/**
 * ---------------------
 * ---- Observables ----
 * ---------------------
 */

const onKeyDown$ = fromEvent<KeyboardEvent>(document, "keydown");
const userResult$ = new Subject();

/**
 * --------------------
 * ----- Observer -----
 * --------------------
 */

const insertLetter = {
  next: (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();
    wordleGame.writeLetter(pressedKey);
  },
};

const deleteLetter = {
  next: (event: KeyboardEvent) => {
    const keyPressed = event.key.toUpperCase();
    if (keyPressed === "BACKSPACE") {
      wordleGame.deleteLetter();
    }
  },
};

const checkWord = {
  next: (event: KeyboardEvent) => {
    const keyPressed = event.key.toUpperCase();
    if (keyPressed === "ENTER") {
      if (wordleGame.checkWord(rightWord)) {
        userResult$.next("");
      }
    }
  },
};

const winnigGame = {
  next: () => {
    wordleGame.winnigGame();
  },
};

/**
 * -------------------------
 * ----- Subscriptions -----
 * -------------------------
 */

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(deleteLetter);
onKeyDown$.subscribe(checkWord);

userResult$.subscribe(winnigGame);
