import React from 'react';
import {
    EuiBasicTable,
    EuiButton,
    EuiCode,
    EuiComboBox,
    EuiFlexGrid,
    EuiFlexItem,
    EuiHealth,
    EuiInMemoryTable,
    EuiLink,
    EuiSpacer,
    EuiSwitch
} from '@elastic/eui';

import {EuiSeriesChartUtils} from '@elastic/eui/lib/experimental';
import {KIBANA_THUNDRA_PATH} from "../../utils";
import {connect} from "react-redux";

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

    componentWillMount() {
        const {httpClient} = this.props;
        const {startDate} = this.props;
        const {interval} = this.props;
        this.doRequest(httpClient, startDate, interval)
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
    };

    columns = [
        {
            field: 'applicationName',
            name: 'Application Name',
            sortable: true,
            render: (functionName) => (
                <EuiLink href={KIBANA_THUNDRA_PATH+`invocations/${functionName}`} target="_blank">
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

const mapStateToProps = state => {
    return {
        startDate:  state.timeSelectorReducer.startDate,
        interval: state.timeSelectorReducer.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeTime: (x) => {
            const MS_PER_MINUTE = 60000;
            let d = new Date();
            let date = new Date(d - x.value*(MS_PER_MINUTE));
            return dispatch({type: 'CHANGE_TIME', val: date.getTime() , interval: x.interval });
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Functions);
