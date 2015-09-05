(function() {
  window.Asteroids = window.Asteroids || {};
  var MovingObject = window.Asteroids.MovingObject = function(options) {
    this.pos =      options.pos;
    this.vel =      options.vel;
    this.radius =   options.radius;
    this.color =    options.color;
    this.game =     options.game;
    this.accel =    options.accel || [0, 0];
  };
  MovingObject.prototype.draw = function (ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    ctx.fillStyle = this.color;
    ctx.beginPath();

    var dV = this.vel;
    var aV = this.accel;
    //
    if (this.isWrappable) {
      ctx.arc(
        this.pos[0],
        this.pos[1],
        this.radius,
        0 * Math.PI,
        2 * Math.PI,
        false
      );
    ctx.fill();
    // ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 23, 63, 0.3)";
    ctx.lineWidth = 2.0;
    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius + 2,
      Math.atan2(aV[0], aV[1]),
      Math.atan2(aV[1], aV[0]) % Math.PI,
      false
    );
    ctx.stroke()
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "rgba(23, 63, 255, 0.3)";
    ctx.lineWidth = 3 * Math.atan2(aV[0], aV[1]);
      ctx.arc(
        this.pos[0] + this.accel[0] * 3,
        this.pos[1] + this.accel[1] * 3,
        this.radius + (this.momentum()) / 10,
        Math.atan2(dV[0], dV[1]) - Math.PI / 2,
        Math.atan2(dV[0], dV[1]) + Math.PI / 2,
        false
      );
    }
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "rgba(23,255,63, 0.4)";
    ctx.lineWidth = this.isWrappable ? 0.1 : 20 / Asteroids.Util.prototype.wrapDistance(this.pos, this.game.ship.pos);
    ctx.moveTo(this.pos[0] + dV[0] * this.radius, this.pos[1] + dV[1] * this.radius);
    ctx.lineTo(this.pos[0], this.pos[1]);
    // ctx.fillRect(
    //   this.pos[0],
    //   this.pos[1],
    //   this.pos[0] % this.radius,
    //   this.pos[1] % this.radius
    // );

    ctx.stroke();
    ctx.closePath();
  };
  MovingObject.prototype.isWrappable = true;

  MovingObject.prototype._gravity = function () {
    var gConst = Math.pow(10, -5);
    this.game.asteroids.concat([this.game.ship]).forEach(function (otherObj) {
      // if (Asteroids.Util.prototype.distance(this.pos, otherObj.pos) > this.radius * 2) {
      //   // return;
      // }
      var dV = otherObj.dVel();
      this.accel[0] += gConst * dV[0] / (this.radius + otherObj.radius);
      this.accel[1] += gConst * dV[1] / (this.radius + otherObj.radius);
    }.bind(this));
  };


  MovingObject.prototype.move = function () {
    setTimeout(this._gravity.bind(this), 0);


    this.accel[0] *= 1 - 1 / (this.radius);
    this.accel[1] *= 1 - 1 / (this.radius);

    this.vel[0] += this.accel[0];
    this.vel[1] += this.accel[1];

    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];


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
    return this.radius * (Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2)));
  };

  MovingObject.prototype.isCollidedWith = function(otherObj) {
    var distanceBetween = window.Asteroids.Util.prototype.distance(this.pos, otherObj.pos);
    return distanceBetween < (this.radius + otherObj.radius);
  };

  MovingObject.prototype.collideWith = function(otherObj) {
    // this.game.remove(otherObj);
    // this.game.remove(this);
  };

})();
