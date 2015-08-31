(function () {
  window.Asteroids = window.Asteroids || {};

  var Util = window.Asteroids.Util = function () {};

  Util.prototype.inherits = function (ChildClass, ParentClass) {
    function Surrogate() {};
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  Util.prototype.randomVec = function(length) {
    var velocity = [];
    var xDirection = Math.random() * 2 - 1;
    var yDirection = Math.random() * 2 - 1;
    velocity.push(xDirection * length, yDirection * length);

    return velocity;
  };

  Util.prototype.distance = function(posA, posB) {
    return Math.sqrt( Math.pow((posA[0] - posB[0]), 2) +
                      Math.pow((posA[1] - posB[1]), 2) );
  };

})();
