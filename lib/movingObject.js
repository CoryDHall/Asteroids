(function() {
  Asteroids = window.Asteroids || {};
  var MovingObject = Asteroids.MovingObject = function(options) {
    this.game =     options.game;

    this.pos =      new Float64Array(options.pos);
    this.vel =      new Float64Array(options.vel);
    this.radius =   options.radius * this.MIN_RADIUS;
    this.color =    options.color;
    this.accel =    new Float64Array(options.accel || [0, 0]);
    this.density =  options.density;
    this.numCollisions = 0;
    this.capStyle = "butt";
    this.absorbed = [this.getColor()];
    this.lastCollidedObject = this;
    this._mass = this.mass();
    this.dead = false;
  };

  MovingObject.prototype.CRITICAL_MASS = 100000;
  MovingObject.prototype.MIN_RADIUS = 1.5;

  MovingObject.G = Math.pow(10, -9);
  var pi = Math.PI;
  var atan2 = Math.atan2;
  MovingObject.prototype.draw = function (ctx) {
    // if (this.radius < 2) return;
    var color = this.getColor();
    if (!this.dead) {
      this.absorbed[0] = color;
    }
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = this.MIN_RADIUS * 1.2;
    ctx.beginPath();

    var dV = this.dVel();
    var v = this.vel;
    var aV = this.accel;
    var dimX = Asteroids.Game.DIM_X;
    var dimY = Asteroids.Game.DIM_Y;
    //
    for (var i = 0 - (this.pos[0] - this.radius < 0); i < 1 + (this.pos[0] + this.radius > dimX); i++) {
      for (var j = 0 - (this.pos[1] - this.radius < 0); j < 1 + (this.pos[1] + this.radius > dimY); j++) {
        if (this.game._diag.drawLines || this.game._diag.pause && !this.dead) {
          ctx.beginPath();
          ctx.font = ((this.radius + 96) / 4) + "px sans-serif";
          ctx.textAlign = "center"
          ctx.fillStyle = "hsla(0,0%,0%,0.5)";
          ctx.fillText(this._mass.toFixed(), this.pos[0] + this.radius - 2 - i * dimX, this.pos[1] + 2 - j * dimY);
          ctx.fill();
          ctx.fillStyle = color;
          ctx.fillText(this._mass.toFixed(), this.pos[0] + this.radius - i * dimX, this.pos[1] - j * dimY);
          ctx.fill();

          ctx.closePath();
        }


        var time = this.game.gTime.getTime() / 10;
        var rand = Math.random();
        ctx.beginPath();
        if (this.dead) {
          for (var k = 0; k <= 3; k++) {
            ctx.fillStyle = "hsla(" + ((this.game.round * 141 + 141) % 360) + ",100%,50%," + (0.1 - k / 61) + ")";
            ctx.arc(
              this.pos[0] - i * dimX,
              this.pos[1] - j * dimY,
              this.radius * (0.25 + k / 6) + 2,
              0,
              pi * 2,
              true
            );
            ctx.fill();
          }
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.beginPath();
        }
        // rand = 1 - rand * rand;
        var isShip = this.capStyle === "round";
        ctx.lineWidth = this.dead ? (this.radius + this.radius * this.MIN_RADIUS) / 5 : (time * 5) % (this.radius / 5) + this.MIN_RADIUS;
        ctx.lineCap = this.capStyle;
        for (var k = 0; k <= 3; k++) {
          if (isShip) {
            ctx.setLineDash([1, this.radius]);
          }
          ctx.strokeStyle = this.dead ? this.color : this.absorbed[(rand * this.absorbed.length) | 0 ];
          ctx.arc(
            this.pos[0] - i * dimX,
            this.pos[1] - j * dimY,
            this.dead ? this.radius * 2 - this.radius * this.MIN_RADIUS: (this.radius / 2) * Math.cos(time * 4 * (1 - this.game.round / 5)) + ((this.radius / 2) + 2),
            (time * 5 + (Math.sin(k) * pi / this.radius)) % (pi * 2),
            (time * 5 - (Math.sin(k) * pi / this.radius)) % (pi * 2),
            !isShip //(this.capStyle === "square")
          );
          ctx.stroke();
          ctx.closePath();
          ctx.beginPath();
          ctx.setLineDash([]);
        }
        if (this.radius < 4) return;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3 - 1.5 * (this.capStyle === "square");
        ctx.arc(
          this.pos[0] - i * dimX,
          this.pos[1] - j * dimY,
          this.radius,
          (atan2(v[1], v[0]) + (pi / 2)),
          (atan2(v[1], v[0]) - (pi / 2)),
          !this.dead
        );
        ctx.stroke()
        ctx.beginPath();
        ctx.lineWidth = 2 - 0.5 * (this.capStyle === "square" && !this.dead);
        ctx.arc(
          this.pos[0] - i * dimX,
          this.pos[1] - j * dimY,
          this.radius + 2 - (this.capStyle === "square"),
          (atan2(v[1], v[0]) + ((3) * pi / 4)),
          (atan2(v[1], v[0]) - ((3) * pi / 4)),
          !this.dead
        );
        ctx.stroke()
        // ctx.closePath();
        ctx.beginPath();
        ctx.lineWidth = 4 - 2.5 * (this.capStyle === "square" && !this.dead);
        ctx.arc(
          this.pos[0] + v[0] - i * dimX,
          this.pos[1] + v[1] - j * dimY,
          this.radius - 5 + 4 * (this.capStyle === "square" && !this.dead),
          atan2(aV[1], aV[0]) % (pi * 2) + (pi / 4),
          atan2(aV[1], aV[0]) % (pi * 2) - (pi / 4),
          true
        );
        if (this.dead) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
        // ctx.closePath();
        ctx.closePath();
      }
    }
  };
  MovingObject.prototype.isWrappable = true;

  MovingObject.prototype.hasCriticalMass = function () {
    return this._mass > this.CRITICAL_MASS;
  };

  var sqrt = Math.sqrt;
  MovingObject.prototype._gravity = function () {
    var dimX = (Asteroids.Game.DIM_X / 1);
    var dimY = (Asteroids.Game.DIM_Y / 1);
    var force, gravity = this.game._diag.gravity;
    this.accel[0] = 0;
    this.accel[1] = 0;
    if (gravity === 0) {
      return;
    }
    var currentAsteroids = this.game.getCurrentAsteroids();
    currentAsteroids.concat([this.game.ship]).forEach(function (otherObj) {
      if (this === otherObj) {
        return;
      }
      var dist = [
        (this.pos[0] - otherObj.pos[0]),
        (this.pos[1] - otherObj.pos[1])
      ];
      dist[0] += dimX * ((dist[0] < dimX / -2) - (dist[0] > dimX / 2));
      dist[1] += dimY * ((dist[1] < dimY / -2) - (dist[1] > dimY / 2));

      force = gravity * -MovingObject.G * otherObj._mass / (sqrt(dist[0] * dist[0] + dist[1] * dist[1]) || 1);

      this.accel[0] += (dist[0] * force);
      this.accel[1] += (dist[1] * force);
      otherObj.accel[0] -= (dist[0] * force);
      otherObj.accel[1] -= (dist[1] * force);
    }.bind(this));
    this.game._currentAsteroids.shift();
  };

  MovingObject.prototype.applyAccel = function () {
    this.vel[0] += this.accel[0] / (this._mass || 1);
    this.vel[1] += this.accel[1] / (this._mass || 1);
  };


  MovingObject.prototype.move = function () {
    // this.numCollisions -= 0.1;
    // this._gravity();
    setTimeout(this._gravity.bind(this), 0);

    // this.accel[0] *= (Math.abs(this.vel[0]) < this.radius) * 1 - 1 / (this.radius);
    // this.accel[1] *= (Math.abs(this.vel[1]) < this.radius) * 1 - 1 / (this.radius);

    this.applyAccel();

    this.pos[0] += this.vel[0]; // % this.radius;
    this.pos[1] += this.vel[1]; // % this.radius;


    if( this.game.isOutOfBounds(this.pos) ) {
      if(this.isWrappable) {
        this.pos.set(this.game.wrap(this.pos));
        this.lastCollidedObject = this;
      } else if (this.relocate) {
        this.relocate();
      } else {
        this.game.remove(this);
      }
    }
    if (this.radius > Math.min(Asteroids.Game.DIM_Y, Asteroids.Game.DIM_X) / 2) {
      this.radius *= Math.SQRT1_2;
      this.density *= 2;
    }

    if (Math.abs(this.vel[0]) > Asteroids.Game.DIM_X / 2 || Math.abs(this.vel[1]) > Asteroids.Game.DIM_Y / 2) {
      this.vel[0] *= Math.SQRT1_2;
      this.vel[1] *= Math.SQRT1_2;
    }
  };

  MovingObject.prototype.dVel = function () {
    return [this.vel[0] / (Math.abs(this.vel[0]) || 1),
            this.vel[1] / (Math.abs(this.vel[1]) || 1)];
  };

  MovingObject.prototype.momentum = function () {
    return this._mass * sqrt(this.vel[0] * this.vel[0] + this.vel[1] * this.vel[1]);
  };

  MovingObject.prototype.mass = function () {
    return this.radius * this.radius * this.density;
  };

  MovingObject.prototype.distanceBetween = new Float32Array(9);

  MovingObject.prototype.isCollidedWith = function(otherObj) {
    if (otherObj == null || otherObj === this) { return false; }
    var posA = this.pos.subarray(0), posB = otherObj.pos.subarray(0), velA = this.vel.subarray(0);
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        this.distanceBetween[(i + 1) + ((j + 1) * 3)] = Asteroids.Util.prototype.distance(
          [
            posA[0] + velA[0] - i * Asteroids.Game.DIM_X,
            posA[1] + velA[1] - j * Asteroids.Game.DIM_Y
          ],
          posB
        );
      }
    }
    return Array.prototype.some.call(this.distanceBetween, function (dist) {
      return dist <= this.radius + otherObj.radius;
    }.bind(this));
  };

  MovingObject.prototype.collideWith = function(otherObj) {
    // this.game.remove(otherObj);
    // this.game.remove(this);
  };

  MovingObject.prototype.drawLines = function (ctx) {
      ctx.moveTo(this.pos[0] + 100 * this.vel[0], this.pos[1] + 100 * this.vel[1]);
      ctx.lineTo(this.pos[0], this.pos[1]);
      ctx.lineTo(this.pos[0] + 10 * this.accel[0], this.pos[1] + 10 * this.accel[1]);
  };

  MovingObject.prototype.getColor = function () {
    return this.color;
  };

  MovingObject.prototype.explode = function (ctx, callback) {
    this.dead = true;
    this.vel[0] = 0;
    this.vel[1] = 0;
    this.color = this.getColor();
    this.color = this.color.replace('l(','la(').replace('%)','%, 0.9)');
    this.absorbed = [];
    this.getColor = MovingObject.prototype.getColor.bind(this);
    this.move = function () {};
    this._mass = 0;
    this.draw(ctx);
    this._eTimes = 0;
    this._eCallback = callback;
    var explodeOut = function () {
      this.radius += this.MIN_RADIUS * 10 - 5 / (this.MIN_RADIUS || 1);
      this.MIN_RADIUS *= 0.99999;
      if (this.radius > 5) {
        requestAnimationFrame(explodeOut.bind(this, ctx))
      } else if (this.radius === NaN) {
        alert(this.MIN_RADIUS);
      } else {
        this.MIN_RADIUS = MovingObject.prototype.MIN_RADIUS;
        this.radius = 0;
        this._eCallback && this._eCallback();
      }
      this._eTimes++;
    }.bind(this);
    explodeOut();
  };

})();
