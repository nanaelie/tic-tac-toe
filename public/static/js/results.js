const $ = (e) => document.querySelector(e);
const add = (item, value) => {
    item.textContent = value;
};

let userWins = localStorage.getItem('userWins') | 0;
let computerWins = localStorage.getItem('computerWins') | 0;
let draw = localStorage.getItem('draw') | 0;

userWins = parseInt(userWins) < 10 ? `0${userWins}` : `${userWins}`;
computerWins = parseInt(computerWins) < 10 ? `0${computerWins}` : `${computerWins}`;
draw = parseInt(draw) < 10 ? `0${draw}` : `${draw}`;

const userWinsValue = $('.userWinValue');
const computerWinsValue = $('.computerWinValue');
const drawValue = $('.drawValue');

add(userWinsValue, userWins);
add(computerWinsValue, computerWins);
add(drawValue, draw);

$('.reset').onclick = function() {
    localStorage.setItem('userWins', 0);
    localStorage.setItem('computerWins', 0);
    localStorage.setItem('draw', 0);

    add(userWinsValue, '00');
    add(computerWinsValue, '00');
    add(drawValue, '00');
}