'use strict';
/*
请用管理员模式打开
*/

const fs = require('fs')
const async = require('./async.js')
const request = require('request')

let sites = ['www.baidu.com', 'github.com', 'www.npmjs.com', 'www.zhihu.com'];

function downloadFavicon(site, next) {
    let addr = `https://${site}/favicon.ico`;
    let file = `./${site}.ico`;
    request.get(addr)
        .pipe(fs.createWriteStream(file))
        .on('finish', next)
}

async.each(sites, downloadFavicon, function (err) {
    if (err) {
        console.log('Err:', err)
    }
    console.log('over')
})