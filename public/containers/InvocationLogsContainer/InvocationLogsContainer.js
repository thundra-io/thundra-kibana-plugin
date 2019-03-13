import React, { Fragment } from 'react';

import {
    Link
} from 'react-router-dom';

import {
    EuiSpacer,
    EuiInMemoryTable,
    EuiLink,
    EuiBasicTable,
    EuiFlexGroup,
    EuiFlexItem,
    EuiBadge,
    EuiCallOut,
    EuiTextColor,
    EuiLoadingKibana,
    EuiEmptyPrompt
} from '@elastic/eui';

import {
    fetchInvocationLogs
} from "../../store/actions";

import DetailedTraceSummary from "../../components/DetailedTraceSummary";
import { treeCorrectedForClockSkew, detailedTraceSummary } from '../../zipkin';

import { connect } from "react-redux";

const logLevelColors = {
    WARN: "warning",
    ERROR: "danger",
    DEBUG: "accent",
    // INFO: "subdued",
    INFO: "#fea27f",
    TRACE: "secondary"
}

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

    renderDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return (
            date.toLocaleDateString('en-GB', options)
        );
    }

    renderLogRow = (logData) => {

        return (
            <div key={logData.id}
                className="log-row-wrapper"
            >
                <p className="log-row-meta">
                    <EuiBadge color={logLevelColors[logData.logLevel]}>
                        {logData.logLevel}
                    </EuiBadge>

                    <EuiTextColor color={logLevelColors[logData.logLevel]}>[{logData.logContextName}]</EuiTextColor>

                    {/* <span>[{logData.logContextName}] - {this.renderDate(logData.logTimestamp)}</span> */}
                    <span> - {this.renderDate(logData.logTimestamp)}</span>
                </p>

                <p className="log-row-message">
                    {logData.logMessage}
                </p>
                <EuiSpacer />
            </div>
        );
    }

    renderInvocationLogs = () => {
        const { invocationLogs, invocationLogsFetching } = this.props;

        if (invocationLogsFetching) {
            return (
                <EuiLoadingKibana size="xl" />
            );
        }

        if (!invocationLogsFetching && invocationLogs.length < 1) {
            return (
                <EuiEmptyPrompt
                    iconType="editorStrike"
                    title={<h2>You have no logs</h2>}
                    body={
                        <Fragment>
                            <p>
                                Next time, add some logs to view them here.
                            </p>
                        </Fragment>
                    }
                    // actions={<EuiButton color="primary" fill>Harvest spice</EuiButton>}
                />
            )
        }

        return (
            <Fragment>
                {invocationLogs.map((log) => {
                    console.log("logs, map; log: ", log);
                    const logData = log._source;

                    return (
                        this.renderLogRow(logData)
                    );
                })}
            </Fragment>
        );
    }

    render() {
        console.log("InvocationLogsContainer, render; props: ", this.props);

        return (
            <div className="invocation-logs-container">

                {this.renderInvocationLogs()}

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        invocationLogs: state.functionList.invocationLogs,
        invocationLogsFetching: state.functionList.invocationLogsFetching,

        invocationSpans: state.functionList.invocationSpans,
        invocationSpansFetching: state.functionList.invocationSpansFetching,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchInvocationLogs: (httpClient, transactionId) => dispatch(fetchInvocationLogs(httpClient, transactionId)),
        fetchInvocationSpan: (httpClient, transactionId) => dispatch(fetchInvocationSpan(httpClient, transactionId)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationLogsContainer)