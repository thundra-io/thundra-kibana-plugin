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
    fetchInvocationLogs
} from "../../store/actions";

import DetailedTraceSummary from "../../components/DetailedTraceSummary";
import { treeCorrectedForClockSkew, detailedTraceSummary } from '../../zipkin';

import { connect } from "react-redux";

class InvocationLogsContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const { transactionId } = this.props.match.params;

        this.props.fetchInvocationLogs(this.props.httpClient, transactionId);
    }

    render() {
        console.log("InvocationLogsContainer, render; props: ", this.props);
        const { invocationSpans } = this.props;
        const { transactionId } = this.props.match.params

        return (
            <div className="invocation-logs-container">
                <p>invocation logs container</p>

                <EuiSpacer />
                <EuiSpacer />
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        invocationLogs: state.functionList.invocationLogs,
        invocationLogsFetching: state.functionList.invocationLogsFetching,
        // invocationSpans: state.functionList.invocationSpans,
        // invocationSpansFetching: state.functionList.invocationSpansFetching,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchInvocationLogs: (httpClient, transactionId) => dispatch(fetchInvocationLogs(httpClient, transactionId)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationLogsContainer)