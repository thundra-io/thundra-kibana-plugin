import React, { Component, Fragment } from 'react';
import {Card, CardBody, Col, Row} from 'reactstrap';
import {
    EuiBasicTable,
    EuiLink,
    EuiHealth,
    EuiSpacer,
    EuiSwitch,
    EuiCode,
    EuiButton,
    EuiComboBox,
    EuiFlexGrid,
    EuiFlexItem,
    EuiText,
    EuiTextColor,
    EuiTitle
} from '@elastic/eui';

import {
    EuiAreaSeries,
    EuiLineSeries,
    EuiSeriesChart,
    EuiSeriesChartUtils
} from '@elastic/eui/lib/experimental';

const {
    CURVE_MONOTONE_X,
} = EuiSeriesChartUtils.CURVE;

const curve = CURVE_MONOTONE_X;
const { SCALE } = EuiSeriesChartUtils;

class Invocations extends React.Component {
    constructor(props) {
        super(props);
        this.options = [];
        this.state = {
            invocations : [],
            invocationsTypes: [],
            invocationsDurations: [],
            memoryMetrics : [],
            cpuMetrics : [],
            pageIndex: 0,
            pageSize: 10,
            showPerPageOptions: true,
            selectedOptions: [],
            selectedFunctionName: null
        };
    }

    componentWillMount() {
        const {httpClient} = this.props;
        const {startDate} = this.props;
        this.doRequest(httpClient, startDate)
    }

    componentWillReceiveProps(nextProps) {
        const {httpClient} = nextProps;
        const {startDate} = nextProps;
        this.doRequest(httpClient, startDate)
    }

    doRequest = (httpClient, startDate) => {
        httpClient.get('../api/thundra/functions', {
            params:{
                startTimeStamp: startDate
            }
        }).then((resp) => {
            let options = [];
            for (let key in resp.data.functions) {
                let obj = resp.data.functions[key];
                options.push( {
                    label: obj.key
                });
            }
            this.options = [];
            this.options = options;
            this.setState({
                functions: resp.data.functions,
                selectedOptions: [this.options[0]],
                selectedFunctionName : this.options[0].label
            });

            this.onChange([this.options[0]])
        });
    };

    onChange = (selectedOptions) => {
        const {httpClient} = this.props;
        const {startDate} = this.props;
        httpClient.get('../api/thundra/invocations-with-function-name', {
            params:{
                functionName: selectedOptions[0].label,
                startTimeStamp: startDate
            }
        }).then((resp) => {
            this.setState({invocations: resp.data.invocations});
        });

        httpClient.get('../api/thundra/invocations-by-function-name', {
            params:{
                functionName: selectedOptions[0].label,
                startTimeStamp: startDate
            }
        }).then((resp) => {
            this.setState({invocationsTypes: resp.data.invocations});
        });

        httpClient.get('../api/thundra/invocation-durations-by-function-name', {
            params:{
                functionName: selectedOptions[0].label,
                startTimeStamp: startDate
            }
        }).then((resp) => {
            this.setState({invocationsDurations: resp.data.invocations});
        });

        this.setState({
            selectedOptions: selectedOptions,
            selectedFunctionName : selectedOptions[0].label
        });

        httpClient.get('../api/thundra/memory-metrics', {
            params:{
                startTimeStamp: startDate,
                functionName: selectedOptions[0].label
            }
        }).then((resp) => {
            this.setState({memoryMetrics: resp.data.memoryMetrics});
        });

        httpClient.get('../api/thundra/cpu-metrics', {
            params:{
                startTimeStamp: startDate,
                functionName: selectedOptions[0].label
            }
        }).then((resp) => {
            this.setState({cpuMetrics: resp.data.cpuMetrics});
        });

        this.renderTable();
    };

    onTableChange = ({ page = {} }) => {
        const {
            index: pageIndex,
            size: pageSize,
        } = page;

        this.setState({
            pageIndex,
            pageSize,
        });
    };

    togglePerPageOptions = () => {
        this.setState({showPerPageOptions: !this.state.showPerPageOptions});
    };

    columns = [
        {
            field: '_source.applicationRuntime',
            name: 'Runtime',
            sortable: true
        },
        {
            field: '_source.applicationName',
            name: 'Application Name',
            sortable: true
        },
        {
            field: '_source.functionRegion',
            name: 'Region',
            sortable: true
        },
        {
            field: '_source.errorType',
            name: 'Error Type',
            sortable: true
        },
        {
            field: '_source.coldStart',
            name: 'Cold Start',
            sortable: true
        },
        {
            field: '_source.duration',
            name: 'Duration (ms)',
            sortable: true
        },

    ];

    static paginate (array, page_size, page_number) {
        return array.slice(page_number * page_size, (page_number + 1) * page_size);
    }


   renderTable = () => {
       const {
           pageIndex,
           pageSize,
           showPerPageOptions
       } = this.state;


       const totalItemCount = this.state.invocations.length;
       const pageOfItems = Invocations.paginate(this.state.invocations, pageSize, pageIndex);
       const pagination = {
           pageIndex,
           pageSize,
           totalItemCount,
           pageSizeOptions: [10, 20, 50],
           hidePerPageOptions: !showPerPageOptions
       };
        return (
            <div>
                <EuiSpacer size="xl" />
                <EuiBasicTable
                    items={pageOfItems}
                    pagination={pagination}
                    columns={this.columns}
                    onChange={this.onTableChange}
                />
            </div>
        );
    };

    render() {
        const {title} = this.props;
        const invocationData = [];
        let coldStartCount = [];
        let totalCount = [];
        let errorCount = [];
        for (let key in this.state.invocationsTypes) {
            let obj = this.state.invocationsTypes[key];
            totalCount.push( { x: obj.key, y: obj.doc_count } );
            coldStartCount.push( { x: obj.key, y: obj.coldStartCount.doc_count } );
            errorCount.push( { x: obj.key, y: obj.errorCount.doc_count } );
        }

        invocationData[0] = {
            data: totalCount,
            name: "Total"
        };
        invocationData[1] = {
            data: coldStartCount,
            name: "Cold Start"
        };
        invocationData[2] = {
            data: errorCount,
            name: "Error"
        };


        const invocationDurationData = [];
        let coldStartDuration = [];
        let totalDuration = [];
        let errorDuration = [];
        for (let key in this.state.invocationsDurations) {
            let obj = this.state.invocationsDurations[key];

            let totalAvg = obj.avgDuration['value'];

            let cold = obj.coldStartDuration;
            let coldAvg = cold['avgOfDuration']['value'];

            let error = obj.errorDuration;
            let errAvg  = error['avgOfDuration']['value'];


            if( totalDuration ){
                totalDuration.push( { x: obj.key, y: totalAvg.toFixed(2) } );
            }
            if ( coldAvg ){
                coldStartDuration.push( { x: obj.key, y: coldAvg.toFixed(2) } );
            }

            if ( errAvg ){
                errorDuration.push( { x: obj.key, y: errAvg.toFixed(2) } );
            }
        }

        invocationDurationData[0] = {
            data: totalDuration,
            name: "Avg Total"
        };
        invocationDurationData[1] = {
            data: coldStartDuration,
            name: "Avg Cold Start"
        };
        invocationDurationData[2] = {
            data: errorDuration,
            name: "Avg Error"
        };

        const data = [];
        const appUsedMemory = [];
        const appMaxMemory = [];
        for (let key in this.state.memoryMetrics) {
            let obj = this.state.memoryMetrics[key];
            let m  = obj._source.metrics;
            appUsedMemory.push( { x: obj._source.collectedTimestamp, y: 10*(m['app.usedMemory']/1024/1024).toFixed(2)} );
            appMaxMemory.push( { x: obj._source.collectedTimestamp, y: m['app.maxMemory']/1024/1024} );
        }


        data[0] = {
            data: appUsedMemory,
            name: "App Used Memory"
        };
        data[1] = {
            data: appMaxMemory,
            name: "App Max Memory"
        };

        const appCpuLoad = [];
        for (let key in this.state.cpuMetrics) {
            let obj = this.state.cpuMetrics[key];
            let m  = obj._source.metrics;
            appCpuLoad.push( { x: obj._source.collectedTimestamp, y: 100*(m['app.cpuLoad']).toFixed(2)} );
        }

        return (
            <div>
                <EuiSpacer size={"s"}/>
                <EuiFlexGrid>
                    <EuiFlexItem grow={10}>
                        <EuiTitle size={"s"}>
                            <h5>
                                <EuiTextColor color="secondary">{this.state.selectedFunctionName}</EuiTextColor>
                            </h5>
                        </EuiTitle>
                    </EuiFlexItem>
                    <EuiFlexItem grow={2}>
                        <EuiComboBox
                            placeholder="Select a single option"
                            singleSelection={{ asPlainText: true }}
                            options={this.options}
                            selectedOptions={this.state.selectedOptions}
                            onChange={this.onChange}
                            isClearable={false}
                        />
                    </EuiFlexItem>
                </EuiFlexGrid>

                <div>
                    <EuiFlexGrid columns={2}>
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <p>Invocations</p>
                            </EuiText>
                            <EuiSeriesChart height={250} xType={SCALE.TIME_UTC}>
                                {invocationData.map((d, i) => (
                                    <EuiLineSeries key={i} name={d.name} data={d.data} showLineMarks={true} curve={curve}/>
                                ))}
                            </EuiSeriesChart>
                        </EuiFlexItem>


                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <p> Invocations Duration (ms)</p>
                            </EuiText>
                            <EuiSeriesChart height={250} xType={SCALE.TIME_UTC}>
                                {invocationDurationData.map((d, i) => (
                                    <EuiLineSeries key={i} name={d.name} data={d.data} showLineMarks={true} curve={curve}/>
                                ))}
                            </EuiSeriesChart>
                        </EuiFlexItem>
                    </EuiFlexGrid>

                    <EuiSpacer />

                    <EuiFlexGrid columns={2}>
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <p> Memory Usage (MB)</p>
                            </EuiText>
                            <EuiSeriesChart height={250} xType={SCALE.TIME_UTC}>
                                <EuiAreaSeries name="Used Memory" data={appMaxMemory} curve={curve}/>
                                <EuiAreaSeries name="Total Memory" data={appUsedMemory} curve={curve}/>
                            </EuiSeriesChart>
                        </EuiFlexItem>


                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <p> Cpu Load (%)</p>
                            </EuiText>
                            <EuiSeriesChart height={250} xType={SCALE.TIME_UTC}>
                                <EuiAreaSeries name="CPU Load" data={appCpuLoad} curve={curve}/>
                            </EuiSeriesChart>
                        </EuiFlexItem>

                    </EuiFlexGrid>

                </div>
                <EuiSpacer size={"l"}/>
                {this.renderTable()}
            </div>
        );
    }
}

export default Invocations;