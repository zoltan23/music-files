export default function userInfo(state, action) {
    switch(action.type) {
        case "SET_FIRSTNAME":
            return {
                ...state,
                firstName: "firstName"
            }    
        case "SET_LASTNAME":
            return {
                ...state,
                lastName: "lastName"
            }    
        default:
            return state
    }
}