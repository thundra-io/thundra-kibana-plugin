let d = new Date();
let date = new Date(d - 3600000);
const initialState = {
    startDate: date.getTime()
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