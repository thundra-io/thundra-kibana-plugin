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

import {timeSelectorOptions} from "../../reducers/timeSelector";

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedOptions: [timeSelectorOptions[0]]
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
        const {convertToMonthMultiplier} = this.props;

        this.tabs = [{
            id: 'overview',
            name: 'Overview',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Overview</h3></EuiTitle>
                    <Overview startDate={startDate} interval={interval} httpClient={httpClient} convertToMonthMultiplier={convertToMonthMultiplier}></Overview>
                </Fragment>
            ),
        }, {
            id: 'functions',
            name: 'Functions',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Functions</h3></EuiTitle>
                    <Functions startDate={startDate} interval={interval} httpClient={httpClient} convertToMonthMultiplier={convertToMonthMultiplier}></Functions>
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
        // console.log("main, render; state, props: ", this.state, this.props);
        
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
                                options={timeSelectorOptions}
                                selectedOptions={this.state.selectedOptions}
                                onChange={this.onChange}
                                isClearable={false}
                            />
                        </EuiFlexItem>
                    </EuiFlexGrid>

                    <EuiTabbedContent
                        tabs={tabs}
                        initialSelectedTab={tabs[0]}
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
        convertToMonthMultiplier: state.timeSelectorReducer.convertToMonthMultiplier,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeTime: (x) => {
            const MS_PER_MINUTE = 60000;
            let d = new Date();
            let date = new Date(d - x.value*(MS_PER_MINUTE));
            return dispatch({type: 'CHANGE_TIME', val: date.getTime() , interval: x.interval, convertToMonthMultiplier: x.converttomonthmultiplier });
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Main)
