var deck = require('deck');
var assert = require('assert');
var eql = assert.deepEqual;

function picker (fn) {
    var xs = [0,1,2,3,4,5,6,7,8,9];
    var counts = {};
    var loops = 50000;
    
    for (var i = 0; i < loops; i++) {
        var x = fn(xs);
        counts[x] = (counts[x] || 0) + 1;
    }
    eql(Object.keys(counts).sort(), xs);
    eql(xs, [0,1,2,3,4,5,6,7,8,9], 'shuffle mutated its argument');
    
    xs.forEach(function (x) {
        assert.ok(
            counts[x] * xs.length >= loops * 0.95
        );
        
        assert.ok(
            counts[x] * xs.length <= loops * 1.05
        );
    });
}

exports.pick = function () {
    picker(deck.pick);
};

exports.pickObj = function () {
    picker(function (xs) {
        return deck(xs).pick()
    });
};

exports.weightedPick = function () {
    var counts = {};
    var weights = { a : 2, b : 10, c : 1 };
    var total = 2 + 10 + 1;
    var loops = 50000;
    
    for (var i = 0; i < loops; i++) {
        var x = deck.pick(weights);
        counts[x] = (counts[x] || 0) + 1;
    }
    
    eql(Object.keys(counts).sort(), [ 'a', 'b', 'c' ]);
    
    Object.keys(weights).forEach(function (key) {
        assert.ok(
            counts[key] / weights[key] * total >= loops * 0.95
        );
        
        assert.ok(
            counts[key] / weights[key] * total <= loops * 1.05
        );
    });
    
    assert.throws(function () {
        deck.pick({ a : 5, b : 2, c : /moo/ });
    });
};
 
exports.pickEmpty = function () {
    assert.ok(deck.pick([]) === undefined);
    assert.ok(deck.pick({}) === undefined);
};
