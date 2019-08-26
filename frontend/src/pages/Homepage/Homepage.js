import React, {useState, useEffect } from 'react'
import axios from 'axios';

import RouteRow from '../../components/RouteRow/RouteRow'

import './Homepage.css'
const Homepage = () => {
    
    const [routes, setRoutes] = useState({routes:[]});

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                'http://localhost:9000/getRoutes',
            );
            setRoutes(result.data)
        };
        fetchData();
    }, []);

    return (
        <div className='homepage'>
              {routes.routes.map((item, i) => (
                <RouteRow key={i} data={item}  />
            ))}
        </div>
    )
}

export default Homepage