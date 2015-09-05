(function () {
  window.Asteroids = window.Asteroids || {};

  var Asteroid = window.Asteroids.Asteroid = function(position, game) {
    var options = {
      color: Asteroid.COLOR,
      radius: Asteroid.RADIUS - 5 * Math.round(Math.random() * 2),
      pos: position,
      vel: window.Asteroids.Util.prototype.randomVec(Number.MIN_VALUE),
      accel: [0, 0],
      game: game,
    };
    this.clump = [this];
    this.numCollisions = 0;
    window.Asteroids.MovingObject.call(this, options);
  };
  window.Asteroids.Util.prototype.inherits(Asteroid, window.Asteroids.MovingObject);

  Asteroid.COLOR = "#000";
  Asteroid.RADIUS = 20;

  Asteroid.prototype.collideWith = function (otherObj) {
    this.vel[0] *= otherObj.dVel()[0];
    this.vel[1] *= otherObj.dVel()[1];
    switch (otherObj.constructor) {
    case window.Asteroids.Ship:
      if (this.radius > otherObj.radius / 4) {
        otherObj.relocate();
      } else {
        this.game.remove(this);
        otherObj.radius *= 1 + this.radius / otherObj.radius;
      }
      break;
    case window.Asteroids.Bullet:
      this.game.remove(otherObj);
      this.radius = Math.max(this.radius / 2, 1);
      break;
    case window.Asteroids.Asteroid:

      if (this.clump.indexOf(otherObj) === -1) {
        this.clump.push(otherObj);
      } else if (this.clump.indexOf(otherObj) > 0) {
        // if (Asteroids.Util.prototype.distance(this.pos, otherObj.pos) < this.radius + otherObj.radius) {
        //   if (this.numCollisions < 3 || otherObj.numCollisions < 3) {
        //     this.radius = Math.ceil(this.radius / 2);
        //     return;
        //   }
        //   console.log("we should merge!");
        //     var biggerAstroid = new Asteroid([
        //       (this.pos[0] + otherObj.pos[0]) / 2,
        //       (this.pos[1] + otherObj.pos[1]) / 2
        //     ], this.game);
        //     biggerAstroid.radius = (otherObj.radius + this.radius) / 2;
        //     biggerAstroid.vel = [
        //       (this.vel[0] + otherObj.vel[0]) / 2,
        //       (this.vel[1] + otherObj.vel[1]) / 2
        //     ];
        //     biggerAstroid.accel = [
        //       (this.accel[0] + otherObj.accel[0]) / 2,
        //       (this.accel[1] + otherObj.accel[1]) / 2
        //     ];
        //     biggerAstroid.numCollisions = (this.numCollisions + otherObj.numCollisions) / 2;
        //     this.game.remove(otherObj);
        //     this.game.remove(this);
        //   setTimeout(function (argument) {
        //     console.log("we merged!");
        //     this.game.add(biggerAstroid);
        //   }.bind(this), 0);
        // }


        }
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

        this.numCollisions++;
        var colString = (this.numCollisions % Math.pow(16, 6)).toString(16);
        while (colString.length < 6) {
          colString += "0";
        }
        this.color = "#" + colString;
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
