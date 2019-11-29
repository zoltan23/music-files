export default function reducer(state, action) {
    switch(action.type) {
        case "ISLOGGEDIN_TRUE":
            return {
                ...state,
                isLoggedIn: true
            }    
        case "ISLOGGEDIN_FALSE":
            return {
                ...state,
                isLoggedIn: false
            }    
        default:
            return state
    }
}

