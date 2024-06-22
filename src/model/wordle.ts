import WORD_LIST from "../wordList.json";

const getRamdonWord = () =>
  WORD_LIST[Math.round(Math.random() * WORD_LIST.length)];

export class Wordle {
  wordleRows: Array<Element>;
  wordleConatiner: HTMLElement | null;
  wordleMessage: HTMLElement | null;
  wordleResetBtn: HTMLButtonElement | null;
  indexCell: number;
  indexRow: number;
  userAnswer: string[];
  document: Document;
  regExp: RegExp;
  rightWord: string;

  constructor(private cells: number, private rows: number, document: Document) {
    // It's becase the index start form 0
    this.cells--;
    this.rows--;
    // initial values
    this.regExp = /[a-zA-Z]/i;
    this.indexCell = 0;
    this.indexRow = 0;
    this.userAnswer = [];
    this.wordleRows = [];
    // set elements
    this.document = document;
    this.wordleConatiner = this.document.getElementById("container");
    this.wordleMessage = this.document.getElementById("message");
    this.wordleResetBtn = this.document.getElementById(
      "restart-btn"
    ) as HTMLButtonElement;
    // added click listener
    this.wordleResetBtn.addEventListener("click", this.restartGame);
    // create game
    this.rightWord = "";
    this.createGameBoard();
  }

  /**
   * ------------------------
   * ------ Board Game ------
   * ------------------------
   */

  /**
   * @method createCells
   * This method creates cell node and append to divRow parent element
   * @param divRow Element parent node of cells letter nodes
   */
  private createCells = (divRow: HTMLElement) => {
    for (
      let indexLetterCell = 0;
      indexLetterCell <= this.cells;
      indexLetterCell++
    ) {
      const divLetter = this.document.createElement("div");
      divLetter.classList.add("letter");
      divRow.appendChild(divLetter);
    }
  };

  /**
   * @method createGameBoard
   * This method create the structure of the wordle game (row and columns)
   */
  private createGameBoard = () => {
    if (this.wordleConatiner) {
      this.rightWord = getRamdonWord();
      for (
        let indexLetterRow = 0;
        indexLetterRow <= this.rows;
        indexLetterRow++
      ) {
        const divRow = this.document.createElement("div");
        divRow.classList.add("letter-row");
        this.createCells(divRow);
        this.wordleConatiner.appendChild(divRow);
        this.wordleRows.push(divRow);
      }
    }
  };

  /**
   * ----------------------------
   * ------ Private Methods -----
   * ----------------------------
   */

  private initialValues = () => {
    this.indexCell = 0;
    this.indexRow = 0;
    this.userAnswer = [];
    this.wordleRows = [];
  };

  /**
   * @method updateIndexes
   * This method handles the increasing or decrease of indexCell and indexRow
   * CASES:
   *   - if the user is writing a letter we increase indexCell
   *   - if the user deletes a letter we decrease indexCell
   *   - if the user writes the last letter of the current row,
   *     we reset indexCell to 0 and increase indexRow
   * @param isIncreasing Indicates if is adding a letter   *
   */
  private updateIndexes = (
    isIncreasing: boolean,
    needReset?: boolean
  ): void => {
    const shouldReset =
      this.indexCell > this.cells && isIncreasing && needReset;

    if (shouldReset) {
      this.indexCell = 0;
      this.indexRow++;
      this.userAnswer = [];
      return;
    }

    if (isIncreasing) {
      this.indexCell++;
      return;
    }

    if (this.indexCell > 0) {
      this.indexCell--;
    }
  };

  private writeMessage = (text: string) => {
    this.wordleMessage!.textContent = text;
  };

  private changeColors = () => {
    for (let index = 0; index < this.indexCell; index++) {
      let letterColor = "letter-yellow";
      const element = this.wordleRows[this.indexRow].children[index];

      const letterPosition = Array.from(this.rightWord).indexOf(
        this.userAnswer[index]
      );

      if (letterPosition === -1) {
        letterColor = "letter-grey";
      }

      if (letterPosition === index) {
        letterColor = "letter-green";
      }

      element.classList.add(letterColor);
    }
    this.writeMessage("¡Te faltan algunas letras!");
  };

  /**
   * ----------------------------
   * ------ Public Methods ------
   * ----------------------------
   */

  /**
   * @method writeLetter
   * This method write the letter in the letterBox
   * @param letter String that filled the letterBox
   */
  public writeLetter = (letter: string) => {
    if (
      letter.length === 1 &&
      letter.match(this.regExp) &&
      this.indexCell <= this.cells
    ) {
      const letterBox = this.wordleRows[this.indexRow].children[this.indexCell];
      letterBox.textContent = letter;
      letterBox.classList.add("filled-letter");
      this.userAnswer.push(letter);
      this.updateIndexes(true);
    }
  };

  /**
   * @method deleteLetter
   * Removes a letter of the current row
   */
  public deleteLetter = () => {
    const letterBox =
      this.wordleRows[this.indexRow].children[this.indexCell - 1];
    letterBox.textContent = "";
    letterBox.classList.remove("filled-letter");
    this.userAnswer.pop();
    this.updateIndexes(false);
  };

  /**
   * @function getUserAnswer
   * This function returns the word of user types.
   * @returns the word the user types
   */
  public getUserAnswer = () => this.userAnswer.join("");

  public getRestartButton = () => this.wordleResetBtn as HTMLButtonElement;

  public disabledRestartButton = (disabled: boolean) => {
    this.wordleResetBtn!.disabled = disabled;
  };

  /**
   * @method winnigGame
   * Marked the current row as the correct word
   */
  public winnigGame = () => {
    const currentRow = this.wordleRows[this.indexRow];
    for (let index = 0; index <= this.cells; index++) {
      currentRow.children[index].classList.add("letter-green");
    }
    this.writeMessage(`🎉 ¡Sí! La palabra ${this.rightWord} es la correcta 🎉`);
  };

  /**
   * @method failGame
   * the user didn't catch the word
   */
  public failGame = () => {
    this.writeMessage(
      `¡Perdiste! 😔 La palabra correcta era ${this.rightWord}`
    );
  };

  private validateResultGame = () => {
    const userWord = this.getUserAnswer();

    if (userWord === this.rightWord) {
      this.winnigGame;
      return true;
    }

    if (this.indexRow > this.rows) {
      this.failGame();
      return true;
    }

    if (this.indexRow === this.rows) {
      this.writeMessage(`Último intento 👀`);
    }

    return false;
  };

  public checkWord = () => {
    const left = this.rightWord.length - this.userAnswer.length;

    if (left) {
      this.writeMessage(
        `Te falta${left > 1 ? "n" : ""} ${left} letra${left > 1 ? "s" : ""}`
      );
      return false;
    }

    this.changeColors();
    this.updateIndexes(true, true);

    return this.validateResultGame();
  };

  public restartGame = () => {
    this.disabledRestartButton(true);
    this.wordleConatiner!.innerHTML = "";
    this.wordleMessage!.textContent = "";
    this.initialValues();
    this.createGameBoard();
  };
}
