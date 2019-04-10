import React, { Component } from 'react';
import {
    EuiTabs,
    EuiTab,
    EuiSpacer,
} from '@elastic/eui';

export default class FunctionDetailsTab extends Component {
    constructor(props) {
        super(props);

        console.log("FunctionDetailsTab, constructor; props: ", props);
        const { functionName } = props.match.params;
        this.tabs = [
            {
                id: `/functions/${functionName}`,
                name: "Invocations",
                disabled: false
            },
            {
                id: `/functions/${functionName}/metrics`,
                name: "Metrics",
                disabled: false
            },
        ]

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
        console.log("FunctionDetailsTab, render; props, tabs: ", this.props, this.tabs);

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