const initialState = {
    host: '10.2.236.38:8083',
    apiKey: 'SuperStrongAPIKey',
    deviceName: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ON_SETTINGS_SAVE':
            console.log(action.value);
            return {
                ...state,
                host: action.value.host,
                apiKey: action.value.apiKey,
                deviceName: action.value.deviceName,
            };
        case 'HOST_CHANGED':
            return {
                ...state,
                host: action.value
            };
        case 'API_KEY_CHANGED':
            return {
                ...state,
                apiKey: action.value
            };
        case 'DEVICE_CHANGED':
            return {
                ...state,
                deviceName: action.value
            };
        default: console.log('No matched action')
    }
    return state;
};

export default reducer;