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

const SourceComponent = () => {
    return (
        <div>
            this is source
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

const HeaderComponent = () => {
    return (
        <div>
            this is header component
        </div>
    )
}

// build the router
const router = (

  <EuiErrorBoundary>
    <div className={'content-wrapper'}>
      {/* <Header /> */}
      <EuiPage>
        <EuiPanel paddingSize="l" hasShadow>
          {/* <SettingsModal /> */}
          <Switch>
            {/* <Route path="/source" component={SourceList} /> */}
            <Route path="/source" component={SourceComponent} />
            <Route path="/details" component={DetailsComponent} />
            {/* <Route path="/channel" component={ChannelList} exact={true} /> */}
            {/* <Route path="/channel/create/from/:name" component={ChannelCreate} exact={true} /> */}
            <Redirect to="/source" />
          </Switch>
        </EuiPanel>
      </EuiPage>
    </div>
  </EuiErrorBoundary>

);

// export
export { router };