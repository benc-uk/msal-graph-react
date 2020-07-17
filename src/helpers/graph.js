const GRAPH_BASE = 'https://graph.microsoft.com/beta'

//
// Get details of user, and return as JSON
// https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http#response-1
//
export async function getSelf(accessToken) {
  let meResp = await fetch(
    `${GRAPH_BASE}/me`,
    {
      headers: { authorization: `bearer ${accessToken}` }
    }
  )
  if (!meResp.ok) { throw new Error(`Graph call to ${GRAPH_BASE}/me failed ${meResp.statusText}`) }
  let data = await meResp.json()
  return data
}

//
// Get user's photo and return as a blob object URL
// https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
//
export async function getPhoto(accessToken) {
  let photoResp = await fetch(
    `${GRAPH_BASE}/me/photos/240x240/$value`,
    {
      headers: { authorization: `bearer ${accessToken}` }
    }
  )
  if (!photoResp.ok) { throw new Error(`Graph call to ${GRAPH_BASE}/me/photo/$value failed ${photoResp.statusText}`) }
  let blob = await photoResp.blob()
  return URL.createObjectURL(blob)
}

//
// Search for users
// https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
//
export async function searchUsers(searchString, accessToken) {
  let searchResp = await fetch(
    `${GRAPH_BASE}/users?$filter=startswith(displayName, '${searchString}') or startswith(userPrincipalName, '${searchString}')&$top=50`,
    {
      headers: { authorization: `bearer ${accessToken}` }
    }
  )
  if (!searchResp.ok) { throw new Error(`Graph call to '${GRAPH_BASE}/users' failed with '${searchResp.statusText}'`) }
  let data = await searchResp.json()
  return data
}