'use strict';

const async = require('./asyncc.js');


async.waterfall([
    function(next) {
        try {
            console.log('start')
            next(null, 'one', 'two')
            next(null, 'one', 'two')    //禁止调用2次
        } catch(err) {
            next(err)
        }
    },
    function(arg1, arg2, next) {
        console.log(arg1)
        console.log(arg2)
        next(null, 'three')
    },
    function(arg1, next) {
        try {
            console.log(arg1)
            next(null, 'done')
        } catch (err) {
            next(err)
        }
    }
], function(err, result) {
    err? console.log('错误:' + err): '';
    result? console.log('完成结果:' + result) : '';
})


