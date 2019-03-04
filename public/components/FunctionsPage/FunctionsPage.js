import React from 'react';
import {
    Redirect,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import {HeaderTab} from "../../components";

import { TimeSelectorContainer, FunctionsTableContainer } from "../../containers";

export default class FunctionsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log("FunctionsPage, render; props: ", this.props);

        return(
            <div className="functions-page">
                <TimeSelectorContainer />

                <HeaderTab history={this.props.history}/>

                <FunctionsTableContainer 
                    httpClient={this.props.httpClient}
                />

                {/* <Link
                    key={"details"}
                    to={`/details`}
                >
                    go to details
                </Link> */}

                {/* <button
                    className="button icon-left"
                    onClick={this.context.router.history.goBack}>
                    Back
                </button> */}

            </div>
        )
    }

}