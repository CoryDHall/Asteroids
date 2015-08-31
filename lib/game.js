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
        Game.prototype.randomPosition(), this
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

  Game.prototype.wrap = function (pos) {
    var xIn = pos[0];
    var yIn = pos[1];

    var xOut = xIn -
               ((xIn > Game.DIM_X) * Game.DIM_X) +
               ((xIn < 0) * Game.DIM_X);

    var yOut = yIn -
               ((yIn > Game.DIM_Y) * Game.DIM_Y) +
               ((yIn < 0) * Game.DIM_Y);

    return [xOut, yOut];
  };

  Game.prototype.checkCollisions = function() {
    var asteroids = this.asteroids;
    asteroids.forEach(function (asteroid1) {
      asteroids.forEach(function (asteroid2) {
        if (asteroid1 !== asteroid2 &&
          asteroid1.isCollidedWith(asteroid2)) {
          window.alert("COLLISION");
          console.log("COLLISION");
          asteroid1.collideWith(asteroid2);
        }
      });
    });
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
  };

  Game.prototype.remove = function (asteroid) {
    this.asteroids = this.asteroids.filter(function (this_asteroid) {
      return this_asteroid !== asteroid;
    });
  };

})();
