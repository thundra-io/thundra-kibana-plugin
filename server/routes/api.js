export default function (server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
    const { callWithInternalUser } = server.plugins.elasticsearch.getCluster('data');
    const ONE_MINUTE_IN_MILIS = 60000;
    server.route(
        {
            path: '/api/thundra/invocation-count',
            method: 'GET',
            handler(req, reply) {
                let invocationCount = {
                    index: 'lab-invocation-*',
                    body: {
                        query: {
                            range: {
                                collectedTimestamp: {
                                    gte: req.query.startTimeStamp
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', invocationCount).then(response => {
                    reply({ invocationCount: response.hits.total });
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/invocation-counts-per-hour-with-function-name',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
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
                            histogram: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: req.query.interval * ONE_MINUTE_IN_MILIS,
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocationCountPerHour: (response.aggregations.histogram.buckets)});
                });
            }
        }
    );

    server.route(
        {
            path: '/api/thundra/invocation-duration-per-hour-with-function-name',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
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
                        aggs: {
                            sumOfDurations: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: req.query.interval * ONE_MINUTE_IN_MILIS,
                                },
                                aggs: {
                                    duration: {
                                        sum: {
                                            field: "duration"
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ durationPerHour: (response.aggregations.sumOfDurations.buckets)});
                });
            }
        }
    );

    // fetch list of invocations for a given function name.
    server.route(
        {
            path: '/api/thundra/invocations-with-function-name',
            method: 'GET',
            handler(req, reply) {
                let trimmedSortfield = req.query.sortField.slice(8);

                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        from: req.query.paginationFrom,
                        size: req.query.paginationSize,
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
                                }
                            }
                        },
                        sort: [
                            {
                                // finishTimestamp: {
                                [trimmedSortfield]: {
                                    // order: 'desc'
                                    order: req.query.sortDirection
                                }
                            }
                        ]
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    // reply({ invocations: (response.hits.hits)});
                    reply({ invocations: (response.hits)});
                });
            }
        }
    );

    server.route(
        {
            path: '/api/thundra/erronous-invocation-count',
            method: 'GET',
            handler(req, reply) {
                let invocationCount = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            bool: {
                                filter: {
                                    term: {
                                        erroneous: true
                                    }
                                },
                                must: [
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
                callWithInternalUser('search', invocationCount).then(response => {
                    reply({ errorCount: response.hits.total });
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/erronous-invocations',
            method: 'GET',
            handler(req, reply) {
                let invocationCount = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            bool: {
                                filter: {
                                    term: {
                                        erroneous: true
                                    }
                                },
                                must: [
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
                            errAggs: {
                                terms: {
                                    field: "applicationName"
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', invocationCount).then(response => {
                    reply({ erronousFunctions: response.aggregations.errAggs.buckets});
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/cold-start-count',
            method: 'GET',
            handler(req, reply) {
                let coldStartQuery = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            bool: {
                                filter: {
                                    term: {
                                        coldStart: true
                                    }
                                },
                                must: [
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
                callWithInternalUser('search', coldStartQuery).then(response => {
                    reply({ coldStartCount: response.hits.total });
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/cold-start-invocations',
            method: 'GET',
            handler(req, reply) {
                let invocationCount = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            bool: {
                                filter: {
                                    term: {
                                        coldStart: true
                                    }
                                },
                                must: [
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
                            coldStartAggs: {
                                terms: {
                                    field: "applicationName"
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', invocationCount).then(response => {
                    reply({ coldStartFunctions: response.aggregations.coldStartAggs.buckets});
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/estimated-billed-cost',
            method: 'GET',
            handler(req, reply) {
                let billedCostQuery = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            range: {
                                collectedTimestamp: {
                                    gte: req.query.startTimeStamp
                                }
                            }
                        },
                        aggregations: {
                            costAggregation: {
                                sum: {
                                    field: "billedCost"
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', billedCostQuery).then(response => {
                    reply({ estimatedBilledCost: (response.aggregations.costAggregation.value).toFixed(2)});
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/functions',
            method: 'GET',
            handler(req, reply) {
                let appNameQuery = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 1000,
                        query: {
                            range: {
                                collectedTimestamp: {
                                    gte: req.query.startTimeStamp
                                }
                            }
                        },
                        aggregations: {
                            applicationNameAggs: {
                                terms: {
                                    field: "applicationName"
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', appNameQuery).then(response => {
                    reply({ functions: (response.aggregations.applicationNameAggs.buckets)});
                });
            }
        }
    );

    server.route(
        {
            path: '/api/thundra/invocation-counts-per-hour',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            range: {
                                collectedTimestamp: {
                                    gte: req.query.startTimeStamp
                                }
                            }
                        },
                        aggregations: {
                            histogram: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: req.query.interval * ONE_MINUTE_IN_MILIS,
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocationCountPerHour: (response.aggregations.histogram.buckets)});
                });
            }
        }
    );

    server.route(
        {
            path: '/api/thundra/invocation-duration-per-hour',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            range: {
                                collectedTimestamp: {
                                    gte: req.query.startTimeStamp
                                }
                            }
                        },
                        aggs: {
                            sumOfDurations: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: req.query.interval * ONE_MINUTE_IN_MILIS,
                                },
                                aggs: {
                                    duration: {
                                        sum: {
                                            field: "duration"
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ durationPerHour: (response.aggregations.sumOfDurations.buckets)});
                });
            }
        }
    );

}
