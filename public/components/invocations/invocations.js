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
    EuiTextColor
} from '@elastic/eui';

import {
    EuiSeriesChart,
    EuiLineSeries,
    EuiBarSeries,
    EuiSeriesChartUtils
} from '@elastic/eui/lib/experimental';

const {
    CURVE_MONOTONE_X,
} = EuiSeriesChartUtils.CURVE;

const { SCALE } = EuiSeriesChartUtils;

export class Invocations extends React.Component {
    constructor(props) {
        super(props);
        this.options = [];
        this.state = {
            invocations : [],
            pageIndex: 0,
            pageSize: 5,
            showPerPageOptions: true,
            selectedOptions: [],
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
                functions: resp.data.functions
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

        this.setState({
            selectedOptions: selectedOptions,
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
           pageSizeOptions: [3, 5, 8],
           hidePerPageOptions: !showPerPageOptions
       };
        return (
            <div>
                <EuiSwitch
                    label={<span>Hide per page options with <EuiCode>pagination.hidePerPageOptions = true</EuiCode></span>}
                    onChange={this.togglePerPageOptions}
                />
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

        return (
            <div>
                <EuiComboBox
                    placeholder="Select a single option"
                    singleSelection={{ asPlainText: true }}
                    options={this.options}
                    selectedOptions={this.state.selectedOptions}
                    onChange={this.onChange}
                    isClearable={false}
                />

                <br/>
                {this.renderTable()}
                <br/>
                <hr/>

                <EuiSpacer/>
                <EuiSpacer/>
                <div>
                    <EuiFlexGrid columns={2}>
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <p> Total invocation count for <EuiTextColor color="subdued"> { this.state.selectedFunctionName == null ?  'all' : this.state.selectedFunctionName }</EuiTextColor> function(s)</p>
                            </EuiText>
                            <EuiSeriesChart height={250} xType={SCALE.TIME}>
                                {myData.map((d, i) => (
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
