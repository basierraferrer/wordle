import { Subject, fromEvent, merge, takeUntil } from "rxjs";
import { Wordle } from "./model/wordle";

const wordleGame = new Wordle(5, 6, document);

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
      if (wordleGame.checkWord()) userResult$.next("");
    }
  },
};

const resultGame = {
  next: () => {
    wordleGame.disabledRestartButton(false);
  },
};

/**
 * -------------------------
 * ----- Subscriptions -----
 * -------------------------
 */

const onLoadWindow$ = fromEvent(window, "load");
const onRestartButton$ = fromEvent(wordleGame.getRestartButton(), "click");

const restartGame$ = merge(onLoadWindow$, onRestartButton$);

restartGame$.subscribe(() => {
  wordleGame.restartGame();
});

userResult$.subscribe(resultGame);
onKeyDown$.pipe(takeUntil(userResult$)).subscribe(insertLetter);
onKeyDown$.pipe(takeUntil(userResult$)).subscribe(deleteLetter);
onKeyDown$.pipe(takeUntil(userResult$)).subscribe(checkWord);
