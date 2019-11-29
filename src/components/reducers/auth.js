export default function authReducer(state = {isLoggedIn: false, email: "", uid: ""}, action) {
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
        case "SET_EMAIL":
            return {
                ...state,
                email: action.payload
            } 
        case "SET_UID":
            return {
                ...state,
                uid: action.payload
            } 
         default:
            return state
    }
}

