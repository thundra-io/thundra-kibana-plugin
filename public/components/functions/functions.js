import React from 'react';
import {
    EuiBasicTable,
    EuiLink,
    EuiHealth,
    EuiSpacer,
    EuiSwitch,
    EuiCode
} from '@elastic/eui';


export class Functions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            functions : [],
            pageIndex: 0,
            pageSize: 5,
            showPerPageOptions: true
        };
    }

    onTableChange = ({ page = {} }) => {
        const {
            index: pageIndex,
            size: pageSize,
        } = page;

        this.setState({
            pageIndex,
            pageSize,
        });
    };

    togglePerPageOptions = () => this.setState((state) => ({ showPerPageOptions: !state.showPerPageOptions }));

    componentWillMount() {
        const {httpClient} = this.props;
        httpClient.get('../api/thundra/functions').then((resp) => {
            console.log(resp.data.functions);
            this.setState({functions: resp.data.functions});
        });
    }

    componentDidMount() {
    }

    columns = [
        {
            field: 'key',
            name: 'Application Name',
            sortable: true
        },
        {
            field: 'doc_count',
            name: 'Count',
            sortable: true
        }
    ];

    render() {
        const {title} = this.props;
        const {
            pageIndex,
            pageSize,
            showPerPageOptions
        } = this.state;

        const  totalItemCount = this.state.functions.length;
        const pagination = {
            pageIndex,
            pageSize,
            totalItemCount,
            pageSizeOptions: [3, 5, 8],
            hidePerPageOptions: !showPerPageOptions
        };

        return (
            <div>
                <EuiSwitch
                    label={<span>Hide per page options with <EuiCode>{pagination.hidePerPageOptions = true}</EuiCode></span>}
                    onChange={this.togglePerPageOptions}
                />
                <EuiSpacer size="xl" />
                <EuiBasicTable
                    items={this.state.functions}
                    pagination={this.pagination}
                    columns={this.columns}
                    onChange={this.onTableChange}
                />
            </div>
        );
    }
}
