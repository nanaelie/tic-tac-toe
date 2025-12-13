const winCases = [
    [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [1, 1, 1]],

    [[1, 0, 0], [1, 0, 0], [1, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 1], [0, 0, 1], [0, 0, 1]],

    [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    [[0, 0, 1], [0, 1, 0], [1, 0, 0]]
];

const $ = (e) => document.querySelector(e);
const all = (e, a) => $(e).querySelectorAll(a);
const bind = (item, event, callback) => item.addEventListener(event, callback);
const add = (item, value) => {
    item.textContent = value;
};

function getArrays() {
    const r = [];
    let z = [];
    all('.buttons', '.item').forEach(item => {
        const val = item.textContent.trim();
        if (val === '×') z.push(1);
        else if (val === 'o') z.push(2);
        else z.push(0);

        if (z.length === 3) {
            r.push(z);
            z = [];
        }
    });
    return r;
}

function checkWin(board, player) {
    for (let pattern of winCases) {
        let win = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (pattern[i][j] === 1 && board[i][j] !== player) {
                    win = false;
                }
            }
        }
        if (win) return true;
    }
    return false;
}

function isFull(board) {
    return board.every(row => row.every(cell => cell !== 0));
}

function reinit() {
    all('.buttons', '.item').forEach(item => {
        item.setAttribute("disabled", "true");
        item.style.setProperty("cursor", "cursor: not-allowed !important");
    });

    setTimeout(() => {
        all('.buttons', '.item').forEach(item => {
            item.removeAttribute("disabled");
            item.style.setProperty("cursor", "pointer");
            item.style.color = '';
            add(item, '');
        });
    }, 3000);
}


all('.buttons', '.item').forEach(item => {
    bind(item, 'click', () => {
        let userWins = localStorage.getItem('userWins') | 0;
        let computerWins = localStorage.getItem('computerWins') | 0;
        let draw = localStorage.getItem('draw') | 0;

        if (item.textContent.trim() !== '') return;
        add(item, '×');
        let board = getArrays();

        if (checkWin(board, 1)) {
            Alert('You won ! 🎉🙂');
            reinit();
            userWins++;
            localStorage.setItem('userWins', JSON.stringify(userWins));
            return;
        }
        if (isFull(board)) {
            Alert('Draw 😤');
            reinit();
            draw++;
            localStorage.setItem('draw', JSON.stringify(draw));
            return;
        }

        let level = parseInt($('.levelNameText').dataset.id);
        computerPlay(level);
        board = getArrays();

        if (checkWin(board, 2)) {
            Alert('Computer won ! 😐');
            reinit();
            computerWins++;
            localStorage.setItem('computerWins', JSON.stringify(computerWins));
            return;
        }
        if (isFull(board)) {
            Alert('Draw 😤');
            draw++;
            localStorage.setItem('draw', JSON.stringify(draw));
            reinit();
            return;
        }
    });
});

function findBestMove(board, player) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === 0) {
                board[i][j] = player;
                if (checkWin(board, player)) {
                    board[i][j] = 0;
                    return [i, j];
                }
                board[i][j] = 0;
            }
        }
    }

    const opponent = player === 1 ? 2 : 1;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === 0) {
                board[i][j] = opponent;
                if (checkWin(board, opponent)) {
                    board[i][j] = 0;
                    return [i, j];
                }
                board[i][j] = 0;
            }
        }
    }

    return null;
}

function computerPlay(difficulty) {
    const items = all('.buttons', '.item');
    const empty = Array.from(items).filter(item => item.textContent.trim() === '');

    if (empty.length === 0) return;

    const board = getArrays();

    if (difficulty === 1) {
        const randomItem = empty[Math.floor(Math.random() * empty.length)];
        add(randomItem, 'o');
        randomItem.style.color = '#FFE003';
    }

    else if (difficulty === 2) {
        const best = findBestMove(board, 2);
        if (best) {
            const i = best[0] * 3 + best[1];
            add(items[i], 'o');
            items[i].style.color = '#FFE003';
        } else {
            const randomItem = empty[Math.floor(Math.random() * empty.length)];
            add(randomItem, 'o');
            randomItem.style.color = '#FFE003';
        }
    }

    else if (difficulty === 3) {
        const best = minimaxMove(board, 2);
        if (best) {
            const i = best[0] * 3 + best[1];
            add(items[i], 'o');
            items[i].style.color = '#FFE003';
        }
    }
}


function minimaxMove(board, player) {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === 0) {
                board[i][j] = player;
                const score = minimax(board, 0, false, player);
                board[i][j] = 0;
                if (score > bestScore) {
                    bestScore = score;
                    move = [i, j];
                }
            }
        }
    }

    return move;
}


function minimax(board, depth, isMaximizing, player) {
    const opponent = player === 1 ? 2 : 1;

    if (checkWin(board, player)) return 10 - depth;
    if (checkWin(board, opponent)) return depth - 10;
    if (isFull(board)) return 0;

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) {
                    board[i][j] = player;
                    const eval = minimax(board, depth + 1, false, player);
                    board[i][j] = 0;
                    maxEval = Math.max(maxEval, eval);
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) {
                    board[i][j] = opponent;
                    const eval = minimax(board, depth + 1, true, player);
                    board[i][j] = 0;
                    minEval = Math.min(minEval, eval);
                }
            }
        }
        return minEval;
    }
}


$('.prev').onclick = function(e) {
    let level = $('.levelNameText').dataset.id;

    if (level === '2') {
        add($('.levelNameText'), 'Level 1');
        $('.levelNameText').setAttribute('data-id', 1);
    }
    else if (level === '3') {
        add($('.levelNameText'), 'Level 2');
        $('.levelNameText').setAttribute('data-id', 2);
    }
}

$('.next').onclick = function(e) {
    let level = $('.levelNameText').dataset.id;

    if (level === '1') {
        add($('.levelNameText'), 'Level 2');
        $('.levelNameText').setAttribute('data-id', 2);
    }
    else if (level === '2') {
        add($('.levelNameText'), 'Level 3');
        $('.levelNameText').setAttribute('data-id', 3);
    }
}

function Alert(message) {
    setTimeout(() => {
        const alertView = $('.alert');
        add($('.message'), message);

        let t = setInterval(() => {
            alertView.style.display = 'flex';
            all('.container', '.leftside').forEach(ctn => {
                ctn.style.filter = 'blur(4px)';
            });

            all('.container', 'button').forEach(btn => {
                btn.setAttribute('disabled', 'true');
            });
        }, 0);

        setTimeout(() => {
            clearInterval(t);
            alertView.style.display = 'none';
            $('.container').style.filter = 'none';

            all('.container', 'button').forEach(btn => {
                btn.removeAttribute('disabled');
            });
        }, 3000);
    }, 500);
}

// Alert('Vous avez gagné ! 🎉');
