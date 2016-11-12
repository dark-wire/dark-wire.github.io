'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bounds = {
  height: window.innerHeight,
  width: window.innerWidth
};

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

canvas.height = Bounds.height;
canvas.width = Bounds.width;
document.body.appendChild(canvas);

var Shred = function () {
  function Shred(center, radius, color, angle) {
    var direction = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];

    _classCallCheck(this, Shred);

    this.center = center;
    this.targetedRadius = radius;
    this.radius = 0;
    this.angle = angle;
    this.color = color;
    this.direction = direction;
  }

  Shred.prototype.render = function render() {
    this.radius += (this.targetedRadius - this.radius) * 0.1;
    this.angle += this.direction * Math.PI / 96;
    this.position = 25 * Math.cos(this.angle);
    var c1 = new Circle({ x: this.center.x - this.position, y: this.center.y + this.radius * Math.sin(this.angle) }, (Math.cos(this.angle) + 1) / 0.5, this.color, -this.angle);
    var c2 = new Circle({ x: this.center.x + this.position, y: this.center.y - this.radius * Math.sin(this.angle) }, (Math.cos(this.angle) + 1) / 0.5, this.color, this.angle);
    var link = new Line(c1.center, c2.center);
    link.render();
    c1.render();
    c2.render();
  };

  return Shred;
}();

var Circle = function () {
  function Circle(center, radius, color, angle) {
    _classCallCheck(this, Circle);

    this.center = center;
    this.radius = 2 + radius;
    this.color = color;
    this.angle = angle;
  }

  Circle.prototype.render = function render() {
    context.beginPath();
    context.fillStyle = 'HSLA(' + this.color.hue + ', ' + this.color.saturation + '%, ' + this.color.lightness + '%, ' + this.color.alpha + ')';
    context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    context.arc(this.center.x + 80 * Math.cos(this.angle), this.center.y + 80 * Math.sin(this.angle), 2, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  };

  return Circle;
}();

var Line = function () {
  function Line(p1, p2) {
    _classCallCheck(this, Line);

    this.p1 = p1;
    this.p2 = p2;
  }

  Line.prototype.render = function render() {
    context.beginPath();
    context.moveTo(this.p1.x, this.p1.y);
    context.lineTo(this.p2.x, this.p2.y);
    context.strokeStyle = '#BFBFBF';
    context.stroke();
    context.closePath();
  };

  return Line;
}();

var shreds = [new Shred({ x: canvas.width / 2 - 125, y: canvas.height / 2 }, 80, { hue: 215, saturation: 99, lightness: 61, alpha: 1 }, 0), new Shred({ x: canvas.width / 2 - 75, y: canvas.height / 2 }, 80, { hue: 335, saturation: 99, lightness: 61, alpha: 1 }, 0, -1), new Shred({ x: canvas.width / 2 - 25, y: canvas.height / 2 }, 80, { hue: 48, saturation: 99, lightness: 50, alpha: 1 }, 0), new Shred({ x: canvas.width / 2 + 25, y: canvas.height / 2 }, 80, { hue: 48, saturation: 99, lightness: 50, alpha: 1 }, 0, -1), new Shred({ x: canvas.width / 2 + 75, y: canvas.height / 2 }, 80, { hue: 335, saturation: 99, lightness: 61, alpha: 1 }, 0), new Shred({ x: canvas.width / 2 + 125, y: canvas.height / 2 }, 80, { hue: 215, saturation: 99, lightness: 61, alpha: 1 }, 0, -1)];
function loop() {
  context.clearRect(0, 0, Bounds.width, Bounds.height);
  shreds.forEach(function (shred) {
    return shred.render();
  });
  requestAnimationFrame(loop);
}

loop();

window.onresize = function () {
  Bounds.width = window.innerWidth;
  Bounds.height = window.innerHeight;
  canvas.width = Bounds.width;
  canvas.height = Bounds.height;
};