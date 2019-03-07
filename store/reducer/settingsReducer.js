const initialState = {
  host: '192.168.122.1:8083',
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