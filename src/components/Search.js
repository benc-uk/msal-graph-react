import React from 'react'
import * as graph from '../helpers/graph'
import { auth } from '../index'

//
// Search component allows for searching for users via MS Graph
//
export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTerm: '',  // Term used in search box
      results: [],     // Search results
      error: ''        // Error message
    }

    this.searchChange = this.searchChange.bind(this)
  }

  // Search field changed, triggers search
  async searchChange(e) {
    this.setState({ searchTerm: e.target.value })
    this.search(e.target.value)
  }

  // Run Graph search debounced by 300 millsec
  search = debounce(async (text) => {
    if (text) {
      try {
        let data = await graph.searchUsers(this.state.searchTerm, auth.getAccessToken())
        this.setState({ results: data.value })
      } catch (err) {
        this.setState({ error: err.toString() })
      }
    }
  }, 300);

  render() {
    // Convert results array into JSX renderable table rows
    let userList = []
    for (let user of this.state.results) {
      userList.push(<tr key={user.id}><td>{ user.displayName }</td><td>{ user.givenName } { user.surname }</td><td>{ user.mail }</td></tr>)
    }

    return <div>
      <input type="text" className="input"  value={this.state.searchTerm} onChange={this.searchChange} placeholder="User name or display name" />
      {userList.length > 0 &&
      <table className="table is-striped is-hoverable">
        <thead>
          <tr>
            <th>Display Name</th><th>Names</th><th>Email</th>
          </tr>
        </thead>
        <tbody>
          {userList}
        </tbody>
      </table>}
      {this.state.error && <div className="notification is-danger mt-4">⚠ {this.state.error}</div>}
    </div>
  }
}

//
// Simple debounce function, pinched from SO
//
function debounce(func, wait) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    const later = function() {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
