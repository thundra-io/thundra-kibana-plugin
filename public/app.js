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
import {Main} from './components/main';
import {combineReducers, createStore} from "redux";
import firstReducer from "./reducers";
import {Provider}  from "react-redux";

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

const MS_PER_MINUTE = 60000;

const myapp = combineReducers({
        firstReducer
});

const store = createStore(myapp);

function RootController($scope, $element, $http) {
    const domNode = $element[0];
    // render react to DOM
    render(
        <Provider store={store}>
            <Main title="thundra" httpClient={$http}/>
        </Provider>, domNode
    );

    // unmount react on controller destroy
    $scope.$on('$destroy', () => {
        unmountComponentAtNode(domNode);
    });
}

chrome.setRootController('thundra', RootController);