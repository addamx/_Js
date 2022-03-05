#![allow(dead_code)]
#![allow(unused_variables)]
#![allow(unused_assignments)]
#![allow(unused_mut)]
#![allow(unreachable_patterns)]

use rand::Rng;
use std::{cmp::Ordering, io}; // prelude 预导入模块（内置模块）,如果直接从std开始使用，就不用use来导入 // trait

fn guess_num() {
    println!("猜数！");

    // gen_range 可以返回 i32, u32, i64, f64等，默认是i32，由于后面我们将它与一个u32变量（guess）比较，所以rust认为secret_number应该也是一个u32类型
    let secret_number = rand::thread_rng().gen_range(1, 101);

    println!("神秘数字是:{}", secret_number);

    loop {
        println!("猜测一个数！");

        let mut guess = String::new();

        // io::Result枚举类型 Ok, Err
        // Rust 会提示你去处理Result类型
        // Result 的处理方式，expect 或者 match
        io::stdin().read_line(&mut guess).expect("无法读取行");

        // 同名变量隐藏旧变量，通常用于类型转换
        // 这里的u32是因为parse可以返回多种类型，所以需要《显式的类型标注》，guess:u32, 也可以通过 parse::<u32>()来声明
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            // _ 表示不关心它的变量
            Err(_) => continue,
        };

        println!("你猜测的数是：{}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}

fn variable() {
    let mut x = 5;
    x = 6;

    // 常量
    const MAX_POINTS: u32 = 100_000;

    // 遮蔽
    {
        let x = x * 2;
        println!("The value of x is: {}", x); // 12
    }

    // 直接用下划线或者作为前缀，避免不使用变量时Rust警告
    let _ = 23;
    let _useless_var = 11;
}

fn some_fun(i: String) {}

fn variable_order() {
    let s = String::from("hello");
    let ss = s;
    // s 的拥有权已被转移，无法被使用
    // println!("s value: {}", s);

    // 深拷贝
    let z = ss.clone();

    some_fun(z);
    //String没有Copy trait，所以z的值拥有权被some_fun移走，后续无法再使用
    // println!("z value: {}", z);

    let x = 5;
    // 引用
    // 允许你使用值，但是不获取所有权
    let b = &x;
    assert_eq!(5, x);
    // 解引用
    assert_eq!(5, *b);
    // 函数变量引用
    brorrow_variable(&ss);
    // 可变引用
    let mut sss = String::from("鸡汤来啦");
    change(&mut sss);
    // 同一作用域，同个数据，只能有一个可变引用：
    // 避免数据竞争
    let mut s = String::from("hello");
    let r1 = &mut s;
    // 报错，提示s被借用两次
    let r2 = &mut s;
}

fn brorrow_variable(s: &String) -> usize {
    s.len()
} // 这里，s 离开了作用域。但因为它并不拥有引用值的所有权，
  // 所以什么也不会发生，不会销毁s

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}

fn string_fun() {
    let string = String::from("hello");

    // (1) 创建切片：通过直接引用(deref 隐式强制转换)
    let str0 = &string;
    // (2) 创建切片：rang进行切片
    // 通过rang应用，为 string 创建一个字符串切片 str
    let str = &string[0..2];
    // 0 可省略
    let str = &string[..2];
    // 指到结尾，同[4..s.len()]
    let str = &string[4..];
    // (3) 创建切片
    let str = string.as_str();

    // (1) 创建string
    // 创建一个空String
    let mut s1 = String::new();
    // 将&str类型的"hello,world"添加到s中
    s1.push_str("hello,world");
    // 将字符'!'推入s中
    s1.push('!');

    // (2) 创建string
    let mut s2 = "hello,world".to_string();

    // (3) 创建string
    let mut s3 = String::from("你好,世界");

    // string 组合操作
    let ss1 = String::from("hello,");
    let ss2 = String::from("world!");
    // 在下句中，s1的所有权被转移走了，因此后面不能再使用s1
    // `+`号，实际使用了 `fn add(self, s: &str) -> String {`
    let ss3 = ss1 + &ss2;
}

struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
fn struct_fun() {
    //username 所有权被转移给了 user2，导致了 user1 无法再被使用，但是并不代表 user1 内部的其它字段不能被继续使用
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
    let user2 = User {
        active: user1.active,
        username: user1.username,
        email: String::from("another@example.com"),
        sign_in_count: user1.sign_in_count,
    };
    // user1.active 值被复制，还可以使用
    println!("{}", user1.active);
    // 下面这行会报错，user1.username 所有权被移走了
    // println!("{:?}", user1.username)

    // 元结构体
    struct AlwaysEqual;
    let subject = AlwaysEqual;

    // 我们不关心 AlwaysEqual 的字段数据，只关心它的行为，因此将它声明为元结构体，然后再为它实现某个特征
    // impl SomeTrait for AlwaysEqual {}

    // 结构体的类
    struct Circle {
        x: f64,
        y: f64,
        radius: f64,
    }
    impl Circle {
        // 如果想定义一个构造器，返回实例就行，不一定要用“new”
        fn new(x: f64, y: f64, radius: f64) -> Circle {
            Circle { x, y, radius }
        }
        fn area(&self) -> f64 {
            std::f64::consts::PI * (self.radius * self.radius)
        }
        // 字段和方法可以同名, rust根据有没有括号判断调用字段还是方法
        fn x() {
            println!("x");
        }
    }
    // 函数没有self时，用::调用方法
    let circle1 = Circle::new(7f64, 8f64, 3f64);
    let x_method = Circle::x();
    let area_method = circle1.area();
}

fn enum_fun() {
    // 可以将数据关联在枚举上
    enum PokerCard {
        Base,
        Clubs(u8),
        Spades { x: i32, y: i32 },
        Diamonds(u8, u8),
        Hearts(u8),
    }
    let pk1 = PokerCard::Clubs(2);
    let pk2 = PokerCard::Spades { x: 19, y: 300 };
    let pk3 = PokerCard::Diamonds(20, 255);

    // 结构体也能实现类似效果，但属于同类型
    struct QuitMessage; // 元结构体
    struct MoveMessage {
        x: i32,
        y: i32,
    }
    struct WriteMessage(String); // 元组结构体
    struct ChangeColorMessage(i32, i32, i32); // 元组结构体

    // 处理空值的枚举
    // 无需使用 Option:: 前缀就可直接使用 Some 和 None
    enum Option<T> {
        Some(T),
        None,
    }
    let some_number = Some(5);
    let some_string = Some("a string");
    // 如果使用 None 而不是 Some，需要显示声明类型
    // let absent_number: Option<i32> = None;
    // 其他API
    let s1 = some_number.is_some();
    let s2 = some_number.is_none();
    let x = Some("air");
    assert_eq!(x.unwrap(), "air");

    // 枚举的方法
    impl PokerCard {
        fn call(&self) {
            //
        }
    }
}

fn array_fun() {
    // 声明类型时，第二为长度
    let a: [i32; 5] = [1, 2, 3, 4, 5];
    // 表示 出现了5次的“a”
    let a = ["a"; 5];

    // 数组前片
    let a: [i32; 5] = [1, 2, 3, 4, 5];
    let slice: &[i32] = &a[1..3];
    // 上面的数组切片 slice 的类型是&[i32]，与之对比，数组的类型是[i32;5]

    // 迭代方法
    // for a in &arrays {
    // for n in a.iter() {

    // 这种方式运行时会检查边，性能不如上面，因为上面的方法在编译器就检查过了。
    // for i in 0..a.len() {  // 0..a.len,是一个 Rust 的语法糖
}

#[derive(Debug)]
enum UsState {
    Alabama,
    Alaska,
}
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState), // 25美分硬币
}
fn controll_fun() {
    // match
    fn value_in_cents(coin: Coin) -> u8 {
        match coin {
            Coin::Penny => 1,
            Coin::Quarter(state) => {
                println!("State quarter from {:?}!", state);
                25
            }
            // | 表示或
            Coin::Nickel | Coin::Dime => 33,
            //..= 序列范围
            // 1..=5 => 90,
            // _ 通配符
            _ => 0,
        }
    }
    value_in_cents(Coin::Quarter(UsState::Alabama));

    // if let
    // 相当于只match一个值，其他 `_ => ()`
    let v = Some(3u8);
    if let Some(3) = v {
        println!("three");
    }

    // 宏 !matches
    let foo = 'f';
    assert!(matches!(foo, 'A'..='Z' | 'a'..='z'));
    let bar = Some(4);
    assert!(matches!(bar, Some(x) if x > 2));

    // match 配合 Option
    let arr = [1, 2];
    match arr.get(3) {
        Some(v) => println!("has value:{}", v),
        None => println!("no value!"),
    }
    // Option仅match一个条件时
    if let Some(v) = arr.get(0) {
        println!("value: {}", v);
    }
    // 匹配时提供额外条件 if ...
    let num = Some(4);
    match num {
        Some(x) if x < 5 => println!("has value && less than five {}", x),
        Some(x) => println!("just has value {}", x),
        None => (),
    }
    // @绑定
    enum Message {
        Hello { id: i32 },
    }
    let msg = Message::Hello { id: 5 };
    match msg {
        Message::Hello { id: id_var @ 3..=7 } => {
            println!("Found an id in rand > 3 and <= 7: {}", id_var)
        }
        _ => (),
    }

    // 模式匹配的其他场景
    // 1. while let 条件循环
    let mut stack = Vec::new();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    while let Some(top) = stack.pop() {
        println!("{}", top);
    }
    // 2. for循环
    // iter产生迭代(value)，enumerate转换迭代器为（index, value）
    for (index, value) in vec!['a', 'b', 'c'].iter().enumerate() {
        println!("{} is at index {}", value, index);
    }
    // 3. 解构元组
    let (x, y, z) = (1, 2, 3);
    //.. 忽略剩余值
    let (x, ..) = (1, 2, 3);
    // 4. 解构结构体
    struct Point {
        x: i32,
        y: i32,
    }
    let p = Point { x: 1, y: 2 };
    let Point { x, y } = p;
    let Point { x: xx, y: yy } = p;
    println!("Point.x {}, Point.y {}", x, y);
    println!("Point.x {}, Point.y {}", xx, yy);
    // 5. match枚举时解构
    enum MessageQ {
        A,
        B,
        C(u8, u8),
    }
    let msg = MessageQ::C(1, 3);
    match msg {
        MessageQ::C(x, y) => println!("MessageQ::C, {}, {}", x, y),
        _ => (),
    }
    // 6. 解构函数参数
    fn match_param(&(x, y): &(i32, i32)) {}
    // 99. 其他场景：https://course.rs/basic/match-pattern/all-patterns.html
}

fn main() {
    controll_fun();
}
