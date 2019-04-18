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
    EuiToolTip,
    EuiBadge
} from '@elastic/eui';

import { HeatMapComponent, Inject, Legend, Tooltip, Adaptor } from '@syncfusion/ej2-react-heatmap';

import {
    fetchFunctionList,
    fetchInvocationsByFunctionName,
    fetchFunctionDataByFunctionName
} from "../../store/actions";

import { connect } from "react-redux";


class InvocationsMetaInfoContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { startDate, interval } = this.props;

        this.fetchData(startDate, interval);
    }

    componentWillReceiveProps(nextProps) {
        // When start date is changed by global time selector, fetch data again.
        if (this.props.startDate !== nextProps.startDate) {
            this.fetchData(nextProps.startDate, nextProps.interval);
        }
    }

    fetchData = (startDate, interval) => {
        const { functionName } = this.props.match.params;
        this.props.fetchFunctionDataByFunctionName(this.props.httpClient, startDate, functionName);
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


    render() {
        console.log("InvocationsMetaInfoContainer, render; props: ", this.props);

        return (
            <div className="invocations-meta-info-container">
                <EuiSpacer />
                {this.renderFunctionMetaInfo()}
                <EuiSpacer />
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        functionMetadataByFunctionName: state.functionList.functionMetadataByFunctionName,
        functionMetadataByFunctionNameFetching: state.functionList.functionMetadataByFunctionNameFetching,

        startDate: state.timeSelector.startDate,
        interval: state.timeSelector.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFunctionDataByFunctionName: (httpClient, startTime, functionName) => dispatch(fetchFunctionDataByFunctionName(httpClient, startTime, functionName))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationsMetaInfoContainer)