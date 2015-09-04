(function () {
  window.Asteroids = window.Asteroids || {};

  var Asteroid = window.Asteroids.Asteroid = function(position, game) {
    var options = {
      color: Asteroid.COLOR,
      radius: Asteroid.RADIUS,
      pos: position,
      vel: window.Asteroids.Util.prototype.randomVec(5),
      accel: [0.25, .01],
      game: game
    };
    window.Asteroids.MovingObject.call(this, options);
  };
  window.Asteroids.Util.prototype.inherits(Asteroid, window.Asteroids.MovingObject);

  Asteroid.COLOR = "#000";
  Asteroid.RADIUS = 10;

  Asteroid.prototype.collideWith = function (otherObj) {
    if(otherObj instanceof window.Asteroids.Ship) {
      otherObj.relocate();
    } else if (otherObj instanceof window.Asteroids.Bullet) {
      this.game.remove(otherObj);
      this.game.remove(this);
    }
  };

})();
