var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

//===============自递增序号====================
var _i = 0;
var s = {q: _i};
Object.defineProperty(s, 'q', {
  get: function() {
    _i++;
    return '\n#' + _i + '# ';
  }
})
//===================================
var db = mongoose.connection;
db.on('error', console.error.bind(console, '链接错误'))
db.once('open', function(){
  console.log('opening')
})

/**
 * 定义 Scheme
 */
//添加属性
var PersonSchema = new mongoose.Schema({
  name: String,
  age: Number,
  company: String
})





/**
 * 发布 Model
 */
var PersonModel = db.model('Person', PersonSchema);

/**
 * 创建 Entity
 */
var personEntity = new PersonModel({
  name:'Addamx',
  age: 18,
  company: 'google'
});



//before save
PersonModel.find(function(err, persons){
  // console.log(persons)
})
/*
personEntity.save(function(err, person) {
  if(err) return console.error(err);
  console.log(person === personEntity); //true
  console.log(person !== this); //true
  //after save
  PersonModel.find(function(err, persons){
    console.log(persons)
  })
})
*/







/**
 * test
 */

/**
 * # 查询
 */
//##1 带callback + options
PersonModel.findOne(
  {'company': 'google'},
  'name age',   //(不)获取的field, 默认 null; 1. {name: 1}; 2. {company: false}; 3. '-company'
  //{skip: 10},
  function(err, person){
    console.log(s.q + 'Query with callback')
    console.log('%s is %s years old, works in %s', person.name, person.age, person.company); //'company' 不在获取的field, 所以person.company是'undefined'
  }
)
//##2 不带callback [JSON]
PersonModel
  .find({
    name: /add/i,   //(2) new RegExp('add', 'i')
    age: {$gt :14, $lt: 99},
    company: {$in: ['google', 'Tencent']}
  })          //返回query对象
  .limit(2)
  .sort({age: -1})
  .select({name:1}) //如果没有select就默认返回全部field
  .exec(function(err, they){
    console.log(s.q + 'query without cb [json]:')
    console.log(they)
  })
//##3 不带callback [builder]
PersonModel
  .find({ age: { $gt: 14, $lt: 99 }})
  .where('age').gt(10).lt(66)
  .where('company').in(['google', 'Tencent'])
  .where('name').equals('Addamx')
  .limit(1)
  .sort('-age')
  .select('name')
  .exec(function(err, they){
    console.log(s.q + 'query without cb [builder]:')
    console.log(they)
  })
//##4 为query添加chain操作
PersonSchema.query.byName = function(name){
  return this.find({name: new RegExp(name, 'i')});
}
/*
PersonModel.query().byName('amx').exec(......)
*/


/**
 * Query Cursor
 */
PersonModel.find({name: 'Addamx'})
  .cursor()
  .on('data', function(doc){
    //called once for every document
    console.log(s.q + 'cursor DATA: ' + doc)
  })
  .on('end', function(){
    console.log(s.q + 'cursor end!')
  })
  .on('close', function(){
    //called when doen
    console.log(s.q + 'cursor closed!')
  });

var cursor = PersonModel.find({ name: 'Addamx' }).cursor();
cursor.next(function(err, doc) {
  console.log(s.q + 'cursor NEXT: ' + doc);
})  //{....}
cursor.next(function (err, doc) {
  console.log(s.q + 'cursor NEXT: ' + doc);
})  //{....}
cursor.next(function (err, doc) {
  console.log(s.q + 'cursor NEXT: ' + doc);
})  //null

/*
co(function* () {
  const cursor = Thing.find({ name: /^hello/ }).cursor();
  for (let doc = yield cursor.next(); doc != null; doc = yield cursor.next()) {
    console.log(doc);
  }
});
*/

