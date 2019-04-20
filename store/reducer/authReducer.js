import { 
    SET_TOKEN 
  } from '../actions/actionTypes' 

const initialState = {
  authenticated: false,
  userUID: null,
  intermediateToken: null,
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch ( action.type ) {
      case 'AUTHENTICATED':
          return {
              ...state,
              authenticated: action.value.authenticated,
              userUID: action.value.userUID,
              intermediateToken: action.value.intermediateToken
          }
      case SET_TOKEN:
      return {
          ...state,
          token: action.value
      }
  }
  return state;
}

export default authReducer;