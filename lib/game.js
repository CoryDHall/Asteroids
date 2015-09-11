(function () {
  window.Asteroids = window.Asteroids || {};

  var Game = window.Asteroids.Game = function(dimX, dimY) {
    Game.DIM_X = dimX || Game.DIM_X;
    Game.DIM_Y = dimY || Game.DIM_Y;

    this.bullets = [];
    this.asteroids = [];
    this.addingAsteroids = false;
    // this.addAsteroids();
    this.addShip();
    this.gTime = new Date();
    this._diag = {
      drawLines: false,
      erase: 0.01,
    };

    setInterval(function () {
      if (this.addingAsteroids) {
        if (Math.random() < 0.05) {
          var bigAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
          bigAsteroid.radius = 100;
          bigAsteroid.density *= 100.0;
          this.add(bigAsteroid);
        } else {
          this.add(new Asteroids.Asteroid(this.randomPosition(), this));
        }
        this.addingAsteroids = this.asteroids.length < Game.NUM_ASTEROIDS;
      }
    }.bind(this), 10 * Game.NUM_ASTEROIDS);
  };


  Game.DIM_X = 1280;
  Game.DIM_Y = 720;
  Game.NUM_ASTEROIDS = 10;

  Game.prototype.addAsteroids = function() {
    for(var i = 0; i < Game.NUM_ASTEROIDS; i++){
      var asteroid = new window.Asteroids.Asteroid(
        Game.prototype.randomPosition(), this
      );
      this.add(asteroid);
    }
  };

  Game.prototype.addShip = function () {
    var ship = new window.Asteroids.Ship(
      [Game.DIM_X / 2, Game.DIM_Y / 2], this
    );

    this.add(ship);
  };

  Game.prototype.add = function (obj) {
    if(obj instanceof window.Asteroids.Bullet) {
      this.bullets.push(obj);
    } else if (obj instanceof window.Asteroids.Asteroid) {
      this.asteroids.push(obj);
    } else if (obj instanceof window.Asteroids.Ship) {
      this.ship = obj;
    }
  };



  Game.prototype.allObjects = function () {
    var objArr = [];
    objArr = this.asteroids.slice();
    objArr.push(this.ship);
    objArr = objArr.concat(this.bullets);
    return objArr;
  };

  Game.prototype.randomPosition = function() {
    var x_pos = Math.round(Math.random() * Game.DIM_X);
    var y_pos = Math.round(Math.random() * Game.DIM_Y);

    return [x_pos, 0];
  };

  Game.prototype.draw = function(ctx) {
    // ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    //
    // ctx.fillStyle = "rgba(240,200,220, 0.7)";
    ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
    ctx.fillStyle = "rgba(0, 0, 0, " + this._diag.erase + ")";
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function (object) {
      if (this._diag.drawLines) {
        object.drawLines(ctx);
      }
      object.draw(ctx);
    }.bind(this));
  };

  Game.prototype.moveObjects = function(ctx) {
    this.allObjects().forEach(function (object) {
      object.move();
    });
  };

  Game.prototype.wrap = function (pos) {
    var xIn = pos[0];
    var yIn = pos[1];

    //

    var xOut = xIn -
               ((xIn > Game.DIM_X) * Game.DIM_X) +
               ((xIn < 0) * Game.DIM_X);

    var yOut = yIn -
               ((yIn > Game.DIM_Y) * Game.DIM_Y) +
               ((yIn < 0) * Game.DIM_Y);

    return [xOut, yOut];
  };

  Game.prototype.checkCollisions = function() {
    var objects = this.allObjects();
    objects.forEach(function (object1, idx) {
      if (object1 !== this.ship && object1.isCollidedWith(this.ship)) {
        object1.collideWith(this.ship);
        return;
      }
      objects.slice(idx + 1).forEach(function (object2) {
        if (object1 !== object2 &&
          object1.isCollidedWith(object2)) {
          object1.collideWith(object2);
          return false;
        }
        return true;
      });
    });
  };

  Game.prototype.step = function () {
    this.gTime = new Date();
    this.moveObjects();
    this.checkCollisions();
    if (!this.addingAsteroids && this.asteroids.length <= Game.NUM_ASTEROIDS / 10) {
      Asteroids.Asteroid.BASE_DENSITY += 1;
      var bigAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
      bigAsteroid.radius = 100;
      bigAsteroid.density *= 100.0;
      this.add(bigAsteroid);

      // this.addAsteroids();
      this.addingAsteroids = true;
      this.ship.levelUp();
    }
  };

  Game.prototype.remove = function (otherObj) {
    if(otherObj instanceof window.Asteroids.Asteroid) {
      this.asteroids = this.asteroids.filter(function (this_asteroid) {
        return this_asteroid !== otherObj;
      });
    } else if (otherObj instanceof window.Asteroids.Bullet) {
      this.bullets = this.bullets.filter(function (this_bullet) {
        return this_bullet !== otherObj;
      });
    }
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] > Game.DIM_X || pos[0] < 0) ||
      (pos[1] > Game.DIM_Y || pos[1] < 0);
  };

  Game.prototype.winSize = function () {
    return (Game.DIM_X * Game.DIM_Y) / (1000 * 1000);
  };

  Game.prototype.toggleDiag = function (code) {
    switch (code) {
      case "WEB":
        this._diag.drawLines = !this._diag.drawLines;
        break;
      case "SMEAR":
        this._diag.erase = (1 + this._diag.erase + 0.05) % 1;
        break;
      default:

    }
  };

})();
