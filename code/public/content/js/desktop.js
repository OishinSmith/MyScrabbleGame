var socket = io();

switchTo("desktopMain");
socket.emit('onConnect', {'type': "client"});

socket.on('update gamecode', function(data) {
	$('#roomCode .piece').each(function(i, obj){
		//console.log([i, obj]);
		updateDisplayPiece(obj, data[i])
	});
	//$("#roomCode").text(data);
});

socket.on("onClientJoin", function (data) {
	if (!data.success) {
		return;
	}
	//let playerCount = $("#participants .empty").length;
	for (index in data.game.players) {
		//console.log("#player" + (parseInt(index)+1) + "L");
		let playerElement = $("#player" + (parseInt(index)+1) + "L");
		//console.log(playerElement);
		let player = data.game.players[index];
		$(".playerName", playerElement).text(player.name);
		$(".letter", playerElement).text(player.name.substring(0, 1).toUpperCase());
		$(".piece", playerElement).removeClass("empty");
		$(".piece", playerElement).css("background", player.bgColour);
		$(".piece", playerElement).css("color", player.textColour);
	}
});

socket.on("onClientUpdate", (data) => {
	console.log(data);
	if (data.board) {
		updateDisplayBoard(data.board);
	}
	$("#scores").html("");
	data.players.forEach((player) => {
		let playerElement = $("<div></div>");
		playerElement.css("background", player.bgColour);
		playerElement.css("color", player.textColour);
		if (data.currentPlayer == player.id) {
			playerElement.text(player.name + ": " + player.score + "<===");
		} else {
			playerElement.text(player.name + ": " + player.score);
		}
		$("#scores").append(playerElement);
	});
});


socket.on('everyoneReady', function (data) {
		if (data.success) {
			switchTo("desktopPlay");
			//called from shared
			updateDisplayBoard(data.board);
		}
});

socket.on('updateBoard', function(board){
		//called from shared
		updateDisplayBoard(board);
});
