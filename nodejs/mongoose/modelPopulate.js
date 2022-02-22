/**
 * 《在mongoose中填充外键》
 * http://harttle.land/2016/07/29/mongoose-populate.html
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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




var authorSchema = Schema({
  name: String,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
});
var postSchema = Schema({
  title: String,
  creator: { type: Schema.Types.ObjectId, ref: 'Author'}  //ref 指定外键对应的collection
});


var AuthorModel = mongoose.model('Author', authorSchema);
var PostModel = mongoose.model('Post', postSchema);



// AuthorModel.remove(function(){})
// PostModel.find().remove(function(){})
// PostModel.find().remove().exec();

var Addamx = new AuthorModel({ name: 'Addamx'});//, posts: [post._id]});
var post = new PostModel({title: 'New Hellow World', creator: Addamx._id});


// Addamx.save();
post.save();
AuthorModel.update(
  {name: 'Addamx'},
  {
    $push: {
      posts: post._id
    }
  },
  { multi: true },
  function(err, user){
    console.log(user)
  }
)

PostModel
  .find()
  //.populate('creator')    //根据外键返回的是该creator完整的doc
  .populate('creator', 'name')  //第二个参数指定除了外键值外的field
  // .populate({           //populate中可以定义过滤器
  //   path: 'creator',
  //   match: {name: {$in: ['Addamx']}},
  //   select: 'name',
  //   options: {limit: 1}
  // })
  .exec(function(err, post) {
    if (err) throw err;
    console.log(s.q + post);
  });

AuthorModel
  .find({name: 'Addamx'})
  .populate({           //populate中可以定义过滤器
    path: 'posts',
    select: 'title',
    options: { limit: 10 }
  })
  .exec(function(err, author) {
    if (err) throw err;
    console.log(s.q + author);
  })
