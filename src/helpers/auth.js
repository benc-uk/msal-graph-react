import * as Msal from 'msal'

// Modify if required
const loginRequest = {
  scopes: [ 'user.read' ],
  prompt: 'select_account'
}

// Modify if required
const accessTokenRequest = {
  scopes: [ 'user.read', 'user.readbasic.all' ]
}

export class AuthHelper {
  //
  // Create the MSAL UserAgentApplication based on clientId
  //
  constructor(clientId) {
    this.clientId = clientId
    this.accessToken = null
    this.msalApp = new Msal.UserAgentApplication({
      auth: {
        clientId
      },
      cache: {
        cacheLocation: 'localStorage'
      }
    })
  }

  //
  // Login with Azure AD
  //
  async login() {
    await this.msalApp.loginPopup(loginRequest)

    let tokenResp
    try {
      // 1. Try to acquire token silently
      tokenResp = await this.msalApp.acquireTokenSilent(accessTokenRequest)
      console.log('### MSAL acquireTokenSilent was successful')
    } catch (tokenErr) {
      // 2. Silent process might have failed so try via popup
      tokenResp = await this.msalApp.acquireTokenPopup(accessTokenRequest)
      console.log('### MSAL acquireTokenPopup was successful')
    }

    // Just in case check, probably never triggers
    if (!tokenResp.accessToken) {
      throw new Error('Failed to acquire access token')
    }

    this.accessToken = tokenResp.accessToken
  }

  //
  // Get the logged in user, returns null if no user logged in
  //
  user() {
    if (this.msalApp) {
      return this.msalApp.getAccount()
    } else {
      return null
    }
  }

  //
  // Call when starting app (index.js) to restore any session from cache
  //
  async restoreUser() {
    try {
      // Only try if there is a cached user
      if (this.msalApp.getAccount()) {
        let tokenResp = await this.msalApp.acquireTokenSilent(accessTokenRequest)
        console.log('### MSAL acquireTokenSilent from cache was successful')

        if (tokenResp) {
          this.accessToken = tokenResp.accessToken
        } else {
          console.log('### acquireTokenSilent failed, which is probably ok')
        }
      }
    } catch (err) {
      console.log('### restoreUser failed, which is OK')
    }
  }

  //
  // Login with Azure AD
  //
  async logout(complete = false) {
    if (complete) {
      // Full logout
      this.msalApp.logout()
    } else {
      // Local cache removal is local logout
      localStorage.removeItem('msal.idtoken')
      localStorage.removeItem('msal.client.info')
      localStorage.removeItem(`msal.${this.clientId}.idtoken`)
      localStorage.removeItem(`msal.${this.clientId}.client.info`)
      window.location.reload()
    }
  }

  getAccessToken() {
    return this.accessToken
  }
}