var myScrabble = angular.module('myScrabble', ['btford.socket-io','ngRoute']);

myScrabble.config(['$routeProvider', function($routeProvider){

  $routeProvider
    .when('/mainmenu', {
      templateUrl: 'content/views/mainMenu.html',
      controller: 'MainViewController'
    })
    .when('/lobby', {
      templateUrl: 'content/views/lobby.html',
      controller: 'MainViewController'
    })
    .otherwise({
      redirectTo: '/mainmenu'
    })
}]);

myScrabble.factory('mySocket', function (socketFactory) {
  var myIoSocket = io.connect('http://localhost:8000');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});


myScrabble.controller('MainViewController',[ '$scope', function($scope, mySocket){
    mySocket.emit('connection_ready', {'type': "client"});
    //mySocket.on('update gamecode', function(data){
    //  $scope.gamecode = data
    //});
}]);
