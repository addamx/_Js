// import './base';

import {trace, toJS, observe, observable, action, computed, spy} from 'mobx';
import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {observer, PropTypes as ObservablePropTypes} from 'mobx-react';

/**
 * ObservablePropTypes
 */
//'ObservablePropTypes.observableArray
//'ObservablePropTypes.observableObject

/**
 * @observer
 */
//1. 使render方法转为autorun, 它精确监视可观察数据的编发触发autorun
//2. 已经实现shouldComponentUpdate
//@observer 需要修饰到确实发生会变化的组件, 考虑扩展性最好修饰全部组件


/**
使用mobx-react, 我们主要是为了实现
1. 将用户操作行为, 用mobx的action实现
2. 将mobx的数据映射到react的组件上;
*/


/**
 * 常用工具函数
 * 1. observe: 监视当前数据变化, 但对嵌套内属性无能为力, 只能迭代地绑定监视
 * 2. spy, 对所有数据进行监视
 * 3. toJS
 * 4. trace() [https://cn.mobx.js.org/best/trace.html] 帮助你查找为什么计算值、 reactions 或组件会重新计算; trace(true)将进行debugger断点, 调试信息显示当前计算或reaction的完整衍生树
 */
spy(event => {
    // console.log(event);
})

/**
 * mobx-react 提升性能三大法则
 * 1. 细粒度拆分视图组件<TodoItem/>
 * 2. 使用专用组件处理列表<TodoView/>
 * 3. 尽可能晚地解构可观察数据, 向子组件传入store而非单个store内的属性
 */

class Todo {
    id = parseInt(Math.random() * 10000);
    @observable title = '';
    @observable isFinished = false;

    constructor(title) {
        this.title = title;
    }

    @action.bound toggle () {
        this.isFinished = !this.isFinished;
    }
}

class Store {
    @observable todos = [];

    _disposers = [];

    constructor() {
        observe(this.todos, change => {
            // 本来observe对嵌套的todo不监视
            // disposer()表示解除监控
            // 每一次todo-list变化都要重新对每一个todo接触监视然后重新绑定
            this._disposers.forEach(disposer => disposer());

            this._disposers = [];

            for(let todo of change.object) {
                var disposer = observe(todo, change => {
                    // console.log('[TODO]', change);
                    this.save();
                });
                this._disposers.push(disposer);
            }

            // console.log('[TODO-LIST]', change);
            this.save();
        })
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(toJS(this.todos)));
    }

    //
    @action.bound createTodo(title) {
        this.todos.unshift(new Todo(title));
    }

    @action.bound removeTodo(todo) {
        this.todos.remove(todo);    //remove是mobx 提供
    }

    @computed get left() {
        return this.todos.filter(todo => !todo.isFinished).length;
    }
}

var store = new Store();

@observer
class TodoList extends Component {
    static propTypes = {
        store: PropTypes.shape({
            createTodo: PropTypes.func,
            todos: ObservablePropTypes.observableArrayOf(
                ObservablePropTypes.observableObject
            ).isRequired
        }).isRequired
    };

    

    render() {trace();
        const store = this.props.store;
        const todos = store.todos;

        return <div className="todo-list">
            <TodoHeader store={store}/>
            <ul>
                <TodoView todos={todos} />
            </ul>
            <TodoFooter store={store} />
        </div>
    }
}



@observer
class TodoHeader extends Component {
    static propTypes = {};

    state = {inputValue: ''};

    handleSubmit = (e) => {
        e.preventDefault();

        var store = this.props.store;
        var inputValue = this.state.inputValue;

        store.createTodo(inputValue);

        this.setState({inputValue: ''})
    }

    handleChange = (e) => {
        var inputValue = e.target.value;
        this.setState({
            inputValue
        })
    }

    render() {
        return <header>
            <form onSubmit={this.handleSubmit}>
                <input type="text" onChange={this.handleChange} value={this.state.inputValue} placeholder="What needs to be finished?"/>
            </form>
        </header>
    }
}


@observer
class TodoView extends Component {
    static propTypes = {};

    render() {
        const todos = this.props.todos;

        return todos.map(todo => {
            return <li key={todo.id}>
                <TodoItem todo={todo}/>
                <span className="delete-action" onClick={e => store.removeTodo(todo)}>X</span>
            </li>
        })
    }
}

// 尽可能晚地取出观察数据, 传入store而非left, 使todo属性变化再多次渲染Footer
@observer
class TodoFooter extends Component {
    static propTypes = {};

    render() {trace();
        const store = this.props.store
        return <footer>{store.left} item(s) unfinised</footer>
    }
}

@observer
class TodoItem extends Component {
    static propTypes = {
        todo: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            isFinished: PropTypes.bool.isRequired
        }).isRequired
    }

    handleClick = (e) => {
        this.props.todo.toggle();
    }

    render() {trace();
        const todo = this.props.todo;

        //Fragment react 16.0
        return <Fragment>   
            <input type="checkbox" checked={todo.isFinished} onClick={this.handleClick} />
            <span>{todo.title}</span>
        </Fragment>
    }
}



ReactDOM.render(<TodoList store={store} />, document.querySelector('#root'))
