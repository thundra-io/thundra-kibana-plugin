import React from 'react';
import {
    Redirect,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import {connect} from "react-redux";
import {incrementCounter, decrementCounter} from "../../store/actions";

import {HeaderContainer} from "../../containers";

// export default class OverviewPage extends React.Component {
class OverviewPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log("OverviewPage, render; props: ", this.props);

        return(
            <div className="overview-page">
                <HeaderContainer history={this.props.history}/>

                <p>this is overviews</p>
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

                <div className="counter">
                    <p>This is counter: {this.props.mySweetCounter}</p>
                    <button onClick={this.props.increment}>Increment</button>
                    <button onClick={this.props.decrement}>Decrement</button>
                </div>

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {mySweetCounter:  state.counter.counter}
};

const incMe = (dispatch) => {
    return (dispatch({type: 'INCREMENT_ODD', val: 2}));
};

const mapDispatchToProps = dispatch => {
    return {
        // increment: () => dispatch({type: 'INCREMENT', val: 1}),
        increment: () => dispatch(incrementCounter()),
        incrementIfOdd: () => incMe(dispatch),
        // decrement: () => dispatch({type: 'DECREMENT', val: 1})
        decrement: () => dispatch(decrementCounter())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OverviewPage)