// import createHistory from 'history/createHashHistory';
import React from 'react';
import {uiModules} from 'ui/modules';
import chrome from 'ui/chrome';
import {render} from 'react-dom';

import {DocTitleProvider} from 'ui/doc_title';
import {SavedObjectRegistryProvider} from 'ui/saved_objects/saved_object_registry';
import {fatalError, notify, toastNotifications} from 'ui/notify';
import {timezoneProvider} from 'ui/vis/lib/timezone';
import {recentlyAccessed} from 'ui/persisted_log';
import {timefilter} from 'ui/timefilter';


import 'ui/autoload/styles';
import './less/main.less';
import Main from './components/main/main';
import {combineReducers, createStore} from "redux";
import {Provider}  from "react-redux";
import { HashRouter } from 'react-router-dom';
// import { ConnectedRouter } from 'react-router-redux';
import { ConnectedRouter } from 'connected-react-router'
// import { router } from './router';
import { MainRouter } from './router';

import firstReducer from "./reducers/counter";
import timeSelectorReducer from "./reducers/timeSelector";

import store, {history} from "./store/configureStore";


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

// const myapp = combineReducers({
//     firstReducer,
//     timeSelectorReducer
// });
// const store = createStore(myapp);

function RootController($scope, $element, $http) {
    const domNode = $element[0];
    // render react to DOM
    render(
        <Provider store={store}>
            {/* <Main title="thundra" httpClient={$http}/> */}

            <ConnectedRouter history={history}>
                <HashRouter>
                    <MainRouter httpClient={$http}/>
                </HashRouter>
            </ConnectedRouter>
            
        </Provider>, domNode
    );

    // unmount react on controller destroy
    $scope.$on('$destroy', () => {
        unmountComponentAtNode(domNode);
    });
}

chrome.setRootController('thundra', RootController);