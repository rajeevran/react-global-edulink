import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Prompt, Link, useHistory  } from 'react-router-dom'
import Pagination from "react-js-pagination";

import { fetchAdmin } from '../../actions/admin'
import Header from '../../components/header/Header'
import Menu from '../../components/menu/Menu'
import Footer from '../../components/footer/Footer'
import Admin  from './Admin'
import LoginForm  from '../login/LoginForm'

const AdminList = props => {
    console.log(props)

    useEffect( ()=>(
        props.fetchAdmin()
    ), [])


    const history = useHistory();
    let handlePageChange = (pageNumber) => {
        console.log(`active page is ${pageNumber}  `);
        props.fetchAdmin(undefined, pageNumber ,3)
    }

    let handlePageSearch = (e) => {
        console.log(`search name is ${e.target.value}  `);
        props.fetchAdmin(undefined, undefined ,undefined,e.target.value)
    }

    let handleClear = () => {
        console.log(`clear`);
        document.getElementById('searchinput').value=''
        props.fetchAdmin(undefined, undefined ,undefined,'')
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
                                    <h5 className="box-title">Admin Management</h5>
                                    <Link to= {{ pathname: `/admin/add` }}  >
                                            <button title="Add new" id="modal-add" className="btn btn-primary pull-right"
                                            data-target="#modal-form-Edit" data-toggle="modal">
                                            <i className="fa fa-plus"></i> Add Admin</button>
                                    </Link>
                                </div>

                                <div className="search-box">
            
                                            <input id="searchinput" placeholder="Search By Admin Name" type="search" onChange={ (e) => { handlePageSearch(e) } } className="form-control" />
                                            
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
                                                    <th style= {{ textAlign: 'center' }}>First Name</th>
                                                    <th style= {{ textAlign: 'center' }}>Last Name</th>
                                                    <th style= {{ textAlign: 'center' }}>Email</th>
                                                    <th style= {{ textAlign: 'center' }}>Status</th>
                                                    <th style= {{ textAlign: 'center' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                            {(function() {
 
                                                if (props.list.success !== false && props.list.STATUSCODE !== 4000) {

                                                    return props.list.response.docs
                                                    .map( list => <Admin key={list._id} {...list}/> );

                                                } else if (props.list.success === false && props.list.STATUSCODE === 4000){
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
                                props.list.success !== false && 
                                <Pagination
                                            activePage={props.list.response.page}
                                            itemsCountPerPage={props.list.response.limit}
                                            totalItemsCount={props.list.response.total}
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

    list:adminReducer.list
})

export default connect(mapStateToProps,{fetchAdmin})(AdminList)