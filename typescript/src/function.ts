// 函数定义类型1
let myAdd = function(x: number, y: number): number {
  return x + y;
}

// 函数定义类型2
let myAdd1: (x: number, y: number) => number =
  function(x, y) {
    return x + y;
  }
// myAdd1('a', 1); // ERROR



// 参数
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + ' ' + restOfName.join(' ');
}



/**
 * This
 *
 * 编译选项noImplicitThis 限制this为隐式any, 则必须声明类型;
 * 如果使用 arrow 函数, 则会自动认定this为声明时的上下文, 没声明类型也不报错;
 * 建议仍然给this声明为非any类型
 */
interface Card {
  suit: string;
  card: number;
}

interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  // 在参数处声明this类型
  createCardPicker: function(this: Deck) {
      // return function() {
      //     let pickedCard = Math.floor(Math.random() * 52);
      //     let pickedSuit = Math.floor(pickedCard / 13);

      //     //
      //     return {suit: this.suits[pickedSuit], card: pickedCard % 13};
      // }

      return () => {
        let pickedCard = Math.floor(Math.random() * 52);
        let pickedSuit = Math.floor(pickedCard / 13);

        return {suit: this.suits[pickedSuit], card: pickedCard % 13};
    }
  }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);



/**
 * This in fallback
 */
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}

class Handler {
  info: string;
  // 因为上面接口的限制, this不能声明为void或者any以外的类型
  onClickBad(this: void, e: Event): void {
      // 由于UIElment指定了this为void, 所以callback不能使用this
      // this.info = e.type;
      console.log('can\'t use this in callback by interface limitation');
  }
}

let h = new Handler();

const uiElement: UIElement = {
  addClickListener: function(onclick) {
    onclick(new Event('click'));
  }
};

uiElement.addClickListener(h.onClickBad); // error!



/**
 * 重载
 *
 * 使用联合类型
 */
function overloadFunc(x: number | string): any {
    if (typeof x == 'string') {
        return x.substr(1);
    }

    if (typeof x == 'number') {
         return x;
     }
}


