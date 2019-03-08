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
        
        const {invocationSpans} = this.props;

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
                        {key: "tag-1-1", value: "tag-1-1"},
                        {key: "tag-1-2", value: "tag-1-2"}
                    ],
                    annotations:[
                        {
                            value: "ann-1",
                            timestamp: 1551965325267,
                            endpoint: "endpoint-1",
                            relativeTime: "anno 1 relativeTime"
                        }
                    ],
                    errorType: "",
                    depth: 6,
                    width: 7,
                    left: 0
                },
                {
                    spanId: "2",
                    spanName: "spanName-2",
                    serviceNames: ["serviceName-2-1"],
                    parentId: "1",
                    childIds: [],
                    serviceName: "serviceName-2",
                    timestamp: 1551965325267,
                    duration: 209,
                    durationStr: "durationStr-2",
                    tags: 
                    [
                        {key: "tag-2-1", value: "tag-2-1"},
                        {key: "tag-2-2", value: "tag-2-2"}
                    ],
                    annotations:[
                        {
                            value: "ann-2",
                            timestamp: 1551965325267,
                            endpoint: "endpoint-2",
                            relativeTime: "anno 2 relative Time"
                        }
                    ],
                    errorType: "",
                    depth: 0,
                    width: 20,
                    left: 40
                }
            ],
            serviceNameAndSpanCounts: 
            [
                {serviceName: "serviceName-Lambda", spanCount: 2}
            ],
            duration: 1000,
            durationStr: "duration-str-1000"
        }


        return mockTraceSummary;
    }

    render() {
        console.log("InvocationTraceChartContainer, render; props: ", this.props);
        const {invocationSpans} = this.props;
        const {transactionId} = this.props.match.params;

        const mockTraceSummary = this.createMockTraceSummary();



        return (
            <div className="invocation-trace-chart-container">

                <DetailedTraceSummary
                    isLoading={this.props.invocationSpansFetching}
                    // traceId={transactionId}
                    traceId={"trace-1"}
                    // traceSummary={invocationSpans}
                    // traceSummary={invocationSpans}
                    traceSummary={mockTraceSummary}
                />

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