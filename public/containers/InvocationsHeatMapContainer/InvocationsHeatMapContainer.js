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
    fetchFunctionDataByFunctionName,
    fetchInvocationsHeatMap
} from "../../store/actions";

import { connect } from "react-redux";
import moment from 'moment';


class InvocationsHeatMapContainer extends React.Component {

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
        const { startDate, endDate, interval } = this.props;
        // const { paginationFrom, paginationSize } = this.state;

        this.fetchData(startDate, endDate, interval);

    }

    componentWillReceiveProps(nextProps) {
        // When start date is changed by global time selector, fetch data again.
        if (this.props.startDate !== nextProps.startDate) {
            this.fetchData(nextProps.startDate, nextProps.endDate, nextProps.interval);
        }

        // if (nextProps.functionMetadataByFunctionName !== {} && 
        //     this.props.functionMetadataByFunctionName !== nextProps.functionMetadataByFunctionName) 
        // {
        //     // todo fetch function heats here.
        //     // dispatch(fetchInvocationsHeatMap(httpClient, funcName, funcStage, funcRegion, funcRuntime, startTime, endTime, intervalMillis, bucketSize))
        //     this.props.fetchInvocationsHeatMap(httpClient, funcName, funcStage, funcRegion, funcRuntime, startTime, endTime, intervalMillis, bucketSize);
        // }
    }

    fetchData = (startDate, endDate, interval) => {
        const { functionName } = this.props.match.params;
        const { paginationFrom, paginationSize } = this.state;
        const { applicationName, stage, region, applicationRuntime } = this.props.functionMetadataByFunctionName;

        // this.props.fetchInvocationsByFunctionName(this.props.httpClient, startDate, interval, functionName, paginationSize, paginationFrom);
        // this.props.fetchFunctionDataByFunctionName(this.props.httpClient, startDate, functionName);

        // this.props.fetchInvocationsHeatMap(this.props.httpClient);

        if (this.props.functionMetadataByFunctionName !== {}) {
            // this.props.fetchInvocationsHeatMap(httpClient, applicationName, stage, region, applicationRuntime, startDate, endDate, intervalMillis, bucketSize);
            this.props.fetchInvocationsHeatMap(this.props.httpClient, applicationName, stage, region, applicationRuntime, startDate, endDate);
        }

        // this.props.fetchInvocationsHeatMap(this.props.httpClient, applicationName, stage, region, applicationRuntime, startDate, endDate);
    }

    convertRawHeatsToHeatmapData = () => {
        const {
            heatMapDurationEnd: durationEnd,
            heatMapDurationStart: durationStart,
            heatMapDurationGap: durationGap,
            heatMapEndTime,
            heatMapStartTime,
            heatMapTimeGap: timeGap,
            heats
        } = this.props.invocationHeats;

        // xlabels
        let xLabelsTimestamp = [];
        for (let timestamp = heatMapStartTime; timestamp < heatMapEndTime; timestamp = timestamp + timeGap) {

            if (((timestamp - heatMapStartTime) / timeGap) % 10 === 0) {
                xLabelsTimestamp.push(moment(timestamp).format('LT'));
            } else {
                xLabelsTimestamp.push(" ");
            }
        }

        // ylabels
        let yLabels = [];
        for (let duration = durationStart; duration < durationEnd; duration = duration + durationGap) {
            yLabels.push(duration);
        }

        // If heats array is empty then return here immediately.
        if (!this.props.invocationHeats.heats) {
            return {
                xLabels: xLabelsTimestamp,
                yLabels,
                heats: []
            };
        }

        // Initialize 2D empty array.
        let data = new Array(yLabels.length)
            .fill(0)
            .map(() =>
                new Array(xLabelsTimestamp.length).fill(0).map(() => 0)
            );

        for (let heat of heats) {
            const colIndex = Math.floor((heat.xaxesStartTime - heatMapStartTime) / timeGap);
            const rowIndex = Math.floor((heat.yaxesStart - durationStart) / durationGap);

            let rowArr = data[rowIndex];
            rowArr[colIndex] = heat.invocationCount;
        }

        console.log("convertRawHeatsToHeatmapData; props: ", this.props, xLabelsTimestamp, yLabels, data);
        return {
            xLabels: xLabelsTimestamp,
            yLabels,
            heats: data
        };
    }

    renderHeatMapDefault = () => {
        if (this.props.invocationHeatsFetching) {
            return (
                <div>
                    heatmap fetching
                </div>
            )
        }

        const heatmapData = [
            [73, 39, 26, 39, 94, 0],
            [93, 58, 53, 38, 26, 68],
            [99, 28, 22, 4, 66, 90],
            [14, 26, 97, 69, 69, 3],
            [7, 46, 47, 47, 88, 6],
            [41, 55, 73, 23, 3, 79],
            [56, 69, 21, 86, 3, 33],
            [45, 7, 53, 81, 95, 79],
            [60, 77, 74, 68, 88, 51],
            [25, 25, 10, 12, 78, 14],
            [25, 56, 55, 58, 12, 82],
            [74, 33, 88, 23, 86, 59]
        ];

        // const heatmapData = this.convertRawHeatsToHeatmapData();

        // let heatmapData = [];
        // const heatsData = this.convertRawHeatsToHeatmapData();
        // if (heatsData.length > 0) {
        //     heatmapData = heatsData[0].map((col, i) => heatsData.map(row => row[i]));
        // }

        return (
            <HeatMapComponent id='heatmap'
                titleSettings={{
                    text: 'Sales Revenue per Employee (in 1000 US$)',
                    textStyle: {
                        size: '15px',
                        fontWeight: '500',
                        fontStyle: 'Normal',
                        fontFamily: 'Segoe UI'
                    }
                }}
                xAxis={{
                    labels: ['Nancy', 'Andrew', 'Janet', 'Margaret', 'Steven',
                        'Michael', 'Robert', 'Laura', 'Anne', 'Paul', 'Karin', 'Mario'],
                }}
                yAxis={{
                    labels: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
                }}
                cellSettings={{
                    showLabel: true,
                }}
                allowSelection={true}
                cellSelected={(event) => console.log("cell selected; e: ", event)}
                dataSource={heatmapData}>
                <Inject services={[Legend, Tooltip]} />
            </HeatMapComponent>
        );
    }

    renderHeatMap = () => {
        if (this.props.invocationHeatsFetching) {
            return (
                <div>
                    heatmap fetching
                </div>
            )
        }

        let heatmapData = [];
        const heatsData = this.convertRawHeatsToHeatmapData();
        // Compute transpose of the heatsData array to fit the HeatMapComponent.
        if (heatsData.heats.length > 0) {
            heatmapData = heatsData.heats[0].map((col, i) => heatsData.heats.map(row => row[i]));
        }

        return (
            <HeatMapComponent id='heatmap'
                titleSettings={{
                    text: 'Invocations Heat Map',
                    textStyle: {
                        size: '15px',
                        fontWeight: '500',
                        fontStyle: 'Normal',
                        fontFamily: 'Segoe UI'
                    }
                }}
                xAxis={{
                    labels: heatsData.xLabels,
                    labelRotation: -90,
                }}
                yAxis={{
                    labels: heatsData.yLabels,
                }}
                paletteSettings={{
                    palette: [
                        { color: '#FFFFFF' },
                        { color: '#4256f4' },
                    ],
                    type: "Gradient"
                }}
                cellSettings={{
                    showLabel: false,
                }}
                allowSelection={true}
                cellSelected={(event) => console.log("cell selected; e: ", event)}
                dataSource={heatmapData}
                // showTooltip={false}
            >
                <Inject services={[Legend, Tooltip]} />
            </HeatMapComponent>
        );
    }

    render() {
        console.log("InvocationsHeatMapContainer, render; props: ", this.props);
        // const { applicationRuntime, region, stage, invocationCount, invocationsWithColdStart, invocationsWithError } = this.props.functionMetadataByFunctionName;

        return (
            <div className="invocations-heat-map-container">
                {/* <p>heatmap here</p> */}
                {this.renderHeatMap()}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        invocationHeats: state.functionList.invocationHeats,
        invocationHeatsFetching: state.functionList.invocationHeatsFetching,

        // invocationList: state.functionList.invocationsByFunctionName,
        // invocationListFetching: state.functionList.invocationsByFunctionNameFetching,

        functionMetadataByFunctionName: state.functionList.functionMetadataByFunctionName,
        functionMetadataByFunctionNameFetching: state.functionList.functionMetadataByFunctionNameFetching,

        startDate: state.timeSelector.startDate,
        endDate: state.timeSelector.endDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        // fetchInvocationsHeatMap: (httpClient, funcName, funcStage, funcRegion, funcRuntime, startTime, endTime, intervalMillis, bucketSize) => 
        //     dispatch(fetchInvocationsHeatMap(httpClient, funcName, funcStage, funcRegion, funcRuntime, startTime, endTime, intervalMillis, bucketSize)),
        fetchInvocationsHeatMap: (httpClient, funcName, funcStage, funcRegion, funcRuntime, startTime, endTime) =>
            dispatch(fetchInvocationsHeatMap(httpClient, funcName, funcStage, funcRegion, funcRuntime, startTime, endTime)),

        // fetchFunctionList: (httpClient, startTime) => dispatch(fetchFunctionList(httpClient, startTime)),
        // fetchInvocationsByFunctionName: (httpClient, startTime, interval, functionName, paginationSize, paginationFrom) =>
        //     dispatch(fetchInvocationsByFunctionName(httpClient, startTime, interval, functionName, paginationSize, paginationFrom)),

        // fetchFunctionDataByFunctionName: (httpClient, startTime, functionName) => dispatch(fetchFunctionDataByFunctionName(httpClient, startTime, functionName))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationsHeatMapContainer)