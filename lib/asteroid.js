(function () {
  window.Asteroids = window.Asteroids || {};

  var Asteroid = window.Asteroids.Asteroid = function(position, game) {
    var options = {
      color: Asteroid.COLOR,
      radius: Asteroid.RADIUS,
      pos: position,
      vel: window.Asteroids.Util.prototype.randomVec(1),
      accel: [0, 0],
      game: game,
      density: Asteroid.BASE_DENSITY + 1 * Math.random()
    };
    window.Asteroids.MovingObject.call(this, options);
    this.capStyle = "square";
  };
  window.Asteroids.Util.prototype.inherits(Asteroid, window.Asteroids.MovingObject);

  Asteroid.COLOR = "#000";
  Asteroid.RADIUS = 1;
  Asteroid.BASE_DENSITY = 1;

  Asteroid.prototype.getColor = function () {
    var hue = (this.numCollisions % 360).toFixed();
    var sat = "100%";
    // var light =  (80 - (this.mass() * 100 / this.CRITICAL_MASS) * 70) + "%";
    var light = (90 - (this.game.round * 5) % 80) + "%";
    // return "hsl(5000, 100%, 20.50%)";
    return "hsl(" + hue + "," + sat + "," + light + ")";
  };

  Asteroid.prototype.collideWith = function (otherObj) {
    this.numCollisions++;
    this.numCollisions = this.numCollisions % 360;

    var thisMass = this.mass();
    var otherMass = otherObj.mass();
    var massSum = thisMass + otherMass;
    var newVel = otherObj.vel.slice();
    var thisdMass = thisMass - otherMass;
    var otherdMass = otherMass - thisMass;
    var thisMomentumI = thisMass * this.vel[0];
    var thisMomentumJ = thisMass * this.vel[1];
    var otherMomentumI = otherMass * otherObj.vel[0];
    var otherMomentumJ = otherMass * otherObj.vel[1];

    otherObj.vel = [
      (otherObj.vel[0]*otherdMass + 2 * thisMomentumI)/massSum,
      (otherObj.vel[1]*otherdMass + 2 * thisMomentumJ)/massSum
    ];

    this.vel = [
      (this.vel[0]*thisdMass + 2 * otherMomentumI)/massSum,
      (this.vel[1]*thisdMass + 2 * otherMomentumJ)/massSum
    ];

    switch (otherObj.constructor) {
    case window.Asteroids.Ship:
      if (this.mass() > otherObj.mass() / 4) {
        // this.density += otherObj.density/this.radius;
        // otherObj.radius = Math.max(otherObj.radius / 1.2, 1);
        // otherObj.relocate();
      } else {
        // otherObj.radius = Math.sqrt(this.radius*this.radius/this.density + otherObj.radius*otherObj.radius);
        // otherObj.density = Math.sqrt(this.density*this.density/this.radius + otherObj.density*otherObj.density);
          // otherObj.density += (this.mass())/(otherObj.radius * otherObj.radius);
          otherObj.radius = Math.sqrt(this.mass()/otherObj.density + otherObj.radius*otherObj.radius);
        otherObj.absorbed.push(this.getColor());
        this.game.remove(this);
      }
      break;
    case window.Asteroids.Bullet:
      // this.game.remove(otherObj);
      if (this.radius > 1) {
        var dV = otherObj.dVel();
        var debris = new Asteroid([this.pos[0] + Math.SQRT2 * this.radius * -dV[0], this.pos[1] + Math.SQRT2 * this.radius * -dV[1]], this.game);
        debris.radius = this.radius;
        debris.density = this.density *= 0.5;
        debris.numCollisions = this.numCollisions *= 0.5;
        setTimeout(this.game.add.bind(this.game, debris), 0);
      }
      break;
    case window.Asteroids.Asteroid:
        if (thisMass < otherMass / Math.SQRT2) {
        otherObj.absorbed.push(this.getColor());
        otherObj.radius = Math.sqrt(this.mass()/otherObj.density + otherObj.radius*otherObj.radius);
          otherObj.numCollisions += this.numCollisions;
          this.game.remove(this);

        } else if ((this.game.asteroids.length < 60 && this.radius > 1) &&
          (thisMomentumI * thisMomentumI + thisMomentumJ * thisMomentumJ) - (otherMomentumI * otherMomentumI + otherMomentumJ * otherMomentumJ) > 1000000000) {
          var dV = otherObj.vel;
          var debris = new Asteroid([this.pos[0] + this.radius * dV[1], this.pos[1] + this.radius * dV[0]], this.game);
          debris.radius = this.radius = Math.max(
            Math.sqrt(this.radius * this.radius / 2),
            1
          );
          debris.density = this.density;
          debris.numCollisions = this.numCollisions;
          setTimeout(this.game.add.bind(this.game, debris), 0);
        } else if (otherMass > this.CRITICAL_MASS) {
          otherObj.density = Math.sqrt(this.density*this.density/this.radius + otherObj.density*otherObj.density);
          otherObj.numCollisions += this.numCollisions;
          this.game.remove(this);
        }
      break;
    }
  };

})();
