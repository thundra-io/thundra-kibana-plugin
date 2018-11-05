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
        }];

        this.state = {
            selectedTab: this.tabs[1],
        };
    }

    onTabClick = (selectedTab) => {
        this.setState({ selectedTab });
    };


    componentDidMount() {
        /*
           FOR EXAMPLE PURPOSES ONLY.  There are much better ways to
           manage state and update your UI than this.
        */
        // const {httpClient} = this.props;
        // httpClient.get('../api/thundra/example').then((resp) => {
        //     this.setState({time: resp.data.time});
        // });
    }

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
