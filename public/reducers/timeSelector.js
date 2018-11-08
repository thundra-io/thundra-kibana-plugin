
const initialState = {
    time: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_TIME':
            return{
                ...state,
                time : action.time
            };
        default:
            return state
    }
}