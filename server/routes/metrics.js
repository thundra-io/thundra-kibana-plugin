const thundraIndex = "thundra-metric-*";
const labIndex = "lab-metric-*";

const elkIndex = thundraIndex;

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
                    index: 'thundra-metric-*',
                    // index: elkIndex,
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
                    // index: 'thundra-metric-*',
                    index: elkIndex,
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
            path: '/api/thundra/cpu-metric-by-function-meta-info',
            method: 'GET',
            handler(req, reply) {
                // console.log("==> ", req.query);
                let query = {
                    // index: 'lab-metric-*',
                    index: elkIndex,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            metricName: {
                                                value: 'CPUMetric',
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationRuntime: {
                                                value: req.query.runtime,
                                                // value: "python",
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationName: {
                                                value: req.query.functionName,
                                                // value: "list-todo-lambda-python-lab",
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            metricTime: {
                                                // from: '2019-03-26 14:40:00.000 +0300',
                                                from: req.query.startTime,
                                                // from: new Date(req.query.startTime * 1000).toString(),
                                                to: null,
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            metricTime: {
                                                from: null,
                                                // to: '2019-03-26 15:40:00.000 +0300',
                                                to: req.query.endTime,
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        terms: {
                                            applicationStage: [
                                                req.query.stage,
                                                // 'lab',
                                                ''
                                            ],
                                            boost: 1
                                        }
                                    },
                                    {
                                        term: {
                                            'tags.aws_region.keyword': {
                                                value: req.query.region,
                                                // value: "eu-west-1",
                                                boost: 1
                                            }
                                        }
                                    }
                                ],
                                adjust_pure_negative: true,
                                boost: 1
                            }
                        },
                        aggregations: {
                            timeSeriesByMetricTime: {
                                date_histogram: {
                                    field: 'metricTime',
                                    // interval: 120000,
                                    // interval: req.query.interval,
                                    interval: Number(req.query.interval),
                                    offset: 0,
                                    order: {
                                        _key: 'asc'
                                    },
                                    keyed: false,
                                    min_doc_count: 0
                                },
                                aggregations: {
                                    metrics_d_app_cpuLoad: {
                                        avg: {
                                            // field: 'metrics_d_app_cpuLoad'
                                            field: 'metrics.app.cpuLoad'
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ cpuMetricByFunctionMetaInfo: response });
                });
            }
        }
    );


    server.route(
        {
            path: '/api/thundra/memory-metric-by-function-meta-info',
            method: 'GET',
            handler(req, reply) {
                // console.log("==> ", req.query);
                let query = {
                    // index: 'lab-metric-*',
                    index: elkIndex,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            metricName: {
                                                value: 'MemoryMetric',
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationRuntime: {
                                                value: req.query.runtime,
                                                // value: "python",
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationName: {
                                                value: req.query.functionName,
                                                // value: "list-todo-lambda-python-lab",
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            metricTime: {
                                                // from: '2019-03-26 14:40:00.000 +0300',
                                                from: req.query.startTime,
                                                // from: new Date(req.query.startTime * 1000).toString(),
                                                to: null,
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            metricTime: {
                                                from: null,
                                                // to: '2019-03-26 15:40:00.000 +0300',
                                                to: req.query.endTime,
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        terms: {
                                            applicationStage: [
                                                req.query.stage,
                                                // 'lab',
                                                // 'user-honeycomb',
                                                ''
                                            ],
                                            boost: 1
                                        }
                                    },
                                    {
                                        term: {
                                            'tags.aws_region.keyword': {
                                                value: req.query.region,
                                                // value: "eu-west-1",
                                                boost: 1
                                            }
                                        }
                                    }
                                ],
                                adjust_pure_negative: true,
                                boost: 1
                            }
                        },
                        aggregations: {
                            timeSeriesByMetricTime: {
                                date_histogram: {
                                    field: 'metricTime',
                                    // interval: 120000,
                                    interval: Number(req.query.interval),
                                    offset: 0,
                                    order: {
                                        _key: 'asc'
                                    },
                                    keyed: false,
                                    min_doc_count: 0
                                },
                                aggregations: {
                                    memoryPercentiles: {
                                        percentiles: {
                                            // field: 'metrics_l_metrics_app_usedMemory',
                                            field: 'metrics.app.usedMemory',
                                            percents: [
                                                50,
                                                90,
                                                95,
                                                99
                                            ],
                                            keyed: true,
                                            tdigest: {
                                                compression: 100
                                            }
                                        }
                                    },
                                    metrics_l_app_usedMemory: {
                                        avg: {
                                            // field: 'metrics_l_app_usedMemory'
                                            field: 'metrics.app.usedMemory'
                                        }
                                    },
                                    metrics_l_app_maxMemory: {
                                        avg: {
                                            // field: 'metrics_l_app_maxMemory'
                                            field: 'metrics.app.maxMemory'
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ memoryMetricByFunctionMetaInfo: response });
                });
            }
        }
    );

    // TODO: delete
    server.route(
        {
            path: '/api/thundra/memory-metrics',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    // index: 'thundra-metric-*',
                    index: elkIndex,
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
                                            startTimestamp: {
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

    // TODO: delete
    server.route(
        {
            path: '/api/thundra/cpu-metrics',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    // index: 'thundra-metric-*',
                    index: elkIndex,
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
                                            startTimestamp: {
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

}


