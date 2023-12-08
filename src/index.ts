import { Subject, fromEvent } from "rxjs";
import { Wordle } from "./wordle";
import WORD_LIST from "./wordList.json";

const letterRows = document.getElementsByClassName("letter-row");
const wordleClass = new Wordle(5, 6, Array.from(letterRows));

const onKeyDown$ = fromEvent<KeyboardEvent>(document, "keydown");

const getRamdonWord = () =>
  WORD_LIST[Math.round(Math.random() * WORD_LIST.length)];

const rightWord = getRamdonWord();
console.log("file: index.ts:14 ~ rightWord:", rightWord);

const userResult$ = new Subject();

const insertLetter = {
  next: (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();
    if (pressedKey.length === 1 && pressedKey.match(/[a-zA-Z]/i)) {
      wordleClass.writeLetter(pressedKey);
    }
  },
};

const deleteLetter = {
  next: (event: KeyboardEvent) => {
    const keyPressed = event.key.toUpperCase();
    if (keyPressed === "BACKSPACE") {
      wordleClass.deleteLetter();
    }
  },
};

const checkWord = {
  next: (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (wordleClass.getUserAnswer() === rightWord) {
        userResult$.next("win");
      }
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(deleteLetter);
onKeyDown$.subscribe(checkWord);
userResult$.subscribe(() => {
  const rows = Array.from(letterRows)[wordleClass.getIndexRow() - 1];
  for (let index = 0; index < rows.children.length; index++) {
    rows.children[index].classList.add("letter-green");
  }
});
