// pad numbers smaller than 10
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

// an abstract game class you can inherit from
function BaseGame() {
  this.height = 100;
  this.width = 100;
  this.cards = {};
}

// game that follows the 00 rules
function Game00(gameData) {
  BaseGame.call(this);
  this.gameData = gameData;
  console.log('Add game logic...')
  $('#game-space').html('<h3>Game "' + gameData['game_title'] + '" here?</h3>');
}
Game00.prototype = Object.create(BaseGame.prototype);

// map game numbers to functions
var games = {'00': Game00}

// main method: lookup correct js
function buildGame(gameData) {
  var gameType = gameData['game_type'];
  var Game = games[pad(gameType)];
  Game(gameData);
};
