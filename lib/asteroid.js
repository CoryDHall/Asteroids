(function () {
  Asteroids = window.Asteroids || {};

  var Asteroid = Asteroids.Asteroid = function(position, game) {
    var options = {
      color: Asteroid.COLOR,
      radius: Asteroid.RADIUS,
      pos: position,
      vel: Asteroids.Util.prototype.randomVec(5),
      accel: [0, 0],
      game: game,
      density: Asteroid.BASE_DENSITY + Asteroid.BASE_DENSITY * Math.random()
    };
    Asteroids.MovingObject.call(this, options);
    this.capStyle = "square";
  };
  Asteroids.Util.prototype.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.COLOR = "#000";
  Asteroid.RADIUS = 60;
  Asteroid.BASE_DENSITY = .0102;

  Asteroid.prototype._gravity = function () {
    Asteroids.MovingObject.prototype._gravity.bind(this)();
    this.game._currentAsteroids.shift();
  };

  Asteroid.prototype.getColor = function () {
    var hue = ((this.game.round * 141 - this.radius * (Math.random() / 4 - 1 / 8)) % 360).toFixed();
    var sat = "100%";
    var light = (80 - (this.numCollisions * this.numCollisions) % 60) + "%";
    // return "hsl(5000, 100%, 20.50%)";
    return "hsl(" + hue + "," + sat + "," + light + ")";
  };

  Asteroid.prototype.collideWith = function (otherObj) {
    // if (otherObj === this.lastCollidedObject) { return; }
    this.numCollisions++;
    // this.numCollisions = this.numCollisions % 360;

    var thisMass = this._mass = this.mass();
    var otherMass = otherObj._mass = otherObj.mass();
    var massSum = thisMass + otherMass;
    var newVel = otherObj.vel.subarray(0);
    var thisdMass = thisMass - otherMass;
    var otherdMass = otherMass - thisMass;
    var thisMomentumI = thisMass * this.vel[0];
    var thisMomentumJ = thisMass * this.vel[1];
    var otherMomentumI = otherMass * otherObj.vel[0];
    var otherMomentumJ = otherMass * otherObj.vel[1];

    otherObj.vel[0] = (otherObj.vel[0]*otherdMass + 2 * thisMomentumI)/massSum;
    otherObj.vel[1] = (otherObj.vel[1]*otherdMass + 2 * thisMomentumJ)/massSum;

    this.vel[0] = (this.vel[0]*thisdMass + 2 * otherMomentumI)/massSum;
    this.vel[1] = (this.vel[1]*thisdMass + 2 * otherMomentumJ)/massSum

    this.pos[0] += this.vel[0] * (otherObj.radius + 1);
    this.pos[1] += this.vel[1] * (otherObj.radius + 1);

    switch (otherObj.constructor) {
    case Asteroids.Ship:
      if (thisMass > otherMass * Math.SQRT2) {
        var massSliver = thisdMass / 100;
        this.radius = Math.sqrt(this.radius * this.radius + (massSliver)/this.density);
        otherObj.density = (otherMass - (massSliver)) / (otherObj.radius * otherObj.radius);
        this._mass += massSliver;
        otherObj.numCollisions++;
        otherObj._mass -= massSliver;
        this.move();
      } else if (thisMass < otherMass / 10) {
        // otherObj.radius = Math.sqrt(this.radius*this.radius/this.density + otherObj.radius*otherObj.radius);
        // otherObj.density = Math.sqrt(this.density*this.density/this.radius + otherObj.density*otherObj.density);
          // otherObj.density += (thisMass)/(otherObj.radius * otherObj.radius);
        otherObj.radius = Math.sqrt(thisMass/otherObj.density + otherObj.radius*otherObj.radius);
        otherObj.absorbed.push(this.getColor());

          otherObj.pos[0] -= otherObj.vel[0];
          otherObj.pos[1] -= otherObj.vel[1];

        otherObj.vel = newVel;

          this.pos[0] -= this.vel[0] * (otherObj.radius + 1) + newVel[0];
          this.pos[1] -= this.vel[1] * (otherObj.radius + 1) + newVel[1];

        this.game.remove(this);
      } else {
        this.move();
      }
      break;
    case Asteroids.Bullet:
      // if (otherObj.density > -20) { this.game.remove(otherObj); }
      this.game.remove(otherObj);
      if (this.radius > this.MIN_RADIUS) {
        var dV = this.dVel();
        var debris = new Asteroid([this.pos[0] + Math.SQRT2 * this.radius * -dV[0], this.pos[1] + Math.SQRT2 * this.radius * -dV[1]], this.game);
        debris.radius = this.radius;
        debris.density = this.density *= 0.5;
        this._mass *= 0.5;
        debris.numCollisions = this.numCollisions *= 0.5;
        setTimeout(this.game.add.bind(this.game, debris), 0);
      }
      break;
    case Asteroids.Asteroid:
      this.lastCollidedObject = otherObj;
      otherObj.lastCollidedObject = this;
        if (thisMass < otherMass / 4) {
          otherObj.absorbed.push(this.getColor());
          otherObj.radius = Math.sqrt(thisMass/otherObj.density + otherObj.radius*otherObj.radius);
          otherObj._mass += thisMass;
          otherObj.numCollisions += this.numCollisions;

            this.pos[0] -= this.vel[0] * (otherObj.radius + 1);
            this.pos[1] -= this.vel[1] * (otherObj.radius + 1);

          this.game.remove(this);
        } else if (this.game.asteroids.length < 24 * this.game.MIN_FRAME_RATE / (this.game.gTime - this.game.oldTime) && this.radius > this.MIN_RADIUS &&
          (thisMomentumI * thisMomentumI + thisMomentumJ * thisMomentumJ) - (otherMomentumI * otherMomentumI + otherMomentumJ * otherMomentumJ) > 10000) {
          var dV = otherObj.vel;
          var debris = new Asteroid(
            [this.pos[0] + this.radius * dV[1],
              this.pos[1] + this.radius * dV[0]],
            this.game
          );
          debris.radius = this.radius = Math.max(
            Math.SQRT1_2 * this.radius,
            this.MIN_RADIUS
          );
          debris.density = this.density;
          debris.numCollisions = this.numCollisions;
          this.move();
          requestAnimationFrame(this.game.add.bind(this.game, debris));
        } else if (otherMass > thisMass) {
          this._mass = thisMass / 2;
          otherObj.radius = Math.sqrt((this._mass)/otherObj.density + otherObj.radius*otherObj.radius);
          this.numCollisions *= 0.5;
          otherObj.numCollisions += this.numCollisions;
          otherObj._mass += this._mass;
          this.radius = Math.sqrt(this.radius * this.radius - (this._mass)/this.density);
        } else {
          this.move();
        }
      break;
    }
  };

})();
