import React, { useState } from "react";
import "./App.css";

const GRID_SIZE = 9;
const CENTER = Math.floor(GRID_SIZE / 2);

function getNeighbors([x, y]) {
  // 8 directions (including diagonals)
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
    [x - 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y - 1],
    [x + 1, y + 1],
  ].filter(
    ([nx, ny]) =>
      nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE
  );
}

function isEdge([x, y]) {
  return x === 0 || y === 0 || x === GRID_SIZE - 1 || y === GRID_SIZE - 1;
}

function bfs(bunny, blocked) {
  // Returns the shortest path from bunny to edge, or null if trapped
  const queue = [[bunny, [bunny]]];
  const visited = new Set([bunny.toString()]);
  while (queue.length) {
    const [pos, path] = queue.shift();
    if (isEdge(pos)) return path;
    for (const n of getNeighbors(pos)) {
      if (
        !blocked.has(n.toString()) &&
        !visited.has(n.toString())
      ) {
        visited.add(n.toString());
        queue.push([n, [...path, n]]);
      }
    }
  }
  return null;
}

function App() {
  const [blocked, setBlocked] = useState(new Set());
  const [bunny, setBunny] = useState([CENTER, CENTER]);
  const [status, setStatus] = useState("");

  function handleCellClick(x, y) {
    if (status || (bunny[0] === x && bunny[1] === y)) return;
    const key = [x, y].toString();
    if (blocked.has(key)) return;
    const newBlocked = new Set(blocked);
    newBlocked.add(key);
    // Bunny moves after block
    const path = bfs(bunny, newBlocked);
    if (!path) {
      setBlocked(newBlocked);
      setStatus("You win! The bunny is trapped.");
      return;
    }
    if (isEdge(path[1])) {
      setBlocked(newBlocked);
      setBunny(path[1]);
      setStatus("You lose! The bunny escaped.");
      return;
    }
    setBlocked(newBlocked);
    setBunny(path[1]);
  }

  function resetGame() {
    setBlocked(new Set());
    setBunny([CENTER, CENTER]);
    setStatus("");
  }

  return (
    <div className="container">
      <h1>Trap the Bunny</h1>
      <div className="grid">
        {[...Array(GRID_SIZE)].map((_, x) => (
          <div className="row" key={x}>
            {[...Array(GRID_SIZE)].map((_, y) => {
              const key = [x, y].toString();
              let className = "cell";
              if (blocked.has(key)) className += " blocked";
              if (bunny[0] === x && bunny[1] === y) className += " bunny";
              return (
                <div
                  key={y}
                  className={className}
                  onClick={() => handleCellClick(x, y)}
                >
                  {bunny[0] === x && bunny[1] === y ? "🐰" : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {status && <div className="status">{status}</div>}
      <button onClick={resetGame}>Restart</button>
      <p>Click circles to block the bunny. Trap it before it escapes!</p>
    </div>
  );
}

export default App;
