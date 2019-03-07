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

import { TimeSelectorContainer, InvocationsTableContainer, InvocationTraceChartContainer } from "../../containers";

class InvocationTracePage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log("InvocationTracePage, render; props: ", this.props);
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
                text: `Invocation Trace`,
                href: '#'
            }
        ];

        return (
            <div className="invocation-trace-page">

                {/* <TimeSelectorContainer /> */}
                <EuiTitle>
                    <h5>
                        <EuiTextColor color="secondary">Thundra Serverless Observability</EuiTextColor>
                    </h5>
                </EuiTitle>
                <EuiSpacer />

                <p>invocation trace page</p>

                <EuiSpacer />

                <EuiTitle size={"s"}>
                    <h5>
                        <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />
                    </h5>
                </EuiTitle>

                <EuiSpacer />

                <InvocationTraceChartContainer
                    httpClient={this.props.httpClient}
                    match={this.props.match}
                />

            </div>
        );
    }

}

export default InvocationTracePage;