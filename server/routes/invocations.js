const thundraIndex = "thundra-invocation-*";
const labIndex = "lab-invocation-*";

const elkIndex = thundraIndex;

export default function (server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
    const { callWithInternalUser } = server.plugins.elasticsearch.getCluster('data');
    server.route(
        {
            path: '/api/thundra/invocations-v2',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    // index: 'thundra-invocation-*',
                    index: elkIndex,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            startTimestamp: {
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
                    // index: 'thundra-invocation-*',
                    index: elkIndex,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            startTimestamp: {
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

    // Compare function metadata by function name
    server.route(
        {
            path: '/api/thundra/invocations-by-function-name-comparison-basic-data',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    // index: 'thundra-invocation-*',
                    index: elkIndex,
                    size: 0,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            // startTime: {
                                            startTimestamp: {
                                                from: req.query.startTimestamp2,
                                                // from: 'now-1h',
                                                to: req.query.endTimestamp,
                                                // to: 'now',
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationName: {
                                                // value: 'user-get-lambda-java-es',
                                                value: req.query.functionName,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        terms: {
                                            applicationStage: [
                                                'es',
                                                ''
                                            ],
                                            boost: 1
                                        }
                                    },
                                    {
                                        term: {
                                            functionRegion: {
                                                value: 'eu-west-1',
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationRuntime: {
                                                value: 'java',
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
                                    field: 'applicationName',
                                    size: 9999,
                                    min_doc_count: 1,
                                    shard_min_doc_count: 0,
                                    show_term_doc_count_error: false,
                                    order: [
                                        {
                                            _count: 'desc'
                                        },
                                        {
                                            _key: 'asc'
                                        }
                                    ]
                                },
                                aggregations: {
                                    timeBucket: {
                                        date_range: {
                                            // field: 'startTime',
                                            field: 'startTimestamp',
                                            ranges: [
                                                {
                                                    // from: 'now-1h',
                                                    from: req.query.startTimestamp,
                                                    // to: 'now'
                                                    to: req.query.endTimestamp
                                                },
                                                {
                                                    // from: 'now-2h',
                                                    from: req.query.startTimestamp2,
                                                    // to: 'now-1h'
                                                    to: req.query.startTimestamp
                                                }
                                            ],
                                            keyed: false
                                        },
                                        aggregations: {
                                            durationPercentiles: {
                                                percentiles: {
                                                    field: 'duration',
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
                                                    field: 'applicationStage',
                                                    size: 10,
                                                    min_doc_count: 1,
                                                    shard_min_doc_count: 0,
                                                    show_term_doc_count_error: false,
                                                    order: [
                                                        {
                                                            _count: 'desc'
                                                        },
                                                        {
                                                            _key: 'asc'
                                                        }
                                                    ]
                                                }
                                            },
                                            applicationRuntime: {
                                                terms: {
                                                    field: 'applicationRuntime',
                                                    size: 10,
                                                    min_doc_count: 1,
                                                    shard_min_doc_count: 0,
                                                    show_term_doc_count_error: false,
                                                    order: [
                                                        {
                                                            _count: 'desc'
                                                        },
                                                        {
                                                            _key: 'asc'
                                                        }
                                                    ]
                                                }
                                            },
                                            functionRegion: {
                                                terms: {
                                                    field: 'functionRegion',
                                                    size: 10,
                                                    min_doc_count: 1,
                                                    shard_min_doc_count: 0,
                                                    show_term_doc_count_error: false,
                                                    order: [
                                                        {
                                                            _count: 'desc'
                                                        },
                                                        {
                                                            _key: 'asc'
                                                        }
                                                    ]
                                                }
                                            },
                                            averageDuration: {
                                                avg: {
                                                    field: 'duration'
                                                }
                                            },
                                            minDuration: {
                                                min: {
                                                    field: 'duration'
                                                }
                                            },
                                            maxDuration: {
                                                max: {
                                                    field: 'duration'
                                                }
                                            },
                                            totalDuration: {
                                                sum: {
                                                    field: 'duration'
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
                                                    field: 'startTimestamp'
                                                }
                                            },
                                            newestInvocationTime: {
                                                max: {
                                                    field: 'startTimestamp'
                                                }
                                            },
                                            estimatedTotalBilledCost: {
                                                sum: {
                                                    field: 'billedCost'
                                                }
                                            },
                                            monthlyEstimatedTotalBilledCost: {
                                                bucket_script: {
                                                    buckets_path: {
                                                        monthlyCost: 'estimatedTotalBilledCost'
                                                    },
                                                    script: {
                                                        source: 'params.monthlyCost * 720.0',
                                                        lang: 'painless'
                                                    },
                                                    gap_policy: 'skip'
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


    // This is to compare function metadata in given timeframe.
    server.route(
        {
            path: '/api/thundra/invocations-by-function-name-comparison-basic-data-v2',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    // index: 'thundra-invocation-*',
                    index: elkIndex,
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
                                                value: "team-notification-sender-lambda-java-es",
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        terms: {
                                            applicationStage: [
                                                "es",
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
            path: '/api/thundra/invocations-get-invocation-span-by-transaction-id',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'thundra-span-*',
                    // index: elkIndex,
                    body: {
                        size: 9999,
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
                    reply({ invocationSpansByTransactionId: response.hits.hits });
                });
            }
        }
    );



    // this is to fetch logs given span/transaction id.
    server.route(
        {
            path: '/api/thundra/invocations-get-invocation-logs-by-transaction-id',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'thundra-log-*',
                    // index: elkIndex,
                    body: {
                        size: 9999,
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
                                    }
                                ],
                                adjust_pure_negative: true,
                                boost: 1
                            }
                        },
                        sort: [
                            {
                                logTimestamp: {
                                    order: 'desc'
                                }
                            }
                        ]
                    }

                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocationLogsByTransactionId: response.hits.hits });
                });
            }
        }
    );

    // 
    // this is to fetch min-max duration of invocations for heatmap given function name.
    server.route(
        {
            path: '/api/thundra/invocations-get-min-max-duration',
            method: 'GET',
            handler(req, reply) {
                // console.log("min-max; req: ", req);

                let query = {
                    // index: 'thundra-invocation-*',
                    index: elkIndex,
                    body: {
                        size: 9999,
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            applicationName: {
                                                value: req.query.functionName,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        terms: {
                                            applicationStage: [
                                                req.query.functionStage,
                                                ''
                                            ],
                                            boost: 1
                                        }
                                    },
                                    {
                                        term: {
                                            functionRegion: {
                                                value: req.query.functionRegion,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationRuntime: {
                                                value: req.query.functionRuntime,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            startTimestamp: {
                                                from: req.query.startTime,
                                                to: req.query.endTime,
                                                include_lower: true,
                                                include_upper: true,
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
                            minDuration: {
                                min: {
                                    field: 'duration'
                                }
                            },
                            maxDuration: {
                                max: {
                                    field: 'duration'
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    // reply({ invocationsMinMaxDuration: response.hits.hits });
                    reply({ invocationsMinMaxDuration: response.aggregations });
                });
            }
        }
    );


    // 
    // this is to fetch invocation heats given min-max durations.
    server.route(
        {
            path: '/api/thundra/invocations-get-heats',
            method: 'GET',
            handler(req, reply) {
                // console.log("heats; req: ", req);

                let query = {
                    // index: 'thundra-invocation-*',
                    index: elkIndex,
                    body: {
                        size: 9999,
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            applicationName: {
                                                value: req.query.functionName,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            startTimestamp: {
                                                from: req.query.startTime,
                                                to: req.query.endTime,
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            duration: {
                                                from: 0,
                                                to: 900000,
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        terms: {
                                            applicationStage: [
                                                req.query.functionStage,
                                                ''
                                            ],
                                            boost: 1
                                        }
                                    },
                                    {
                                        term: {
                                            functionRegion: {
                                                value: req.query.functionRegion,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationRuntime: {
                                                value: req.query.functionRuntime,
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
                            timeSeriesByStartTime: {
                                date_histogram: {
                                    field: 'startTime',
                                    // interval: 36000,
                                    // interval: 36088,
                                    interval: Number(req.query.intervalMillis),
                                    offset: 0,
                                    order: {
                                        _key: 'asc'
                                    },
                                    keyed: false,
                                    min_doc_count: 1
                                },
                                aggregations: {
                                    duration: {
                                        histogram: {
                                            field: 'duration',
                                            // interval: 2990,
                                            interval: req.query.bucketSize,
                                            offset: 0,
                                            order: {
                                                _key: 'asc'
                                            },
                                            keyed: false,
                                            min_doc_count: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocationHeatsRaw: response.aggregations.timeSeriesByStartTime });
                });
            }
        }
    );


    // function invocation counts by function meta info
    server.route(
        {
            path: '/api/thundra/invocation-count-by-function-meta-info',
            method: 'GET',
            handler(req, reply) {
                // console.log("==> ", req.query);
                let query = {
                    // index: 'lab-invocation-*',
                    index: elkIndex,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            applicationName: {
                                                // value: 'user-get-lambda-java-lab',
                                                value: req.query.functionName,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            startTime: {
                                                // from: '2019-03-27 14:10:00.000 +0300',
                                                from: req.query.startTime,
                                                // to: '2019-03-27 15:10:00.000 +0300',
                                                to: req.query.endTime,
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationStage: {
                                                // value: 'lab',
                                                value: req.query.stage,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            functionRegion: {
                                                // value: 'eu-west-1',
                                                value: req.query.region,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationRuntime: {
                                                // value: 'java',
                                                value: req.query.runtime,
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
                            timeSeriesByStartTime: {
                                date_histogram: {
                                    field: 'startTime',
                                    interval: Number(req.query.interval),
                                    offset: 0,
                                    order: {
                                        _key: 'asc'
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
                    reply({ invocationCountByFunctionMetaInfo: response });
                });
            }
        }
    );



    // function invocation durations by function meta info
    server.route(
        {
            path: '/api/thundra/invocation-duration-by-function-meta-info',
            method: 'GET',
            handler(req, reply) {
                // console.log("==> ", req.query);
                let query = {
                    // index: 'lab-invocation-*',
                    index: elkIndex,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            applicationName: {
                                                // value: 'user-get-lambda-java-lab',
                                                value: req.query.functionName,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        range: {
                                            startTime: {
                                                // from: '2019-03-27 14:10:00.000 +0300',
                                                from: req.query.startTime,
                                                // to: '2019-03-27 15:10:00.000 +0300',
                                                to: req.query.endTime,
                                                include_lower: true,
                                                include_upper: true,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationStage: {
                                                // value: 'lab',
                                                value: req.query.stage,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            functionRegion: {
                                                // value: 'eu-west-1',
                                                value: req.query.region,
                                                boost: 1
                                            }
                                        }
                                    },
                                    {
                                        term: {
                                            applicationRuntime: {
                                                // value: 'java',
                                                value: req.query.runtime,
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
                            timeSeriesByStartTime: {
                                date_histogram: {
                                    field: 'startTime',
                                    interval: Number(req.query.interval),
                                    offset: 0,
                                    order: {
                                        _key: 'asc'
                                    },
                                    keyed: false,
                                    min_doc_count: 0
                                },
                                aggregations: {
                                    durationPercentiles: {
                                        percentiles: {
                                            field: 'duration',
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
                                    avgDuration: {
                                        avg: {
                                            field: 'duration'
                                        }
                                    },
                                    coldStartDuration: {
                                        filter: {
                                            term: {
                                                coldStart: {
                                                    value: true,
                                                    boost: 1
                                                }
                                            }
                                        },
                                        aggregations: {
                                            avgOfDuration: {
                                                avg: {
                                                    field: 'duration'
                                                }
                                            }
                                        }
                                    },
                                    errorDuration: {
                                        filter: {
                                            term: {
                                                erroneous: {
                                                    value: true,
                                                    boost: 1
                                                }
                                            }
                                        },
                                        aggregations: {
                                            avgOfDuration: {
                                                avg: {
                                                    field: 'duration'
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
                    reply({ invocationDurationsByFunctionMetaInfo: response });
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
                    // index: 'thundra-invocation-*',
                    index: elkIndex,
                    size: 0,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            startTimestamp: {
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
                    // index: 'thundra-invocation-*',
                    index: elkIndex,
                    size: 0,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        range: {
                                            startTimestamp: {
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
