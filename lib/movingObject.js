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

  MovingObject.prototype.CRITICAL_MASS = 300000000;
  MovingObject.prototype.MIN_RADIUS = 1.5;

  MovingObject.G = Math.pow(10, -9);

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
        if (this.game._diag.pause && !this.dead) {
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
              Math.PI * 2,
              true
            );
            ctx.fill();
          }
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.beginPath();
        }
        // rand = 1 - rand * rand;
        ctx.lineWidth = this.dead ? (this.radius + this.radius * this.MIN_RADIUS) / 5 : (time * 5) % (this.radius / 5) + this.MIN_RADIUS;
        ctx.lineCap = this.capStyle;
        for (var k = 0; k <= 3; k++) {
        ctx.strokeStyle = this.dead ? this.color : this.absorbed[Math.floor(rand * this.absorbed.length)];
        ctx.arc(
          this.pos[0] - i * dimX,
          this.pos[1] - j * dimY,
          this.dead ? this.radius * 2 - this.radius * this.MIN_RADIUS: (this.radius / 2) * Math.cos(time * 4 * (1 - this.game.round / 5)) + ((this.radius / 2) + 2),
          (time * 5 + (Math.sin(k) * Math.PI / this.radius)) % (Math.PI * 2),
          (time * 5 - (Math.sin(k) * Math.PI / this.radius)) % (Math.PI * 2),
          true //(this.capStyle === "square")
        );
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        }
        if (this.radius < 4) return;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3 - 1.5 * (this.capStyle === "square");
        ctx.arc(
          this.pos[0] - i * dimX,
          this.pos[1] - j * dimY,
          this.radius,
          (Math.atan2(v[1], v[0]) + (Math.PI / 2)),
          (Math.atan2(v[1], v[0]) - (Math.PI / 2)),
          !this.dead
        );
        ctx.stroke()
        ctx.beginPath();
        ctx.lineWidth = 2 - 0.5 * (this.capStyle === "square" && !this.dead);
        ctx.arc(
          this.pos[0] - i * dimX,
          this.pos[1] - j * dimY,
          this.radius + 2 - (this.capStyle === "square"),
          (Math.atan2(v[1], v[0]) + ((3) * Math.PI / 4)),
          (Math.atan2(v[1], v[0]) - ((3) * Math.PI / 4)),
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
          Math.atan2(aV[1], aV[0]) % (Math.PI * 2) + (Math.PI / 4),
          Math.atan2(aV[1], aV[0]) % (Math.PI * 2) - (Math.PI / 4),
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

  MovingObject.prototype._gravity = function () {
    var dimX = (Asteroids.Game.DIM_X / 1);
    var dimY = (Asteroids.Game.DIM_Y / 1);
    var force, gravity = this.game._diag.gravity;
    this.accel[0] = 0;
    this.accel[1] = 0;
    if (gravity === 0) {
      return;
    }
    var sqrt = Math.sqrt;
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


  MovingObject.prototype.move = function () {
    // this.numCollisions -= 0.1;
    // this._gravity();
    setTimeout(this._gravity.bind(this), 0);

    // this.accel[0] *= (Math.abs(this.vel[0]) < this.radius) * 1 - 1 / (this.radius);
    // this.accel[1] *= (Math.abs(this.vel[1]) < this.radius) * 1 - 1 / (this.radius);

    this.vel[0] += this.accel[0] / (this._mass || 1);
    this.vel[1] += this.accel[1] / (this._mass || 1);


    // if (this._mass > this.CRITICAL_MASS) {
    //   return;
    // }
    this.pos[0] += this.vel[0]; // % this.radius;
    this.pos[1] += this.vel[1]; // % this.radius;


    if( this.game.isOutOfBounds(this.pos) ) {
      if(this.isWrappable) {
        this.pos.set(this.game.wrap(this.pos));
        this.lastCollidedObject = this;
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

    if ((Math.max(this.pos[0], 0) == 0 ||
      Math.min(this.pos[0], Asteroids.Game.DIM_X) == Asteroids.Game.DIM_X) ||
      (Math.max(this.pos[1], 0) == 0 ||
      Math.min(this.pos[1], Asteroids.Game.DIM_Y) == Asteroids.Game.DIM_Y)) {
      if (this.relocate) {
        this.relocate();
      } else {
        this.game.remove(this);
      }
    }


  };

  MovingObject.prototype.dVel = function () {
    return [this.vel[0] / (Math.abs(this.vel[0]) || 1),
            this.vel[1] / (Math.abs(this.vel[1]) || 1)];
  };

  MovingObject.prototype.momentum = function () {
    return this._mass * (Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2)));
  };

  MovingObject.prototype.mass = function () {
    return this.radius * this.radius * this.density;
  };

  MovingObject.prototype.distanceBetween = new Float32Array(9);

  MovingObject.prototype.isCollidedWith = function(otherObj) {
    if (otherObj == null) { return false; }
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
    // distanceBetween + 2 < ();
    // return Asteroids.Util.prototype.wrapDistance(this.pos.slice(), otherObj.pos.slice()) < this.radius + otherObj.radius + 1;
  };

  MovingObject.prototype.collideWith = function(otherObj) {
    // this.game.remove(otherObj);
    // this.game.remove(this);
  };

  MovingObject.prototype.drawLines = function (ctx) {
    // ctx.strokeStyle = this.getColor();
    // ctx.beginPath();
      ctx.moveTo(this.pos[0] + 100 * this.vel[0], this.pos[1] + 100 * this.vel[1]);
      ctx.lineTo(this.pos[0], this.pos[1]);
    // ctx.closePath();
    // ctx.stroke();
  };

  MovingObject.prototype.getColor = function () {
    return this.color;
  };

  MovingObject.prototype.explode = function (ctx, callback) {
    this.dead = true;
    this.vel[0] = 0;
    this.vel[1] = 0;
    this.color = this.getColor();
    this.color = this.color.replace('l','la').replace(')',', 0.9)');
    this.absorbed = [];
    this.getColor = MovingObject.prototype.getColor.bind(this);
    this.draw(ctx);
    var explodeOut = function () {
      // if (this.game.gTime - this.game.oldTime > this.game.MIN_FRAME_RATE) {
      //   return;
      // }
      this.radius += this.MIN_RADIUS * 10 - 5 / this.MIN_RADIUS;
      this.MIN_RADIUS *= 0.98;
      if (this.radius > 5) {
        requestAnimationFrame(explodeOut.bind(this, ctx))
      }
    };
    explodeOut();
    // setTimeout(function () {
    //   clearInterval(explodeOut);
    //   callback();
    // }, 2000);
  };

})();
