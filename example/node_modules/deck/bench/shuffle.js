var shuffle = require('../').shuffle;
var xs = [];
for (var i = 0; i < 1e5; i++) {
    xs.push(Math.floor(Math.random() * 1e3));
}

var t0 = Date.now();
shuffle(xs);
var elapsed = Date.now() - t0;
console.log(elapsed);
