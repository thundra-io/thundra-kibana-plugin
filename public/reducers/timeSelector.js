let d = new Date();
let date = new Date(d - 3600000);
const initialState = {
    startDate: date.getTime(),
    interval: 10
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_TIME':
            return{
                ...state,
                startDate : action.val,
                interval: action.interval
            };
        default:
            return state
    }
}