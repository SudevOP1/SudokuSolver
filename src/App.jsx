import { useState, useRef } from "react";

const App = () => {
  let getEmptySudoku = () => {
    return Array(9).fill(Array(9).fill(0));
  };

  let [sudoku, setSudoku] = useState(getEmptySudoku);
  let [error, setError] = useState(["", ""]);
  let inputRefs = useRef([...Array(9)].map(() => Array(9).fill(null)));

  let colors = {
    pageBg: "bg-amber-400",
    cardBg: "bg-white",
    gridBg: "bg-yellow-300",
    solveBtnBg: "bg-green-400",
    errorBg: "bg-red-400",
    clearBtnBg: "bg-cyan-400",
    errorBtnBg: "bg-orange-200",
  };

  let focusCell = (row, col) => {
    if (inputRefs.current[row] && inputRefs.current[row][col]) {
      inputRefs.current[row][col].focus();
    }
  };

  let gridIsValid = (grid) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] !== 0) {
          let temp = grid[i][j];
          grid[i][j] = 0;
          if (!isSafe(grid, i, j, temp)) {
            grid[i][j] = temp;
            return false;
          }
          grid[i][j] = temp;
        }
      }
    }
    return true;
  };

  let isSafe = (grid, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] === num) return false;
      }
    }
    return true;
  };

  let solveHelper = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveHelper(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  let solveSudoku = () => {
    if (!gridIsValid(sudoku)) {
      setError(["Invalid Sudoku!", "This pattern cannot be solved"]);
      // console.log("wrong");
      return;
    }
    let newSudoku = sudoku.map((row) => [...row]);
    if (solveHelper(newSudoku)) {
      setSudoku(newSudoku);
    } else {
      setError(["Error!", "No solutions exist for this pattern"]);
    }
  };

  let handleInputChange = (e, row, col) => {
    let value = e.target.value;
    let num = 0;

    if (value !== "" && value !== " ") {
      num = parseInt(value);
      if (isNaN(num) || num < 1 || num > 9) return;
    }

    let newSudoku = sudoku.map((row) => [...row]);
    newSudoku[row][col] = num;
    setSudoku(newSudoku);

    // move focus to next cell if a number was entered
    if (num !== 0) {
      let nextRow = row;
      let nextCol = col + 1;
      if (nextCol >= 9) {
        nextCol = 0;
        nextRow++;
      }
      if (nextRow < 9) {
        focusCell(nextRow, nextCol);
      }
    }
  };

  let handleKeyDown = (e, row, col) => {
    let acceptedKeys = [
      " ", // space key
      "Delete",
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];
    if (acceptedKeys.includes(e.key)) {
      e.preventDefault();
    }

    // space / delete / backspace keys to skip cell
    if (e.key === " " || e.key === "Delete" || e.key === "Backspace") {
      let newSudoku = sudoku.map((r) => [...r]);
      newSudoku[row][col] = 0;
      setSudoku(newSudoku);
    }

    // arrow keys to move focus
    let nextCol = col;
    let nextRow = row;
    if (e.key === "ArrowLeft") nextCol = col - 1;
    if (e.key === "ArrowRight") nextCol = col + 1;
    if (e.key === "ArrowUp") nextRow = row - 1;
    if (e.key === "ArrowDown") nextRow = row + 1;
    if (nextCol >= 0 && nextCol <= 8 && nextRow >= 0 && nextRow <= 8) {
      focusCell(nextRow, nextCol);
    }
  };

  return (
    <>
      {/* errors */}
      {error[0].length !== 0 && (
        <div
          className={`
            ${colors.errorBg}
            fixed top-[50%] left-[50%] translate-[-50%] w-[40%] p-8 py-6 flex flex-col gap-6
            border-4 rounded-3xl border-black shadow-[6px_6px_0px_0px_#000000]
            animate-[popup_0.3s_ease-out]
          `}
        >
          <h1 className="text-4xl font-bold">{error[0]}</h1>
          <p className="text-2xl font-semibold">{error[1]}</p>
          <button
            className={`
              ${colors.errorBtnBg} rounded-full border-4 border-black py-3 px-6 text-xl font-bold
              cursor-pointer transition-all active:translate-x-2 active:translate-y-2
              active:shadow-none flex-1 shadow-[6px_6px_0px_0px_#000000]
            `}
            onClick={() => setError(["", ""])}
          >
            Ok
          </button>
        </div>
      )}

      {/* bg */}
      <div
        className={`
        ${colors.pageBg} font-[Urbanist] font-bold w-full min-h-screen flex items-center
        justify-center bg-[radial-gradient(#000000_1px,transparent_1px)] bg-[size:20px_20px]
      `}
      >
        <div
          className={`
          ${colors.cardBg} min-h-[80%] p-10 py-8 rounded-3xl border-4 border-black flex
          flex-col gap-8 justify-between shadow-[6px_6px_0px_0px_#000000]
        `}
        >
          <h1 className="text-4xl text-center">SudokuSolver</h1>

          {/* Sudoku grid */}
          <div className="w-full flex justify-center">
            <div
              className={`
              ${colors.gridBg} flex flex-col w-fit justify-center items-center rounded-3xl
              border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000000]
            `}
            >
              {sudoku.map((row, rowIndex) => (
                <div
                  className="w-fit h-fit flex flex-row justify-center items-center"
                  key={rowIndex}
                >
                  {row.map((cell, colIndex) => (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      ref={(el) => (inputRefs.current[rowIndex][colIndex] = el)}
                      className={`
                      w-10 h-10 text-xl text-center border-black outline-none
                      ${rowIndex === 2 || rowIndex === 5 ? "border-b-4" : ""}
                      ${colIndex === 2 || colIndex === 5 ? "border-r-4" : ""}
                      ${rowIndex !== 8 ? "border-b" : ""}
                      ${colIndex !== 8 ? "border-r" : ""}
                    `}
                      maxLength={1}
                      value={cell === 0 ? "" : cell}
                      onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* buttons */}
          <div className="flex gap-4">
            <button
              className={`
              ${colors.solveBtnBg} rounded-full border-4 border-black py-3 px-6 text-xl
              cursor-pointer transition-all active:translate-x-2 active:translate-y-2
              active:shadow-none flex-1 shadow-[6px_6px_0px_0px_#000000]
            `}
              onClick={solveSudoku}
            >
              Solve
            </button>
            <button
              className={`
              ${colors.clearBtnBg} rounded-full border-4 border-black py-3 px-6 text-xl
              cursor-pointer transition-all active:translate-x-2 active:translate-y-2
              active:shadow-none flex-1 shadow-[6px_6px_0px_0px_#000000]
            `}
              onClick={() => setSudoku(getEmptySudoku())}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* animations */}
      <style>
        {`
          @keyframes popup {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-popup {
            animation: popup 0.3s ease-out;
          }
        `}
      </style>


    </>
  );
};

export default App;
