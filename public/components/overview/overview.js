import React, {Fragment} from 'react';
import {
    EuiBasicTable,
    EuiLink,
    EuiHealth,
    EuiText,
    EuiSpacer,
    EuiStat,
    EuiFlexItem,
    EuiFlexGroup,
    EuiPanel,
    EuiIcon,
    EuiFlexGrid
} from '@elastic/eui';

import {
    EuiSeriesChart,
    EuiBarSeries,
    EuiSeriesChartUtils,
    EuiLineSeries
} from '@elastic/eui/lib/experimental';

const { SCALE, ORIENTATION } = EuiSeriesChartUtils;
const { CURVE_MONOTONE_X } = EuiSeriesChartUtils.CURVE;

export class Overview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            costCalculated : false,
            functions: [],
            erronousFunctions: [],
            coldStartFunctions: [],
            invocationCountPerDay: [],
            durationPerDay: [],
            selectedFunctionName: null
        };
    }

    componentWillMount() {
        const {httpClient} = this.props;
        console.log( this.props.startDate );
        httpClient.get('../api/thundra/invocation-count', {
            params: {
                startTimeStamp: this.props.startDate
            }
        }).then((resp) => {
            this.setState({invocationCount: resp.data.invocationCount});
        });

        httpClient.get('../api/thundra/erronous-invocation-count', {
            params: {
                startTimeStamp: this.props.startDate
            }
        }).then((resp) => {
            this.setState({errorCount: resp.data.errorCount});
        });

        httpClient.get('../api/thundra/cold-start-count', {
            params: {
                startTimeStamp: this.props.startDate
            }
        }).then((resp) => {
            this.setState({coldStartCount: resp.data.coldStartCount});
        });

        httpClient.get('../api/thundra/estimated-billed-cost', {
            params: {
                startTimeStamp: this.props.startDate
            }
        }).then((resp) => {
            this.setState({
                costCalculated: true,
                estimatedBilledCost: resp.data.estimatedBilledCost
            });
        });

        httpClient.get('../api/thundra/functions', {
            params: {
                startTimeStamp: this.props.startDate
            }
        }).then((resp) => {
            this.setState({functions: resp.data.functions});
        });

        httpClient.get('../api/thundra/erronous-invocations', {
            params: {
                startTimeStamp: this.props.startDate
            }
        }).then((resp) => {
            this.setState({erronousFunctions: resp.data.erronousFunctions});
        });

        httpClient.get('../api/thundra/cold-start-invocations', {
            params: {
                startTimeStamp: this.props.startDate
            }
        }).then((resp) => {
            this.setState({coldStartFunctions: resp.data.coldStartFunctions});
        });

        httpClient.get('../api/thundra/invocation-counts-per-day', {
            params: {
                startTimeStamp: this.props.startDate
            }
        }).then((resp) => {
            this.setState({invocationCountPerDay: resp.data.invocationCountPerDay});
        });

        httpClient.get('../api/thundra/invocation-duration-per-day', {

        }).then((resp) => {
            this.setState({durationPerDay: resp.data.durationPerDay});
        });
    }

    onClick = (e) => {
        this.setState({selectedFunctionName: e.y});
        const {httpClient} = this.props;
        httpClient.get('../api/thundra/invocation-counts-per-day-with-function-name', {
            params: {
                functionName: e.y
            }
        }).then((resp) => {
            this.setState({invocationCountPerDay: resp.data.invocationCountPerDay});
        });

        httpClient.get('../api/thundra/invocation-duration-per-day-with-function-name', {
            params: {
                functionName: e.y
            }
        }).then((resp) => {
            this.setState({durationPerDay: resp.data.durationPerDay});
        });
    };

    renderBelowGraphs = () => {
        const myData = [];
        const DATA_A = [];
        for (let key in this.state.invocationCountPerDay) {
            let obj = this.state.invocationCountPerDay[key];
            DATA_A.push( { x: obj.key, y: obj.doc_count } );
        }

        myData[0] = {
            data: DATA_A,
            name: "InvocationCount"
        };

        const yourData = [];
        const DATA_B = [];
        for (let key in this.state.durationPerDay) {
            let obj = this.state.durationPerDay[key];
            DATA_B.push( { x: obj.key, y: obj.duration.value / 60000} );
        }

        yourData[0] = {
            data: DATA_B,
            name: "InvocationDuration"
        };

        return (
            <div>
                <EuiFlexGrid columns={2}>
                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p> Total invocation count for <b>{ this.state.selectedFunctionName == null ?  'all' : this.state.selectedFunctionName }</b> function(s)</p>
                        </EuiText>
                        <EuiSeriesChart height={250} xType={SCALE.TIME}>
                            {myData.map((d, i) => (
                                <EuiLineSeries key={i} name={d.name} data={d.data} showLineMarks={false} curve={CURVE_MONOTONE_X}/>
                            ))}
                        </EuiSeriesChart>
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Total Invocation duration for <b>{ this.state.selectedFunctionName == null ?  'all' : this.state.selectedFunctionName }</b> function(s)</p>
                        </EuiText>
                        <EuiSeriesChart height={250} xType={SCALE.TIME}>
                            {yourData.map((d, i) => (
                                <EuiLineSeries key={i} name={d.name} data={d.data} showLineMarks={false} curve={CURVE_MONOTONE_X}/>
                            ))}
                        </EuiSeriesChart>
                    </EuiFlexItem>
                </EuiFlexGrid>
                <EuiSpacer />
            </div>
        );
    };

    render() {
        const {title} = this.props;

        const DATA = [];
        let arr = this.state.functions;
        for ( let i=arr.length-1; i>=0; i-- ){
            let obj = arr[i];
            DATA.push( { x: obj.doc_count, y: obj.key} );
        }

        const EDATA = [];
        let eArr = this.state.erronousFunctions;
        for ( let i=eArr.length-1; i>=0; i-- ){
            let obj = eArr[i];
            EDATA.push( { x: obj.doc_count, y: obj.key} );
        }

        const CDATA = [];
        let cArr = this.state.coldStartFunctions;
        for ( let i=cArr.length-1; i>=0; i-- ){
            let obj = cArr[i];
            CDATA.push( { x: obj.doc_count, y: obj.key} );
        }



        return (
            <div>
                <EuiFlexGroup >
                    <EuiFlexItem >
                        <EuiStat
                            title={this.state.invocationCount}
                            description="New Invocations"
                            titleColor="secondary"
                            textAlign="left"
                            titleSize="l"
                        >
                        </EuiStat>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiStat
                            title={this.state.errorCount}
                            description="New Errors"
                            titleColor="danger"
                            textAlign="left"
                            titleSize="l"
                        >
                        </EuiStat>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiStat
                            title={this.state.coldStartCount}
                            description="New Cold Starts"
                            textAlign="left"
                            titleSize="l"
                        >
                        </EuiStat>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiStat
                            title={(this.state.costCalculated === true ? "$": "" ) + this.state.estimatedBilledCost}
                            description="Estimated Billed Cost"
                            titleColor="accent"
                            textAlign="left"
                            titleSize="l"
                        >
                        </EuiStat>
                    </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer />
                <EuiSpacer />
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
                            <EuiBarSeries name="Invocation Count" data={DATA} color={"#65a637"} onValueClick={(e) => this.onClick(e)}/>
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
                            <EuiBarSeries name="Invocation Count" data={EDATA}  color={"#d93f3c"} onValueClick={(e) => this.onClick(e)}/>
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
                            <EuiBarSeries name="Invocation Count" data={CDATA}  color={"#6db7c6"} onValueClick={(e) => this.onClick(e)}/>
                        </EuiSeriesChart>
                    </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer />
                <EuiSpacer />
                {this.renderBelowGraphs()}
            </div>
        );
    }
}
