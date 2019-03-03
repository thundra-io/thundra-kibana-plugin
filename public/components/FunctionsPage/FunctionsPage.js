import React from 'react';
import {
    Redirect,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import {HeaderContainer} from "../../containers";

export default class FunctionsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log("FunctionsPage, render; props: ", this.props);

        return(
            <div className="functions-page">
                <HeaderContainer history={this.props.history}/>

                <p>this is functions</p>
                <Link
                    // key={index}
                    key={"details"}
                    // to={`/${tab.id}`}
                    to={`/details`}
                    // className={classes}
                    // replace={selected === tab.id}
                >
                    go to details
                </Link>

                {/* <button
                    className="button icon-left"
                    onClick={this.context.router.history.goBack}>
                    Back
                </button> */}

            </div>
        )
    }

}