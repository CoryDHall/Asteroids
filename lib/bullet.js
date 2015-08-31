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

  Bullet.COLOR = "#29E";
  Bullet.RADIUS = 2;

  Bullet.prototype.collideWith = function (otherObj) {
    if(otherObj instanceof window.Asteroids.Asteroid) {
      //Remove both
    }
  };

})();
