(function () {
  window.Asteroids = window.Asteroids || {};

  var Ship = window.Asteroids.Ship = function(position, game) {
    var options = {
      color: Ship.COLOR,
      radius: Ship.RADIUS,
      pos: position,
      vel: [0, 0],
      game: game
    };
    window.Asteroids.MovingObject.call(this, options);
  };
  window.Asteroids.Util.prototype.inherits(Ship, window.Asteroids.MovingObject);

  Ship.COLOR = "#E72";
  Ship.RADIUS = 15;

  Ship.prototype.relocate = function () {
    this.pos= window.Asteroids.Game.prototype.randomPosition();
    this.vel = [0,0];
  };

})();
