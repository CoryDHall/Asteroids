(function () {
  window.Asteroids = window.Asteroids || {};

  var Game = window.Asteroids.Game = function() {
    this.addAsteroids();
  };

  // Game.DIM_X = 1000;
  // Game.DIM_Y = 700;
  Game.DIM_X = 1280;
  Game.DIM_Y = 720;
  Game.NUM_ASTEROIDS = 8;

  Game.prototype.addAsteroids = function() {
    this.asteroids = [];

    for(var i = 0; i < Game.NUM_ASTEROIDS; i++){
      var asteroid = new window.Asteroids.Asteroid(
        Game.prototype.randomPosition()
      );
      this.asteroids.push(asteroid);
    }
  };

  Game.prototype.randomPosition = function() {
    var x_pos = Math.round(Math.random() * Game.DIM_X);
    var y_pos = Math.round(Math.random() * Game.DIM_Y);

    return [x_pos, y_pos];
  };

  Game.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.asteroids.forEach(function (asteroid) {
      asteroid.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function(ctx) {
    this.asteroids.forEach(function (asteroid) {
      asteroid.move();
    });
  };



})();
