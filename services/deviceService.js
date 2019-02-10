export const getDevicesAsLocationMap = async (apiToken, apiUrl, group) => {
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${apiToken}`);
  const response = await fetch(`http://${apiUrl}/devices/${group}/members/locationmap`, {
    method: 'GET',
    headers
  });
  if (response.status > 299) {
    throw new Error(`Error fetching devices. Statuscode: ${response.status}`);
  } else {
    const responseText = await response.text();
    const responseJSON = JSON.parse(responseText);
    if (!responseJSON.error) {
      return responseJSON.locationMap
    }
    else {
      throw new Error(`Error fetching devicemap: ${responseJSON.error}, Status-Code: ${response.status}`);
    }
  }
}