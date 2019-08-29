import React, { Fragment } from 'react'

import axios from 'axios';


import RouteRow from '../../components/RouteRow/RouteRow'


class RoutesList extends React.Component {

    state = {
        routes:[]
    }

    componentDidMount() {
        this.getRoutes()
    }

    getRoutes = () =>  {
        axios
            .get(`http://localhost:9000/getRoutes`)
            .then(res => { 
                this.setState({ routes: res.data.routes })
            })
            .catch(err => {  console.warn(err) })
    }

    render() {
        return (
            <Fragment>
                 { this.state.routes.map((item, i) => (
                    <RouteRow key={i} data={item}  />
                )) }
            </Fragment>
        )
    }
    
}


export default RoutesList