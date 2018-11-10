export default function (server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
    const { callWithInternalUser } = server.plugins.elasticsearch.getCluster('data');
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
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ memoryMetrics: response.hits.hits });
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
                            timeSeriesByStartTime: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: 180000,
                                    offset: 0,
                                    order: {
                                        _key: "asc"
                                    },
                                    keyed: false,
                                    min_doc_count: 0
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ cpuMetrics: response.hits.hits });
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
                                    interval: 1800000,
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
                    reply({ invocations: (response.aggregations.timeSeriesByStartTime.buckets)});
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
                                    interval: 1800000,
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
                    reply({ invocations: (response.aggregations.timeSeriesByStartTime.buckets)});
                });
            }
        }
    );

}
