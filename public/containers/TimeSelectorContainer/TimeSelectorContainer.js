import React, { Component, Fragment } from 'react';

import {
    EuiTitle,
    EuiSpacer,
    EuiComboBox,
    EuiFlexItem,
    EuiFlexGrid,
    EuiTextColor,
} from '@elastic/eui';

import { connect } from "react-redux";

import { timeSelectorOptions } from "../../store/reducers/timeSelector";

class TimeSelectorContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // selectedOptions: [timeSelectorOptions[0]]
            selectedOptions: [props.selectedOption]
        };
    }

    onTabClick = (selectedTab) => {
        this.setState({ selectedTab });
    };


    onChange = (selectedOptions) => {
        this.props.changeTime(selectedOptions[0]);
        this.setState({
            selectedOptions: selectedOptions
        });
    };

    render() {
        // console.log("TimeSelectorContainer, render; state, props: ", this.state, this.props);

        return (
            <Fragment>
                <EuiSpacer size="m" />
                <EuiFlexGrid>
                    <EuiFlexItem grow={10}>
                        <EuiTitle>
                            <h5>
                                <EuiTextColor color="secondary">Thundra Serverless Observability</EuiTextColor>
                            </h5>
                        </EuiTitle>
                    </EuiFlexItem>
                    <EuiSpacer size="s" />
                    <EuiFlexItem grow={2}>
                        <EuiComboBox
                            placeholder="Select a date"
                            singleSelection={{ asPlainText: true }}
                            options={timeSelectorOptions}
                            selectedOptions={this.state.selectedOptions}
                            onChange={this.onChange}
                            isClearable={false}
                        />
                    </EuiFlexItem>
                </EuiFlexGrid>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedOption: state.timeSelector.selectedOption,
        startDate: state.timeSelector.startDate,
        interval: state.timeSelector.interval,
        convertToMonthMultiplier: state.timeSelector.convertToMonthMultiplier,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeTime: (x) => {
            const MS_PER_MINUTE = 60000;
            let d = new Date();
            let date = new Date(d - x.value * (MS_PER_MINUTE));
            return dispatch({ type: 'CHANGE_TIME', val: date.getTime(), interval: x.interval, convertToMonthMultiplier: x.converttomonthmultiplier, selectedOption: x });
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TimeSelectorContainer)
