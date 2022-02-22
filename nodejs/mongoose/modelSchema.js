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

/**
 * 定义 Scheme
 */
//添加属性
var PersonSchema = new mongoose.Schema({
  date: {type: Date, default: Date.now, unique: true},
  name: String,
  age: {dtype: Number, require: true},  //如果没有require且没赋值, 则默认为 undefined
  company: { type: String, lowercase: true},
  mixed: mongoose.Schema.Types.Mixed  //mixed
})
// 注意: 这里的function是运行一次赋值, mixed的值就是return的值, 而不再是该function
// 这里的this默认是`{}`, 不能使用this.name, 不能当作计算属性使用
PersonSchema.path('name').default(function () {
  return 'God'
})
//mixed 可以是任何合法的Js值;
PersonSchema.path('mixed').default('哈哈')



//修改scheme属性的schemaType
//mongoose.Schema.path('name', Number) // changes the schemaType of `name` to Number
mongoose.Schema.pathType('name')  //返回schemaType值: 'String'


//添加虚拟属性 (比起mxied, 更像计算属性, 只是它不会被写入db)
PersonSchema.virtual('introduce').get(function () {
  return this.name + ' is ' + this.age + ' years old.';
})
PersonSchema.virtual('moreyoung').set(function (v) {
  this.age = v - 10;
})

//添加方法
PersonSchema.methods.speak = function (_greeting) {
  var greeting = this.name
    ? "My name is " + this.name
    : "I don't have a name";
  console.log(greeting + ' ' + (_greeting || ''));
}

// Entity的方法
PersonSchema.methods.findSameName = function (cb) {
  return this.model('Person').find({ name: this.name }, cb);
}

//Model的静态方法
PersonSchema.statics.findByName = function (name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
}









var PersonModel = db.model('Person', PersonSchema);
var personEntity = new PersonModel({
  name: 'Addamx',
  age: 18,
  company: 'google'
});
// 使用虚拟属性
console.log(personEntity.introduce);
personEntity.moreyoung = 27;
console.log(personEntity.age);  //17   (27 - 10)






/**
 * test
 */
console.log(personEntity.mixed);  //'哈哈'
//mixed可以随时修改为其他类型
personEntity.mixed = {};
personEntity.mixed.newSub = 'new-Sub';
console.log(personEntity.mixed);  //{ newSub: 'new-Sub' }
// personEntity.speak();
personEntity.findSameName(function (err, him) {
  // console.log('findSameName:')
  // console.log(him)
})
PersonModel.findByName('AMX', function (err, him) {
  // console.log('findByName:')
  // console.log(him)
})












