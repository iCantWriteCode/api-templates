import React from 'react'
import { Row, Col } from 'antd'

import './RoutesRow.css'

const RouteRow = (props) => {
    console.warn(props.data);
    
    return (
        <div className={`endpoint-row endpoint-row--${props.data.method}`}>
           <span className='endpoint-row__method' span={4}>{props.data.method}</span>
           <span className='endpoint-row__endpoint' span={20}>{props.data.URI}{props.data.endpoint}</span>
           <span className='endpoint-row__description' span={20}>{props.data.description}</span>
        </div>
    )
}

export default RouteRow;