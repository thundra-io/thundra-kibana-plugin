
const initialState = {
    startDate: 1541675862000
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_TIME':
            return{
                ...state,
                startDate : action.val
            };
        default:
            return state
    }
}