// see https://github.com/facebook/react-native/issues/16434
import {URL, URLSearchParams} from "whatwg-url";
import axios from 'axios';

global.URL = URL;
global.URLSearchParams = URLSearchParams;

export const getPlace = async (apiToken, apiUrl, placeID) => {
  let url = new URL(`http://${apiUrl}/place/${placeID}`);
  const headers = {'Authorization': `Bearer ${apiToken}`};
  try {
    const response = await axios.get(url, {
      headers,
      timeout: 10000
    });
    const responseJSON = response.data;
    if (responseJSON.error) {
      throw new Error(
        `Error getteing place: ${responseJSON.error}, Status-Code: ${response.status}`
      );
    }
    return responseJSON;
  } catch (e) {
    if (e.message.search('timeout') !== -1) {
      throw new Error('API request timed out (getPlace)')
    }
    throw e;
  }


};

export const getDevices = async (apiToken, apiUrl, deviceIDs) => {
  let url = new URL(`http://${apiUrl}/devices/`);
  deviceIDs.forEach(deviceID => {
    url.searchParams.append('id', deviceID);
  });
  const headers = {'Authorization': `Bearer ${apiToken}`};
  try {
    const response = await axios.get(url, {
      headers,
      timeout: 10000
    });
    const responseJSON = response.data;
    if (responseJSON.error) {
      throw new Error(
        `Error getting devices: ${responseJSON.error}, Status-Code: ${response.status}`
      );
    }
    return responseJSON;
  } catch (e) {
    if (e.message.search('timeout') !== -1) {
      throw new Error('API request timed out (getDevices)')
    }
    throw e;
  }

};

export const getDevicesByPlace = async (apiToken, apiUrl, place) => {
  const deviceIDs = place.positions.map(position => {
    return position.deviceID
  })

  return await getDevices(apiToken, apiUrl, deviceIDs);
};

export const getDevicesAsLocationMap = async (apiToken, apiUrl, place) => {
  const devices = await getDevicesByPlace(apiToken, apiUrl, place);

  const deviceLocationMap = [];
  place.positions.forEach(position => {
    const coordinates = position.coordinates;
    if (!deviceLocationMap[coordinates[1]]) {
      deviceLocationMap[coordinates[1]] = [];
    }
    deviceLocationMap[coordinates[1]][coordinates[0]] = devices.find(device => device._id === position.deviceID);
  });

  // To prevent eliding of keys with value null or undefined
  const deviceLocationMapAsString = JSON.stringify(deviceLocationMap);
  return JSON.parse(deviceLocationMapAsString);
}