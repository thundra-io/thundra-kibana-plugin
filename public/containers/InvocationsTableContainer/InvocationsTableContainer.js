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
    EuiPanel,
    EuiStat,
    EuiIcon,
    EuiToolTip
} from '@elastic/eui';

import { HeatMapComponent, Inject, Legend, Tooltip, Adaptor } from '@syncfusion/ej2-react-heatmap';

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
            sortField: "_source.finishTimestamp",
            sortDirection: "desc"
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
        const { paginationFrom, paginationSize, sortField, sortDirection } = this.state;

        this.props.fetchInvocationsByFunctionName(this.props.httpClient, startDate, interval, functionName, paginationSize, paginationFrom, sortField, sortDirection);
        // this.props.fetchFunctionDataByFunctionName(this.props.httpClient, startDate, functionName);
    }

    onTableChange = ({ page = {}, sort = {} }) => {
        console.log("invocations - onTableChange; page, props, state: ", page, sort, this.props, this.state);

        const { startDate, interval } = this.props;
        const { functionName } = this.props.match.params;
        const { pageIndex, paginationSize, paginationFrom, sortField, sortDirection } = this.state;

        const {
            index: newPageIndex,
            size
        } = page;

        const {
            field,
            direction
        } = sort;

        // Compute new pagination start point.
        let newPaginationFrom = newPageIndex * paginationSize;
        let newPaginationSize = size;

        let newField = field || sortField;
        let newDirection = direction || sortDirection;
        if (direction) { // Normally above code should suffice but there is an issue about direction.
            if (sortDirection === "asc") {
                newDirection = "desc";
            } else {
                newDirection = "asc";
            }
        }

        this.setState({
            pageIndex: newPageIndex,
            paginationFrom: newPaginationFrom,
            paginationSize: newPaginationSize,
            sortField: newField,
            sortDirection: newDirection
        }, () => this.props.fetchInvocationsByFunctionName(this.props.httpClient, startDate, interval, functionName, newPaginationSize, newPaginationFrom, newField, newDirection));

    }

    onTraceIconClick = (item) => {
        console.log("trace clicked; item: ", item)
        const { functionName } = this.props.match.params;
        // const invocationId = item._source.id;
        const transactionId = item._source.transactionId;
        // this.props.history.push(`/functions/${functionName}/invocation/${invocationId}`);
        this.props.history.push(`/functions/${functionName}/invocation/${transactionId}`);
    }

    onLogsIconClick = (item) => {
        console.log("logs clicked; item: ", item)
        const { functionName } = this.props.match.params;
        const transactionId = item._source.transactionId;
        this.props.history.push(`/functions/${functionName}/invocation/${transactionId}/logs`);
    }

    renderInvocationsTable = () => {

        const { pageIndex, paginationSize, sortField, sortDirection } = this.state;

        const actions = [
            {
                name: 'Trace Chart',
                description: 'Trace chart for this invocation',
                icon: 'apmTrace',
                type: 'icon',
                onClick: this.onTraceIconClick
            },
            {
                name: 'Logs',
                description: 'Logs for this invocation',
                icon: 'loggingApp',
                type: 'icon',
                onClick: this.onLogsIconClick
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

        const sorting = {
            field: sortField,
            direction: sortDirection
        };

        // console.log("renderInvocationsTable; invocationList, pagination: ", this.props.invocationList, pagination);
        return (
            <EuiBasicTable
                items={this.props.invocationList.hits || []}
                columns={columns}
                pagination={pagination}
                sorting={sorting}
                loading={this.props.invocationListFetching}
                onChange={this.onTableChange}
            />
        );
    }

    render() {
        console.log("InvocationsTableContainer, render; props: ", this.props);

        return (
            <div className="invocations-table-container">

                {this.renderInvocationsTable()}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        invocationList: state.functionList.invocationsByFunctionName,
        invocationListFetching: state.functionList.invocationsByFunctionNameFetching,

        // functionMetadataByFunctionName: state.functionList.functionMetadataByFunctionName,
        // functionMetadataByFunctionNameFetching: state.functionList.functionMetadataByFunctionNameFetching,

        startDate: state.timeSelector.startDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFunctionList: (httpClient, startTime) => dispatch(fetchFunctionList(httpClient, startTime)),

        fetchInvocationsByFunctionName: (httpClient, startTime, interval, functionName, paginationSize, paginationFrom, sortField, sortDirection) =>
            dispatch(fetchInvocationsByFunctionName(httpClient, startTime, interval, functionName, paginationSize, paginationFrom, sortField, sortDirection)),
        
        fetchFunctionDataByFunctionName: (httpClient, startTime, functionName) => dispatch(fetchFunctionDataByFunctionName(httpClient, startTime, functionName))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationsTableContainer)