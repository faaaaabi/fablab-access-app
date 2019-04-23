import {
  SET_TOKEN
} from './actionTypes'
import axios from 'axios';
import qs from 'qs';

export const requestApiAuthentication = () => {
  return async (dispatch, getState) => {
    try {
      const {settings} = getState();
      const authResponse = await axios({
        url: `http://${settings.host}/auth/app`,
        method: 'POST',
        data: qs.stringify({'accessDeviceIdentifier': settings.deviceName, 'apiKey': settings.apiKey}),
        timeout: 10000,
      })
      const authResponseJSON = authResponse.data;
      dispatch({
        type: SET_TOKEN,
        value: authResponseJSON.token
      })
    } catch (e) {
      if (e.message.search('timeout') !== -1) {
        throw new Error('API request timed out (requestApiAuthentication)')
      }
      throw e;
    }
  }
}
