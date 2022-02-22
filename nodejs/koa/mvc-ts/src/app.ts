import Koa from 'koa'
import { Loader } from './loader'

const app = new Koa;
const loader = new Loader(app);

// 修改context的原型
app.context.extends = 1;

app.use(loader.loadRouter())

app.listen(3300, '0.0.0.0', () => {
    console.log('Server runing at 0.0.0.0:3300')
})
