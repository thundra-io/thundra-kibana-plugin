import React from 'react';

import {
    EuiSpacer,
    EuiFlexGroup,
    EuiFlexItem,
    EuiStat
} from '@elastic/eui';

import {
    Redirect,
    Route,
    Switch,
    Link
} from 'react-router-dom';

import {
    fetchInvocationCounts,
    fetchErroneousInvocationCounts,
    fetchColdStartInvocationCounts,
    incrementCounter,
    decrementCounter
} from "../../store/actions";

import { connect } from "react-redux";


class OverviewInfoContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { startDate, interval } = this.props;
        console.log("CDM, OverviewInfoContainer; props: ", this.props);
        // this.props.fetchInvocationCounts(
        //     this.props.httpClient,
        //     // new Date(1551626901342),
        //     // 1551626901342,
        //     // 10,
        //     startDate,
        //     interval
        // );
        this.fetchData(startDate, interval);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.startDate !== nextProps.startDate) {
            // this.props.fetchInvocationCounts(
            //     nextProps.httpClient,
            //     // new Date(1551626901342),
            //     // 1551626901342,
            //     // 10,
            //     nextProps.startDate,
            //     nextProps.interval
            // );
            this.fetchData(nextProps.startDate, nextProps.interval);
        }
    }

    fetchData = (startDate, interval) => {
        this.props.fetchInvocationCounts(this.props.httpClient, startDate, interval);
        this.props.fetchErroneousInvocationCounts(this.props.httpClient, startDate, interval);
        this.props.fetchColdStartInvocationCounts(this.props.httpClient, startDate, interval);
    }

    computeHealth = () => {
        const { invocationCount, errInvocationCount } = this.props;
        let health = 0;
        if (invocationCount && errInvocationCount) {
            const invocationCountNumber = Number(invocationCount);
            const errorCountNumber = Number(errInvocationCount);

            health = (invocationCountNumber - errorCountNumber) / invocationCountNumber * 100;
        }

        return health.toFixed(2);
    }

    render() {
        console.log("OverviewInfoContainer, render; props: ", this.props);

        return (
            <div className="overview-info-container">

                <EuiFlexGroup >
                    <EuiFlexItem >
                        <EuiStat
                            title={`${this.computeHealth()} %`}
                            description="Health"
                            titleColor="secondary"
                            textAlign="left"
                            titleSize="l"
                        />
                    </EuiFlexItem>
                    <EuiFlexItem >
                        <EuiStat
                            title={this.props.invocationCount}
                            description="New Invocations"
                            titleColor="secondary"
                            textAlign="left"
                            titleSize="l"
                        />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiStat
                            title={this.props.errInvocationCount}
                            description="New Errors"
                            titleColor="danger"
                            textAlign="left"
                            titleSize="l"
                        >
                        </EuiStat>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiStat
                            title={this.props.csInvocationCount}
                            description="New Cold Starts"
                            textAlign="left"
                            titleSize="l"
                        >
                        </EuiStat>
                    </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer />



                <Link
                    // key={index}
                    key={"details"}
                    // to={`/${tab.id}`}
                    to={`/details`}
                // className={classes}
                // replace={selected === tab.id}
                >
                    go to details
                </Link>

                {/* <button
                    className="button icon-left"
                    onClick={this.context.router.history.goBack}>
                    Back
                </button> */}

                {/* <div className="counter">
                    <p>This is counter: {this.props.mySweetCounter}</p>
                    <button onClick={this.props.increment}>Increment</button>
                    <button onClick={this.props.decrement}>Decrement</button>
                </div> */}

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        // mySweetCounter:  state.counter.counter,
        invocationCount: state.invocationCounts.invocationCount,
        errInvocationCount: state.invocationCounts.errInvocationCount,
        csInvocationCount: state.invocationCounts.csInvocationCount,
        startDate: state.timeSelector.startDate,
        interval: state.timeSelector.interval,
    }
};

const incMe = (dispatch) => {
    return (dispatch({ type: 'INCREMENT_ODD', val: 2 }));
};

const mapDispatchToProps = dispatch => {
    return {
        // increment: () => dispatch(incrementCounter()),
        // incrementIfOdd: () => incMe(dispatch),
        // decrement: () => dispatch(decrementCounter()),

        fetchInvocationCounts: (httpClient, startTime, interval) => dispatch(fetchInvocationCounts(httpClient, startTime, interval)),
        fetchErroneousInvocationCounts: (httpClient, startTime, interval) => dispatch(fetchErroneousInvocationCounts(httpClient, startTime, interval)),
        fetchColdStartInvocationCounts: (httpClient, startTime, interval) => dispatch(fetchColdStartInvocationCounts(httpClient, startTime, interval))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OverviewInfoContainer)