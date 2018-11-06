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
} from '@elastic/eui';

import {Overview} from "../overview/overview";
import {Functions} from "../functions/functions";
import {Invocations} from "../invocations";


export class Main extends React.Component {
    constructor(props) {
        super(props);

        const {httpClient} = this.props;
        this.tabs = [{
            id: 'overview',
            name: 'Overview',
            content: (
                <Fragment>
                    <EuiSpacer />
                    <EuiTitle><h3>Overview</h3></EuiTitle>
                    <Overview httpClient={httpClient}></Overview>
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
                        <Functions httpClient={httpClient}></Functions>
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
                        <Invocations httpClient={httpClient}></Invocations>
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


    render() {
        const {title} = this.props;
        return (
            <div className="overview">
                <Fragment>
                    <EuiSpacer size="m" />
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
