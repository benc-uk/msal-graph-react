// ----------------------------------------------------------------------------
// Copyright (c) Ben Coleman, 2020
// Licensed under the MIT License.
//
// Main app component for demo sample, allows login and debug/display of user details
// ----------------------------------------------------------------------------

import React from 'react'
import './App.css'
import Login from './components/Login'
import Search from './components/Search'
import DetailsModal from './components/DetailsModal'
import * as graph from './helpers/graph'
import { AuthHelper } from './helpers/auth'

export default class App extends React.Component {

  constructor(props) {
    super(props)

    if (process.env.REACT_APP_CLIENT_ID) {
      this.auth = new AuthHelper(process.env.REACT_APP_CLIENT_ID)
    } else {
      alert('REACT_APP_CLIENT_ID is not set, app cannot function at all!')
      return
    }

    this.state = {
      user: null,             // User account from MSAL
      accessToken: null,      // Access token to call the Graph API

      graphDetails: null,     // User details from Graph
      graphPhoto: null,       // Photo of user from Graph

      showUser: false,        // Toggle display of user account details modal
      showToken: false,       // Toggle display of access token modal
      showGraphDetails: false // Toggle display of graph details modal
    }

    this.loginComplete = this.loginComplete.bind(this)
    this.shallowLogout = this.shallowLogout.bind(this)
  }

  //
  // After mounting try to get access token, if successful get data from Graph API
  //
  componentDidMount() {
    // Restore any cached or saved local user
    this.setState({ user: this.auth.getAccount() })
    this.callGraph()
  }

  //
  // Callback to update state after login
  //
  loginComplete() {
    this.setState({ user: this.auth.getAccount() })
    this.callGraph()
  }

  //
  // Remove locally held user details, is same as logout
  //
  shallowLogout() {
    this.setState({
      user: null,
      accessToken: null,
      graphDetails: null,
      graphPhoto: null
    })
    this.auth.clearLocalUser()
  }

  //
  // Get an access token and call graphGetSelf & graphGetPhoto
  //
  async callGraph() {
    try {
      // First try to get a token
      const scopes = JSON.parse(process.env.VUE_APP_TOKEN_SCOPES || null) || [ 'user.read', 'user.readbasic.all' ]
      let token = await this.auth.acquireToken(scopes)
      this.setState({ accessToken: token })

      // If it went wrong
      if (!this.state.accessToken) { return }

      // Fetch user details from Graph with our token
      const graphDetails = await graph.getSelf(this.state.accessToken)
      this.setState({ graphDetails })
      const graphPhoto = await graph.getPhoto(this.state.accessToken)
      this.setState({ graphPhoto })
    } catch (err) {
      this.setState({ error: err.toString() })
    }
  }

  render() {
    let appHeader = <section className="hero is-primary is-bold">
      <div className="hero-body">
        <h1 className="title">
          <img src="img/logo.svg" alt="logo" className="ml-4"/>MSAL and Microsoft Graph Demo
        </h1>
      </div>
      <span className="gitlink is-2 title"><a href="https://github.com/benc-uk/msal-graph-react"><i className="fab fa-github fa-fw"></i></a></span>
    </section>

    // Error message section
    let errSection
    if (this.state.error) {
      errSection = <div className="notification is-danger is-4 title mx-6 my-2">
        { this.state.error }
      </div>
    }

    // If not logged in...
    if (!this.state.user) {
      return <div>
        {appHeader}

        <div className="container main">
          <Login onLogin={this.loginComplete} authHelper={this.auth}/>
        </div>
      </div>
    }

    // Section to show some top level user details fetched via the Graph API
    let graphDetails
    if (this.state.graphDetails) {
      graphDetails = <div className="col">
        <div className="title is-5 underline">Graph Details</div>
        <p><b>UPN:</b> { this.state.graphDetails.userPrincipalName }</p>
        <p><b>ID:</b> { this.state.graphDetails.id }</p>
        <p><b>Job Title:</b> { this.state.graphDetails.jobTitle }</p>
        <p><b>Location:</b> { this.state.graphDetails.officeLocation }</p>
        <p><b>Mobile:</b> { this.state.graphDetails.mobilePhone }</p>
        <p><b>Department:</b> { this.state.graphDetails.department }</p>
        <button className="button is-success is-fullwidth mt-2" onClick={() => this.setState({ showGraphDetails: true })}>
          <span className="icon">
            <i className="fas fa-address-card fa-fw"></i>
          </span>
          <span>Full Graph Result</span>
        </button>
      </div>
    }

    // Section to show user's photo fetched via the Graph API
    let graphPhoto
    if (this.state.graphPhoto) {
      graphPhoto = <div className="col">
        <div className="title is-5 underline">Photo</div>
        <p><img className="graphphoto" src={ this.state.graphPhoto } alt="user"></img></p>
      </div>
    }

    // When logged in...
    return <div>
      {appHeader}
      {errSection}

      <div className="container main">

        <div className="col">
          <div className="title is-5 underline">Account &amp; Tokens</div>
          <p><b>Name:</b> { this.state.user.name }</p>
          <p><b>Username:</b> { this.state.user.userName }</p><br/>
          <button className="button is-success is-fullwidth mt-2" onClick={() => this.setState({ showUser: true })}>
            <span className="icon">
              <i className="fas fa-user fa-fw"></i>
            </span>
            <span>ID Token &amp; Account</span>
          </button>
          <button className="button is-success is-fullwidth mt-2" onClick={() => this.setState({ showToken: true })}>
            <span className="icon">
              <i className="fas fa-code fa-fw"></i>
            </span>
            <span>Access Token</span>
          </button>

          <div className="columns mt-2">
            <div className="column">
              <button className="button is-warning is-fullwidth" onClick={this.shallowLogout}>
                <span className="icon">
                  <i className="fas fa-sign-out-alt fa-fw"></i>
                </span>
                <span>Logout (Local)</span>
              </button>
            </div>
            <div className="column">
              <button className="button is-warning is-fullwidth" onClick={() => this.auth.logout(true)}>
                <span className="icon">
                  <i className="fas fa-door-open fa-fw"></i>
                </span>
                <span>Logout (Full)</span>
              </button>
            </div>
          </div>
        </div>

        {graphDetails}

        {graphPhoto}

        <DetailsModal
          title="Account &amp; ID Token Details"
          content={this.state.user}
          active={this.state.showUser}
          onClose={() => this.setState({ showUser: false })}/>

        <DetailsModal
          title="Access Token Value"
          content={this.state.accessToken}
          active={this.state.showToken}
          link="https://jwt.ms"
          onClose={() => this.setState({ showToken: false })}/>

        <DetailsModal
          title="Graph Details"
          content={this.state.graphDetails}
          active={this.state.showGraphDetails}
          onClose={() => this.setState({ showGraphDetails: false })}/>

        <div className="col fullwidth">
          <div className="title is-5 underline mt-6">Search Directory</div>
          <Search accessToken={this.state.accessToken} user={this.state.user}/>
        </div>

      </div>

    </div>
  }
}
