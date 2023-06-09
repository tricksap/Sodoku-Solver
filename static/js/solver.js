function convertTo1DIndex(row, column, totalColumns) {
  return row * totalColumns + column;
}

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

function solveSudoku(board) {
  if (solveHelper(board)) {
    return board;
  } else {
    return "No solution exists.";
  }
}

async function solveHelper(board) {
  const emptySpot = findEmptySpot(board);
  await sleep(200);
  if (!emptySpot) {
    return true; // No more empty spots, Sudoku is solved
  }

  const [row, col] = emptySpot;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      let index = convertTo1DIndex(row, col, numColumns);
      const boardCopy = JSON.parse(JSON.stringify(board)); // Create a copy of the board
      console.log(boardCopy); // Display the copy after each attempt
      cells[index].innerHTML = num;
      cells[index].setAttribute("data-value", num);

      if (await solveHelper(board)) {
        return true;
      }

      // Undo the current cell for backtracking
      board[row][col] = 0;
      cells[index].innerHTML = 0;
      cells[index].setAttribute("data-value", 0);
    }
  }

  return false; // No valid number found
}

function findEmptySpot(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null; // No empty spots left
}

function isValid(board, row, col, num) {
  // Check if the number already exists in the row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) {
      return false;
    }
  }

  // Check if the number already exists in the column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) {
      return false;
    }
  }

  // Check if the number already exists in the 3x3 grid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true; // The number is valid
}

let board = su.question;

const numRows = board.length;
const numColumns = board[0].length;

// Get a reference to the div element
const gameLevelDiv = document.getElementById("game-level");

// Add an event listener to the div
gameLevelDiv.addEventListener("click", function () {
  solveSudoku(board);
});
