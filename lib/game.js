(function () {
  Asteroids = window.Asteroids || {};

  var Game = Asteroids.Game = function(dimX, dimY) {
    Game.DIM_X = dimX || Game.DIM_X;
    Game.DIM_Y = dimY || Game.DIM_Y;
    Asteroids.MovingObject.prototype.MIN_RADIUS = dimX * dimY / 8000000;
    this._currentAsteroids = [];
    this.bullets = [];
    this.asteroids = [];
    this.round = 0;
    this.addingAsteroids = true;
    // this.addAsteroids();
    this.addShip();
    this.bossbeaten = this.gTime = this.oldTime = new Date();
    this._diag = {
      drawLines: false,
      erase: 0.2,
      pause: false,
      start: true,
      gravity: 2
    };
    this.MIN_FRAME_RATE = 1000 / 15;
    setInterval(function () {
      if (this.addingAsteroids) {
        if (Math.random() < (0.5 + 1 / (Asteroids.Asteroid.RADIUS >> 1))) {

          var bigAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
          bigAsteroid.radius *= 2 + (3 * Math.random());
          var newAsteroid = bigAsteroid;
          this.add(newAsteroid);
          newAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
        } else {
          var newAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
        }
        newAsteroid.density = this.ship.density / (Game.NUM_ASTEROIDS * ((this.round * 100) || 1));
        this.add(newAsteroid);
        // Asteroids.Asteroid.RADIUS += newAsteroid.MIN_RADIUS / 4;
        this.addingAsteroids = this.asteroids.length < Game.NUM_ASTEROIDS;
        return;
      }
      // Asteroids.Asteroid.RADIUS = 10;
    }.bind(this), 500 / Game.NUM_ASTEROIDS);
  };


  Game.DIM_X = 1280;
  Game.DIM_Y = 720;
  Game.NUM_ASTEROIDS = 3;
  Game.ROUND_NEXT = 3;
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
      var hue = +findHue.exec(this._fillColor)[0];
      var light = +findLight.exec(this._fillColor)[0].replace(/[%,]/g, '');
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
    var x_pos = (Math.random() * Game.DIM_X) | 0;
    var y_pos = (Math.random() * Game.DIM_Y) | 0;

    return Math.random() > 0.5 ? [x_pos, 0] : [0, y_pos];
  };

  Game.prototype.draw = function(ctx, $overlay, callback) {
    this.ctx = ctx;
    this._diag.pause = this._diag.pause || this._diag.start;
    callback && callback();
    this._ctx = ctx;
    this.oldTime = this.gTime;
    this.gTime = new Date();

    ctx.fillStyle = this.getFillColor();
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
    if (this._diag.drawLines) {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "hsla(0, 0%, 10%, 0.9)";
      ctx.lineWidth = 10;
      ctx.setLineDash([5, 40]);
      ctx.beginPath();
      this.allObjects().forEach(function (object) {
          object.drawLines(ctx);
      });
      ctx.stroke();
      ctx.closePath();
      ctx.setLineDash([]);
      ctx.globalCompositeOperation = "source-over";
    }
    var shipMass = this.ship._mass;
    $overlay.text("Mass: " + (shipMass + "").match(/-*\d+/));
    $overlay.append("<br>Asteroids Absorbed: " + (this.ship.absorbed.length - 1));
    $overlay.append("<br>Asteroids Left: " + this.asteroids.length);
    $overlay.append("<br>Current Gravity: x" + (this._diag.gravity / 2));
    if (this._diag.pause) {
      $overlay.append("<br>");
      $p = $('<p>');
      if (this._diag.start) {
        $('<h2>').append("Push Space or Tap to start").appendTo($p);
      } else {
        $('<h2>').append("Paused").appendTo($p);
      }
      $('<section>')
        .append("<h2 id=\"-game-objective\">+ Game Objective</h2><p>The goal is to accumulate mass. If your ship has sufficient mass, the asteroid will be absorbed; otherwise, the asteroid will take mass from you. «The game is over when your ship has no mass left»[<strong>Not implemented</strong>]. The ship can shoot lasers to break apart particularly heavy asteroids. Every round the asteroids become progressively heavier. Once your ship reaches &#39;critical mass&#39;, your task is to shoot any orbiting asteroids.</p>\n<h2 id=\"-controls\">+ Controls</h2>\n<ul>\n<li>Movement is controlled with the arrow keys or tilting your device [if viewing on mobile]</li>\n<li>Use [space] to shoot [tap]</li>\n<li>Press [p] to pause [swipe left]</li>\n<li>Press [x] to change the length of the tails [swipe right]</li>\n<li>Press [k] to alter gravity [tap while paused]</li>\n<li>Press [w] to get help [desktop only]</li></ul>")
        .appendTo($p);
      $p.appendTo($overlay);
      if (!$overlay.hasClass("paused")) {
        $overlay.addClass("paused");
        $("#game-canvas").addClass("paused");
      }
    } else {
      if ($overlay.hasClass("paused")) {
        $overlay.attr("class", "");
        $("#game-canvas").attr("class", "");
      }
    }
    // setTimeout(this.step.bind(this), 0);
    requestAnimationFrame(this.step.bind(this));
    requestAnimationFrame(this.draw.bind(this, ctx, $overlay, callback));
  };

  Game.prototype.moveObjects = function(ctx) {
    if (this.gTime - this.oldTime > this.MIN_FRAME_RATE) {
      // this.oldTime = this.gTime;
      // return;
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
      this._handleCollision(objects, this.ship, idx, object1, -1);
      var collided = objects.slice(idx + 1).every(
        this._handleCollision.bind(this, objects, object1, idx)
      );
      if (!collided) { object1.lastCollidedObject = object1; }
    }.bind(this));
  };

  Game.prototype._handleCollision = function (objArr, obj1, idx1, obj2, idx2) {
    if (obj1.isCollidedWith(obj2)) {
      obj1.collideWith(obj2);
      objArr.splice(idx1 + 1 + idx2, 1);
      return false;
    }
    return true;
  };

  Game.prototype.step = function () {
    if (this.gTime - this.oldTime > this.MIN_FRAME_RATE * 2 || this._diag.pause) {
      this.oldTime = this.gTime;
      return;
    }
    this.checkCollisions();
    requestAnimationFrame(this.moveObjects.bind(this));
    if (this.gTime - this.bossbeaten > 30000) {
      this.addBoss();
    }
    if (this.roundOver() && !this.ship.dead) {
      // Asteroids.Asteroid.BASE_DENSITY *= 1.2;
      this.ship.levelUp();
      this.addBoss();
      this.round++;
      this.addingAsteroids = true;
    }
  };

  Game.prototype.addBoss = function () {
    this.round -= 2;
    var bigAsteroid = new Asteroids.Asteroid(this.randomPosition(), this);
    bigAsteroid.density = this.ship.density;
    bigAsteroid.radius = this.ship.radius * Math.SQRT2;
    this.add(bigAsteroid);
    var color = bigAsteroid.getColor();
    bigAsteroid.color = color;
    this.round += 2;
    bigAsteroid.getColor = Asteroids.MovingObject.prototype.getColor;
    this.tempFillColor(color.replace(/\d+%\)/, '50%,').replace(/sl/, 'sla'));
    this.bossbeaten = this.gTime;
  };

  Game.prototype.roundOver = function () {
    return !this.addingAsteroids &&
      this.asteroids.length <= Game.ROUND_NEXT;
  };

  Game.prototype.remove = function (obj) {
    var getRidOfObj = this._notSame.bind(this, obj);

    if(obj instanceof Asteroids.Asteroid) {
      this.asteroids = this.asteroids.filter(getRidOfObj);
    } else if (obj instanceof Asteroids.Bullet) {
      this.bullets = this.bullets.filter(getRidOfObj);
    } else if (obj instanceof Asteroids.Ship) {
      obj.explode(
        this._ctx,
        this._doAfter(
          this.addShip.bind(this)
        )
      );
      return;
    }
    obj.explode(
      this._ctx,
      this._doAfter(
        this._delete.bind(this, obj)
      )
    );
  };

  Game.prototype._notSame = function (obj1, obj2) {
    return obj1 !== obj2;
  };

  Game.prototype._delete = function (obj) {
    delete obj;
  };

  Game.prototype._doAfter = function (callback) {
    setTimeout(callback, 0);
  };
  var max = Math.max;
  var min = Math.min;
  Game.prototype.isOutOfBounds = function (pos) {
    return (max(pos[0], 0) == 0 ||
      min(pos[0], Game.DIM_X) == Game.DIM_X) ||
      (max(pos[1], 0) == 0 ||
      min(pos[1], Game.DIM_Y) == Game.DIM_Y);
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

  Game.prototype.isPaused = function () {
    return this._diag.pause;
  };

})();
