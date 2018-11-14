import React, { Component }from 'react';
import {uiModules} from 'ui/modules';
import chrome from 'ui/chrome';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';



import {DocTitleProvider} from 'ui/doc_title';
import {SavedObjectRegistryProvider} from 'ui/saved_objects/saved_object_registry';
import {fatalError, notify, toastNotifications} from 'ui/notify';
import {timezoneProvider} from 'ui/vis/lib/timezone';
import {recentlyAccessed} from 'ui/persisted_log';
import {timefilter} from 'ui/timefilter';

import 'ui/autoload/styles';
import './less/main.less';
import Main from './components/main/main';
import Counter from './components/counter/Counter';

import {combineReducers, createStore} from "redux";
import {Provider}  from "react-redux";


import firstReducer from "./reducers/counter";
import timeSelectorReducer from "./reducers/timeSelector";
import Functions from "./components/counter/Functions";
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
    // render react to DOM

    const renderHome = () =>{
        return (<Functions/>);
    };


    const renderTest = () =>{
        return (<Home/>);
    };

    class App extends Component {

        constructor(...args) {
            super(...args);
        }

        render(){

            return(
                <div>
                    <ul>
                        <li>
                            <Link to="/test">Home</Link>
                        </li>
                        <li>
                            <Link to="/main">Main</Link>
                        </li>
                    </ul>
                    <Route path="/main" component={() => <Main httpClient={$http} />}/>
                    <Route path="/test" component={() => <Counter/>} />
                </div>
            )
        }
    }

    function Child({ match }) {
        return (
            <div>
                <h3>ID: {match.params.id}</h3>
            </div>
        );
    }

    function ComponentWithRegex({ match }) {
        return (
            <div>
                <h3>Only asc/desc are allowed: {match.params.direction}</h3>
            </div>
        );
    }


    render(
        <Provider store={store}>
            <Router basename="/aey/app/thundra">
                <App/>
            </Router>

        </Provider>, domNode
    );

    // unmount react on controller destroy
    $scope.$on('$destroy', () => {
        unmountComponentAtNode(domNode);
    });
}

chrome.setRootController('thundra', RootController);