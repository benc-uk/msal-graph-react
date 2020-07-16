import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { AuthHelper } from './helpers/auth'

export let auth

// Set up MSAL helper
if (process.env.REACT_APP_CLIENT_ID) {
  auth = new AuthHelper(process.env.REACT_APP_CLIENT_ID)
} else {
  alert('REACT_APP_CLIENT_ID is not set, app will not work!')
}

(async () => {
  // Get locally cached user, if present then request a fresh token
  await auth.restoreUser()

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
})()
