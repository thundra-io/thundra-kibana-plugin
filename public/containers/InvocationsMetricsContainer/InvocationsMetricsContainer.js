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
        console.log("cwrp; props, nextProps: ", this.props, nextProps);
        // When start date is changed by global time selector, fetch data again.
        if (this.props.startDate !== nextProps.startDate ) {
            // this.fetchData(nextProps.startDate, nextProps.interval);
            console.log("cwrp, fetchData; this.props, nextProps: ", this.props, nextProps);
            this.fetchData(nextProps.startDate, nextProps.endDate, nextProps.interval);
        }
    }

    // fetchData = (startDate, interval) => {
    fetchData = (startDate, endDate, interval) => {
        const { functionName } = this.props.match.params;
        // const { applicationRuntime, region, stage } = this.props.functionMetadataByFunctionName;

        // const { paginationFrom, paginationSize, sortField, sortDirection } = this.state;
        // this.props.fetchInvocationsByFunctionName(this.props.httpClient, startDate, interval, functionName, paginationSize, paginationFrom, sortField, sortDirection);
        
        // this.props.fetchFunctionDataByFunctionName(this.props.httpClient, startDate, functionName);
        
        // if (this.props.functionMetadataByFunctionName !== {}) {
        // if (this.props.functionMetadataByFunctionName.applicationName) {
        //     console.log("FETCH: ", functionName, applicationRuntime, stage, region, this.props.functionMetadataByFunctionName);
        //     this.props.fetchFunctionCPUMetricGraphData(this.props.httpClient, startDate, endDate, functionName, applicationRuntime, stage, region);
        // }

        this.props.fetchFunctionCPUMetricGraphData(this.props.httpClient, functionName, startDate, endDate);
        // this.props.fetchFunctionCPUMetricGraphData(this.props.httpClient, startDate, endDate, functionName, applicationRuntime, stage, region);
    }

    renderMemoryMetricChart = () => {
        return (
            <div>
                memory metric chart container
            </div>
        )
    }

    renderCPUMetricChart = () => {
        const {functionCPUMetricByMetadata} = this.props;

        const cpuData = functionCPUMetricByMetadata.map( data => {
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
                {this.renderMemoryMetricChart()}
                {/* {this.renderCPUMetricChart()} */}

                <EuiFlexGrid columns={2}>
                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Counts</p>
                        </EuiText>
                        {/* <EuiSeriesChart height={250} xType={SCALE.TIME}> */}
                        <EuiSeriesChart height={250} >
                            <EuiLineSeries name="Total RAM" data={DATA_A} />
                            <EuiLineSeries name="Total ROM" data={DATA_B} />
                        </EuiSeriesChart>
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Duration</p>
                        </EuiText>
                        {/* <EuiSeriesChart height={250} xType={SCALE.TIME}> */}
                        <EuiSeriesChart height={250} >
                            <EuiLineSeries name="Total RAM" data={DATA_A} />
                            <EuiLineSeries name="Total ROM" data={DATA_B} />
                        </EuiSeriesChart>
                    </EuiFlexItem>

                </EuiFlexGrid>

                <EuiFlexGrid columns={2}>
                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Memory</p>
                        </EuiText>
                        {/* <EuiSeriesChart height={250} xType={SCALE.TIME}> */}
                        <EuiSeriesChart height={250} >
                            <EuiLineSeries name="Total RAM" data={DATA_A} />
                            <EuiLineSeries name="Total ROM" data={DATA_B} />
                        </EuiSeriesChart>
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>CPU</p>
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
        // invocationList: state.functionList.invocationsByFunctionName,
        // invocationListFetching: state.functionList.invocationsByFunctionNameFetching,

        functionCPUMetricByMetadata: state.functionList.functionCPUMetricByMetadata,
        
        functionMetadataByFunctionName: state.functionList.functionMetadataByFunctionName,
        functionMetadataByFunctionNameFetching: state.functionList.functionMetadataByFunctionNameFetching,

        startDate: state.timeSelector.startDate,
        endDate: state.timeSelector.endDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFunctionCPUMetricGraphData: (httpClient, functionName, startTime, endTime) => dispatch(fetchFunctionCPUMetricGraphData(httpClient, functionName, startTime, endTime)),
        // fetchFunctionCPUMetricGraphData: (httpClient, startTime, endTime, functionName, applicationRuntime, stage, region) => 
        //     dispatch(fetchFunctionCPUMetricGraphData(httpClient, startTime, endTime, functionName, applicationRuntime, stage, region)),

        // fetchFunctionList: (httpClient, startTime) => dispatch(fetchFunctionList(httpClient, startTime)),

        // fetchInvocationsByFunctionName: (httpClient, startTime, interval, functionName, paginationSize, paginationFrom, sortField, sortDirection) =>
        //     dispatch(fetchInvocationsByFunctionName(httpClient, startTime, interval, functionName, paginationSize, paginationFrom, sortField, sortDirection)),
        
        fetchFunctionDataByFunctionName: (httpClient, startTime, functionName) => dispatch(fetchFunctionDataByFunctionName(httpClient, startTime, functionName))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationsMetricsContainer)