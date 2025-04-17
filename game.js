const boardSize = 10;  // 10x10 grid
let currentPlayer = 'X';  // Start with player X
let gameBoard = [];  // 2D array to store the board state
let isGameOver = false;
let isAI = false;  // Set to true for Player vs AI

// Elements
const gameBoardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('resetButton');

// Create a 10x10 grid for Tic-Tac-Toe
function createBoard() {
    gameBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
    gameBoardElement.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameBoardElement.appendChild(cell);
        }
    }
}

// Handle cell click (Player's turn)
function handleCellClick(event) {
    if (isGameOver) return;

    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (gameBoard[row][col] !== null) return;  // Cell is already taken

    // Update the board
    gameBoard[row][col] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add('taken');

    // Check if the current player wins
    if (checkWin(row, col)) {
        statusElement.textContent = `${currentPlayer} wins!`;
        isGameOver = true;
        return;
    }

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = currentPlayer === 'X' ? "Player X's turn" : "AI's turn";

    // If it's AI's turn, make a move
    if (currentPlayer === 'O' && isAI) {
        aiMove();
    }
}

// Check for a win condition (5 in a row)
function checkWin(row, col) {
    return (
        checkDirection(row, col, 1, 0) ||  // Check horizontal
        checkDirection(row, col, 0, 1) ||  // Check vertical
        checkDirection(row, col, 1, 1) ||  // Check diagonal (\)
        checkDirection(row, col, 1, -1)    // Check diagonal (/)
    );
}

// Check in a specific direction for a win (5 in a row)
function checkDirection(row, col, rowDir, colDir) {
    let count = 1;

    // Check in the positive direction
    for (let i = 1; i < 5; i++) {
        const newRow = parseInt(row) + i * rowDir;
        const newCol = parseInt(col) + i * colDir;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && gameBoard[newRow][newCol] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }

    // Check in the negative direction
    for (let i = 1; i < 5; i++) {
        const newRow = parseInt(row) - i * rowDir;
        const newCol = parseInt(col) - i * colDir;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && gameBoard[newRow][newCol] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }

    return count >= 5;  // 5 in a row to win
}

// AI's move (Random AI)
function aiMove() {
    if (isGameOver) return;

    let availableMoves = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (gameBoard[row][col] === null) {
                availableMoves.push([row, col]);
            }
        }
    }

    // Pick a random available move
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const row = randomMove[0];
    const col = randomMove[1];

    // Update the board with AI's move
    gameBoard[row][col] = 'O';
    const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    cell.textContent = 'O';
    cell.classList.add('taken');

    // Check if AI wins
    if (checkWin(row, col)) {
        statusElement.textContent = "AI wins!";
        isGameOver = true;
        return;
    }

    // Switch players after AI's move
    currentPlayer = 'X';
    statusElement.textContent = "Player X's turn";
}

// Reset the game
function resetGame() {
    createBoard();
    currentPlayer = 'X';
    statusElement.textContent = "Player X's turn";
    isGameOver = false;
}

// Initialize the game
function startGame(isAgainstAI) {
    isAI = isAgainstAI;
    resetGame();
    if (isAI) {
        statusElement.textContent = "AI's turn";
        currentPlayer = 'O';  // AI starts
        aiMove();
    }
}

// Add event listeners
resetButton.addEventListener('click', () => startGame(isAI));

// Start Player vs Player game by default
startGame(false);
