(function () {
  Asteroids = window.Asteroids || {};

  var Game = Asteroids.Game = function(dimX, dimY) {
    Game.DIM_X = dimX || Game.DIM_X;
    Game.DIM_Y = dimY || Game.DIM_Y;
    Asteroids.MovingObject.prototype.MIN_RADIUS = dimX * dimY / 4000000;
    this._currentAsteroids = [];
    this.bullets = [];
    this.asteroids = [];
    this.round = 0;
    this.addingAsteroids = true;
    this.bossbeaten = false;
    // this.addAsteroids();
    this.addShip();
    this.gTime = this.oldTime = new Date();
    this._diag = {
      drawLines: false,
      erase: 0.2,
      pause: false,
      gravity: 1
    };
    this.MIN_FRAME_RATE = 1000 / 15;
    setInterval(function () {
      if (this.addingAsteroids) {
        if (Math.random() < (1 / 2 + 1 / Asteroids.Asteroid.RADIUS / 2)) {

          var bigAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
          bigAsteroid.radius *= 4 + (6 * Math.random());
          var newAsteroid = bigAsteroid;
          this.add(newAsteroid);
          newAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
        } else {
          var newAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
        }
        this.add(newAsteroid);
        // Asteroids.Asteroid.RADIUS += newAsteroid.MIN_RADIUS / 4;
        this.addingAsteroids = this.asteroids.length < Game.NUM_ASTEROIDS;
        return;
      }
      Asteroids.Asteroid.RADIUS = 10;
    }.bind(this), 500 / Game.NUM_ASTEROIDS);
  };


  Game.DIM_X = 1280;
  Game.DIM_Y = 720;
  Game.NUM_ASTEROIDS = 8;
  Game.MAX_BULLETS = 10;

  Game.prototype.addAsteroids = function() {
    for(var i = 0; i < Game.NUM_ASTEROIDS; i++){
      var asteroid = new Asteroids.Asteroid(
        Game.prototype.randomPosition(), this
      );
      this.add(asteroid);
    }
  };

  Game.FILL_COLOR = "hsla(210, 90%, 2%, ";
  Game.prototype._fillColor = Game.FILL_COLOR;

  Game.prototype.getFillColor = function () {
    return this._fillColor + (this._diag.erase) + ")";
  };

  Game.prototype.tempFillColor = function (newColor) {
    this._fillColor = newColor;
    var transition = setInterval(function () {
      var findHue = /\d+(\.\d)*/;
      var findLight = /%\s*,\d+(\.)?\d*%/;
      var hue = parseFloat(findHue.exec(this._fillColor)[0], 10);
      var light = parseFloat(findLight.exec(this._fillColor)[0].replace(/[%,]/g, ''), 10);
      this._fillColor = this._fillColor.replace(findHue, (((hue + 210) / 2))).replace(findLight, "%," + ((light + 2) / 2) + "%");
    }.bind(this), 50);
    setTimeout(function () {
      this._fillColor = Game.FILL_COLOR;
      clearInterval(transition);
    }.bind(this), 2500);
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
      // this.checkCollisions();
    } else if (obj instanceof Asteroids.Ship) {
      this.ship = obj;
      // this.checkCollisions();
    }
  };

  Game.prototype.getCurrentAsteroids = function () {
    if (this._currentAsteroids.length == 0) {
      this._currentAsteroids = this.asteroids.slice();
    }
    return this._currentAsteroids;
  };


  Game.prototype.allObjects = function () {
    var objArr = [];
    objArr = objArr.concat(this.asteroids.slice());
    objArr = objArr.concat(this.bullets);
    objArr.push(this.ship);
    return objArr;
  };

  Game.prototype.randomPosition = function() {
    var x_pos = Math.round(Math.random() * Game.DIM_X);
    var y_pos = Math.round(Math.random() * Game.DIM_Y);

    return Math.random() > 0.5 ? [x_pos, 0] : [0, y_pos];
  };

  Game.prototype.draw = function(ctx, $overlay, callback) {
    callback();
    this._ctx = ctx;
    this.oldTime = this.gTime;
    this.gTime = new Date();
    // ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    //
    // ctx.fillStyle = "rgba(240,200,220, 0.7)";
    // ctx.fillStyle = "rgba(255, 255, 255, 0.01)";

    ctx.fillStyle = this.getFillColor();
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
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
    $overlay.text("Mass: " + (shipMass + "").match(/-*\d+/));
    $overlay.append("<br>Asteroids Absorbed: " + this.ship.absorbed.length);
    $overlay.append("<br>Asteroids Left: " + this.asteroids.length);
    $overlay.append("<br>Current Gravity: x" + (this._diag.gravity));
    if (this._diag.pause) {
      $overlay.append("<br>Paused<br>");
      // this.allObjects().forEach(function (asteroid) {
      //   var $asteroidInfo = $("<p>")
      //     .css({ color: asteroid.getColor() })
      //     .text(" ‹››› " + ((asteroid._mass / shipMass).toString(36)).match(/-*\w+\.*\w*/) + " » " + (asteroid.radius + "").match(/-*\d+/) + " | "+ asteroid.pos.map(function (coord) { return (coord.toString(16)).match(/\w+/) }).toString());
      //
      //   $overlay.append($asteroidInfo);
      // });
    }
    // setTimeout(this.step.bind(this), 0);
    requestAnimationFrame(this.step.bind(this));
    requestAnimationFrame(this.draw.bind(this, ctx, $overlay, callback));
  };

  Game.prototype.moveObjects = function(ctx) {
    if (this.gTime - this.oldTime > this.MIN_FRAME_RATE * 2) {
      this.oldTime = this.gTime;
      return;
    }
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
      var collided = objects.slice(idx + 1).every(function (object2, idx2) {
        if (object1.isCollidedWith(object2)) {
          object1.collideWith(object2);
          objects.splice(idx + 1 + idx2, 1);
          return false;
        }
        return true;
      });
      if (!collided) { object1.lastCollidedObject = object1; }
    });
  };

  Game.prototype.step = function () {
    if (this.gTime - this.oldTime > this.MIN_FRAME_RATE * 2 || this._diag.pause) {
      this.oldTime = this.gTime;
      return;
    }
    this.checkCollisions();
    requestAnimationFrame(this.moveObjects.bind(this));
    if (!this.addingAsteroids && this.asteroids.length <= Math.ceil(Game.NUM_ASTEROIDS / 3)) {
      Asteroids.Asteroid.BASE_DENSITY *= 1.2;
      var bigAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
      // bigAsteroid.radius += 100.0;
      this.round++;
      this.ship.levelUp();
      bigAsteroid.density = this.ship.density;
      bigAsteroid.radius = this.ship.radius;
      this.add(bigAsteroid);
      this.addingAsteroids = true;
      var color = bigAsteroid.getColor();
      bigAsteroid.color = color;
      bigAsteroid.getColor = Asteroids.MovingObject.prototype.getColor;
      this.tempFillColor(color.replace(/\d+%\)/, '50%,').replace(/sl/, 'sla'));
    }
  };

  Game.prototype.remove = function (obj) {
    if(obj instanceof Asteroids.Asteroid) {
      this.asteroids = this.asteroids.filter(function (this_asteroid) {
        return this_asteroid !== obj;
      });
    } else if (obj instanceof Asteroids.Bullet) {
      this.bullets = this.bullets.filter(function (this_bullet) {
        return this_bullet !== obj;
      });
    }
    obj.explode(this._ctx, function () {
      setTimeout(function () {
        delete obj;
      }, 0);
    });
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (Math.max(pos[0], 0) == 0 ||
      Math.min(pos[0], Game.DIM_X) == Game.DIM_X) ||
      (Math.max(pos[1], 0) == 0 ||
      Math.min(pos[1], Game.DIM_Y) == Game.DIM_Y);
  };

  Game.prototype.winSize = function () {
    return (Game.DIM_X * Game.DIM_Y) / (1000 * 1000);
  };

  Game.prototype.toggleDiag = function (code) {
    switch (code) {
      case "WEB":
        this._diag.drawLines = !this._diag.drawLines;
        break;
      case "PAUSE":
        this._diag.pause = !this._diag.pause;
        this._diag.erase *= this._diag.pause ? 0.125 : 8;
        break;
      case "SMEAR":
        this._diag.erase =  this._diag.pause ? this._diag.pause : (this._diag.erase <= 1) * (this._diag.erase + 0.01 * (this._diag.erase < 0.1) + 0.2 * (this._diag.erase >= 0.1));
        break;
      case "GRAV":
        this._diag.gravity = !this._diag.pause ? this._diag.gravity : ((this._diag.gravity + 1) % 13) - 13 * (this._diag.gravity >= 10);
        break;
      default:

    }
  };

})();
