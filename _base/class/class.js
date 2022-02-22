const private = Symbol('private');

//定义类 
//默认严格模式
class Person {
  constructor(x, y) {

    this.x = x;
    this.y = y;
    //constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
    //return Object.create(null);

    //除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上.
    //方法一般要绑定this
    this.printName = this.printName.bind(this);

    //内部可以使用类名以指代当前类
    //Person

    //new.target 属性. 
    //1.如果构造函数不是通过new命令调用的，new.target会返回undefined
    if (new.target !== undefined) {
      this.name = name;
    } else {
      throw new Error('必须使用 new 命令生成实例');
    }
    //2. target就是当前类名, 那就是new创建的
    //if (new.target !== Person) {} else{thrrow new Error('')}

  }

  // 公有方法
  printName() {
    return '(' + this.x + ', ' + this.y + ')';
  }

  //私有方法  Symbol值导致第三方无法获取到它们
  [private]() {
    return 'private outcome';
  }


  //同ES5: 取值函数（getter）和存值函数（setter）
  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }

  //表示该方法是一个 Generator 函数。
  *[Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }

  //静态方法
  static classMethod() {
    return 'hello';
  }
}



let person = new Person(1, 2);



console.log(

//Class可以理解为构造函数的语法糖
typeof Person, // "function"  
Person === Person.prototype.constructor, // true

'\n',

//类的内部所有定义的方法，都是不可枚举的（non-enumerable）/自有属性。这一点与 ES5 的行为不一致。
Object.keys(Person.prototype), // []
Object.getOwnPropertyNames(Person.prototype),

'\n',

person.getClassName(), //获得类名

)





/**
 * 继承
 */
class Interface {
  constructor() {
    if (new.target === Interface) {
      throw new Error('本类不能实例化,只能被继承或者直接调用类属性/方法');
    }
  }
}

class Father  {
  constructor(length, width) {
    console.log(new.target.name);
    // ...
  }
}
class Son extends Father {
  constructor() {
    //super表示父类, super()表示执行父类的contructor函数以初始化
    super();
  }
}

new Father() // Father
//new.target指向当前正在执行的函数。可以看到，在super()执行时，它指向的是子类Son的构造函数，而不是父类Fater的构造函数。也就是说，super()内部的this指向的是Son。
//因此super()相当于A.prototype.constructor.call(this, ...argus)。
new Son() // Son


Son.__proto__ === Father // true
Son.prototype.__proto__ === Father.prototype // true

// ES5 的继承
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);  //B.prototype.__proto__ = A.prototype;

// B 的实例继承 A 的静态属性
Object.setPrototypeOf(B, A);  //B.__proto__ = A;



