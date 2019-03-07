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
    fetchFunctionList,
    fetchInvocationsByFunctionName,
    fetchFunctionDataByFunctionName
} from "../../store/actions";

import { connect } from "react-redux";


class InvocationsTableContainer extends React.Component {

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
        const { startDate, interval } = this.props;
        // const { paginationFrom, paginationSize } = this.state;

        this.fetchData(startDate, interval);

    }

    componentWillReceiveProps(nextProps) {
        // When start date is changed by global time selector, fetch data again.
        if (this.props.startDate !== nextProps.startDate) {
            this.fetchData(nextProps.startDate, nextProps.interval);
        }
    }

    fetchData = (startDate, interval) => {
        const { functionName } = this.props.match.params;
        const { paginationFrom, paginationSize } = this.state;

        this.props.fetchInvocationsByFunctionName(this.props.httpClient, startDate, interval, functionName, paginationSize, paginationFrom);
        this.props.fetchFunctionDataByFunctionName(this.props.httpClient, startDate, functionName);
    }

    onTableChange = ({ page = {} }) => {
        console.log("onTableChange; page, props, state: ", page, this.props, this.state);

        const { startDate, interval } = this.props;
        const { functionName } = this.props.match.params;
        const { pageIndex, paginationSize, paginationFrom } = this.state;

        const {
            index: newPageIndex,
            size
        } = page;

        // Compute new pagination start point.
        let newPaginationFrom = newPageIndex * paginationSize;
        let newPaginationSize = size;

        this.setState({
            pageIndex: newPageIndex,
            paginationFrom: newPaginationFrom,
            paginationSize: newPaginationSize,
        }, () => this.props.fetchInvocationsByFunctionName(this.props.httpClient, startDate, interval, functionName, newPaginationSize, newPaginationFrom));

    }

    onTraceIconClick = (item) => {
        console.log("trace clicked; item: ", item)
        const { functionName } = this.props.match.params;
        // const invocationId = item._source.id;
        const transactionId = item._source.transactionId;
        // this.props.history.push(`/functions/${functionName}/invocation/${invocationId}`);
        this.props.history.push(`/functions/${functionName}/invocation/${transactionId}`);
    }

    renderInvocationsTable = () => {

        const { pageIndex, paginationSize } = this.state;

        const actions = [
            {
                name: 'Trace Chart',
                description: 'Go to trace chart for this invocation',
                icon: 'apmTrace',
                type: 'icon',
                onClick: this.onTraceIconClick
            }
        ];

        const columns = [
            {
                field: '_source.finishTimestamp',
                // field: '_source.finishTime',
                name: 'Time',
                sortable: true,
                render: (finishTime) => {
                    const date = new Date(finishTime);
                    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                    return (
                        date.toLocaleDateString('en-GB', options)
                    );
                }
            },
            {
                field: '_source.duration',
                name: 'Duration (ms)',
                sortable: true
            },
            {
                field: '_source.errorType',
                name: 'Error Type',
                sortable: true,
                render: (errorType) => {
                    if (errorType === "") {
                        return "None";
                    }

                    return errorType;
                }
            },
            {
                field: '_source.coldStart',
                name: 'Cold Start',
                sortable: true
            },
            {
                field: '_source.timeout',
                name: 'Timeout',
                sortable: true
            },
            {
                name: 'Actions',
                actions
            }
        ];

        const pagination = {
            pageIndex: pageIndex,
            pageSize: paginationSize,
            totalItemCount: this.props.invocationList.total || 0,
            pageSizeOptions: [10, 20, 50],
        };

        // console.log("renderInvocationsTable; invocationList, pagination: ", this.props.invocationList, pagination);
        return (
            <EuiBasicTable
                items={this.props.invocationList.hits || []}
                columns={columns}
                pagination={pagination}
                loading={this.props.invocationListFetching}
                onChange={this.onTableChange}
            />
        );
    }

    render() {
        console.log("InvocationsTableContainer, render; props: ", this.props);
        const {applicationRuntime, region, stage, invocationCount, invocationsWithColdStart, invocationsWithError} = this.props.functionMetadataByFunctionName;

        return (
            <div className="invocations-table-container">
                <p>invocations table here: {this.props.match.params.functionName }</p>
                <p>Invocation Count: {invocationCount}</p>
                <p>Cold Start Invocation Count: {invocationsWithColdStart}</p>
                <p>Error Invocation Count: {invocationsWithError}</p>
                <p>Region: {region}</p>
                <p>Stage: {stage}</p>
                <p>Application Runtime: {applicationRuntime}</p>

                {this.renderInvocationsTable()}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        invocationList: state.functionList.invocationsByFunctionName,
        invocationListFetching: state.functionList.invocationsByFunctionNameFetching,

        functionMetadataByFunctionName: state.functionList.functionMetadataByFunctionName,
        functionMetadataByFunctionNameFetching: state.functionList.functionMetadataByFunctionNameFetching,

        startDate: state.timeSelector.startDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFunctionList: (httpClient, startTime) => dispatch(fetchFunctionList(httpClient, startTime)),
        fetchInvocationsByFunctionName: (httpClient, startTime, interval, functionName, paginationSize, paginationFrom) =>
            dispatch(fetchInvocationsByFunctionName(httpClient, startTime, interval, functionName, paginationSize, paginationFrom)),
        fetchFunctionDataByFunctionName: (httpClient, startTime, functionName) => dispatch(fetchFunctionDataByFunctionName(httpClient, startTime, functionName))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationsTableContainer)