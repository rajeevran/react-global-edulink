import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Prompt, Link, useHistory } from 'react-router-dom'
import Pagination from "react-js-pagination";
import { fetchlistCourseDetail } from '../../../actions/content/courseDetail'
import { baseUrl, localUrl } from '../../../shared/baseUrl'

import Header from '../../header/Header'
import Menu from '../../menu/Menu'
import Footer from '../../footer/Footer'
import CourseDetail  from './CourseDetail'

const CourseList = props => {
    useEffect( ()=>(
        props.fetchlistCourseDetail()
    ), []) 
    console.log('CONTENT PORPS---->',props)
    const history = useHistory();
    
    
    let handlePageChange = (pageNumber) => {
        console.log(`active page is ${pageNumber}  `);
        props.fetchlistCourseDetail(undefined, pageNumber ,3)
    }

    let handlePageSearch = (e) => {
        console.log(`search name is ${e.target.value}  `);
        props.fetchlistCourseDetail(undefined, undefined ,undefined,e.target.value)
    }

    let handleClear = () => {
        console.log(`clear`);
        document.getElementById('searchinput').value=''
        props.fetchlistCourseDetail(undefined, undefined ,undefined,'')
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
                                    <h5 className="box-title">Course Detail Management</h5>
                                    <Link to= {{ pathname: `/content/courseDetail/add` }}  >
                                            <button title="Add new" id="modal-add" className="btn btn-primary pull-right"
                                            data-target="#modal-form-Edit" data-toggle="modal">
                                            <i className="fa fa-plus"></i> Add Course Detail</button>
                                    </Link>
                                </div>

                                <div className="search-box">
            
                                            <input id="searchinput" placeholder="Search By Course Detail Name" type="search" onChange={ (e) => { handlePageSearch(e) } } className="form-control" />
                                            
                                            <span id="searchclear" className="glyphicon" onClick={ ()=> {handleClear()}}>
                                                <i className="fa fa-times"></i>
                                            </span>

                                </div>

                                <div className="box-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered  table-condensed table-hover">
                                            <thead>
                                                <tr>
                                                    <th style= {{ textAlign: 'center' }}>Course Image</th>
                                                    <th style= {{ textAlign: 'center' }}>Course Detail Name</th>
                                                    <th style= {{ textAlign: 'center' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {(function() {
 
                                                    if (props.courseDetaillist.success !== false && props.courseDetaillist.STATUSCODE !== 4000) {

                                                        return props.courseDetaillist.response.docs
                                                        .map( courseDetaillist => <CourseDetail key={courseDetaillist._id} {...courseDetaillist}/> );

                                                    } else if (props.courseDetaillist.success === false && props.courseDetaillist.STATUSCODE === 4000){
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
                                props.courseDetaillist.success !== false && 
                                <Pagination
                                            activePage={props.courseDetaillist.response.page}
                                            itemsCountPerPage={props.courseDetaillist.response.limit}
                                            totalItemsCount={props.courseDetaillist.response.total}
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

const mapStateToProps = ({detailCourseReducer}) => ({

    courseDetaillist:detailCourseReducer.courseDetaillist
})

export default connect(mapStateToProps,{fetchlistCourseDetail})(CourseList)