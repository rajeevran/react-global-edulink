
import React, { Component, Fragment, useEffect, useState, useRef } from 'react'
import { runInThisContext } from 'vm';
import { withFormik, Form, Field, Formik, ErrorMessage } from 'formik'
import { FormGroup, Button, Input, Label } from 'reactstrap';
import { Container, Row, Col, Media } from 'reactstrap';
import { Prompt, Link, useHistory  } from 'react-router-dom'
import { baseUrl, localUrl } from '../../shared/baseUrl'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup'
import { postAddAdmin, fetchAdmin, postEditAdmin, postDeleteAdmin } from '../../actions/admin'
import { connect } from 'react-redux';
import Header from '../header/Header'
import Menu from '../menu/Menu'
import Footer from '../footer/Footer'
import { log } from 'util';

function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    
    // Store current value in ref
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    
    // Return previous value (happens before update in useEffect above)
    return ref.current;
  }

const AdminForm = props => {
   // console.log('match values--->',match);
   const history = useHistory()

   const prevIsSuccess = usePrevious(props.isSuccess);
 
    useEffect( ()=>(
        props.fetchAdmin(props.match.params.id)
    ), [])

    useEffect( ()=>{
        console.log('isSuccess hitted',props.isSuccess);

        if(prevIsSuccess === false && props.isSuccess === true)
        {
            history.goBack() 
        }

    }, [props.isSuccess,prevIsSuccess])

    console.log('props values--->',props);


    const { id } = props.match.params;
    let { path } = props.match;

    console.log('path--------->',path.split('/')[2]);
    let pathEditView = path.split('/')[2]
    const isAddMode = !id;
    let definedid = ''
    let definedfirstName = ''
    let definedlastName = ''
    let definedemail = ''
    let definedstatus = ''
    let defineddeleteId = ''
    let definedprofileImage = ''
    let definedimageSavedUrl =''
    //deleteId
    if(props.list.response.docs.length == 1)
    {
        defineddeleteId = pathEditView == 'delete' ? props.list.response.docs[0]._id: ''
        definedid = props.list.response.docs[0]._id
        definedfirstName = props.list.response.docs[0].firstName
        definedlastName = props.list.response.docs[0].lastName
        definedemail = props.list.response.docs[0].email
        definedprofileImage = props.list.response.docs[0].profileImage
        definedimageSavedUrl = baseUrl+props.list.response.docs[0].profileImage
        definedstatus = props.list.response.docs[0].status

    }

    let valdationShape = {}
    let addEditFields = {}

    if(isAddMode)
    {

        addEditFields ={
            deleteId: defineddeleteId,
            firstName: definedfirstName,
            lastName: definedlastName,
            email: definedemail,
            profileImage:definedprofileImage,
            status: 'yes',
            password: '',
            imagePreviewUrl:''
        }

        valdationShape= {
            firstName: Yup.string()
                .required('First Name is required'),
            lastName: Yup.string()
                .required('Last Name is required'),
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
            adminId: definedid,
            firstName: definedfirstName,
            lastName: definedlastName,
            profileImage:definedprofileImage,
            imageSavedUrl:definedimageSavedUrl,
            email: definedemail,
            status: definedstatus,
            imagePreviewUrl:''
        }

        valdationShape= {

            firstName: Yup.string()
                .required('First Name is required'),
            lastName: Yup.string()
                .required('Last Name is required'),
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
            toast.success("Admin Added Successfully.")

            props.postAddAdmin(fields)

        } else {
            toast.success("Admin Data Updated Successfully.")
            console.log('updated field value',fields);

            props.postEditAdmin(fields)

        }

        // setTimeout( ()=>{

        //     history.goBack() 

        // },2500)
    }

    function onDeleteAdmin(id){
        console.log('id---',id);
        props.postDeleteAdmin({adminId:id})
        toast("Admin Data Deleted Successfully.")

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

            { pathEditView == 'edit' && props.list.success !== false && props.list.response.docs.length == 1  && 
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit }>
                {({ values, errors, touched, isSubmitting, setFieldValue }) => {

                return (
                    <Form>

                        <h1>{isAddMode ? 'Add Admin' : 'Edit Admin'}</h1>
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
                        <Label for="firstName" md={3}>First Name</Label>
                        <Col md={9}>

                                <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="lastName" md={3}>Last Name</Label>
                        <Col md={9}>

                                <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                       
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

            { pathEditView == 'view' && props.list.success !== false && props.list.response.docs.length == 1  && 
              <Formik initialValues={initialValues}>
                {({ values, errors, touched, isSubmitting, setFieldValue }) => {

                return (
                    <Form>

                        <h1>{isAddMode ? 'Add Admin' : 'View Admin'}</h1>

                        <FormGroup row>
                        <Label for="firstName" md={3}>First Name</Label>
                        <Col md={9}>

                                <Field name="firstName"  disabled={true}  className='form-control' />
                               
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="lastName" md={3}>Last Name</Label>
                        <Col md={9}>

                                <Field name="lastName"  disabled={true}   className='form-control' />
                                                      
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

                        <h1>{isAddMode ? 'Add Admin' : 'Edit Admin'}</h1>
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
                        <Label for="firstName" md={3}>First Name</Label>
                        <Col md={9}>

                                <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="lastName" md={3}>Last Name</Label>
                        <Col md={9}>

                                <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                       
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

            { pathEditView == 'delete' && props.list.success !== false && props.list.response.docs.length == 1  && 
        
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
                                            
                                                    <button type="submit" className="btn btn-primary" onClick = { () => { onDeleteAdmin(id) } }
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

    list:adminReducer.list,
    isSuccess:adminReducer.isSuccess
})

export default connect(mapStateToProps, { postAddAdmin, postEditAdmin, postDeleteAdmin, fetchAdmin })(AdminForm)
