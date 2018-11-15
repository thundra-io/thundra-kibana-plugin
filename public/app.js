import React, { Component, Fragment }from 'react';
import {uiModules} from 'ui/modules';
import chrome from 'ui/chrome';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageHeader,
    EuiButton,
    EuiDatePicker,
    EuiFormRow,
    EuiComboBox,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFlexGrid,
    EuiTextColor,
} from '@elastic/eui';


import {DocTitleProvider} from 'ui/doc_title';
import {SavedObjectRegistryProvider} from 'ui/saved_objects/saved_object_registry';
import {fatalError, notify, toastNotifications} from 'ui/notify';
import {timezoneProvider} from 'ui/vis/lib/timezone';
import {recentlyAccessed} from 'ui/persisted_log';
import {timefilter} from 'ui/timefilter';

import 'ui/autoload/styles';
import './less/main.less';
import './reactstrap.min'
import App from './components/main/app';
import Overview from './components/overview/overview';
import Functions from './components/functions/functions';
import Invocations from './components/invocations/invocations';
import InvocationDetails from './components/invocations/invocationDetails';

import Counter from './components/counter/Counter';

import {combineReducers, createStore} from "redux";
import {Provider}  from "react-redux";


import {getRealPath, KIBANA_THUNDRA_PATH} from './utils'
import firstReducer from "./reducers/counter";
import timeSelectorReducer from "./reducers/timeSelector";
// import Functions from "./components/counter/Functions";
import Home from "./components/counter/Home";

const app = uiModules.get('apps/thundra');

app.config($locationProvider => {
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false,
        rewriteLinks: false,
    });
});

app.config(stateManagementConfigProvider =>
    stateManagementConfigProvider.disable()
);

const myapp = combineReducers({
    firstReducer,
    timeSelectorReducer
});

const store = createStore(myapp);

function RootController($scope, $element, $http) {
    const domNode = $element[0];

    const interval = 10;
    const d = new Date();
    const startDate = new Date(d - 3600000).getTime();


    console.log( KIBANA_THUNDRA_PATH);
    render(
        <Provider store={store}>
            <Router basename={KIBANA_THUNDRA_PATH}>
                <div className="overview">
                    <App/>
                    <Route path="/overview" component={() => <Overview httpClient={$http} startDate={startDate} interval={interval}/>}/>
                    <Route path="/functions" component={() => <Functions httpClient={$http} startDate={startDate} interval={interval}/>}/>
                    <Route path="/invocations" component={() => <Invocations httpClient={$http} startDate={startDate} interval={interval}/>}/>
                    <Route path="/invocationDetails" component={() => <InvocationDetails httpClient={$http} startDate={startDate} interval={interval}/>}/>
                    <Route path="/test" component={() => <Counter httpClient={$http} startDate={startDate} interval={interval}/>} />
                </div>
            </Router>
        </Provider>, domNode
    );

    // unmount react on controller destroy
    $scope.$on('$destroy', () => {
        unmountComponentAtNode(domNode);
    });
}

chrome.setRootController('thundra', RootController);