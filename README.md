# Wordle Clone

This is a clone of the Wordle game. Players have six attempts to guess a five-letter word, with feedback given for each guess in the form of colored tiles indicating when letters match or occupy the correct position.

## Core Functionality

This project utilizes RxJS to handle user interactions within a Wordle game. Here is an overview of the key parts of the implementation:

1. **Game Initialization:**

   - Creates an instance of the Wordle game with a specific grid size.

2. **Event Handling:**

   - Uses RxJS observables to listen to user key events.
   - Observers respond to these events by writing, deleting, or checking letters in the game grid.

3. **Subscriptions:**
   - Merges multiple event observables to manage game restart and window load actions.
   - Subscribes to keydown events to handle letter input until the game result is determined.

## Installation

- How to get the project

```bash
# Clone the repository
git clone https://github.com/basierraferrer/wordle.git

# Navigate to the project directory
cd wordle/

# Install dependencies
npm install
```

- Running locally

```bash
npm start
```

- Then open the browser on

```url
http://localhost:8080
```

### DEMO

[Wordle Demo](https://codepen.io/Alexis-Sierra-Ferrer/pen/ExzLKdo)
