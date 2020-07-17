// ----------------------------------------------------------------------------
// Copyright (c) Ben Coleman, 2020
// Licensed under the MIT License.
//
// Mostly standard create React app index.js boot-strap code
// ----------------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { AuthHelper } from './helpers/auth'

// Set up MSAL helper, which we export for use globally
// There might be "better" ways to do this, but this works for me
export let auth
if (process.env.REACT_APP_CLIENT_ID) {
  auth = new AuthHelper(process.env.REACT_APP_CLIENT_ID)
} else {
  alert('REACT_APP_CLIENT_ID is not set, app will not work!')
}

(async () => {
  // Try to get locally cached user, and a fresh token for them
  await auth.restoreUser()

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
})()
