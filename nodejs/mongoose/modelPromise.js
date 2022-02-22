/**
 * mongoose 中的es6 promises对象
 */
var assert = require('assert')
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
var PersonModel = db.model('Person', PersonSchema);

var personEntity = new PersonModel({
  name: 'aa',
  age: 11,
  company: 'cc'
});

/*
var savePromise = personEntity.save();
assert.ok(savePromise instanceof Promise, 'save()返回promise对象');

savePromise.then(function(doc) {
  assert.equal(doc.name, 'aa')
})
*/
var queryPromise = PersonModel.find();
//query 返回的不是promise 对象
assert.ok(!(queryPromise instanceof Promise))
//但可以使用then
queryPromise.then(function(doc){
  console.log(doc[0])
})
// query.exec之后是promise对象
var queryExPromise = queryPromise.exec();
assert.ok(queryExPromise instanceof Promise);
queryExPromise.then(function(doc){
  console.log(doc[0])
});


//可以使用其他promise library
var bluebird = require('bluebird')
// 只改造了save, query.exec;  query方法的返回值仍不会被修改
mongoose.Promise = bluebird;
var queryExPromise = queryPromise.exec();
assert.ok(queryExPromise instanceof bluebird);
assert.equal(queryExPromise.constructor, bluebird);
