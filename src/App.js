import React from 'react'
import './App.css'
import Login from './components/Login'
import DetailsModal from './components/DetailsModal'
import { user, accessToken, logout } from './helpers/auth'
import { getSelf, getPhoto } from './helpers/graph'

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      user: user(),
      graphDetails: null,
      graphPhoto: null,
      accountDetails: null,
      accessTokenDetails: null,
    }

    this.userLoggedIn = this.userLoggedIn.bind(this)
  }

  componentDidMount() {
    if (accessToken) {
      this.callGraph()
    }
  }

  render() {
    return <div>
      <section className="hero is-dark is-bold">
        <div className="hero-body">
          <h1 className="title">
            <img src="logo.png" alt="logo"/>MSAL and Microsoft Graph Demo
          </h1>
        </div>
      </section>

      <div className="container main">
        {(this.state.user) &&
          <div className="col">
            <div className="title is-5 underline">Account &amp; Tokens</div>
            <p><b>Name:</b> { this.state.user.name }</p>
            <p><b>Username:</b> { this.state.user.userName }</p><br/>
            <button className="button is-success is-fullwidth mt-2" onClick={() => this.setState({ accountDetails: user() })}>View idToken &amp; Account</button>
            <button className="button is-success is-fullwidth mt-2" onClick={() => this.setState({ accessTokenDetails: accessToken })}>View accessToken</button>
            <button className="button is-success is-fullwidth mt-2" onClick={() => this.setState({ showGraphDetails: this.state.graphDetails })}>View Graph Details</button>
            <hr/>
            <button className="button is-warning is-fullwidth mt-2" onClick={() => logout(false)}>Logout (Local)</button>
            <button className="button is-warning is-fullwidth mt-2" onClick={() => logout(true)}>Logout (Full)</button>
          </div>
        }

        {(this.state.graphDetails) &&
          <div className="col">
            <div className="title is-5 underline">Graph Details</div>
            <p><b>Job Title:</b> { this.state.graphDetails.jobTitle }</p>
            <p><b>Location:</b> { this.state.graphDetails.officeLocation }</p>
            <p><b>UPN:</b> { this.state.graphDetails.userPrincipalName }</p>
            <p><b>Mobile:</b> { this.state.graphDetails.mobilePhone }</p>
          </div>
        }

        {(this.state.graphPhoto) &&
          <div className="col">
            <div className="title is-5 underline">Photo</div>
            <p><img className="graphphoto" src={ this.state.graphPhoto } alt="user"></img></p>
          </div>
        }

        {!(this.state.user) &&
          <Login onLogin={this.userLoggedIn}/>
        }

        <DetailsModal title="Account &amp; idToken Details" content={this.state.accountDetails} onClose={() => this.setState({ accountDetails: null })}></DetailsModal>

        <DetailsModal title="accessToken Value" content={this.state.accessTokenDetails} onClose={() => this.setState({ accessTokenDetails: null })}></DetailsModal>

        <DetailsModal title="Graph Details" content={this.state.showGraphDetails} onClose={() => this.setState({ showGraphDetails: null })}></DetailsModal>
      </div>
    </div>
  }

  //
  // Callback to update state after login
  //
  userLoggedIn() {
    this.setState({ user: user() })
    this.callGraph()
  }

  //
  // Call Graph API to get self details
  //
  callGraph() {
    getSelf(accessToken)
      .then((details) => {
        this.setState({ graphDetails: details })
      })
      .catch((err) => {
        console.log('### getSelf ERROR '+err)
      })

    getPhoto(accessToken)
      .then((photo) => {
        this.setState({ graphPhoto: photo })
      })
      .catch((err) => {
        console.log('### getPhoto ERROR '+err)
      })
  }
}
