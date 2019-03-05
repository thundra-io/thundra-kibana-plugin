import {
    FETCH_FUNCTION_LIST_STARTED,
    FETCH_FUNCTION_LIST_SUCCESS,
    FETCH_FUNCTION_LIST_FAILURE,
    FETCH_INVOCATIONS_BY_FUNCTION_NAME_STARTED,
    FETCH_INVOCATIONS_BY_FUNCTION_NAME_SUCCESS,
    FETCH_INVOCATIONS_BY_FUNCTION_NAME_FAILURE
} from "../constants";

const initialState = {
    functionList: [],
    functionListFetching: false,
    functionListError: null,

    invocationsByFunctionName: [],
    invocationsByFunctionNameFetching: false,
    invocationsByFunctionNameError: null
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
                invocationsByFunctionNameFetching: false,
                invocationsByFunctionNameError: action.payload.error
            }
        case FETCH_INVOCATIONS_BY_FUNCTION_NAME_STARTED:
            return {
                ...state,
                invocationsByFunctionNameFetching: true,
                invocationsByFunctionNameError: null
            };
        case FETCH_INVOCATIONS_BY_FUNCTION_NAME_SUCCESS:
            return {
                ...state,
                invocationsByFunctionNameFetching: false,
                invocationsByFunctionNameError: null,
                invocationsByFunctionName: action.payload.invocationsByFunctionName
            };
        case FETCH_INVOCATIONS_BY_FUNCTION_NAME_FAILURE:
            return {
                ...state,
                invocationsByFunctionNameFetching: false,
                invocationsByFunctionNameError: action.payload.error
            }
        default:
            return state;
    }
}