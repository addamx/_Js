const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const app = new Koa();

const templating = require('./templating.js');


const isProduction = process.env.NODE_ENV === 'production';

console.log(process.env.NODE_ENV);

// l记录URL以及页面执行时:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});


// 静态文件
if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// 解析 POST
app.use(bodyParser());


// 给ctx加上render()来使用Nunjuck

app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));


// 处理URL路由
app.use(controller());


// listen port
app.listen(8099);
console.log('app started at port 8099...');