
import React, { Component, Fragment, useEffect, useState } from 'react'
import { runInThisContext } from 'vm';
import { withFormik, Form, Field, Formik, ErrorMessage } from 'formik'
import { FormGroup, Button, Input, Label } from 'reactstrap';
import { Container, Row, Col, Media } from 'reactstrap';
import { Prompt, Link, useHistory  } from 'react-router-dom'
import { baseUrl, localUrl } from '../../shared/baseUrl'
import { ToastContainer, toast } from 'react-toastify';

import * as Yup from 'yup'
import { postAddUser, fetchUser, postEditUser, postDeleteUser } from '../../actions/admin'
import { connect } from 'react-redux';
import Header from '../header/Header'
import Menu from '../menu/Menu'
import Footer from '../footer/Footer'
import { log } from 'util';

const UserForm = props => {
   // console.log('match values--->',match);
   const history = useHistory()

    useEffect( ()=>(
        props.fetchUser(props.match.params.id)
    ), [])
    console.log('props values--->',props);


    const { id } = props.match.params;
    let { path } = props.match;

    console.log('path--------->',path.split('/')[2]);
    let pathEditView = path.split('/')[2]
    const isAddMode = !id;
    let definedid = ''
    let definedfullName = ''
    let defineduserName = ''
    let definedemail = ''
    let definedstatus = ''
    let defineddeleteId = ''
    let definedprofileImage = ''
    let definedimageSavedUrl =''
    //deleteId
    if(props.userList.response.docs.length == 1)
    {
        defineddeleteId = pathEditView == 'delete' ? props.userList.response.docs[0]._id: ''
        definedid = props.userList.response.docs[0]._id
        definedfullName = props.userList.response.docs[0].fullName
        defineduserName = props.userList.response.docs[0].userName
        definedemail = props.userList.response.docs[0].email
        definedprofileImage = props.userList.response.docs[0].profileImage
        definedimageSavedUrl = baseUrl+props.userList.response.docs[0].profileImage
        definedstatus = props.userList.response.docs[0].status

    }

    let valdationShape = {}
    let addEditFields = {}

    if(isAddMode)
    {

        addEditFields ={
            deleteId: defineddeleteId,
            fullName: definedfullName,
            userName: defineduserName,
            email: definedemail,
            profileImage:definedprofileImage,
            status: 'yes',
            password: '',
            imagePreviewUrl:''
        }

        valdationShape= {
            fullName: Yup.string()
                .required('Full Name is required'),
            userName: Yup.string()
                .required('User Name is required'),
            email: Yup.string()
                .email('Email is invalid')
                .required('Email is required'),
            password: Yup.string()
                .concat(isAddMode ? Yup.string().required('Password is required') : null)
                .min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .when('password', (password, schema) => {
                    if (password || isAddMode) return schema.required('Confirm Password is required');
                })
                .oneOf([Yup.ref('password')], 'Passwords must match')
        }

    }else{

        addEditFields ={
            deleteId: defineddeleteId,
            userId: definedid,
            fullName: definedfullName,
            userName: defineduserName,
            profileImage:definedprofileImage,
            imageSavedUrl:definedimageSavedUrl,
            email: definedemail,
            status: definedstatus,
            imagePreviewUrl:''
        }

        valdationShape= {

            fullName: Yup.string()
                .required('Full Name is required'),
            userName: Yup.string()
                .required('User Name is required'),
            email: Yup.string()
                .email('Email is invalid')
                .required('Email is required')
        }
    }


    const initialValues = addEditFields

    const validationSchema = Yup.object().shape(valdationShape);

    function onSubmit(fields) {

        console.log('fields---',fields);

        if (isAddMode) {
            toast("User Added Successfully.")

            props.postAddUser(fields)

        } else {
            toast("User Data Updated Successfully.")

            props.postEditUser(fields)
        }

        setTimeout( ()=>{

            history.goBack() 

        },2500)
    }

    function onDeleteUser(id){
        console.log('id---',id);
        props.postDeleteUser({userId:id})
        toast("User Data Deleted Successfully.")

        setTimeout( ()=>{

            document.getElementById('close-delete-button-model').click() ;

        },2500)

    }

    return (
        <Fragment>
        <ToastContainer />
        <Header />
            <Menu />
        <Container fluid={true} className="page" style={{marginLeft: '313px'}}>
          <Row>
            <Col xs="12" md={{size:10, offset:0}}></Col>



            {/*   THIS PART FOR EDIT  START   */}

            { pathEditView == 'edit' && props.userList.success !== false && props.userList.response.docs.length == 1  && 
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit }>
                {({ values, errors, touched, isSubmitting, setFieldValue }) => {

                return (
                    <Form>

                        <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
                        <FormGroup row>
                            <Col md={12}>

                                <Link to={isAddMode ? '.' : '..'} className="pull-right btn btn-link">Cancel</Link>

                                <button type="submit" disabled={isSubmitting} className="pull-right btn btn-primary">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Save
                                </button>

                            </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="fullName" md={3}>Full Name</Label>
                        <Col md={9}>

                                <Field name="fullName" type="text" className={'form-control' + (errors.fullName && touched.fullName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="userName" md={3}>User Name</Label>
                        <Col md={9}>

                                <Field name="userName" type="text" className={'form-control' + (errors.userName && touched.userName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="userName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="email" md={3}>Email</Label>
                        <Col md={9}>

                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="profileImage" md={3}>Profile Image</Label>
                        <Col md={9}>

                        <input id="file" name="profileImage"  type="file" accept="image/*" onChange={(e) => {
                                    // console.log('event.target.files[0]--',event.target.files[0]);
                                    e.preventDefault();

                                    let reader = new FileReader();
                                    let file = e.target.files[0];
                                
                                    reader.onloadend = () => {
                                        console.log('reader.result---',reader.result);
                                        
                                        setFieldValue(`imagePreviewUrl`, reader.result)
                                        setFieldValue(`profileImage`, file)
                                        // this.setState({
                                        // file: file,
                                        // imagePreviewUrl: reader.result
                                        // });
                                    }
                                
                                    reader.readAsDataURL(file)


                            }} />
  
                        <img src={values.imageSavedUrl}  style={{height:'150px', width:'150px', marginRight:'30px'}} /> 

                        {
                            values.imagePreviewUrl && 
                            
                            <img src={values.imagePreviewUrl}  name="imagePreviewUrl" style={{height:'150px', width:'150px'}} /> 
                            
                        } 
                       
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="status" md={3}>Status</Label>
                        <Col md={9}>

                                <Field name="status" as="select" className={'form-control' + (errors.status && touched.status ? ' is-invalid' : '')}>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                </Field>

                                <ErrorMessage name="status" component="div" className="invalid-feedback" />

                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Col md={9}>

                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>

                        </Col>
                        </FormGroup>

                        
                    </Form>
                );
                }}
              </Formik>
            
            }

            {/*   THIS PART FOR EDIT  END   */}






            {/*   THIS PART FOR VIEW  START   */}

            { pathEditView == 'view' && props.userList.success !== false && props.userList.response.docs.length == 1  && 
              <Formik initialValues={initialValues}>
                {({ values, errors, touched, isSubmitting, setFieldValue }) => {

                return (
                    <Form>

                        <h1>{isAddMode ? 'Add User' : 'View User'}</h1>
                        <FormGroup row>
                            <Col md={12}>
                            
                                <Link to={isAddMode ? '.' : '..'} className="pull-right btn btn-link">Cancel</Link>


                            </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Label for="fullName" md={3}>Full Name</Label>
                        <Col md={9}>

                                <Field name="fullName"  disabled={true}  className='form-control' />
                               
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="userName" md={3}>User Name</Label>
                        <Col md={9}>

                                <Field name="userName"  disabled={true}   className='form-control' />
                                                      
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="email" md={3}>Email</Label>
                        <Col md={9}>

                                <Field name="email"  disabled={true}   className='form-control'  />
                               
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Label for="profileImage" md={3}>Profile Image</Label>
                        <Col md={9}>

                        {
                            values.imageSavedUrl && 
                            
                            <img src={values.imageSavedUrl} style={{height:'150px', width:'150px'}} /> 
                            
                        }                       
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="status" md={3}>Status</Label>
                        <Col md={9}>

                                <Field name="status"  disabled={true}   className='form-control' />

                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Col md={9}>
                            
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">

                            <button type="button"  className="btn btn-primary">
                                {<span className="spinner-border spinner-border-sm mr-1"></span>}
                                Cancel
                            </button>
                            
                            </Link>

                        </Col>
                        </FormGroup>

                        
                    </Form>
                );
                }}
              </Formik>
            }

            {/*   THIS PART FOR VIEW  END   */}





            {/*   THIS PART FOR ADD  START   */}

            { isAddMode  && 
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ values, errors, touched, isSubmitting, setFieldValue }) => {

                return (
                    <Form>

                        <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
                        <FormGroup row>
                            <Col md={12}>
                            
                                <Link to={isAddMode ? '.' : '..'} className="pull-right btn btn-link">Cancel</Link>

                                <button type="submit" disabled={isSubmitting} className="pull-right btn btn-primary">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Save
                                </button>

                            </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Label for="fullName" md={3}>Full Name</Label>
                        <Col md={9}>

                                <Field name="fullName" type="text" className={'form-control' + (errors.fullName && touched.fullName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="userName" md={3}>User Name</Label>
                        <Col md={9}>

                                <Field name="userName" type="text" className={'form-control' + (errors.userName && touched.userName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="userName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="email" md={3}>Email</Label>
                        <Col md={9}>

                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="profileImage" md={3}>Profile Image</Label>
                        <Col md={9}>

                        <input id="file" name="profileImage"  type="file" accept="image/*" onChange={(e) => {
                                    e.preventDefault();

                                    let reader = new FileReader();
                                    let file = e.target.files[0];
                                
                                    reader.onloadend = () => {
                                        console.log('reader.result---',reader.result);
                                        
                                        setFieldValue(`imagePreviewUrl`, reader.result)
                                        setFieldValue(`profileImage`, file)
                                    }
                                
                                    reader.readAsDataURL(file)


                            }} />
  
                        {
                            values.imagePreviewUrl && 
                            
                            <img src={values.imagePreviewUrl}  name="imagePreviewUrl" style={{height:'150px', width:'150px'}} /> 
                            
                        } 
                       
                        </Col>
                        </FormGroup>



                        <FormGroup row>
                        <Label for="status" md={3}>Status</Label>
                        <Col md={9}>

 
                            <Field name="status" as="select" value={values.status} className={'form-control' + (errors.status && touched.status ? ' is-invalid' : '')}>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                            </Field>

                            <ErrorMessage name="status" component="div" className="invalid-feedback" />

                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="password" md={3}>Password</Label>
                        <Col md={9}>

                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />

                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="confirmPassword" md={3}>Confirm Password</Label>
                        <Col md={9}>


                                <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />

                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Col md={9}>

                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>

                        </Col>
                        </FormGroup>

                        
                    </Form>
                );
                }}
              </Formik>
            }
            {/*   THIS PART FOR ADD  END   */}




            {/*   THIS PART FOR DELETE  START   */}

            { pathEditView == 'delete' && props.userList.success !== false && props.userList.response.docs.length == 1  && 
        
               <div className="modal show" id="modal-form-delete">
                            <input type="hidden" name="deleteId" ></input>

                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                    <Link to={'/admin'}>

                                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                    </Link>
                                        <h4 className="modal-title" id="myModalLabel"></h4>
                                    </div>
                                    <div className="modal-body">

                                            <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="form-group" >
                                                            <label >Are You Sure You want to delete ?</label>
                                                        </div>
                                
                                                    </div>
                                                </div>                        

                                    </div>
                                    <div className="modal-footer">

                                                <Link to={'/admin'} className="btn btn-link">

                                                    <button type="button" className="btn btn-default" id="close-delete-button-model"
                                                        data-dismiss="modal">Close</button>

                                                </Link>
                                            
                                                    <button type="submit" className="btn btn-primary" onClick = { () => { onDeleteUser(id) } }
                                                >Delete</button>

                                    </div>
                                </div>
                            </div>
                            </div> 
            }

            {/*   THIS PART FOR DELETE  START   */}

        </Row>
        </Container>
    </Fragment>
    );    


}

const mapStateToProps = ({adminReducer}) => ({
    userList:adminReducer.userList
})

export default connect(mapStateToProps, { postAddUser, postEditUser, postDeleteUser, fetchUser })(UserForm)
