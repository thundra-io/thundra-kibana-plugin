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


class InvocationsMetricsContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // const { startDate, interval } = this.props;
        const { startDate, endDate, interval } = this.props;
        // const { paginationFrom, paginationSize } = this.state;

        // this.fetchData(startDate, interval);
        this.fetchData(startDate, endDate, interval);

    }

    componentWillReceiveProps(nextProps) {
        // console.log("cwrp; props, nextProps: ", this.props, nextProps);
        // When start date is changed by global time selector, fetch data again.
        if (this.props.startDate !== nextProps.startDate) {
            // this.fetchData(nextProps.startDate, nextProps.interval);
            // console.log("cwrp, fetchData; this.props, nextProps: ", this.props, nextProps);
            this.fetchData(nextProps.startDate, nextProps.endDate, nextProps.interval);
        }
    }

    // fetchData = (startDate, interval) => {
    fetchData = (startDate, endDate, interval) => {
        const { functionName } = this.props.match.params;

        this.props.fetchMetricsPageGraphs(this.props.httpClient, functionName, startDate, endDate);
    }

    renderInvocationCountsMetricChart = () => {
        const {functionInvocationCountMetricByMetadata} = this.props;

        const invocations = functionInvocationCountMetricByMetadata.map(data => {
            return {
                x: data.timestamp,
                y: data.invocationCount
            }
        });

        const errors = functionInvocationCountMetricByMetadata.map(data => {
            return {
                x: data.timestamp,
                y: data.errorCount
            }
        });

        const coldStarts = functionInvocationCountMetricByMetadata.map(data => {
            return {
                x: data.timestamp,
                y: data.coldStartCount
            }
        });

        return (
            <EuiSeriesChart height={250} >
                <EuiLineSeries name="invocation count" data={invocations} />
                <EuiLineSeries name="error count" data={errors} />
                <EuiLineSeries name="cold start count" data={coldStarts} />
                {/* <EuiLineSeries name="Total ROM" data={DATA_B} /> */}
            </EuiSeriesChart>
        )
    }

    renderInvocationDurationsMetricChart = () => {
        const {functionInvocationDurationsMetricByMetadata} = this.props;

        const invocationDurations = functionInvocationDurationsMetricByMetadata.map(data => {
            return {
                x: data.timestamp,
                y: data.avgInvocationDuration
            }
        });

        const errorDurations = functionInvocationDurationsMetricByMetadata.map(data => {
            return {
                x: data.timestamp,
                y: data.avgErrorDuration
            }
        });

        const coldStartDurations = functionInvocationDurationsMetricByMetadata.map(data => {
            return {
                x: data.timestamp,
                y: data.avgColdStartDuration
            }
        });

        return (
            <EuiSeriesChart height={250} >
                <EuiLineSeries name="invocation durations" data={invocationDurations} />
                <EuiLineSeries name="error durations" data={errorDurations} />
                <EuiLineSeries name="cold start durations" data={coldStartDurations} />
                {/* <EuiLineSeries name="Total ROM" data={DATA_B} /> */}
            </EuiSeriesChart>
        )
    }

    renderMemoryMetricChart = () => {
        const { functionMemoryMetricByMetadata } = this.props;

        const memoryData = functionMemoryMetricByMetadata.map(data => {
            return {
                x: data.timestamp,
                y: data.usedMemory
            };
        })

        return (
            <EuiSeriesChart height={250} >
                <EuiLineSeries name="Used Memory (MB)" data={memoryData} />
                {/* <EuiLineSeries name="Total ROM" data={DATA_B} /> */}
            </EuiSeriesChart>
        )
    }

    renderCPUMetricChart = () => {
        const { functionCPUMetricByMetadata } = this.props;

        const cpuData = functionCPUMetricByMetadata.map(data => {
            return {
                x: data.timestamp,
                y: data.cpuloadPercentage
            };
        })

        return (
            <EuiSeriesChart height={250} >
                <EuiLineSeries name="CPU Load (%)" data={cpuData} />
                {/* <EuiLineSeries name="Total ROM" data={DATA_B} /> */}
            </EuiSeriesChart>
        )
    }

    render() {
        console.log("InvocationsMetricsContainer, render; props: ", this.props);

        const DATA_A = [{ x: 0, y: 1 }, { x: 1.5, y: 1 }, { x: 2, y: 2 }, { x: 3, y: -1 }, { x: 5, y: 2 }];
        const DATA_B = [{ x: 0, y: 3 }, { x: 1, y: 4 }, { x: 2, y: 1 }, { x: 3, y: 2 }, { x: 5, y: 5 }];

        return (
            <div className="invocations-metrics-container">
                {/* {this.renderMemoryMetricChart()} */}
                {/* {this.renderCPUMetricChart()} */}

                <EuiFlexGrid columns={2}>
                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Counts</p>
                        </EuiText>
                        {/* <EuiSeriesChart height={250} xType={SCALE.TIME}> */}
                        {/* <EuiSeriesChart height={250} >
                            <EuiLineSeries name="Total RAM" data={DATA_A} />
                            <EuiLineSeries name="Total ROM" data={DATA_B} />
                        </EuiSeriesChart> */}
                        {this.renderInvocationCountsMetricChart()}
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Duration</p>
                        </EuiText>
                        {/* <EuiSeriesChart height={250} xType={SCALE.TIME}> */}
                        {/* <EuiSeriesChart height={250} >
                            <EuiLineSeries name="Total RAM" data={DATA_A} />
                            <EuiLineSeries name="Total ROM" data={DATA_B} />
                        </EuiSeriesChart> */}
                        {this.renderInvocationDurationsMetricChart()}                        
                    </EuiFlexItem>

                </EuiFlexGrid>

                <EuiFlexGrid columns={2}>
                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Memory (MB)</p>
                        </EuiText>
                        {/* <EuiSeriesChart height={250} xType={SCALE.TIME}> */}
                        {/* <EuiSeriesChart height={250} >
                            <EuiLineSeries name="Total RAM" data={DATA_A} />
                            <EuiLineSeries name="Total ROM" data={DATA_B} />
                        </EuiSeriesChart> */}
                        {this.renderMemoryMetricChart()}
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>CPU (%)</p>
                        </EuiText>
                        {/* <EuiSeriesChart height={250} xType={SCALE.TIME}> */}
                        {/* <EuiSeriesChart height={250} >
                            <EuiLineSeries name="Total RAM" data={DATA_A} />
                            <EuiLineSeries name="Total ROM" data={DATA_B} />
                        </EuiSeriesChart> */}
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