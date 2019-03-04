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

export const fetchInvocationsByFunctions = (httpClient, startTime, interval) => {
    // console.log("actions, fetchInvocationsByFunctions; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchInvocationsByFunctionsStarted());

        httpClient.get('../api/thundra/functions', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            // console.log("success - fetchInvocationCounts; resp: ", resp);
            dispatch(fetchInvocationsByFunctionsSuccess(resp.data.functions))
        })
        .catch((err) => {
            // console.log("error - fetchInvocationCounts; err: ", err);
            dispatch(fetchInvocationsByFunctionsFailure(err))
        });

    }
}

const fetchInvocationsByFunctionsStarted = () => ({
    type: FETCH_INVOCATIONS_BY_FUNCTIONS_STARTED
});

const fetchInvocationsByFunctionsSuccess = (invocationsByFunctions) => ({
    type: FETCH_INVOCATIONS_BY_FUNCTIONS_SUCCESS,
    payload: {
        invocationsByFunctions: invocationsByFunctions
    }
});

const fetchInvocationsByFunctionsFailure = (error) => ({
    type: FETCH_INVOCATIONS_BY_FUNCTIONS_FAILURE,
    payload: {
        ...error
    }
});


export const fetchErroneousInvocationsByFunctions = (httpClient, startTime, interval) => {
    // console.log("actions, fetchErroneousInvocationsByFunctions; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchErroneousInvocationsByFunctionsStarted());

        httpClient.get('../api/thundra/erronous-invocations', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            dispatch(fetchErroneousInvocationsByFunctionsSuccess(resp.data.erronousFunctions))
        })
        .catch((err) => {
            dispatch(fetchErroneousInvocationsByFunctionsFailure(err))
        });

    }
}

const fetchErroneousInvocationsByFunctionsStarted = () => ({
    type: FETCH_ERRONEOUS_INVOCATIONS_BY_FUNCTIONS_STARTED
});

const fetchErroneousInvocationsByFunctionsSuccess = (errInvocationsByFunctions) => ({
    type: FETCH_ERRONEOUS_INVOCATIONS_BY_FUNCTIONS_SUCCESS,
    payload: {
        errInvocationsByFunctions: errInvocationsByFunctions
    }
});

const fetchErroneousInvocationsByFunctionsFailure = (error) => ({
    type: FETCH_ERRONEOUS_INVOCATIONS_BY_FUNCTIONS_FAILURE,
    payload: {
        ...error
    }
});


export const fetchColdStartInvocationsByFunctions = (httpClient, startTime, interval) => {
    // console.log("actions, fetchColdStartInvocationsByFunctions; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchColdStartInvocationsByFunctionsStarted());

        httpClient.get('../api/thundra/cold-start-invocations', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            dispatch(fetchColdStartInvocationsByFunctionsSuccess(resp.data.coldStartFunctions))
        })
        .catch((err) => {
            dispatch(fetchColdStartInvocationsByFunctionsFailure(err))
        });

    }
}

const fetchColdStartInvocationsByFunctionsStarted = () => ({
    type: FETCH_COLD_START_INVOCATIONS_BY_FUNCTIONS_STARTED
});

const fetchColdStartInvocationsByFunctionsSuccess = (csInvocationsByFunctions) => ({
    type: FETCH_COLD_START_INVOCATIONS_BY_FUNCTIONS_SUCCESS,
    payload: {
        csInvocationsByFunctions: csInvocationsByFunctions
    }
});

const fetchColdStartInvocationsByFunctionsFailure = (error) => ({
    type: FETCH_COLD_START_INVOCATIONS_BY_FUNCTIONS_FAILURE,
    payload: {
        ...error
    }
});


export const fetchInvocationCountsPerHour = (httpClient, startTime, interval) => {
    // console.log("actions, fetchInvocationCountsPerHour; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchInvocationCountsPerHourStarted());

        httpClient.get('../api/thundra/invocation-counts-per-hour', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            dispatch(fetchInvocationCountsPerHourSuccess(resp.data.invocationCountPerHour))
        })
        .catch((err) => {
            dispatch(fetchInvocationCountsPerHourFailure(err))
        });

    }
}

const fetchInvocationCountsPerHourStarted = () => ({
    type: FETCH_INVOCATION_COUNTS_PER_HOUR_STARTED
});

const fetchInvocationCountsPerHourSuccess = (invocationCountsPerHour) => ({
    type: FETCH_INVOCATION_COUNTS_PER_HOUR_SUCCESS,
    payload: {
        invocationCountsPerHour: invocationCountsPerHour
    }
});

const fetchInvocationCountsPerHourFailure = (error) => ({
    type: FETCH_INVOCATION_COUNTS_PER_HOUR_FAILURE,
    payload: {
        ...error
    }
});


export const fetchInvocationDurationsPerHour = (httpClient, startTime, interval) => {
    // console.log("actions, fetchInvocationDurationsPerHour; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchInvocationDurationsPerHourStarted());

        httpClient.get('../api/thundra/invocation-duration-per-hour', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            dispatch(fetchInvocationDurationsPerHourSuccess(resp.data.durationPerHour))
        })
        .catch((err) => {
            dispatch(fetchInvocationDurationsPerHourFailure(err))
        });

    }
}

const fetchInvocationDurationsPerHourStarted = () => ({
    type: FETCH_INVOCATION_DURATIONS_PER_HOUR_STARTED
});

const fetchInvocationDurationsPerHourSuccess = (invocationDurationsPerHour) => ({
    type: FETCH_INVOCATION_DURATIONS_PER_HOUR_SUCCESS,
    payload: {
        invocationDurationsPerHour: invocationDurationsPerHour
    }
});

const fetchInvocationDurationsPerHourFailure = (error) => ({
    type: FETCH_INVOCATION_DURATIONS_PER_HOUR_FAILURE,
    payload: {
        ...error
    }
});


export const fetchInvocationCountsPerHourByName = (httpClient, startTime, interval, functionName) => {
    // console.log("actions, fetchInvocationCountsPerHour; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchInvocationCountsPerHourByNameStarted());

        httpClient.get('../api/thundra/invocation-counts-per-hour-with-function-name', {
            params: {
                startTimeStamp: startTime,
                interval: interval,
                functionName: functionName
            }
        }).then((resp) => {
            dispatch(fetchInvocationCountsPerHourByNameSuccess(resp.data.invocationCountPerHour))
        })
        .catch((err) => {
            dispatch(fetchInvocationCountsPerHourByNameFailure(err))
        });

    }
}

const fetchInvocationCountsPerHourByNameStarted = () => ({
    type: FETCH_INVOCATION_COUNTS_PER_HOUR_BY_NAME_STARTED
});

const fetchInvocationCountsPerHourByNameSuccess = (invocationCountsPerHour) => ({
    type: FETCH_INVOCATION_COUNTS_PER_HOUR_BY_NAME_SUCCESS,
    payload: {
        invocationCountsPerHour: invocationCountsPerHour
    }
});

const fetchInvocationCountsPerHourByNameFailure = (error) => ({
    type: FETCH_INVOCATION_COUNTS_PER_HOUR_BY_NAME_FAILURE,
    payload: {
        ...error
    }
});


export const fetchInvocationDurationsPerHourByName = (httpClient, startTime, interval, functionName) => {
    // console.log("actions, fetchInvocationDurationsPerHour; httpClient, startTime, interval: ", httpClient, startTime, interval);

    return dispatch => {
        dispatch(fetchInvocationDurationsPerHourByNameStarted());

        httpClient.get('../api/thundra/invocation-duration-per-hour-with-function-name', {
            params: {
                startTimeStamp: startTime,
                interval: interval,
                functionName: functionName
            }
        }).then((resp) => {
            dispatch(fetchInvocationDurationsPerHourByNameSuccess(resp.data.durationPerHour))
        })
        .catch((err) => {
            dispatch(fetchInvocationDurationsPerHourByNameFailure(err))
        });

    }
}

const fetchInvocationDurationsPerHourByNameStarted = () => ({
    type: FETCH_INVOCATION_DURATIONS_PER_HOUR_BY_NAME_STARTED
});

const fetchInvocationDurationsPerHourByNameSuccess = (invocationDurationsPerHour) => ({
    type: FETCH_INVOCATION_DURATIONS_PER_HOUR_BY_NAME_SUCCESS,
    payload: {
        invocationDurationsPerHour: invocationDurationsPerHour
    }
});

const fetchInvocationDurationsPerHourByNameFailure = (error) => ({
    type: FETCH_INVOCATION_DURATIONS_PER_HOUR_BY_NAME_FAILURE,
    payload: {
        ...error
    }
});