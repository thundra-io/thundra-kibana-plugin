import React, {Fragment} from 'react';
import {Col, Row} from 'reactstrap';
import {EuiBasicTable, EuiButton, EuiCode, EuiHealth, EuiLink, EuiSpacer, EuiSwitch} from '@elastic/eui';

import {EuiBarSeries, EuiLineSeries, EuiSeriesChart, EuiSeriesChartUtils} from '@elastic/eui/lib/experimental';

const {
    CURVE_MONOTONE_X,
} = EuiSeriesChartUtils.CURVE;


const { SCALE } = EuiSeriesChartUtils;

export class Functions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            functions : [],
            invocationCountOfFunction : [],
            pageIndex: 0,
            pageSize: 5,
            showPerPageOptions: true,
        };
    }

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

    componentWillMount() {
        const {httpClient} = this.props;
        httpClient.get('../api/thundra/functions').then((resp) => {
            this.setState({functions: resp.data.functions});
        });

        httpClient.get('../api/thundra/invocation-count-of-function').then((resp) => {
            this.setState({invocationCountOfFunction: resp.data.invocationCountOfFunction});
        });
    }

    componentDidMount() {
    }

    columns = [
        {
            field: 'key',
            name: 'Application Name',
            sortable: true
        },
        {
            field: 'doc_count',
            name: 'Count',
            sortable: true
        }
    ];

    static paginate (array, page_size, page_number) {
        return array.slice(page_number * page_size, (page_number + 1) * page_size);
    }

    render() {
        const {title} = this.props;
        const {
            pageIndex,
            pageSize,
            showPerPageOptions
        } = this.state;

        const totalItemCount = this.state.functions.length;
        const pageOfItems = Functions.paginate(this.state.functions, pageSize, pageIndex);
        const pagination = {
            pageIndex,
            pageSize,
            totalItemCount,
            pageSizeOptions: [3, 5, 8],
            hidePerPageOptions: !showPerPageOptions
        };

        const myData = [];
        const DATA_A = [];
        for (let key in this.state.invocationCountOfFunction) {
            let obj = this.state.invocationCountOfFunction[key];
            DATA_A.push( { x: obj.key, y: obj.doc_count } );
        }

        myData[0] = {
            data: DATA_A,
            name: "InvocationCount"
        };

        return (
            <div className="overview">
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

                <br/>
                <hr/>

                <Row>
                    <Col xl="6">
                        <Fragment>
                            <EuiSeriesChart width={600} height={200} xType={SCALE.TIME}>
                                {myData.map((d, i) => (
                                    <EuiLineSeries key={i} name={d.name} data={d.data} showLineMarks={false} curve={CURVE_MONOTONE_X} lineSize={Number("2")}/>
                                ))}
                            </EuiSeriesChart>
                        </Fragment>
                    </Col>
                </Row>
            </div>
        );
    }
}
