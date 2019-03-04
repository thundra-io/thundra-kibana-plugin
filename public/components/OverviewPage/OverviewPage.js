import React from 'react';

import { HeaderTab } from "../../components";
import { OverviewInfoContainer, OverviewGraphsContainer, TimeSelectorContainer } from "../../containers";

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
        );
    }

}

export default OverviewPage;