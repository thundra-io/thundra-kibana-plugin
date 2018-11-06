export default function (server) {
    const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
    const { callWithInternalUser } = server.plugins.elasticsearch.getCluster('data');
    server.route(
        {
            path: '/api/thundra/invocation-count',
            method: 'GET',
            handler(req, reply) {
                let invocationCount = {
                    index: 'lab-invocation-*',
                    body: {
                        query: {
                            match_all: {}
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
                                }
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
                                }
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
                                }
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
                                }
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
                        size: 10,
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
            path: '/api/thundra/invocation-count-of-function',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            term: {
                                applicationName: {
                                    value: "team-get-lambda-java-lab"
                                }
                            }
                        },
                        aggregations: {
                            histogram: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: "day"
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocationCountOfFunction: (response.aggregations.histogram.buckets)});
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/invocation-counts-per-day',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        aggregations: {
                            histogram: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: "day"
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocationCountPerDay: (response.aggregations.histogram.buckets)});
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/invocation-counts-per-day-with-function-name',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            term: {
                                applicationName: {
                                    value: req.query.functionName
                                }
                            }
                        },
                        aggregations: {
                            histogram: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: "day"
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocationCountPerDay: (response.aggregations.histogram.buckets)});
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/invocation-duration-per-day',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        aggs: {
                            sumOfDurations: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: "day"
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
                    reply({ durationPerDay: (response.aggregations.sumOfDurations.buckets)});
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/invocation-duration-per-day-with-function-name',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        size: 0,
                        query: {
                            term: {
                                applicationName: {
                                    value: req.query.functionName
                                }
                            }
                        },
                        aggs: {
                            sumOfDurations: {
                                date_histogram: {
                                    field: "collectedTimestamp",
                                    interval: "day"
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
                    reply({ durationPerDay: (response.aggregations.sumOfDurations.buckets)});
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/invocations',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        query: {
                            term: {
                                applicationName: {
                                    value: "team-get-lambda-java-lab"
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocations: (response.hits.hits)});
                });
            }
        }
    );
    server.route(
        {
            path: '/api/thundra/invocations-with-function-name',
            method: 'GET',
            handler(req, reply) {
                let query = {
                    index: 'lab-invocation-*',
                    body: {
                        query: {
                            term: {
                                applicationName: {
                                    value: req.query.functionName
                                }
                            }
                        }
                    }
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocations: (response.hits.hits)});
                });
            }
        }
    );
}
