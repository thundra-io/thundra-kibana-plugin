import React from 'react';
import { Container, Row, Col, Card, CardText, CardBody, CardTitle} from 'reactstrap';
import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageHeader,
    EuiText,
    EuiTitle
} from '@elastic/eui';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const {httpClient} = this.props;
        httpClient.get('../api/thundra/invocation-count').then((resp) => {
            this.setState({invocationCount: resp.data.invocationCount});
        });

        httpClient.get('../api/thundra/erronous-invocation-count').then((resp) => {
            this.setState({errorCount: resp.data.errorCount});
        });

        httpClient.get('../api/thundra/cold-start-count').then((resp) => {
            this.setState({coldStartCount: resp.data.coldStartCount});
        });

        httpClient.get('../api/thundra/estimated-billed-cost').then((resp) => {
            this.setState({estimatedBilledCost: resp.data.estimatedBilledCost});
        });


    }

    componentDidMount() {
        /*
           FOR EXAMPLE PURPOSES ONLY.  There are much better ways to
           manage state and update your UI than this.
        */
        const {httpClient} = this.props;
        httpClient.get('../api/thundra/example').then((resp) => {
            this.setState({time: resp.data.time});
        });
    }

    getBilledCost = (e) => {
        return e.toFixed(2);
    };

    getNavbar = () =>{
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">reactstrap</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/components/">Components</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Options
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        Option 1
                                    </DropdownItem>
                                    <DropdownItem>
                                        Option 2
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>
                                        Reset
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    };

    render() {
        const {title} = this.props;
        return (
                <Row className="overview">
                    <Col xl="3">
                        <Card>
                            <CardBody>
                                <p>New Invocations</p>
                                <h5 className="invocation-count">{this.state.invocationCount}</h5>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="3">
                        <Card>
                            <CardBody>
                                <p>New Errors</p>
                                <h5 className="error-count">{this.state.errorCount}</h5>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="3">
                        <Card>
                            <CardBody>
                                <p>New Cold Starts</p>
                                <h5 className="cold-start">{this.state.coldStartCount}</h5>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="3">
                        <Card>
                            <CardBody>
                                <p>Estimated Billed Cost</p>
                                <h5 className="billed-cost">${this.state.estimatedBilledCost}</h5>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
        );
    }
}
