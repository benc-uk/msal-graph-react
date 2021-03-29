// ----------------------------------------------------------------------------
// Copyright (c) Ben Coleman, 2020
// Licensed under the MIT License.
//
// React component for doing a directory search using the Graph API
// ----------------------------------------------------------------------------

import React from 'react'
import graph from '../services/graph'

//
// Search component allows for searching for users via MS Graph
//
export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTerm: '', // Term used in search box
      results: [], // Search results
      error: '', // Error message
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
        let data = await graph.searchUsers(this.state.searchTerm, 25)
        this.setState({ results: data.value })
      } catch (err) {
        this.setState({ error: err.toString() })
      }
    }
  }, 300)

  render() {
    // You can't search the graph when signed in with a personal accounts
    // All personally accounts reside in this special tenant
    if (this.props.user.idTokenClaims && this.props.user.idTokenClaims.tid === '9188040d-6c67-4c5b-b112-36a304b66dad') {
      return (
        <div className="notification is-light mt-4">Directory search not supported for personal accounts, sorry!</div>
      )
    }

    // Convert results array into JSX renderable table rows
    let userList = []
    for (let user of this.state.results) {
      userList.push(
        <tr key={user.id}>
          <td>{user.displayName}</td>
          <td>
            {user.givenName} {user.surname}
          </td>
          <td>{user.mail}</td>
        </tr>
      )
    }

    return (
      <div>
        <input
          type="text"
          className="input"
          value={this.state.searchTerm}
          onChange={this.searchChange}
          placeholder="User name or display name"
        />
        {userList.length > 0 && (
          <table className="table is-striped is-hoverable">
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Names</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>{userList}</tbody>
          </table>
        )}
        {this.state.error && (
          <div className="notification is-danger mt-4">
            <span role="img" aria-label="warning-symbol">
              ⚠
            </span>{' '}
            {this.state.error}
          </div>
        )}
      </div>
    )
  }
}

//
// Simple debounce function, pinched from SO
//
function debounce(func, wait) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
