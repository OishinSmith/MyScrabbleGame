var socket = io();
var localPlayer = {joined: false, playing: false};

switchTo("mobileJoin");

$(function () {
	let viewportHeight = $("html").css("height");
	$("html").css("min-height", viewportHeight);
	$("body").css("min-height", viewportHeight);
	//$(".container").css("min-height", (parseInt(viewportHeight)) + "px"); //fix for the annoying & ugly border
});

$("#joinBtn").click(function() {
	let data = {
		type: "player",
		name: $('#nameInput').val(),
		gameCode: $('#gameCodeInput').val(),
		colour: $("#colourInput").val()
	};

	$('#nameInput').val('');
	$('#gameCodeInput').val('');
	socket.emit('onConnect', data);
});

$('#readyBtn').click(function () {
	socket.emit('everyoneReady', localPlayer.gameCode);
});

socket.on('everyoneReady', function (data) {
		if (data.success) {
			//called from shared
			switchTo("mobilePlay");
			updateDisplayBoard(data.board);
		} else if (data.message) {
			alert(data.message);
		}
});

socket.on('updateBoard', function (board) {
		//called from shared
		updateDisplayBoard(board);
});

function updateRack () {
	let rack = $("#rack");
	rack.html("");
	localPlayer.rack.forEach((piece) => {
		let pieceElement = $('<div class="piece"></div>');
		pieceElement.append('<div class="letter">' + piece.char + '</div>');
		pieceElement.append('<div class="points">' + piece.score + '</div>');
		rack.append(pieceElement);
	});
}

socket.on("onClientUpdate", (data) => {
	console.log(data);
	data.players.forEach((player) => {
		if (player.id == localPlayer.id) {
			localPlayer.rack = player.rack;
			updateRack();
		}
	});
	if (data.currentPlayer && data.currentPlayer == localPlayer.id) {
		localPlayer.playing = true;
		$("#controls").show();
	} else {
		localPlayer.playing = false;
		$("#controls").hide();
	}
	if (data.board) {
		updateDisplayBoard(data.board);
	}
});

socket.on("onClientJoin", function (data) {
	if (!data.success) {
		alert(data.message ? data.message : "An error occurred");
		return;
	} else if (!localPlayer.joined) { //only interested in the first one, subsequent ones will always be other players
		localPlayer.joined = true;
		localPlayer.id = data.newPlayer.id;
		localPlayer.name = data.newPlayer.name;
		localPlayer.bgColour = data.newPlayer.bgColour;
		localPlayer.gameCode = data.game.code;
		localPlayer.textColour = data.newPlayer.textColour;
		$('#localPlayerNameW .playerName').text(localPlayer.name);
		$('#localPlayerNameW .piece .letter').text(localPlayer.name.substring(0, 1).toUpperCase());
		$("#localPlayerNameW .piece").css("background", localPlayer.bgColour);
		$("#localPlayerNameW .piece").css("color", localPlayer.textColour);
		switchTo("mobileWaiting");
	}
});

$("#rack").on("click", ".piece", function () {
	if (!localPlayer.playing) {
		return;
	}
	$("#rack .piece").removeClass("selected");
	$(this).addClass("selected");
});

$("#mobilePlay").on("click", ".boardCell", function () {
	if ($(".letter", this).length) {
		return;
	}
	if ($("#rack .selected").length) {
		let data = {
			x: $(this).data("x"),
			y: $(this).data("y"),
			letter: $(".letter", "#rack .selected").text(),
			gameCode: localPlayer.gameCode
		};
		socket.emit("piecePlayed", data);
		$("#rack .selected").remove();
	}
});

$('#playPiece').click(function(){
	let data = {
		x: parseInt($('#xPiece').val()),
		y: parseInt($('#yPiece').val()),
		letter: $("#pieceLetter").val(),
		gameCode: localPlayer.gameCode
	};

	$('#xPiece').val('');
	$('#yPiece').val('');
	$('#pieceLetter').val('');

	socket.emit('piecePlayed', data);
});

$("#endTurnBtn").click(function () {
	socket.emit("endTurn");
});
