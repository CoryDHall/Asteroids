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
    this.capStyle = "round";
  };
  Asteroids.Util.prototype.inherits(Bullet, Asteroids.MovingObject);

  Bullet.prototype.isWrappable = true;

  Bullet.COLOR = "hsla(300, 10%, 95%, 0.5)";
  Bullet.RADIUS = 5;

  Bullet.prototype.collideWith = function (otherObj) {
  };

  Bullet.prototype.draw = function (ctx) {
    var dV = this.vel;
    ctx.beginPath();
    ctx.strokeStyle = Bullet.COLOR;
    ctx.lineWidth = this.radius / ((this.lifeTime / 2) % 5); //+ 20 / Asteroids.Util.prototype.wrapDistance(this.pos, this.game.ship.pos);
    ctx.moveTo(this.pos[0] + dV[0], this.pos[1] + dV[1]);
    ctx.lineTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.pos[0] - dV[0] / 2, this.pos[1] - dV[1] / 2);

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
      return vdir;
    }.bind(this));
  };

})();
