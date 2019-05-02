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
    FETCH_FUNCTION_METADATA_COMPARISON_BY_FUNCTION_NAME_STARTED,
    FETCH_FUNCTION_METADATA_COMPARISON_BY_FUNCTION_NAME_SUCCESS,
    FETCH_FUNCTION_METADATA_COMPARISON_BY_FUNCTION_NAME_FAILURE,
    FETCH_FUNCTION_CPU_METRIC_STARTED,
    FETCH_FUNCTION_CPU_METRIC_SUCCESS,
    FETCH_FUNCTION_CPU_METRIC_FAILURE,
    FETCH_FUNCTION_MEMORY_METRIC_STARTED,
    FETCH_FUNCTION_MEMORY_METRIC_SUCCESS,
    FETCH_FUNCTION_MEMORY_METRIC_FAILURE,
    FETCH_FUNCTION_INVOCATION_COUNT_METRIC_STARTED,
    FETCH_FUNCTION_INVOCATION_COUNT_METRIC_SUCCESS,
    FETCH_FUNCTION_INVOCATION_COUNT_METRIC_FAILURE,
    FETCH_FUNCTION_INVOCATION_DURATIONS_METRIC_STARTED,
    FETCH_FUNCTION_INVOCATION_DURATIONS_METRIC_SUCCESS,
    FETCH_FUNCTION_INVOCATION_DURATIONS_METRIC_FAILURE,
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

import { convertByteToMb } from "../../utils";
import moment from "moment";

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
        }).catch((err) => {
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
        }).catch((err) => {
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
        }).catch((err) => {
            // console.log("error - fetchFunctionDataByFunctionName; err: ", err);
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

const compareDataResult = (oldData, newData) => {
    if (oldData === 0) {
        return undefined;
    } else if (typeof oldData !== "number" || typeof newData !== "number") {
        return undefined;
    } else {
        // if newData is bigger returns positive result otherwise returns negative.
        return  Math.round(((newData - oldData) / oldData) * 100);
    }
}

// Fetch function data with comparison
// export const fetchFunctionDataByFunctionName = (httpClient, startTime, functionName) => {
export const fetchFunctionDataComparisonByFunctionName = (httpClient, startTimestamp, endTimestamp, functionName) => {
// export const fetchFunctionDataComparisonByFunctionName = (httpClient) => {

    return dispatch => {
        dispatch(fetchFunctionDataComparisonByFunctionNameStarted());

        let startTimestmap2 = startTimestamp - (endTimestamp - startTimestamp);

        httpClient.get('../api/thundra/invocations-by-function-name-comparison-basic-data', {
            params: {
                startTimestamp: startTimestamp,
                endTimestamp: endTimestamp,
                startTimestamp2: startTimestmap2,
                functionName: functionName,
            }
        }).then((resp) => {
            console.log("success - fetchFunctionDataComparisonByFunctionName; resp: ", resp);

            const funcMeta = resp.data.invocations[0];
            const funcOldBucket = funcMeta.timeBucket.buckets[0];
            const funcNewBucket = funcMeta.timeBucket.buckets[1];

            let func = {};
            func.applicationName = functionName;
            func.stage = funcNewBucket.applicationStage.buckets[0].key;
            func.applicationRuntime = funcNewBucket.applicationRuntime.buckets[0].key;
            func.region = funcNewBucket.functionRegion.buckets[0].key;

            func.averageDuration = Math.round(funcNewBucket.averageDuration['value']);
            func.averageDurationComparison = compareDataResult(funcOldBucket.averageDuration.value, funcNewBucket.averageDuration.value);

            func.invocationCount = funcNewBucket["doc_count"];
            func.invocationCountComparison = compareDataResult(funcOldBucket["doc_count"], funcNewBucket["doc_count"]);

            func.invocationsWithColdStart = funcNewBucket.invocationsWithColdStart["doc_count"];
            func.invocationsWithColdStartComparison = compareDataResult(funcOldBucket.invocationsWithColdStart["doc_count"], funcNewBucket.invocationsWithColdStart["doc_count"]);

            func.invocationsWithError = funcNewBucket.invocationsWithError["doc_count"];
            func.invocationsWithErrorComparison = compareDataResult(funcOldBucket.invocationsWithError["doc_count"],funcNewBucket.invocationsWithError["doc_count"]);

            func.invocationsWithTimeout = funcNewBucket.invocationsWithTimeout["doc_count"];
            func.invocationsWithTimeoutComparison = compareDataResult(funcOldBucket.invocationsWithTimeout["doc_count"], funcNewBucket.invocationsWithTimeout["doc_count"]);

            func.health = 0;
            func.healthComparison = undefined;
            if (typeof func.invocationCount === "number" && func.invocationCount > 0) {
                func.health = Number( (((func.invocationCount - func.invocationsWithError) / func.invocationCount) * 100).toFixed(2) );
                // func.health = Number( ((3/51) * 100).toFixed(2) );
                const invocationCountOld = funcOldBucket["doc_count"];
                const invocationsWithErrorOld = funcOldBucket.invocationsWithError["doc_count"];

                let healthOld = 0;
                if (typeof invocationCountOld === "number" && invocationCountOld > 0) {
                    healthOld = Number( (((invocationCountOld - invocationsWithErrorOld) / invocationCountOld) * 100).toFixed(2) );
                }

                func.healthComparison = compareDataResult(healthOld, func.health);
            }

            func.percentile99th = Math.round(funcNewBucket.durationPercentiles.values["99.0"]);
            func.percentile99thComparison = compareDataResult(funcOldBucket.durationPercentiles.values["99.0"], funcNewBucket.durationPercentiles.values["99.0"]);

            dispatch(fetchFunctionDataComparisonByFunctionNameSuccess(func));
        }).catch((err) => {
            console.log("error - fetchFunctionDataComparisonByFunctionName; err: ", err);
            dispatch(fetchFunctionDataComparisonByFunctionNameFailure(err))
        });
    }
}

const fetchFunctionDataComparisonByFunctionNameStarted = () => ({
    type: FETCH_FUNCTION_METADATA_COMPARISON_BY_FUNCTION_NAME_STARTED
});

const fetchFunctionDataComparisonByFunctionNameSuccess = (functionMetadataComparisonByFunctionName) => ({
    type: FETCH_FUNCTION_METADATA_COMPARISON_BY_FUNCTION_NAME_SUCCESS,
    payload: {
        functionMetadataComparisonByFunctionName: functionMetadataComparisonByFunctionName
    }
});

const fetchFunctionDataComparisonByFunctionNameFailure = (error) => ({
    type: FETCH_FUNCTION_METADATA_COMPARISON_BY_FUNCTION_NAME_FAILURE,
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
        }).catch((err) => {
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
            let metrics = {
                "app.usedMemory": 0,
                "app.maxMemory": 0
            };
            if (resp.data.memoryMetricByTransaction.hits.hits[0]) {
                metrics = resp.data.memoryMetricByTransaction.hits.hits[0]._source.metrics;
            }

            const memoryMetric = {
                usedMemory: convertByteToMb(metrics["app.usedMemory"]),
                maxMemory: convertByteToMb(metrics["app.maxMemory"])
            }

            dispatch(fetchInvocationMemoryMetricSuccess(memoryMetric));
        }).catch((err) => {
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
            let metrics = {
                "app.cpuLoad": 0
            };
            if (resp.data.cpuMetricByTransaction.hits.hits[0]) {
                metrics = resp.data.cpuMetricByTransaction.hits.hits[0]._source.metrics;
            }

            const cpuMetric = {
                appCPULoad: Number((metrics["app.cpuLoad"] * 100).toFixed(2)) || 0,
            }

            dispatch(fetchInvocationCPUMetricSuccess(cpuMetric));
        }).catch((err) => {
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

export const fetchMetricsPageGraphs = (httpClient, functionName, startTimestamp, endTimestamp) => {
    return dispatch => {
        // dispatch(fetchFunctionCPUMetricGraphDataStarted());


        httpClient.get('../api/thundra/invocations-v2-by-function-name', {
            params: {
                startTimeStamp: startTimestamp,
                functionName: functionName,
            }
        }).then((resp) => {
            console.log("success - fetchMetricsPageGraphs/fetchFunctionDataByFunctionName; resp: ", resp);

            const funcMeta = resp.data.invocations[0];

            let func = {};
            func.applicationName = functionName;

            func.stage = funcMeta.key;

            const funcRegion = funcMeta.groupByRegion.buckets[0];
            func.region = funcRegion.key;

            const funcRuntime = funcRegion.groupByApplicationRuntime.buckets[0];
            func.applicationRuntime = funcRuntime.key;

            // console.log("success - fetchMetricsPageGraphs/fetchFunctionDataByFunctionName; func: ", func);
            dispatch(
                fetchFunctionCPUMetricGraphData(httpClient, functionName, startTimestamp, endTimestamp, func.applicationRuntime, func.stage, func.region)
            );

            dispatch(
                fetchFunctionMemoryMetricGraphData(httpClient, functionName, startTimestamp, endTimestamp, func.applicationRuntime, func.stage, func.region)
            );

            dispatch(
                fetchFunctionInvocationCountGraphData(httpClient, functionName, startTimestamp, endTimestamp, func.applicationRuntime, func.stage, func.region)
            );

            dispatch(
                fetchFunctionInvocationDurationsGraphData(httpClient, functionName, startTimestamp, endTimestamp, func.applicationRuntime, func.stage, func.region)
            );



        }).catch((err) => {
            console.log("error - fetchFunctionCPUMetricGraphData/fetchFunctionDataByFunctionName; err: ", err);
            // dispatch(fetchFunctionDataByFunctionNameFailure(err))
        });

    }
}

// export const fetchFunctionCPUMetricGraphData = (httpClient, transactionId) => {
// export const fetchFunctionCPUMetricGraphData = (httpClient, functionName, startTimestamp, endTimestamp) => {
export const fetchFunctionCPUMetricGraphData = (httpClient, functionName, startTimestamp, endTimestamp, applicationRuntime, stage, region) => {

    return dispatch => {
        dispatch(fetchFunctionCPUMetricGraphDataStarted());

        const TIME_INTERVAL = 30;
        const interval = (endTimestamp - startTimestamp) / TIME_INTERVAL;

        httpClient.get('../api/thundra/cpu-metric-by-function-meta-info', {
            params: {
                startTime: moment(startTimestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ"),
                endTime: moment(endTimestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ"),
                interval: interval,
                functionName: functionName,
                runtime: applicationRuntime,
                stage: stage,
                region: region
            }
        }).then((resp) => {
            console.log("AA success - fetchFunctionCPUMetricGraphData; resp: ", resp);
            const { buckets } = resp.data.cpuMetricByFunctionMetaInfo.aggregations.timeSeriesByMetricTime;
            const cpuMetric = buckets.map(bucket => {
                const cpuload = bucket.metrics_d_app_cpuLoad.value || 0
                return {
                    timestamp: bucket.key,
                    cpuload: cpuload,
                    cpuloadPercentage: Math.round(cpuload * 100)
                };
            });

            dispatch(fetchFunctionCPUMetricGraphDataSuccess(cpuMetric));
        }).catch((err) => {
            console.log("error - fetchFunctionCPUMetricGraphData; err: ", err);
            dispatch(fetchFunctionCPUMetricGraphDataFailure(err))
        });

    }
}

const fetchFunctionCPUMetricGraphDataStarted = () => ({
    type: FETCH_FUNCTION_CPU_METRIC_STARTED
});

const fetchFunctionCPUMetricGraphDataSuccess = (functionCPUMetric) => ({
    type: FETCH_FUNCTION_CPU_METRIC_SUCCESS,
    payload: {
        functionCPUMetricByMetadata: functionCPUMetric
    }
});

const fetchFunctionCPUMetricGraphDataFailure = (error) => ({
    type: FETCH_FUNCTION_CPU_METRIC_FAILURE,
    payload: {
        ...error
    }
});


export const fetchFunctionMemoryMetricGraphData = (httpClient, functionName, startTimestamp, endTimestamp, applicationRuntime, stage, region) => {

    return dispatch => {
        dispatch(fetchFunctionMemoryMetricGraphDataStarted());

        const TIME_INTERVAL = 30;
        const interval = (endTimestamp - startTimestamp) / TIME_INTERVAL;

        httpClient.get('../api/thundra/memory-metric-by-function-meta-info', {
            params: {
                startTime: moment(startTimestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ"),
                endTime: moment(endTimestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ"),
                interval: interval,
                functionName: functionName,
                runtime: applicationRuntime,
                stage: stage,
                region: region
            }
        }).then((resp) => {
            console.log("success - fetchFunctionMemoryMetricGraphData; resp: ", resp);

            const { buckets } = resp.data.memoryMetricByFunctionMetaInfo.aggregations.timeSeriesByMetricTime;
            const memoryMetric = buckets.map(bucket => {
                const memory = convertByteToMb(bucket.metrics_l_app_usedMemory.value || 0)
                return {
                    timestamp: bucket.key,
                    usedMemory: Math.round(memory),
                };
            });

            dispatch(fetchFunctionMemoryMetricGraphDataSuccess(memoryMetric));
        }).catch((err) => {
            console.log("error - fetchFunctionMemoryMetricGraphData; err: ", err);
            dispatch(fetchFunctionMemoryMetricGraphDataFailure(err))
        });

    }
}

const fetchFunctionMemoryMetricGraphDataStarted = () => ({
    type: FETCH_FUNCTION_MEMORY_METRIC_STARTED
});

const fetchFunctionMemoryMetricGraphDataSuccess = (functionMemoryMetric) => ({
    type: FETCH_FUNCTION_MEMORY_METRIC_SUCCESS,
    payload: {
        functionMemoryMetricByMetadata: functionMemoryMetric
    }
});

const fetchFunctionMemoryMetricGraphDataFailure = (error) => ({
    type: FETCH_FUNCTION_MEMORY_METRIC_FAILURE,
    payload: {
        ...error
    }
});


export const fetchFunctionInvocationCountGraphData = (httpClient, functionName, startTimestamp, endTimestamp, applicationRuntime, stage, region) => {

    return dispatch => {
        dispatch(fetchFunctionInvocationCountGraphDataStarted());

        const TIME_INTERVAL = 30;
        const interval = (endTimestamp - startTimestamp) / TIME_INTERVAL;

        httpClient.get('../api/thundra/invocation-count-by-function-meta-info', {
            params: {
                startTime: moment(startTimestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ"),
                endTime: moment(endTimestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ"),
                interval: interval,
                functionName: functionName,
                runtime: applicationRuntime,
                stage: stage,
                region: region
            }
        }).then((resp) => {
            console.log("success - fetchFunctionInvocationCountGraphData; resp: ", resp);

            const { buckets } = resp.data.invocationCountByFunctionMetaInfo.aggregations.timeSeriesByStartTime;
            const invocationCounts = buckets.map(bucket => {
                const invocationCount = bucket.doc_count;
                const coldStartCount = bucket.coldStartCount.doc_count;
                const errorCount = bucket.errorCount.doc_count;
                return {
                    timestamp: bucket.key,
                    invocationCount,
                    coldStartCount,
                    errorCount
                };
            });

            dispatch(fetchFunctionInvocationCountGraphDataSuccess(invocationCounts));
        }).catch((err) => {
            // console.log("error - fetchFunctionInvocationCountGraphData; err: ", err);
            dispatch(fetchFunctionInvocationCountGraphDataFailure(err))
        });

    }
}

const fetchFunctionInvocationCountGraphDataStarted = () => ({
    type: FETCH_FUNCTION_INVOCATION_COUNT_METRIC_STARTED
});

const fetchFunctionInvocationCountGraphDataSuccess = (functionInvocationCount) => ({
    type: FETCH_FUNCTION_INVOCATION_COUNT_METRIC_SUCCESS,
    payload: {
        functionInvocationCountMetricByMetadata: functionInvocationCount
    }
});

const fetchFunctionInvocationCountGraphDataFailure = (error) => ({
    type: FETCH_FUNCTION_INVOCATION_COUNT_METRIC_FAILURE,
    payload: {
        ...error
    }
});


export const fetchFunctionInvocationDurationsGraphData = (httpClient, functionName, startTimestamp, endTimestamp, applicationRuntime, stage, region) => {

    return dispatch => {
        dispatch(fetchFunctionInvocationDurationsGraphDataStarted());

        const TIME_INTERVAL = 30;
        const interval = (endTimestamp - startTimestamp) / TIME_INTERVAL;

        httpClient.get('../api/thundra/invocation-duration-by-function-meta-info', {
            params: {
                startTime: moment(startTimestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ"),
                endTime: moment(endTimestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ"),
                interval: interval,
                functionName: functionName,
                runtime: applicationRuntime,
                stage: stage,
                region: region
            }
        }).then((resp) => {
            console.log("success - fetchFunctionInvocationDurationsGraphData; resp: ", resp);

            const { buckets } = resp.data.invocationDurationsByFunctionMetaInfo.aggregations.timeSeriesByStartTime;
            const invocationDurations = buckets.map(bucket => {
                const avgInvocationDuration = Math.round(bucket.avgDuration.value || 0);
                const avgInv99th = bucket.durationPercentiles.values["99.0"] === "NaN" ? 0 : bucket.durationPercentiles.values["99.0"]
                const avgInvocationDuration99th = Math.round(avgInv99th);
                const avgInv95th = bucket.durationPercentiles.values["95.0"] === "NaN" ? 0 : bucket.durationPercentiles.values["95.0"]
                const avgInvocationDuration95th = Math.round(avgInv95th);
                const avgColdStartDuration = Math.round(bucket.coldStartDuration.avgOfDuration.value || 0);
                const avgErrorDuration = Math.round(bucket.errorDuration.avgOfDuration.value || 0);

                return {
                    timestamp: bucket.key,
                    avgInvocationDuration,
                    avgInvocationDuration99th,
                    avgInvocationDuration95th,
                    avgColdStartDuration, // not used anymore
                    avgErrorDuration // ot used anymore
                };
            });

            dispatch(fetchFunctionInvocationDurationsGraphDataSuccess(invocationDurations));
        }).catch((err) => {
            console.log("error - fetchFunctionInvocationDurationsGraphData; err: ", err);
            dispatch(fetchFunctionInvocationDurationsGraphDataFailure(err))
        });

    }
}

const fetchFunctionInvocationDurationsGraphDataStarted = () => ({
    type: FETCH_FUNCTION_INVOCATION_DURATIONS_METRIC_STARTED
});

const fetchFunctionInvocationDurationsGraphDataSuccess = (functionInvocationDurations) => ({
    type: FETCH_FUNCTION_INVOCATION_DURATIONS_METRIC_SUCCESS,
    payload: {
        functionInvocationDurationsMetricByMetadata: functionInvocationDurations
    }
});

const fetchFunctionInvocationDurationsGraphDataFailure = (error) => ({
    type: FETCH_FUNCTION_INVOCATION_DURATIONS_METRIC_FAILURE,
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
        }).catch((err) => {
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

        }).catch((err) => {
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
        }).catch((err) => {
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