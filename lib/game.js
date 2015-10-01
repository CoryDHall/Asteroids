(function () {
  Asteroids = window.Asteroids || {};

  var Game = Asteroids.Game = function(dimX, dimY) {
    Game.DIM_X = dimX || Game.DIM_X;
    Game.DIM_Y = dimY || Game.DIM_Y;

    this.bullets = [];
    this.asteroids = [];
    this.round = 0;
    this.addingAsteroids = false;
    // this.addAsteroids();
    this.addShip();
    this.gTime = this.oldTime = new Date();
    this._diag = {
      drawLines: false,
      erase: 0.06,
    };

    setInterval(function () {
      if (this.addingAsteroids) {
        if (Math.random() < (1 / Asteroids.Asteroid.RADIUS)) {
          Asteroids.Asteroid.RADIUS *= 1.5;

          var bigAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
          bigAsteroid.radius *= 4 + (6 * Math.random());
          // bigAsteroid.density *= 100.0;
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
  Game.NUM_ASTEROIDS = 3;
  Game.MAX_BULLETS = 2;

  Game.prototype.addAsteroids = function() {
    for(var i = 0; i < Game.NUM_ASTEROIDS; i++){
      var asteroid = new Asteroids.Asteroid(
        Game.prototype.randomPosition(), this
      );
      this.add(asteroid);
    }
  };

  Game.prototype.addShip = function () {
    var ship = new Asteroids.Ship(
      [Game.DIM_X / 2, Game.DIM_Y / 2], this
    );

    this.add(ship);
  };

  Game.prototype.add = function (obj) {
    if(obj instanceof Asteroids.Bullet) {
      if (this.bullets.length > Game.MAX_BULLETS) {
        delete obj;
        return;
      }
      this.bullets.push(obj);
    } else if (obj instanceof Asteroids.Asteroid) {
      this.asteroids.push(obj);
    } else if (obj instanceof Asteroids.Ship) {
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

    return Math.random() > 0.5 ? [x_pos, 0] : [0, y_pos];
  };

  Game.prototype.draw = function(ctx, $overlay) {
    this.oldTime = this.gTime;
    this.gTime = new Date();
    // ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    //
    // ctx.fillStyle = "rgba(240,200,220, 0.7)";
    // ctx.fillStyle = "rgba(255, 255, 255, 0.01)";

    ctx.fillStyle = "hsla(210, 90%, 2%, " + (this._diag.erase) + ")";
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    }.bind(this));
    if (this._diag.drawLines) {
      ctx.strokeStyle = "hsla(0, 0%, 90%, 0.1)";
      ctx.beginPath();
      this.allObjects().forEach(function (object) {
          object.drawLines(ctx);
      });
      ctx.stroke();
      ctx.closePath();
    }
    var shipMass = this.ship._mass;
    $overlay.text("Mass: " + (shipMass + "").match(/\d+/));
    $overlay.append("<br>Asteroids Left: " + this.asteroids.length);
    // this.asteroids.forEach(function (asteroid) {
    //   var $asteroidInfo = $("<p>")
    //     .css({ color: asteroid.getColor() })
    //     .text(((asteroid._mass / shipMass) + "").match(/-*\d+\.\d/) + "x" + (asteroid.radius + "").match(/-*\d+/) + "::"+ asteroid.pos.map(function (coord) { return (coord + "").match(/\d+/) }).toString());
    //
    //   $overlay.append($asteroidInfo);
    // });
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
      objects.slice(idx + 1).every(function (object2) {
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
    if (this.gTime - this.oldTime > 1000 / 24) {
      this.oldTime = this.gTime;
      return;
    }

    this.moveObjects();
    this.checkCollisions();
    if (!this.addingAsteroids && this.asteroids.length <= 1) {
      Asteroids.Asteroid.BASE_DENSITY *= 2;
      var bigAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
      // bigAsteroid.radius += 100.0;
      bigAsteroid.density *= 200.0;
      this.add(bigAsteroid);
      this.round++;
      // this.addAsteroids();
      this.addingAsteroids = true;
      this.ship.levelUp();
    }
  };

  Game.prototype.remove = function (otherObj) {
    if(otherObj instanceof Asteroids.Asteroid) {
      this.asteroids = this.asteroids.filter(function (this_asteroid) {
        return this_asteroid !== otherObj;
      });
    } else if (otherObj instanceof Asteroids.Bullet) {
      this.bullets = this.bullets.filter(function (this_bullet) {
        return this_bullet !== otherObj;
      });
    }

    setTimeout(function () {
      delete otherObj;
    }, 0);
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
        this._diag.erase =  (this._diag.erase <= 1) * (this._diag.erase + 0.01 * (this._diag.erase < 0.1) + 0.2 * (this._diag.erase >= 0.1));
        break;
      default:

    }
  };

})();
