import React, { Component } from 'react';
import { Redirect } from "@reach/router";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      usernameCheck: '',
      resetPassword: false,
      registerNew: false,
      newPassword: '',
      newPasswordVerify: '',
      errorMessage: '',
      redirect: false,
      loggedIn: false,
    };
    this.setRedirect = this.setRedirect.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
    this.checkUser = this.checkUser.bind(this);
    this.checkUserName = this.checkUserName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResetSubmit = this.handleResetSubmit.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
    this.enableResetPassword = this.enableResetPassword.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.createNewPassword = this.createNewPassword.bind(this);
    this.createNewPasswordMessage = this.createNewPasswordMessage.bind(this);
    this.setStatusToLocal = this.setStatusToLocal.bind(this);
    this.setUserToLocal = this.setUserToLocal.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  setUserToLocal(userData) {
    const userName = JSON.stringify(userData.username);
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

  renderRedirect = () => {
    const { redirect, loggedIn, registerNew } = this.state;
    if (redirect && loggedIn) {
      return <Redirect noThrow to="/" />;
    }
    if (redirect && registerNew) {
      return <Redirect noThrow to="/register" />;
    }
    return null;
  }

  checkUser() {
    const { username, password } = this.state;
    if (username && password) {
      const lowerUsername = username.includes('@') ? username.toLowerCase() : username;
      fetch('/api/v1/signin', {
        method: 'POST',
        body: JSON.stringify({
          username: lowerUsername,
          password,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then((data) => {
          if (data.error) {
            this.setState({ errorMessage: data.error });
          } else {
            this.setState({
              loggedIn: true,
            });
            this.setUserToLocal(data);
            this.setStatusToLocal();
            this.setRedirect();
          }
        })
        .catch(err => console.log(err));
    }
  }

  checkUserName() {
    const { username, usernameCheck } = this.state;
    if (username) {
      const lowerUsername = username.includes('@') ? username.toLowerCase() : username;
      fetch('/api/v1/resetpass', {
        method: 'POST',
        body: JSON.stringify({ username: lowerUsername }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then((data) => {
          if (!data.length || !data) {
            this.setState({ usernameCheck: username });
            this.setState({ errorMessage: `We are unable to find the username ${usernameCheck}. Please try again.` });
            this.setState({ username: '' });
          } else {
            this.setState({ errorMessage: '' });
          }
        })
        .catch(err => console.log(err));
    }
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.checkUser();
    this.setState({
      username: '',
      password: '',
    });
  }

  handleResetSubmit(e) {
    e.preventDefault();
    this.checkUserName();
  }

  handlePasswordReset(e) {
    e.preventDefault();
    this.createNewPassword();
  }

  handleRegister(e) {
    e.preventDefault();
    this.setState({
      registerNew: true,
    })
    this.setRedirect();
  }


  enableResetPassword() {
    const { errorMessage } = this.state;
    if (errorMessage) {
      return (
        <div className="pass-reset">
          <button
            className="pass-reset-button"
            onClick={this.handleResetPassword}
            type="button"
          >
            Reset Password
          </button>
        </div>
      );
    }
    return (
      <div className="pass-reset">
        <button
          className="pass-reset-button"
          onClick={this.handleResetPassword}
          type="button"
        >
          Reset Password
        </button>
      </div>
    );
  }

  createNewPassword() {
    const { username, newPassword, newPasswordVerify } = this.state;
    if (username && newPassword.length > 0 && newPassword === newPasswordVerify) {
      const lowerUsername = username.includes('@') ? username.toLowerCase() : username;
      console.log(lowerUsername);
      fetch('/api/v1/update-user-pass', {
        method: 'PATCH',
        body: JSON.stringify({
          username: lowerUsername,
          newPassword,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then((data) => {
          if (data.error) {
            this.setState({ errorMessage: data.error });
          } else {
            this.setState({
              loggedIn: true,
              newPassword: '',
              newPasswordVerify: '',
            });
            this.setStatusToLocal();
            this.setRedirect();
          }
        })
        .catch(err => console.log(err));
    }
  }

  handleResetPassword() {
    this.setState({
      resetPassword: true,
      errorMessage: 'Please enter your username or email to reset your password.',
    });
  }

  createNewPasswordMessage() {
    const { newPassword, newPasswordVerify, redirect } = this.state;
    if (newPassword !== newPasswordVerify) {
      return (
        <div className="new-password-message">
          <p>Your passwords do not match.</p>
        </div>
      );
    } else if ((newPassword === newPasswordVerify) && newPassword.length > 0) {
      return (
        <div className="new-password-message">
          <p>It matches!</p>
        </div>
      );
    }
    if (newPassword.length < 1 || newPasswordVerify.length < 1) {
      return (
        <div className="new-password-message">
          <p>Please create and verify a new password.</p>
        </div>
      );
    }
    if (redirect) {
      return (
        <div className="new-password-message">
          <p>Your Password Was Successfully Updated!</p>
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      username, password, newPassword, newPasswordVerify, resetPassword, errorMessage,
    } = this.state;
    if (!resetPassword) {
      const isEnabled = username.length > 0 && password.length > 0;
      return (
        <div className="home-wrapper">
          <main className="site-content">
            <form className="login-form" onSubmit={e => this.handleSubmit(e)}>
              <input
                className="login-input"
                id="username"
                onChange={e => this.handleChange(e)}
                placeholder="Enter Your Email"
                type="text"
                value={username}
              />
              <input
                className="login-input"
                id="password"
                onChange={e => this.handleChange(e)}
                placeholder="Enter Your Password"
                type="password"
                value={password}
              />
              {this.renderRedirect()}
              <button
                className="login-input"
                disabled={!isEnabled}
                type="submit"
              >
                Login
              </button>
            </form>
            <p>{errorMessage}</p>
            {this.enableResetPassword()}
            <div className="register-user">
              <button
                className="register-user-button"
                onClick={this.handleRegister}
                type="button"
              >
                Create Account
              </button>
            </div>
          </main>
        </div>
      );
    } else if (resetPassword && errorMessage) {
      const isEnabled = username.length > 0;
      return (
        <div>
          <main className="site-content">
            <form className="reset-password-form" onSubmit={e => this.handleResetSubmit(e)}>
              <input
                className="login-input"
                id="username"
                onChange={e => this.handleChange(e)}
                placeholder="Enter Your Email or User Name"
                type="text"
                value={username}
              />
              <button
                className="login-input"
                disabled={!isEnabled}
                type="submit"
              >
                Submit
              </button>
            </form>
            <p className="reset-password-message">{errorMessage}</p>
          </main>
        </div>
      );
    } else {
      const isEnabled = newPassword === newPasswordVerify
        && newPassword.length > 0
        && newPasswordVerify.length > 0;

      return (
        <div>
          <main className="site-content">
            <h4 className="reset-pass-message">RESET YOUR PASSWORD</h4>
            <form className="login-form" onSubmit={e => this.handlePasswordReset(e)}>
              <input
                className="login-input"
                disabled
                id="username"
                onChange={e => this.handleChange(e)}
                type="text"
                value={username}
              />
              <input
                className="login-input"
                id="newPassword"
                onChange={e => this.handleChange(e)}
                placeholder="Enter Your New Password"
                type="password"
                value={newPassword}
              />
              <input
                className="login-input"
                id="newPasswordVerify"
                onChange={e => this.handleChange(e)}
                placeholder="Verify Your New Password"
                type="password"
                value={newPasswordVerify}
              />
              <button
                className="login-input"
                disabled={!isEnabled}
                type="submit"
              >
                Submit
              </button>
            </form>
            {this.createNewPasswordMessage()}
            {this.renderRedirect()}
          </main>
        </div>
      );
    }
  }
}

export default Login;
