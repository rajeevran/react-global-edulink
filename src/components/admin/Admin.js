
import React, { Fragment, useEffect } from 'react'
import { Link , Redirect, useHistory} from 'react-router-dom'
import { connect } from 'react-redux';
import { baseUrl, localUrl } from '../../shared/baseUrl'

import AdminForm from './AdminForm'
import { postDeleteAdmin } from '../../actions/admin'

const Admin = (props) => {

    console.log('admin props --->',props);

    return ( 
                <Fragment>
                    <tr >
                        <td >
                            <img style= {{ height: '50px', width: '50px'}} src={baseUrl+props.profileImage} />   
                        </td>
                        <td >{props.firstName}</td>  
                        <td >{props.lastName}</td>                          
                        <td>{props.email}</td>
                        <td>{props.status === 'yes' ? 'Active':'DeActive'}</td>
                   
                        <td>
                                <Link to= {{ pathname: `/admin/view/${props._id}` }}  >

                                    <button type="button" className="btn btn-primary" id="modalprintview"
                                    data-toggle="modal" style={{'marginRight':'10px'}} data-target="#modal-form-view"
                                    title="View"  >
                                    <i className="fa fa-eye"></i>
                                    </button> 
                                </Link>

                                <Link to= {{ pathname: `/admin/edit/${props._id}` }}  >

                                    <button type="button"   className="btn btn-primary" id="modalprintedit"
                                    data-toggle="modal" style={{'marginRight':'10px'}} data-target="#modal-form-Edit"
                                    title="Edit">
                                    <i className="fa fa-edit"></i>
                                    </button>
                                </Link>

                                <Link to= {{ pathname: `/admin/delete/${props._id}` }}  >

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
    export default connect(null, { postDeleteAdmin })(Admin)

//export default Admin