
import React, { Component, Fragment, useEffect, useState, useRef } from 'react'
import { runInThisContext } from 'vm';
import { withFormik, Form, Field, Formik, ErrorMessage } from 'formik'
import { FormGroup, Button, Input, Label } from 'reactstrap';
import { Container, Row, Col, Media } from 'reactstrap';
import { Prompt, Link, useHistory  } from 'react-router-dom'
import { baseUrl, localUrl } from '../../../shared/baseUrl'
import Select from 'react-select';

import * as Yup from 'yup'
import { postAddCourse, fetchCourses, postEditCourse, postDeleteCourse } from '../../../actions/content/course'
import { fetchlistCategory } from '../../../actions/content/courseCategory'

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
        props.fetchCourses(id),
        props.fetchlistCategory()

    ), [])
    console.log('props values--->',props);
    const prevIsSuccess = usePrevious(props.iscourseSuccess);    

    useEffect( ()=>{
        console.log('iscourseSuccess hitted',props.iscourseSuccess);

        if(prevIsSuccess === false && props.iscourseSuccess === true)
        {
            history.goBack() 
        }

    }, [props.iscourseSuccess,prevIsSuccess])


    let allCategory = []
    if (props.courseCategorylist.success !== false && props.courseCategorylist.STATUSCODE !== 4000) {

        allCategory=props.courseCategorylist.response.docs
        
    }


    let pathEditView = window.location.href.split('/')[ window.location.href.split('/').length -2]
    console.log('pathEditView--------->',pathEditView);

    const isAddMode = id=='add' ? true:false;
    let definedid = ''
    let definedcourseName = ''
    let definedcategoryId = []
    let defineddeleteId = ''
    let definedcourseImage = ''
    let defineddescription = ''
    let definedimageSavedUrl =''
    //deleteId
    if(props.list.response.docs.length == 1)
    {
        
        defineddeleteId = pathEditView == 'delete' ? props.list.response.docs[0]._id: ''
        definedid = props.list.response.docs[0]._id
        definedcourseName = props.list.response.docs[0].courseName
        definedcategoryId = props.list.response.docs[0].categoryId.length > 0 ? props.list.response.docs[0].categoryId.map( v=> v._id): []
        definedcourseImage = props.list.response.docs[0].courseImage
        defineddescription = props.list.response.docs[0].description
        definedimageSavedUrl = baseUrl+props.list.response.docs[0].courseImage

    }

    let valdationShape = {}
    let addEditFields = {}

    if(isAddMode)
    {

        addEditFields ={
            deleteId: defineddeleteId,
            courseName: definedcourseName,
            categoryId: definedcategoryId,
            courseImage:definedcourseImage,
            description:defineddescription,
            imagePreviewUrl:''
        }

        valdationShape= {
            courseName: Yup.string()
                .required('Course Name is required')
        }

    }else{

        addEditFields ={
            deleteId: defineddeleteId,
            courseId: definedid,
            courseName: definedcourseName,
            categoryId: definedcategoryId,
            courseImage:definedcourseImage,
            description:defineddescription,
            imageSavedUrl:definedimageSavedUrl,
            imagePreviewUrl:''
        }

        valdationShape= {

            courseName: Yup.string()
                .required('Course Name is required')               
        }
    }


    const initialValues = addEditFields

    const validationSchema = Yup.object().shape(valdationShape);

    function onSubmit(fields) {

        console.log('fields---',fields);
        fields.categoryId = JSON.stringify(fields.categoryId)
        if (isAddMode) {

            props.postAddCourse(fields)

        } else {

            props.postEditCourse(fields)
        }

    }

    function onDeleteCourse(id){
        console.log('id---',id);
        props.postDeleteCourse({courseId:id})
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
              options={categories.map(v=>({value:v._id, label:v.categoryName}))}
              isMulti
              withAll={true}
              onChange={handleChange}
              onBlur={handleBlur}
              value={categories.map(v=>({value:v._id, label:v.categoryName})).filter(v=>value.includes(v.value))}

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

            { pathEditView == 'edit' && props.list.success !== false && props.list.response.docs.length == 1  && 
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit }>
                {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => {

                console.log('values.categoryId---->',values.categoryId);
                 //   let catId = values.categoryId.map(cat => cat._id)
                return (
                    <Form>

                        <h1>{isAddMode ? 'Add Course' : 'Edit Course'}</h1>
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
                        <Label for="courseName" md={3}>Course Name</Label>
                        <Col md={9}>

                                <Field name="courseName" type="text" className={'form-control' + (errors.courseName && touched.courseName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="courseName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="categoryId" md={3}>Category</Label>
                        <Col md={9}>
                        <Categories 
                            name={"categoryId"} 
                            categories={allCategory}
                            value={values.categoryId} 
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            errors={errors}
                            touched={touched}
                             />
                                             
                        </Col>
                        </FormGroup>
                        

                        <FormGroup row>
                        <Label for="courseImage" md={3}>Course Image</Label>
                        <Col md={9}>

                        <input id="file" name="courseImage"  type="file" accept="image/*" onChange={(e) => {
                                    // console.log('event.target.files[0]--',event.target.files[0]);
                                    e.preventDefault();

                                    let reader = new FileReader();
                                    let file = e.target.files[0];
                                
                                    reader.onloadend = () => {
                                        console.log('reader.result---',reader.result);
                                        
                                        setFieldValue(`imagePreviewUrl`, reader.result)
                                        setFieldValue(`courseImage`, file)
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



            {/*   THIS PART FOR ADD  START   */}

            { isAddMode  && 
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => {

                return (
                    <Form>

                        <h1>{isAddMode ? 'Add Course' : 'Edit Course'}</h1>
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
                        <Label for="courseName" md={3}>Course Name</Label>
                        <Col md={9}>

                                <Field name="courseName" type="text" className={'form-control' + (errors.courseName && touched.courseName ? ' is-invalid' : '')} />
                               
                                <ErrorMessage name="courseName" component="div" className="invalid-feedback" />
                       
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="categoryId" md={3}>Category</Label>
                        <Col md={9}>

                            <Categories 
                            name={"categoryId"} 
                            categories={allCategory}
                            value={values.categoryId} 
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            errors={errors}
                            touched={touched}
                             />
                                             
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                        <Label for="courseImage" md={3}>Course Image</Label>
                        <Col md={9}>

                        <input id="file" name="courseImage"  type="file" accept="image/*" onChange={(e) => {
                                    // console.log('event.target.files[0]--',event.target.files[0]);
                                    e.preventDefault();

                                    let reader = new FileReader();
                                    let file = e.target.files[0];
                                
                                    reader.onloadend = () => {
                                        console.log('reader.result---',reader.result);
                                        
                                        setFieldValue(`imagePreviewUrl`, reader.result)
                                        setFieldValue(`courseImage`, file)
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

                                                <Link to={'/content/courses'} className="btn btn-link">

                                                    <button type="button" className="btn btn-default" id="close-delete-button-model"
                                                        data-dismiss="modal">Close</button>

                                                </Link>
                                            
                                                    <button type="submit" className="btn btn-primary" onClick = { () => { onDeleteCourse(id) } }
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

const mapStateToProps = ({courseReducer, courseCategoryReducer}) => ({

    list:courseReducer.list,
    iscourseSuccess:courseReducer.iscourseSuccess,
    courseCategorylist:courseCategoryReducer.courseCategorylist
})

export default connect(mapStateToProps, { postAddCourse, postEditCourse, postDeleteCourse, fetchCourses, fetchlistCategory })(CourseForm)
