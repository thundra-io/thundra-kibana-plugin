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
    EuiFlexGrid,
    EuiTextColor
} from '@elastic/eui';

import {
    EuiSeriesChart,
    EuiBarSeries,
    EuiSeriesChartUtils,
    EuiLineSeries
} from '@elastic/eui/lib/experimental';

const { SCALE, ORIENTATION } = EuiSeriesChartUtils;
const { CURVE_MONOTONE_X } = EuiSeriesChartUtils.CURVE;

class Overview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            functions: [],
            erronousFunctions: [],
            coldStartFunctions: [],
            invocationCountPerHour: [],
            durationPerHour: [],
            selectedFunctionName: null,
            
            monthlyEstimatedBilledCost: 0,
            invocationCount: 0,
            errorCount: 0,
            coldStartCount: 0,
            estimatedBilledCost: 0,

        };
    }

    componentDidMount() {
        // console.log("overview, CDM; props: ", this.props);

        const {httpClient} = this.props;
        const {startDate} = this.props;
        const {interval} = this.props;
        const {convertToMonthMultiplier} = this.props;
        this.doRequest(httpClient, startDate, interval, convertToMonthMultiplier)
    }

    componentWillReceiveProps(nextProps) {
        // console.log("overview, CWRP; props, nextProps: ", this.props, nextProps);

        const {httpClient} = nextProps;
        const {startDate} = nextProps;
        const {interval} = nextProps;
        const {convertToMonthMultiplier} = nextProps;
        this.doRequest(httpClient, startDate, interval, convertToMonthMultiplier)
    }

    doRequest = (httpClient, startTime, interval, convertToMonthMultiplier) => {
        
        console.log("overview, doRequest; startTime, interval: ", startTime, interval);
        
        httpClient.get('../api/thundra/invocation-count', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            this.setState({invocationCount: resp.data.invocationCount});
        });

        httpClient.get('../api/thundra/erronous-invocation-count', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            this.setState({errorCount: resp.data.errorCount});
        });

        httpClient.get('../api/thundra/cold-start-count', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            this.setState({coldStartCount: resp.data.coldStartCount});
        });

        httpClient.get('../api/thundra/estimated-billed-cost', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            this.setState({
                estimatedBilledCost: resp.data.estimatedBilledCost,
                monthlyEstimatedBilledCost: Number((resp.data.estimatedBilledCost * convertToMonthMultiplier).toFixed(2))
            });
        });

        // invocations by functions
        httpClient.get('../api/thundra/functions', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            this.setState({functions: resp.data.functions});
        });

        httpClient.get('../api/thundra/erronous-invocations', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            this.setState({erronousFunctions: resp.data.erronousFunctions});
        });

        httpClient.get('../api/thundra/cold-start-invocations', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            this.setState({coldStartFunctions: resp.data.coldStartFunctions});
        });

        httpClient.get('../api/thundra/invocation-counts-per-hour', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            this.setState({invocationCountPerHour: resp.data.invocationCountPerHour});
        });

        httpClient.get('../api/thundra/invocation-duration-per-hour', {
            params: {
                startTimeStamp: startTime,
                interval: interval
            }
        }).then((resp) => {
            this.setState({durationPerHour: resp.data.durationPerHour});
        });
    };


    onClick = (e) => {
        this.setState({selectedFunctionName: e.y});
        const {httpClient} = this.props;
        const {startDate} = this.props;
        const {interval} = this.props;
        httpClient.get('../api/thundra/invocation-counts-per-hour-with-function-name', {
            params: {
                startTimeStamp: startDate,
                functionName: e.y,
                interval: interval
            }
        }).then((resp) => {
            this.setState({invocationCountPerHour: resp.data.invocationCountPerHour});
        });

        httpClient.get('../api/thundra/invocation-duration-per-hour-with-function-name', {
            params: {
                startTimeStamp: startDate,
                functionName: e.y,
                interval: interval
            }
        }).then((resp) => {
            this.setState({durationPerHour: resp.data.durationPerHour});
        });
    };

    renderBelowGraphs = () => {
        const myData = [];
        const DATA_A = [];
        for (let key in this.state.invocationCountPerHour) {
            let obj = this.state.invocationCountPerHour[key];
            DATA_A.push( { x: obj.key, y: obj.doc_count } );
        }

        myData[0] = {
            data: DATA_A,
            name: "InvocationCount"
        };

        const yourData = [];
        const DATA_B = [];
        for (let key in this.state.durationPerHour) {
            let obj = this.state.durationPerHour[key];
            DATA_B.push( { x: obj.key, y: Number((obj.duration.value / 60000).toFixed(2))} );
        }

        yourData[0] = {
            data: DATA_B,
            name: "InvocationDuration"
        };

        // console.log("renderBelowGraphs; myData, yourData: ", myData, yourData);

        return (
            <div>
                <EuiFlexGrid columns={2}>
                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p> Total invocation count for <EuiTextColor color="subdued"> { this.state.selectedFunctionName == null ?  'all' : this.state.selectedFunctionName }</EuiTextColor> function(s)</p>
                        </EuiText>
                        <EuiSeriesChart height={250} xType={SCALE.TIME}>
                            {myData.map((d, i) => (
                                <EuiLineSeries key={`count-${i}`} name={d.name} data={d.data} showLineMarks={false} curve={CURVE_MONOTONE_X}/>
                            ))}
                        </EuiSeriesChart>
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText grow={false}>
                            <p>Total  Invocation duration for <EuiTextColor color="subdued"> { this.state.selectedFunctionName == null ?  'all' : this.state.selectedFunctionName }</EuiTextColor> function(s)</p>
                        </EuiText>
                        <EuiSeriesChart height={250} xType={SCALE.TIME}>
                            {yourData.map((d, i) => (
                                <EuiLineSeries key={`duration-${i}`} name={d.name} data={d.data} showLineMarks={false} curve={CURVE_MONOTONE_X}/>
                            ))}
                        </EuiSeriesChart>
                    </EuiFlexItem>
                </EuiFlexGrid>
                <EuiSpacer />
            </div>
        );
    };

    computeHealth = () => {
        const {invocationCount, errorCount} = this.state;
        let health = 0;
        if (invocationCount && errorCount) {
            const invocationCountNumber = Number(invocationCount);
            const errorCountNumber = Number(errorCount);

            health = (invocationCountNumber - errorCountNumber) / invocationCountNumber * 100;
        }

        return health.toFixed(2);
    }

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

        // console.log("overview, render; state, props: ", this.state, this.props);
        // console.log("overview, render; DATA, EDATA, CDATA: ", DATA, EDATA, CDATA);

        return (
            <div>
                <EuiFlexGroup >
                    { (this.state.invocationCount && this.state.errorCount) &&
                        <EuiFlexItem >
                            <EuiStat
                                title={`${this.computeHealth()} %`}
                                description="Health"
                                titleColor="secondary"
                                textAlign="left"
                                titleSize="l"
                            />
                        </EuiFlexItem>
                    }

                    { this.state.invocationCount &&
                        <EuiFlexItem >
                            <EuiStat
                                title={this.state.invocationCount}
                                description="New Invocations"
                                titleColor="secondary"
                                textAlign="left"
                                titleSize="l"
                            />
                        </EuiFlexItem>
                    }

                    {this.state.errorCount &&
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
                    }

                    {this.state.coldStartCount &&
                        <EuiFlexItem>
                            <EuiStat
                                title={this.state.coldStartCount}
                                description="New Cold Starts"
                                textAlign="left"
                                titleSize="l"
                            >
                            </EuiStat>
                        </EuiFlexItem>
                    }

                    {this.state.estimatedBilledCost &&
                        <EuiFlexItem>
                            <EuiStat
                                title={("$") + this.state.estimatedBilledCost}
                                description="Estimated Billed Cost"
                                titleColor="accent"
                                textAlign="left"
                                titleSize="l"
                            >
                            </EuiStat>
                        </EuiFlexItem>
                    }

                    {this.state.monthlyEstimatedBilledCost &&
                        <EuiFlexItem>
                            <EuiStat
                                title={("$") + this.state.monthlyEstimatedBilledCost}
                                description="Monthly Estimated Billed Cost"
                                titleColor="accent"
                                textAlign="left"
                                titleSize="l"
                            >
                            </EuiStat>
                        </EuiFlexItem>
                    }
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
export default Overview;