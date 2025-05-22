import { useState } from "react";

function App() {
  let getEmptySudoku = () => {
    let emptySudoku = [];
    for (let i = 0; i < n; i++) {
      emptySudoku[i] = Array(n).fill(8);
    }
    return emptySudoku;
  };

  let n = 9;
  let [sudoku, setSudoku] = useState(getEmptySudoku);

  let solveSudoku = (sudoku) => {
    let newSudoku = [];
    setSudoku(newSudoku);
  };

  return (
    <div className="font-[Urbanist] font-bold bg-[#ffb802] w-full min-h-screen flex items-center justify-center bg-[radial-gradient(#000000_1px,transparent_1px)] bg-[size:20px_20px]">
      <div className="bg-white min-h-[80%] p-10 py-8 rounded-4xl border-3 border-black shadow-[6px_6px_0px_0px_#000000] flex flex-col gap-8 justify-between">
        {/* heading */}
        <div className="flex flex-col">
          <h1 className="text-4xl text-center">SudokuSolver</h1>
        </div>

        {/* sudoku */}
        <div className="w-full flex justify-center">
          <div className="flex flex-col w-fit justify-center items-center rounded-3xl border-3 border-black p-4 shadow-[6px_6px_0px_0px_#000000]">
            {sudoku.map((row, rowIndex) => (
              <div
                className="w-fit h-fit flex flex-row justify-center items-center"
                key={rowIndex}
              >
                {row.map((col, colIndex) => (
                  <div
                    className={`w-10 h-10 text-xl flex items-center justify-center
                      ${rowIndex === 2 || rowIndex === 5 ? "border-b-3" : ""}
                      ${colIndex === 2 || colIndex === 5 ? "border-r-3" : ""}
                      ${rowIndex !== 8 ? "border-b" : ""}
                      ${colIndex !== 8 ? "border-r" : ""}
                    `}
                    key={colIndex}
                  >
                    {sudoku[rowIndex][colIndex]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* solve button */}
        <button
          className="rounded-full border-3 border-black shadow-[6px_6px_0px_0px_#000000] py-3 text-xl cursor-pointer active:translate-[6px] active:shadow-none"
          onclick={solveSudoku}
        >
          Solve
        </button>
      </div>
    </div>
  );
}

export default App;
