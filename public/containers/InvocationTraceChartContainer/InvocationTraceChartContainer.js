import React, { Fragment } from 'react';

import {
    Link
} from 'react-router-dom';

import {
    EuiSpacer,
    EuiPanel,
    EuiInMemoryTable,
    EuiLink,
    EuiBasicTable,
    EuiLoadingKibana,
    EuiAccordion,
    EuiText
} from '@elastic/eui';

import {
    fetchInvocationSpans
} from "../../store/actions";

import DetailedTraceSummary from "../../components/DetailedTraceSummary";
import { treeCorrectedForClockSkew, detailedTraceSummary } from '../../zipkin';

import { connect } from "react-redux";

export const SERVICES_ASSETS = {
    DynamoDB: {
        color: "#327BEC",
        iconCls: "table-services-icon-aws-dynamodb",
        text: "DynamoDB"
    },
    ELASTICSEARCH: {
        color: "#FEAE37",
        iconCls: "services-icon-elasticsearch",
        text: "ElasticSearch"
    },
    APIGATEWAY: {
        color: "#D6B779",
        iconCls: "services-icon-aws-apigateway",
        text: "APIGateway"
    },
    SQS: {
        color: "#D6B779",
        iconCls: "table-services-icon-aws-sqs",
        text: "SQS",
    },
    SNS: {
        color: "#9E8739",
        iconCls: "table-services-icon-aws-sns",
        text: "SNS",
    },
    KINESIS: {
        color: "#784C1D",
        iconCls: "table-services-icon-aws-kinesis",
        text: "Kinesis",
    },
    FIREHOSE: {
        color: "#484839",
        iconCls: "table-services-icon-aws-firehose",
        text: "Firehose",
    },
    S3: {
        color: "#DA2525",
        iconCls: "table-services-icon-aws-s3",
        text: "S3"
    },
    LAMBDA: {
        color: "#DC822F",
        iconCls: "table-services-icon-aws-lambda",
        text: "Lambda",
    },
    RDB: {
        color: "#E32828",
        iconCls: "services-icon-rdb",
        text: "RDB",
    },
    POSTGRESQL: {
        color: "#E32828",
        iconCls: "services-icon-postgresql",
        text: "PostgreSQL"
    },
    MYSQL: {
        color: "#E32828",
        iconCls: "services-icon-mysql",
        text: "MySQL"
    },
    MARIADB: {
        color: "#E32828",
        iconCls: "services-icon-mariadb"
    },
    MSSQL: {
        color: "#E32828",
        iconCls: "services-icon-mssql",
        text: "MSSQL",
    },
    REDIS: {
        color: "#CF186F",
        iconCls: "table-services-icon-redis",
        text: "Redis",
    },
    HTTP: {
        color: "#44AB2D",
        iconCls: "table-services-icon-http",
        text: "HTTP"
    },
    FUNC: {
        color: "#37BEDA",
        iconCls: "table-services-icon-function",
        text: ""
    },
    METHOD: {
        color: "#DC811A",
        iconCls: "table-services-icon-function",
        text: "Method",
    },
    OTHER: {
        color: "#B5CC18",
        iconCls: "table-services-icon-function",
        text: "Other",
    },
}

const theme = {
    scheme: 'google',
    author: 'seth wright (http://sethawright.com)',
    base00: '#1d1f21',
    base01: '#282a2e',
    base02: '#373b41',
    base03: '#969896',
    base04: '#b4b7b4',
    base05: '#c5c8c6',
    base06: '#e0e0e0',
    base07: '#ffffff',
    base08: '#CC342B',
    base09: '#F96A38',
    base0A: '#FBA922',
    base0B: '#198844',
    base0C: '#3971ED',
    base0D: '#3971ED',
    base0E: '#A36AC7',
    base0F: '#3971ED'
};


const DBSummary = [
    { title: "Error", prop: "error" },
    { title: "Host", prop: "db.host" },
    { title: "Instance", prop: "db.instance" },
    { title: "Statement Type", prop: "db.statement.type" },
    { title: "Statement", prop: "db.statement" }
]
    ;


const SpanConstants = {
    "AWS-DynamoDB": {
        backgroundColor: SERVICES_ASSETS.DynamoDB.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.DynamoDB.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "Operation Type", prop: "operation.type" },
            { title: "Table Name", prop: "aws.dynamodb.table.name" },
            { title: "Statement", prop: "db.statement" },
            { title: "Request Name", prop: "aws.request.name" },
        ]
    },
    "AWS-SQS": {
        backgroundColor: SERVICES_ASSETS.SQS.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.SQS.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "Operation Type", prop: "operation.type" },
            { title: "Queue Name", prop: "aws.sqs.queue.name" },

        ]
    },
    "AWS-SNS": {
        backgroundColor: SERVICES_ASSETS.SNS.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.SNS.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "Operation Type", prop: "operation.type" },
            { title: "Topic Name", prop: "aws.sns.topic.name" },
            { title: "Request Name", prop: "aws.request.name" },
        ]

    },
    "AWS-Kinesis": {
        backgroundColor: SERVICES_ASSETS.KINESIS.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.KINESIS.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "Operation Type", prop: "operation.type" },
            { title: "Stream Name", prop: "aws.kinesis.stream.name" },
        ]
    },
    "AWS-Firehose": {
        backgroundColor: SERVICES_ASSETS.FIREHOSE.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.FIREHOSE.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "Operation Type", prop: "operation.type" },
            { title: "Stream Name", prop: "aws.firehose.stream.name" },
        ]
    },
    "AWS-S3": {
        backgroundColor: SERVICES_ASSETS.S3.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.S3.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "Operation Type", prop: "operation.type" },
            { title: "Bucket Name", prop: "aws.s3.bucket.name" },
            { title: "Object Name", prop: "aws.s3.object.name" },
        ]
    },

    "AWS-Lambda": {
        backgroundColor: SERVICES_ASSETS.LAMBDA.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.LAMBDA.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "Trigger Class", prop: "trigger.className" },
            { title: "Trigger Domain", prop: "trigger.domainName" },
            { title: "Request", prop: "aws.lambda.invocation.request" },
            { title: "Response", prop: "aws.lambda.invocation.response" },
        ]
    },
    "POSTGRESQL": {
        backgroundColor: SERVICES_ASSETS.POSTGRESQL.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.POSTGRESQL.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: DBSummary
    },
    "PG": {
        backgroundColor: SERVICES_ASSETS.POSTGRESQL.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.POSTGRESQL.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: DBSummary
    },
    "ELASTICSEARCH": {
        backgroundColor: SERVICES_ASSETS.ELASTICSEARCH.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.ELASTICSEARCH.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: DBSummary
    },
    "MYSQL": {
        backgroundColor: SERVICES_ASSETS.MYSQL.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.MYSQL.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: DBSummary

    },
    "RDB": {
        backgroundColor: SERVICES_ASSETS.RDB.color,
        iconClass: {
            cmd: 'regex',
            arg0: "db.type",
            arg2: {
                default: SERVICES_ASSETS.RDB.iconCls,
                mysql: SERVICES_ASSETS.MYSQL.iconCls,
                postgresql: SERVICES_ASSETS.POSTGRESQL.iconCls,
                mariadb: SERVICES_ASSETS.MARIADB.iconCls,
                mssql: SERVICES_ASSETS.MSSQL.iconCls
            }
        },
        summaryRenderer: 'PropRenderer',
        summary: DBSummary
    },
    "Redis": {
        backgroundColor: SERVICES_ASSETS.REDIS.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.REDIS.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "Host", prop: "redis.host" },
            { title: "Operation Type", prop: "operation.type" },
            { title: "Command", prop: "redis.command" },
        ]
    },
    "HTTP": {
        backgroundColor: SERVICES_ASSETS.HTTP.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.HTTP.iconCls },
        summaryRenderer: 'PropRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "URL", prop: "http.url" },
            { title: "Query Params", prop: "http.query_params" },
            { title: "Status Code", prop: "http.status_code" },
            { title: "Method", prop: "http.method" },
        ]
    },
    "Func": {
        backgroundColor: SERVICES_ASSETS.FUNC.color,
        iconClass: { cmd: 'static', clsname: SERVICES_ASSETS.FUNC.iconCls },
        summaryRenderer: 'MethodRenderer',
        summary: [
            { title: "Error", prop: "error" },
            { title: "Return Value", prop: "method.return_value" },
            { title: "Args", prop: "method.args" },
        ]
    },

}

class InvocationTraceChartContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFunctionName: null,
            pageIndex: 0, // this holds the page index for pagination, default => 0
            paginationSize: 10, // 20
            paginationFrom: 0,
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const { transactionId } = this.props.match.params;

        this.props.fetchInvocationSpans(this.props.httpClient, transactionId);
    }

    sampleHttpTrace = () => {
        const frontend = {
            serviceName: 'frontend',
            ipv4: '172.17.0.13',
        };

        const backend = {
            serviceName: 'backend',
            ipv4: '172.17.0.9',
        };

        const httpTrace = [
            {
                traceId: 'bb1f0e21882325b8',
                parentId: 'bb1f0e21882325b8',
                id: 'c8c50ebd2abc179e',
                kind: 'CLIENT',
                name: 'get',
                timestamp: 1541138169297572,
                duration: 111121,
                localEndpoint: frontend,
                annotations: [
                    { value: 'ws', timestamp: 1541138169337695 },
                    { value: 'wr', timestamp: 1541138169368570 },
                ],
                tags: {
                    'http.method': 'GET',
                    'http.path': '/api',
                },
            },
            {
                traceId: 'bb1f0e21882325b8',
                id: 'bb1f0e21882325b8',
                kind: 'SERVER',
                name: 'get /',
                timestamp: 1541138169255688,
                duration: 168731,
                localEndpoint: frontend,
                remoteEndpoint: {
                    ipv4: '110.170.201.178',
                    port: 63678,
                },
                tags: {
                    'http.method': 'GET',
                    'http.path': '/',
                    'mvc.controller.class': 'Frontend',
                    'mvc.controller.method': 'callBackend',
                },
            },
            {
                traceId: 'bb1f0e21882325b8',
                parentId: 'bb1f0e21882325b8',
                id: 'c8c50ebd2abc179e',
                kind: 'SERVER',
                name: 'get /api',
                timestamp: 1541138169377997, // this is actually skewed right, but we can't correct it
                duration: 26326,
                localEndpoint: backend,
                remoteEndpoint: {
                    ipv4: '172.17.0.13',
                    port: 63679,
                },
                tags: {
                    'http.method': 'GET',
                    'http.path': '/api',
                    'mvc.controller.class': 'Backend',
                    'mvc.controller.method': 'printDate',
                },
                shared: true,
            },
        ];

        console.log("sampleHttpTrace; httpTrace: ", httpTrace);

        return httpTrace;
    }

    createMockTraceSummary = () => {
        // console.log("createMockTraceSummary; props: ", this.props);

        const { invocationSpans } = this.props;

        const mockTraceSummary = {
            traceId: "trace-1",
            spans:
                [
                    {
                        spanId: "1",
                        spanName: "spanName-1",
                        // parentId: ""
                        childIds: ["2"],
                        serviceName: "serviceName-1",
                        serviceNames: ["serviceName-1-1"],
                        timestamp: 1551965325267,
                        duration: 279,
                        durationStr: "durationStr-1",
                        tags:
                            [
                                { key: "tag-1-1", value: "tag-1-1" },
                                { key: "tag-1-2", value: "tag-1-2" }
                            ],
                        annotations: [
                            {
                                value: "ann-1",
                                timestamp: 1551965325267000,
                                endpoint: "endpoint-1",
                                relativeTime: "anno 1 relativeTime"
                            }
                        ],
                        errorType: "",
                        depth: 1,
                        width: 7,
                        left: 0
                    },
                    {
                        spanId: "2",
                        spanName: "spanName-2",
                        parentId: "1",
                        childIds: ["3"],
                        // childIds: [],
                        serviceName: "serviceName-2",
                        serviceNames: ["serviceName-2-1", "serviceName-2-2"],
                        timestamp: 1551965325267,
                        duration: 209,
                        durationStr: "durationStr-2",
                        tags:
                            [
                                { key: "tag-2-1", value: "tag-2-1" },
                                { key: "tag-2-2", value: "tag-2-2" }
                            ],
                        annotations: [
                            {
                                value: "ann-2",
                                timestamp: 1551965325267,
                                endpoint: "endpoint-2",
                                relativeTime: "anno 2 relative Time"
                            }
                        ],
                        errorType: "",
                        depth: 2,
                        width: 20,
                        left: 40
                    },
                    {
                        spanId: "3",
                        spanName: "spanName-3",
                        parentId: "2",
                        childIds: [],
                        serviceName: "serviceName-3",
                        serviceNames: ["serviceName-3-1"],
                        timestamp: 1551965325267,
                        duration: 209,
                        durationStr: "durationStr-3",
                        tags:
                            [
                                { key: "tag-3-1", value: "tag-3-1" },
                                { key: "tag-3-2", value: "tag-3-2" }
                            ],
                        annotations: [
                            {
                                value: "ann-3",
                                timestamp: 1551965325267,
                                endpoint: "endpoint-3",
                                relativeTime: "anno 3 relative Time"
                            }
                        ],
                        errorType: "",
                        depth: 3,
                        width: 20,
                        left: 40
                    },
                    {
                        spanId: "4",
                        spanName: "spanName-4",
                        parentId: "2",
                        childIds: [],
                        serviceName: "serviceName-4",
                        serviceNames: ["serviceName-4-1"],
                        timestamp: 1551965325267,
                        duration: 209,
                        durationStr: "durationStr-4",
                        tags:
                            [
                                { key: "tag-4-1", value: "tag-4-1" },
                                { key: "tag-4-2", value: "tag-4-2" }
                            ],
                        annotations: [
                            {
                                value: "ann-4",
                                timestamp: 1551965325267,
                                endpoint: "endpoint-4",
                                relativeTime: "anno 4 relative Time"
                            }
                        ],
                        errorType: "error-4",
                        depth: 3,
                        width: 10,
                        left: 50
                    }
                ],
            serviceNameAndSpanCounts:
                [
                    { serviceName: "serviceName-1-aws", spanCount: 2 }
                ],
            duration: 1000,
            durationStr: "duration-str-1000",

            // depth: 1,
            // width: 7,
            // left: 0
        }


        return mockTraceSummary;
    }

    prepareTagsForSpan = (tags) => {
        // console.log("prepareTagsForSpan; tags: ", tags);
        let processedSpanTags = {};

        // If there is an object/array value, convert it to string because tags are supposed to 
        // be string key/value pairs.
        Object.keys(tags).forEach((key) =>
            processedSpanTags[key] =
            typeof tags[key] === "object" ? JSON.stringify(tags[key]) : tags[key]
        );

        return processedSpanTags;
    }

    computeSpanServiceName = (span) => {
        // console.log("computeSpanServiceName; span: ", span);
        let serviceName = "";

        if (span.className !== "") {
            serviceName = span.className;
        } else {
            // serviceName = span.domainName || "asdf";
            // serviceName = span.operationName || "asdf";
            serviceName = "code";
        }

        // return span.serviceName;
        return serviceName;
    }

    computeSpanName = (span) => {
        // console.log("computeSpanName; span: ", span);
        let spanName = "";

        // if (span.domainName !== "") {
        //     spanName = spanName + " " + span.domainName;
        // }

        // if (span.className !== "") {
        //     spanName = spanName + " " + span.className;
        // }

        if (span.operationName !== "") {
            spanName = spanName + " " + span.operationName;
        }

        return spanName;
    }

    convertThundraInvocationsToTrace = () => {
        const { transactionId } = this.props.match.params;
        const { invocationSpans } = this.props;

        // console.log("convertThundraInvocationsToTrace; transactionId, invocationSpans: ", transactionId, invocationSpans);

        const thundraTrace = invocationSpans.map((rawSpan, index) => {

            const span = rawSpan._source;

            // console.log(`${index}: span tag: `, span.tags);
            // console.log(`${index}: span tag: `, JSON.stringify(span.tags));

            const spanTags = this.prepareTagsForSpan(span.tags);
            const spanName = this.computeSpanName(span);
            const spanServiceName = this.computeSpanServiceName(span);

            return (
                {
                    traceId: transactionId,
                    parentId: span.parentSpanId || "",
                    id: span.id,
                    name: spanName,
                    timestamp: span.startTimestamp * 1000,
                    duration: span.duration < 1 ? 1 : span.duration * 1000,
                    localEndpoint: { serviceName: spanServiceName, ipv4: '0.0.0.0' },
                    annotations: [ // TODO: remove annos?
                        { value: 'ws', timestamp: 1541138169337695 },
                        { value: 'wr', timestamp: 1541138169368570 },
                    ],
                    tags: spanTags,
                }
            )
        });

        return thundraTrace;
    }

    renderErrorStacks = () => {
        const {invocationSpans} = this.props;
        if (invocationSpans.length < 1) {
            return null;
        } else {
            const {tags} = invocationSpans[0]._source;
            if (tags.error) {
                return (
                    <EuiPanel>
                        <p>You have error in your invocation.</p>
                        <EuiSpacer />
                        <EuiAccordion
                            id="accordion2"
                            buttonContent={tags["error.kind"]}
                            paddingSize="l"
                        >
                            <EuiText>
                                <span>Error Message:</span>
                                <p>{tags["error.message"]}</p>
                                <span>Error Stack:</span> 
                                <p>{tags["error.stack"]}</p>
                            </EuiText>
                        </EuiAccordion>
                    </EuiPanel>
                );
            }
        }
    }

    render() {
        console.log("InvocationTraceChartContainer, render; props: ", this.props);
        const { invocationSpans } = this.props;
        const { transactionId } = this.props.match.params

        let mockTraceSummary = [];
        if (invocationSpans.length > 0) {
            const rawMockTraceSummary = this.convertThundraInvocationsToTrace();
            const correctedMockTraceSummary = treeCorrectedForClockSkew(rawMockTraceSummary);
            console.log("ITCC; correctedMockTraceSummary: ", correctedMockTraceSummary);
            mockTraceSummary = detailedTraceSummary(correctedMockTraceSummary);

            console.log("ITCC; mockTraceSummary: ", mockTraceSummary);
        }

        return (
            <div className="invocation-trace-chart-container">

                {this.renderErrorStacks()}

                <EuiSpacer />

                {invocationSpans.length > 0 ?
                    <DetailedTraceSummary
                        isLoading={this.props.invocationSpansFetching}
                        traceId={transactionId}
                        // traceId={"bb1f0e21882325b8"}
                        traceSummary={mockTraceSummary}
                    /> :
                    <EuiLoadingKibana size="xl" />
                }

                <EuiSpacer />
                <EuiSpacer />
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        invocationSpans: state.functionList.invocationSpans,
        invocationSpansFetching: state.functionList.invocationSpansFetching,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchInvocationSpans: (httpClient, transactionId) => dispatch(fetchInvocationSpans(httpClient, transactionId)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvocationTraceChartContainer)