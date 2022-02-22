import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

/*
class Square extends React.Component {
  // constructor(){
  //   super();
  //   this.state = {
  //     value: null,
  //   }
  // }
  render() {
    return (<
      button className="square" onClick={() => this.props.onClick()}>{ this.props.value } <
      /button>
    );
  }
}
*/

/**
 * 函数定义插件
 *
 * 这里我们把 onClick={() => props.onClick()} 直接修改为 onClick={props.onClick} , 注意不能写成 onClick={props.onClick()} 否则 props.onClick 方法会在 Square 组件渲染时被直接触发而不是等到 Board 组件渲染完成时通过点击触发
 */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {" "}
      {props.value}{" "}
    </button>
  );
}

class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {" "}
          {this.renderSquare(0)} {this.renderSquare(1)} {this.renderSquare(2)}{" "}
        </div>{" "}
        <div className="board-row">
          {" "}
          {this.renderSquare(3)} {this.renderSquare(4)} {this.renderSquare(5)}{" "}
        </div>{" "}
        <div className="board-row">
          {" "}
          {this.renderSquare(6)} {this.renderSquare(7)} {this.renderSquare(8)}{" "}
        </div>{" "}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    //悔棋后, 就不再显示后面的悔棋链接
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    //获胜或者已有子
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 ? false : true,
    });
  }

  render() {
    //元素变量: 可以帮助你有条件的渲染组件的一部分，而输出的其他部分不会更改。
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Move #" + move : "Game start";
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>
            {" "}
            {desc}{" "}
          </a>{" "}
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />{" "}
        </div>{" "}
        <div className="game-info">
          <div> {status} </div> <ol> {moves} </ol>{" "}
        </div>{" "}
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // 判断这三处的执棋人为同一个
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
