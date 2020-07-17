# MSAL & Microsoft Graph - React Sample
Sample application using [MSAL for JS v1](https://github.com/AzureAD/microsoft-authentication-library-for-js) to authenticate against [Azure AD from a single page JS application](https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-javascript-spa).  
After signing in, an access token is requested and used to query the [Microsoft Graph API](https://developer.microsoft.com/en-us/graph)

The app provides demonstration of some fundamental use cases:
- Signing in users from a single page application (SPA)
- Login, logout, user account caching 
- Requesting and using scoped access tokens
- Calling the Microsoft Graph API
- Searching the Microsoft Graph with OData

![screen shot](https://user-images.githubusercontent.com/14982936/87789050-4931a180-c836-11ea-8c97-16b1c7e19895.png)

This app only uses `User.Read` and `User.ReadBasic.All` permissions in the Graph, so does not require admin consent  

The use of a registered *multi-tenant application* and the v2 Azure AD 'common' endpoint is assumed, but single tenanted apps would also work

Note. The MSAL library is used directly rather than 'react-aad-msal' wrapper, as there's enough layers of abstraction to deal with as it is, without one more

# Set Up & Deployment

### Pre-reqs - Register app in Azure AD

Using the Azure CLI
```
az ad app create --display-name="Graph Demo App" \
--oauth2-allow-implicit-flow=true \
--reply-urls="http://localhost:3000" \
--available-to-other-tenants=true \
--query "appId" -o tsv
```
Make a note of the GUID returned, this is the app ID, or client ID

Copy `.env.local.sample` to `.env.local` and place the app ID in the setting `REACT_APP_CLIENT_ID`

### Config Env Variables
 - `REACT_APP_CLIENT_ID` - ***Required.*** To be set as described above
 - `REACT_APP_AUTHORITY` - *Optional.* Only set if you want to use B2C or auth against a specific tenant
 - `REACT_APP_VALIDATE_AUTHORITY` - *Optional.* Boolean true/false, default is true
 - `REACT_APP_LOGIN_SCOPES` - *Optional.* Customize the scopes requested at login (idToken)
 - `REACT_APP_TOKEN_SCOPES` - *Optional.* Customize the scopes requested for accessToken

### Docker
There is a Dockerfile to build the app and serve it via NGINX. The Azure AD client ID needs to be set at build time (as this is a React app)

Run from root of project, and set CLIENT_ID and image tag as required
```bash
docker build . -f deploy/Dockerfile --build-arg CLIENT_ID="CHANGE_ME" -t msal-graph-react
```

# Local Dev

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section in the React docs about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

