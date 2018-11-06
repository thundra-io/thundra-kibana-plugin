/**
 * @author Canberk Morelli
 * @version 30/10/17.
 */
import React, {Component} from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, ReferenceLine, Tooltip, XAxis, YAxis} from "recharts";

import moment from "moment/moment";
import {
    DAY_TIME_LIMIT_DATE_FORMAT,
    HOUR_TIME_LIMIT_DATE_FORMAT,
    MONTH_TIME_LIMIT_DATE_FORMAT,
    WEEK_TIME_LIMIT_DATE_FORMAT,
    TWO_MONTHS_TIME_LIMIT_DATE_FORMAT,
} from "./date-format";

import CustomTooltip from "../chart/tooltip/custom-tooltip";
import {stringToColor} from "../utils/string-to-color";


class FunctionsLineChart extends Component {

    constructor(props) {
        super(props);
        let initialState = {opacity: {}};
        this.props.lineNames.forEach(lineName => {
            initialState.opacity[lineName] = 1;
        });
        this.state = initialState;
        this.dateFormatter = this.dateFormatter.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseEnter(o) {
        const newOpacity = {};
        this.props.lineNames.forEach(lineName => {
            newOpacity[lineName] = o.dataKey === lineName ? 1 : 0.2;
        });

        this.setState({opacity: newOpacity});
    }

    handleMouseLeave(o) {
        const newOpacity = {};
        this.props.lineNames.forEach(lineName => {
            newOpacity[lineName] = 1;
        });

        this.setState({opacity: newOpacity});
    }

    dateFormatter(time) {
        return moment(time, 'YYYY-MM-DD HH:mm:ss.sss Z').local().format(timeLimitTypeDateFormats[this.props.timeLimitType]);
    }

    render() {
        return (
            <ResponsiveContainer>
                <LineChart width={this.props.width}
                           height={this.props.height}
                           data={this.props.data}>
                    <ReferenceLine y={this.props.threshold} label="Max" stroke="red"/>
                    <XAxis dataKey="time" tickFormatter={this.dateFormatter}/>
                    <YAxis allowDecimals={false}/>
                    <CartesianGrid strokeDasharray="1 3"/>
                    <Tooltip content={<CustomTooltip unit={this.props.unit}/>}/>
                    <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
                            align={this.props.align ? this.props.align : 'center'}/>
                    {renderLines(this.props.lineNames, this.state)}
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

const timeLimitTypeDateFormats = {
    HOUR: HOUR_TIME_LIMIT_DATE_FORMAT,
    DAY: DAY_TIME_LIMIT_DATE_FORMAT,
    WEEK: WEEK_TIME_LIMIT_DATE_FORMAT,
    MONTH: MONTH_TIME_LIMIT_DATE_FORMAT,
    TWO_MONTHS: TWO_MONTHS_TIME_LIMIT_DATE_FORMAT,
};

const renderLines = (items, state) => {
    return items.map(item => {
        return (
            <Line key={item}
                  connectNulls={true}
                  type="monotone"
                  legendType="circle"
                  dataKey={item}
                  stroke={stringToColor(item)}
                  strokeWidth={1}
                  strokeOpacity={state.opacity[item]}
                  dot={true}
                  animationDuration={800}
                  animationEasing={"ease-in-out"}/>
        )
    });
};

export default FunctionsLineChart;

