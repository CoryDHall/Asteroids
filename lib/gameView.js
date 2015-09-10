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
    $('body').on("vmousedown", function (e) {
      e.preventDefault();
      this.psuedoKeys = [32];
    }.bind(this));
    $('body').on("vmouseup", function (e) {
      e.preventDefault();
      this.psuedoKeys = [];
    }.bind(this));

    $('body').on("taphold", function (e) {
      e.preventDefault();
      this.psuedoKeys = this.psuedoKeys.concat([88]);
    }.bind(this))
    // $('body').on("touchstart", function (e) {
    //   e.preventDefault();
    //   this.psuedoKeys = [32];
    // }.bind(this));
    // $('body').on("touchend", function (e) {
    //   e.preventDefault();
    //   this.psuedoKeys = [];
    // }.bind(this));
    window.setInterval(function () {
      this.pressedKeys();
      window.setTimeout(function () {
        this.game.step();
        this.game.draw(this.ctx);
      }, 0);
    }.bind(this),1000 / 240);
  };

  GameView.prototype.bindKeyHandlers = function () {
    key('x', function () {
      this.game.toggleDiag("SMEAR");
    }.bind(this));
  };

    var throttle = 0;
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
      case 91:
        if (throttle === 0) {
          this.game.toggleDiag("WEB");
          throttle = 100;
        } else {
          throttle--;
        }
        break;
      case 88:
        if (throttle === 0) {
          this.game.toggleDiag("SMEAR");
          throttle = 100;
        } else {
          throttle--;
        }
        break;
      }
    });
  };

})();
