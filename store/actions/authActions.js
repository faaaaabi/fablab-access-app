import {
  SET_TOKEN
} from './actionTypes'

export const requestApiAuthentication = () => {
  return async (dispatch, getState) => {
    try {
      const { settings, auth } = getState();
      const authResponse = await fetch(`http://${settings.host}/auth/app`, {
        method: 'POST',
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: `deviceID=AccessDevice1&apiKey=${auth.apiKey}`
      })
      const authResponseJSON = await authResponse.json()
      if (authResponseJSON) {
        dispatch({
          type: SET_TOKEN,
          value: authResponseJSON.token
        })
      }
    } catch (e) {
      alert(e);
    }
  }
}