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
    EuiBreadcrumbs,
    EuiButtonToggle,
    EuiToggle
} from '@elastic/eui';

import { TimeSelectorContainer, InvocationsTableContainer, InvocationsMetaInfoContainer, InvocationsHeatMapContainer } from "../../containers";

class InvocationsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isHeatMapOn: false
        };
    }

    onHeatMapToggleChange = (e) => {
        this.setState({ isHeatMapOn: e.target.checked });
    }

    render() {
        console.log("InvocationsPage, render; props: ", this.props);
        const { functionName } = this.props.match.params;

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
                        <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />
                    </h5>
                </EuiTitle>

                <EuiSpacer />

                <InvocationsMetaInfoContainer
                    httpClient={this.props.httpClient}
                    match={this.props.match}
                />

                <div>

                    <EuiButtonToggle
                        label={this.state.isHeatMapOn ? 'Hide HeatMap' : 'Show HeatMap'}
                        fill={this.state.isHeatMapOn}
                        onChange={this.onHeatMapToggleChange}
                        isSelected={this.state.isHeatMapOn}
                    />
                </div>

                {this.state.isHeatMapOn &&
                    <InvocationsHeatMapContainer
                        httpClient={this.props.httpClient}
                        history={this.props.history}
                        match={this.props.match}
                    />
                }

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