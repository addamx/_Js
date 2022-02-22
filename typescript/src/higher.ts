/**
 * 交叉类型
 *
 * 将多个类型合并为一个类型, 同时拥有多个目标的属性
 * Partial<AClass & bClass>
 */
function extend<First, Second>(first: First, second: Second): First & Second {
  const result: Partial<First & Second> = {};
  for (const prop in first) {
      if (first.hasOwnProperty(prop)) {
          (<First>result)[prop] = first[prop];
      }
  }
  for (const prop in second) {
      if (second.hasOwnProperty(prop)) {
          (<Second>result)[prop] = second[prop];
      }
  }
  return <First & Second>result;
}




/**
 * 联合类型
 */
function padLeft(value: string, padding: string | number) {
  // ...
}



/**
 * 类型守卫
 *
 * 类型守卫就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型
 * parameterName is Type这种形式，parameterName必须是来自于当前函数签名里的一个参数名。
 */
interface Fish {
  swim: string
}
interface Bird {}

function isFish(pet: Fish | Bird): pet is Fish {
  return (<Fish>pet).swim !== undefined;
}
// if (isFish(pet)) {
//   pet.swim();
// }
// else {
//   pet.fly();
// }


/**
 * 类型别名
 *
 * 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。
 *
 * 接口 vs. 类型别名
 * 其一，接口创建了一个新的名字，可以在其它任何地方使用, 但并不创建新名字—比如，错误信息就不会使用别名。
 * 另一个重要区别是类型别名不能被extends和implements（自己也不能extends和implements其它类型）
 *
 * 如果你无法通过接口来描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名。
 */
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;

type Container<T> = { value: T };




/**
 * 可辨识联合 Discriminated Unisons
 */
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}

type Shapes = Square | Rectangle | Circle;

function area(s: Shapes) {
  switch (s.kind) {
      case "square": return s.size * s.size;
      case "rectangle": return s.height * s.width;
      case "circle": return Math.PI * s.radius ** 2;
  }
}
