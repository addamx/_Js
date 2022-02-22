/**
 * 循环遍历
 *
 * keyof
 */
type Copy<T extends any[]> = {
  [KEY in keyof T]: T[KEY]
};
type MyTuple = [number, string];
type CopiedTuple = Copy<MyTuple>;
// CopiedTuple和MyTuple一模一样

//循环本身是没有意义的，循环的意义来自于我们在循环体中做了什么。
//在这类对类型的循环中，我们可以进行两种类型的修改，一种是对属性的修改，另一种是对值类型的修改。

/**
 * 循环: 对属性的修改
 */
// 加号`+` 可以省略
type Immutable<T extends any[]> = { // 接收一个数组类型，返回一个只读数组类型
  +readonly [P in keyof T]: T[P];
};
type Mutable<T extends any[]> = { // 接收一个数组类型，返回一个可修改数组类型
  -readonly [P in keyof T]: T[P];
};
type Optional<T extends any[]> = { // 接收一个数组类型，返回一个元素类型是optional的数组类型
  [P in keyof T]+?: T[P];
};
type RequiredX<T extends any[]> = { // 接收一个数组类型，返回一个元素类型是required的数组类型
  [P in keyof T]-?: T[P];
};
// 字典类型, 去掉`extends any[]`约束
type ImmutableDict<T> = { // 接收一个字典或数组类型，返回一个属性是只读的新类型。
  readonly [P in keyof T]: T[P];
};
// 多层级
type ImmutableL3<T> = {
  [L1KEY in keyof T]: {
    [L2KEY in keyof T[L1KEY]]: ImmutableDict<T[L1KEY][L2KEY]> // 遍历到第二层
  }
}
type DeepObj = {
  l1: {
    l2: {
      l3: string; // 将该层级的属性都变为只读的
    }
  }
}
type L3ReadOnlyObj = ImmutableL3<DeepObj>;


/**
 * 循环: 对值类型的修改
 */
type StrAndNumberNumbers = [string, number, string]; // 一个由字符串和数字组成的Tuple
type NumbersOf<T extends any[]> = {
  [P in keyof T]: number; // 将值类型定义为数字
}
type AllNumbers = NumbersOf<StrAndNumberNumbers>; // 将值类型转化为number而长度不变
// type AllNumbers = [number, number, number]



/**
 * Conditional Type(选择结构)
 *
 */

// 1. 三元 ? :

// 去除类型
type ExcludeX<T, U> = T extends U ? never : T;
//👆可以这么理解这句，T是不是一种U？若是，不可能，若不是，返回T

// 定义一个可以去除一些属性的类型
// `K extends keyof T` : K 为T属性的子集
// `Exclude<keyof T, K>`: 排除T属性中属于K的部分, 即K在T中的相对补集, `T-K`
// (上面使用个格式都是联合类型,  propA" | propB |..., Pick返回的是字典)
// `Pick<T, Exclude<keyof T, K>>`:从上面的补集中获取T对应的属性集
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type ITBoss = {
  name: string;
  title: "BOSS";
  department: "IT";
  age: number;
  sex: "MALE";
}; // 定义一个IT部门的老大
// 这里从ITBoss中排除 title 及 deparment属性, 并且添加wife属性
type Husband = Omit<ITBoss, 'title' | 'department'> & { wife: string }; // 复用ITBoss转换为Husband
//👆type Husband = { name: string; age: number; sex: "MALE"; wife: string }


// 2. infer
type FlattenX<T> = T extends any[] ? T[number] : T;
// 如果使用关键字 infer 就可以将上面的代码简化成：
type FlattenY<T> = T extends Array<infer U> ? U : T;

type ReturnTypeX<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;



/**
 * 递归
 */
// 两层泛型类型
type ReturnType1<T extends (...args: any) => any> = ReturnType<T> extends (
  ...args: any
) => any
  ? ReturnType<ReturnType<T>>
  : ReturnType<T>;

// 三层泛型类型
type ReturnType2<T extends (...args: any) => any> = ReturnType<T> extends (
  ...args: any
  ) => any
  ? ReturnType1<ReturnType<T>>
  : ReturnType<T>;

// 四层泛型类型，可以满足绝大多数情况
type DeepReturnType<T extends (...args: any) => any> = ReturnType<T> extends (
  ...args: any
  ) => any
  ? ReturnType2<ReturnType<T>>
  : ReturnType<T>;

// 测试
const deep3Fn = () => () => () => () => "flag is win" as const; // 四层函数
type Returned = DeepReturnType<typeof deep3Fn>; // type Returned = "flag is win"
const deep1Fn = () => "flag is win" as const; // 一层函数
type Returned1 = DeepReturnType<typeof deep1Fn>; // type Returned = "flag is win"
