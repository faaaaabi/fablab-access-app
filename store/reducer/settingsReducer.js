const initialState = {
  host: '10.2.236.38:8083',
  deviceName: null,
}

const reducer = (state = initialState, action) => {
  switch ( action.type ) {
      case 'HOST_CHANGED':
      return {
          ...state,
          host: action.value
      }
      case 'DEVICE_CHANGED':
      return {
          ...state,
          deviceName: action.value
      }
  }
  return state;
}

export default reducer;