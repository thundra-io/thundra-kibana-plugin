import React from 'react';

import {
    EuiSpacer,
    EuiTitle,
    EuiBreadcrumbs,
} from '@elastic/eui';

import { 
    TimeSelectorContainer, 
    InvocationsMetaInfoContainer, 
    InvocationsMetricsContainer, 
} from "../../containers";

class MetricsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log("MetricsPage, render; props: ", this.props);
        const { functionName } = this.props.match.params;

        const breadcrumbs = [
            {
                text: 'Functions',
                href: '#/functions',
            },
            {
                text: `${functionName}`,
                href: `#/functions/${functionName}`
            },
            {
                text: `Metrics`,
                href: `#`
            }
        ];

        return (
            <div className="metrics-page">

                <TimeSelectorContainer />

                <EuiSpacer />

                <EuiTitle size={"s"}>
                    <h5>
                        <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />
                    </h5>
                </EuiTitle>

                <EuiSpacer />

                <InvocationsMetaInfoContainer
                    httpClient={this.props.httpClient}
                    match={this.props.match}
                />

                <EuiSpacer />

                <InvocationsMetricsContainer
                    httpClient={this.props.httpClient}
                    history={this.props.history}
                    match={this.props.match}
                />

            </div>
        );
    }

}

export default MetricsPage;