export default function (server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
    const { callWithInternalUser } = server.plugins.elasticsearch.getCluster('data');
    const ONE_MINUTE_IN_MILIS = 60000;

    server.route(
        {
            path: '/api/thundra/memory-metric-by-transaction-id',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-metric-*',
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            transactionId: {
                                                value: req.query.transactionId,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            metricName: {
                                                value: 'MemoryMetric',
                                                boost: 1
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ memoryMetricByTransaction: response });
                });
            }
        }
    );

    server.route(
        {
            path: '/api/thundra/cpu-metric-by-transaction-id',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-metric-*',
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            transactionId: {
                                                value: req.query.transactionId,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            metricName: {
                                                value: 'CPUMetric',
                                                boost: 1
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ cpuMetricByTransaction: response });
                });
            }
        }
    );


    server.route(
        {
            path: '/api/thundra/memory-metrics',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-metric-*',
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            metricName: {
                                                value: "MemoryMetric"
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationName: {
                                                value: req.query.functionName
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            collectedTimestamp: {
                                                gte: req.query.startTimeStamp
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        aggregations: {
                            timeSeriesByMetricTime: {
                                date_histogram: {
                                    field: "metricTime",
                                    interval: req.query.interval * ONE_MINUTE_IN_MILIS,
                                    offset: 0,
                                    order: {
                                        _key: "asc"
                                    },
                                    keyed: false,
                                    min_doc_count: 0
                                },
                                aggregations: {
                                    metrics_l_app_usedMemory: {
                                        avg: {
                                            field: "metrics_l_app_usedMemory"
                                        }
                                    },
                                    metrics_l_app_maxMemory: {
                                        avg: {
                                            field: "metrics_l_app_maxMemory"
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ memoryMetrics: response.aggregations.timeSeriesByMetricTime.buckets });
                });
            }
        }
    );

    server.route(
        {
            path: '/api/thundra/cpu-metrics',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-metric-*',
                    body: {
                        size: 10,
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            metricName: {
                                                value: "CPUMetric"
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationName: {
                                                value: req.query.functionName
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            collectedTimestamp: {
                                                gte: req.query.startTimeStamp
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        aggregations: {
                            timeSeriesByMetricTime: {
                                date_histogram: {
                                    field: "metricTime",
                                    interval: req.query.interval * ONE_MINUTE_IN_MILIS,
                                    offset: 0,
                                    order: {
                                        _key: "asc"
                                    },
                                    keyed: false,
                                    min_doc_count: 0
                                },
                                aggregations: {
                                    metrics_d_app_cpuLoad: {
                                        avg: {
                                            field: "metrics_d_app_cpuLoad"
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ cpuMetrics: response.aggregations.timeSeriesByMetricTime.buckets });
                });
            }
        }
    );

    server.route(
        {
            path: '/api/thundra/invocations-by-function-name',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    size: 0,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            collectedTimestamp: {
                                                gte: req.query.startTimeStamp
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationName: {
                                                value: req.query.functionName
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        aggregations: {
                            timeSeriesByStartTime: {
                                date_histogram: {
                                    field: "startTime",
                                    interval: "hour",
                                    offset: 0,
                                    order: {
                                        _key: "asc"
                                    },
                                    keyed: false,
                                    min_doc_count: 0
                                },
                                aggregations: {
                                    coldStartCount: {
                                        filter: {
                                            term: {
                                                coldStart: {
                                                    value: true,
                                                    boost: 1
                                                }
                                            }
                                        }
                                    },
                                    errorCount: {
                                        filter: {
                                            term: {
                                                erroneous: {
                                                    value: true,
                                                    boost: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocations: (response.aggregations.timeSeriesByStartTime.buckets) });
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/invocation-durations-by-function-name',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    size: 0,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            collectedTimestamp: {
                                                gte: req.query.startTimeStamp
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationName: {
                                                value: req.query.functionName
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        aggregations: {
                            timeSeriesByStartTime: {
                                date_histogram: {
                                    field: "startTime",
                                    interval: req.query.interval * ONE_MINUTE_IN_MILIS,
                                    offset: 0,
                                    order: {
                                        _key: "asc"
                                    },
                                    keyed: false,
                                    min_doc_count: 0
                                },
                                aggregations: {
                                    avgDuration: {
                                        avg: {
                                            field: "duration"
                                        }
                                    },
                                    coldStartDuration: {
                                        filter: {
                                            term: {
                                                coldStart: {
                                                    value: true
                                                }
                                            }
                                        },
                                        aggregations: {
                                            avgOfDuration: {
                                                avg: {
                                                    field: "duration"
                                                }
                                            }
                                        }
                                    },
                                    errorDuration: {
                                        filter: {
                                            term: {
                                                erroneous: {
                                                    value: true
                                                }
                                            }
                                        },
                                        aggregations: {
                                            avgOfDuration: {
                                                avg: {
                                                    field: "duration"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocations: (response.aggregations.timeSeriesByStartTime.buckets) });
                });
            }
        }
    );

}


