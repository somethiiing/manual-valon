import React from 'react';

import Admin from './components/admin';
import Board from './components/board';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'BOARD'
    }

    this.changePage = this.changePage.bind(this);
  }

  changePage() {
    if (this.state.page === 'BOARD') {
      this.setState({page: 'ADMIN'});
    } else {
      this.setState({page: 'BOARD'});
    }
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <button onClick={this.changePage}>change</button>
        {this.state.page === 'BOARD' && <Board />}
        {this.state.page === 'ADMIN' && <Admin />}
      </div>
    );
  }
}

export default App;
