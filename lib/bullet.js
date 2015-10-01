(function () {
  Asteroids = window.Asteroids || {};

  var Bullet= Asteroids.Bullet= function(position, game) {
    var options = {
      color: Bullet.COLOR,
      radius: Bullet.RADIUS,
      pos: position,
      vel: [0, 0],
      game: game,
      density: -100
    };
    Asteroids.MovingObject.call(this, options);
    this.lifeTime = 1;
  };
  Asteroids.Util.prototype.inherits(Bullet, Asteroids.MovingObject);

  Bullet.prototype.isWrappable = true;

  Bullet.COLOR = "#fff";
  Bullet.RADIUS = 2;

  Bullet.prototype.collideWith = function (otherObj) {
  };

  Bullet.prototype.draw = function (ctx) {
    var dV = this.dVel();
    ctx.beginPath();
    ctx.strokeStyle = Bullet.COLOR;
    ctx.lineWidth = 20 / Asteroids.Util.prototype.wrapDistance(this.pos, this.game.ship.pos);
    ctx.moveTo(this.pos[0] + dV[0] * this.radius, this.pos[1] + dV[1] * this.radius);
    ctx.lineTo(this.pos[0], this.pos[1]);

    ctx.stroke();
    ctx.closePath();
  };


  Bullet.prototype._gravity = function () {
    if (this.density >= 0) {
      this.game.remove(this);
      return;
    }
    Asteroids.MovingObject.prototype._gravity.call(this);
    this.lifeTime++;
    this.density += 10 * (this.lifeTime % 30 == 0);
    this.vel = this.vel.map(function (vdir) {
      return vdir * 1.02;
    }.bind(this));
  };

})();
