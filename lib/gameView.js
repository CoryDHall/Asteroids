(function () {
  window.Asteroids = window.Asteroids || {};

  var GameView = window.Asteroids.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.psuedoKeys = [];
    // ctx.globalCompositeOperation = "";
  };

  GameView.prototype.start = function () {
    // this.bindKeyHandlers();
    $('body').on("mousedown", function (e) {
      this.psuedoKeys = [32];
    }.bind(this));
    $('body').on("mouseup", function (e) {
      this.psuedoKeys = [];
    }.bind(this));
    window.setInterval(function () {
      this.pressedKeys();
      window.setTimeout(function () {
        this.game.step();
        this.game.draw(this.ctx);
      }, 0);
    }.bind(this),1000 / 240);
  };

  GameView.prototype.bindKeyHandlers = function () {
    var ship = this.game.ship;
    key('w, up', function () {
      ship.power([0,-1]);
    });
    key('a, left', function () {
      ship.power([-1, 0]);
    });
    key('s, down', function () {
      ship.power([0,1]);
    });
    key('d, right', function () {
      ship.power([1, 0]);
    });
    key('space', function () {
      ship.fireBullet();
    });
  };

  GameView.prototype.pressedKeys = function () {
    var pKeys = key.getPressedKeyCodes().concat(this.psuedoKeys);
    var ship = this.game.ship;

    // console.log(pKeys);
    pKeys.forEach(function (pKey) {
      switch (pKey) {
      case 32:
        ship.fireBullet();
        break;
      case 37:
        ship.power([-.1,0]);
        break;
      case 38:
        ship.power([0,-.1]);
        break;
      case 39:
        ship.power([.1,0]);
        break;
      case 40:
        ship.power([0,.1]);
        break;
      }
    });
  };

})();
