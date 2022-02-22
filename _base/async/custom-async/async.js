
function noop() {}

//创建闭包, 保存函数调用过的信息
function onlyOnce(cb) {
    let flag =false;
    return (...args) => {
        if(flag) {
            return cb(new Error('cb already called'))
        }
        cb.apply(null, args);
        flag = true;
    }
}



exports.waterfall = function (task = [], callback = noop) {
    if (!Array.isArray(task)) {
        return callback(new Error('task should be a function'))
    }

    (function next(...args){
        // 第一个参数正常应该是null, 如果字符串则是错误信息(例子中try catch 并 next(err)), 这里抛出错误.
        if(args[0]) {
            return callback(args[0])
        }

        if (task.length) {
            let fn = task.shift();
            fn.apply(null, [...args.slice(1), onlyOnce(next)]);
        } else {
            callback.apply(null, args);
        }
    })();
}



exports.each = function (items = [], iterator, callback = noop) {
    if (!Array.isArray(items)) {
        return callback(new Error('items should be an Array!'));
    }
    if (typeof iterator != 'function') {
        return callback(new Error('iterator should be a function!'));
    }

    let completed = 0;

    function next(err) {
        if(err) {
            return callback(err);
        }

        if (++completed >= items.length) {
            callback();
        }
    }

    items.map((item) => iterator(item, next));
}



exports.eachLimit = function (items = [], limit = 1, iterator, callback = nop) {
    if (!Array.isArray(items)) {
        return callback(new Error('items should be an Array!'));
    }
    if (typeof iterator != 'function') {
        return callback(new Error('iterator should be a function!'));
    }

    let done = false;
    let running = 0;
    let errored = false;
    
    (function next() {
        if (done && running <= 0) {
            return callback
        }

        while (running < limit && !errored) {
            let item = items.shift()
            running++;
            if (item === undefined) {
                done = true;
                if (running <= 0) {
                    callback();
                }
                return;
            }
            iterator(item, (err) => {
                running--;
                if (err) {
                    errored = true;
                    return callback(err);
                }
                next();
            })
        }
    })();
}


exports.wishlist = function (test, iterator, callback = noop) {
    if (typeof test != 'function') {
        return callback(new Error('test should be a function!'));
    }
    if (typeof iterator != 'function') {
        return callback(new Error('iterator should be a function!'));
    }

    (function next() {
        if(test()) {
            iterator((err) => {
                if (err) {
                    return callback(err)
                }
                next()
            })
        }
    })()
}