import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Prompt, Link, useHistory } from 'react-router-dom'
import Pagination from "react-js-pagination";
import { fetchCourses } from '../../actions/content/course'
import { fetchlistCategory } from '../../actions/content/courseCategory'
import { fetchlistSubCategory } from '../../actions/content/courseSubCategory'
import { fetchUser } from '../../actions/admin'

import Header from '../header/Header'
import Menu from '../menu/Menu'
import Footer from '../footer/Footer'

const ContentList = props => {
    useEffect( ()=>(
        props.fetchCourses(),
        props.fetchlistCategory(),
        props.fetchlistSubCategory(),
        props.fetchUser()

    ), [])

    console.log('CONTENT PORPS---->',props)
    const history = useHistory()
    return ( 
        <div>
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
                                    <h5 className="box-title">Content Management</h5>
                                    
                                </div>
                                {(function() {
                                    
                                    if (props.list.success === false && props.list.STATUSCODE === 4000){
                                        return  history.push('/login')
                                    }
                                    })
                                 ()}
                            <div className="row">

                                    <Link to= {{ pathname: `/user` }}  >

                                    <div className="col-md-4 col-sm-8 col-xs-12">
                                        <div className="info-box">
                                        <span className="info-box-icon bg-red"><i className="fa fa-users"></i></span>

                                        <div className="info-box-content">
                                            <span className="info-box-text">Users</span>
                                            <span className="info-box-number">
                                            { 
                                                props.userList.success !== false && 
                                                <span>
                                                {props.userList.response.total}
                                                </span>

                                            }</span>
                                        </div>
                                        </div>
                                    </div>
                                    </Link>

                                    <div className="clearfix visible-sm-block"></div>

                                    <Link to= {{ pathname: `/content/courses` }}  >

                                    <div className="col-md-4 col-sm-8 col-xs-12">
                                        <div className="info-box">
                                        <span className="info-box-icon bg-aqua"><i className="fa fa-graduation-cap"></i></span>

                                        <div className="info-box-content">
                                            <span className="info-box-text">Courses</span>
                                            <span className="info-box-number">
                                            { 
                                                props.list.success !== false && 
                                                <span>
                                                {props.list.response.total}
                                                </span>

                                            }
                                            </span>
                                        </div>
                                        </div>
                                    </div>
                                    </Link>
                                    
                                    <Link to= {{ pathname: `/content/courseCategory` }}  >
                                    <div className="col-md-4 col-sm-8 col-xs-12">
                                        <div className="info-box">
                                        <span className="info-box-icon bg-green"><i className="fa fa-th-list"></i></span>

                                        <div className="info-box-content">
                                            <span className="info-box-text">Course Category</span>
                                            <span className="info-box-number">  
                                            { 
                                                props.courseCategorylist.success !== false && 
                                                <span>
                                                {props.courseCategorylist.response.total}
                                                </span>

                                            }
                                          </span>
                                        </div>
                                        </div>
                                    </div>

                                    </Link>

                                    </div>
                                <div className="row">

                                    <div className="col-md-4 col-sm-8 col-xs-12">
                                                <div className="info-box">
                                                <span className="info-box-icon bg-yellow"><i className="fa fa-outdent"></i></span>

                                                <div className="info-box-content">
                                                    <span className="info-box-text">Course Sub Category</span>
                                                    <span className="info-box-number">
                                                    { 
                                                        props.courseSubCategorylist.success !== false && 
                                                        <span>
                                                        {props.courseSubCategorylist.response.total}
                                                        </span>

                                                    }
                                                    
                                                    </span>
                                                </div>
                                                </div>
                                    </div>
                                </div>

                            </div>
                        </div>
            
               </div>

                
                
                </section>
            </div>

   
  
        </div>
    )
}

const mapStateToProps = ({courseReducer, courseCategoryReducer, courseSubCategoryReducer, adminReducer}) => ({

    list:courseReducer.list,
    userList:adminReducer.userList,
    courseCategorylist:courseCategoryReducer.courseCategorylist,
    courseSubCategorylist:courseSubCategoryReducer.courseSubCategorylist
})

export default connect(mapStateToProps,{fetchCourses, fetchlistCategory, fetchlistSubCategory, fetchUser})(ContentList)