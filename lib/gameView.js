(function () {
  Asteroids = window.Asteroids || {};

  var GameView = Asteroids.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.psuedoKeys = [];
    this.$overlay = $('asteroids-overlay');
    // ctx.globalCompositeOperation = "";
  };

  GameView.prototype.start = function () {
    // this.bindKeyHandlers();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, Asteroids.Game.DIM_X, Asteroids.Game.DIM_Y);
    $('body').on("tap", function (e) {
      e.preventDefault();
      this.psuedoKeys = this.psuedoKeys.concat([32]);
    }.bind(this));
    $('body').on("vmouseup", function (e) {
      e.preventDefault();
      this.psuedoKeys = [];
    }.bind(this));

    $('body').on("swipeleft", function (e) {
      e.preventDefault();
      this.psuedoKeys = this.psuedoKeys.concat([80]);
    }.bind(this));
    $('body').on("swiperight", function (e) {
      e.preventDefault();
      this.psuedoKeys = this.psuedoKeys.concat([88]);
    }.bind(this));
    // $('body').on("touchend", function (e) {
    //   e.preventDefault();
    //   this.psuedoKeys = [];
    // }.bind(this));
    // setInterval(function () {
    //   this.pressedKeys();
    // }.bind(this),1000 / 240);

    // window.setInterval(function () {
    // }.bind(this),1000 / 120);

    // this.game.step();
    this.game.draw(this.ctx, this.$overlay);
    // window.setTimeout(function () {
    // }.bind(this), 1000 / 120);
    this.pressedKeys();
  };

  GameView.prototype.bindKeyHandlers = function () {
    key('x', function () {
      this.game.toggleDiag("SMEAR");
    }.bind(this));
  };

    var throttle = 0, oldTime = new Date();
  GameView.prototype.pressedKeys = function () {
    var pKeys = key.getPressedKeyCodes().concat(this.psuedoKeys);
    this.psuedoKeys = [];
    var ship = this.game.ship;
    // console.log(pKeys);
    var newTime = new Date();
    pKeys.forEach(function (pKey) {
      switch (pKey) {
      case 32:
        ship.fireBullet();
        break;
      case 37:
        ship.power([-1,0]);
        break;
      case 38:
        ship.power([0,-1]);
        break;
      case 39:
        ship.power([1,0]);
        break;
      case 40:
        ship.power([0,1]);
        break;
      case 75:
        if (throttle > 200) {
          this.game.toggleDiag("GRAV");
          oldTime = newTime;
        }
        break;
      case 80:
        if (throttle > 500) {
          this.game.toggleDiag("PAUSE");
          oldTime = newTime;
        }
        break;
      case 87:
        if (throttle > 300) {
          this.game.toggleDiag("WEB");
          oldTime = newTime;
        }
        break;
      case 88:
        if (throttle > 120) {
          this.game.toggleDiag("SMEAR");
          oldTime = newTime;
        }
        break;
      case 70:
        if (throttle > 100) {
          this.game.toggleDiag("DENSE");
          oldTime = newTime;
        }
        break;
      }
      throttle = newTime - oldTime;
    });
    requestAnimationFrame(this.pressedKeys.bind(this));
  };

})();
