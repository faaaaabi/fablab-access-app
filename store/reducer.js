const initialState = {
    authenticated: false,
    host: '192.168.0.10:8083',
    deviceName: null,
    isConnected: null
}

const reducer = (state = initialState, action) => {
    console.log(action.type)
    switch ( action.type ) {
        case 'AUTHENTICATED':
            return {
                ...state,
                authenticated: action.value
            }
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
        case 'CONNECTION_STATE_CHANGED':
        return {
            ...state,
            isConnected: action.value
        }
    }
    return state;
}

export default reducer;