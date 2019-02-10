const initialState = {
  isConnected: null,
}

const reducer = (state = initialState, action) => {
  switch ( action.type ) {
      case 'CONNECTION_STATE_CHANGED':
      return {
          ...state,
          isConnected: action.value
      }
  }
  return state;
}

export default reducer;