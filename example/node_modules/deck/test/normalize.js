var deck = require('deck');
var assert = require('assert');
var eql = assert.deepEqual;

exports.normalize = function () {
    eql(
        deck.normalize({ a : 1, b : 3, c : 4 }),
        { a : 0.125, b : 0.375, c : 0.5 }
    );
    
    var t = 0.1 + 0.2 + 0.05;
    eql(
        deck.normalize({ a : 0.1, b : 0.2, c : 0.05 }),
        { a : 0.1 / t, b : 0.2 / t, c : 0.05 / t }
    );
    
    assert.throws(function () {
        deck.normalize({ a : 0.1, b : 0.2, c : [] });
    });
};
