import React, {useState, useEffect } from 'react'
import axios from 'axios';
import 'antd/dist/antd.css';

import Footer from './Footer/Footer'
import Navbar from './Navbar/Navbar'
import Homepage from '../pages/Homepage/Homepage'

const App = () => {

    return (
        <div>
            <Navbar />
            <Homepage />
            <Footer />
        </div>
    )
    
}

export default  App;