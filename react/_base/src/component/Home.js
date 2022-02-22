import React from 'react'
import {Link} from 'react-router-dom'

export default () => {
  return (
    <div>
      <ul>
        <li><Link to="/base">Base</Link></li>
        <li><Link to="/refs">Refs</Link></li>
        <li><Link to="/life">life</Link></li>
        <li><Link to="/filtertable">filtertable</Link></li>
        <li><Link to="/testpurecomponent">TestPureComponent</Link></li>
        <li><Link to="/drag">Drag Component</Link></li>
        <li><Link to="/style">Style Component</Link></li>
      </ul>
    </div>
  )
}
