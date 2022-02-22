var immutable = require('immutable');

/**
 * Immutable 的惰性操作
 */
//这里实际没有执行, 只是**声明**
var oddSquares = immutable.Seq.of(1,2,3,4,5,6,7,8)
  .filter(x => {
    console.log('immutable对象执行 filter');
    return x % 2;
  }).map(x => x * x);
//执行, 而且实现只获取1个值, 所以在filter执行3次后就停止;
console.log(oddSquares.get(1));




immutable.Map({name: 'Tom', age: 16});
immutable.List([1,2,3,4,5]);
var immutableData = immutable.fromJS([1,2,3,4,5,6]);
var jsData = immutableData.toJS()

// list or map 大小
immutableData.size;
// or
immutableData.count();


//对象合并
var imA = immutable.fromJS({ a: 1, b: 2 });
var imB = immutable.fromJS({ c: 3 });
var imC = imA.merge(imB); //{a:1,b:2,c:3}


var imD = immutable.fromJS({a: 1, b: [{c:3}]})
console.log(imD.get('b').push(immutable.Map({e:3})))  //返回的是当前的List, 而非整个Map


//对象的合并
const Map1 = immutable.fromJS({a:111,b:222,c:{d:333,e:444}});
const Map2 = immutable.fromJS({a:111,b:222,c:{e:444,f:555}});

const Map3 = Map1.merge(Map2);  //单层合并/替换
 //Map {a:111,b:222,c:{e:444,f:555}}
const Map4 = Map1.mergeDeep(Map2);  //深层合并/替换
 //Map {a:111,b:222,c:{d:333,e:444,f:555}}

 //添加逻辑
const Map5 = Map1.mergeWith((oldData,newData,key)=>{
     if(key === 'a'){
       return 666;
     }else{
       return newData
     }
   },Map2);
 //Map {a:666,b:222,c:{e:444,f:555}}