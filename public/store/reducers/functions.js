import {
    FETCH_FUNCTION_LIST_STARTED,
    FETCH_FUNCTION_LIST_SUCCESS,
    FETCH_FUNCTION_LIST_FAILURE,
    FETCH_INVOCATIONS_BY_FUNCTION_NAME_STARTED,
    FETCH_INVOCATIONS_BY_FUNCTION_NAME_SUCCESS,
    FETCH_INVOCATIONS_BY_FUNCTION_NAME_FAILURE,
    FETCH_FUNCTION_METADATA_BY_FUNCTION_NAME_STARTED,
    FETCH_FUNCTION_METADATA_BY_FUNCTION_NAME_SUCCESS,
    FETCH_FUNCTION_METADATA_BY_FUNCTION_NAME_FAILURE,
    FETCH_INVOCATION_SPANS_STARTED,
    FETCH_INVOCATION_SPANS_SUCCESS,
    FETCH_INVOCATION_SPANS_FAILURE,
    FETCH_INVOCATION_LOGS_STARTED,
    FETCH_INVOCATION_LOGS_SUCCESS,
    FETCH_INVOCATION_LOGS_FAILURE,
    FETCH_INVOCATIONS_HEATMAP_STARTED,
    FETCH_INVOCATIONS_HEATMAP_SUCCESS,
    FETCH_INVOCATIONS_HEATMAP_FAILURE
} from "../constants";

const initialState = {
    functionList: [],
    functionListFetching: false,
    functionListError: null,

    functionMetadataByFunctionName: {},
    functionMetadataByFunctionNameFetching: false,
    functionMetadataByFunctionNameError: null,

    invocationsByFunctionName: [],
    invocationsByFunctionNameFetching: false,
    invocationsByFunctionNameError: null,

    invocationSpans: [],
    invocationSpansFetching: false,
    invocationSpansError: null,

    invocationLogs: [],
    invocationLogsFetching: false,
    invocationLogsError: null,

    invocationHeats: {},
    invocationHeatsFetching: false,
    invocationHeatsError: null,
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
        case FETCH_FUNCTION_METADATA_BY_FUNCTION_NAME_STARTED:
            return {
                ...state,
                functionMetadataByFunctionNameFetching: true,
                functionMetadataByFunctionNameError: null
            };
        case FETCH_FUNCTION_METADATA_BY_FUNCTION_NAME_SUCCESS:
            return {
                ...state,
                functionMetadataByFunctionNameFetching: false,
                functionMetadataByFunctionNameError: null,
                functionMetadataByFunctionName: action.payload.functionMetadataByFunctionName
            };
        case FETCH_FUNCTION_METADATA_BY_FUNCTION_NAME_FAILURE:
            return {
                ...state,
                functionMetadataByFunctionNameFetching: false,
                functionMetadataByFunctionNameError: action.payload.error
            }
        case FETCH_INVOCATION_SPANS_STARTED:
            return {
                ...state,
                invocationSpansFetching: true,
                invocationSpansError: null
            };
        case FETCH_INVOCATION_SPANS_SUCCESS:
            return {
                ...state,
                invocationSpansFetching: false,
                invocationSpansError: null,
                invocationSpans: action.payload.invocationSpans
            };
        case FETCH_INVOCATION_SPANS_FAILURE:
            return {
                ...state,
                invocationSpansFetching: false,
                invocationSpansError: action.payload.error
            }
        case FETCH_INVOCATION_LOGS_STARTED:
            return {
                ...state,
                invocationLogsFetching: true,
                invocationLogsError: null
            };
        case FETCH_INVOCATION_LOGS_SUCCESS:
            return {
                ...state,
                invocationLogsFetching: false,
                invocationLogsError: null,
                invocationLogs: action.payload.invocationLogs
            };
        case FETCH_INVOCATION_LOGS_FAILURE:
            return {
                ...state,
                invocationLogsFetching: false,
                invocationLogsError: action.payload.error
            }
        case FETCH_INVOCATIONS_HEATMAP_STARTED:
            return {
                ...state,
                invocationHeatsFetching: true,
                invocationHeatsError: null
            };
        case FETCH_INVOCATIONS_HEATMAP_SUCCESS:
            return {
                ...state,
                invocationHeatsFetching: false,
                invocationHeatsError: null,
                invocationHeats: action.payload.invocationHeats
            };
        case FETCH_INVOCATIONS_HEATMAP_FAILURE:
            return {
                ...state,
                invocationHeatsFetching: false,
                invocationHeatsError: action.payload.error
            }
        default:
            return state;
    }
}