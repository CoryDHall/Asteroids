(function () {
  window.Asteroids = window.Asteroids || {};

  var Ship = window.Asteroids.Ship = function(position, game) {
    var options = {
      color: Ship.COLOR,
      radius: Ship.RADIUS,
      pos: position,
      vel: [0, 0],
      game: game
    };
    window.Asteroids.MovingObject.call(this, options);
  };
  window.Asteroids.Util.prototype.inherits(Ship, window.Asteroids.MovingObject);

  Ship.COLOR = "#E72";
  Ship.RADIUS = 15;
  Ship.BULLETSPEED = 2;

  Ship.prototype.relocate = function () {
    this.pos= window.Asteroids.Game.prototype.randomPosition();
    this.vel = [0,0];
  };

  Ship.prototype.power = function (impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  };

  Ship.prototype.fireBullet = function() {
    var bullet = new window.Asteroids.Bullet(this.pos, this.game);
    bullet.vel = [this.vel[0] * Ship.BULLETSPEED,
                  this.vel[1] * Ship.BULLETSPEED];
    this.game.add(bullet);
  };

})();
