import {
    FETCH_FUNCTION_LIST_STARTED,
    FETCH_FUNCTION_LIST_SUCCESS,
    FETCH_FUNCTION_LIST_FAILURE,
    FETCH_INVOCATIONS_BY_FUNCTION_NAME_STARTED,
    FETCH_INVOCATIONS_BY_FUNCTION_NAME_SUCCESS,
    FETCH_INVOCATIONS_BY_FUNCTION_NAME_FAILURE
} from "../constants";

export const fetchFunctionList = (httpClient, startTime) => {
    // console.log("fetchFunctionList; httpclient: ", httpClient);
    return dispatch => {
        dispatch(fetchFunctionListStarted());

        httpClient.get('../api/thundra/invocations-v2', {
            params: {
                startTimeStamp: startTime,
            }
        }).then((resp) => {
            // console.log("success - fetchFunctionList; resp: ", resp);
            let funcs = [];
            for (let key in resp.data.invocations) {
                let invocation={};
                let obj = resp.data.invocations[key];

                invocation.applicationName = obj.key;
                let groupByApplicationRuntime = obj['groupByApplicationRuntime'];
                let buckets = groupByApplicationRuntime['buckets'];

                for (let i in buckets ){
                    let bucket = buckets[i];
                    invocation.applicationRuntime = bucket.key;
                    invocation.totalDuration = bucket.totalDuration['value'];
                    invocation.minDuration = bucket.minDuration['value'];
                    invocation.maxDuration = bucket.maxDuration['value'];
                    invocation.averageDuration = bucket.averageDuration['value'].toFixed(2);

                    invocation.invocationsWithColdStart = bucket.invocationsWithColdStart['doc_count'];
                    invocation.invocationsWithError = bucket.invocationsWithError['doc_count'];
                    invocation.invocationsWithoutError = bucket.invocationsWithoutError['doc_count'];
                    invocation.invocationCount = invocation.invocationsWithoutError + invocation.invocationsWithError;
                    invocation.health = Number((invocation.invocationsWithoutError / invocation.invocationCount * 100).toFixed(2));

                    invocation.estimatedCost = Number(bucket.estimatedTotalBilledCost.value.toFixed(3));
                    // invocation.monthlyCost = Number((invocation.estimatedCost * convertToMonthMultiplier).toFixed(2));

                    invocation.newestInvocationTime = new Date(bucket.newestInvocationTime['value']);
                    invocation.oldestInvocationTime = new Date(bucket.oldestInvocationTime['value']);

                }
                funcs.push(invocation);
            }

            dispatch(fetchFunctionListSuccess(funcs));
        })
        .catch((err) => {
            // console.log("error - fetchFunctionList; err: ", err);
            dispatch(fetchFunctionListFailure(err))
        });

    }
}

const fetchFunctionListStarted = () => ({
    type: FETCH_FUNCTION_LIST_STARTED
});

const fetchFunctionListSuccess = (functionList) => ({
    type: FETCH_FUNCTION_LIST_SUCCESS,
    payload: {
        functionList: functionList
    }
});

const fetchFunctionListFailure = (error) => ({
    type: FETCH_FUNCTION_LIST_FAILURE,
    payload: {
        ...error
    }
});


export const fetchInvocationsByFunctionName = (httpClient, startTime, interval, functionName, paginationSize, paginationFrom) => {
    // console.log("fetchInvocationsByFunctionName; httpclient: ", httpClient);
    return dispatch => {
        dispatch(fetchInvocationsByFunctionNameStarted());

        httpClient.get('../api/thundra/invocations-with-function-name', {
            params: {
                startTimeStamp: startTime,
                interval: interval,
                functionName: functionName,
                paginationFrom: paginationFrom,
                paginationSize: paginationSize
            }
        }).then((resp) => {
            console.log("success - fetchInvocationsByFunctionName; resp: ", resp);

            // let funcs = [];
            // for (let key in resp.data.invocations) {
            //     let invocation={};
            //     let obj = resp.data.invocations[key];

            //     invocation.applicationName = obj.key;
            //     let groupByApplicationRuntime = obj['groupByApplicationRuntime'];
            //     let buckets = groupByApplicationRuntime['buckets'];

            //     for (let i in buckets ){
            //         let bucket = buckets[i];
            //         invocation.applicationRuntime = bucket.key;
            //         invocation.totalDuration = bucket.totalDuration['value'];
            //         invocation.minDuration = bucket.minDuration['value'];
            //         invocation.maxDuration = bucket.maxDuration['value'];
            //         invocation.averageDuration = bucket.averageDuration['value'].toFixed(2);

            //         invocation.invocationsWithColdStart = bucket.invocationsWithColdStart['doc_count'];
            //         invocation.invocationsWithError = bucket.invocationsWithError['doc_count'];
            //         invocation.invocationsWithoutError = bucket.invocationsWithoutError['doc_count'];
            //         invocation.invocationCount = invocation.invocationsWithoutError + invocation.invocationsWithError;
            //         invocation.health = Number((invocation.invocationsWithoutError / invocation.invocationCount * 100).toFixed(2));

            //         invocation.estimatedCost = Number(bucket.estimatedTotalBilledCost.value.toFixed(3));
            //         // invocation.monthlyCost = Number((invocation.estimatedCost * convertToMonthMultiplier).toFixed(2));

            //         invocation.newestInvocationTime = new Date(bucket.newestInvocationTime['value']);
            //         invocation.oldestInvocationTime = new Date(bucket.oldestInvocationTime['value']);

            //     }
            //     funcs.push(invocation);
            // }

            dispatch(fetchInvocationsByFunctionNameSuccess(resp.data.invocations));
        })
        .catch((err) => {
            // console.log("error - fetchFunctionList; err: ", err);
            dispatch(fetchInvocationsByFunctionNameFailure(err))
        });

    }
}

const fetchInvocationsByFunctionNameStarted = () => ({
    type: FETCH_INVOCATIONS_BY_FUNCTION_NAME_STARTED
});

const fetchInvocationsByFunctionNameSuccess = (invocationsByFunctionName) => ({
    type: FETCH_INVOCATIONS_BY_FUNCTION_NAME_SUCCESS,
    payload: {
        invocationsByFunctionName: invocationsByFunctionName
    }
});

const fetchInvocationsByFunctionNameFailure = (error) => ({
    type: FETCH_INVOCATIONS_BY_FUNCTION_NAME_FAILURE,
    payload: {
        ...error
    }
});