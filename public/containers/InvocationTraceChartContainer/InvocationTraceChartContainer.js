import React, { Fragment } from 'react';

import {
    Link
} from 'react-router-dom';

import {
    EuiSpacer,
    EuiInMemoryTable,
    EuiLink,
    EuiBasicTable
} from '@elastic/eui';

import {
    fetchInvocationSpans
} from "../../store/actions";

import DetailedTraceSummary from "../../components/DetailedTraceSummary";
import { treeCorrectedForClockSkew, detailedTraceSummary } from '../../zipkin';

import { connect } from "react-redux";


class InvocationTraceChartContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFunctionName: null,
            pageIndex: 0, // this holds the page index for pagination, default => 0
            paginationSize: 10, // 20
            paginationFrom: 0,
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const { transactionId } = this.props.match.params;

        this.props.fetchInvocationSpans(this.props.httpClient, transactionId);
    }

    createMockTraceSummary = () => {
        console.log("createMockTraceSummary; props: ", this.props);

        const { invocationSpans } = this.props;

        const mockTraceSummary = {
            traceId: "trace-1",
            spans:
                [
                    {
                        spanId: "1",
                        spanName: "spanName-1",
                        // parentId: ""
                        childIds: ["2"],
                        serviceName: "serviceName-1",
                        serviceNames: ["serviceName-1-1"],
                        timestamp: 1551965325267,
                        duration: 279,
                        durationStr: "durationStr-1",
                        tags:
                            [
                                { key: "tag-1-1", value: "tag-1-1" },
                                { key: "tag-1-2", value: "tag-1-2" }
                            ],
                        annotations: [
                            {
                                value: "ann-1",
                                timestamp: 1551965325267000,
                                endpoint: "endpoint-1",
                                relativeTime: "anno 1 relativeTime"
                            }
                        ],
                        errorType: "",
                        depth: 1,
                        width: 7,
                        left: 0
                    },
                    {
                        spanId: "2",
                        spanName: "spanName-2",
                        parentId: "1",
                        childIds: ["3"],
                        // childIds: [],
                        serviceName: "serviceName-2",
                        serviceNames: ["serviceName-2-1", "serviceName-2-2"],
                        timestamp: 1551965325267,
                        duration: 209,
                        durationStr: "durationStr-2",
                        tags:
                            [
                                { key: "tag-2-1", value: "tag-2-1" },
                                { key: "tag-2-2", value: "tag-2-2" }
                            ],
                        annotations: [
                            {
                                value: "ann-2",
                                timestamp: 1551965325267,
                                endpoint: "endpoint-2",
                                relativeTime: "anno 2 relative Time"
                            }
                        ],
                        errorType: "",
                        depth: 2,
                        width: 20,
                        left: 40
                    },
                    {
                        spanId: "3",
                        spanName: "spanName-3",
                        parentId: "2",
                        childIds: [],
                        serviceName: "serviceName-3",
                        serviceNames: ["serviceName-3-1"],
                        timestamp: 1551965325267,
                        duration: 209,
                        durationStr: "durationStr-3",
                        tags:
                            [
                                { key: "tag-3-1", value: "tag-3-1" },
                                { key: "tag-3-2", value: "tag-3-2" }
                            ],
                        annotations: [
                            {
                                value: "ann-3",
                                timestamp: 1551965325267,
                                endpoint: "endpoint-3",
                                relativeTime: "anno 3 relative Time"
                            }
                        ],
                        errorType: "",
                        depth: 3,
                        width: 20,
                        left: 40
                    },
                    {
                        spanId: "4",
                        spanName: "spanName-4",
                        parentId: "2",
                        childIds: [],
                        serviceName: "serviceName-4",
                        serviceNames: ["serviceName-4-1"],
                        timestamp: 1551965325267,
                        duration: 209,
                        durationStr: "durationStr-4",
                        tags:
                            [
                                { key: "tag-4-1", value: "tag-4-1" },
                                { key: "tag-4-2", value: "tag-4-2" }
                            ],
                        annotations: [
                            {
                                value: "ann-4",
                                timestamp: 1551965325267,
                                endpoint: "endpoint-4",
                                relativeTime: "anno 4 relative Time"
                            }
                        ],
                        errorType: "error-4",
                        depth: 3,
                        width: 10,
                        left: 50
                    }
                ],
            serviceNameAndSpanCounts:
                [
                    { serviceName: "serviceName-1-aws", spanCount: 2 }
                ],
            duration: 1000,
            durationStr: "duration-str-1000",

            // depth: 1,
            // width: 7,
            // left: 0
        }


        return mockTraceSummary;
    }

    convertThundraInvocationsToTrace = () => {
        const { transactionId } = this.props.match.params;
        const { invocationSpans } = this.props;

        console.log("convertThundraInvocationsToTrace; transactionId, invocationSpans: ", transactionId, invocationSpans);

        // const thundraTrace = [];

        const thundraTrace = invocationSpans.map( rawSpan => {

            const span = rawSpan._source;

            return(
                {
                    traceId: transactionId,
                    parentId: span.parentSpanId || "",
                    id: span.id,
                    name: span.domainName + " " + span.className,
                    // timestamp: 1552031926010000,
                    timestamp: span.startTimestamp,
                    duration: span.duration < 1 ? 1 : span.duration,
                    localEndpoint: {serviceName: span.serviceName, ipv4: '172.17.0.13'},
                    annotations: [
                        { value: 'ws', timestamp: 1541138169337695 },
                        { value: 'wr', timestamp: 1541138169368570 },
                    ],
                    // tags: {
                    //     ...span.tags
                    // },
                    tags: {
                        'http.method': 'GET',
                        'http.path': '/',
                        'mvc.controller.class': 'Frontend',
                        'mvc.controller.method': 'callBackend',
                    },
                }
            )
        });

        return thundraTrace;
    }

    sampleThundraTrace = () => {

        const thundraTrace = [
            {
                traceId: "054289bf-e554-43bc-b6f2-b3eac2281cf0",
                // parentId: "",
                id: "f0cbe9cf-bc9e-4c89-ae28-11eb9b44afd6",
                name: "AWS-Lambda",
                // timestamp: 1552031926010000,
                timestamp: 1552031926010,
                duration: 113,
                localEndpoint: {serviceName: 'frontendx',ipv4: '172.17.0.13'},
                annotations: [
                    { value: 'ws', timestamp: 1541138169337695 },
                    { value: 'wr', timestamp: 1541138169368570 },
                ],
                tags: {
                    'http.method': 'GET',
                    'http.path': '/',
                    'mvc.controller.class': 'Frontend',
                    'mvc.controller.method': 'callBackend',
                },
                // error: "err-asdf"
            },
            {
                traceId: "054289bf-e554-43bc-b6f2-b3eac2281cf0",
                parentId: "f0cbe9cf-bc9e-4c89-ae28-11eb9b44afd6",
                id: "9862fbb2-0989-49db-9a0c-21967877894d",
                name: "Method",
                // timestamp: 1552031926011000,
                timestamp: 1552031926011,
                duration: 44,
                localEndpoint: {serviceName: 'frontend',ipv4: '172.17.0.13'},
                annotations: [
                    { value: 'ws', timestamp: 1541138169337695 },
                    { value: 'wr', timestamp: 1541138169368570 },
                ],
                tags: {
                    'http.method': 'GET',
                    'http.path': '/',
                    'mvc.controller.class': 'Frontend',
                    'mvc.controller.method': 'callBackend',
                },
            },
            {
                traceId: "054289bf-e554-43bc-b6f2-b3eac2281cf0",
                parentId: "f0cbe9cf-bc9e-4c89-ae28-11eb9b44afd6",
                id: "a87d4604-1b96-46d4-b7b2-f89e042a9deb",
                name: "AWS-SQS",
                // timestamp: 1552031926011000,
                timestamp: 1552031926055,
                duration: 68,
                localEndpoint: {serviceName: 'frontend',ipv4: '172.17.0.13'},
                annotations: [
                    { value: 'ws', timestamp: 1541138169337695 },
                    { value: 'wr', timestamp: 1541138169368570 },
                ],
                tags: {
                    'http.method': 'GET',
                    'http.path': '/',
                    'mvc.controller.class': 'Frontend',
                    'mvc.controller.method': 'callBackend',
                },
            },
        ];

        return thundraTrace;
    }



    sampleHttpTrace = () => {
        const frontend = {
            serviceName: 'frontend',
            ipv4: '172.17.0.13',
        };

        const backend = {
            serviceName: 'backend',
            ipv4: '172.17.0.9',
        };

        const httpTrace = [
            {
                traceId: 'bb1f0e21882325b8',
                parentId: 'bb1f0e21882325b8',
                id: 'c8c50ebd2abc179e',
                kind: 'CLIENT',
                name: 'get',
                timestamp: 1541138169297572,
                duration: 111121,
                localEndpoint: frontend,
                annotations: [
                    { value: 'ws', timestamp: 1541138169337695 },
                    { value: 'wr', timestamp: 1541138169368570 },
                ],
                tags: {
                    'http.method': 'GET',
                    'http.path': '/api',
                },
            },
            {
                traceId: 'bb1f0e21882325b8',
                id: 'bb1f0e21882325b8',
                kind: 'SERVER',
                name: 'get /',
                timestamp: 1541138169255688,
                duration: 168731,
                localEndpoint: frontend,
                remoteEndpoint: {
                    ipv4: '110.170.201.178',
                    port: 63678,
                },
                tags: {
                    'http.method': 'GET',
                    'http.path': '/',
                    'mvc.controller.class': 'Frontend',
                    'mvc.controller.method': 'callBackend',
                },
            },
            {
                traceId: 'bb1f0e21882325b8',
                parentId: 'bb1f0e21882325b8',
                id: 'c8c50ebd2abc179e',
                kind: 'SERVER',
                name: 'get /api',
                timestamp: 1541138169377997, // this is actually skewed right, but we can't correct it
                duration: 26326,
                localEndpoint: backend,
                remoteEndpoint: {
                    ipv4: '172.17.0.13',
                    port: 63679,
                },
                tags: {
                    'http.method': 'GET',
                    'http.path': '/api',
                    'mvc.controller.class': 'Backend',
                    'mvc.controller.method': 'printDate',
                },
                shared: true,
            },
        ];

        console.log("sampleHttpTrace; httpTrace: ", httpTrace);

        return httpTrace;
    }

    render() {
        console.log("InvocationTraceChartContainer, render; props: ", this.props);
        const { invocationSpans } = this.props;
        const { transactionId } = this.props.match.params;

        // const mockTraceSummary = this.createMockTraceSummary();
        // const mockTraceSummary = this.sampleThundraTrace();

        // const rawMockTraceSummary = this.createMockTraceSummary();
        // const correctedMockTraceSummary = treeCorrectedForClockSkew(rawMockTraceSummary);
        // const mockTraceSummary = detailedTraceSummary(correctedMockTraceSummary);

        // const rawMockTraceSummary = this.sampleHttpTrace();
        // const correctedMockTraceSummary = treeCorrectedForClockSkew(rawMockTraceSummary);
        // const mockTraceSummary = detailedTraceSummary(correctedMockTraceSummary);

        let mockTraceSummary = [];
        if (invocationSpans.length > 0) {
            // const rawMockTraceSummary = this.sampleThundraTrace();
            const rawMockTraceSummary = this.convertThundraInvocationsToTrace();
            const correctedMockTraceSummary = treeCorrectedForClockSkew(rawMockTraceSummary);
            mockTraceSummary = detailedTraceSummary(correctedMockTraceSummary);
            
            console.log("ITCC; mockTraceSummary: ", mockTraceSummary);
        }

        return (
            <div className="invocation-trace-chart-container">
                {invocationSpans.length > 0 ?
                    <DetailedTraceSummary
                        isLoading={this.props.invocationSpansFetching}
                        
                        traceId={transactionId}
                        // traceId={"trace-1"}
                        // traceId={"bb1f0e21882325b8"}
                        // traceId={"054289bf-e554-43bc-b6f2-b3eac2281cf0"}

                        traceSummary={mockTraceSummary}
                    /> :
                    <div>traces are loading</div>
                }   

                <EuiSpacer />
                <EuiSpacer />
                <p>invocation trace chart</p>
                {/* <p>transaction id: {this.props.match.params.transactionId}</p> */}
                <p>transaction id: {transactionId}</p>
                <p>.</p>
                <p>.</p>
                {
                    invocationSpans.map(span => {
                        return (
                            <div key={span._id}>
                                <p>parent-id: {span._source.parentSpanId || "ROOT"}</p>
                                <p>id: {span._source.id}</p>
                                <p>{span._source.className}</p>
                                <p>{span._source.domainName}</p>
                                <p>{span._source.duration}</p>
                                <p>.</p>
                                <p>.</p>
                            </div>
                        )
                    })
                }

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        invocationSpans: state.functionList.invocationSpans,
        invocationSpansFetching: state.functionList.invocationSpansFetching,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchInvocationSpans: (httpClient, transactionId) => dispatch(fetchInvocationSpans(httpClient, transactionId)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationTraceChartContainer)