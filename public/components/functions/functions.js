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
            invocationCountOfFunction : [],
            isLoading: false
        };
    }

    componentWillMount() {
        const {httpClient} = this.props;
        const {startDate} = this.props;
        const {inteval} = this.props;
        this.doRequest(httpClient, startDate, inteval)
    }

    componentWillReceiveProps(nextProps) {
        const {httpClient} = nextProps;
        const {startDate} = nextProps;
        const {interval} = nextProps;
        this.doRequest(httpClient, startDate, interval)
    }

    doRequest = (httpClient, startDate, interval) => {
        httpClient.get('../api/thundra/invocations-v2', {
            params:{
                startTimeStamp: startDate
            }
        }).then((resp) => {
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

                    invocation.newestInvocationTime = new Date(bucket.newestInvocationTime['value']);
                    invocation.oldestInvocationTime = new Date(bucket.oldestInvocationTime['value']);

                }
                funcs.push(invocation);
            }
            this.setState({functions: funcs});
        });

        httpClient.get('../api/thundra/invocation-count-of-function', {
            params:{
                startTimeStamp: startDate,
                interval: interval
            }
        }).then((resp) => {
            this.setState({invocationCountOfFunction: resp.data.invocationCountOfFunction});
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
            name: 'Application Runtime',
            sortable: true
        },
        {
            field: 'totalDuration',
            name: 'Total Duration (ms)',
            sortable: true
        },
        {
            field: 'averageDuration',
            name: 'Avg Duration (ms)',
            sortable: true
        },
        {
            field: 'minDuration',
            name: 'Min Duration (ms)',
            sortable: true
        },
        {
            field: 'maxDuration',
            name: 'Max Duration (ms)',
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
        {
            field: 'newestInvocationTime',
            name: 'Newest Invocation',
            sortable: true
        },
        {
            field: 'oldestInvocationTime',
            name: 'Oldest Invocation',
            sortable: true
        }
    ];

    render() {

        const myData = [];
        const DATA_A = [];
        for (let key in this.state.invocationCountOfFunction) {
            let obj = this.state.invocationCountOfFunction[key];
            DATA_A.push( { x: obj.key, y: obj.doc_count } );
        }

        myData[0] = {
            data: DATA_A,
            name: "InvocationCount"
        };

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

                <br/>
                <hr/>

                <EuiSpacer/>
                <EuiSpacer/>
                <div>
                    <EuiFlexGrid columns={2}>
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <p> Total invocation count for <EuiTextColor color="subdued"> { this.state.selectedFunctionName == null ?  'all' : this.state.selectedFunctionName }</EuiTextColor> function(s)</p>
                            </EuiText>
                            <EuiSeriesChart height={250} xType={SCALE.TIME}>
                                {myData.map((d, i) => (
                                    <EuiLineSeries key={i} name={d.name} data={d.data} showLineMarks={false} curve={CURVE_MONOTONE_X} lineSize={Number("2")}/>
                                ))}
                            </EuiSeriesChart>
                        </EuiFlexItem>
                    </EuiFlexGrid>
                    <EuiSpacer />
                </div>
            </div>
        );
    }
}

export default Functions;
