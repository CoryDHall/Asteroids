(function () {
  window.Asteroids = window.Asteroids || {};

  var GameView = window.Asteroids.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    // this.bindKeyHandlers();
    window.setInterval(function () {
      this.pressedKeys();
      this.game.step();
      this.game.draw(this.ctx);
    }.bind(this),1000 / 60);
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
    var pKeys = key.getPressedKeyCodes();
    var ship = this.game.ship;

    console.log(pKeys);
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
