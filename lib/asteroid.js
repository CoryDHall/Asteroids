(function () {
  window.Asteroids = window.Asteroids || {};

  var Asteroid = window.Asteroids.Asteroid = function(position, game) {
    var options = {
      color: Asteroid.COLOR,
      radius: Asteroid.RADIUS,
      pos: position,
      vel: [0,0] || window.Asteroids.Util.prototype.randomVec(Number.MIN_VALUE),
      accel: [0, 0],
      game: game,
      density: 1 + 3 * Math.random()
    };
    this.clump = [this];
    window.Asteroids.MovingObject.call(this, options);
  };
  window.Asteroids.Util.prototype.inherits(Asteroid, window.Asteroids.MovingObject);

  Asteroid.COLOR = "#000";
  Asteroid.RADIUS = 10;

  Asteroid.prototype.move = function () {
    var colString1 = ((Math.abs(Math.floor(this.momentum()))) % Math.pow(16, 3)).toString(16); //(256 * 256 * 256) -
    while (colString1.length < 3) {
      colString1 += "0";
    }
    var colString2 = ((Math.abs(Math.floor(this.numCollisions))) % Math.pow(16, 3)).toString(16); //(256 * 256 * 256) -
    while (colString2.length < 3) {
      colString2 += "0";
    }

    var colString = colString2[0] + colString1[0] + colString2[1] + colString1[1] + colString2[2] + colString1[2];
    this.color = "#" + colString;

    Asteroids.MovingObject.prototype.move.call(this);
  };

  Asteroid.prototype.collideWith = function (otherObj) {
    this.numCollisions++;
    var dMomentum = this.mass() / otherObj.mass();
    var newVel = otherObj.vel.slice();
    otherObj.vel = [this.vel[0] * dMomentum, this.vel[1] * dMomentum];
    this.vel = [newVel[0] / dMomentum, newVel[1] / dMomentum];
    switch (otherObj.constructor) {
    case window.Asteroids.Ship:
      if (this.mass() > otherObj.mass() / 4) {
        // this.density += otherObj.density/this.radius;
        // otherObj.radius = Math.max(otherObj.radius / 1.2, 1);
        // otherObj.relocate();
      } else {
        otherObj.radius = Math.sqrt(this.radius*this.radius/this.density + otherObj.radius*otherObj.radius);
        otherObj.density = Math.sqrt(this.density*this.density/this.radius + otherObj.density*otherObj.density);
        this.game.remove(this);
      }
      break;
    case window.Asteroids.Bullet:
      this.game.remove(otherObj);
      if (this.radius > 1) {
        var dV = otherObj.dVel();
        var debris = new Asteroid([this.pos[0] + this.radius * dV[0], this.pos[1] + this.radius * dV[1]], this.game);
        debris.radius = Math.max(this.radius / 2, 1);
        debris.density = this.density;
        debris.numCollisions = this.numCollisions *= .5;
        this.radius = Math.max(Math.sqrt(this.radius * this.radius / 2), 1);
        setTimeout(this.game.add.bind(this.game, debris), 0);
      }
      break;
    case window.Asteroids.Asteroid:
        if (otherObj.mass() > this.mass() * 3) {
          otherObj.radius = Math.sqrt(this.radius*this.radius/this.density + otherObj.radius*otherObj.radius);
          otherObj.density = Math.sqrt(this.density*this.density/this.radius + otherObj.density*otherObj.density);
          otherObj.numCollisions += this.numCollisions;
          this.game.remove(this);

        }
      // if (this.clump.indexOf(otherObj) === -1) {
      //   this.clump.push(otherObj);
      // } else if (this.clump.indexOf(otherObj) > 0) {
      //   // if (Asteroids.Util.prototype.distance(this.pos, otherObj.pos) < this.radius + otherObj.radius) {
      //   //   if (this.numCollisions < 3 || otherObj.numCollisions < 3) {
      //   //     this.radius = Math.ceil(this.radius / 2);
      //   //     return;
      //   //   }
      //   //   console.log("we should merge!");
      //   //     var biggerAstroid = new Asteroid([
      //   //       (this.pos[0] + otherObj.pos[0]) / 2,
      //   //       (this.pos[1] + otherObj.pos[1]) / 2
      //   //     ], this.game);
      //   //     biggerAstroid.radius = (otherObj.radius + this.radius) / 2;
      //   //     biggerAstroid.vel = [
      //   //       (this.vel[0] + otherObj.vel[0]) / 2,
      //   //       (this.vel[1] + otherObj.vel[1]) / 2
      //   //     ];
      //   //     biggerAstroid.accel = [
      //   //       (this.accel[0] + otherObj.accel[0]) / 2,
      //   //       (this.accel[1] + otherObj.accel[1]) / 2
      //   //     ];
      //   //     biggerAstroid.numCollisions = (this.numCollisions + otherObj.numCollisions) / 2;
      //   //     this.game.remove(otherObj);
      //   //     this.game.remove(this);
      //   //   setTimeout(function (argument) {
      //   //     console.log("we merged!");
      //   //     this.game.add(biggerAstroid);
      //   //   }.bind(this), 0);
      //   // }
      //
      //
      //   }
        // this.vel[0] *= otherObj.dVel()[0];// / (this.radius + otherObj.radius);
        // this.vel[1] *= otherObj.dVel()[1];// / (this.radius + otherObj.radius);
        // for (var i = 1; i < this.clump.length - 1; i++) {
        //   var oldObj = this.clump[i];
        //   this.accel[0] += 0.0001 * ((this.pos[0] >= oldObj.pos[0]) - 0.5) * (this.radius * oldObj.radius) / Asteroids.Util.prototype.distance(this.pos, oldObj.pos);
        //   this.accel[1] += 0.0001 * ((this.pos[1] >= oldObj.pos[1]) - 0.5) * (this.radius * oldObj.radius) / Asteroids.Util.prototype.distance(this.pos, oldObj.pos);
        // }
        // switch (this.color) {
        //   case "#000":
        //       var color = "#" + Math.floor(Math.pow(8, 8) * Math.random()).toString(16);
        //       this.color = color;
        //       otherObj.color = color;
        //     break;
        //   default:
        //     this.color = "#000"
        // }

        // this.color = "#f90";
        // if (this.momentum() > 10 * otherObj.momentum()) {
        //   this.radius = (Math.sqrt(Math.pow(this.radius, 2) + Math.pow(otherObj.radius, 2)));
        //   otherObj.radius = 1;
        //   this.clump.push(otherObj);
        //   setTimeout(this.game.remove.bind(this.game, otherObj), 0);
        //
        //
        // } else if (this.momentum() > 5 * otherObj.momentum()) {
        //   otherObj.radius = 1;
        //   this.clump.push(otherObj);
        //   setTimeout(this.game.remove.bind(this.game, otherObj), 0);
        //
        //   this.radius = Math.ceil(this.radius / 3);
        //   var debris = new Asteroid([this.pos[0] + this.dVel()[0] * this.radius, this.pos[1] + this.dVel()[1] * this.radius], this.game);
        //   debris.vel = [this.dVel()[1] * this.vel[0] / 3, this.dVel()[0] / 3];
        //   debris.radius = Math.ceil(this.radius / 10)
        //   this.game.add(debris);
        // }
        // // this.vel[1] = (this.vel[1] + otherObj.vel.slice()[1]) / 2;

      break;
    }
  };

})();
