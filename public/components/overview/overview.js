import React from 'react';
import {Card, CardBody, Col, Row} from 'reactstrap';
import {
    EuiBasicTable,
    EuiLink,
    EuiHealth,
} from '@elastic/eui';

export class Overview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            costCalculated : false
        };
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
            this.setState({
                costCalculated: true,
                estimatedBilledCost: resp.data.estimatedBilledCost
            });
        });
    }

    componentDidMount() {
    }

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
                            <h5 className="billed-cost"> {this.state.costCalculated === true ? "$": ""}{this.state.estimatedBilledCost}</h5>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}
