// export interface Thenable<R> {
//   then<U>(
//     onFulfilled?: (value: R) => U | Thenable<U>,
//     onRejected?: (error: any) => U | Thenable<U>
//   ): Thenable<U>;
//   then<U>(
//     onFulfilled?: (value: R) => U | Thenable<U>,
//     onRejected?: (error: any) => void
//   ): Thenable<U>;
// }

// interface A {

// }

// class A<R> implements Thenable<R> {
//   then(onFulfilled?, onRejected?): string {
//     const parent: any = this;
//     return 'test';
//   }
// }

// const a = new A<number>();
// a.then(
//   (x: string) => {
//     return false
//   },
//   () => {},
// );

// const promise1 = new A()

// const promise2 =  promise1.then()

interface Thenable<E> {
  then<U>(cb: (val: E) => U) : Thenable<U>;
}

class A<T> implements Thenable<T> {
  then(arg) {
    return arg.te1st();
  }
}

type pp = {
  test: string
}

const a = new A<pp>();
a.then(1);


function colorDecorator<T extends { new(...args: any[]): {} }>(color: string) {
  return function (constructor: T) {
      return class extends constructor {
          name = 'shit'
          color = color
      }
  }
}

colorDecorator<Car>('red')
class Car {
  name: string
  constructor(name: string) {
      this.name = name
  }
}