import React from 'react';

import Control from './control';

let username = 'admin';
let password = 'thisisit';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      password: ''
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onInputChange(e, field) {
    let temp = {};
    temp[field] = e.target.value
    this.setState(temp);
  }

  onLogin(e) {
    e.preventDefault();
    if(this.state.user === username && this.state.password === password) {
      this.props.login();
    } else {
      alert('wrong username/password')
    }
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <form onSubmit={this.onLogin} style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <input
            type='text'
            label='username'
            value={this.state.user}
            onChange={(e) => this.onInputChange(e, 'user')}
          ></input>
          <input
            type='password'
            label='password'
            value={this.state.password}
            onChange={(e) => this.onInputChange(e, 'password')}
          ></input>
          <button onClick={this.onLogin}>login</button>
        </form>
      </div>
    )
  }

}

class adminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'login'
    };

    this.login = this.login.bind(this);
  }

  login() {
    this.setState({page: 'admin'});
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        { this.state.page === 'login' && <Login login={this.login} /> }
        { this.state.page === 'admin' && <Control /> }
      </div>
    )
  }
}

export default adminPage;
