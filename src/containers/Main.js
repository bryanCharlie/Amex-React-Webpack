import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { HtmlTag } from 'components/HtmlTag'

import {
  HashRouter,
  Route,
  Link
} from 'react-router-dom';

export class Main extends Component {
    render(){
      return (
        <HashRouter>
            <Route path="/" component={HtmlTag}/>
        </HashRouter>
      )
    } 
}
