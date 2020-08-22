const initialState = { 
    isLoggedIn: true, 
    email: '', 
    uid: '' 
}

const authReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case 'SET_ISLOGGEDIN':
            return {
                ...state,
                isLoggedIn: action.isLoggedIn
            }
        case 'SET_EMAIL':
            return {
                ...state,
                email: action.email
            }
        case 'SET_UID':
            return {
                ...state,
                uid: action.uid
            }
        default:
            return state
    }
}

export default authReducer

