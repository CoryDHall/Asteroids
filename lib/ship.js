(function () {
  Asteroids = window.Asteroids || {};

  var Ship = Asteroids.Ship = function(position, game) {
    var options = {
      color: Ship.COLOR,
      radius: Ship.RADIUS,
      pos: position,
      vel: new Float32Array(2),
      game: game,
      density: Ship.DENSITY
    };
    Asteroids.MovingObject.call(this, options);
    this.capStyle = "round";
  };
  Asteroids.Util.prototype.inherits(Ship, Asteroids.MovingObject);

  Ship.COLOR = "hsla(30,0%,100%,.1)";
  Ship.RADIUS = 100;
  Ship.BULLETSPEED = 3.1;
  Ship.FIRERATE = 400;
  Ship.DENSITY = .100000000;

  Ship.prototype.relocate = function () {
    this.pos.set([Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y / 2]);
    this.radius = Ship.RADIUS;
    this.vel.set([0,0]);
    this.accel.set([0,0]);
    this.density = Ship.DENSITY;
  };

  Ship.prototype.power = function (impulse) {
    if (this._mass > this.CRITICAL_MASS) { return; }
    this.vel[0] += impulse[0] / 5;// / (this.radius / 2 + this.vel[0]);
    this.vel[1] += impulse[1] / 5;// / (this.radius / 2 + this.vel[1]);
  };

  Ship.prototype.move = function () {
    Asteroids.MovingObject.prototype.move.call(this);
    if (this._mass > this.CRITICAL_MASS) {
      this.pos.set([Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y / 2]);
    }
    if (this._mass <= 10) {
      this.radius *= 4;
      this.game.remove(this);
    }
  };

  Ship.prototype.fireBullet = function() {
    this.lastFired = this.lastFired || new Date();
    // console.log(this.lastFired - new Date());
    if (this.game.isPaused() || new Date() - this.lastFired < Ship.FIRERATE || this.game.bullets.length == Asteroids.Game.MAX_BULLETS) {
      return;
    }
      this.lastFired = null;
    // if (this.lastFired - new Date() < Ship.FIRERATE) { return; }
    // var dV = this.vel.subarray(0);
    var dV = this.dVel();
    var bullet = new Asteroids.Bullet(
      [this.pos.subarray(0)[0] + dV[0], this.pos.subarray(0)[1] + dV[1]],
      this.game
    );
    bullet.vel.set([(dV[0] + this.vel[0]) * Ship.BULLETSPEED,
                  (dV[1] + this.vel[1]) * Ship.BULLETSPEED]);
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
