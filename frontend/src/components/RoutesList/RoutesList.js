import React, { Fragment } from 'react'

import RouteRow from '../../components/RouteRow/RouteRow'

import {Row, Col } from 'antd'
 import './RoutesList.css'
class RoutesList extends React.Component {

    state = {
        routes: [],
        modules: ['All'],
        categories: [],
        filteredData: [],
        activeFilter:'All'
    }

    constructRoutes = (routes) => {

        let modules     = this.state.modules
        let categories  = []

        routes.forEach(element => {
            if ( !modules.includes(element.module)) modules.push(element.module)
            if ( !categories.includes(element.category)) categories.push(element.category)
        });
        
        this.setState({modules: modules})
        this.setState({categories: categories})
        this.setState({filteredData: routes})
        
    }

    componentWillReceiveProps(nextProps) {
        this.setState({routes: nextProps.routes})
        this.constructRoutes(nextProps.routes)
    }

    filterData = routeModule => {
        let filteredData 
        if (routeModule !== 'All') {
            filteredData = this.state.routes.filter( route => {
                return route.module === routeModule
            })
        } else filteredData = this.state.routes
        
        this.setState({filteredData: filteredData})
        this.setState({activeFilter: routeModule})

        
    }

    render() {
        // console.log(this.state);
        
        console.log('RoutesList.js', this.props.routes);
        
        return (
            <Fragment>
                <Row gutter={16}>
                    <Col span={24}> 
                        <h3>Modules</h3>
                    </Col>
                    {this.state.modules.map((item, i) => {
                        return (
                                <Col  span={8} key={i} className={this.state.activeFilter === item ? 'active' : ''}> 
                                    <div className="box" onClick={() => this.filterData(item)}>
                                        {item}
                                    </div>
                                </Col>
                        )
                    })}
                </Row>
              
                <h4>Total Endpoints ({this.state.filteredData.length})</h4>
                 { this.state.filteredData.map((item, i) => (
                    <RouteRow key={item.id} data={item}  />
                )) }
            </Fragment>
        )
    }
    
}


export default RoutesList