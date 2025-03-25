import React, { useState, useEffect } from 'react';
import './App.css';

const X_CLASS = 'X';
const O_CLASS = 'O';
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

    useEffect(() => {
        if (currentPlayer === O_CLASS && gameActive) {
            setTimeout(aiMove, 500); // IA joga com delay
        }
    }, [currentPlayer, gameActive]);

    const handleClick = index => {
        if (gameActive && !board[index] && currentPlayer === X_CLASS) {
            makeMove(index, X_CLASS);
        }
    };

    const makeMove = (index, player) => {
        const newBoard = [...board];
        newBoard[index] = player;
        setBoard(newBoard);

        if (checkWin(newBoard, player)) {
            setGameActive(false);
            setTimeout(() => {
                alert(`O jogador ${player} venceu!`);
                restartGame(); // Reinicia o jogo após a vitória
            }, 500);
            return;
        }

        if (isDraw(newBoard)) {
            setGameActive(false);
            setTimeout(() => {
                alert('Empate!');
                restartGame(); // Reinicia o jogo após empate
            }, 500);
            return;
        }

        setCurrentPlayer(player === X_CLASS ? O_CLASS : X_CLASS);
    };

    const aiMove = () => {
        if (!gameActive) return; // Impede jogadas após o jogo acabar

        const bestMove = minimax(board, O_CLASS);
        makeMove(bestMove.index, O_CLASS); // IA joga a melhor jogada
    };

    const minimax = (board, player) => {
        const availableSpots = board
            .map((val, index) => (val === null ? index : null))
            .filter(val => val !== null);

        if (checkWin(board, X_CLASS)) return { score: -10 };
        if (checkWin(board, O_CLASS)) return { score: 10 };
        if (isDraw(board)) return { score: 0 };

        let moves = [];

        availableSpots.forEach(spot => {
            const newBoard = [...board];
            newBoard[spot] = player;

            let move = {};
            move.index = spot;
            if (player === O_CLASS) {
                const result = minimax(newBoard, X_CLASS); // Simula a jogada do jogador
                move.score = result.score;
            } else {
                const result = minimax(newBoard, O_CLASS); // Simula a jogada da IA
                move.score = result.score;
            }

            moves.push(move);
        });

        let bestMove;
        if (player === O_CLASS) {
            let bestScore = -Infinity;
            moves.forEach(move => {
                if (move.score > bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            });
        } else {
            let bestScore = Infinity;
            moves.forEach(move => {
                if (move.score < bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            });
        }

        return bestMove;
    };

    const isDraw = (newBoard) => {
        return newBoard.every(cell => cell !== null);
    };

    const checkWin = (newBoard, player) => {
        return winningCombos.some(combination =>
            combination.every(index => newBoard[index] === player)
        );
    };

    const restartGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer(X_CLASS);
        setGameActive(true);
    };

    return (
        <div className="App flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Jogo da Velha</h1>
            <div className="board grid grid-cols-3 gap-2">
                {board.map((cell, index) => (
                    <div
                        key={index}
                        className={`cell bg-white border border-gray-300 flex items-center justify-center text-5xl cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-100 ${!gameActive ? "pointer-events-none opacity-50" : ""
                            }`}
                        onClick={() => handleClick(index)}
                    >
                        {cell}
                    </div>
                ))}
            </div>
            <div className="status text-lg mt-8">
                {gameActive ? `É a vez do jogador ${currentPlayer}` : "Jogo Encerrado"}
            </div>
        </div>
    );
}

export default App;
