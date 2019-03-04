import {
    FETCH_INVOCATIONS_BY_FUNCTIONS_STARTED,
    FETCH_INVOCATIONS_BY_FUNCTIONS_SUCCESS,
    FETCH_INVOCATIONS_BY_FUNCTIONS_FAILURE,
    FETCH_ERRONEOUS_INVOCATIONS_BY_FUNCTIONS_STARTED,
    FETCH_ERRONEOUS_INVOCATIONS_BY_FUNCTIONS_SUCCESS,
    FETCH_ERRONEOUS_INVOCATIONS_BY_FUNCTIONS_FAILURE,
    FETCH_COLD_START_INVOCATIONS_BY_FUNCTIONS_STARTED,
    FETCH_COLD_START_INVOCATIONS_BY_FUNCTIONS_SUCCESS,
    FETCH_COLD_START_INVOCATIONS_BY_FUNCTIONS_FAILURE,
    FETCH_INVOCATION_COUNTS_PER_HOUR_STARTED,
    FETCH_INVOCATION_COUNTS_PER_HOUR_SUCCESS,
    FETCH_INVOCATION_COUNTS_PER_HOUR_FAILURE,
    FETCH_INVOCATION_DURATIONS_PER_HOUR_STARTED,
    FETCH_INVOCATION_DURATIONS_PER_HOUR_SUCCESS,
    FETCH_INVOCATION_DURATIONS_PER_HOUR_FAILURE,
    FETCH_INVOCATION_COUNTS_PER_HOUR_BY_NAME_STARTED,
    FETCH_INVOCATION_COUNTS_PER_HOUR_BY_NAME_SUCCESS,
    FETCH_INVOCATION_COUNTS_PER_HOUR_BY_NAME_FAILURE,
    FETCH_INVOCATION_DURATIONS_PER_HOUR_BY_NAME_STARTED,
    FETCH_INVOCATION_DURATIONS_PER_HOUR_BY_NAME_SUCCESS,
    FETCH_INVOCATION_DURATIONS_PER_HOUR_BY_NAME_FAILURE
} from "../constants";

const initialState = {
    invocationsByFunctions: [],
    invocationsByFunctionsFetching: false,
    invocationsByFunctionsError: null,

    errInvocationsByFunctions: [],
    errInvocationsByFunctionsFetching: false,
    errInvocationsByFunctionsError: null,

    csInvocationsByFunctions: [],
    csInvocationsByFunctionsFetching: false,
    csInvocationsByFunctionsError: null,

    invocationCountsPerHour: [],
    invocationCountsPerHourFetching: false,
    invocationCountsPerHourError: null,

    invocationDurationsPerHour: [],
    invocationDurationsPerHourFetching: false,
    invocationDurationsPerHourError: null,
};

export default function invocationsByFunctions(state = initialState, action) {
    switch (action.type) {
        case FETCH_INVOCATIONS_BY_FUNCTIONS_STARTED:
            return {
                ...state,
                invocationsByFunctionsFetching: true,
                invocationsByFunctionsError: null
            };
        case FETCH_INVOCATIONS_BY_FUNCTIONS_SUCCESS:
            return {
                ...state,
                invocationsByFunctionsFetching: false,
                invocationsByFunctionsError: null,
                invocationsByFunctions: action.payload.invocationsByFunctions
            };
        case FETCH_INVOCATIONS_BY_FUNCTIONS_FAILURE:
            return {
                ...state,
                invocationsByFunctionsFetching: false,
                invocationsByFunctionsError: action.payload.error
            }
        case FETCH_ERRONEOUS_INVOCATIONS_BY_FUNCTIONS_STARTED:
            return {
                ...state,
                errInvocationsByFunctionsFetching: true,
                errInvocationsByFunctionsError: null
            };
        case FETCH_ERRONEOUS_INVOCATIONS_BY_FUNCTIONS_SUCCESS:
            return {
                ...state,
                errInvocationsByFunctionsFetching: false,
                errInvocationsByFunctionsError: null,
                errInvocationsByFunctions: action.payload.errInvocationsByFunctions
            };
        case FETCH_ERRONEOUS_INVOCATIONS_BY_FUNCTIONS_FAILURE:
            return {
                ...state,
                errInvocationsByFunctionsFetching: false,
                errInvocationsByFunctionsError: action.payload.error
            }
        case FETCH_COLD_START_INVOCATIONS_BY_FUNCTIONS_STARTED:
            return {
                ...state,
                csInvocationsByFunctionsFetching: true,
                csInvocationsByFunctionsError: null
            };
        case FETCH_COLD_START_INVOCATIONS_BY_FUNCTIONS_SUCCESS:
            return {
                ...state,
                csInvocationsByFunctionsFetching: false,
                csInvocationsByFunctionsError: null,
                csInvocationsByFunctions: action.payload.csInvocationsByFunctions
            };
        case FETCH_COLD_START_INVOCATIONS_BY_FUNCTIONS_FAILURE:
            return {
                ...state,
                csInvocationsByFunctionsFetching: false,
                csInvocationsByFunctionsError: action.payload.error
            }
        case FETCH_INVOCATION_COUNTS_PER_HOUR_STARTED:
            return {
                ...state,
                invocationCountsPerHourFetching: true,
                invocationCountsPerHourError: null
            };
        case FETCH_INVOCATION_COUNTS_PER_HOUR_SUCCESS:
            return {
                ...state,
                invocationCountsPerHourFetching: false,
                invocationCountsPerHourError: null,
                invocationCountsPerHour: action.payload.invocationCountsPerHour
            };
        case FETCH_INVOCATION_COUNTS_PER_HOUR_FAILURE:
            return {
                ...state,
                invocationCountsPerHourFetching: false,
                invocationCountsPerHourError: action.payload.error
            }
        case FETCH_INVOCATION_DURATIONS_PER_HOUR_STARTED:
            return {
                ...state,
                invocationDurationsPerHourFetching: true,
                invocationDurationsPerHourError: null
            };
        case FETCH_INVOCATION_DURATIONS_PER_HOUR_SUCCESS:
            return {
                ...state,
                invocationDurationsPerHourFetching: false,
                invocationDurationsPerHourError: null,
                invocationDurationsPerHour: action.payload.invocationDurationsPerHour
            };
        case FETCH_INVOCATION_DURATIONS_PER_HOUR_FAILURE:
            return {
                ...state,
                invocationDurationsPerHourFetching: false,
                invocationDurationsPerHourError: action.payload.error
            }
        // TODO: BY_NAME version is same as previous count and duration version
        case FETCH_INVOCATION_COUNTS_PER_HOUR_BY_NAME_STARTED:
            return {
                ...state,
                invocationCountsPerHourFetching: true,
                invocationCountsPerHourError: null
            };
        case FETCH_INVOCATION_COUNTS_PER_HOUR_BY_NAME_SUCCESS:
            return {
                ...state,
                invocationCountsPerHourFetching: false,
                invocationCountsPerHourError: null,
                invocationCountsPerHour: action.payload.invocationCountsPerHour
            };
        case FETCH_INVOCATION_COUNTS_PER_HOUR_BY_NAME_FAILURE:
            return {
                ...state,
                invocationCountsPerHourFetching: false,
                invocationCountsPerHourError: action.payload.error
            }
        case FETCH_INVOCATION_DURATIONS_PER_HOUR_BY_NAME_STARTED:
            return {
                ...state,
                invocationDurationsPerHourFetching: true,
                invocationDurationsPerHourError: null
            };
        case FETCH_INVOCATION_DURATIONS_PER_HOUR_BY_NAME_SUCCESS:
            return {
                ...state,
                invocationDurationsPerHourFetching: false,
                invocationDurationsPerHourError: null,
                invocationDurationsPerHour: action.payload.invocationDurationsPerHour
            };
        case FETCH_INVOCATION_DURATIONS_PER_HOUR_BY_NAME_FAILURE:
            return {
                ...state,
                invocationDurationsPerHourFetching: false,
                invocationDurationsPerHourError: action.payload.error
            }
        default:
            return state;
    }
}