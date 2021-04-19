import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom'
import { Board } from './components/board/board'
import { Scoreboard } from './components/scoreboard/scoreboard'

import './components/board/board.css'
import './components/board-box/box.css'
import './components/buttons.css'

class App extends React.Component{
  render(){
    return (
      <div className="app">
        <HashRouter basename="/">
          <Route exact path="/" component={Scoreboard}/>
          <Route path="/board" component={Board}/>
        </HashRouter>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))