import React, { Fragment } from 'react';

import {
    Link
} from 'react-router-dom';

import {
    EuiSpacer,
    EuiTextColor,
    EuiText,
    EuiDescriptionListDescription,
    EuiDescriptionListTitle,
    EuiDescriptionList,
    EuiInMemoryTable,
    EuiLink,
    EuiBasicTable,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiStat,
    EuiIcon,
    EuiToolTip,
    EuiBadge
} from '@elastic/eui';

import { HeatMapComponent, Inject, Legend, Tooltip, Adaptor } from '@syncfusion/ej2-react-heatmap';

import {
    fetchFunctionList,
    fetchInvocationsByFunctionName,
    fetchFunctionDataByFunctionName,
    fetchFunctionDataComparisonByFunctionName
} from "../../store/actions";

import { connect } from "react-redux";


class InvocationsMetaInfoContainer extends React.Component {

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
        this.props.fetchFunctionDataByFunctionName(this.props.httpClient, startDate, functionName);

        this.props.fetchFunctionDataComparisonByFunctionName(this.props.httpClient, startDate, endDate, functionName);
    }

    renderFunctionMetaInfo = () => {
        const { applicationRuntime, region, stage, invocationCount, invocationsWithColdStart, invocationsWithError, averageDuration, estimatedCost } = this.props.functionMetadataByFunctionName;
        let health = 0;
        if (typeof invocationCount == "number" && typeof invocationsWithError == "number" && invocationCount > 0) {
            health = (((invocationCount - invocationsWithError) / invocationCount) * 100).toFixed(2);
        }
        // console.log("renderFunctionMetaInfo; props: ", this.props, (((invocationCount - invocationsWithError) / invocationCount) * 100).toFixed(2));

        return (
            <EuiFlexGroup>

                <EuiFlexItem>
                    <EuiPanel className="invocation-meta-info-tags-panel">
                        <EuiToolTip
                            position="top"
                            content="Runtime"
                        >
                            <EuiBadge color="danger">
                                {applicationRuntime}
                            </EuiBadge>
                        </EuiToolTip>
                        {/* <EuiSpacer /> */}

                        <EuiToolTip
                            position="top"
                            content="Region"
                        >
                            <EuiBadge color="warning">
                                {region}
                            </EuiBadge>
                        </EuiToolTip>
                        {/* <EuiSpacer /> */}

                        <EuiToolTip
                            position="top"
                            content="Stage"
                        >
                            <EuiBadge color="secondary">
                                {stage}
                            </EuiBadge>
                        </EuiToolTip>
                    </EuiPanel>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiPanel>
                        <EuiStat
                            title={`${averageDuration || 0} ms`}
                            description="Avg. Duration"
                            textAlign="right"
                            titleColor="accent"
                        >
                            <EuiIcon type="visGauge" color="accent" />
                        </EuiStat>
                    </EuiPanel>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiPanel>
                        <EuiStat
                            className="health-color"
                            title={`${health} %`}
                            description="Health"
                            textAlign="right"
                        // titleColor="accent"
                        >
                            <EuiIcon
                                type="tear"
                            // color="accent" 
                            />
                        </EuiStat>
                    </EuiPanel>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiPanel>
                        <EuiStat
                            title={invocationCount || 0}
                            description="Invocations"
                            titleColor="secondary"
                            textAlign="right"
                        >
                            <EuiIcon type="check" color="secondary" />
                        </EuiStat>
                    </EuiPanel>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiPanel>
                        <EuiStat
                            title={invocationsWithColdStart || 0}
                            description="Cold Start"
                            titleColor="primary"
                            textAlign="right"
                        >
                            <EuiIcon type="temperature" color="primary" />
                        </EuiStat>
                    </EuiPanel>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiPanel>
                        <EuiStat
                            title={invocationsWithError || 0}
                            description="Erroneous"
                            titleColor="danger"
                            textAlign="right"
                        >
                            <EuiIcon type="alert" color="danger" />
                        </EuiStat>
                    </EuiPanel>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiPanel>
                        <EuiStat
                            title={estimatedCost ? `$ ${estimatedCost}` : `$ 0`}
                            description="Est. Cost"
                            // titleColor="danger"
                            textAlign="right"
                        >
                            <EuiIcon
                                type="starEmpty"
                            // color="danger" 
                            />
                        </EuiStat>

                    </EuiPanel>
                </EuiFlexItem>

            </EuiFlexGroup>
        )
    }

    renderComparisonResult = (data, isNegativeBetter = false) => {
        const green = "#46AE40";
        const red = "#D12B2B";
        const gray = "#AEAEAE";

        if (!data || data === 0) {
            const color = gray;
            const text = data === 0 ? data : "-"
            return (
                <span style={{marginLeft: "10px", color: color}}>
                    {text} %
                </span>
            );
        }

        if (data > 0) {
            let color = !isNegativeBetter ? green : red;
            return (
                <span style={{marginLeft: "10px", color: color}}>
                    <EuiIcon
                        style={{marginBottom: "4px"}}
                        type={"sortUp"}
                    />
                    {data} %
                </span>
            );
        } else {
            let color = !isNegativeBetter ? red : green;
            return (
                <span style={{marginLeft: "10px", color: color}}>
                    <EuiIcon
                        style={{marginBottom: "4px"}}
                        type={"sortDown"}
                    />
                    {data} %
                </span>
            );
        }

        
    }

    renderFunctionMetaInfoWithComparison = () => {
        const { 
            applicationRuntime, region, stage,
            health, invocationCount, invocationsWithColdStart, invocationsWithError, invocationsWithTimeout, averageDuration, percentile99th,
            healthComparison, invocationCountComparison, invocationsWithColdStartComparison, invocationsWithErrorComparison, invocationsWithTimeoutComparison, averageDurationComparison, percentile99thComparison,
        } = this.props.functionMetadataComparisonByFunctionName;
   
        // console.log("renderFunctionMetaInfoWithComparison; props: ", this.props);

        return (
            <EuiFlexGroup>

                <EuiFlexItem grow={1}>
                    <EuiPanel className="invocation-meta-info-tags-panel">
                        <EuiToolTip
                            position="top"
                            content="Runtime"
                        >
                            <EuiBadge color="danger">
                                {applicationRuntime}
                            </EuiBadge>
                        </EuiToolTip>

                        <EuiToolTip
                            position="top"
                            content="Region"
                        >
                            <EuiBadge color="warning">
                                {region}
                            </EuiBadge>
                        </EuiToolTip>

                        <EuiToolTip
                            position="top"
                            content="Stage"
                        >
                            <EuiBadge color="secondary">
                                {stage}
                            </EuiBadge>
                        </EuiToolTip>
                    </EuiPanel>
                </EuiFlexItem>

                <EuiFlexItem grow={10} >

                    <EuiPanel >
                        <EuiDescriptionList
                            type="column"
                            align="center"
                            compressed
                        >
                            <EuiDescriptionListTitle>
                                Health
                            </EuiDescriptionListTitle>
                            <EuiDescriptionListDescription>
                                {health} %
                                {this.renderComparisonResult(healthComparison)}
                            </EuiDescriptionListDescription>

                            <EuiDescriptionListTitle>
                                Avg. Duration
                            </EuiDescriptionListTitle>
                            <EuiDescriptionListDescription>
                                {averageDuration} ms
                                {this.renderComparisonResult(averageDurationComparison, true)}
                            </EuiDescriptionListDescription>

                            <EuiDescriptionListTitle>
                                99th percentile duration
                            </EuiDescriptionListTitle>
                            <EuiDescriptionListDescription>
                                {percentile99th} ms
                                {this.renderComparisonResult(percentile99thComparison, true)}
                            </EuiDescriptionListDescription>

                        </EuiDescriptionList>
                    </EuiPanel>

                </EuiFlexItem>

                <EuiFlexItem grow={10}>

                    <EuiPanel >
                        <EuiDescriptionList
                            type="column"
                            align="center"
                            compressed
                        >
                            <EuiDescriptionListTitle>
                                Invocations
                            </EuiDescriptionListTitle>
                            <EuiDescriptionListDescription>
                                <span>{invocationCount}</span>
                                {this.renderComparisonResult(invocationCountComparison)}
                            </EuiDescriptionListDescription>

                            <EuiDescriptionListTitle>
                                Cold Start
                            </EuiDescriptionListTitle>
                            <EuiDescriptionListDescription>
                                {invocationsWithColdStart}
                                {this.renderComparisonResult(invocationsWithColdStartComparison, true)}
                            </EuiDescriptionListDescription>

                            <EuiDescriptionListTitle>
                                Erroneous
                            </EuiDescriptionListTitle>
                            <EuiDescriptionListDescription>
                                {invocationsWithError}
                                {this.renderComparisonResult(invocationsWithErrorComparison, true)}
                            </EuiDescriptionListDescription>

                            <EuiDescriptionListTitle>
                                Timeout
                            </EuiDescriptionListTitle>
                            <EuiDescriptionListDescription>
                                <span>{invocationsWithTimeout}</span>
                                {this.renderComparisonResult(invocationsWithTimeoutComparison, true)}
                            </EuiDescriptionListDescription>

                        </EuiDescriptionList>
                    </EuiPanel>

                </EuiFlexItem>

            </EuiFlexGroup>
        )
    }


    render() {
        console.log("InvocationsMetaInfoContainer, render; props: ", this.props);

        return (
            <div className="invocations-meta-info-container">
                {/* <EuiSpacer /> */}
                {/* {this.renderFunctionMetaInfo()} */}
                <EuiSpacer />
                {this.renderFunctionMetaInfoWithComparison()}
                <EuiSpacer />
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        functionMetadataComparisonByFunctionName: state.functionList.functionMetadataComparisonByFunctionName,

        functionMetadataByFunctionName: state.functionList.functionMetadataByFunctionName,
        functionMetadataByFunctionNameFetching: state.functionList.functionMetadataByFunctionNameFetching,

        startDate: state.timeSelector.startDate,
        endDate: state.timeSelector.endDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFunctionDataByFunctionName: (httpClient, startTime, functionName) => dispatch(fetchFunctionDataByFunctionName(httpClient, startTime, functionName)),

        fetchFunctionDataComparisonByFunctionName: (httpClient, startTimestamp, endTimestamp, functionName) =>
            dispatch(fetchFunctionDataComparisonByFunctionName(httpClient, startTimestamp, endTimestamp, functionName)),
        // fetchFunctionDataComparisonByFunctionName: (httpClient) => dispatch(fetchFunctionDataComparisonByFunctionName(httpClient))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationsMetaInfoContainer)