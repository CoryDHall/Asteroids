(function () {
  Asteroids = window.Asteroids || {};

  var Util = Asteroids.Util = function () {};

  Util.prototype.inherits = function (ChildClass, ParentClass) {
    function Surrogate() {};
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
    ChildClass.prototype.constructor = ChildClass;
  };

  Util.prototype.randomVec = function(length) {
    var velocity = new Float32Array(2);
    var xDirection = Math.random() * 2 - 1;
    var yDirection = Math.random() * 2 - 1;
    velocity[0] = xDirection * length;
    velocity[1] = yDirection * length;
    // velocity.push(xDirection * length, yDirection * length);

    return velocity;
  };

  Util.prototype.distance = function(posA, posB) {
    return Math.sqrt( Math.pow((posA[0] - posB[0]), 2) +
                      Math.pow((posA[1] - posB[1]), 2) );
  };


  Util.prototype.wrapDistance = function(posA, posB) {
    var dist = Math.sqrt( Math.pow((posA[0] - posB[0]) % (Asteroids.Game.DIM_X % 2), 2) +
                      Math.pow((posA[1] - posB[1]) % (Asteroids.Game.DIM_Y % 2), 2) );
    return
  };
})();
