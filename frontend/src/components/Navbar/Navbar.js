import React from 'react'
import { Row, Col, Button } from 'antd';

import './Navbar.css'

const Navbar = () => {
    
    return (
        <Row className='navbar' type="flex" align="middle" justify="space-between" style={{ }}>
            <Col span={8}>Mock server</Col>
            <Col span={8} style={{textAlign:'center'}}>
                <Button type="primary" icon="download"> Add New Route </Button>
            </Col>
            <Col span={8} style={{textAlign:'right'}}>Contact Author</Col>
        </Row>
    )
}

export default Navbar