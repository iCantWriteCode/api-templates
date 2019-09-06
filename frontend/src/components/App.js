import React, {useState, useEffect } from 'react'
import 'antd/dist/antd.css';

import axios from 'axios';

import Footer from './Footer/Footer'
import Navbar from './Navbar/Navbar'
import Homepage from '../pages/Homepage/Homepage'

import '../styles/bootstrap.css'

const App = () => {

    const [routes, setRoutes] = useState([]);
    
    // Getting data on component did mount
    useEffect(() => {
      const fetchData = async () => {
        const result = await axios(
          'http://localhost:9000/getRoutes',
        );
        setRoutes(result.data.routes);
      };
      fetchData();
    }, []);

    const getRoutes = () =>  {
        axios
            .get(`http://localhost:9000/getRoutes`)
            .then(res => { 
                console.log('App.js', res);
                setRoutes(res.data.routes)
            })
            .catch(err => console.warn('Could not fetch routes',err) )
    }

    return (
        <div>
            <Navbar  getRoutes={getRoutes} />
            <Homepage routes={routes} />
            <Footer />
        </div>
    )
    
}

export default  App;