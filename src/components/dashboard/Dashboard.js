
import React, { Component, Fragment } from 'react'
import { runInThisContext } from 'vm';
import Header from '../../components/header/Header'
import Menu from '../../components/menu/Menu'
import Footer from '../../components/footer/Footer'
class Dashboard extends Component 
{

    render(){

        return (
                <Fragment>
                                        <Header />
                                        <Menu />
                                <div className="login-logo" style={ {'marginBottom': '370px',
                                                                    'marginTop': '133px'}}>
                                    <p>
                                        <b>Welcome To Global EduLink</b> Admin
                                   </p>
                                </div>
                           
                </Fragment>
            )
        }
}


export default Dashboard