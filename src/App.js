import React from 'react';

import Admin from './components/admin';
import Board from './components/board';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showButtons: true,
      page: ''
    }

    this.changePage = this.changePage.bind(this);
  }

  changePage(page) {
    this.setState({showButtons: false, page});
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        {this.state.showButtons && <button onClick={e => this.changePage('BOARD')}>PLAYER</button>}
        {this.state.showButtons && <button onClick={e => this.changePage('ADMIN')}>ADMIN</button>}
        {this.state.page === 'BOARD' && <Board />}
        {this.state.page === 'ADMIN' && <Admin />}
      </div>
    );
  }
}

export default App;
