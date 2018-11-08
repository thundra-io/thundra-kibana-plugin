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
                    _source:  ["metrics","collectedTimestamp"],
                    body: {
                        size: 10,
                        sort: [
                            {
                                collectedTimestamp: {
                                    order: "asc"
                                }
                            }
                        ],
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
}
