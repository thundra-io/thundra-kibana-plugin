import React, { Fragment } from 'react';

import {
    EuiSpacer,
    EuiInMemoryTable,
    EuiLink
} from '@elastic/eui';

import {
    fetchFunctionList,
} from "../../store/actions";

import { connect } from "react-redux";


class FunctionsTableContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFunctionName: null
        }
    }

    componentDidMount() {
        const { startDate, interval } = this.props;
        // console.log("CDM, OverviewGraphsContainer; props: ", this.props);

        this.fetchData(startDate, interval);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.startDate !== nextProps.startDate) {
            this.fetchData(nextProps.startDate, nextProps.interval);
        }
    }

    fetchData = (startDate, interval) => {
        this.props.fetchFunctionList(this.props.httpClient, startDate);
    }

    renderFunctionsTable = () => {
        const columns = [
            {
                field: 'applicationName',
                name: 'Application Name',
                sortable: true,
                render: (functionName) => (
                    <EuiLink href={`https://github.com/${functionName}`} target="_blank">
                        {functionName}
                    </EuiLink>
                )
            },
            {
                field: 'applicationRuntime',
                name: 'Runtime',
                sortable: true
            },
            {
                field: 'averageDuration',
                name: 'Avg Duration (ms)',
                sortable: true
            },
            {
                field: 'health',
                name: 'Health',
                sortable: true,
                render: (health) => {
                    return (
                        `${health} %`
                    );
                }
            },
            {
                field: 'invocationCount',
                name: 'Invocations',
                sortable: true
            },
            {
                field: 'invocationsWithColdStart',
                name: 'Cold Start',
                sortable: true
            },
            {
                field: 'invocationsWithError',
                name: 'Error',
                sortable: true
            },
            // {
            //     field: 'monthlyCost',
            //     name: 'Monthly Cost',
            //     sortable: true
            // },
            {
                field: 'estimatedCost',
                name: 'Estimated Cost',
                sortable: true,
                render: (cost) => {
                    return (
                        `$${cost}`
                    );
                }
            },
            {
                field: 'newestInvocationTime',
                name: 'Newest Invocation',
                sortable: true
            },
        ];

        let debounceTimeoutId;
        let requestTimeoutId;

        const onQueryChange = ({ query }) => {
            clearTimeout(debounceTimeoutId);
            clearTimeout(requestTimeoutId);

            debounceTimeoutId = setTimeout(() => {
                this.setState({
                    isLoading: true,
                });

                requestTimeoutId = setTimeout(() => {
                    const items = this.props.functionList.filter(invocation => {
                        const normalizedName = `${invocation.applicationName}`.toLowerCase();
                        const normalizedQuery = query.text.toLowerCase();
                        return normalizedName.indexOf(normalizedQuery) !== -1;
                    });

                    this.setState({
                        isLoading: false,
                        items,
                    });
                }, 1000);
            }, 300);
        };

        const search = {
            onChange: this.onQueryChange,
            box: {
                incremental: true,
            },
        };

        return (
            <EuiInMemoryTable
                // items={this.state.functions}
                items={this.props.functionList}
                pagination={true}
                // loading={this.state.isLoading}
                loading={this.props.functionListFetching}
                columns={columns}
                search={search}
            />
        )
    }

    render() {
        console.log("FunctionsTableContainer, render; props: ", this.props);

        return (
            <div className="functions-table-container">
                {this.renderFunctionsTable()}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        functionList: state.functionList.functionList,
        functionListFetching: state.functionList.functionListFetching,

        startDate: state.timeSelector.startDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFunctionList: (httpClient, startTime) => dispatch(fetchFunctionList(httpClient, startTime)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FunctionsTableContainer)