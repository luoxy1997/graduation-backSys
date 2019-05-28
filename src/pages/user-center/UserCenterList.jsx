import React, {Component} from 'react';
import {Table} from 'antd';
import FixBottom from '@/layouts/fix-bottom';
import {
    QueryBar,
    QueryItem,
    ToolItem,
    Pagination,
    Operator,
    ToolBar,
} from "@/library/antd";
import {Form, Select, Icon, Input, message, Upload, Button, Modal, Row, Col} from 'antd';

import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import UserCenterEdit from './UserCenterEdit';
import notify from './notify';


const Option = Select.Option;
const {TextArea} = Input;
@Form.create()

@config({
    path: '/user-center',
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
    };

    handleChange2 = (value) => {
        console.log(`selected ${value}`);
    };

    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    //选择文件
    changePath = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }
        let src, preview, type = file.type;
        if (/^video\/\S+$/.test(type)) {
            src = URL.createObjectURL(file)
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                preview = <video src={src} autoPlay loop controls/>
                this.setState({path: file.name, file: reader.result, preview: preview})
            };
        } else {
            this.setState({path: '', file,})
            notify('error', '只允许上传视频！');
            return false
        }
    };

    // 上传文件
    upload = () => {

        const data = this.state.data;
        if (!data) {
            console.log('未选择文件');
            return;
        }

        //此处的url应该是服务端提供的上传文件api
        const url = 'http://localhost:3000/api/upload';
        const form = new FormData();

        //此处的file字段由上传的api决定，可以是其它值
        form.append('file', data);

        fetch(url, {
            method: 'POST',
            body: form
        }).then(res => {
            console.log(res)
        })
    }

    //关闭模态框
    cancel = () => {
        this.props.closeOverlay();
    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    beforeUpload = (file) => {
        console.log(file);
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isGIF = file.type === 'image/gif';
        const isPic = isJPG || isPNG || isGIF;
        if (!isPic) {
            message.error('你只能上传jpg,png,gif文件!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('文件上传不能大于2MB!');
            return false;
        }
        this.getBase64(file, base64 => {
            // TODO 发请求 将base64 数据传递给后端
            this.setState({videoImage: base64});
        });
        this.setState({videoImage: file});
    };
    handleSubmit = () => {
        console.log('dsdsds');
        this.props.form.validateFieldsAndScroll((err, value) => {
            if (!err) {
                const {videoImage, file} = this.state;
                let uuid = sessionStorage.getItem('uuid');
                this.props.ajax.post('/commodity/opera/uploadCommodity', {...value, uuid: 1});
                this.props.ajax.post('/commodity/opera/uploadUpdateCommodity', {commodityImg: videoImage, commodityVideo: file});

            }
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {previewVisible, previewImage, fileList} = this.state;
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

        return (
            <PageContent>
                <div className="right-container">
                    <div className="right-title">
                        <h2>上传积分课程</h2>
                    </div>
                    <div className="personalMsg">
                        <div className="title">作品信息</div>
                        <Form style={{width: '800px', marginTop: '20px', marginLeft: '80px'}}>
                            <Form.Item
                                {...formItemLayout}
                                label="作品名称"
                            >
                                {getFieldDecorator('commodityName', {
                                    rules: [{
                                        required: true, message: 'Please input your E-mail!',
                                    }],
                                })(
                                    <Input/>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="作品类型"
                            >
                                {getFieldDecorator('commodityKind', {
                                    rules: [{
                                        required: true, message: 'Please input your E-mail!',
                                    }],
                                })(
                                    <Select defaultValue="study" style={{width: 210}} onChange={this.handleChange2}>
                                        <Option value="study">study</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="课程积分"
                            >
                                {getFieldDecorator('commodityCredits', {
                                    rules: [{
                                        required: true, message: 'Please input your E-mail!',
                                    }],
                                })(
                                    <Input style={{width: 210}} addonAfter={'积分'}/>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="课程介绍"
                            >
                                {getFieldDecorator('commodityRemark', {
                                    rules: [{
                                        required: true, message: 'Please input your E-mail!',
                                    }],
                                })(
                                    <TextArea rows={4}/>
                                )}
                            </Form.Item>

                        </Form>
                    </div>
                    <div className="personalMsg">
                        <div className="title">上传文件</div>
                        <Row>
                            <Col span={6}>
                                <div style={{paddingTop: '25px', paddingLeft: '5px'}}>
                                    <input type='file' accept='video/*,image/*,text/plain' onChange={this.changePath} style={{float: 'left'}}/>
                                </div>
                            </Col>
                        </Row>


                    </div>
                    <div className="personalMsg">
                        <div className="title" style={{marginBottom: '20px'}}>上传封面</div>
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={(file) => this.beforeUpload(file)}
                        >
                            {this.state.videoImage ? (
                                <img src={this.state.videoImage} alt="" width="100%"/>
                            ) : (
                                <div>
                                    <Icon type="plus"/>
                                    <div className="ant-upload-text">Upload</div>
                                </div>
                            )}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{width: '100%'}} src={previewImage}/>
                        </Modal>
                    </div>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <Button type="primary" onClick={this.handleSubmit} size="large" style={{paddingRight: '30px'}}> <Icon type="rocket" style={{paddingRight: '5px'}}/>立即发布</Button>
                    </div>
                </div>
            </PageContent>
        );
    }
}
