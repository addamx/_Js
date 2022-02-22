import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Redirect,
  Switch,
  // 获得 { match, location, history } props
  withRouter
} from 'react-router-dom'
//scrolltop
import ScrollToTop from './plugins/ScrollToTop'
import ScrollToTopOnMount from './plugins/ScrollToTopOnMount'
//auth
import PrivateRoute from './plugins/PrivateRoute'
import fakeAuth from './service/fakeAuth'


const BasicExample = () => (
  <Router>
    <ScrollToTop>
    <div style={{minHeight: 900}}>

      <ul>
        <li><Link to="/">Home with `exact`</Link></li>
        <li><Link to="/about/">About/ with `strictt`</Link></li>
        <li>
          {/* Navlink 由 Link 扩展出来, 提供active状态标志, isActive修改active的逻辑 */}
          <NavLink
            activeStyle={{color:'red'}}
            activeClassName="active"
            isActive={(match, location) => {
              // console.log(match, location)
              return match
            }}
            to="/about2">
              About2 by `render`
          </NavLink>
        </li>
        <li><Link to="/about3">About3 by `children`</Link></li>
        <li><Link to="/about4?id=123">pass by inline</Link></li>
        <li><Link to={{pathname: '/about4', search: 'id=123'}}>pass by object</Link></li>
        <li><Link to="/topics">Topics</Link></li>
        <li><Link to="/longcontent">LongContent</Link></li>
        <li><Link to="/public">Public Page</Link></li>
        <li><Link to="/protected">Protected Page</Link></li>
      </ul>
      <AuthButton/>

      <hr/>
      {/* Switch 让Route只被匹配一次, 否则404页面的内容会在所有页面显示 */}
      <Switch>
        {/* `path='/'` 前面如果缺少`exact`, 会同时匹配其他`/`起头的route */}
        <Route exact path="/" component={Home}/>
        {/* 如果添加`strict`, 路径则必须全匹配, 最后少了`/`都不行 */}
        <Route strict path="/about/" component={About}/>
        <Route path="/about2" render={() => <h2>About2</h2>} />
        {/* 如果不判断是否 match, children的会直接输出 */}
        {/* replace 替代当前route, 即浏览器history栈会踢掉前一个route */}
        <Route replace path="/about3" children={({match}) => match && <h2>About3</h2>}  />
        <Route path="/about4" render={({match, location}) => <div>
          <p>{JSON.stringify(match)}</p>
          <p>{JSON.stringify(location)}</p>
          {/* 现在react-route不提供获取search参数的get方法 */}
          <p>id: {new URLSearchParams(location.search).get('id')}</p>
        </div>} />
        {/*
        <Route path="/:page?/:subpage?" render={({match}) => <h2>
          Page: {match.params.page || 'Home'}<br/>
          Subpage: {match.params.subpage}
        </h2>} />
        */}
        {/* http://127.0.0.1:3300/23-10-2019.html */}
        <Route path="/:a(\d{2}-\d{2}-\d{4}):b(\.[a-z]+)" render={({match}) => <h2>
          Page: {match.params.a}<br/>
          Subpage: {match.params.b}
        </h2>} />
        <Route path="/topics" component={Topics}/>
        <Route path="/longcontent" component={LongContent}/>
        <Route path="/public" component={Public}/>
        <Route path="/login" component={Login}/>
        <PrivateRoute path="/protected" component={Protected}/>
        <Route render={() => <h1>Page not found</h1>} />
      </Switch>
    </div>
    </ScrollToTop>
  </Router>
)

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

// 在子组件中创建二级route 和 link
const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
      <li>
        {/* 该路径无效, 请见它的Route设置 */}
        <Link to="/unaccessible">unless link</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>

    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
    {/* 不能设置非当前路径的其他Route */}
    <Route path="/unaccessible" render={() => <h2>unaccessible Route</h2>}/>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)





class LongContent extends React.Component {
  render() {
    return (
      <div>
      <ScrollToTopOnMount/>
      <h1>Here is my long content page</h1>
    </div>
    )
  }
}

/**
 * Router 验证测试组件
 */
const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }

  render() {
    //this.props.location.state 是 PrivateRoute传来的值, 记录redire的from页面的url;
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}




export default BasicExample
