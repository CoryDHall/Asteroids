(function () {
  window.Asteroids = window.Asteroids || {};

  var Asteroid = window.Asteroids.Asteroid = function(position) {
    var options = {
      color: Asteroid.COLOR,
      radius: Asteroid.RADIUS,
      pos: position,
      vel: window.Asteroids.Util.prototype.randomVec(5)
    };
    // console.log(options);
    window.Asteroids.MovingObject.call(this, options);
  };
  window.Asteroids.Util.prototype.inherits(Asteroid, window.Asteroids.MovingObject);

  Asteroid.COLOR = "#222";
  Asteroid.RADIUS = 10;

  // var MovingObject = window.Asteroids.MovingObject = function(options) {
  //   this.pos =      options.pos;
  //   this.vel =      options.vel;
  //   this.radius =   options.radius;
  //   this.color =    options.color;
  // };


})();
