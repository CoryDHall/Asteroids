(function () {
  Asteroids = window.Asteroids || {};

  var Ship = Asteroids.Ship = function(position, game) {
    var options = {
      color: Ship.COLOR,
      radius: Ship.RADIUS,
      pos: position,
      vel: [0, 0],
      game: game,
      density: 30000.0000
    };
    Asteroids.MovingObject.call(this, options);
    this.capStyle = "round";
  };
  Asteroids.Util.prototype.inherits(Ship, Asteroids.MovingObject);

  Ship.COLOR = "hsla(30,0%,100%,.1)";
  Ship.RADIUS = 100;
  Ship.BULLETSPEED = 2.1;
  Ship.FIRERATE = 400;

  Ship.prototype.relocate = function () {
    this.pos= Asteroids.Game.prototype.randomPosition();
    this.radius = Ship.RADIUS;
    this.vel = [0,0];
    this.accel = [0,0]
  };

  Ship.prototype.power = function (impulse) {
    // if (this._mass > this.CRITICAL_MASS) { return; }
    this.vel[0] += impulse[0] / 5;// / (this.radius / 2 + this.vel[0]);
    this.vel[1] += impulse[1] / 5;// / (this.radius / 2 + this.vel[1]);
  };

  Ship.prototype.fireBullet = function() {
    this.lastFired = this.lastFired || new Date();
    // console.log(this.lastFired - new Date());
    if (new Date() - this.lastFired < Ship.FIRERATE || this.game.bullets.length == Asteroids.Game.MAX_BULLETS) {
      return;
    }
      this.lastFired = null;
    // if (this.lastFired - new Date() < Ship.FIRERATE) { return; }
    var dV = this.vel.slice();
    var bullet = new Asteroids.Bullet(
      [this.pos.slice()[0] + dV[0], this.pos.slice()[1] + dV[1]],
      this.game
    );
    bullet.vel = [dV[0] * Ship.BULLETSPEED,
                  dV[1] * Ship.BULLETSPEED];
    this.game.add(bullet);
    this.vel[0] -= bullet.vel[0] / 100;
    this.vel[1] -= bullet.vel[1] / 100;
  };

  Ship.prototype.levelUp = function () {
    // var mass = this.mass();
    // this.radius *= 0.5;
    this.density *= this.radius / Ship.RADIUS;
    this.radius = Ship.RADIUS;
  };

  Ship.prototype.getColor = function () {
    return "hsla(30,0%,100%," + (1 - 1 / (1 + Asteroids.Util.prototype.distance([0,0], this.vel) / 10) + 0.02) + ")"
  };

})();
