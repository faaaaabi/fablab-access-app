const initialState = {
  host: '82.116.117.161:8089',
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