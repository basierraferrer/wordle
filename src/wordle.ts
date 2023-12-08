export class Wordle {
  constructor(
    private cells: number,
    private rows: number,
    private wordleBox: Array<Element>,
    private indexCell: number = 0,
    private indexRow: number = 0,
    private userAnswer: String[] = []
  ) {
    // It's becase the index start form 0
    this.cells--;
    this.rows--;
  }

  /**
   * ----------------------------
   *  ----- Private Methods -----
   * ----------------------------
   */

  private updateUserAnswer = (letter: string, isNewWord?: boolean) => {
    if (isNewWord) {
      this.userAnswer = [];
      return;
    }
    if (!letter.length) {
      this.userAnswer.pop();
      return;
    }

    if (this.indexCell <= this.cells) {
      this.userAnswer.push(letter);
    }
  };

  private alterWordle = (addingLetter: boolean): void => {
    if (addingLetter) {
      if (this.cells > this.indexCell) {
        this.alterIndexCell(true);
      } else {
        this.alterIndexCell(true, true);
        this.alterIndexRow(true);
      }
    } else {
      if (this.indexCell === 0 && this.indexRow !== 0) {
        this.alterIndexCell(false, false);
        this.alterIndexRow(false);
      } else if (this.indexCell !== 0) {
        this.alterIndexCell(false);
      }
    }
  };

  /**
   * @method alterIndexCell
   * This method increase or decrease the indexcell depending the param `isIncreasing`
   * @param isIncreasing if it's true indicates if the indexcell needs to increase
   * @param atBeginning
   */
  private alterIndexCell = (
    isIncreasing: boolean,
    atBeginning?: boolean
  ): void => {
    if (atBeginning === undefined) {
      if (isIncreasing) {
        this.indexCell++;
      } else {
        this.indexCell--;
      }
    } else {
      if (isIncreasing && atBeginning) {
        this.indexCell = 0;
      } else if (!isIncreasing && !atBeginning) {
        this.indexCell = this.cells;
      }
    }
  };

  /**
   * @method alterIndexRow
   * This method increase or decrease the indexRow depending the param `isIncreasing`
   * @param isIncreasing
   * @param atBeginning
   */
  private alterIndexRow = (isIncreasing: boolean): void => {
    if (isIncreasing && this.indexRow < this.rows) {
      this.indexRow++;
    } else if (isIncreasing && this.indexRow !== 0) {
      this.indexRow--;
    }
  };

  /**
   * ----------------------------
   *  ----- Public Methods -----
   * ----------------------------
   */

  public writeLetter = (letter: string): void => {
    const letterBox = this.wordleBox[this.indexRow].children[this.indexCell];
    letterBox.textContent = letter;
    letterBox.classList.add("filled-letter");
    this.updateUserAnswer(letter);
    this.alterWordle(true);
  };

  public deleteLetter = () => {
    this.alterWordle(false);
    const letterBox = this.wordleBox[this.indexRow].children[this.indexCell];
    letterBox.textContent = "";
    letterBox.classList.remove("filled-letter");
    this.updateUserAnswer("");
  };

  public getUserAnswer = () => {
    return this.userAnswer.join("");
  };

  public getIndexCell = () => this.indexCell;

  public getIndexRow = () => this.indexRow;
}
