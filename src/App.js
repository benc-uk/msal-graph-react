import React from 'react'
import './App.css'
import Login from './components/Login'
import Search from './components/Search'
import DetailsModal from './components/DetailsModal'
import { auth } from './index'
import * as graph from './helpers/graph'

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      user: auth.user(),      // User account from MSAL
      graphDetails: null,     // User details from Graph
      graphPhoto: null,       // Photo of user from Graph
      showUser: false,        // Toggle display of user account details modal
      showToken: false,       // Toggle display of access token modal
      showGraphDetails: false // Toggle display of graph details modal
    }

    this.userLoggedIn = this.userLoggedIn.bind(this)
  }

  //
  // After mounting try to get access token, if successful get data from Graph API
  //
  componentDidMount() {
    if (auth.getAccessToken()) {
      this.callGraph()
    }
  }

  render() {
    return <div>
      <section className="hero is-primary is-bold">
        <div className="hero-body">
          <h1 className="title">
            <img src="img/logo.svg" alt="logo" className="ml-4"/>MSAL and Microsoft Graph Demo
          </h1>
        </div>
      </section>

      {(this.state.user) &&
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
            <button className="button is-success is-fullwidth mt-2" onClick={() => this.setState({ showGraphDetails: true })}>
              <span className="icon">
                <i className="fas fa-address-card fa-fw"></i>
              </span>
              <span>Graph Details</span>
            </button>
            <hr/>
            <button className="button is-warning mr-2" onClick={() => auth.logout(false)}>
              <span className="icon">
                <i className="fas fa-sign-out-alt fa-fw"></i>
              </span>
              <span>Logout (Local)</span>
            </button>
            <button className="button is-warning" onClick={() => auth.logout(true)}>
              <span className="icon">
                <i className="fas fa-sign-out-alt fa-fw"></i>
              </span>
              <span>Logout</span>
            </button>
          </div>

          {(this.state.graphDetails) &&
            <div className="col">
              <div className="title is-5 underline">Graph Details</div>
              <p><b>Job Title:</b> { this.state.graphDetails.jobTitle }</p>
              <p><b>Location:</b> { this.state.graphDetails.officeLocation }</p>
              <p><b>UPN:</b> { this.state.graphDetails.userPrincipalName }</p>
              <p><b>Mobile:</b> { this.state.graphDetails.mobilePhone }</p>
              <p><b>Department:</b> { this.state.graphDetails.department }</p>
            </div>
          }

          {(this.state.graphPhoto) &&
            <div className="col">
              <div className="title is-5 underline">Photo</div>
              <p><img className="graphphoto" src={ this.state.graphPhoto } alt="user"></img></p>
            </div>
          }

          <DetailsModal
            title="Account &amp; ID Token Details"
            content={this.state.user}
            active={this.state.showUser}
            onClose={() => this.setState({ showUser: false })}/>

          <DetailsModal
            title="Access Token Value"
            content={auth.getAccessToken()}
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
            <Search/>
          </div>

        </div>
      }

      {!(this.state.user) &&
        <div className="container main">
          <Login onLogin={this.userLoggedIn}/>
        </div>
      }
    </div>
  }

  //
  // Callback to update state after login
  //
  userLoggedIn() {
    this.setState({ user: auth.user() })
    this.callGraph()
  }

  //
  // Call Graph API to get self details
  //
  callGraph() {
    // Fetch user details from Graph
    graph.getSelf(auth.getAccessToken())
      .then((details) => {
        this.setState({ graphDetails: details })
      })
      .catch((err) => {
        console.log('### getSelf ERROR '+err)
      })

    // Fetch user photo from Graph
    graph.getPhoto(auth.getAccessToken())
      .then((photo) => {
        this.setState({ graphPhoto: photo })
      })
      .catch((err) => {
        console.log('### getPhoto ERROR '+err)
      })
  }
}
