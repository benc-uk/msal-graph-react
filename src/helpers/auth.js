import * as Msal from 'msal'

const loginRequest = {
  scopes: [ 'user.read' ],
  prompt: 'select_account'
}

const accessTokenRequest = {
  scopes: [ 'user.read', 'user.readbasic.all' ]
}

let msalApp
export let accessToken
let storeClientId

export function initMsal(clientId) {
  storeClientId = clientId
  msalApp = new Msal.UserAgentApplication({
    auth: {
      clientId
      //postLogoutRedirectUri: window.location.href
    },
    cache: {
      cacheLocation: 'localStorage'
    }
  })
}

//
// Login with Azure AD
//
export async function login() {
  await msalApp.loginPopup(loginRequest)

  let tokenResp
  try {
    // 1. Try to acquire token silently
    tokenResp = await msalApp.acquireTokenSilent(accessTokenRequest)
    console.log('### MSAL acquireTokenSilent was successful')
  } catch (tokenErr) {
    // 2. Silent process might have failed so try via popup
    tokenResp = await msalApp.acquireTokenPopup(accessTokenRequest)
    console.log('### MSAL acquireTokenPopup was successful')
  }

  // Just in case check, probably never triggers
  if (!tokenResp.accessToken) {
    throw new Error('Failed to acquire access token')
  }

  accessToken = tokenResp.accessToken
}

//
// Get the logged in user, returns null if no user logged in
//
export function user() {
  if (msalApp) {
    return msalApp.getAccount()
  } else {
    return null
  }
}

//
// Call when starting app (main.js) to restore any session from cache
//
export async function RestoreUser() {
  try {
    // Only try if there is a cached user
    if (msalApp.getAccount()) {
      let tokenResp = await msalApp.acquireTokenSilent(accessTokenRequest)
      console.log('### MSAL acquireTokenSilent from cache was successful')

      if (tokenResp) {
        accessToken = tokenResp.accessToken
        console.log(accessToken)
      } else {
        console.log('### acquireTokenSilent failed, which is probably ok')
      }
    }
  } catch (err) {
    console.log('### RestoreUser failed, which is OK')
  }
}

//
// Call when starting app (index.js) to restore any session from cache
//
export async function authRestoreUser() {
  try {
    // Only try if there is a cached user
    if (msalApp.getAccount()) {
      let tokenResp = await msalApp.acquireTokenSilent(accessTokenRequest)
      console.log('### MSAL acquireTokenSilent from cache was successful')

      if (tokenResp) {
        accessToken = tokenResp.accessToken
      } else {
        this.authUnsetUser()
      }
    }
  } catch (err) {
    console.log('### authRestoreUser failed, which is often OK')
  }
}

//
// Login with Azure AD
//
export async function logout(complete = false) {
  if (complete) {
    // Full logout
    msalApp.logout()
  } else {
    // Local cache removal is local logout
    localStorage.removeItem('msal.idtoken')
    localStorage.removeItem('msal.client.info')
    localStorage.removeItem(`msal.${storeClientId}.idtoken`)
    localStorage.removeItem(`msal.${storeClientId}.client.info`)
    window.location.reload()
  }
}