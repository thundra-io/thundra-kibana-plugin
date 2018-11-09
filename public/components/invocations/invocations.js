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

const { SCALE } = EuiSeriesChartUtils;

class Invocations extends React.Component {
    constructor(props) {
        super(props);
        this.options = [];
        this.state = {
            invocations : [],
            memoryMetrics : [],
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

        if ( this.state.functions ){
            httpClient.get('../api/thundra/memory-metrics', {
                params:{
                    startTimeStamp: startDate,
                    functionName: this.state.functions[0]
                }
            }).then((resp) => {
                this.setState({memoryMetrics: resp.data.memoryMetrics});
            });
        }
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
            field: '_source.erroneous',
            name: 'Erroneous',
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


        const myData = [];
        const DATA_A = [];
        for (let key in this.state.invocations) {
            let obj = this.state.invocations[key];
            DATA_A.push( { x: obj._source.startTimestamp, y: obj._source.duration} );
        }

        myData[0] = {
            data: DATA_A,
            name: "Duration"
        };

        const yourData = [];
        const DATA_B = [];
        for (let key in this.state.memoryMetrics) {
            let obj = this.state.memoryMetrics[key];
            let m  = obj._source.metrics;
            DATA_B.push( { x: obj._source.collectedTimestamp, y: m['app.usedMemory']} );
        }

        yourData[0] = {
            data: DATA_B,
            name: "Memory Usage"
        };

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
                <EuiSpacer size={"s"}/>
                {this.renderTable()}
                <EuiSpacer size={"l"}/>
                <div>
                    <EuiFlexGrid columns={2}>
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <p> Memory Usage</p>
                            </EuiText>
                            <EuiSeriesChart height={250} xType={SCALE.TIME}>
                                {yourData.map((d, i) => (
                                    <EuiLineSeries key={i} name={d.name} data={d.data} showLineMarks={false} curve={CURVE_MONOTONE_X} lineSize={Number("2")}/>
                                ))}
                            </EuiSeriesChart>
                        </EuiFlexItem>
                    </EuiFlexGrid>
                    <EuiSpacer />
                </div>
            </div>
        );
    }
}

export default Invocations;