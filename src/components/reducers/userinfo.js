const initialState = {
    firstName: '', 
    lastName: '',
    experience: '',
    instrument: '',
    docRef: ''
}

const userInfoReducer = (state = initialState, action) => {
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
        case 'SET_EXPERIENCE':
            return {
                ...state,
                experience: action.experience
            }              
        case 'SET_INSTRUMENT':
            return {
                ...state,
                instrument: action.instrument
            }              
        case 'SET_DOCREF':
            return {
                ...state,
                docRef: action.docRef
            }              
        default:
            return state
    }
}

export default userInfoReducer