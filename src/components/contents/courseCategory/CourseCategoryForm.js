
import React, { Component, Fragment, useEffect, useState, useRef } from 'react'
import { runInThisContext } from 'vm';
import { withFormik, Form, Field, Formik, ErrorMessage } from 'formik'
import { FormGroup, Button, Input, Label } from 'reactstrap';
import { Container, Row, Col, Media } from 'reactstrap';
import { Prompt, Link, useHistory  } from 'react-router-dom'
import { baseUrl, localUrl } from '../../../shared/baseUrl'
import Select from 'react-select';

import * as Yup from 'yup'
import { postAddCategory, postEditCategory, postDeleteCategory, fetchlistCategory } from '../../../actions/content/courseCategory'
import { fetchlistSubCategory } from '../../../actions/content/courseSubCategory'

import { connect } from 'react-redux';
import Header from '../../header/Header'
import Menu from '../../menu/Menu'
import Footer from '../../footer/Footer'
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

const CourseForm = props => {
   // console.log('match values--->',match);
   const history = useHistory()

   var lastIndex = window.location.href.lastIndexOf("/")
   console.log('lastIndex----',lastIndex);

   var id = window.location.href.substring(lastIndex + 1); //after this id="true"
   console.log('path----',id);


    useEffect( ()=>(
        props.fetchlistCategory(id),
        props.fetchlistSubCategory()

    ), [])
    console.log('props values--->',props);

    const prevIsSuccess = usePrevious(props.iscourseCategorySuccess);
    const prevIsAddSuccess = usePrevious(props.iscourseCategoryAddSuccess);
    
    useEffect( ()=>{
        console.log('iscourseCategorySuccess hitted',props.iscourseCategorySuccess);

        if(prevIsSuccess === false && props.iscourseCategorySuccess === true)
        {
            history.goBack() 
        }

        if(prevIsAddSuccess === false && props.iscourseCategoryAddSuccess === true)
        {
            history.goBack() 
        }

    }, [props.iscourseCategorySuccess,prevIsSuccess,props.iscourseCategoryAddSuccess,prevIsAddSuccess])


    let allSubCategory = []
    if (props.courseSubCategorylist.success !== false && props.courseSubCategorylist.STATUSCODE !== 4000) {

        allSubCategory=props.courseSubCategorylist.response.docs
        
    }


    let pathEditView = window.location.href.split('/')[ window.location.href.split('/').length -2]
    console.log('pathEditView--------->',pathEditView);

    const isAddMode = id=='add' ? true:false;
    let definedid = ''
    let definedcategoryName = ''
    let definedsubcategoryId = []
    let defineddeleteId = ''
    let definedcourseImage = ''
    let defineddescription = ''
    let definedimageSavedUrl =''
    //deleteId
    if(props.courseCategorylist.response.docs.length === 1)
    {
        console.log('props.courseCategorylist.response.docs[0].SubCategory---',props.courseCategorylist.response.docs[0].subcategoryId);
        
        defineddeleteId = pathEditView == 'delete' ? props.courseCategorylist.response.docs[0]._id: ''
        definedid = props.courseCategorylist.response.docs[0]._id
        definedcategoryName = props.courseCategorylist.response.docs[0].categoryName
        definedsubcategoryId = props.courseCategorylist.response.docs[0].subcategoryId.length > 0 ? props.courseCategorylist.response.docs[0].subcategoryId.map( v=> v._id): []
        defineddescription = props.courseCategorylist.response.docs[0].description

    }
    console.log('definedsubcategoryId----',definedsubcategoryId);

    let valdationShape = {}
    let addEditFields = {}

    if(isAddMode)
    {

        addEditFields ={
            deleteId: defineddeleteId,
            categoryName: definedcategoryName,
            subcategoryId: definedsubcategoryId,
            description:defineddescription,
        }

        valdationShape= {
            categoryName: Yup.string()
                .required('Course Category Name is required')
        }

    }else{

        addEditFields ={
            deleteId: defineddeleteId,
            categoryId: definedid,
            categoryName: definedcategoryName,
            subcategoryId: definedsubcategoryId,
            description:defineddescription,
        }

        valdationShape= {

            categoryName: Yup.string()
                .required('Course Category Name is required')               
        }
    }


    const initialValues = addEditFields

    const validationSchema = Yup.object().shape(valdationShape);

    function onSubmit(fields) {

        console.log('fields---',fields);
        fields.subcategoryId = JSON.stringify(fields.subcategoryId)
        if (isAddMode) {

            props.postAddCategory(fields)

        } else {

            props.postEditCategory(fields)
        }
    }

    function onDeleteCategory(id){
        console.log('id---',id);
        props.postDeleteCategory({categoryId:id})
        setTimeout( ()=>{

            document.getElementById('close-delete-button-model').click() ;

        },500)

    }


    const Categories=({onChange, onBlur, name, categories, value, errors, touched}) => {
        console.log('value---------->',value);
        console.log('categories---------->',categories);
        //let savedValue= value.map( mappval => mappval._id)

        const handleChange = value => {
          // This is going to call setFieldValue and manually update values 
          onChange(name, value !== null ? value.map(v=>v.value) : [] );
        };
      
        const handleBlur = () => {
          // this is going to call setFieldTouched and manually update touched.topcis
          onBlur(name, true);
        };
  
        return (
          <div>
            <Select
              options={categories.map(v=>({value:v._id, label:v.subcategoryName}))}
              isMulti
              withAll={true}
              onChange={handleChange}
              onBlur={handleBlur}
              value={categories.map(v=>({value:v._id, label:v.subcategoryName})).filter(v=>value.includes(v.value))}

            />
          </div>);
      }
      

    return (
        <Fragment>
            <Header />
            <Menu />
        <Container fluid={true} className="page" style={{marginLeft: '313px'}}>
          <Row>
            <Col xs="12" md={{size:10, offset:0}}></Col>



            {/*   THIS PART FOR EDIT  START   */}

            { pathEditView == 'edit' && props.courseCategorylist.success !== false && props.courseCategorylist.response.docs.length == 1  && 
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit }>
                {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => {

                console.log('values.subcategoryId---->',values.subcategoryId);
                 //   let catId = values.subcategoryId.map(cat => cat._id)
                return (
                    <Form>

                        <h1>{isAddMode ? 'Add Course Category' : 'Edit Course Category'}</h1>
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
                        <Label for="categoryName" md={3}>Course Category Name</Label>
                        <Col md={9}>

                                <Field name="categoryName" type="text" className={'form-control' + (errors.categoryName && touched.categoryName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="categoryName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="subcategoryId" md={3}>Sub Category</Label>
                        <Col md={9}>
                        <Categories 
                            name={"subcategoryId"} 
                            categories={allSubCategory}
                            value={values.subcategoryId} 
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            errors={errors}
                            touched={touched}
                             />
                                             
                        </Col>
                        </FormGroup>
                        
                        <FormGroup row>
                        <Label for="description" md={3}>Description</Label>
                        <Col md={9}>

                        <Field className="form-control" component="textarea" id="description" name="description" value={values.description} />
                                             
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

            { pathEditView == 'view' && props.courseCategorylist.success !== false && props.courseCategorylist.response.docs.length == 1  && 
              <Formik initialValues={initialValues}>
                {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => {

                return (
                    <Form>

                    <h1>{isAddMode ? 'Add Course Category' : 'Edit Course Category'}</h1>
                    <FormGroup row>
                        <Col  md={12}>

                            <Link to={isAddMode ? '.' : '..'} className=" pull-right btn btn-link">Cancel</Link>

                        </Col>
                    </FormGroup>

                    <FormGroup row>
                    <Label for="categoryName" md={3}>Course Category Name</Label>
                    <Col md={9}>

                            <Field name="categoryName" type="text" className={'form-control' + (errors.categoryName && touched.categoryName ? ' is-invalid' : '')} />
                           
                            <ErrorMessage name="categoryName" component="div" className="invalid-feedback" />
                   
                    </Col>
                    </FormGroup>

                    <FormGroup row>
                    <Label for="subcategoryId" md={3}>Sub Category</Label>
                    <Col md={9}>
                    <Categories 
                        name={"subcategoryId"} 
                        categories={allSubCategory}
                        value={values.subcategoryId} 
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        errors={errors}
                        touched={touched}
                         />
                                         
                    </Col>
                    </FormGroup>
                    

                    <FormGroup row>
                    <Label for="description" md={3}>Description</Label>
                    <Col md={9}>

                    <Field className="form-control" component="textarea" id="description" name="description" value={values.description} />
                                         
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

            {/*   THIS PART FOR VIEW  END   */}




            {/*   THIS PART FOR ADD  START   */}

            { isAddMode  && 
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => {

                return (
                    <Form>

                        <h1>{isAddMode ? 'Add Course Category' : 'Edit Course Category'}</h1>
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
                        <Label for="categoryName" md={3}>Course Category Name</Label>
                        <Col md={9}>

                                <Field name="categoryName" type="text" className={'form-control' + (errors.categoryName && touched.categoryName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="categoryName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="subcategoryId" md={3}>Sub Category</Label>
                        <Col md={9}>

                            <Categories 
                            name={"subcategoryId"} 
                            categories={allSubCategory}
                            value={values.subcategoryId} 
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            errors={errors}
                            touched={touched}
                             />
                                             
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="description" md={3}>Description</Label>
                        <Col md={9}>

                        <Field className="form-control" component="textarea" id="description" name="description" value={values.description} />
                                             
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

            { pathEditView == 'delete' && props.courseCategorylist.success !== false && props.courseCategorylist.response.docs.length == 1  && 
        
               <div className="modal show" id="modal-form-delete">
                            <input type="hidden" name="deleteId" ></input>

                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                    <Link to={'/content/courseCategory'}>

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

                                                <Link to={'/content/courseCategory'} className="btn btn-link">

                                                    <button type="button" className="btn btn-default" id="close-delete-button-model"
                                                        data-dismiss="modal">Close</button>

                                                </Link>
                                            
                                                    <button type="submit" className="btn btn-primary" onClick = { () => { onDeleteCategory(id) } }
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

const mapStateToProps = ({courseCategoryReducer, courseSubCategoryReducer}) => ({

    courseCategorylist:courseCategoryReducer.courseCategorylist,
    iscourseCategorySuccess:courseCategoryReducer.iscourseCategorySuccess,
    iscourseCategoryAddSuccess:courseCategoryReducer.iscourseCategoryAddSuccess,
    courseSubCategorylist:courseSubCategoryReducer.courseSubCategorylist

})

export default connect(mapStateToProps, { postAddCategory, postEditCategory, postDeleteCategory, fetchlistCategory, fetchlistSubCategory })(CourseForm)
