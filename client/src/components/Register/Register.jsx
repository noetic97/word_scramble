import React, { Component } from 'react';
import { Redirect } from "@reach/router";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      passwordVerify: '',
      successMessage: '',
      isChecked: true,
      loggedIn: false,
      redirect: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
    this.createNewPasswordMessage = this.createNewPasswordMessage.bind(this);
  }

  componentDidMount() {
    fetch('/api/v1/users')
      .then(res => res.json())
      .then((data) => {
        // this.setState({
        //   reps: data,
        //   user_rep: data[0].id,
        // });
        console.log(data)
      });
  }

  setUserToLocal(userData) {
    const userName = JSON.stringify(userData.name);
    const currentUser = JSON.stringify(userData);
    localStorage.setItem('WS_userName', userName);
    localStorage.setItem('WS_currentUser', currentUser);
  }

  setStatusToLocal = () => {
    const { loggedIn } = this.state;
    const status = JSON.stringify({
      loggedIn,
    });
    localStorage.setItem('WS_userStatus', status);
  }

  setRedirect = () => {
    this.setState({
      redirect: true,
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.addNewUser(this.state);
  }

  onCancel = () => {
    this.setState(
      {
        name: '',
        email: '',
        password: '',
        passwordVerify: '',
      },
    );
  }

  createNewPasswordMessage = () => {
    const { password, passwordVerify } = this.state;
    if (password !== passwordVerify) {
      return (
        <div className="new-password-message">
          <p className="password-match-fail">Your passwords do not match.</p>
        </div>
      );
    } else if ((password === passwordVerify) && password.length > 0) {
      return (
        <div className="new-password-message">
          <p className="password-match-success">Your passwords match!</p>
        </div>
      );
    }
    return null;
  }

  addNewUser = (userData) => {
    const cleanUserData = Object.assign({}, userData);
    delete cleanUserData.successMessage;
    delete cleanUserData.isChecked;
    delete cleanUserData.passwordVerify;
    delete cleanUserData.loggedIn;
    delete cleanUserData.redirect;
    
    console.log(cleanUserData, 'data')
    fetch('/api/v1/signup', {
      method: 'POST',
      body: JSON.stringify(cleanUserData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        if (data.error) {
          this.setState({ successMessage: 'Something went wrong. Please try again' });
          return;
        }
        this.setState({
          loggedIn: true,
        });
        this.onCancel();
        this.setUserToLocal(data);
        this.setRedirect();
        this.setState({ successMessage: `The account for ${userData.name} was successfully created! Welcome ${userData.name}!` });
      })
      .catch(err => console.log(err));
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.type === 'number' && e.target.id !== 'phone' ? parseInt(e.target.value, 10) : e.target.value });
  };

  render() {
    const {
      email,
      name,
      loggedIn,
      redirect,
      password,
      passwordVerify,
      successMessage,
    } = this.state;
    
    if (loggedIn && redirect) {
      return(
        <Redirect noThrow to="/" />
      ) 
    }

    return (
      <div className="home-wrapper">
        <form className="submit-user-form" onSubmit={e => this.onSubmit(e)}>
          <div className="half-width-form">
            <div className="input-container">
              <h4>User Name</h4>
              <input
                id="name"
                onChange={e => this.handleChange(e)}
                required
                type="text"
                value={name}
              />
            </div>
            <div className="input-container">
              <h4>Email</h4>
              <input
                id="email"
                onChange={e => this.handleChange(e)}
                required
                type="email"
                value={email}
              />
            </div>
          </div>
          <div className="half-width-form">
            <div className="input-container">
              <h4>Password</h4>
              <input
                id="password"
                onChange={e => this.handleChange(e)}
                required
                type="password"
                value={password}
              />
            </div>
            <div className="input-container">
              <h4>Verify Password</h4>
              <input
                id="passwordVerify"
                onChange={e => this.handleChange(e)}
                required
                type="password"
                value={passwordVerify}
              />
            </div>
          </div>
          {this.createNewPasswordMessage()}
          <section className="new-user-buttons">
            <button
              id="cancel"
              onClick={() => { if (window.confirm('You are about to clear the form data.  Continue?')) this.onCancel(); }}
              type="button"
            >
              Cancel
            </button>
            <button id="save" type="submit">Save</button>
          </section>
        </form>
        {successMessage}
      </div>
    );
  }
}
export default Register;
