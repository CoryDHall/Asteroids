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
  Asteroid.RADIUS = 40;

  Asteroid.prototype.collideWith = function (otherObj) {
    if(otherObj instanceof window.Asteroids.Ship) {
      otherObj.relocate();
    } else if (otherObj instanceof window.Asteroids.Bullet) {
      this.game.remove(otherObj);
      this.game.remove(this);
    }
  };

  Asteroid.prototype.draw = function (ctx) {
    ctx.fillStyle = "rgba(255,255,255,.5)";
  
    ctx.beginPath();
    ctx.shadowColor = "rgba(20,40,80, 0.5)";
    ctx.shadowOffsetX = ctx.shadowBlur = 25 * this.game.asteroids.length / Asteroids.Game.NUM_ASTEROIDS;

    ctx.rect(
      this.pos[0],
      this.pos[1],
      20,
      this.pos[1] % this.radius
    );

    ctx.fill();
    ctx.shadowColor = "transparent";
  };

})();
