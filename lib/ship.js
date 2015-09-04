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

  Ship.COLOR = "rgba(30,120,240,.1)";
  Ship.RADIUS = 15;
  Ship.BULLETSPEED = 2;
  Ship.FIRERATE = 100;

  Ship.prototype.relocate = function () {
    this.pos= window.Asteroids.Game.prototype.randomPosition();
    this.vel = [0,0];
  };

  Ship.prototype.power = function (impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  };

  Ship.prototype.fireBullet = function() {
    this.lastFired = this.lastFired || new Date();
    // console.log(this.lastFired - new Date());
    if (new Date() - this.lastFired < Ship.FIRERATE) {
      return;
    }
      this.lastFired = null;
    // if (this.lastFired - new Date() < Ship.FIRERATE) { return; }
    var bullet = new window.Asteroids.Bullet(
      [this.pos.slice()[0] + this.dVel()[0] * this.radius, this.pos.slice()[1] + this.dVel()[1] * this.radius],
      this.game
    );
    bullet.vel = [this.vel.slice()[0] * Ship.BULLETSPEED,
                  this.vel.slice()[1] * Ship.BULLETSPEED];
    this.game.add(bullet);
  };

})();
