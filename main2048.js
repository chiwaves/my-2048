var board = new Array();
var hasConflicted = new Array();
var score = 0;
var best = 0;
var first2048 = true;

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
    newgame();
});

function newgame() {
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    $(".gameover").css("display", "none");
    $("#grid-container").css("opacity", 1);
    $('#keep').remove();
    score = 0;
    first2048 = true;
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
        {
            //生成每一个小格子grid-cell-i-j的css样式中的top值和left值
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }

    for (var i = 0; i < 4; i++) {
        //此时board还是一维数组，再遍历对每一个board[i]声明，成为二维数组
        board[i] = new Array();
        hasConflicted[i]  = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBoardView();
}

function updateBoardView() 
{
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
        {
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] == 0)
            {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + 50);
                theNumberCell.css('left', getPosLeft(i, j) + 50);
            }
            else
            {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.css('font-size', getNumberSize(board[i][j]));
                theNumberCell.text(board[i][j]);
                if (board[i][j] == 1024 || board[i][j] == 2048)
                    theNumberCell.css('box-shadow', '0 0 30px 10px rgba(243, 215, 116, 0.47619), inset 0 0 0 1px rgba(255, 255, 255, 0.28571)');
            }
            hasConflicted[i][j] = 0;
        }
    $("#score").text(score);
    if (score > best) {
        best = score;
        $("#best").text(score);
    }
}

function generateOneNumber() {
    var times = 0;
    if (nospace(board))
        return false;

    //随机生成一个位置，如果这个位置已经有数字了，则继续随机生成一个位置，直至这个位置是空位
    do {
        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }  
    while (board[randx][randy] != 0 && times < 64)

    if (times == 64)
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                if (board[i][j] == 0)
                {
                    randx = i;
                    randy = j;
                }

    //随机生成一个数字
    var randNumber = Math.random() < 0.8 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

/*
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    while (true) {
        if (board[randx][randy] == 0)
            break;
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
    }
*/

$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37: //键盘向左键
            event.preventDefault();
            if (moveLeft()) {
                /*生成一个新数字函数延后是为了防止出现移动的数字穿过新生成的数字，
                所有延后都是同步的，不是异步的，因此moveLeft中updateBoardView延后了200，
                这里要延后210，下面延后320同理*/
                setTimeout("generateOneNumber()", 210);
                /*此处延后是为了gameover动画产生前完成最后一次数字移动动画*/
                setTimeout("isgameover()", 360);
            }
            break;
        case 38: //键盘向上键键
            event.preventDefault();
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 360);
            }
            break;
        case 39: //键盘向右键键键
            event.preventDefault();
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 360);
            }
            break;
        case 40: //键盘向下键
            event.preventDefault();
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 360);
            }
        default:
            break;
    }
})

document.addEventListener('touchstart', function(event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend', function(event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if (Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth)
        return;

    if (Math.abs(deltax) > Math.abs(deltay)) {
        if (deltax > 0) {
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 360);
            }
        }
        else {
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 360);
            }
        }
    }
    else {
        if (deltay > 0) {
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 360);
            }
        }
        else {
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 360);
            }
        }
    }
});

function isgameover() {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] == 2048 && first2048) {
                first2048 = false;
                gamewin();
                return true;
            }
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board))
                return false;
    $("#grid-container").css('opacity', '0.3');
    $(".gameover").css('display', 'block');
    return true;
}

function gamewin() {
    $('.gameover h2').text('You Win!');
    $('#lower').prepend('<a href="javascript:keepgoing();" class="choice" id="keep">Keep Going</a>');
    $("#grid-container").css('opacity', '0.3');
    $(".gameover").css('display', 'block');
}

function keepgoing() {
    $("#grid-container").css('opacity', 1);
    $(".gameover").css('display', 'none');
    $('.gameover h2').text('Game Over!');
    $('#keep').remove();
}

function moveLeft() {
    if (!canMoveLeft(board))
        return false;
    
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++)
            if (board[i][j] != 0)
                for (var k = 0; k < j; k++)
                {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board))
                    {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k])
                    {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        hasConflicted[i][k] = true;
                        score += board[i][k];
                        break;
                    }
                }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board))
        return false;

    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++)
            if (board[i][j] != 0)
                for (var k = 0; k < i; k++)
                {
                    if (board[k][j] == 0 && noBlockVertical(k, i, j, board))
                    {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j])
                    {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        hasConflicted[k][j] = true;
                        score += board[k][j];
                        break;
                    }
                }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board))
        return false;

    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--)
            if (board[i][j] != 0)
                for (var k = 3; k > j; k--)
                {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board))
                    {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k])
                    {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        hasConflicted[i][k] = true;
                        score += board[i][k];
                        break;
                    }
                }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board))
        return false;

    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--)
            if (board[i][j] != 0)
                for (var k = 3; k > i; k--)
                {
                    if (board[k][j] == 0 && noBlockVertical(i, k, j, board))
                    {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j])
                    {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        hasConflicted[k][j] = true;
                        score += board[k][j];
                        break;
                    }
                }

    setTimeout("updateBoardView()", 200);
    return true;
}