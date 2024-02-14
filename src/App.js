import React, { useState } from 'react';
import './App.css';

const X_CLASS = 'X';
const O_CLASS = 'Y';
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function App() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState(X_CLASS);
    const [gameActive, setGameActive] = useState(true);

    const handleClick = index => {
        if (gameActive && !board[index]) {
            const newBoard = [...board];
            newBoard[index] = currentPlayer;
            setBoard(newBoard);
            if (checkWin(currentPlayer)) {
                endGame(false);
            } else if (isDraw()) {
                endGame(true);
            } else {
                setCurrentPlayer(currentPlayer === X_CLASS ? O_CLASS : X_CLASS);
            }
        }
    };

    const endGame = draw => {
        if (draw) {
            alert('Empate!');
        } else {
            alert(`O jogador ${currentPlayer} venceu!`);
        }
        setGameActive(false);
    };

    const isDraw = () => {
        return board.every(cell => cell !== null);
    };

    const checkWin = currentClass => {
        return winningCombos.some(combination => {
            return combination.every(index => {
                return board[index] === currentClass;
            });
        });
    };

    return (
        <div className="App flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Jogo da Velha</h1>
            <div className="board grid grid-cols-3 gap-2">
                {board.map((cell, index) => (
                    <div
                        key={index}
                        className="cell bg-white border border-gray-300 flex items-center justify-center text-5xl cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-100"
                        onClick={() => handleClick(index)}
                    >
                        {cell}
                    </div>
                ))}
            </div>
            <div className="status text-lg mt-8">É a vez do jogador {currentPlayer}</div>
            <button
                className="restart-button bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-8"
                onClick={() => window.location.reload()}
            >
                Reiniciar
            </button>
        </div>
    );
}

export default App;
