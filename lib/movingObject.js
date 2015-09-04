(function() {
  window.Asteroids = window.Asteroids || {};
  var MovingObject = window.Asteroids.MovingObject = function(options) {
    this.pos =      options.pos;
    this.vel =      options.vel;
    this.radius =   options.radius;
    this.color =    options.color;
    this.game =     options.game;
    this.accel =    [1, 1] || options.accel;
  };
  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();


    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();
  };
  MovingObject.prototype.isWrappable = true;

  MovingObject.prototype.move = function () {
    this.vel[0] *= this.accel[0];
    this.vel[1] *= this.accel[1];

    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];


    if( this.game.isOutOfBounds(this.pos) ) {
      if( this.isWrappable) {
        this.pos = window.Asteroids.Game.prototype.wrap(this.pos);
      } else {
        this.game.remove(this);
      }
    }

  };

  MovingObject.prototype.dVel = function () {
    return [this.vel[0] / Math.abs(this.vel[0]),
            this.vel[1] / Math.abs(this.vel[1])];
  };

  MovingObject.prototype.isCollidedWith = function(otherObj) {
    var distanceBetween = window.Asteroids.Util.prototype.distance(this.pos, otherObj.pos);
    return distanceBetween < (this.radius + otherObj.radius);
  };

  MovingObject.prototype.collideWith = function(otherObj) {
    // this.game.remove(otherObj);
    // this.game.remove(this);
  };

})();
