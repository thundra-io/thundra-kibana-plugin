
const initialState = {
    counter: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return{
                ...state,
                counter: state.counter + 1
            };
        case 'INCREMENT_ODD':
            return{
                ...state,
                counter: state.counter + (  (state.counter % 2 !== 0) ? 1 : 0 )
            };
        case 'DECREMENT':
            return{
                ...state,
                counter: state.counter - 1
            };
        default:
            return state
    }
}