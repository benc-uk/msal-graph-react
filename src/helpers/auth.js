// ----------------------------------------------------------------------------
// Copyright (c) Ben Coleman, 2020
// Licensed under the MIT License.
//
// Generic reusable MSAL authentication helper class for MSAL.js v1
// ----------------------------------------------------------------------------

import * as Msal from 'msal'

const LOGIN_SCOPES = JSON.parse(process.env.VUE_APP_LOGIN_SCOPES || null) || [ 'user.read', 'openid', 'profile', 'email' ]

export class AuthHelper {
  //
  // Create the MSAL UserAgentApplication based on clientId
  //
  constructor(clientId) {
    let config = {
      auth: {
        clientId,
        authority: process.env.REACT_APP_AUTHORITY || 'https://login.microsoftonline.com/common/',
        validateAuthority: process.env.REACT_APP_VALIDATE_AUTHORITY === 'false' ? false : true
      },
      cache: {
        cacheLocation: 'localStorage'
      }
    }
    //console.log('### MSAL UserAgentApplication config is\n', config)
    this.msalApp = new Msal.UserAgentApplication(config)
  }

  //
  // Login with Azure AD
  //
  async login() {
    await this.msalApp.loginPopup({
      scopes: LOGIN_SCOPES,
      prompt: 'select_account'
    })
  }

  async logout() {
    this.msalApp.logout()
  }

  //
  // Get the logged in user, returns null if no user logged in
  //
  getAccount() {
    return this.msalApp.getAccount()
  }

  //
  // Call through to acquireTokenSilent or acquireTokenPopup
  //
  async acquireToken(scopes = [ 'user.read' ]) {
    if (!this.msalApp.getAccount()) { return }

    // Set scopes for token request
    const accessTokenRequest = {
      scopes
    }

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
      throw new Error('### accessToken not found in response, that\'s bad')
    }

    return tokenResp.accessToken
  }

  //
  // Clear any stored/cached user
  //
  clearLocalUser() {
    this.msalApp.cacheStorage.clear()
  }
}