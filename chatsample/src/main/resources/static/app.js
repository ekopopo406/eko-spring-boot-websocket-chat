var ws;
function setConnected(connected) {
	$("#connect").prop("disabled", connected);
	$("#disconnect").prop("disabled", !connected);
	if (connected) {
		$("#conversation").show();
	} else {
		$("#conversation").hide();
	}
	$("#greetings").html("");
}

function connect() {

	var socket = new WebSocket("ws://localhost:8080/greeting");
	ws = Stomp.over(socket);

	ws.connect({}, function(frame) {
		ws.subscribe("/topic/queue/errors", function(message) {
			alert("Error " + message.body);
		});
		ws.subscribe("/user/queue/errors", function(message) {
			alert("Error " + message.body);
		});
		 
		ws.subscribe("/user/queue/reply", function(message) {
			showGreeting(message.body);
		});
		ws.subscribe("/topic/reply", function(message) {
			showGreeting(message.body);
		});
	}, function(error) {
		alert("STOMP error " + error);
	});
}
 

function disconnect() {
	if (ws != null) {
		ws.close();
	}
	setConnected(false);
	console.log("Disconnected");
}

function sendName() {
	var data = JSON.stringify({
		'name' : $("#name").val()
	})
	ws.send("/app/allmessage", {}, data);
}
function sendToName() {
	var data = JSON.stringify({
		'userid' : $("#userid").val(),
		'talkto' : $("#talkto").val()
	})
	ws.send("/app/usermessage/"+ $("#userid").val(), {}, data);
}
function showGreeting(message) {
	$("#greetings").append("<tr><td> " + message + "</td></tr>");
}

$(function() {
	$("form").on('submit', function(e) {
		e.preventDefault();
	});
	$("#connect").click(function() {
		connect();
	});
	$("#disconnect").click(function() {
		disconnect();
	});
	$("#send").click(function() {
		sendName();
	});
	$("#sendTo").click(function() {
		sendToName();
	});
});
