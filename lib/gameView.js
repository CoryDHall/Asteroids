(function () {
  window.Asteroids = window.Asteroids || {};

  var GameView = window.Asteroids.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    this.bindKeyHandlers();
    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = 'lib/850241_1280x720.jpg';
    window.setInterval(function () {
      this.game.step();
      ctx.clearRect(0, 0, window.Asteroids.Game.DIM_X, window.Asteroids.Game.DIM_Y);
      ctx.drawImage(img, 0, 0);
      this.game.draw(this.ctx);
    },1000 / 60);
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

})();
