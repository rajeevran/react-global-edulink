import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Prompt, Link, useHistory } from 'react-router-dom'
import Pagination from "react-js-pagination";
import { fetchCourses } from '../../../actions/content/course'
import { baseUrl, localUrl } from '../../../shared/baseUrl'

import Header from '../../header/Header'
import Menu from '../../menu/Menu'
import Footer from '../../footer/Footer'
import './CourseList.css';
const CourseList = props => {
    useEffect( ()=>(
        props.fetchCourses()
    ), [])

    console.log('CONTENT PORPS---->',props)
    const history = useHistory()
    return ( 
        <div className="wrapper">
           <Header />
           <Menu />
           <div className="content-wrapper" >
                <section className="content-header">
                </section>
                <section className="content">
                    <div className="row">
                         <div className="col-xs-12">
                            <div className="box">
                                <div className="box-header">
                                    <h5 className="box-title">Course Management</h5>
                                    <Link to= {{ pathname: `/content/courses/add` }}  >
                                            <button title="Add new" id="modal-add" className="btn btn-primary pull-right"
                                            data-target="#modal-form-Edit" data-toggle="modal">
                                            <i className="fa fa-plus"></i> Add Course</button>
                                    </Link>
                                </div>

                                {(function() {
    
                                    if (props.list.success !== false && props.list.STATUSCODE !== 4000) {

                                        return props.list.response.docs
                                        .map( list => (
                                    
                                                <div key={list._id} className="row" className = "col-md-3 col-sm-6 col-xs-6">
                                                
                                              
                                                <div className="cat_box" style={{backgroundImage:`url(${baseUrl}${list.courseImage})` }}>
                                                    <span  className="content">
                                                        <h3>{list.courseName}</h3>
                                                        
                                                    </span>
                                                </div>
                                                <Link to= {{ pathname: `/content/courses/edit/${list._id}` }}  >
                                                <button type="button" className="btn btn-primary" style={{ marginRight:'10px'}} > Edit</button>
                                                </Link>
                                                <Link to= {{ pathname: `/content/courses/delete/${list._id}` }}  >
                                                <button type="button" className="btn btn-primary"  > Delete</button>

                                                </Link>

                                                </div>


                                        )
                                        )
                                    } else if (props.list.success === false && props.list.STATUSCODE === 4000){
                                        return  history.push('/login')
                                    }
                                })
                                ()}

                            </div>
                        </div>
               </div>
            </section>
        </div>
           <Footer />
        </div>
    )
}

const mapStateToProps = ({courseReducer}) => ({

    list:courseReducer.list
})

export default connect(mapStateToProps,{fetchCourses})(CourseList)