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

    render() {
        console.log("InvocationTraceChartContainer, render; props: ", this.props);
        const {invocationSpans} = this.props;

        return (
            <div className="invocation-trace-chart-container">
                <p>invocation trace chart</p>
                <p>transaction id: {this.props.match.params.transactionId}</p>
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