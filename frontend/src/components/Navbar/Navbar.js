import React, {Fragment} from 'react'
import { Row, Col, Button, Modal, Form, Icon, Input , Select } from 'antd';
import axios from 'axios';

import './Navbar.css'
const { Option } = Select;
const { TextArea } = Input;

class Navbar extends React.Component  {
    state = { visible: false };

    showModal = () => this.setState({visible: true}) 
    handleOk = e =>  this.setState({visible: false})
    handleCancel = e =>  this.setState({visible: false}) 

    handleRegister = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
            if (err) return console.error('err',err)

            values.response = values.response.replace(/(\r\n|\n|\r)/gm,"")
            values.response = JSON.parse(values.response)

            axios
                .post(`http://localhost:9000/routeCreator/add-new-route`, { ...values })
                .then((res) => {
                    console.log(res)
                })
                .catch(err => {
                    console.warn(err);
                })
		});
	};


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Fragment>
                <Row className='navbar' type="flex" align="middle" justify="space-between" style={{ }}>
                    <Col span={8}>Mock server</Col>
                    <Col span={8} style={{textAlign:'center'}}>
                        <Button type="primary" icon="download" onClick={this.showModal}> Add New Route </Button>
                    </Col>
                    <Col span={8} style={{textAlign:'right'}}>Contact Author</Col>
                </Row>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form className="login-form" onSubmit={this.handleRegister}>
                        <Form.Item label="Endpoint">
                            {getFieldDecorator('endpoint', {
                                rules: [ { required: true, message: 'Please provide an endpoint!' } ]
                            })(
                                <Input
                                    size="large"
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="/URI/endpoint"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Method">
                            {getFieldDecorator('method', {
                                rules: [ { required: true, message: 'Please select a method!' } ]
                            })(
                                <Select
                                    size="large"
                                    placeholder="Method"
                                    style={{ display: 'block' }}
                                    onChange={this.handleChange}
                                >
                                    <Option value="post">Post</Option>
                                    <Option value="get">Get</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="Version">
                            {getFieldDecorator('version')(
                                <Input
                                    size="large"
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="v1"
                                />
                            )} 
                        </Form.Item>
                        <Form.Item label="Description">
                            {getFieldDecorator('description')(
                                <Input
                                    size="large"
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Claim Presentation Service"
                                />
                            )} 
                        </Form.Item>
                        <Form.Item label="Response">
                            {getFieldDecorator('response')(
                                <TextArea 
                                    rows={4}
                                    
                                    placeholder="{ 
                                        'test':1,
                                        'test2':'test'
                                        }"
                                />
                            )} 
                        </Form.Item>
                        <Form.Item>
                            <Button size="large" type="primary" htmlType="submit" className="login-form-button">
                                Register
                            </Button>
                        </Form.Item>
					</Form>
                </Modal>
            </Fragment>
            
        )
    }
    
}

export default Form.create()(Navbar)