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
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, Asteroids.Game.DIM_X, Asteroids.Game.DIM_Y);
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
    setInterval(function () {
      this.pressedKeys();
    }.bind(this),1000 / 240);

    window.setInterval(function () {
      this.game.step();
    }.bind(this),1000 / 60);

    window.setInterval(function () {
      this.game.draw(this.ctx);
    }.bind(this), 1000 / 60);
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
      case 87:
        if (throttle === 0) {
          this.game.toggleDiag("WEB");
          throttle = 100;
        }
        break;
      case 88:
        if (throttle === 0) {
          this.game.toggleDiag("SMEAR");
          throttle = 120;
        }
        break;
      case 70:
        if (throttle === 0) {
          this.game.toggleDiag("DENSE");
          throttle = 100;
        }
        break;
      }
      throttle -= (throttle > 0);
    });
  };

})();
