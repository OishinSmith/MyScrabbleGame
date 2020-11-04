$(function(){

  var socket = io();
  $( "body" ).on('click', '#test', function() {
    console.log("clicked");
    socket.emit('connection_ready', {'type': "client"});
  });
  socket.on('update gamecode', function(data)
  {
    $("#game_code").text(data);
  });
  socket.on('new_player_joined', function(data)
  {
    $("#player_list").empty();
    for(index in data.players){
      $("#player_list").append('<li>' + data.players[index].name + '</li>')
    }
  });
});
