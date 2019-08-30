import React, { Fragment } from 'react'

import RouteRow from '../../components/RouteRow/RouteRow'

class RoutesList extends React.Component {

    state = {
        routes: []
    }

    constructRoutes = () => {
        console.log('constructRoutes');

        this.state.routes.forEach(element => {
            console.log(element.endpoint);
        })
        
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        console.log('nextProps', nextProps);
        this.setState({routes: nextProps.routes})
        this.constructRoutes()

        // You don't have to do this check first, but it can help prevent an unneeded render
        // if (nextProps.startTime !== this.state.startTime) {
        //   this.setState({ startTime: nextProps.startTime });
        // }
      }

    render() {
        // console.log(this.state);
        
        console.log('RoutesList.js', this.props.routes);
        
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