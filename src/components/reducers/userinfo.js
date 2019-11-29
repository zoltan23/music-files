export default function userInfoReducer(state = {firstName: "", lastName: ""}, action) {
    switch(action.type) {
        case "SET_FIRSTNAME":
            return {
                ...state,
                firstName: action.payload
            }    
        case "SET_LASTNAME":
            return {
                ...state,
                lastName: action.payload
            }    
          
        default:
            return state
    }
}