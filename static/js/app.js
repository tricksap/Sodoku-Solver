const game_screen = document.querySelector("#game-screen");
const result_screen = document.querySelector("#result-screen");
const cells = document.querySelectorAll(".main-grid-cell");
const number_inputs = document.querySelectorAll(".number");
const result_time = document.querySelector("#result-time");

let level_index = 0;
let level = 38; //number of blanks
let su = undefined;
let su_answer = undefined;

let selected_cell = -1;

const getGameInfo = () => JSON.parse(localStorage.getItem("game"));

// add space for each 9 cells
const initGameGrid = () => {
  let index = 0;

  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    let col = i % CONSTANT.GRID_SIZE;
    if (row === 2 || row === 5) cells[index].style.marginBottom = "10px";
    if (col === 2 || col === 5) cells[index].style.marginRight = "10px";

    index++;
  }
};

const clearSudoku = () => {
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    cells[i].innerHTML = "";
    cells[i].classList.remove("filled");
    cells[i].classList.remove("selected");
  }
};

const initSudoku = () => {
  // clear old sudoku
  clearSudoku();
  resetBg();
  // generate sudoku puzzle here
  su = sudokuGen(level);
  su_answer = [...su.question];

  seconds = 0;

  saveGameInfo();

  // show sudoku to div
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    let col = i % CONSTANT.GRID_SIZE;

    cells[i].setAttribute("data-value", su.question[row][col]);

    if (su.question[row][col] !== 0) {
      cells[i].classList.add("filled");
      cells[i].innerHTML = su.question[row][col];
    }
  }
};

const loadSudoku = () => {
  let game = getGameInfo();

  su = game.su;

  su_answer = su.answer;

  seconds = game.seconds;

  level_index = game.level;

  // show sudoku to div
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    let col = i % CONSTANT.GRID_SIZE;

    cells[i].setAttribute("data-value", su_answer[row][col]);
    cells[i].innerHTML = su_answer[row][col] !== 0 ? su_answer[row][col] : "";
    if (su.question[row][col] !== 0) {
      cells[i].classList.add("filled");
    }
  }
};

const hoverBg = (index) => {
  let row = Math.floor(index / CONSTANT.GRID_SIZE);
  let col = index % CONSTANT.GRID_SIZE;

  let box_start_row = row - (row % 3);
  let box_start_col = col - (col % 3);

  for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
    for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
      let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
      cell.classList.add("hover");
    }
  }

  let step = 9;
  while (index - step >= 0) {
    cells[index - step].classList.add("hover");
    step += 9;
  }

  step = 9;
  while (index + step < 81) {
    cells[index + step].classList.add("hover");
    step += 9;
  }

  step = 1;
  while (index - step >= 9 * row) {
    cells[index - step].classList.add("hover");
    step += 1;
  }

  step = 1;
  while (index + step < 9 * row + 9) {
    cells[index + step].classList.add("hover");
    step += 1;
  }
};

const resetBg = () => {
  cells.forEach((e) => e.classList.remove("hover"));
};

const checkErr = (value) => {
  const addErr = (cell) => {
    if (parseInt(cell.getAttribute("data-value")) === value) {
      cell.classList.add("err");
      cell.classList.add("cell-err");
      setTimeout(() => {
        cell.classList.remove("cell-err");
      }, 500);
    }
  };

  let index = selected_cell;

  let row = Math.floor(index / CONSTANT.GRID_SIZE);
  let col = index % CONSTANT.GRID_SIZE;

  let box_start_row = row - (row % 3);
  let box_start_col = col - (col % 3);

  for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
    for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
      let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
      if (!cell.classList.contains("selected")) addErr(cell);
    }
  }

  let step = 9;
  while (index - step >= 0) {
    addErr(cells[index - step]);
    step += 9;
  }

  step = 9;
  while (index + step < 81) {
    addErr(cells[index + step]);
    step += 9;
  }

  step = 1;
  while (index - step >= 9 * row) {
    addErr(cells[index - step]);
    step += 1;
  }

  step = 1;
  while (index + step < 9 * row + 9) {
    addErr(cells[index + step]);
    step += 1;
  }
};

const removeErr = () => cells.forEach((e) => e.classList.remove("err"));

const saveGameInfo = () => {
  let game = {
    level: level_index,
    seconds: seconds,
    su: {
      original: su.original,
      question: su.question,
      answer: su_answer,
    },
  };
  localStorage.setItem("game", JSON.stringify(game));
};

const removeGameInfo = () => {
  localStorage.removeItem("game");
};

const isGameWin = () => console.log(su_answer);

const showResult = () => {
  result_screen.classList.add("active");
};

const initNumberInputEvent = () => {
  number_inputs.forEach((e, index) => {
    e.addEventListener("click", () => {
      if (!cells[selected_cell].classList.contains("filled")) {
        console.log(index);
        cells[selected_cell].innerHTML = index + 1;
        cells[selected_cell].setAttribute("data-value", index + 1);

        // add to answer
        let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
        let col = selected_cell % CONSTANT.GRID_SIZE;
        su_answer[row][col] = index + 1;

        // save game
        saveGameInfo();
        // -----
        removeErr();
        checkErr(index + 1);
        cells[selected_cell].classList.add("zoom-in");
        setTimeout(() => {
          cells[selected_cell].classList.remove("zoom-in");
        }, 500);
        // check game win
        if (isGameWin()) {
          // removeGameInfo(); //remove to work the complete something
          showResult();
        }
        // ----
      }
    });
  });
};

const initCellsEvent = () => {
  cells.forEach((e, index) => {
    e.addEventListener("click", () => {
      if (!e.classList.contains("filled")) {
        cells.forEach((e) => e.classList.remove("selected"));

        selected_cell = index;
        e.classList.remove("err");
        e.classList.add("selected");
        resetBg();
        hoverBg(index);
      }
    });
  });
};

const startGame = () => {
  game_screen.classList.add("active");
};

if (true) {
  initSudoku();
  startGame();
} else {
  name_input.classList.add("input-err");
  setTimeout(() => {
    name_input.classList.remove("input-err");
    name_input.focus();
  }, 500);
}

loadSudoku();
startGame();

document.querySelector("#btn-delete").addEventListener("click", () => {
  cells[selected_cell].innerHTML = "";
  cells[selected_cell].setAttribute("data-value", 0);

  let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
  let col = selected_cell % CONSTANT.GRID_SIZE;

  su_answer[row][col] = 0;

  removeErr();
});
// -------------

const init = () => {
  const game = getGameInfo();
  initGameGrid();
  initCellsEvent();
  initNumberInputEvent();
};

init();
