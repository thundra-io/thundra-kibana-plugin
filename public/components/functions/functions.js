import React from 'react';
import {EuiBasicTable,
    EuiButton,
    EuiCode,
    EuiHealth,
    EuiLink,
    EuiSpacer,
    EuiSwitch,
    EuiComboBox,
    EuiFlexGrid,
    EuiFlexItem,
    EuiText,
    EuiTextColor,
    EuiInMemoryTable
} from '@elastic/eui';

import {EuiLineSeries, EuiSeriesChart, EuiSeriesChartUtils} from '@elastic/eui/lib/experimental';

const {
    CURVE_MONOTONE_X,
} = EuiSeriesChartUtils.CURVE;


const { SCALE } = EuiSeriesChartUtils;

class Functions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            functions : [],
            isLoading: false
        };
    }

    componentDidMount() {
        const {httpClient} = this.props;
        const {startDate} = this.props;
        const {interval} = this.props;
        const {convertToMonthMultiplier} = this.props;
        this.doRequest(httpClient, startDate, interval, convertToMonthMultiplier)
    }

    componentWillReceiveProps(nextProps) {
        const {httpClient} = nextProps;
        const {startDate} = nextProps;
        const {interval} = nextProps;
        const {convertToMonthMultiplier} = nextProps;
        this.doRequest(httpClient, startDate, interval, convertToMonthMultiplier);
    }

    doRequest = (httpClient, startDate, interval, convertToMonthMultiplier) => {
        // console.log("functions, doRequest; ", startDate, interval, convertToMonthMultiplier);

        httpClient.get('../api/thundra/invocations-v2', {
            params:{
                startTimeStamp: startDate
            }
        }).then((resp) => {
            // console.log("funcitons, doRequest; resp: ", resp);

            let funcs = [];
            for (let key in resp.data.invocations) {
                let invocation={};
                let obj = resp.data.invocations[key];

                invocation.applicationName = obj.key;
                let groupByApplicationRuntime = obj['groupByApplicationRuntime'];
                let buckets = groupByApplicationRuntime['buckets'];

                for (let i in buckets ){
                    let bucket = buckets[i];
                    invocation.applicationRuntime = bucket.key;
                    invocation.totalDuration = bucket.totalDuration['value'];
                    invocation.minDuration = bucket.minDuration['value'];
                    invocation.maxDuration = bucket.maxDuration['value'];
                    invocation.averageDuration = bucket.averageDuration['value'].toFixed(2);

                    invocation.invocationsWithColdStart = bucket.invocationsWithColdStart['doc_count'];
                    invocation.invocationsWithError = bucket.invocationsWithError['doc_count'];
                    invocation.invocationsWithoutError = bucket.invocationsWithoutError['doc_count'];
                    invocation.invocationCount = invocation.invocationsWithoutError + invocation.invocationsWithError;
                    invocation.health = Number((invocation.invocationsWithoutError / invocation.invocationCount * 100).toFixed(2));

                    invocation.estimatedCost = Number(bucket.estimatedTotalBilledCost.value.toFixed(3));
                    invocation.monthlyCost = Number((invocation.estimatedCost * convertToMonthMultiplier).toFixed(2));

                    invocation.newestInvocationTime = new Date(bucket.newestInvocationTime['value']);
                    invocation.oldestInvocationTime = new Date(bucket.oldestInvocationTime['value']);

                }
                funcs.push(invocation);
            }
            this.setState({functions: funcs});
        });
    };

    columns = [
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
        // {
        //     field: 'totalDuration',
        //     name: 'Total Duration (ms)',
        //     sortable: true
        // },
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
        // {
        //     field: 'minDuration',
        //     name: 'Min Duration (ms)',
        //     sortable: true
        // },
        // {
        //     field: 'maxDuration',
        //     name: 'Max Duration (ms)',
        //     sortable: true
        // },
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
        {
            field: 'monthlyCost',
            name: 'Monthly Cost',
            sortable: true
        },
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
        // {
        //     field: 'oldestInvocationTime',
        //     name: 'Oldest Invocation',
        //     sortable: true
        // }
    ];

    render() {
        // console.log("functions, render; this.state, this.props: ", this.state, this.props);
        
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
                    const items = this.state.functions.filter(invocation => {
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
            <div className="overview">
                <EuiSpacer size="xl" />
                <EuiInMemoryTable
                    items={this.state.functions}
                    pagination={true}
                    loading={this.state.isLoading}
                    columns={this.columns}
                    search={search}
                />
                <EuiSpacer/>
            </div>
        );
    }
}

export default Functions;
