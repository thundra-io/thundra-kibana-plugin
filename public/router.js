import { EuiErrorBoundary } from '@elastic/eui/lib/components/error_boundary/error_boundary';
import { EuiPage } from '@elastic/eui/lib/components/page/page';
import { EuiPanel } from '@elastic/eui/lib/components/panel/panel';
import React from 'react';
import {
    Redirect,
    Route,
    Switch,
    Link
} from 'react-router-dom';

// import SettingsModal from './components/SettingsModal/SettingsModal';
// import ChannelCreate from './containers/ChannelCreate';
// import ChannelList from './containers/ChannelList/ChannelList';
// import Header from './containers/Header';
// import SourceList from './containers/SourceList';

import { OverviewPage, FunctionsPage, InvocationsPage } from "./components";

const SourceComponent = (props) => {

    console.log("SourceComponent; props: ", props);

    return (
        <div>
            <p>this is source</p>
            <p>functionName: {props.match.params.functionName}</p>
            <Link
                // key={index}
                key={"details"}
                // to={`/${tab.id}`}
                to={`/details`}
            // className={classes}
            // replace={selected === tab.id}
            >
                go to details
            </Link>
            {/* <button
                className="button icon-left"
                onClick={this.context.router.history.goBack}>
                Back
            </button> */}

        </div>
    );
}

const DetailsComponent = () => {
    return (
        <div>
            this is details component
            {/* <button
                className="button icon-left"
                onClick={this.context.router.history.goBack}>
                Back
            </button> */}
        </div>
    )
}

// This is for routes to be shown on HeaderContainer
export const routeList = {
    overview: {
        path: "/overview",
        title: "Welcome to Thundra Kibana Plugin",
        name: 'Overview',
        disabled: false,
    },
    functions: {
        path: "/functions",
        title: "Functions",
        name: 'Functions',
        disabled: false,
    },
    // invocations: {
    //     path: "/functions/:functionName",
    //     title: "Invocations",
    //     name: "Invocations",
    //     disabled: false
    // }
};

// build the router
const MainRouter = (routerProps) => {
    console.log("MainRouter; props: ", routerProps);
    return (
        <EuiErrorBoundary>
            <div className={'content-wrapper'}>
                <EuiPage>
                    <EuiPanel paddingSize="l" hasShadow>
                        {/* <SettingsModal /> */}
                        <Switch>
                            <Route path={routeList.overview.path}
                                render={(props) => <OverviewPage {...props} httpClient={routerProps.httpClient}/>} 
                            />
                            <Route exact path={routeList.functions.path}
                                render={(props) => <FunctionsPage {...props} httpClient={routerProps.httpClient}/>} 
                            />
                            <Route path="/functions/:functionName" 
                                render={(props) => <InvocationsPage {...props} httpClient={routerProps.httpClient}/>} 
                            />

                            <Route path="/source" component={SourceComponent} />
                            <Route path="/details" component={DetailsComponent} />
                            {/* <Route path="/channel" component={ChannelList} exact={true} /> */}
                            {/* <Route path="/channel/create/from/:name" component={ChannelCreate} exact={true} /> */}
                            {/* <Redirect to="/source" /> */}
                            <Redirect to={routeList.overview.path} />
                        </Switch>
                    </EuiPanel>
                </EuiPage>
            </div>
        </EuiErrorBoundary>
    );

};
export { MainRouter };