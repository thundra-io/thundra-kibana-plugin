
const initialState = {
    counter: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return{
                ...state,
                counter: state.counter + action.val
            };
        case 'INCREMENT_ODD':
            return{
                ...state,
                counter: state.counter + (  (state.counter % 2 !== 0) ? action.val : 0 )
            };
        case 'DECREMENT':
            return{
                ...state,
                counter: state.counter - action.val
            };
        default:
            return state
    }
}