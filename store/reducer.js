const initialState = {
    authenticated: false,
    host: '10.0.2.1:8089',
    deviceName: null
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
    }
    return state;
}

export default reducer;