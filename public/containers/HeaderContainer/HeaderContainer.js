import React, { Component } from 'react';
import {
    EuiTabs,
    EuiTab,
    EuiSpacer,
} from '@elastic/eui';
import {routeList} from "../../router";

// export const TABS = [
//     {
//         id: 'overview',
//         name: 'Overview',
//         disabled: false,
//     },
//     {
//         id: 'functions',
//         name: 'Functions',
//         disabled: false,
//     }
// ];

// console.log("HC, tabs; routeList: ", routeList);
// const tabs = Object.keys(routeList).map((route) => {
//     return {
//         id: routeList[route].path,
//         name: routeList[route].name,
//         disabled: routeList[route].disabled
//     };
// });

export class HeaderContainer extends Component {
    constructor(props) {
        super(props);

        this.tabs = Object.keys(routeList).map((route) => {
            return {
                id: routeList[route].path,
                name: routeList[route].name,
                disabled: routeList[route].disabled
            };
        });

        this.state = {
            // selectedTabId: this.tabs[0].id,
            selectedTabId: this.tabs.find( (tab) => {
                return tab.id === props.history.location.pathname
            }).id,
        };
    }

    onSelectedTabChanged = id => {
        // this.setState({
        //     selectedTabId: id,
        // }, () => this.props.history.replace(id));

        // this.props.history.goBack();
        this.props.history.replace(id);
    }

    renderTabs() {
        // return this.tabs.map((tab, index) => (
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
        console.log("HeaderContainer, render; props, tabs: ", this.props, this.tabs);

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

// export default HeaderContainer;