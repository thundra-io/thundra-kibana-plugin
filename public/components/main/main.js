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
    EuiTextColor
} from '@elastic/eui';

import {Overview} from "../overview/overview";
import {Functions} from "../functions/functions";
import {Invocations} from "../invocations";
import Counter from "../counter/Counter";

const MS_PER_MINUTE = 60000;

export class Main extends Component {
    constructor(props) {
        super(props);

        this.options = [{
                label: 'Last 1 hour',
                value: 60
            }, {
                label: 'Last 2 hours',
                value: 120
            }, {
                label: 'Last 4 hours',
                value: 240
            }, {
                label: 'Last 1 day',
                value: 1440
            }
        ];

        this.state = {
            startDate: this.oneHourAgo(),
            selectedOptions: [this.options[0]]
        };
    }

    componentDidMount(){
        this.setState({
           startDate: this.oneHourAgo()
        })
    };

    onTabClick = (selectedTab) => {
        this.setState({ selectedTab });
    };

    oneHourAgo = () => {
        let d = new Date();
        let date = new Date(d - 60*(MS_PER_MINUTE));
        return date.getTime();
    };

    onChange = (selectedOptions) => {
        let d = new Date();
        let date = new Date(d - ((Number(selectedOptions[0].value)) * MS_PER_MINUTE));
        this.setState({
            selectedOptions: selectedOptions,
            startDate: date.getTime()
        });
    };

    renderTab = () => {
        const {httpClient} = this.props;
        this.tabs = [{
            id: 'overview',
            name: 'Overview',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Overview</h3></EuiTitle>
                    <Overview startDate={this.state.startDate} httpClient={httpClient}></Overview>
                </Fragment>
            ),
        }, {
            id: 'functions',
            name: 'Functions',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Functions</h3></EuiTitle>
                    <EuiText>
                        <Functions startDate={this.state.startDate} httpClient={httpClient}></Functions>
                    </EuiText>
                </Fragment>
            ),
        }, {
            id: 'invocations',
            name: 'Invocations',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Invocations</h3></EuiTitle>
                    <EuiText>
                        <Invocations startDate={this.state.startDate} httpClient={httpClient}></Invocations>
                    </EuiText>
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
        const {title} = this.props;
        let tabs = this.renderTab();
        return (
            <div className="overview">


                <Fragment>
                    <EuiSpacer size="m" />
                    <EuiFlexGrid columns={3}>
                        <EuiFlexItem>
                            <EuiTitle>
                                <h2>
                                    <EuiTextColor color="secondary">Thundra Serverless Observability</EuiTextColor>
                                </h2>
                            </EuiTitle>
                        </EuiFlexItem>
                        <EuiSpacer size="s"/>
                        <EuiFlexItem><div></div></EuiFlexItem>
                        <EuiFlexItem grow={true}>
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
                        initialSelectedTab={tabs[3]}
                        onTabClick={this.onTabClick}
                    />
                </Fragment>
            </div>
        );
    }
}
