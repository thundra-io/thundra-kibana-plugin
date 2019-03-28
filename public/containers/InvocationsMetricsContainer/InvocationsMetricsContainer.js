import React, { Fragment } from 'react';

import {
    Link
} from 'react-router-dom';

import {
    EuiSpacer,
    EuiInMemoryTable,
    EuiLink,
    EuiText,
    EuiBasicTable,
    EuiFlexGroup,
    EuiFlexGrid,
    EuiFlexItem,
    EuiSeriesChart,
    EuiLineSeries,
    EuiPanel,
    EuiStat,
    EuiIcon,
    EuiToolTip
} from '@elastic/eui';

import {
    fetchMetricsPageGraphs,
    fetchInvocationCountsPerHourByName,
    fetchInvocationDurationsPerHourByName,
    fetchFunctionCPUMetricGraphData,
    fetchFunctionList,
    fetchInvocationsByFunctionName,
    fetchFunctionDataByFunctionName
} from "../../store/actions";

import { connect } from "react-redux";

import {
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line
} from 'recharts';
import moment from "moment";



class InvocationsMetricsContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { startDate, endDate, interval } = this.props;

        this.fetchData(startDate, endDate, interval);
    }

    componentWillReceiveProps(nextProps) {
        // When start date is changed by global time selector, fetch data again.
        if (this.props.startDate !== nextProps.startDate) {
            this.fetchData(nextProps.startDate, nextProps.endDate, nextProps.interval);
        }
    }

    fetchData = (startDate, endDate, interval) => {
        const { functionName } = this.props.match.params;

        this.props.fetchMetricsPageGraphs(this.props.httpClient, functionName, startDate, endDate);
    }

    renderInvocationCountsMetricChart = () => {
        const { functionInvocationCountMetricByMetadata } = this.props;

        const invocationCountsData = functionInvocationCountMetricByMetadata.map(data => {
            return {
                x: moment(data.timestamp).format("HH:mm"),
                invocationCount: data.invocationCount,
                errorCount: data.errorCount,
                coldStartCount: data.coldStartCount
            }
        })

        return (
            <LineChart 
                data={invocationCountsData}
                syncId="metricChart"
                width={400} 
                height={250} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="invocationCount" stroke="#37DC94" />
                <Line type="monotone" dataKey="errorCount" stroke="#FF5126" />
                <Line type="monotone" dataKey="coldStartCount" stroke="#162C9B" />

            </LineChart>
        );
    }

    renderInvocationDurationsMetricChart = () => {
        const { functionInvocationDurationsMetricByMetadata } = this.props;

        const invocationDurationsData = functionInvocationDurationsMetricByMetadata.map(data => {
            return {
                x: moment(data.timestamp).format("HH:mm"),
                invocationDuration: data.avgInvocationDuration,
                errorDuration: data.avgErrorDuration,
                coldStartDuration: data.avgColdStartDuration
            }
        })

        return (
            <LineChart 
                data={invocationDurationsData}
                syncId="metricChart"
                width={400} 
                height={250} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="invocationDuration" stroke="#37DC94" />
                <Line type="monotone" dataKey="errorDuration" stroke="#FF5126" />
                <Line type="monotone" dataKey="coldStartDuration" stroke="#162C9B" />

            </LineChart>
        )
    }

    renderMemoryMetricChart = () => {
        const { functionMemoryMetricByMetadata } = this.props;

        const memoryData = functionMemoryMetricByMetadata.map(data => {
            return {
                x: moment(data.timestamp).format("HH:mm"),
                usedMemory: data.usedMemory
            };
        })

        return (
            <LineChart 
                data={memoryData}
                syncId="metricChart"
                width={400} 
                height={250} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="usedMemory" stroke="#37DC94" />

            </LineChart>
        )
    }

    renderCPUMetricChart = () => {
        const { functionCPUMetricByMetadata } = this.props;

        const cpuData = functionCPUMetricByMetadata.map(data => {
            return {
                x: moment(data.timestamp).format("HH:mm"),
                cpuPercentage: data.cpuloadPercentage
            };
        })

        return (
            <LineChart 
                data={cpuData}
                syncId="metricChart"
                width={400} 
                height={250} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="cpuPercentage" stroke="#37DC94" />

            </LineChart>
        )
    }

    render() {
        console.log("InvocationsMetricsContainer, render; props: ", this.props);

        return (
            <div className="invocations-metrics-container">

                <EuiFlexGrid columns={2}>
                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Counts</p>
                        </EuiText>
                        {this.renderInvocationCountsMetricChart()}
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Duration</p>
                        </EuiText>
                        {this.renderInvocationDurationsMetricChart()}
                    </EuiFlexItem>

                </EuiFlexGrid>

                <EuiFlexGrid columns={2}>
                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Memory (MB)</p>
                        </EuiText>
                        {this.renderMemoryMetricChart()}
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>CPU (%)</p>
                        </EuiText>
                        {this.renderCPUMetricChart()}
                    </EuiFlexItem>

                </EuiFlexGrid>

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        functionInvocationCountMetricByMetadata: state.functionList.functionInvocationCountMetricByMetadata,
        functionInvocationDurationsMetricByMetadata: state.functionList.functionInvocationDurationsMetricByMetadata,

        functionCPUMetricByMetadata: state.functionList.functionCPUMetricByMetadata,
        functionMemoryMetricByMetadata: state.functionList.functionMemoryMetricByMetadata,

        startDate: state.timeSelector.startDate,
        endDate: state.timeSelector.endDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchMetricsPageGraphs: (httpClient, functionName, startTime, endTime) => dispatch(fetchMetricsPageGraphs(httpClient, functionName, startTime, endTime)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationsMetricsContainer)