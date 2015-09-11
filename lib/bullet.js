(function () {
  window.Asteroids = window.Asteroids || {};

  var Bullet= window.Asteroids.Bullet= function(position, game) {
    var options = {
      color: Bullet.COLOR,
      radius: Bullet.RADIUS,
      pos: position,
      vel: [0, 0],
      game: game,
      density: -100
    };
    window.Asteroids.MovingObject.call(this, options);
    this.lifeTime = 1;
  };
  window.Asteroids.Util.prototype.inherits(Bullet, window.Asteroids.MovingObject);

  Bullet.prototype.isWrappable = false;

  Bullet.COLOR = "#E70";
  Bullet.RADIUS = 2;

  Bullet.prototype.collideWith = function (otherObj) {
  };



  Bullet.prototype._gravity = function () {
    Asteroids.MovingObject.prototype._gravity.call(this);
    this.lifeTime++;
    this.density -= 10 * (this.lifeTime % 30 == 0);
    this.radius += 0.1 * (this.lifeTime % 10 == 0)
  };

})();
