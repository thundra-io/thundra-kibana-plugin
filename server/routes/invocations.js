export default function (server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
    const { callWithInternalUser } = server.plugins.elasticsearch.getCluster('data');
    server.route(
        {
            path: '/api/thundra/invocations-v2',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
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
                                    }
                                ],
                                adjust_pure_negative: true,
                                boost: 1
                            }
                        },
                        aggregations: {
                            groupByApplicationName: {
                                terms: {
                                    field: "applicationName",
                                    size: 9999,
                                    min_doc_count: 1,
                                    shard_min_doc_count: 0,
                                    show_term_doc_count_error: false,
                                    order: [
                                        {
                                            _count: "desc"
                                        },
                                        {
                                            _key: "asc"
                                        }
                                    ]
                                },
                                aggregations: {
                                    groupByApplicationStage: {
                                        terms: {
                                            field: "applicationStage",
                                            size: 9999,
                                            min_doc_count: 1,
                                            shard_min_doc_count: 0,
                                            show_term_doc_count_error: false,
                                            order: [{
                                                _count: "desc"
                                            }, {
                                                _key: "asc"
                                            }]
                                        },
                                        aggregations: {
                                            groupByRegion: {
                                                terms: {
                                                    field: "functionRegion",
                                                    size: 9999,
                                                    min_doc_count: 1,
                                                    shard_min_doc_count: 0,
                                                    show_term_doc_count_error: false,
                                                    order: [{
                                                        _count: "desc"
                                                    }, {
                                                        _key: "asc"
                                                    }]
                                                },
                                                aggregations: {
                                                    groupByApplicationRuntime: {
                                                        terms: {
                                                            field: "applicationRuntime",
                                                            size: 9999,
                                                            min_doc_count: 1,
                                                            shard_min_doc_count: 0,
                                                            show_term_doc_count_error: false,
                                                            order: [
                                                                {
                                                                    _count: "desc"
                                                                },
                                                                {
                                                                    _key: "asc"
                                                                }
                                                            ]
                                                        },
                                                        aggregations: {
                                                            averageDuration: {
                                                                avg: {
                                                                    field: "duration"
                                                                }
                                                            },
                                                            minDuration: {
                                                                min: {
                                                                    field: "duration"
                                                                }
                                                            },
                                                            maxDuration: {
                                                                max: {
                                                                    field: "duration"
                                                                }
                                                            },
                                                            totalDuration: {
                                                                sum: {
                                                                    field: "duration"
                                                                }
                                                            },
                                                            invocationsWithError: {
                                                                filter: {
                                                                    term: {
                                                                        erroneous: {
                                                                            value: true,
                                                                            boost: 1
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            invocationsWithoutError: {
                                                                filter: {
                                                                    term: {
                                                                        erroneous: {
                                                                            value: false,
                                                                            boost: 1
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            invocationsWithColdStart: {
                                                                filter: {
                                                                    term: {
                                                                        coldStart: {
                                                                            value: true,
                                                                            boost: 1
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            invocationsWithTimeout: {
                                                                filter: {
                                                                    term: {
                                                                        timeout: {
                                                                            value: true,
                                                                            boost: 1
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            oldestInvocationTime: {
                                                                min: {
                                                                    field: "startTime"
                                                                }
                                                            },
                                                            newestInvocationTime: {
                                                                max: {
                                                                    field: "startTime"
                                                                }
                                                            },
                                                            estimatedTotalBilledCost: {
                                                                sum: {
                                                                    field: "billedCost"
                                                                }
                                                            }
                                                        }
                                                    }
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
                    reply({ invocations: response.aggregations.groupByApplicationName.buckets });
                });
            }
        }
    );


    server.route(
        {
            path: '/api/thundra/invocations-v2-by-function-name',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
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
                                                // value: "user-notification-dispatcher-lambda-java-lab",
                                                value: req.query.functionName,
                                                boost: 1
                                            }
                                        }
                                    },
                                ],
                                adjust_pure_negative: true,
                                boost: 1
                            }
                        },
                        aggregations: {
                            groupByApplicationStage: {
                                terms: {
                                    field: "applicationStage",
                                    size: 9999,
                                    min_doc_count: 1,
                                    shard_min_doc_count: 0,
                                    show_term_doc_count_error: false,
                                    order: [{
                                        _count: "desc"
                                    }, {
                                        _key: "asc"
                                    }]
                                },
                                aggregations: {
                                    groupByRegion: {
                                        terms: {
                                            field: "functionRegion",
                                            size: 9999,
                                            min_doc_count: 1,
                                            shard_min_doc_count: 0,
                                            show_term_doc_count_error: false,
                                            order: [{
                                                _count: "desc"
                                            }, {
                                                _key: "asc"
                                            }]
                                        },
                                        aggregations: {
                                            groupByApplicationRuntime: {
                                                terms: {
                                                    field: "applicationRuntime",
                                                    size: 9999,
                                                    min_doc_count: 1,
                                                    shard_min_doc_count: 0,
                                                    show_term_doc_count_error: false,
                                                    order: [
                                                        {
                                                            _count: "desc"
                                                        },
                                                        {
                                                            _key: "asc"
                                                        }
                                                    ]
                                                },
                                                aggregations: {
                                                    averageDuration: {
                                                        avg: {
                                                            field: "duration"
                                                        }
                                                    },
                                                    minDuration: {
                                                        min: {
                                                            field: "duration"
                                                        }
                                                    },
                                                    maxDuration: {
                                                        max: {
                                                            field: "duration"
                                                        }
                                                    },
                                                    totalDuration: {
                                                        sum: {
                                                            field: "duration"
                                                        }
                                                    },
                                                    invocationsWithError: {
                                                        filter: {
                                                            term: {
                                                                erroneous: {
                                                                    value: true,
                                                                    boost: 1
                                                                }
                                                            }
                                                        }
                                                    },
                                                    invocationsWithoutError: {
                                                        filter: {
                                                            term: {
                                                                erroneous: {
                                                                    value: false,
                                                                    boost: 1
                                                                }
                                                            }
                                                        }
                                                    },
                                                    invocationsWithColdStart: {
                                                        filter: {
                                                            term: {
                                                                coldStart: {
                                                                    value: true,
                                                                    boost: 1
                                                                }
                                                            }
                                                        }
                                                    },
                                                    invocationsWithTimeout: {
                                                        filter: {
                                                            term: {
                                                                timeout: {
                                                                    value: true,
                                                                    boost: 1
                                                                }
                                                            }
                                                        }
                                                    },
                                                    oldestInvocationTime: {
                                                        min: {
                                                            field: "startTime"
                                                        }
                                                    },
                                                    newestInvocationTime: {
                                                        max: {
                                                            field: "startTime"
                                                        }
                                                    },
                                                    estimatedTotalBilledCost: {
                                                        sum: {
                                                            field: "billedCost"
                                                        }
                                                    }
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
                    // reply({ invocations: response.aggregations.groupByApplicationName.buckets });
                    reply({ invocations: response.aggregations.groupByApplicationStage.buckets });
                });
            }
        }
    );



    // This is to compare function metadata in given timeframe.
    server.route(
        {
            path: '/api/thundra/invocations-by-function-name-comparison-basic-data',
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
                                            startTimestamp: {
                                                from: 1551699936612,
                                                to: 1551707136612,
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationName: {
                                                value: "user-notification-dispatcher-lambda-java-lab",
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        terms: {
                                            applicationStage: [
                                                "lab",
                                                ""
                                            ],
                                            boost: 1
                                        }
                                    },
                                    {
                                        term: {
                                            functionRegion: {
                                                value: "eu-west-1",
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationRuntime: {
                                                value: "java",
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
                            groupByApplicationName: {
                                terms: {
                                    field: "applicationName",
                                    size: 9999,
                                    min_doc_count: 1,
                                    shard_min_doc_count: 0,
                                    show_term_doc_count_error: false,
                                    order: [
                                        {
                                            _count: "desc"
                                        },
                                        {
                                            _key: "asc"
                                        }
                                    ]
                                },
                                aggregations: {
                                    timeBucket: {
                                        date_range: {
                                            field: "startTimestamp",
                                            ranges: [
                                                {
                                                    from: 1551699936612,
                                                    to: 1551703536612
                                                },
                                                {
                                                    from: 1551703536612,
                                                    to: 1551707136612
                                                }
                                            ],
                                            keyed: false
                                        },
                                        aggregations: {
                                            memoryPercentiles: {
                                                percentiles: {
                                                    field: "tags_l_aws_lambda_invocation_memory_usage",
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
                                            durationPercentiles: {
                                                percentiles: {
                                                    field: "duration",
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
                                            applicationStage: {
                                                terms: {
                                                    field: "applicationStage",
                                                    size: 10,
                                                    min_doc_count: 1,
                                                    shard_min_doc_count: 0,
                                                    show_term_doc_count_error: false,
                                                    order: [
                                                        {
                                                            _count: "desc"
                                                        },
                                                        {
                                                            _key: "asc"
                                                        }
                                                    ]
                                                }
                                            },
                                            apiKey: {
                                                terms: {
                                                    field: "apiKey",
                                                    size: 10,
                                                    min_doc_count: 1,
                                                    shard_min_doc_count: 0,
                                                    show_term_doc_count_error: false,
                                                    order: [
                                                        {
                                                            _count: "desc"
                                                        },
                                                        {
                                                            _key: "asc"
                                                        }
                                                    ]
                                                },
                                                aggregations: {
                                                    maxStartTimestamp: {
                                                        max: {
                                                            field: "startTimestamp"
                                                        }
                                                    }
                                                }
                                            },
                                            applicationRuntime: {
                                                terms: {
                                                    field: "applicationRuntime",
                                                    size: 10,
                                                    min_doc_count: 1,
                                                    shard_min_doc_count: 0,
                                                    show_term_doc_count_error: false,
                                                    order: [
                                                        {
                                                            _count: "desc"
                                                        },
                                                        {
                                                            _key: "asc"
                                                        }
                                                    ]
                                                }
                                            },
                                            functionRegion: {
                                                terms: {
                                                    field: "functionRegion",
                                                    size: 10,
                                                    min_doc_count: 1,
                                                    shard_min_doc_count: 0,
                                                    show_term_doc_count_error: false,
                                                    order: [
                                                        {
                                                            _count: "desc"
                                                        },
                                                        {
                                                            _key: "asc"
                                                        }
                                                    ]
                                                }
                                            },
                                            averageDuration: {
                                                avg: {
                                                    field: "duration"
                                                }
                                            },
                                            averageMemoryUsage: {
                                                avg: {
                                                    field: "tags_l_aws_lambda_invocation_memory_usage"
                                                }
                                            },
                                            minMemoryUsage: {
                                                min: {
                                                    field: "tags_l_aws_lambda_invocation_memory_usage"
                                                }
                                            },
                                            maxMemoryUsage: {
                                                max: {
                                                    field: "tags_l_aws_lambda_invocation_memory_usage"
                                                }
                                            },
                                            minDuration: {
                                                min: {
                                                    field: "duration"
                                                }
                                            },
                                            maxDuration: {
                                                max: {
                                                    field: "duration"
                                                }
                                            },
                                            totalDuration: {
                                                sum: {
                                                    field: "duration"
                                                }
                                            },
                                            invocationsWithError: {
                                                filter: {
                                                    term: {
                                                        erroneous: {
                                                            value: true,
                                                            boost: 1
                                                        }
                                                    }
                                                }
                                            },
                                            invocationsWithColdStart: {
                                                filter: {
                                                    term: {
                                                        coldStart: {
                                                            value: true,
                                                            boost: 1
                                                        }
                                                    }
                                                }
                                            },
                                            invocationsWithTimeout: {
                                                filter: {
                                                    term: {
                                                        timeout: {
                                                            value: true,
                                                            boost: 1
                                                        }
                                                    }
                                                }
                                            },
                                            oldestInvocationTime: {
                                                min: {
                                                    field: "startTime"
                                                }
                                            },
                                            newestInvocationTime: {
                                                max: {
                                                    field: "startTime"
                                                }
                                            },
                                            estimatedTotalBilledCost: {
                                                sum: {
                                                    field: "billedCost"
                                                }
                                            },
                                            monthlyEstimatedTotalBilledCost: {
                                                bucket_script: {
                                                    buckets_path: {
                                                        monthlyCost: "estimatedTotalBilledCost"
                                                    },
                                                    script: {
                                                        source: "params.monthlyCost * 720.0",
                                                        lang: "painless"
                                                    },
                                                    gap_policy: "skip"
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
                    reply({ invocations: (response.aggregations.groupByApplicationName.buckets) });
                });
            }
        }
    );


    // this is to fetch spans given span id.
    server.route(
        {
            path: '/api/thundra/invocations-get-span-by-invocation-id',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-span-*',
                    body: {
                        size: 9999,
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            transactionId: {
                                                value: 'a4ae221f-9ea6-454f-9777-b8929953e8e9',
                                                boost: 1
                                            }
                                        }
                                    }
                                ],
                                adjust_pure_negative: true,
                                boost: 1
                            }
                        },
                        sort: [
                            {
                                startTimestamp: {
                                    order: 'asc'
                                }
                            },
                            {
                                spanOrder: {
                                    order: 'asc'
                                }
                            }
                        ]
                    }

                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocationSpansByInvocationId: (response) });
                });
            }
        }
    );

}
