import React from 'react'

import RoutesList from '../../components/RoutesList/RoutesList'

import './Homepage.css'

const Homepage = (props) => {
    
    return (
        <div className='homepage'>
            <RoutesList routes={props.routes} />
        </div>
    )
}

export default Homepage