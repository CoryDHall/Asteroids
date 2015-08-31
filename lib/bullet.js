(function () {
  window.Asteroids = window.Asteroids || {};

  var Bullet= window.Asteroids.Bullet= function(position, game) {
    var options = {
      color: Bullet.COLOR,
      radius: Bullet.RADIUS,
      pos: position,
      vel: [0, 0],
      game: game
    };
    window.Asteroids.MovingObject.call(this, options);
  };
  window.Asteroids.Util.prototype.inherits(Bullet, window.Asteroids.MovingObject);

  Bullet.prototype.isWrappable = false;

  Bullet.COLOR = "#E70";
  Bullet.RADIUS = 2;

  Bullet.prototype.collideWith = function (otherObj) {
  };

})();
