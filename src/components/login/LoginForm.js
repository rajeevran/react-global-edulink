     


import React, { Component, useEffect } from 'react'
import { runInThisContext } from 'vm';
import { Switch, Route, Redirect, withRouter  } from 'react-router-dom';
import { withFormik, Form, Field } from 'formik'
import * as yup from 'yup'
import { postLoginAdmin, getToken } from '../../actions/admin'
import Dashboard from '../../components/dashboard/Dashboard'

import { connect } from 'react-redux';
       
       
       const LoginForm = (props) => { 

        
        console.log('props login---->',props);

           return (

                <div className="login-box">
                <div className="login-logo">
                    <b>Global EduLink</b> Admin
                </div>
                <div className="login-box-body">
                    <p className="login-box-msg">Sign in to start your session</p>
                    
                    { props.login.success === false && <p>{props.login.message} </p> }
                    { props.login.success === true &&  JSON.parse(getToken()).isAuthenticated === true && 
                        <Redirect to="/dashboard"  component={() => { return <Dashboard />}} />
                    }
                    <Form >
                        <div className="form-group has-feedback">
                            {props.touched.email && props.errors.email && <p>{props.errors.email}</p>}
                            <label>Email:</label>
                            <Field type="email" name="email" placeholder="Email" className="form-control"
                            />
                        </div>
                        <div className="form-group has-feedback">
                        {props.touched.password && props.errors.password && <p>{props.errors.password}</p>}
                            <label>Password:</label>
                            <Field type="password" name="password" placeholder="Password" className="form-control"
                            />
                        </div>
                            <button type="submit" className="btn btn-primary" >Login</button>
                    </Form>

                    </div>
                </div>     
           )
       }
       
       const withFormikData =  withFormik({
           mapPropsToValues: (values) => {
               return {
                   email: values.email || '',
                   password: values.password || ''

               }
           },
           validationSchema: yup.object().shape({
               email:yup.string().required('please provide email'),
               password:yup.string().required('please provide password')
           }),
           handleSubmit:( (values, formikBag ) => {
               formikBag.props.postLoginAdmin(values)
               formikBag.resetForm()
           })
         })(LoginForm)

       const mapStateToProps = ({adminReducer}) => ({

        login:adminReducer.login
        })
       
       export default connect(mapStateToProps, {postLoginAdmin})(withFormikData)
       

