import {
    FETCH_FUNCTION_LIST_STARTED,
    FETCH_FUNCTION_LIST_SUCCESS,
    FETCH_FUNCTION_LIST_FAILURE
} from "../constants";

const initialState = {
    functionList: [],
    functionListFetching: false,
    functionListError: null
};

export default function functionList(state = initialState, action) {
    switch (action.type) {
        case FETCH_FUNCTION_LIST_STARTED:
            return {
                ...state,
                functionListFetching: true,
                functionListError: null
            };
        case FETCH_FUNCTION_LIST_SUCCESS:
            return {
                ...state,
                functionListFetching: false,
                functionListError: null,
                functionList: action.payload.functionList
            };
        case FETCH_FUNCTION_LIST_FAILURE:
            return {
                ...state,
                functionListFetching: false,
                functionListError: action.payload.error
            }
        default:
            return state;
    }
}