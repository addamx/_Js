use rand::Rng;
use std::{cmp::Ordering, io}; // prelude 预导入模块（内置模块）,如果直接从std开始使用，就不用use来导入 // trait

fn main() {
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
        // 这里的u32是因为parse可以返回多种类型，所以需要声明具体使用哪种类型；也可以通过 parse::<u32>()来声明
        let guess: u32 = match guess.trim().parse() {
           Ok(num) => num,
           // _ 表示不关心它的变量
           Err(_) => continue
        };

        println!("你猜测的数是：{}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
               println!("You win!");
               break;
            },
        }
    }
}


fn variable() {
   let mut x = 5;
   x = 6;

   const MAX_POINTS:u32 = 100_000;
 }