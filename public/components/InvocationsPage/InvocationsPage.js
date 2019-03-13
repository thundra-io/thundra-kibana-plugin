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

import { TimeSelectorContainer, InvocationsTableContainer } from "../../containers";

class InvocationsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log("InvocationsPage, render; props: ", this.props);
        const {functionName} = this.props.match.params;

        const breadcrumbs = [
            {
              text: 'Functions',
              href: '#/functions',
            },
            {
              text: `${functionName}`,
              href: '#'
            }
          ];

        return (
            <div className="invocations-page">

                <TimeSelectorContainer />

                <EuiSpacer />

                <EuiTitle size={"s"}>
                    <h5>
                        <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false}/>
                    </h5>
                </EuiTitle>

                <EuiSpacer />
                <EuiSpacer />

                <InvocationsTableContainer
                    httpClient={this.props.httpClient}
                    history={this.props.history}
                    match={this.props.match}
                />

            </div>
        );
    }

}

export default InvocationsPage;