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
                };
                callWithInternalUser('search', query).then(response => {
                    reply({ invocations: response.aggregations.groupByApplicationName.buckets });
                });
            }
        }
    );
    
}
