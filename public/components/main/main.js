import React, { Component, Fragment } from 'react';

import moment from 'moment';

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
    EuiFlexGrid
} from '@elastic/eui';

import {Overview} from "../overview/overview";
import {Functions} from "../functions/functions";
import {Invocations} from "../invocations";


export class Main extends React.Component {
    constructor(props) {
        super(props);

        this.options = [{
                label: '1 hour',
                value: 60
            }, {
                label: '2 hour',
                value: 120
            }, {
                label: '4 hour',
                value: 240
            }, {
                label: '1 day',
                value: 1440
            }
        ];

        this.state = {
            startDate: 1541414646000,
            selectedOptions: []
        };

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
        }];

        this.state = {
            selectedTab: this.tabs[0],
        };
    }

    onTabClick = (selectedTab) => {
        this.setState({ selectedTab });
    };


    onChange = (selectedOptions) => {
        let MS_PER_MINUTE = 60000;
        let d = new Date();
        let myStartDate = new Date(d - ((Number(selectedOptions[0].value)) * MS_PER_MINUTE));
        this.setState({
            selectedOptions: selectedOptions,
            startDate: myStartDate.getTime()
        });
        this.render();
    };

    render() {
        const {title} = this.props;
        return (
            <div className="overview">
                <Fragment>
                    <EuiSpacer size="m" />

                    <EuiFlexGrid columns={4}>
                        <EuiFlexItem><div></div></EuiFlexItem>
                        <EuiFlexItem><div></div></EuiFlexItem>
                        <EuiFlexItem><div></div></EuiFlexItem>
                        <EuiFlexItem grow={true}>
                            <EuiComboBox
                                placeholder="Select a date"
                                singleSelection={{ asPlainText: true }}
                                options={this.options}
                                selectedOptions={this.state.selectedOptions}
                                onChange={this.onChange}
                                isClearable={false}
                                fullWidth={true}
                                compressed={true}
                            />
                        </EuiFlexItem>
                    </EuiFlexGrid>


                    <EuiTabbedContent
                        tabs={this.tabs}
                        selectedTab={this.state.selectedTab}
                        onTabClick={this.onTabClick}
                    />
                </Fragment>
            </div>
        );
    }
}
