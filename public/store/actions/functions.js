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
    FETCH_INVOCATIONS_HEATMAP_FAILURE,
    FETCH_INVOCATION_MEMORY_METRIC_STARTED,
    FETCH_INVOCATION_MEMORY_METRIC_SUCCESS,
    FETCH_INVOCATION_MEMORY_METRIC_FAILURE,
    FETCH_INVOCATION_CPU_METRIC_STARTED,
    FETCH_INVOCATION_CPU_METRIC_SUCCESS,
    FETCH_INVOCATION_CPU_METRIC_FAILURE,
} from "../constants";

import {convertByteToMb} from "../../utils";

export const fetchFunctionList = (httpClient, startTime) => {
    // console.log("fetchFunctionList; httpclient: ", httpClient);
    return dispatch => {
        dispatch(fetchFunctionListStarted());

        httpClient.get('../api/thundra/invocations-v2', {
            params: {
                startTimeStamp: startTime,
            }
        }).then((resp) => {
            console.log("success - fetchFunctionList; resp: ", resp);
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

            let funcs = [];
            for (let funcMeta of resp.data.invocations) {

                let func = {};
                func.applicationName = funcMeta.key;

                const funcStage = funcMeta.groupByApplicationStage.buckets[0];
                func.stage = funcStage.key;

                const funcRegion = funcStage.groupByRegion.buckets[0];
                func.region = funcRegion.key;

                const funcRuntime = funcRegion.groupByApplicationRuntime.buckets[0];
                func.applicationRuntime = funcRuntime.key;

                func.totalDuration = funcRuntime.totalDuration['value'];
                func.minDuration = funcRuntime.minDuration['value'];
                func.maxDuration = funcRuntime.maxDuration['value'];
                // func.averageDuration = funcRuntime.averageDuration['value'].toFixed(2);
                func.averageDuration = Math.round(funcRuntime.averageDuration['value']);

                func.invocationsWithColdStart = funcRuntime.invocationsWithColdStart['doc_count'];
                func.invocationsWithError = funcRuntime.invocationsWithError['doc_count'];
                func.invocationsWithoutError = funcRuntime.invocationsWithoutError['doc_count'];
                func.invocationCount = func.invocationsWithoutError + func.invocationsWithError;
                func.health = Number((func.invocationsWithoutError / func.invocationCount * 100).toFixed(2));

                func.estimatedCost = Number(funcRuntime.estimatedTotalBilledCost.value.toFixed(3));
                // invocation.monthlyCost = Number((invocation.estimatedCost * convertToMonthMultiplier).toFixed(2));

                func.newestInvocationTime = new Date(funcRuntime.newestInvocationTime['value']);
                func.oldestInvocationTime = new Date(funcRuntime.oldestInvocationTime['value']);

                funcs.push(func);
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


export const fetchInvocationsByFunctionName = (httpClient, startTime, interval, functionName, paginationSize, paginationFrom, sortField, sortDirection) => {
    // console.log("fetchInvocationsByFunctionName; httpclient: ", httpClient);
    return dispatch => {
        dispatch(fetchInvocationsByFunctionNameStarted());

        httpClient.get('../api/thundra/invocations-with-function-name', {
            params: {
                startTimeStamp: startTime,
                interval: interval,
                functionName: functionName,
                paginationFrom: paginationFrom,
                paginationSize: paginationSize,
                sortField,
                sortDirection
            }
        }).then((resp) => {
            console.log("success - fetchInvocationsByFunctionName; resp: ", resp);
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

export const fetchFunctionDataByFunctionName = (httpClient, startTime, functionName) => {

    return dispatch => {
        dispatch(fetchFunctionDataByFunctionNameStarted());

        httpClient.get('../api/thundra/invocations-v2-by-function-name', {
            params: {
                startTimeStamp: startTime,
                functionName: functionName,
            }
        }).then((resp) => {
            console.log("success - fetchFunctionDataByFunctionName; resp: ", resp);

            const funcMeta = resp.data.invocations[0];

            let func = {};
            func.applicationName = functionName;

            func.stage = funcMeta.key;

            const funcRegion = funcMeta.groupByRegion.buckets[0];
            func.region = funcRegion.key;

            const funcRuntime = funcRegion.groupByApplicationRuntime.buckets[0];
            func.applicationRuntime = funcRuntime.key;

            func.totalDuration = funcRuntime.totalDuration['value'];
            func.minDuration = funcRuntime.minDuration['value'];
            func.maxDuration = funcRuntime.maxDuration['value'];
            // func.averageDuration = funcRuntime.averageDuration['value'].toFixed(2);
            func.averageDuration = Math.round(funcRuntime.averageDuration['value']);

            func.invocationsWithColdStart = funcRuntime.invocationsWithColdStart['doc_count'];
            func.invocationsWithError = funcRuntime.invocationsWithError['doc_count'];
            func.invocationsWithoutError = funcRuntime.invocationsWithoutError['doc_count'];
            func.invocationCount = func.invocationsWithoutError + func.invocationsWithError;
            func.health = Number((func.invocationsWithoutError / func.invocationCount * 100).toFixed(2));

            func.estimatedCost = Number(funcRuntime.estimatedTotalBilledCost.value.toFixed(3));
            // invocation.monthlyCost = Number((invocation.estimatedCost * convertToMonthMultiplier).toFixed(2));

            func.newestInvocationTime = new Date(funcRuntime.newestInvocationTime['value']);
            func.oldestInvocationTime = new Date(funcRuntime.oldestInvocationTime['value']);

            dispatch(fetchFunctionDataByFunctionNameSuccess(func));

            // const endTime = new Date().getTime(); // current time as timestamp
            // dispatch(fetchInvocationsHeatMap(httpClient, functionName, func.stage, funcRegion.key, funcRuntime.key, startTime, endTime));
        })
            .catch((err) => {
                console.log("error - fetchFunctionDataByFunctionName; err: ", err);
                dispatch(fetchFunctionDataByFunctionNameFailure(err))
            });

    }
}

const fetchFunctionDataByFunctionNameStarted = () => ({
    type: FETCH_FUNCTION_METADATA_BY_FUNCTION_NAME_STARTED
});

const fetchFunctionDataByFunctionNameSuccess = (functionMetadataByFunctionName) => ({
    type: FETCH_FUNCTION_METADATA_BY_FUNCTION_NAME_SUCCESS,
    payload: {
        functionMetadataByFunctionName: functionMetadataByFunctionName
    }
});

const fetchFunctionDataByFunctionNameFailure = (error) => ({
    type: FETCH_FUNCTION_METADATA_BY_FUNCTION_NAME_FAILURE,
    payload: {
        ...error
    }
});



export const fetchInvocationSpans = (httpClient, transactionId) => {

    return dispatch => {
        dispatch(fetchInvocationSpansStarted());

        httpClient.get('../api/thundra/invocations-get-invocation-span-by-transaction-id', {
            params: {
                transactionId: transactionId
            }
        }).then((resp) => {
            // console.log("success - fetchInvocationSpans; resp: ", resp);
            dispatch(fetchInvocationSpansSuccess(resp.data.invocationSpansByTransactionId));
        })
            .catch((err) => {
                // console.log("error - fetchInvocationSpans; err: ", err);
                dispatch(fetchInvocationSpansFailure(err))
            });

    }
}

const fetchInvocationSpansStarted = () => ({
    type: FETCH_INVOCATION_SPANS_STARTED
});

const fetchInvocationSpansSuccess = (invocationSpans) => ({
    type: FETCH_INVOCATION_SPANS_SUCCESS,
    payload: {
        invocationSpans: invocationSpans
    }
});

const fetchInvocationSpansFailure = (error) => ({
    type: FETCH_INVOCATION_SPANS_FAILURE,
    payload: {
        ...error
    }
});

export const fetchInvocationMemoryMetric = (httpClient, transactionId) => {

    return dispatch => {
        dispatch(fetchInvocationMemoryMetricStarted());

        httpClient.get('../api/thundra/memory-metric-by-transaction-id', {
            params: {
                transactionId: transactionId
            }
        }).then((resp) => {
            console.log("success - fetchInvocationMemoryMetric; resp: ", resp);
            const {metrics} = resp.data.memoryMetricByTransaction.hits.hits[0]._source;
            const memoryMetric = {
                usedMemory: convertByteToMb(metrics["app.usedMemory"]),
                maxMemory: convertByteToMb(metrics["app.maxMemory"])
            }

            dispatch(fetchInvocationMemoryMetricSuccess(memoryMetric));
        })
        .catch((err) => {
            console.log("error - fetchInvocationMemoryMetric; err: ", err);
            dispatch(fetchInvocationMemoryMetricFailure(err))
        });

    }
}

const fetchInvocationMemoryMetricStarted = () => ({
    type: FETCH_INVOCATION_MEMORY_METRIC_STARTED
});

const fetchInvocationMemoryMetricSuccess = (invocationMemoryMetric) => ({
    type: FETCH_INVOCATION_MEMORY_METRIC_SUCCESS,
    payload: {
        invocationMemoryMetric: invocationMemoryMetric
    }
});

const fetchInvocationMemoryMetricFailure = (error) => ({
    type: FETCH_INVOCATION_MEMORY_METRIC_FAILURE,
    payload: {
        ...error
    }
});


export const fetchInvocationCPUMetric = (httpClient, transactionId) => {

    return dispatch => {
        dispatch(fetchInvocationCPUMetricStarted());

        httpClient.get('../api/thundra/cpu-metric-by-transaction-id', {
            params: {
                transactionId: transactionId
            }
        }).then((resp) => {
            console.log("success - fetchInvocationCPUMetric; resp: ", resp);
            const {metrics} = resp.data.cpuMetricByTransaction.hits.hits[0]._source;
            const cpuMetric = {
                appCPULoad: Number((metrics["app.cpuLoad"] * 100).toFixed(2)) || 0,
            }

            dispatch(fetchInvocationCPUMetricSuccess(cpuMetric));
        })
        .catch((err) => {
            console.log("error - fetchInvocationCPUMetric; err: ", err);
            dispatch(fetchInvocationCPUMetricFailure(err))
        });

    }
}

const fetchInvocationCPUMetricStarted = () => ({
    type: FETCH_INVOCATION_CPU_METRIC_STARTED
});

const fetchInvocationCPUMetricSuccess = (invocationCPUMetric) => ({
    type: FETCH_INVOCATION_CPU_METRIC_SUCCESS,
    payload: {
        invocationCPUMetric: invocationCPUMetric
    }
});

const fetchInvocationCPUMetricFailure = (error) => ({
    type: FETCH_INVOCATION_CPU_METRIC_FAILURE,
    payload: {
        ...error
    }
});


export const fetchInvocationLogs = (httpClient, transactionId) => {

    return dispatch => {
        dispatch(fetchInvocationLogsStarted());

        httpClient.get('../api/thundra/invocations-get-invocation-logs-by-transaction-id', {
            params: {
                transactionId: transactionId
            }
        }).then((resp) => {
            // console.log("success - fetchInvocationLogs; resp: ", resp);
            dispatch(fetchInvocationLogsSuccess(resp.data.invocationLogsByTransactionId));
        })
            .catch((err) => {
                // console.log("error - fetchInvocationLogs; err: ", err);
                dispatch(fetchInvocationLogsFailure(err))
            });

    }
}

const fetchInvocationLogsStarted = () => ({
    type: FETCH_INVOCATION_LOGS_STARTED
});

const fetchInvocationLogsSuccess = (invocationLogs) => ({
    type: FETCH_INVOCATION_LOGS_SUCCESS,
    payload: {
        invocationLogs: invocationLogs
    }
});

const fetchInvocationLogsFailure = (error) => ({
    type: FETCH_INVOCATION_LOGS_FAILURE,
    payload: {
        ...error
    }
});


const DURATION_BUCKET_COUNT = 20;
const TIME_BUCKET_COUNT = 100;
export const fetchInvocationsHeatMap = (httpClient, funcName, funcStage, funcRegion, funcRuntime, startTime, endTime) => {

    return dispatch => {
        // dispatch(fetchInvocationsHeatMapStarted());

        httpClient.get('../api/thundra/invocations-get-min-max-duration', {
            params: {
                // transactionId: transactionId
                functionName: funcName,
                functionStage: funcStage,
                functionRegion: funcRegion,
                functionRuntime: funcRuntime,
                startTime: startTime,
                endTime: endTime
            }
        }).then((resp) => {
            const minMaxDuration = resp.data.invocationsMinMaxDuration;

            // Here compute bucket size in terms of duration
            const diff = minMaxDuration.maxDuration.value - minMaxDuration.minDuration.value;
            const bucketSize = (diff < DURATION_BUCKET_COUNT) ? 1 : Math.round(diff / DURATION_BUCKET_COUNT);

            // Here compute time diff (x axes) in terms of millis
            const timeDiff = endTime - startTime;
            const intervalMillis = (timeDiff < TIME_BUCKET_COUNT) ? TIME_BUCKET_COUNT : Math.round(timeDiff / TIME_BUCKET_COUNT);

            console.log("success - min/max - fetchInvocationsHeatMap; resp: ", resp, bucketSize, intervalMillis);
            dispatch(fetchInvocationHeats(httpClient, funcName, funcStage, funcRegion, funcRuntime, startTime, endTime, intervalMillis, bucketSize, minMaxDuration))

        })
            .catch((err) => {
                console.log("error - min/max - fetchInvocationsHeatMap; err: ", err);
                // dispatch(fetchInvocationsHeatMapFailure(err))
            });

    }
}

const fetchInvocationsHeatMapStarted = () => ({
    type: FETCH_INVOCATIONS_HEATMAP_STARTED
});

const fetchInvocationsHeatMapSuccess = (invocationLogs) => ({
    type: FETCH_INVOCATIONS_HEATMAP_SUCCESS,
    payload: {
        invocationLogs: invocationLogs
    }
});

const fetchInvocationsHeatMapFailure = (error) => ({
    type: FETCH_INVOCATIONS_HEATMAP_FAILURE,
    payload: {
        ...error
    }
});



export const fetchInvocationHeats = (httpClient, funcName, funcStage, funcRegion, funcRuntime, startTime, endTime, intervalMillis, bucketSize, minMaxDuration) => {

    return dispatch => {
        dispatch(fetchInvocationHeatsStarted());

        //heats start
        httpClient.get('../api/thundra/invocations-get-heats', {
            params: {
                functionName: funcName,
                functionStage: funcStage,
                functionRegion: funcRegion,
                functionRuntime: funcRuntime,
                startTime: startTime,
                endTime: endTime,
                intervalMillis: intervalMillis,
                bucketSize: bucketSize // duration
            }
        }).then((resp) => {
            let functionHeatMap = {};
            // functionHeatMap.heatMapDurationEnd = minMaxDuration.maxDuration.value;
            functionHeatMap.heatMapDurationEnd = Math.ceil(minMaxDuration.maxDuration.value / bucketSize) * bucketSize;
            // functionHeatMap.heatMapDurationStart = minMaxDuration.minDuration.value;
            functionHeatMap.heatMapDurationStart = Math.floor(minMaxDuration.minDuration.value / bucketSize) * bucketSize;
            functionHeatMap.heatMapDurationGap = bucketSize;

            // Use these times if there is no buckets.
            functionHeatMap.heatMapEndTime = Math.round(endTime / 1000) * 1000;
            functionHeatMap.heatMapStartTime = Math.round(startTime / 1000) * 1000;
            functionHeatMap.heatMapTimeGap = intervalMillis;

            // Align start/end times according to last bucket's time.
            const rawBuckets = resp.data.invocationHeatsRaw.buckets;
            if (rawBuckets.length > 0) {
                const lastBucket = rawBuckets[rawBuckets.length - 1];
                const lastBucketStartTime = lastBucket.key;
                functionHeatMap.heatMapEndTime = lastBucketStartTime + intervalMillis;
                functionHeatMap.heatMapStartTime = functionHeatMap.heatMapEndTime - (TIME_BUCKET_COUNT * intervalMillis);
            }

            // Create rawHeats array based on rawBuckets array.
            let rawHeats = [];
            for (let bucket of rawBuckets) {
                const bucketStartTime = bucket.key;
                const bucketEndTime = bucketStartTime + intervalMillis;

                for (let duration of bucket.duration.buckets) {
                    const durationStart = duration.key;
                    const durationEnd = durationStart + bucketSize;
                    const invocationCount = duration.doc_count;

                    // Same data structure with the console app
                    rawHeats.push({
                        invocationCount,
                        xaxesStartTime: bucketStartTime,
                        xaxesEndTime: bucketEndTime,
                        yaxesStart: durationStart,
                        yaxesEnd: durationEnd
                    });
                }
            }


            // functionHeatMap.heats = resp.data.invocationHeatsRaw.buckets;
            functionHeatMap.heats = rawHeats;

            // dispatch(fetchInvocationHeatsSuccess(resp.data.invocationHeatsRaw.buckets));
            dispatch(fetchInvocationHeatsSuccess(functionHeatMap));
            console.log("success - fetchInvocationHeats; resp, functionHeatMap: ", resp, functionHeatMap);
        })
            .catch((err) => {
                console.log("error - fetchInvocationHeats; err: ", err);
                dispatch(fetchInvocationHeatsFailure(err))
            });

    }
}

const fetchInvocationHeatsStarted = () => ({
    type: FETCH_INVOCATIONS_HEATMAP_STARTED
});

const fetchInvocationHeatsSuccess = (invocationHeats) => ({
    type: FETCH_INVOCATIONS_HEATMAP_SUCCESS,
    payload: {
        invocationHeats: invocationHeats
    }
});

const fetchInvocationHeatsFailure = (error) => ({
    type: FETCH_INVOCATIONS_HEATMAP_FAILURE,
    payload: {
        ...error
    }
});