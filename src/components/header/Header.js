
import React, { Component, Fragment } from 'react'
import { runInThisContext } from 'vm';
import { postLoginOutAdmin } from '../../actions/admin'
import { Redirect, Link, withRouter } from 'react-router-dom'
class Header extends Component 
{

    state= {
        logout:false
    }

    onClickLogOut = (e) => {

        postLoginOutAdmin()
        this.setState({logout:true})
    }

    

    render(){

        const { logout } = this.state

        if(logout) 
        {
            console.log('logout enter--------');
 
            return (<Redirect to="/login" push={true} />)
        }
        return (

                 <Fragment>
                        <div id="overlay" style={{ position: 'fixed' , width: '100%', height: '100%', top: 0, left: 0, right: 0, bottom: 0, 
                        'backgroundColor': 'rgba(0,0,0,0.5)', zIndex: 2, cursor: 'pointer',  display: 'none'  }}>
                        <i className="fa fa-spinner fa-4x" aria-hidden="true" style={{'marginLeft': '48%', 'marginTop': '20%'}}></i>
                        </div>
            
                        <header className="main-header" >
                            <a  className="logo">
                            
                            <span className="logo-mini">Global EduLink</span>
                            
                            <span className="logo-lg"><b>Global EduLink</b> Admin</span>
                        </a>
                        
                        <nav className="navbar navbar-static-top">
                            
                            <a href="javascript:;" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </a>
            
                            <div className="navbar-custom-menu">
                                <ul className="nav navbar-nav">
                                    <li className="dropdown user user-menu">
                                        <a className="dropdown-toggle" data-toggle="dropdown">
                                            <span className="hidden-xs">Welcome Admin</span>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li className="user-footer">
                                                <Link to="/changepassword">
                                                <div className="pull-left">
                                                    <span className="btn btn-default btn-flat">Change
                                                        Password </span>
                                                </div>
                                                </Link>
                                                <div className="pull-right">
                                                    <a className="btn btn-default btn-flat" onClick={ this.onClickLogOut}  >Sign out</a>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </header>
                </Fragment>
            )
        }
}


export default Header