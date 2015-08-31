(function () {
  window.Asteroids = window.Asteroids || {};

  var Game = window.Asteroids.Game = function() {
    this.addAsteroids();
    this.addShip();
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

  Game.prototype.addShip = function () {
    this.ship = new window.Asteroids.Ship(
      Game.prototype.randomPosition(),
      this
    );
  };

  Game.prototype.allObjects = function () {
    var objArr = [];
    objArr = this.asteroids.slice();
    objArr.push(this.ship);
    return objArr;
  };

  Game.prototype.randomPosition = function() {
    var x_pos = Math.round(Math.random() * Game.DIM_X);
    var y_pos = Math.round(Math.random() * Game.DIM_Y);

    return [x_pos, y_pos];
  };

  Game.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function(ctx) {
    this.allObjects().forEach(function (object) {
      object.move();
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
    var objects = this.allObjects();
    objects.forEach(function (object1) {
      objects.forEach(function (object2) {
        if (object1 !== object2 &&
          object1.isCollidedWith(object2)) {
          window.alert("COLLISION");
          console.log("COLLISION");
          object1.collideWith(object2);
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
