(function () {
  window.Asteroids = window.Asteroids || {};

  var GameView = window.Asteroids.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    window.setInterval(function () {
      this.game.moveObjects();
      this.game.draw(this.ctx);
    },1000 / 60);
  };
  
})();
