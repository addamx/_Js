'use strict'

const async = require('./async.js');

let count = 0;

async.wishlist(
    function() {return count < 5},
    function(callback) {
        console.log(count++)
        setTimeout(function(){
            callback(null, count)
        }, 1000);
    },
    function(err, n) {
        console.log('over')
    }
)