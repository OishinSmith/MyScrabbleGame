function switchTo (id) {
	$(".container").hide();
	$("#" + id).show();
}

//updates the display html, by adding list of char of pieces in every space
function updateDisplayBoard (board) {
	$('#board').empty();
	//console.log(board);
	let rowCount = board.spaceList.length;
	let cellPx = parseInt($("#board").css("height"))/rowCount;
	if (cellPx*rowCount > parseInt($("#board").css("width"))) { //won't fit; base it on width instead
		cellPx = parseInt($("#board").css("width"))/rowCount;
	}

	console.log(cellPx);
	board.spaceList.forEach(function (row, y) {
		let rowElement = $('<div class="boardRow"></div>');
		rowElement.css("height", cellPx + "px");
		let cellCount = row.length;
		row.forEach(function (cell, x) {
			let cellElement = $('<div class="boardCell"></div>');
			cellElement.css("width", cellPx + "px");
			cellElement.data("x", x);
			cellElement.data("y", y);
			if (cell.piece) {
				let pieceElement = $('<div class="piece"></div>');
				pieceElement.append('<div class="letter" style="font-size: ' + (cellPx-4) + 'px">' + cell.piece.char + '</div>');
				if (typeof localPlayer == "undefined") {
					pieceElement.append('<div class="points" style="font-size: ' + (cellPx/4) + 'px">' + cell.piece.score + '</div>');
				}
				cellElement.append(pieceElement);
			}
			else if(cell.multiplier){
				let multElement = $('<div class="' + cell.multiplier + '"></div>');
				multElement.append('<div class="multtext" style="font-size: ' + (cellPx-8) + 'px">' + cell.multiplier + '</div>');
				cellElement.append(multElement);
			}
			else {
				//cellElement.text("?"); //test only
			}
			rowElement.append(cellElement);
		});
		$("#board").append(rowElement);
	});
};

function updateDisplayPiece(htmlObject, piece){
	var letter = htmlObject.getElementsByClassName('letter');
	var score  = htmlObject.getElementsByClassName('points');
	$(letter).text(piece.char);
	$(score).text(piece.score);
};


$(function () {
	$("#participants .piece").each(function () {
		if (!$(this).hasClass("empty")) {
			$(this).css("transform", "rotate(" + (Math.random() * 30 - 15) + "deg)");
		}
	});

	$("#playBtn").click(function(){
		switchTo("desktopLobby")
	});

	socket.on("onClientMessage", function (data) {
		alert(data.message);
	});
});
