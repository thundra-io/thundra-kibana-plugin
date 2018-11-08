import React, { Component } from 'react'
import {connect} from "react-redux";



class Counter extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { mySweetCounter } = this.props;
        return (
            <p>
                Clicked: {mySweetCounter.counter} times
                {' '}
                <button onClick={this.props.increment}>
                    +
                </button>
                {' '}
                <button onClick={this.props.decrement}>
                    -
                </button>
                {' '}
                <button onClick={this.props.incrementIfOdd}>
                    Increment if odd
                </button>
                {' '}
                <button onClick={this.incrementAsync}>
                    Increment async
                </button>
            </p>
        )
    }
}

const mapStateToProps = state => {
    return {mySweetCounter:  state.firstReducer}
};

const incMe = (dispatch) => {
    return (dispatch({type: 'INCREMENT_ODD'}));
};

const mapDispatchToProps = dispatch => {
    return {
        increment: () => dispatch({type: 'INCREMENT'}),
        incrementIfOdd: () => incMe(dispatch),
        decrement: () => dispatch({type: 'DECREMENT'})
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Counter)