
import React, { Fragment, useEffect } from 'react'
import { Link , Redirect, useHistory} from 'react-router-dom'
import { connect } from 'react-redux';
import { baseUrl, localUrl } from '../../../shared/baseUrl'


const CourseCategory = (props) => {

    console.log('admin props --->',props);

    return ( 
                <Fragment>
                    <tr >
                        <td >
                            <img style= {{ height: '50px', width: '50px'}} src={baseUrl+props.courseImage} />   
                        </td>
                        <td >{props.courseName}</td>    
                  
                        <td>
                                <Link to= {{ pathname: `/content/courseDetail/view/${props._id}` }}  >

                                    <button type="button" className="btn btn-primary" id="modalprintview"
                                    data-toggle="modal" style={{'marginRight':'10px'}} data-target="#modal-form-view"
                                    title="View"  >
                                    <i className="fa fa-eye"></i>
                                    </button> 
                                </Link>

                                <Link to= {{ pathname: `/content/courseDetail/edit/${props._id}` }}  >

                                    <button type="button"   className="btn btn-primary" id="modalprintedit"
                                    data-toggle="modal" style={{'marginRight':'10px'}} data-target="#modal-form-Edit"
                                    title="Edit">
                                    <i className="fa fa-edit"></i>
                                    </button>
                                </Link>

                                <Link to= {{ pathname: `/content/courseDetail/delete/${props._id}` }}  >

                                    <button type="button" className="btn btn-primary" id="modalprintdelete"
                                    data-toggle="modal" data-target="#modal-form-delete"
                                    title="Delete">
                                    <i className="fa fa-trash" data-toggle="tooltip" data-original-title="Delete"></i>
                                    </button>

                                </Link>
                        </td>
                    </tr>
   
                </Fragment>                 
            )
    }
    export default connect(null, {  })(CourseCategory)

//export default CourseCategory