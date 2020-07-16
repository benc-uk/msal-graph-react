import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { initMsal, authRestoreUser } from './helpers/auth'

// Set up MSAL helper
if (process.env.REACT_APP_CLIENT_ID) {
  initMsal(process.env.REACT_APP_CLIENT_ID)
} else {
  alert('REACT_APP_CLIENT_ID is not set, app will not work!')
}

(async () => {
  // Get locally cached user, if present then request a fresh token
  await authRestoreUser()

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister()
})()
