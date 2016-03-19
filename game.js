"use strict";

var winResizeHandler = function() { //window 外觀
    var w = cells.width();
    cells.height(w).css({
        'line-height': w * 0.95+ 'px',
        'font-size': w + 'px'
    });   
};

$(window)
    .resize(winResizeHandler)
    .keydown(function(e) {
        e.preventDefault(); //如按空白箭步會往下捲
        initGame();
    });
    


var cells = $('.cell');
var symbols = ['&#9675;', '&times;'];
var currentStep = 0,
    currentState = [];
var gameOver = true;

var showArrow = function(p) {   //show箭頭哪個玩家開始
    if (p % 2 === 0) {
        $('.player1 > .arrow').addClass('inv');
        $('.player2 > .arrow').removeClass('inv');
    } else {
        $('.player1 > .arrow').removeClass('inv');
        $('.player2 > .arrow').addClass('inv');
    }
};

var winningCombos = {   //勝利方程式
    combo0: [0, 1, 2],
    combo1: [3, 4, 5],
    combo2: [6, 7, 8],
    combo3: [0, 3, 6],
    combo4: [1, 4, 7],
    combo5: [2, 5, 8],
    combo6: [0, 4, 8],
    combo7: [2, 4, 6]
};

var potentialCombos = {     //檢查組合方程式
    0: ['combo0', 'combo3', 'combo6'],
    1: ['combo0', 'combo4'],
    2: ['combo0', 'combo5', 'combo7'],
    3: ['combo1', 'combo3'],
    4: ['combo1', 'combo4', 'combo6', 'combo7'],
    5: ['combo1', 'combo5'],
    6: ['combo2', 'combo3', 'combo7'],
    7: ['combo2', 'combo4'],
    8: ['combo2', 'combo5', 'combo6'],
};





var initGame = function() { //初始化
    if (gameOver) {
        cells.empty();  //元素清空
        for (var i = 0; i < 9; i++) {
            currentState[i] = null;
        }
        currentStep = 0;
        showArrow(currentStep);
        gameOver = false;
        cells.removeClass('win');
        $('.ss').text('');
    }
};

initGame();


var checkCombo = function(a) { //定應checkCombo 並檢查一個人在這三個陣列都案上自己的標記
    var a0 = currentState[a[0]],
        a1 = currentState[a[1]],
        a2 = currentState[a[2]];
    var w = (a0 === a1 && a1 === a2);
    if (w) {
        $('.cell[data-i="' + a[0] + '"]').addClass('win');
        $('.cell[data-i="' + a[1] + '"]').addClass('win');
        $('.cell[data-i="' + a[2] + '"]').addClass('win');
    }
    return w;
};

var cellClickHandler = function() { //點擊回乎函釋
    if (!gameOver) {
        var $this = $(this);
        var i = $this.data('i');
        if (currentState[i] === null) {
            var s = symbols[currentStep++ % 2];
            currentState[i] = s;
            $this.html(s);
            for (var j = 0, len = potentialCombos[i].length; j < len; j++) {
                if (checkCombo(winningCombos[potentialCombos[i][j]])) { //連成線
                    gameOver = true;
                    $('.ss').text('Press any key to start new game.');
                    return;
                }
            }
            if (currentStep === 9) {    //所有格子都被點過 平手
                gameOver = true;
                $('.ss').text('Draw! Press any key to start new game.');
                return;
            }
            showArrow(currentStep);
        }
    }
};

cells.click(cellClickHandler);
winResizeHandler();
