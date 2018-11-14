import React from 'react';
import {
    EuiBasicTable,
    EuiButton,
    EuiCode,
    EuiComboBox,
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
    EuiStat,
    EuiSwitch
} from '@elastic/eui';

import {EuiSeriesChartUtils} from '@elastic/eui/lib/experimental';

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
        let duration;
        let errorType;
        for (let key in this.state.invocation) {
            let obj = this.state.invocation[key];
            let source = obj['_source'];
            duration = source['duration'];
            errorType = source['errorType'];
            if ( ! errorType ){
                errorType = "NONE"
            }
        }

        let appUsedMemory;
        let  appMaxMemory;
        for (let key in this.state.memoryMetrics) {
            let obj = this.state.memoryMetrics[key];
            let source = obj['_source'];
            let metrics = source['metrics'];
            appUsedMemory = (metrics['app.usedMemory']/1024/1024).toFixed(2);
            appMaxMemory = metrics['app.maxMemory']/1024/1024;
        }

        let appCpuLoad;
        for (let key in this.state.cpuMetrics) {
            let obj = this.state.cpuMetrics[key];
            let source = obj['_source'];
            let metrics = source['metrics'];
            appCpuLoad = (metrics['app.cpuLoad']*100).toFixed(2);
        }

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
                                    title={appUsedMemory +"mb" + "/" + appMaxMemory + "mb" }
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
                                    title= {"%" + appCpuLoad}
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
            </div>
        );
    }
}

export default InvocationDetails;