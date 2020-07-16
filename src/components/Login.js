import React from 'react'

import { login } from '../helpers/auth'

export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null
    }

    this.startLogin = this.startLogin.bind(this)
  }

  render() {
    return <div>
      <h1 className="title is-5">Please login with Microsoft Identity Platform</h1>
      <button className="button is-dark is-large" onClick={this.startLogin}>Sign in with Microsoft &nbsp; <img src="/mssymbol_19.svg"/></button>
      <p className="mt-4">Note. You can login with a 'work &amp; school' or personal Microsoft account</p>
      {(this.state.error) &&
        <div className="notification is-warning mt-4">
          { this.state.error }
        </div>
      }
    </div>
  }

  async startLogin() {
    try {
      await login()
      this.props.onLogin()
    } catch (err) {
      this.setState({ error: err.toString() })
    }
  }
}
