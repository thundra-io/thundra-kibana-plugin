import React from 'react';

import {
    EuiBasicTable,
    EuiLink,
    EuiHealth,
    EuiSpacer,
    EuiSwitch,
    EuiCode,
    EuiButton,
    EuiComboBox,
    EuiFlexGrid,
    EuiFlexItem,
    EuiText,
    EuiTextColor,
    EuiTitle,
    EuiForm,
    EuiFormRow,
    EuiSelect,
    EuiBreadcrumbs
} from '@elastic/eui';

import { InvocationLogsContainer } from "../../containers";

import "./styles.less";

class InvocationLogsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log("InvocationLogsPage, render; props: ", this.props);
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
                text: `Invocation Logs`,
                href: '#'
            }
        ];

        return (
            <div className="invocation-logs-page">

                {/* <TimeSelectorContainer /> */}
                <EuiTitle>
                    <h5>
                        <EuiTextColor color="secondary">Thundra Serverless Observability</EuiTextColor>
                    </h5>
                </EuiTitle>
                
                <EuiSpacer />

                <EuiTitle size={"s"}>
                    <h5>
                        <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />
                    </h5>
                </EuiTitle>
                
                <EuiSpacer />
                <EuiSpacer />

                <InvocationLogsContainer
                    httpClient={this.props.httpClient}
                    match={this.props.match}
                />

            </div>
        );
    }

}

export default InvocationLogsPage;