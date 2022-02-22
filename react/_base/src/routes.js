import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './component/Home'
import Base from './component/Base'
import Refs from './component/Refs'
import Life from './component/Life'
import FilterTable from './component/FilterTable'
import TestPureComponent from './component/TestPureComponent'
import Style from './component/style'

import asyncComponent from './component/wrapper/AsyncComponent'

const DragComponent = asyncComponent(() => import('./component/DragComponent'))


const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/base" component={Base}/>
      <Route path="/refs" component={Refs}/>
      <Route path="/Life" component={Life}/>
      <Route path="/filtertable" component={FilterTable}/>
      <Route path="/testpurecomponent" component={TestPureComponent}/>
      <Route path="/drag" component={DragComponent}/>
      <Route path="/style" component={Style}/>
    </Switch>
  </Router>
)


export default Routes
