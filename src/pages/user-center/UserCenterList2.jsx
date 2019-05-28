import React, {Component} from 'react';
import {Table} from 'antd';
import FixBottom from '@/layouts/fix-bottom';
import moment from 'moment';
import {Form, Select, Icon, Input, message, Pagination, Tag, Modal, Row, Col} from 'antd';

import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import UserCenterEdit from './UserCenterEdit';
import notify from './notify';


const Option = Select.Option;
const {TextArea} = Input;
@Form.create()

@config({
    path: '/user-center2',
    ajax: true,
})
export default class UserCenterList extends Component {
    state = {
        visible: false,
        previewVisible: false,
        previewImage: '',
        fileList: [{
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
        videoImage: null,
        imgFile: null,
        current: 'mail',
        userLogin: false,
        userNickName: '抹茶儿',
        loading: true,
        pageSize: 10,
        pageNum: 1,
        total: 0,
    };
    handleSearch = (args = {}) => {
        const {
            pageSize = this.state.pageSize,
            pageNum = this.state.pageNum,
        } = args;
        this.setState({loading: true})
        this.props.ajax.get(`/customer/order/queryReturnOrderInfo?pageNum=${pageNum}&pageSize=${pageSize}`)
            .then(res => {
                console.log(res.data.list);
                this.setState({commodities: res.data.list, total: res.data.total, pageSize: res.data.pageSize, pageNum: res.data.pageNum})
            })
            .finally(() => {
                this.setState({loading: false})
            })

    }
    handleReturn = (record) => {
        this.props.ajax.post('customer/order/updateOrder', {orderState: 2, uuid: record.orderId})
            .then(res => {
                notify('success', '审批通过')
            })
    }

    componentWillMount() {
        this.handleSearch();
    }

    // 默认获取数据分页
    changePage = (pageNum) => {
        //塞数据
        this.setState({pageNum: pageNum});
        //塞数据后立即执行函数并使用数据时，会产生异步，此时我们获取不到最新的值，所以我们这个时候传参
        this.handleSearch({pageNum: pageNum});
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {pageNum, total, pageSize} = this.state;
        const props = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18},
            },
        };
        const columns = [
            {
                title: '商品名称',
                dataIndex: 'commodityName',
                render: text => <a href="javascript:;">{text}</a>,
            },
            {
                title: '订单编号',
                dataIndex: 'orderId',
            },
            {
                title: '商品类别',
                dataIndex: 'commodityKind',
            },
            {
                title: '用户ID',
                dataIndex: 'orderId',
            },
            {
                title: '操作',
                render: (record) => <Tag color="red" onClick={() => this.handleReturn(record)}>同意退货申请</Tag>,
                align: 'center'
            },
        ];
        return (
            <PageContent>
                <Table columns={columns} dataSource={this.state.commodities} loading={this.state.loading}
                       loading={this.state.loading}
                       pagination={false}
                       rowKey={(record) => record.commodityCode}
                />
                <Pagination
                    current={pageNum}//当前的页数
                    total={total}//接受的总数
                    pageSize={pageSize}//一页的条数
                    onChange={this.changePage}//改变页数
                    showQuickJumper//快速跳转
                    showTotal={total => `共 ${total}条`}//共多少条
                    style={{textAlign: 'center', marginTop: '20px'}}
                />
            </PageContent>
        );
    }
}
