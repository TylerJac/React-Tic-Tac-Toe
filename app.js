// Import the useState hook from React
import { useState } from 'react';

// Component for rendering a single square button
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Component for rendering the game board
function Board({ isXNext, squares, onPlay }) {
  // Handle click event for a square
  function handleSquareClick(index) {
    // Ignore the click if the game is already won or the square is filled
    if (getWinner(squares) || squares[index]) {
      return;
    }
    // Create a copy of the squares array
    const updatedSquares = squares.slice();
    // Set the square to 'X' or 'O' based on the current player
    if (isXNext) {
      updatedSquares[index] = 'X';
    } else {
      updatedSquares[index] = 'O';
    }
    // Call the onPlay function with the updated squares
    onPlay(updatedSquares);
  }

  // Calculate the winner
  const winner = getWinner(squares);
  // Set the status message
  let statusMessage;
  if (winner) {
    statusMessage = 'Winner: ' + winner;
  } else {
    statusMessage = 'Next player: ' + (isXNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{statusMessage}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleSquareClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleSquareClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleSquareClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleSquareClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleSquareClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleSquareClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleSquareClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleSquareClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleSquareClick(8)} />
      </div>
    </>
  );
}

// Main component for the game
export default function Game() {
  // State for the history of moves
  const [movesHistory, setMovesHistory] = useState([Array(9).fill(null)]);
  // State for the current move
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  // Determine the current player
  const isXNext = currentMoveIndex % 2 === 0;
  // Get the squares for the current move
  const currentSquares = movesHistory[currentMoveIndex];

  // Handle the play event
  function handlePlay(updatedSquares) {
    // Create a new history array with the updated squares
    const updatedHistory = [...movesHistory.slice(0, currentMoveIndex + 1), updatedSquares];
    // Update the history and current move state
    setMovesHistory(updatedHistory);
    setCurrentMoveIndex(updatedHistory.length - 1);
  }

  // Jump to a specific move
  function jumpTo(moveIndex) {
    setCurrentMoveIndex(moveIndex);
  }

  // Create a list of move buttons
  const moveButtons = movesHistory.map((squares, move) => {
    let description;
    if (move === 0) {
      description = 'Go to game start';
    } else {
      description = 'Go to move #' + move;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board isXNext={isXNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moveButtons}</ol>
      </div>
    </div>
  );
}

// Helper function to calculate the winner of the game
function getWinner(squares) {
  // Winning combinations
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Check each combination to see if there's a winner
  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
