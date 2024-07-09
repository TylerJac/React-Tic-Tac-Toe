// Import the useState hook from React
import { useState } from 'react';

// Component for rendering a single square button
function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

// Component for rendering the game board
function Board({ squares, onClick }) {
  function renderSquare(i) {
    return <Square value={squares[i]} onClick={() => onClick(i)} />;
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

// Main component for the game
export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  // Get the current squares and calculate the winner
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  // Handle the square click event
  function handleClick(i) {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();

    if (winner || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(newHistory.concat([{ squares: squares, location: getLocation(i) }]));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  }

  // Handle the move click event
  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  // Get the status message
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Create the list of moves
  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move + ' (' + step.location + ')' :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} style={{ fontWeight: move === stepNumber ? 'bold' : 'normal' }}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Helper function to calculate the winner of the game
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Helper function to get the location of the move
function getLocation(index) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return `(${col}, ${row})`;
}
