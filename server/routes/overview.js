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
                        size: 0,
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
}
