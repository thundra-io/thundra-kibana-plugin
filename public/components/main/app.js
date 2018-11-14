import React, {Component} from 'react';
import {Nav, NavItem} from 'reactstrap';
import {
    EuiButton,
    EuiComboBox,
    EuiDatePicker,
    EuiFlexGrid,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageHeader,
    EuiSpacer,
    EuiTextColor,
    EuiTitle
} from '@elastic/eui';

import {Link, Route} from 'react-router-dom';
// import Functions from "../functions/functions";
import {connect} from "react-redux";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <div className="overview">
                <div>
                    <Nav tabs>
                        <NavItem>
                            <Link to="/overview">Overview</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/functions">Functions</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/invocations">Invocations</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/test">Test</Link>
                        </NavItem>
                    </Nav>

                    <EuiFlexGrid>
                        <EuiFlexItem grow={10}>
                            <EuiTitle>
                                <h5>
                                    <EuiTextColor color="secondary">Thundra Serverless Observability</EuiTextColor>
                                </h5>
                            </EuiTitle>
                        </EuiFlexItem>
                        <EuiSpacer size="s"/>
                        <EuiFlexItem grow={2}>
                            <EuiComboBox
                                placeholder="Select a date"
                                singleSelection={{ asPlainText: true }}
                                options={this.options}
                                selectedOptions={this.state.selectedOptions}
                                onChange={this.onChange}
                                isClearable={false}
                            />
                        </EuiFlexItem>
                    </EuiFlexGrid>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        startDate:  state.timeSelectorReducer.startDate,
        interval: state.timeSelectorReducer.interval,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeTime: (x) => {
            const MS_PER_MINUTE = 60000;
            let d = new Date();
            let date = new Date(d - x.value*(MS_PER_MINUTE));
            return dispatch({type: 'CHANGE_TIME', val: date.getTime() , interval: x.interval });
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App)
