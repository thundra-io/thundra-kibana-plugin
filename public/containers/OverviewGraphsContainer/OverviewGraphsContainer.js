import React, { Fragment } from 'react';

import {
    EuiSpacer,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFlexGrid,
    EuiText,
    EuiTextColor
} from '@elastic/eui';

import {
    EuiSeriesChart,
    EuiBarSeries,
    EuiSeriesChartUtils,
    EuiLineSeries
} from '@elastic/eui/lib/experimental';

import {
    fetchInvocationsByFunctions,
    fetchErroneousInvocationsByFunctions,
    fetchColdStartInvocationsByFunctions,
    fetchInvocationCountsPerHour,
    fetchInvocationDurationsPerHour,
    fetchInvocationCountsPerHourByName,
    fetchInvocationDurationsPerHourByName
} from "../../store/actions";

import {
    BarChart,
    Bar,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line
} from 'recharts';

import { connect } from "react-redux";
import moment from "moment";

const { SCALE, ORIENTATION } = EuiSeriesChartUtils;
const { CURVE_MONOTONE_X } = EuiSeriesChartUtils.CURVE;


class OverviewGraphsContainer extends React.Component {

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
        this.props.fetchInvocationsByFunctions(this.props.httpClient, startDate, interval);
        this.props.fetchErroneousInvocationsByFunctions(this.props.httpClient, startDate, interval);
        this.props.fetchColdStartInvocationsByFunctions(this.props.httpClient, startDate, interval);
        this.props.fetchInvocationCountsPerHour(this.props.httpClient, startDate, interval);
        this.props.fetchInvocationDurationsPerHour(this.props.httpClient, startDate, interval);
    }

    renderHorizontalBarCharts = () => {
        const DATA = [];
        let arr = this.props.invocationsByFunctions;
        for (let i = arr.length - 1; i >= 0; i--) {
            let obj = arr[i];
            DATA.push({ invocationCount: obj.doc_count, y: obj.key });
        }

        const EDATA = [];
        let eArr = this.props.errInvocationsByFunctions;
        for (let i = eArr.length - 1; i >= 0; i--) {
            let obj = eArr[i];
            EDATA.push({ invocationCount: obj.doc_count, y: obj.key });
        }

        const CDATA = [];
        let cArr = this.props.csInvocationsByFunctions;
        for (let i = cArr.length - 1; i >= 0; i--) {
            let obj = cArr[i];
            CDATA.push({ invocationCount: obj.doc_count, y: obj.key });
        }

        return (
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiText grow={false}>
                        <p>Top 10 invoked functions</p>
                    </EuiText>
                    <BarChart
                        onClick={(e) => this.onClick(e)}
                        data={DATA}
                        margin={{ top: 0, right: 0, bottom: 0, left: 100 }}
                        width={400}
                        height={250}
                        layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="y" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="invocationCount" fill="#37DC94" />
                    </BarChart>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiText grow={false}>
                        <p>Top 10 erroneous functions</p>
                    </EuiText>
                    <BarChart
                        onClick={(e) => this.onClick(e)}
                        data={EDATA}
                        margin={{ top: 0, right: 0, bottom: 0, left: 100 }}
                        width={400}
                        height={250}
                        layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="y" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="invocationCount" fill="#FF5126" />
                    </BarChart>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiText grow={false}>
                        <p>Top 10 cold started functions</p>
                    </EuiText>
                    <BarChart
                        onClick={(e) => this.onClick(e)}
                        data={CDATA}
                        margin={{ top: 0, right: 0, bottom: 0, left: 100 }}
                        width={400}
                        height={250}
                        layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="y" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="invocationCount" fill="#162C9B" />
                    </BarChart>
                </EuiFlexItem>

            </EuiFlexGroup>

        );
    }

    onClick = (e) => {
        const { startDate, interval } = this.props;
        // const functionName = e.y;
        if (e && e.activeLabel) {
            const functionName = e.activeLabel;

            this.props.fetchInvocationCountsPerHourByName(this.props.httpClient, startDate, interval, functionName);
            this.props.fetchInvocationDurationsPerHourByName(this.props.httpClient, startDate, interval, functionName);

            this.setState({ selectedFunctionName: functionName });
        }
    };


    renderPerHourLineCharts = () => {
        const myData = [];
        const DATA_A = [];
        for (let key in this.props.invocationCountsPerHour) {
            let obj = this.props.invocationCountsPerHour[key];
            // DATA_A.push({ x: obj.key, y: obj.doc_count });
            DATA_A.push({ x: moment(obj.key).format("HH:mm"), count: obj.doc_count });
        }

        myData[0] = {
            data: DATA_A,
            name: "InvocationCount"
        };

        const yourData = [];
        const DATA_B = [];
        for (let key in this.props.invocationDurationsPerHour) {
            let obj = this.props.invocationDurationsPerHour[key];
            // DATA_B.push({ x: obj.key, y: Number((obj.duration.value / 60000).toFixed(2)) });
            DATA_B.push({ x: moment(obj.key).format("HH:mm"), duration: Number((obj.duration.value / 60000).toFixed(2)) });
        }

        yourData[0] = {
            data: DATA_B,
            name: "InvocationDuration"
        };

        return (
            <Fragment>
                <EuiFlexGrid columns={2}>
                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p> Total invocation count for <EuiTextColor color="subdued"> {this.state.selectedFunctionName == null ? 'all' : this.state.selectedFunctionName}</EuiTextColor> function(s)</p>
                        </EuiText>
                        <LineChart
                            data={DATA_A}
                            syncId="metricChart"
                            width={450}
                            height={250}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="x" />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            <Line type="monotone" dataKey="count" stroke="#37DC94" />

                        </LineChart>
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Total  Invocation duration for <EuiTextColor color="subdued"> {this.state.selectedFunctionName == null ? 'all' : this.state.selectedFunctionName}</EuiTextColor> function(s)</p>
                        </EuiText>
                        <LineChart
                            data={DATA_B}
                            syncId="metricChart"
                            width={450}
                            height={250}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="x" />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            <Line type="monotone" dataKey="duration" stroke="#37DC94" />

                        </LineChart>
                    </EuiFlexItem>

                </EuiFlexGrid>
                <EuiSpacer />
            </Fragment>
        );
    }


    render() {
        // console.log("OverviewGraphsContainer, render; props: ", this.props);

        return (
            <div className="overview-graphs-container">
                {this.renderHorizontalBarCharts()}
                {this.renderPerHourLineCharts()}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        invocationsByFunctions: state.functionStats.invocationsByFunctions,
        invocationsByFunctionsFetching: state.functionStats.invocationsByFunctionsFetching,
        errInvocationsByFunctions: state.functionStats.errInvocationsByFunctions,
        csInvocationsByFunctions: state.functionStats.csInvocationsByFunctions,

        invocationCountsPerHour: state.functionStats.invocationCountsPerHour,
        invocationDurationsPerHour: state.functionStats.invocationDurationsPerHour,

        startDate: state.timeSelector.startDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchInvocationsByFunctions: (httpClient, startTime, interval) => dispatch(fetchInvocationsByFunctions(httpClient, startTime, interval)),
        fetchErroneousInvocationsByFunctions: (httpClient, startTime, interval) => dispatch(fetchErroneousInvocationsByFunctions(httpClient, startTime, interval)),
        fetchColdStartInvocationsByFunctions: (httpClient, startTime, interval) => dispatch(fetchColdStartInvocationsByFunctions(httpClient, startTime, interval)),

        fetchInvocationCountsPerHour: (httpClient, startTime, interval) => dispatch(fetchInvocationCountsPerHour(httpClient, startTime, interval)),
        fetchInvocationDurationsPerHour: (httpClient, startTime, interval) => dispatch(fetchInvocationDurationsPerHour(httpClient, startTime, interval)),
        fetchInvocationCountsPerHourByName: (httpClient, startTime, interval, functionName) => dispatch(fetchInvocationCountsPerHourByName(httpClient, startTime, interval, functionName)),
        fetchInvocationDurationsPerHourByName: (httpClient, startTime, interval, functionName) => dispatch(fetchInvocationDurationsPerHourByName(httpClient, startTime, interval, functionName)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OverviewGraphsContainer)