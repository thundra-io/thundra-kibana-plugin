import React, { Fragment } from 'react';

import {
    EuiSpacer,
    EuiInMemoryTable,
    EuiLink,
    EuiBasicTable
} from '@elastic/eui';

import {
    fetchFunctionList,
    fetchInvocationsByFunctionName
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

        // console.log("CDM, OverviewGraphsContainer; props: ", this.props);

        this.fetchData(startDate, interval);


        /*
        this.props.httpClient.get('../api/thundra/invocations-by-function-name-comparison-basic-data', {
            params: {
                // functionName: selectedOptions[0].label,
                // startTimeStamp: startDate,
                // interval: interval
            }
        }).then((resp) => {
            // this.setState({invocationsDurations: resp.data.invocations});
            console.log("basicData; resp: ", resp);
        });

        this.props.httpClient.get('../api/thundra/invocations-get-span-by-invocation-id', {
            params: {
                // functionName: selectedOptions[0].label,
                // startTimeStamp: startDate,
                // interval: interval
            }
        }).then((resp) => {
            // this.setState({invocationsDurations: resp.data.invocations});
            console.log("invcation span data; resp: ", resp);
        });*/
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
    }

    onTableChange = ({ page = {} }) => {
        console.log("onTableChange; page, props, state: ", page, this.props, this.state);

        const { startDate, interval } = this.props;
        const { functionName } = this.props.match.params;
        const {pageIndex, paginationSize, paginationFrom} = this.state;

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

    renderInvocationsTable = () => {

        const { pageIndex, paginationSize } = this.state;

        const columns = [
            // {
            //     field: '_source.applicationRuntime',
            //     name: 'Runtime',
            //     sortable: true
            // },
            // {
            //     field: '_source.applicationName',
            //     name: 'Application Name',
            //     sortable: true
            // },
            // {
            //     field: '_source.functionRegion',
            //     name: 'Region',
            //     sortable: true
            // },
            {
                // field: '_source.finishTimestamp',
                field: '_source.finishTime',
                name: 'Time',
                sortable: true
            },
            {
                field: '_source.errorType',
                name: 'Error Type',
                sortable: true
            },
            {
                field: '_source.coldStart',
                name: 'Cold Start',
                sortable: true
            },
            {
                field: '_source.duration',
                name: 'Duration (ms)',
                sortable: true
            },

        ];

        const pagination = {
            pageIndex: pageIndex,
            pageSize: paginationSize,
            totalItemCount: this.props.invocationList.total || 0,
            pageSizeOptions: [10, 20, 50],
        };

        console.log("renderInvocationsTable; invocationList, pagination: ", this.props.invocationList, pagination);
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

        return (
            <div className="functions-table-container">
                <p>invocations table here: {this.props.match.params.functionName}</p>
                {this.renderInvocationsTable()}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        invocationList: state.functionList.invocationsByFunctionName,
        invocationListFetching: state.functionList.invocationsByFunctionNameFetching,

        functionList: state.functionList.functionList,
        functionListFetching: state.functionList.functionListFetching,

        startDate: state.timeSelector.startDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFunctionList: (httpClient, startTime) => dispatch(fetchFunctionList(httpClient, startTime)),
        fetchInvocationsByFunctionName: (httpClient, startTime, interval, functionName, paginationSize, paginationFrom) =>
            dispatch(fetchInvocationsByFunctionName(httpClient, startTime, interval, functionName, paginationSize, paginationFrom)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationsTableContainer)