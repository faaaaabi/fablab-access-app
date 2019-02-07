const initialState = {
  authenticated: false,
  apiKey: 'SuperStrongAPIKey',
  token: null,
}

const authReducer = (state = initialState, action) => {
  console.log(action.type)
  switch ( action.type ) {
      case 'AUTHENTICATED':
          return {
              ...state,
              authenticated: action.value
          }
      case 'TOKEN_RECEIVED':
      return {
          ...state,
          token: action.value
      }
  }
  return state;
}

export default authReducer;