class Person {
  protected name: string; //保护

  static version: string = '1.0.0'; //静态属性

  constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  private department: string; //私有
  readonly title: string; //只读

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getname() {
    return this.name;
  }
}

// OR
// 我们在构造函数中就声明属性, 这样就不用另外添加在属性处声明, 以及不用再赋值;
class Employee2 extends Person {
  // private department: string;
  readonly title: string; //只读

  constructor(name: string, private department: string) {
    super(name);
    // this.department = department;
  }

  public getname() {
    return this.name;
  }
}


/**
 * 存取器
 *
 * - 需要修改"compileOptions": {"target": "es5"}
 * - 有get不带有set的存取器自动被推断为readonl
 */
let passcode = "secret passcode";

class Employees {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employees();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}




/**
 * 抽象类
 */
abstract class Animal {

  abstract makeSound(): void;

  move(): void {
    console.log("roaming the earth...");
  }
}

abstract class Department {

  constructor(public name: string) {
  }

  printName(): void {
    console.log('Department name: ' + this.name);
  }

  abstract printMeeting(): void; // 必须在派生类中实现
}

let department: Department; // 允许创建一个对抽象类型的引用, 实例化必须是该抽象类的子类
