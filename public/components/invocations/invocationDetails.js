import React from 'react';
import {
    EuiAccordion,
    EuiBasicTable,
    EuiButton,
    EuiButtonIcon,
    EuiCode,
    EuiComboBox,
    EuiDescriptionList,
    EuiDescriptionListDescription,
    EuiDescriptionListTitle,
    EuiFieldPassword,
    EuiFieldText,
    EuiFlexGrid,
    EuiFlexGroup,
    EuiFlexItem,
    EuiForm,
    EuiFormRow,
    EuiHealth,
    EuiIcon,
    EuiLink,
    EuiPanel,
    EuiSelect,
    EuiSpacer,
    EuiStat,
    EuiSwitch,
    EuiTextArea,
    EuiTitle
} from '@elastic/eui';

import {EuiSeriesChartUtils} from '@elastic/eui/lib/experimental';
import {connect} from "react-redux";

const {
    CURVE_MONOTONE_X,
} = EuiSeriesChartUtils.CURVE;

const { SCALE } = EuiSeriesChartUtils;

class InvocationDetails extends React.Component {
    constructor(props) {
        super(props);
        this.curves = [
            { value: 'linear', text: 'Linear' },
            { value: 'curveCardinal', text: 'Curve Cardinal' },
            { value: 'curveNatural', text: 'Curve Natural' },
            { value: 'curveMonotoneX', text: 'Curve Monotone X' },
            { value: 'curveMonotoneY', text: 'Curve Monotone Y' },
            { value: 'curveBasis', text: 'Curve Basis' },
            { value: 'curveCatmullRom', text: 'Curve Catmull Rom' },
            { value: 'curveStep', text: 'Curve Step' },
            { value: 'curveStepAfter', text: 'Curve Step After' },
            { value: 'curveStepBefore', text: 'Curve Step Before' },
        ];


        this.state = {
            invocation: {},
            memoryMetrics : {},
            cpuMetrics : {},
            selectedInvocation: null,
            curve: this.curves[0].value
        };
    }

    componentWillMount() {
        const {httpClient} = this.props;

        const url = window.location.href;
        const startChar = url.indexOf('/', 8);
        const path = url.substr(startChar, url.length);
        const transactionId = path.substr(path.lastIndexOf('/') + 1);
        if ('invocationDetails' !== transactionId) {
            this.setState({
                selectedInvocation: transactionId,
            });
        }
        this.doRequest(httpClient, transactionId)
    }


    doRequest = (httpClient, transactionId) => {
        httpClient.get('../api/thundra/invocation-details-by-id', {
            params:{
                transactionId: transactionId,
                metricName: "CPUMetric"
            }
        }).then((resp) => {
            this.setState({
                cpuMetrics: resp.data.metrics
            });
        });

        httpClient.get('../api/thundra/invocation-by-id', {
            params:{
                transactionId: transactionId,
                metricName: "CPUMetric"
            }
        }).then((resp) => {
            this.setState({
                invocation: resp.data.invocation
            });
        });

        httpClient.get('../api/thundra/invocation-details-by-id', {
            params:{
                transactionId: transactionId,
                metricName: "MemoryMetric"
            }
        }).then((resp) => {
            this.setState({
                memoryMetrics: resp.data.metrics
            });
        });
    };

    onCurveChange = e => {
        this.setState({
            curve: e.target.value,
        });
    };

    render() {
        let NA = "N/A";
        let duration;
        let errorType;
        let startTime;
        let arn;
        let logStreamName;
        let requestId;
        let coldStart;
        let runtime;
        for (let key in this.state.invocation) {
            let obj = this.state.invocation[key];
            let source = obj['_source'];
            let tags = source['tags'];

            duration = source['duration'];
            errorType = source['errorType'];
            startTime = source['startTime'];
            runtime = source['applicationRuntime'];

            arn = tags['aws.lambda.arn'];
            logStreamName = tags['aws.lambda.log_stream_name'];
            requestId = tags['aws.lambda.invocation.request_id'];
            coldStart = tags['aws.lambda.invocation.coldstart'];

            if ( ! errorType ){
                errorType = "NONE"
            }
        }
        console.log( coldStart );

        let appUsedMemory = NA;
        let appMaxMemory = NA;
        for (let key in this.state.memoryMetrics) {
            let obj = this.state.memoryMetrics[key];
            let source = obj['_source'];
            let metrics = source['metrics'];
            appUsedMemory = (metrics['app.usedMemory']/1024/1024).toFixed(2);
            appMaxMemory = metrics['app.maxMemory']/1024/1024;

            if ( ! appUsedMemory )
                appUsedMemory = NA;

            if ( ! appMaxMemory )
                appMaxMemory = NA;
        }

        let appCpuLoad = NA;
        for (let key in this.state.cpuMetrics) {
            let obj = this.state.cpuMetrics[key];
            let source = obj['_source'];
            let metrics = source['metrics'];
            appCpuLoad = (metrics['app.cpuLoad']*100).toFixed(2);
        }

        const repeatableForm = (
            <EuiForm>
                <EuiFlexGroup>
                    <EuiFlexItem>
                        <EuiFormRow label="Username">
                            <EuiFieldText icon="user" placeholder="John" />
                        </EuiFormRow>
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiFormRow label="Password" helpText="Must include one number and one symbol">
                            <EuiFieldPassword icon="lock" />
                        </EuiFormRow>
                    </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer size="m" />

                <EuiFormRow label="Body">
                    <EuiTextArea placeholder="I am a textarea, put some content in me!" />
                </EuiFormRow>
            </EuiForm>
        );

        const buttonContent = (
            <div>
                <EuiFlexGroup gutterSize="s" alignItems="center">
                    <EuiFlexItem grow={false}>
                        <EuiIcon type="tokenException" size="m" />
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiTitle size="s" className="euiAccordionForm__title">
                            <h6>Basic Information</h6>
                        </EuiTitle>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </div>
        );

        return (
            <div>
                <EuiFlexGroup>
                    { duration &&
                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiStat
                                    title={duration + "ms"}
                                    description="Duration"
                                    textAlign="right"
                                >
                                    <EuiIcon type="check" color="secondary" />
                                </EuiStat>
                            </EuiPanel>
                        </EuiFlexItem>
                    }

                    { appUsedMemory && appMaxMemory &&
                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiStat
                                    title= {appUsedMemory === NA ? NA : (appUsedMemory +"mb" + "/" + appMaxMemory + "mb")}
                                    description="Memory"
                                    titleColor="secondary"
                                    textAlign="right"
                                >
                                    <EuiIcon type="check" color="secondary" />
                                </EuiStat>
                            </EuiPanel>
                        </EuiFlexItem>
                    }

                    {appCpuLoad &&
                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiStat
                                    title= {appCpuLoad === NA ? NA  : "%" + appCpuLoad}
                                    description="Cpu Load"
                                    titleColor="accent"
                                    textAlign="right"
                                >
                                    <EuiIcon type="clock" color="accent" />
                                </EuiStat>
                            </EuiPanel>
                        </EuiFlexItem>
                    }

                    { errorType &&
                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiStat
                                    title={errorType}
                                    description="Error"
                                    titleColor="danger"
                                    textAlign="right"
                                >
                                    <EuiIcon type="alert" color="danger" />
                                </EuiStat>
                            </EuiPanel>
                        </EuiFlexItem>
                    }
                </EuiFlexGroup>

                <div>
                    <EuiSpacer size="l" />
                    <EuiAccordion
                        id="accordionForm1"
                        className="euiAccordionForm"
                        buttonClassName="euiAccordionForm__button"
                        buttonContent={buttonContent}
                        paddingSize="l"
                    >
                        <EuiFlexGroup>

                            <EuiFlexItem>
                                <EuiDescriptionList>
                                    <EuiDescriptionListTitle>
                                       Date
                                    </EuiDescriptionListTitle>
                                    <EuiDescriptionListDescription>
                                        {startTime}
                                    </EuiDescriptionListDescription>
                                    <EuiDescriptionListTitle>
                                       Arn
                                    </EuiDescriptionListTitle>
                                    <EuiDescriptionListDescription>
                                        {arn}
                                    </EuiDescriptionListDescription>

                                    <EuiDescriptionListTitle>
                                        Request Id
                                    </EuiDescriptionListTitle>
                                    <EuiDescriptionListDescription>
                                        {requestId}
                                    </EuiDescriptionListDescription>
                                </EuiDescriptionList>
                            </EuiFlexItem>

                            <EuiFlexItem>
                                <EuiDescriptionList>
                                    <EuiDescriptionListTitle>
                                        Cloudwatch Logs
                                    </EuiDescriptionListTitle>
                                    <EuiDescriptionListDescription>
                                        {logStreamName}
                                    </EuiDescriptionListDescription>

                                    <EuiDescriptionListTitle>
                                        Runtime
                                    </EuiDescriptionListTitle>
                                    <EuiDescriptionListDescription>
                                        {runtime}
                                    </EuiDescriptionListDescription>

                                    <EuiDescriptionListTitle>
                                       Cold Start
                                    </EuiDescriptionListTitle>
                                    <EuiDescriptionListDescription>
                                        { "" + coldStart}
                                    </EuiDescriptionListDescription>
                                </EuiDescriptionList>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiAccordion>
                </div>

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
)(InvocationDetails)