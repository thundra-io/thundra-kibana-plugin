import React from 'react';

import {
    EuiTitle,
    EuiFlexGrid,
    EuiFlexItem,
    EuiTextColor,
    EuiComboBox,
    EuiSpacer
} from '@elastic/eui';

import {
    Redirect,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import { connect } from "react-redux";
import { incrementCounter, decrementCounter } from "../../store/actions";

import { HeaderTab } from "../../components";
import { OverviewInfoContainer, OverviewGraphsContainer, TimeSelectorContainer } from "../../containers";

// export default class OverviewPage extends React.Component {
class OverviewPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log("OverviewPage, render; props: ", this.props);

        return (
            <div className="overview-page">

                <TimeSelectorContainer />

                <HeaderTab history={this.props.history} />

                <OverviewInfoContainer
                    httpClient={this.props.httpClient}
                />

                <OverviewGraphsContainer
                    httpClient={this.props.httpClient}
                />

            </div>
        )
    }

}

export default OverviewPage;