// see https://github.com/facebook/react-native/issues/16434
import { URL, URLSearchParams } from "whatwg-url";
global.URL = URL;
global.URLSearchParams = URLSearchParams;

/*
export const getDevicesAsLocationMap = async (apiToken, apiUrl, group) => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${apiToken}`);
  const response = await fetch(
    `http://${apiUrl}/devices/${group}/members/locationmap`,
    {
      method: "GET",
      headers
    }
  );
  if (response.status > 299) {
    throw new Error(`Error fetching devices. Statuscode: ${response.status}`);
  } else {
    const responseText = await response.text();
    const responseJSON = JSON.parse(responseText);
    if (!responseJSON.error) {
      return responseJSON.locationMap;
    } else {
      throw new Error(
        `Error fetching devicemap: ${responseJSON.error}, Status-Code: ${
          response.status
        }`
      );
    }
  }
};*/

export const getPlace = async (apiToken, apiUrl, placeID) => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${apiToken}`);
  const response = await fetch(`http://${apiUrl}/place/${placeID}`, {
    method: "GET",
    headers
  });
  if (response.status > 299) {
    throw new Error(`Error fetching place. Statuscode: ${response.status}`);
  } else {
    const responseText = await response.text();
    const responseJSON = JSON.parse(responseText);
    if (!responseJSON.error) {
      return responseJSON;
    } else {
      throw new Error(
        `Error fetching devicemap: ${responseJSON.error}, Status-Code: ${
          response.status
        }`
      );
    }
  }
};

export const getDevices = async (apiToken, apiUrl, deviceIDs) => {
  let url = new URL(`http://${apiUrl}/devices/`);
  deviceIDs.forEach(deviceID => {
    url.searchParams.append('id', deviceID );
  });
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${apiToken}`);
  const response = await fetch(url, {
    method: "GET",
    headers
  });
  if (response.status > 299) {
    throw new Error(`Error fetching devices. Statuscode: ${response.status}`);
  } else {
    const responseText = await response.text();
    const responseJSON = JSON.parse(responseText);
    if (!responseJSON.error) {
      return responseJSON
    } else {
      throw new Error(
        `Error fetching devices: ${responseJSON.error}, Status-Code: ${
          response.status
        }`
      );
    }
  }
};

export const getDevicesByPlace = async(apiToken, apiUrl, place) => {
  console.log('places: ', place)
  const deviceIDs = place.positions.map(position => {
    return position.deviceID
  })
  
  return await getDevices(apiToken, apiUrl, deviceIDs);
};

export const getDevicesAsLocationMap = async(apiToken, apiUrl, place) => {
  const devices = await getDevicesByPlace(apiToken, apiUrl, place);

  const deviceLocationMap = [];
  place.positions.forEach(position => {
      const coordinates = position.coordinates;
      if(!deviceLocationMap[coordinates[1]]) {
        deviceLocationMap[coordinates[1]] = [];
      }
      deviceLocationMap[coordinates[1]][coordinates[0]] = devices.find(device => device._id === position.deviceID );
  });
  
  // To prevent eliding of keys with value null or undefined 
  const deviceLocationMapAsString = JSON.stringify(deviceLocationMap); 
  return JSON.parse(deviceLocationMapAsString);
}