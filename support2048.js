documentWidth = window.screen.availWidth;

function getPosTop(i, j) {
	return i*120 + 20;
}

function getPosLeft(i, j) {
	return j*120 + 20;
}

function getNumberBackgroundColor(number) {
	switch (number) {
		case 2:return "#EEE4DA";break;
		case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#a6c";break;
        case 256:return "#edcc61";break;
        case 512:return "#EDC850";break;
        case 1024:return "#EDC53F";break;
        case 2048:return "#EDC22E";break;
        case 4096:return "#93c";break;
	}
	return "#000";
}

function getNumberSize(number) {
	if (number < 128)
		return "55px";
	else if (number >= 128 && number < 1024)
		return "45px";
	else if (number >= 1024 && number <= 8192)
		return "35px";
	else
		return "30px";
}

function getNumberColor(number) {
	if (number <= 4)
		return "#776E65";
	else
		return "#FFF";
}

function nospace(board) {

	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++)
			if (board[i][j] == 0)
				return false;
			
	return true;
}

function canMoveLeft(board) {
	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++)
			if (board[i][j] != 0)
				if (board[i][j-1] == 0 || board[i][j-1] == board[i][j])
					return true;

	return false;
}

function canMoveUp(board) {
	for (var i = 1; i < 4; i++)
		for (var j = 0; j < 4; j++)
			if (board[i][j] != 0)
				if (board[i-1][j] == 0 || board[i-1][j] == board[i][j])
					return true;
	return false;
}

function canMoveRight(board) {
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 3; j++)
			if (board[i][j] != 0)
				if (board[i][j+1] == 0 || board[i][j+1] == board[i][j])
					return true;

	return false;
}

function canMoveDown(board) {
	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 4; j++)
			if (board[i][j] != 0)
				if (board[i+1][j] == 0 || board[i+1][j] == board[i][j])
					return true;

	return false;
}

function noBlockHorizontal(row, col1, col2, board) {
	for (var i = col1 + 1; i < col2; i++)
		if (board[row][i] != 0)
			return false;
	return true;
}

function noBlockVertical(row1, row2, col, board) {
	for (var i = row1 + 1; i < row2; i++)
		if (board[i][col] != 0)
			return false;
	return true;
}