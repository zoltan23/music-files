const initialState = {
    firstName: '', 
    lastName: ''
}

const userInfoReducer = (state = initialState, action) => {
    console.log('Action!', action)
    switch(action.type) {
        case 'SET_FIRSTNAME':
            return {
                ...state,
                firstName: action.firstName
            }    
        case 'SET_LASTNAME':
            return {
                ...state,
                lastName: action.lastName
            }              
        default:
            return state
    }
}

export default userInfoReducer