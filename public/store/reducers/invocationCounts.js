import {
    FETCH_INVOCATION_COUNT_STARTED,
    FETCH_INVOCATION_COUNT_SUCCESS,
    FETCH_INVOCATION_COUNT_FAILURE,
    FETCH_ERRONEOUS_INVOCATION_COUNT_STARTED,
    FETCH_ERRONEOUS_INVOCATION_COUNT_SUCCESS,
    FETCH_ERRONEOUS_INVOCATION_COUNT_FAILURE,
    FETCH_COLD_START_INVOCATION_COUNT_STARTED,
    FETCH_COLD_START_INVOCATION_COUNT_SUCCESS,
    FETCH_COLD_START_INVOCATION_COUNT_FAILURE,
} from "../constants";
// } from "../actions/invocationCounts";

import { routerActions } from "connected-react-router";

const initialState = {
    invocationCount: 0,
    invocationCountFetching: false,
    invocationCountError: null,

    errInvocationCount: 0,
    errInvocationCountFetching: false,
    errInvocationCountError: null,

    csInvocationCount: 0,
    csInvocationCountFetching: false,
    csInvocationCountError: null,
};

export default function invocationCounts(state = initialState, action) {
    switch (action.type) {
        case FETCH_INVOCATION_COUNT_STARTED:
            return {
                ...state,
                invocationCountFetching: true,
                invocationCountError: null
            };
        case FETCH_INVOCATION_COUNT_SUCCESS:
            return {
                ...state,
                invocationCountFetching: false,
                invocationCountError: null,
                invocationCount: action.payload.invocationCount
            };
        case FETCH_INVOCATION_COUNT_FAILURE:
            return {
                ...state,
                invocationCountFetching: false,
                invocationCountError: action.payload.error
            }
        case FETCH_ERRONEOUS_INVOCATION_COUNT_STARTED:
            return {
                ...state,
                errInvocationCountFetching: true,
                errInvocationCountError: null
            };
        case FETCH_ERRONEOUS_INVOCATION_COUNT_SUCCESS:
            return {
                ...state,
                errInvocationCountFetching: false,
                errInvocationCountError: null,
                errInvocationCount: action.payload.errInvocationCount
            };
        case FETCH_ERRONEOUS_INVOCATION_COUNT_FAILURE:
            return {
                ...state,
                errInvocationCountFetching: false,
                errInvocationCountError: action.payload.error
            }
        case FETCH_COLD_START_INVOCATION_COUNT_STARTED:
            return {
                ...state,
                csInvocationCountFetching: true,
                csInvocationCountError: null
            };
        case FETCH_COLD_START_INVOCATION_COUNT_SUCCESS:
            return {
                ...state,
                csInvocationCountFetching: false,
                csInvocationCountError: null,
                csInvocationCount: action.payload.csInvocationCount
            };
        case FETCH_COLD_START_INVOCATION_COUNT_FAILURE:
            return {
                ...state,
                csInvocationCountFetching: false,
                csInvocationCountError: action.payload.error
            }
        default:
            return state;
    }
}