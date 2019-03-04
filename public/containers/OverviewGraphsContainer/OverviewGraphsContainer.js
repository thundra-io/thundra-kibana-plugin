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

import { connect } from "react-redux";

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
            DATA.push({ x: obj.doc_count, y: obj.key });
        }

        const EDATA = [];
        let eArr = this.props.errInvocationsByFunctions;
        for (let i = eArr.length - 1; i >= 0; i--) {
            let obj = eArr[i];
            EDATA.push({ x: obj.doc_count, y: obj.key });
        }

        const CDATA = [];
        let cArr = this.props.csInvocationsByFunctions;
        for (let i = cArr.length - 1; i >= 0; i--) {
            let obj = cArr[i];
            CDATA.push({ x: obj.doc_count, y: obj.key });
        }

        return (
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiText grow={false}>
                        <p>Top 10 invoked functions</p>
                    </EuiText>
                    <EuiSeriesChart
                        yType={SCALE.ORDINAL}
                        orientation={ORIENTATION.HORIZONTAL}
                        height={250}
                    >
                        <EuiBarSeries name="Invocation Count" data={DATA} color={"#65a637"} onValueClick={(e) => this.onClick(e)} />
                    </EuiSeriesChart>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiText grow={false}>
                        <p>Top 10 erroneous functions</p>
                    </EuiText>
                    <EuiSeriesChart
                        yType={SCALE.ORDINAL}
                        orientation={ORIENTATION.HORIZONTAL}
                        height={250}
                    >
                        <EuiBarSeries name="Invocation Count" data={EDATA} color={"#d93f3c"} onValueClick={(e) => this.onClick(e)} />
                    </EuiSeriesChart>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiText grow={false}>
                        <p>Top 10 cold started functions</p>
                    </EuiText>
                    <EuiSeriesChart
                        yType={SCALE.ORDINAL}
                        orientation={ORIENTATION.HORIZONTAL}
                        height={250}
                    >
                        <EuiBarSeries name="Invocation Count" data={CDATA} color={"#6db7c6"} onValueClick={(e) => this.onClick(e)} />
                    </EuiSeriesChart>
                </EuiFlexItem>

            </EuiFlexGroup>

        );
    }

    onClick = (e) => {
        const {startDate, interval} = this.props;
        const functionName = e.y;

        this.props.fetchInvocationCountsPerHourByName(this.props.httpClient, startDate, interval, functionName);
        this.props.fetchInvocationDurationsPerHourByName(this.props.httpClient, startDate, interval, functionName);

        this.setState({selectedFunctionName: functionName});
    };


    renderPerHourLineCharts = () => {
        const myData = [];
        const DATA_A = [];
        for (let key in this.props.invocationCountsPerHour) {
            let obj = this.props.invocationCountsPerHour[key];
            DATA_A.push({ x: obj.key, y: obj.doc_count });
        }

        myData[0] = {
            data: DATA_A,
            name: "InvocationCount"
        };

        const yourData = [];
        const DATA_B = [];
        for (let key in this.props.invocationDurationsPerHour) {
            let obj = this.props.invocationDurationsPerHour[key];
            DATA_B.push({ x: obj.key, y: Number((obj.duration.value / 60000).toFixed(2)) });
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
                        <EuiSeriesChart height={250} xType={SCALE.TIME}>
                            {myData.map((d, i) => (
                                <EuiLineSeries key={`count-${i}`} name={d.name} data={d.data} showLineMarks={false} curve={CURVE_MONOTONE_X} />
                            ))}
                        </EuiSeriesChart>
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Total  Invocation duration for <EuiTextColor color="subdued"> {this.state.selectedFunctionName == null ? 'all' : this.state.selectedFunctionName}</EuiTextColor> function(s)</p>
                        </EuiText>
                        <EuiSeriesChart height={250} xType={SCALE.TIME}>
                            {yourData.map((d, i) => (
                                <EuiLineSeries key={`duration-${i}`} name={d.name} data={d.data} showLineMarks={false} curve={CURVE_MONOTONE_X} />
                            ))}
                        </EuiSeriesChart>
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