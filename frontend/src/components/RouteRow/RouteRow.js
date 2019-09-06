import React, { Fragment } from 'react'
import axios from 'axios'
import './RoutesRow.css'

import { Icon, Button, Modal, Row, Col, Input, Select, Form, Checkbox } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

class RouteRow extends React.Component {
    
    state = {
        expanded: false,
        response: '',
        visible: false,
        logic: [
            { active: true, requestVariable:'', operator: '', value:'', response: '' }
        ],
        responsesArray: []
    }
    expand = () => {
        this.setState({ expanded: !this.state.expanded })
    }
  
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    
    handleOk = e => {
        console.log(this.state.logic);
        console.log(this.props.data);
        axios
            .post('http://localhost:9000/routeCreator/add-rules-to-route', { logic : this.state.logic, data: this.props.data})
            .then(res => {
                console.warn(res.data);
            })
            .catch(err => {
                console.warn(err);
            })
    };
    
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    addNewRule = () => {
        let logic = this.state.logic
        logic.push({})
        this.setState({logic: logic})
    }
    inputChange = e => {
        console.warn(e.target.value);
    }
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    handelInputChange = e => {
        console.warn(e.target.value);
        
    }
    handleSubmit = e => {
        e.preventDefault();
        console.warn('handleSubmit');
    }
    handleInputChange = (i, e) => {
        let test = this.state.logic
        test[i][e.target.name] = e.target.value
        this.setState({logic: test})
    }
    handleSelectChange = (index, value) => {
        let test = this.state.logic
        test[index].operator = value
        this.setState({logic: test})
    }
    handleCheckboxChange = (index, event) => {
        let test = this.state.logic
        test[index].active = event.target.checked
        this.setState({logic: test})
    }
    autoPopulate = () => {
        let fields = [
            {active: true, requestVariable:'policyType', operator: '=', value:'Individual', response: '{"policyType":"Individual"}' },
            {active: true, requestVariable:'policyType', operator: '=', value:'Group', response: '{"policyType":"Group"}' },
        ]
        this.setState({logic: fields})
    }

    onChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
    }

    showResponses = value => {
        let tempArr = this.state.responsesArray
        let index = tempArr.indexOf(value)

        if (index === -1 ) tempArr.push(value) 
        else tempArr.splice(index, 1)

        this.setState({ responsesArray: tempArr  })
    }

    render() {
        console.log(this.props.data);

        return (
            <Fragment>
                <div className={`endpoint-row endpoint-row--${this.props.data.method} ${this.state.expanded ? 'expanded' : ''}`}>
                    <div className="p-relative"  onClick={this.expand}>
                        <span className='endpoint-row__method' span={4}>{this.props.data.method}</span>
                        <span className='endpoint-row__endpoint' span={20}>{this.props.data.URI}{this.props.data.endpoint}</span>
                        <span className='endpoint-row__description' span={20}>{this.props.data.description}</span>
                        <Icon type="up" className="endpoint-arrow"/>
                    </div>
                    { this.state.expanded ? 
                        <div>
                            <br/>
                            <br/>
                            <Button type="primary" icon="plus" onClick={this.showModal}> Add Response Logic </Button>
                            <br/>
                            <br/>
                            <h3>Posible Requests: </h3>

                            {/* Handle all the responses */}
                            { this.props.data.possibleResponses.map((response, index) => {
                                return (
                                    <Button 
                                        size='large' 
                                        key={index} 
                                        style={ this.state.responsesArray.includes(response.condition) ? {backgroundColor: 'skyblue'} : {backgroundColor: 'white'} }
                                        onClick={() => this.showResponses(response.condition)}
                                    >
                                        {response.condition}
                                    </Button>
                                )
                            })}
                            <hr/>
                            { this.props.data.possibleResponses.map((response, index) => { 
                                if (this.state.responsesArray.includes(response.condition) ) {
                                    return (
                                        <div key={index}> 

                                            <h3>{response.condition} Response: </h3>
                                            <pre>
                                                {JSON.stringify(response.response, null, 2)}
                                            </pre>   

                                        </div>
                                    )
                                } 
                            })}

                             
                        </div> 
                    : null }
                    
                </div>

                <Modal
                    title="Add Logic"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={800}
                    okText={'Save Changes'}
                >   
                    <div>
                        <Button type="primary" icon="plus" onClick={this.addNewRule}>
                            Add New Rule
                        </Button>
                        <Button type="primary" icon="plus" onClick={this.autoPopulate}>
                            Auto Populate Fields
                        </Button>
                    </div>
                    <br/>
                    {this.state.logic.map((logic, i) => {
                        return (
                            <Form key={i} onSubmit={this.handleSubmit}>
                                <hr/>
                                <Row gutter={16} type="flex" >
                                    <Col>
                                        <h4>Active</h4>
                                        <Checkbox
                                            name="active" onChange={(e) => this.handleCheckboxChange(i, e)} value={this.state.logic[i].active}
                                            checked={this.state.logic[i].active}
                                        ></Checkbox>
                                    </Col>
                                    <Col>
                                        <h4>Request Variable</h4>
                                        <Input name="requestVariable" onChange={(e) => this.handleInputChange(i, e)} value={this.state.logic[i].requestVariable} placeholder="e.g policyType" />
                                    </Col>
                                    <Col>
                                        <h4>Operator</h4>
                                        <Select
                                            onChange={(e) => this.handleSelectChange(i, e)} value={this.state.logic[i].operator}
                                            style={{width:'100px'}}
                                            placeholder="Select a person"
                                        >
                                            <Option value="=">=</Option>
                                            <Option value="!=">!=</Option>
                                        </Select>
                                    </Col>
                                    <Col>
                                        <h4>Value</h4>
                                        <Input name="value" onChange={(e) => this.handleInputChange(i, e)} value={this.state.logic[i].value} placeholder="e.g Individual" />
                                    </Col>
                                    <Col span={24}>
                                        <h4>Response</h4>
                                        <TextArea name="response" onChange={(e) => this.handleInputChange(i, e)} value={this.state.logic[i].response} rows={4}  placeholder="{ 
                                                'test':1,
                                                'test2':'test'
                                                }" />
                                    </Col>
                                    {/* <Col span={24} className="text-right">
                                        <Button type="primary" htmlType="submit">
                                            Add
                                        </Button>
                                    </Col> */}

                                </Row>
                            </Form>
                        )
                    })}
                </Modal>
            </Fragment>
        )
    }
}

export default Form.create()(RouteRow);