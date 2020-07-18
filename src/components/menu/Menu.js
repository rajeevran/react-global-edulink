
import React, { Component } from 'react'
import { runInThisContext } from 'vm';
import { Link, NavLink } from 'react-router-dom'

class Menu extends Component 
{

    render(){

        return (
                    <aside className="main-sidebar">
                    <div className="sidebar" >
        
                        <div className="user-panel">
        
                            <div className="pull-left image">
                                <img src="/RAJEEV/globaledulink/admin/assets/images/images.png" className="img-circle" alt="User Image"/>
                            </div>
        
                            <div className="pull-left info">
                                <p>Admin</p>
                                
                            </div>
                        </div>
        
        
                        <ul className="sidebar-menu"  style= {{ float:"left"}}>
                                            
                            <li className="treeview">
                            <NavLink
                                        to="/admin"
                                        activeStyle={{
                                        background:'black',
                                        color:'white'
                                        }} >
                                   
                                        <i className="fa fa-cubes"></i> <span>Admin Management</span>
                                        <span className="pull-right-container">
                                        </span>
                                  
                            </NavLink>                                    
                            </li> 
                            
                            <li className="treeview">
                            <NavLink
                                        to="/user"
                                        activeStyle={{
                                        background:'black',
                                        color:'white'
                                        }}  >
                                   
                                        <i className="fa fa-cubes"></i> <span>User Management &nbsp; &nbsp;</span>
                                        <span className="pull-right-container">
                                        </span>
                                  
                            </NavLink>    
                            </li>   
        
                            
                            <li className="treeview">
                            <NavLink
                                    to="/content"
                                    exact
                                    activeStyle={{
                                    background:'black',
                                    color:'white'
                                    }}>
                                    <i className="fa fa-bookmark-o"></i> <span>Content Management</span>
                                    <span className="pull-right-container">
                                    </span>
                                    
                            </NavLink>
                            
                            </li> 

                            <li className="treeview">
                                <NavLink
                                    to="/content/courses" exact
                                    activeStyle={{
                                    background:'black',
                                    color:'white'
                                    }} >
                                <i className="fa fa-graduation-cap"></i> Courses&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                                <span className="pull-right-container">
                                        </span>
                                </NavLink>
                            </li>

                            <li className="treeview">
                                <NavLink
                                    to="/content/courseDetail"
                                    exact
                                    activeStyle={{
                                    background:'black',
                                    color:'white'
                                    }} >
                                <i className="fa fa-th-list"></i> Course Detail &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                                <span className="pull-right-container">
                                        </span>
                                </NavLink>
                            </li>  

                            <li className="treeview">
                                <NavLink
                                    to="/content/courseCategory"
                                    exact
                                    activeStyle={{
                                    background:'black',
                                    color:'white'
                                    }} >
                                <i className="fa fa-th-list"></i> Course Category &nbsp; &nbsp;&nbsp; &nbsp;
                                <span className="pull-right-container">
                                        </span>
                                </NavLink>
                            </li>                                        

        
                        </ul>
                        </div>
                    </aside>
            )
        }
}


export default Menu