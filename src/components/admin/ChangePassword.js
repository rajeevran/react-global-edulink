
import React, { Component, Fragment, useEffect, useState } from 'react'
import { runInThisContext } from 'vm';
import { withFormik, Form, Field, Formik, ErrorMessage } from 'formik'
import { FormGroup, Button, Input, Label } from 'reactstrap';
import { Container, Row, Col, Media } from 'reactstrap';
import { Prompt, Link, useHistory  } from 'react-router-dom'
import { baseUrl, localUrl } from '../../shared/baseUrl'

import * as Yup from 'yup'
import { postChangePasswordAdmin } from '../../actions/admin'
import { connect } from 'react-redux';
import Header from '../header/Header'
import Menu from '../menu/Menu'
import Footer from '../footer/Footer'
import { log } from 'util';
import { ToastContainer, toast } from 'react-toastify';
const ChangePassword = props => {
   // console.log('match values--->',match);
   const history = useHistory()

    console.log('props values--->',props);

    //deleteId


    let valdationShape = {}
    let addEditFields = {}


    addEditFields ={
        newPassword: ''
    }

    valdationShape= {

        newPassword: Yup.string()
            .required('New Password is required')
    }
    


    const initialValues = addEditFields

    const validationSchema = Yup.object().shape(valdationShape);

    function onSubmit(fields) {

        console.log('fields---',fields);
        
       props.postChangePasswordAdmin(fields)

       toast("Password Changed Successfully.")
        setTimeout( ()=>{

            history.push('/dashboard') 

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

              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit }>
                {({ values, errors, touched, isSubmitting, setFieldValue }) => {

                return (
                    <Form>

                        <h1>Change Password</h1>


                        <FormGroup row>
                        <Label for="newPassword" md={3}>New Password </Label>
                        <Col md={9}>

                                <Field name="newPassword" type="text" className={'form-control' + (errors.newPassword && touched.newPassword ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Col md={9}>

                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={'..'} className="btn btn-link">Cancel</Link>
                            

                        </Col>
                        </FormGroup>

                        
                    </Form>
                );
                }}
              </Formik>
            
            

            {/*   THIS PART FOR EDIT  END   */}



        </Row>
        </Container>
    </Fragment>
    );    


}

const mapStateToProps = ({adminReducer}) => ({

    changepassword:adminReducer.changepassword
})

export default connect(mapStateToProps, { postChangePasswordAdmin })(ChangePassword)
