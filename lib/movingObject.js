(function() {
  window.Asteroids = window.Asteroids || {};
  var MovingObject = window.Asteroids.MovingObject = function(options) {
    this.game =     options.game;

    this.pos =      options.pos;
    this.vel =      options.vel;
    this.radius =   options.radius;
    this.color =    options.color;
    this.accel =    options.accel || [0, 0];
    this.density =  options.density;
    this.numCollisions = 0;

  };

  MovingObject.CRITICAL_MASS = 300;
  MovingObject.prototype.draw = function (ctx) {
    // if (this.radius < 2) return;

    var color = this.getColor();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();

    var dV = this.dVel();
    var v = this.vel;
    var aV = this.accel;

    //
    if (true) {
      // ctx.fillText(this.mass().toFixed(), this.pos[0] + this.radius, this.pos[1]);
      ctx.arc(
        this.pos[0],
        this.pos[1],
        this.radius / 2,
        0 * Math.PI,
        2 * Math.PI,
        false
      );
    ctx.fill();
    ctx.lineTo(this.game.ship.pos[0], this.game.ship.pos[1]);
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      (Math.atan2(v[1], v[0]) + (Math.PI / 2)),
      (Math.atan2(v[1], v[0]) - (Math.PI / 2)),
      true
    );
    ctx.stroke()
    ctx.closePath();
    if (this.radius < 4) return;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius + 2,
      (Math.atan2(v[1], v[0]) + (3 * Math.PI / 4)),
      (Math.atan2(v[1], v[0]) - (3 * Math.PI / 4)),
      true
    );
    ctx.stroke()
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.arc(
      this.pos[0] + v[0],
      this.pos[1] + v[1],
      this.radius - 4,
      Math.atan2(aV[1], aV[0]) % (Math.PI * 2) + (Math.PI / 4),
      Math.atan2(aV[1], aV[0]) % (Math.PI * 2) - (Math.PI / 4),
      true
    );
    ctx.stroke()
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#fff";
    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.game.gTime % (this.radius / 2),
      0,
      2 * Math.PI,
      false
    );
    ctx.stroke();
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = this.isWrappable ? 0.1 : 20 / Asteroids.Util.prototype.wrapDistance(this.pos, this.game.ship.pos);
    ctx.moveTo(this.pos[0] + dV[0] * this.radius, this.pos[1] + dV[1] * this.radius);
    ctx.lineTo(this.pos[0], this.pos[1]);

    ctx.stroke();
    ctx.closePath();
  }
  };
  MovingObject.prototype.isWrappable = true;

  MovingObject.prototype._gravity = function () {
    var gConst = Math.pow(10, -9);
    this.game.asteroids.concat([this.game.ship]).forEach(function (otherObj) {
      // if (Asteroids.Util.prototype.distance(this.pos, otherObj.pos) > this.radius * 2) {
      //   // return;
      // }
      // this.accel[0] += gConst * dV[0] / (this.mass() + otherObj.mass());
      // this.accel[1] += gConst * dV[1] / (this.mass() + otherObj.mass());
      var dist = [
        (this.pos[0] - otherObj.pos[0]) % (Asteroids.Game.DIM_X / 2),
        (this.pos[1] - otherObj.pos[1]) % (Asteroids.Game.DIM_Y / 2)
      ];

      var force = -gConst * otherObj.mass() / Math.sqrt(dist[0] * dist[0] + dist[1] * dist[1] + this.radius);

      this.accel[0] += (dist[0] * force);
      this.accel[1] += (dist[1] * force);
      // this.accel[0] += gConst * dV[0] * -dist[0] * (otherObj.mass()) / (this.mass() / dist[0]);
      // this.accel[1] += gConst * dV[1] * -dist[1] * (otherObj.mass()) / (this.mass() / dist[1]);
      // this.accel[0] += gConst * (this.mass() * otherObj.mass()) / (Asteroids.Util.prototype.distance(this.pos, otherObj.pos));
      // this.accel[1] += gConst * (this.mass() * otherObj.mass()) / (Asteroids.Util.prototype.distance(this.pos, otherObj.pos));

    }.bind(this));
  };


  MovingObject.prototype.move = function () {
    this.numCollisions -= 0.1;
    setTimeout(this._gravity.bind(this), 0);


    // this.accel[0] *= (Math.abs(this.vel[0]) < this.radius) * 1 - 1 / (this.radius);
    // this.accel[1] *= (Math.abs(this.vel[1]) < this.radius) * 1 - 1 / (this.radius);

    this.vel[0] += this.accel[0] / (Number.MIN_VALUE + this.mass());
    this.vel[1] += this.accel[1] / (Number.MIN_VALUE + this.mass());

    this.pos[0] += this.vel[0]; // % this.radius;
    this.pos[1] += this.vel[1]; // % this.radius;


    if( this.game.isOutOfBounds(this.pos) ) {
      if( this.isWrappable) {
        this.pos = window.Asteroids.Game.prototype.wrap(this.pos);
      } else {
        this.game.remove(this);
      }
    }

  };

  MovingObject.prototype.dVel = function () {
    return [this.vel[0] !== 0 ? this.vel[0] / Math.abs(this.vel[0]) : 0,
            this.vel[1] !== 0 ? this.vel[1] / Math.abs(this.vel[1]) : 0];
  };

  MovingObject.prototype.momentum = function () {
    return this.mass() * (Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2)));
  };

  MovingObject.prototype.mass = function () {
    return this.radius * this.radius * this.density;
  };

  MovingObject.prototype.isCollidedWith = function(otherObj) {
    if (otherObj == null) { return false; }
    var distanceBetween = window.Asteroids.Util.prototype.distance(this.pos, otherObj.pos);
    return distanceBetween + 2 < (this.radius + otherObj.radius);
  };

  MovingObject.prototype.collideWith = function(otherObj) {
    // this.game.remove(otherObj);
    // this.game.remove(this);
  };

  MovingObject.prototype.drawLines = function (ctx) {
    ctx.strokeStyle = this.getColor();
    ctx.beginPath();
    this.game.allObjects().forEach(function (obj) {
      ctx.moveTo(obj.pos[0], obj.pos[1]);
      ctx.lineTo(this.pos[0], this.pos[1]);
    }.bind(this));
    ctx.closePath();
    ctx.stroke();
  };

  MovingObject.prototype.getColor = function () {
    return this.color;
  };

})();
