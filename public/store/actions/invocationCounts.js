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

export const fetchInvocationCounts = (httpClient, startTime, interval) => {
    // console.log("actions, fetchInvocationCounts; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchInvocationCountStarted());

        // httpClient.get('../../api/thundra/invocation-count', {
        httpClient.get('../api/thundra/invocation-count', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            // console.log("success - fetchInvocationCounts; resp: ", resp);
            dispatch(fetchInvocationCountSuccess(resp.data.invocationCount))
        })
        .catch((err) => {
            // console.log("error - fetchInvocationCounts; err: ", err);
            dispatch(fetchInvocationCountFailure(err))
        });

    }
}

const fetchInvocationCountStarted = () => ({
    type: FETCH_INVOCATION_COUNT_STARTED
});

const fetchInvocationCountSuccess = (count) => ({
    type: FETCH_INVOCATION_COUNT_SUCCESS,
    payload: {
        invocationCount: count
    }
});

const fetchInvocationCountFailure = (error) => ({
    type: FETCH_INVOCATION_COUNT_FAILURE,
    payload: {
        ...error
    }
});

export const fetchErroneousInvocationCounts = (httpClient, startTime, interval) => {
    // console.log("actions, fetchErroneousInvocationCounts; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchErroneousInvocationCountStarted());

        httpClient.get('../api/thundra/erronous-invocation-count', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            dispatch(fetchErroneousInvocationCountSuccess(resp.data.errorCount))
        })
        .catch((err) => {
            dispatch(fetchErroneousInvocationCountFailure(err))
        });

    }
}

const fetchErroneousInvocationCountStarted = () => ({
    type: FETCH_ERRONEOUS_INVOCATION_COUNT_STARTED
});

const fetchErroneousInvocationCountSuccess = (count) => ({
    type: FETCH_ERRONEOUS_INVOCATION_COUNT_SUCCESS,
    payload: {
        errInvocationCount: count
    }
});

const fetchErroneousInvocationCountFailure = (error) => ({
    type: FETCH_ERRONEOUS_INVOCATION_COUNT_FAILURE,
    payload: {
        ...error
    }
});


export const fetchColdStartInvocationCounts = (httpClient, startTime, interval) => {
    // console.log("actions, fetchColdStartInvocationCounts; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchColdStartInvocationCountStarted());

        httpClient.get('../api/thundra/cold-start-count', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            dispatch(fetchColdStartInvocationCountSuccess(resp.data.coldStartCount))
        })
        .catch((err) => {
            dispatch(fetchColdStartInvocationCountFailure(err))
        });

    }
}

const fetchColdStartInvocationCountStarted = () => ({
    type: FETCH_COLD_START_INVOCATION_COUNT_STARTED
});

const fetchColdStartInvocationCountSuccess = (count) => ({
    type: FETCH_COLD_START_INVOCATION_COUNT_SUCCESS,
    payload: {
        csInvocationCount: count
    }
});

const fetchColdStartInvocationCountFailure = (error) => ({
    type: FETCH_COLD_START_INVOCATION_COUNT_FAILURE,
    payload: {
        ...error
    }
});