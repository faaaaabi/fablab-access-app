const initialState = {
    authenticated: false,
}

const reducer = (state = initialState, action) => {
    console.log(action.type)
    switch ( action.type ) {
        case 'AUTHENTICATED':
            return {
                authenticated: action.value
            }
    }
    return state;
}

export default reducer;