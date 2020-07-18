
import React, { Component, Fragment, useEffect } from 'react'
import { runInThisContext } from 'vm';
import { withFormik, Form, Field } from 'formik'
import { FormGroup, Button, Input, Label } from 'reactstrap';
import { Container, Row, Col, Media } from 'reactstrap';
import { Prompt } from 'react-router-dom'

import * as yup from 'yup'
import { postAddAdmin, fetchAdmin } from '../../actions/admin'
import { connect } from 'react-redux';
import Header from '../header/Header'
import Menu from '../menu/Menu'
import Footer from '../footer/Footer'
import { log } from 'util';



const AdminForm = props => {

    useEffect( ()=>(
        props.fetchAdmin(props.match.params.id)
    ), [])
    console.log('props values--->',props);

    const {
      list,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
    } = props;
    console.log('list values--->',list);

    
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={list && list.response.length > 0 ? list.response[0].name : ''}
          name="name"
        />
        {errors.name && touched.name && <div id="feedback">{errors.name}</div>}
        <button type="submit">Submit</button>
      </form>
    );
  };



const withFormikData =  withFormik({
    mapPropsToValues: (name) => ({ name: name }),
    validationSchema: yup.object().shape({
        name:yup.string().required('please provide name')
    }),
    handleSubmit: (values, { setSubmitting, formikBag }) => {
        setTimeout(() => {
            console.log('handle submit value---',values);
            formikBag.props.postAddAdmin(values)

            setSubmitting(false);
        }, 1000);
      },

    // handleSubmit:( (values, formikBag ) => {
        
    //     formikBag.props.postAddAdmin(values)
    //    // formikBag.resetForm()
    // })
})(AdminForm)

const mapStateToProps = ({adminReducer}) => ({

    list:adminReducer.list
})

export default connect(mapStateToProps, {postAddAdmin, fetchAdmin})(withFormikData)
