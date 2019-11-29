const initialState = { 
    isLoggedIn: false, 
    email: '', 
    uid: '' 
}

const authReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case 'SET_ISLOGGEDIN':
            console.log('IsLoggedIn!!!', action.isLoggedIn)
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
            console.log('Yea uid!', action.uid)
            return {
                ...state,
                uid: action.uid
            }
        default:
            return state
    }
}

export default authReducer

