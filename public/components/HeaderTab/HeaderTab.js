import React, { Component } from 'react';
import {
    EuiTabs,
    EuiTab,
    EuiSpacer,
} from '@elastic/eui';
import {routeList} from "../../router";


export default class HeaderTab extends Component {
    constructor(props) {
        super(props);

        this.tabs = Object.keys(routeList).map((route) => {
            return {
                id: routeList[route].path,
                name: routeList[route].name,
                disabled: routeList[route].disabled
            };
        });

        console.log("HeaderTab, constructor; tabs: ", this.tabs);

        this.state = {
            // Find initial selected tab id from the url pathname.
            selectedTabId: this.tabs.find( (tab) => {
                return tab.id === props.history.location.pathname
            }).id,
        };
    }

    componentWillUnmount() {
        // console.log("CWUN; props: ", this.props);
    }

    onSelectedTabChanged = id => {
        // When tab changes replace new id (id ~ path)
        this.props.history.replace(id);
    }

    renderTabs() {
        return this.tabs.map((tab, index) => (
            <EuiTab
                onClick={() => this.onSelectedTabChanged(tab.id)}
                isSelected={tab.id === this.state.selectedTabId}
                disabled={tab.disabled}
                key={index}
            >
                {tab.name}
            </EuiTab>
        ));
    }

    render() {
        console.log("HeaderTab, render; props, tabs: ", this.props, this.tabs);

        return (
            <div>
                <EuiTabs>
                    {this.renderTabs()}
                </EuiTabs>

                <EuiSpacer />
            </div>
        );
    }
}