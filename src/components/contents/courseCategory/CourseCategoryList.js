import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Prompt, Link, useHistory } from 'react-router-dom'
import Pagination from "react-js-pagination";
import { fetchlistCategory } from '../../../actions/content/courseCategory'
import { baseUrl, localUrl } from '../../../shared/baseUrl'

import Header from '../../header/Header'
import Menu from '../../menu/Menu'
import Footer from '../../footer/Footer'
import CourseCategory  from './CourseCategory'



const CourseList = props => {
    useEffect( ()=>(
        props.fetchlistCategory()
    ), [])
    console.log('CONTENT PORPS---->',props)
    const history = useHistory();
    
    
    let handlePageChange = (pageNumber) => {
        console.log(`active page is ${pageNumber}  `);
        props.fetchlistCategory(undefined, pageNumber ,3)
    }

    let handlePageSearch = (e) => {
        console.log(`search name is ${e.target.value}  `);
        props.fetchlistCategory(undefined, undefined ,undefined,e.target.value)
    }

    let handleClear = () => {
        console.log(`clear`);
        document.getElementById('searchinput').value=''
        props.fetchlistCategory(undefined, undefined ,undefined,'')
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
                                    <h5 className="box-title">Course Category Management</h5>
                                    <Link to= {{ pathname: `/content/courseCategory/add` }}  >
                                            <button title="Add new" id="modal-add" className="btn btn-primary pull-right"
                                            data-target="#modal-form-Edit" data-toggle="modal">
                                            <i className="fa fa-plus"></i> Add Course Category</button>
                                    </Link>
                                </div>

                                <div className="search-box">
            
                                            <input id="searchinput" placeholder="Search By Course Category Name" type="search" onChange={ (e) => { handlePageSearch(e) } } className="form-control" />
                                            
                                            <span id="searchclear" className="glyphicon" onClick={ ()=> {handleClear()}}>
                                                <i className="fa fa-times"></i>
                                            </span>

                                </div>

                                <div className="box-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered  table-condensed table-hover">
                                            <thead>
                                                <tr>
                                                    <th style= {{ textAlign: 'center' }}>Course Category Name</th>
                                                    <th style= {{ textAlign: 'center' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {(function() {
 
                                                    if (props.courseCategorylist.success !== false && props.courseCategorylist.STATUSCODE !== 4000) {

                                                        return props.courseCategorylist.response.docs
                                                        .map( courseCategorylist => <CourseCategory key={courseCategorylist._id} {...courseCategorylist}/> );

                                                    } else if (props.courseCategorylist.success === false && props.courseCategorylist.STATUSCODE === 4000){
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
                                props.courseCategorylist.success !== false && 
                                <Pagination
                                            activePage={props.courseCategorylist.response.page}
                                            itemsCountPerPage={props.courseCategorylist.response.limit}
                                            totalItemsCount={props.courseCategorylist.response.total}
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

const mapStateToProps = ({courseCategoryReducer}) => ({

    courseCategorylist:courseCategoryReducer.courseCategorylist
})

export default connect(mapStateToProps,{fetchlistCategory})(CourseList)