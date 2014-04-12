deck
====

Uniform and weighted shuffling and sampling for node.

examples
========

uniform shuffle
---------------

shuffle.js:

    var deck = require('deck');
    var xs = deck.shuffle([ 1, 2, 3, 4 ]);
    console.log(xs);

output:

    $ node shuffle.js 
    [ 1, 4, 2, 3 ]

uniform sample
--------------

pick.js:

    var deck = require('deck');
    var x = deck.pick([ 1, 2, 3, 4 ]);
    console.log(x);

output:

    $ node pick.js 
    2

weighted shuffle
----------------

wshuffle.js:

    var deck = require('deck');
    var xs = deck.shuffle({
        a : 10,
        b : 8,
        c : 2,
        d : 1,
        e : 1,
    });
    console.log(xs);

output:

    $ node wshuffle.js 
    [ 'b', 'a', 'c', 'd', 'e' ]

weighted sample
---------------

wpick.js:

    var deck = require('deck');
    var x = deck.pick({
        a : 10,
        b : 8,
        c : 2,
        d : 1,
        e : 1,
    });
    console.log(x);

output:

    $ node wpick.js 
    a

methods
=======

Note: both `deck(xs).pick()` and `deck.pick(xs)` styles work.

deck.shuffle(xs)
----------------

Return a new shuffled `xs` without mutating the original.

If `xs` is an Array, return a new shuffled Array based on a unifrom
distribution.

Otherwise if `xs` is an object, return a new shuffled Array of `xs`'s visible
keys based on the value weights of `xs`.

deck.pick(xs)
-------------

Sample `xs` without mutating `xs`.

If `xs` is an Array, return a random element from `xs` with a uniform
distribution.

Otherwise if `xs` is an object, return a random key from `xs` biased by its
normalized value.

deck.normalize(xs)
------------------

Return a new `xs` object where the values have been divided by the sum of all
the values such that the sum of all the values in the return object is 1.

If any weights are `< 0` normalize throws an error.

installation
============

With [npm](http://npmjs.org):

    npm install deck
