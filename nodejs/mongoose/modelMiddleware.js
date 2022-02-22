var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

//===============自递增序号====================
var _i = 0;
var s = { q: _i };
Object.defineProperty(s, 'q', {
  get: function () {
    _i++;
    return '\n#' + _i + '# ';
  }
})
//===================================
var db = mongoose.connection;
db.on('error', console.error.bind(console, '链接错误'))
db.once('open', function () {
  console.log('opening')
})

var PersonSchema = new mongoose.Schema({
  name: String,
  age: Number,
  company: String
})


/**
 * # Middleware
 * 支持 对象及它们的方法
 * ## document  (middleware fun中, this=>doc)
 * 1. init
 * 2. validate
 * 3. save
 * 4. remove
 * ## Query   (this=>query)
 * 1. count
 * 2. find
 * 3. findOne
 * 4. findOneAndRemove
 * 5. findOneAndUpdate
 * 6. update
 * ## Aggregate (this=>aggregation obj)
 * 1. aggregate
 * ## Model     (this=>model)
 * 1. insertMany
 *
 *
 * # Middle Function
 * 1. Pre
 * 2. Serial
 * 3. Parallel
 * 4.
 */


PersonSchema
  .pre('find', function() {
    console.log(s.q + 'pre(find) MIDDLEWARE')
  })
  .post('find', function(res) {
    console.log(s.q + 'post(find) MIDDLEWARE', res[0]);
  })
  // parallel模式: 虽然异步不阻塞其他中间件, 但最终save的回调还是要等待异步done()之后才执行;
  .pre('save', true, function(next, done) { //'true' 表示异步并行执行
    console.log(s.q + 'pre save - parallel')
    next();
    setTimeout(function(){
      console.log('async done')
      done()
    }, 5000);
  })
  .pre('save', function(next) {
    console.log(s.q + 'pre save - serial');
    next()
  })
  // err一经被传递下去, 后面的中间件将停止运行, 直接跳到save的回调; 但是不会阻止前面中间件已经发生的异步
  .pre('save', function(next) {
    var err = new Error('something went wrong');
    next(err)
  })
  .pre('save', function (next) {
    console.log('this is last one')
    next()
  })
var PersonModel = db.model('Person', PersonSchema);

var personEntity = new PersonModel({
  name: 'father',
  age: 63,
  company: 'ABC'
})
personEntity.save(function (err, person) {
  if (err) {console.log(err);return false;}
  console.log('saved')
});
PersonModel.find(function (err, persons) {
  console.log(s.q + 'PersonModel: ', persons)
});
