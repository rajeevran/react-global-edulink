import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Prompt, Link, useHistory } from 'react-router-dom'
import Pagination from "react-js-pagination";

import { fetchUser } from '../../actions/admin'
import Header from '../header/Header'
import Menu from '../menu/Menu'
import Footer from '../footer/Footer'
import User  from './User'

const UserList = props => {
    console.log(props)
    useEffect( ()=>(
        props.fetchUser()
    ), [])
    let history = useHistory()
    let handlePageChange = (pageNumber) => {
        console.log(`active page is ${pageNumber}  `);
        props.fetchUser(undefined, pageNumber ,3)
    }

    let handlePageSearch = (e) => {
        console.log(`search name is ${e.target.value}  `);
        props.fetchUser(undefined, undefined ,undefined,e.target.value)
    }

    let handleClear = () => {
        console.log(`clear`);
        document.getElementById('searchinput').value=''
        props.fetchUser(undefined, undefined ,undefined,'')
    }

    return ( 
        <div className="wrapper">
            <Header />
            <Menu />
           <div className="content-wrapper" style={{minHeight:'0px'}}>
                <section className="content-header">
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box">
                                <div className="box-header">
                                    <h5 className="box-title">User Management</h5>
                                    <Link to= {{ pathname: `/user/add` }}  >
                                            <button title="Add new" id="modal-add" className="btn btn-primary pull-right"
                                            data-target="#modal-form-Edit" data-toggle="modal">
                                            <i className="fa fa-plus"></i> Add User</button>
                                    </Link>
                                </div>

                                <div className="search-box">
            
                                            <input id="searchinput" placeholder="Search By User Name" type="search" onChange={ (e) => { handlePageSearch(e) } } className="form-control" />
                                            
                                            <span id="searchclear" className="glyphicon" onClick={ ()=> {handleClear()}}>
                                                <i className="fa fa-times"></i>
                                            </span>

                                </div>

                                <div className="box-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered  table-condensed table-hover">
                                            <thead>
                                                <tr>
                                                    <th style= {{ textAlign: 'center' }}>Profile Image</th>
                                                    <th style= {{ textAlign: 'center' }}>Full Name</th>
                                                    <th style= {{ textAlign: 'center' }}>User Name</th>
                                                    <th style= {{ textAlign: 'center' }}>Email</th>
                                                    <th style= {{ textAlign: 'center' }}>Status</th>
                                                    <th style= {{ textAlign: 'center' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {(function() {
 
                                                    if (props.userList.success !== false && props.userList.STATUSCODE !== 4000) {

                                                        return props.userList.response.docs
                                                        .map( userList => <User key={userList._id} {...userList}/> );

                                                    } else if (props.userList.success === false && props.userList.STATUSCODE === 4000){
                                                        return  history.push('/login')
                                                    }
                                                    })
                                             ()}

                                           </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
            
                        <div className="col-xs-12">
                            <div className="pagination-center">
                            { 
                                props.userList.success !== false && 
                                <Pagination
                                            activePage={props.userList.response.page}
                                            itemsCountPerPage={props.userList.response.limit}
                                            totalItemsCount={props.userList.response.total}
                                            pageRangeDisplayed={5}
                                            onChange={handlePageChange}
                                />
      
                            }
                            </div>
                            
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
   
  
        </div>
    )
}

const mapStateToProps = ({adminReducer}) => ({

    userList:adminReducer.userList
})

export default connect(mapStateToProps,{fetchUser})(UserList)