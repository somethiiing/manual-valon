import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      successCount: 0,
      failCount: 0
    }

    this.fail = this.fail.bind(this);
    this.success = this.success.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    axios.get('/getData')
      .then( response => {
        this.setState(response.data.state);
      })
  }

  success(e) {
    e.preventDefault();
    axios.get('/vote/success')
      .then(response => {
        alert('vote registered, refresh page now!')
      })
      .catch(() => {
        alert('failed, try again once')
      })
  }

  fail(e) {
    e.preventDefault();
    axios.get('/vote/fail')
    .then(response => {
      alert('vote registered, refresh page now!')
    })
    .catch(() => {
      alert('failed, try again once')
    })
  }

  reset(e) {
    e.preventDefault();
    axios.get('/reset')
      .then(response => {
        alert('successfully reset, please refresh page')
      })
  }


  render() {
    return (
      <div>
        <div>
          <div>
            {`Success Count: ${this.state.successCount}`}
          </div>
          <div>
            {`Fail Count: ${this.state.failCount}`}
          </div>
        </div>


        <div>
          <button onClick={this.success}>SUCCESS</button>
          <button onClick={this.fail}>FAIL</button>
        </div>


      <button onClick={this.reset}>RESET</button>

      </div>
    );
  }
}

export default App;
