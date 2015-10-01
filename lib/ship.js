(function () {
  window.Asteroids = window.Asteroids || {};

  var Ship = window.Asteroids.Ship = function(position, game) {
    var options = {
      color: Ship.COLOR,
      radius: Ship.RADIUS,
      pos: position,
      vel: [0, 0],
      game: game,
      density: 200000000
    };
    window.Asteroids.MovingObject.call(this, options);
    this.capStyle = "round";
  };
  window.Asteroids.Util.prototype.inherits(Ship, window.Asteroids.MovingObject);

  Ship.COLOR = "hsla(30,0%,100%,.03)";
  Ship.RADIUS = 60;
  Ship.BULLETSPEED = 3;
  Ship.FIRERATE = 500;

  Ship.prototype.relocate = function () {
    this.pos= window.Asteroids.Game.prototype.randomPosition();
    this.radius = Ship.RADIUS;
    this.vel = [0,0];
    this.accel = [0,0]
  };

  Ship.prototype.power = function (impulse) {
    if (this._mass > this.CRITICAL_MASS) { return; }
    this.vel[0] += impulse[0] / (20 + this.vel[0]);
    this.vel[1] += impulse[1] / (20 + this.vel[0]);
  };

  Ship.prototype.fireBullet = function() {
    this.lastFired = this.lastFired || new Date();
    // console.log(this.lastFired - new Date());
    if (new Date() - this.lastFired < Ship.FIRERATE) {
      return;
    }
      this.lastFired = null;
    // if (this.lastFired - new Date() < Ship.FIRERATE) { return; }
    var dV = this.vel.slice();
    var bullet = new window.Asteroids.Bullet(
      [this.pos.slice()[0] + dV[0] * this.radius, this.pos.slice()[1] + dV[1] * this.radius],
      this.game
    );
    bullet.vel = [dV[0] * Ship.BULLETSPEED,
                  dV[1] * Ship.BULLETSPEED];
    this.game.add(bullet);
    this.vel[0] -= bullet.vel[0] / 10;
    this.vel[1] -= bullet.vel[1] / 10;
  };

  Ship.prototype.levelUp = function () {
    // var mass = this.mass();
    // this.radius *= 0.5;
    this.density *= this.radius / Ship.RADIUS;
    this.radius = Ship.RADIUS;
  };

})();
