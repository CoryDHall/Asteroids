(function () {
  window.Asteroids = window.Asteroids || {};

  var GameView = window.Asteroids.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    this.bindKeyHandlers();
    window.setInterval(function () {
      this.game.step();
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
  };

})();
