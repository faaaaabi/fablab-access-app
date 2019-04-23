const initialState = {
    host: '10.2.236.38:8083',
    apiKey: 'SuperStrongAPIKey',
    deviceName: 'AccessDevice1',
    debugMode: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ON_SETTINGS_SAVE':
            return {
                ...state,
                host: action.value.host,
                apiKey: action.value.apiKey,
                deviceName: action.value.deviceName,
                debugMode: action.value.debugMode,
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
    }
    return state;
};

export default reducer;