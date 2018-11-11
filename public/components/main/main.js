import React, { Component, Fragment } from 'react';

import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageHeader,
    EuiButton,
    EuiTabbedContent,
    EuiTitle,
    EuiText,
    EuiSpacer,
    EuiDatePicker,
    EuiFormRow,
    EuiComboBox,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFlexGrid,
    EuiTextColor,
} from '@elastic/eui';

import Overview from "../overview/overview";
import Functions from "../functions/functions";
import Invocations from "../invocations/invocations";
import Counter from "../counter/Counter";
import {connect} from "react-redux";

class Main extends Component {

    // HOUR("hour", 60, 1), // time interval for 1 hour is 1 minute
    // DAY("day", 1440, 30), // time interval for 1 day is 30 minutes
    // WEEK("week", 10080, 180), // time interval for 1 week is 180 minutes
    // MONTH("month", 43800, 720), // time interval for one month 720 minutes
    // TWO_MONTHS("two months", 87600, 1440); // time interval for 1 week is 1440 minutes
    //
    constructor(props) {
        super(props);
        this.options = [{
                label: 'Last 1 hour',
                value: 60,
                interval: 10,
            }, {
                label: 'Last 2 hours',
                value: 120,
                interval: 30,
            }, {
                label: 'Last 4 hours',
                value: 240,
                interval: 30,
            }, {
                label: 'Last 1 day',
                value: 1440,
                interval: 60,
            }
        ];

        this.state = {
            selectedOptions: [this.options[0]]
        };
    }

    onTabClick = (selectedTab) => {
        this.setState({ selectedTab });
    };


    onChange = (selectedOptions) => {
        this.props.changeTime((selectedOptions[0]));
        this.setState({
            selectedOptions: selectedOptions
        });
    };

    renderTab = () => {
        const {httpClient} = this.props;
        const {startDate} = this.props;
        const {interval} = this.props;

        this.tabs = [{
            id: 'overview',
            name: 'Overview',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Overview</h3></EuiTitle>
                    <Overview startDate={startDate} interval={interval} httpClient={httpClient}></Overview>
                </Fragment>
            ),
        }, {
            id: 'functions',
            name: 'Functions',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Functions</h3></EuiTitle>
                    <Functions startDate={startDate} interval={interval} httpClient={httpClient}></Functions>
                </Fragment>
            ),
        }, {
            id: 'invocations',
            name: 'Invocations',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Invocations</h3></EuiTitle>
                    <Invocations startDate={startDate} interval={interval} httpClient={httpClient}></Invocations>
                </Fragment>
            ),
        }, {
            id: 'test',
            name: 'Test',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Invocations</h3></EuiTitle>
                    <EuiText>
                        <Counter/>
                    </EuiText>
                </Fragment>
            ),
        }];
        return( this.tabs)
    };

    render() {
        let tabs = this.renderTab();
        return (
            <div className="overview">


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
                        <EuiSpacer size="s"/>
                        <EuiFlexItem grow={2}>
                            <EuiComboBox
                                placeholder="Select a date"
                                singleSelection={{ asPlainText: true }}
                                options={this.options}
                                selectedOptions={this.state.selectedOptions}
                                onChange={this.onChange}
                                isClearable={false}
                            />
                        </EuiFlexItem>
                    </EuiFlexGrid>

                    <EuiTabbedContent
                        tabs={tabs}
                        initialSelectedTab={tabs[1]}
                        onTabClick={this.onTabClick}
                    />
                </Fragment>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        startDate:  state.timeSelectorReducer.startDate,
        interval: state.timeSelectorReducer.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeTime: (x) => {
            console.log( x );
            const MS_PER_MINUTE = 60000;
            let d = new Date();
            let date = new Date(d - x.value*(MS_PER_MINUTE));
            return dispatch({type: 'CHANGE_TIME', val: date.getTime() , interval: x.interval });
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Main)
