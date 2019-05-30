import React, {Component} from 'react';
import ReactEchart from 'echarts-for-react';
import {Row, Col, Icon, DatePicker, Button, Form, Input} from 'antd';

import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import DataBlock from '@/components/data-block';
import './style.less';
import svg from './svg.png'
import {ajaxHoc} from "../../commons/ajax";
import  notify from './notify'
const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
@ajaxHoc()
@config({
    path: '/',
    title: {local: 'home', text: '首页', icon: 'home'},
    breadcrumbs: [{key: 'home', local: 'home', text: '首页', icon: 'home'}],
})
@Form.create()

export default class Home extends Component {
    constructor(...props) {
        super(...props);
        this.props.ajax.get('/manager/opera/getOperaData')
            .then(res => {
                const title = res.data.map(item => item.remark);
                const value = res.data.map(item => item.value)
                this.setState({title, value})
            });
        this.props.onComponentWillShow(() => {
            this.setState({
                users: 86800,
                read: 200,
                like: 666,
                warning: 28,
                start: 168,
                data: []
            });
        });

        this.props.onComponentWillHide(() => {
            this.setState({
                users: 0,
                read: 0,
                like: 0,
                warning: 0,
                start: 0,
            });
        });
    }

    state = {
        users: 868,
        read: 200,
        like: 666,
        warning: 28,
        start: 168,
    };
    handleOk = () => {
        this.props.form.validateFieldsAndScroll((err, value) => {
            if (!err) {
                const activeStartData = value.time && value.time.length && value.time[0].format('YYYY-MM-DD');
                const activeEndData = value.time && value.time.length && value.time[1].format('YYYY-MM-DD');
                const params = {
                    activeStartData: activeStartData,
                    activeEndData: activeStartData,
                    userId: 2,
                    activeDiscount: parseInt(value.activeDiscount)
                }
                this.props.ajax.post('/manager/opera/setActive', params)
                    .then(() => {
                        notify('success','设置折扣成功')
                    })
            }
        })
    }
    getPieOption = () => {
        return {
            title: {
                text: '访问来源',
                left: 'center',
                top: 20,
            },

            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            toolbox: {
                // y: 'bottom',
                feature: {
                    dataView: {},
                    saveAsImage: {
                        pixelRatio: 2
                    }
                }
            },

            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 274, name: '联盟广告'},
                        {value: 235, name: '视频广告'},
                        {value: 400, name: '搜索引擎'}
                    ].sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    roseType: 'radius',
                    labelLine: {
                        normal: {
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        }
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };
    };

    getBarOption = () => {
        const xAxisData = [];
        const data1 = [];
        const data2 = [];
        for (let i = 0; i < 100; i++) {
            xAxisData.push('产品' + i);
            data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
            data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
        }

        return {
            title: {
                text: '月下载量'
            },
            legend: {
                data: ['上个月', '本月'],
                align: 'left'
            },
            toolbox: {
                // y: 'bottom',
                feature: {
                    magicType: {
                        type: ['stack', 'tiled']
                    },
                    dataView: {},
                    saveAsImage: {
                        pixelRatio: 2
                    }
                }
            },
            tooltip: {},
            xAxis: {
                data: xAxisData,
                silent: false,
                splitLine: {
                    show: false
                }
            },
            yAxis: {},
            series: [
                {
                    name: '上个月',
                    type: 'bar',
                    data: data1,
                    animationDelay: function (idx) {
                        return idx * 10;
                    }
                },
                {
                    name: '本月',
                    type: 'bar',
                    data: data2,
                    animationDelay: function (idx) {
                        return idx * 10 + 100;
                    }
                }],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            }
        };
    };

    getBar2Option = () => {
        return {
            title: {
                text: '热销商品分析',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['最高气温']
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.state.title
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: '热销商品',
                    type: 'line',
                    data: this.state.value,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };
    }

    render() {
        const {
            users,
            read,
            like,
            warning,
            start,
        } = this.state;

        const colStyle = {
            border: '1px solid #e8e8e8',
            borderRadius: '5px',
            padding: 8,
            position: 'relative',
            width: '100%',
            height: 200

        };
        return (
            <PageContent styleName="root">
                <div styleName="statistics">
                    <DataBlock
                        color="#1890FF"
                        count={users}
                        tip="用户总数"
                        icon="user-add"
                    />
                    <DataBlock
                        color="#FAAD14"
                        count={read}
                        tip="会员总数"
                        icon="area-chart"
                    />
                </div>


                <div style={{...colStyle, marginTop: 16, height: 350}}>
                    <ReactEchart option={this.getBar2Option()}/>
                </div>
                <Row style={{marginTop: 16}}>
                    <Col span={24} >
                        <div style={colStyle} className="colStyle">
                            <h3 style={{paddingBottom: '20px'}}><Icon type="setting"/> 设置假日：</h3>
                            <div style={{paddingBottom: 10}}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Item label="设置日期" style={{float:'left',marginRight:'50px'}}
                                    >
                                        {this.props.form.getFieldDecorator('time', {
                                            rules: [{required: true}],
                                        })(
                                            <RangePicker showTime format="YYYY-MM-DD"/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="设置折扣" style={{float:'left',marginRight:'50px'}}
                                    >
                                        {this.props.form.getFieldDecorator('activeDiscount', {
                                            rules: [{required: true}],
                                        })(
                                            <Input placeholder="请输入设置的折扣" style={{width: '250px'}} suffix={<Icon type="percentage"/>}/>
                                        )}
                                    </Form.Item>
                                    <Button type="primary" style={{marginTop:'45px',marginLeft: '40px', position: 'relative', zIndex: 100}} onClick={this.handleOk}>确认设置</Button>

                                </Form>
                            </div>
                            <img src={svg} alt="" tit="" width={200} style={{position: 'absolute', right: '-30px', bottom: '0'}}/>
                        </div>
                    </Col>
                </Row>
            </PageContent>
        );
    }
}
