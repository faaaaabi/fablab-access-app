import { 
  SET_TOKEN 
} from './actionTypes' 

export const requestApiAuthentication = async () => {
  console.log('auth action fried');
  return async (dispatch, getState) => {
    try {
      const { host, apiKey } = getState();
      const authResponse = await fetch(`http://${host}/auth/app`, {
        method: 'POST',
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: `deviceID=AccessDevice1&apiKey=${apiKey}`
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