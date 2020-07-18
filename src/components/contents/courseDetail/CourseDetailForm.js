
import React, { Component, Fragment, useEffect, useState, useRef, useParams } from 'react'
import { runInThisContext } from 'vm';
import { withFormik, Form, Field, Formik, ErrorMessage, FieldArray } from 'formik'
import { FormGroup, Button, Input, Label } from 'reactstrap';
import { Container, Row, Col, Media } from 'reactstrap';
import { Prompt, Link, useHistory  } from 'react-router-dom'
import { baseUrl, localUrl } from '../../../shared/baseUrl'
import Select from 'react-select';
import ReactDropzone from "react-dropzone";
import Thumb from './Thumb';
import * as Yup from 'yup'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { fetchlistCourseDetail, fetchlistMasterCourseDetail, postAddCourseDetail, postEditCourseDetail, postDeleteCourseDetail } from '../../../actions/content/courseDetail'

import { fetchCourses } from '../../../actions/content/course'
import { fetchlistCategory } from '../../../actions/content/courseCategory'
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

const CourseDetailForm = props => {
   // console.log('match values--->',match);
   const history = useHistory()

  // console.log('ids------------------------>',ids);
   
   var lastIndex = window.location.href.lastIndexOf("/")
   console.log('lastIndex----',lastIndex);

   var id = window.location.href.substring(lastIndex + 1); //after this id="true"
   console.log('path----',id);
   const [content, setoverview] = useState('');

    useEffect( ()=>(
        props.fetchlistCourseDetail(id),
        props.fetchlistMasterCourseDetail(),
        props.fetchCourses(),
        props.fetchlistCategory(),
        props.fetchlistSubCategory()
       
    ), [])
    console.log('props values--->',props);

    const prevIsSuccess = usePrevious(props.iscourseDetailSuccess);
    const prevIsAddSuccess = usePrevious(props.iscourseDetailAddSuccess);
    

    useEffect( ()=>{
        console.log('iscourseDetailSuccess hitted',props.iscourseDetailSuccess);

        if(prevIsSuccess === false && props.iscourseDetailSuccess === true)
        {
            history.goBack() 
        }

        if(prevIsAddSuccess === false && props.iscourseDetailAddSuccess === true)
        {
            history.goBack() 
        }

    }, [props.iscourseDetailSuccess,prevIsSuccess,props.iscourseDetailAddSuccess,prevIsAddSuccess])


    let allSubCategory = []
    let allCategory = []
    let allCourse = []
    let allCourseDetail = []

    if (props.courseCategorylist.success !== false && props.courseCategorylist.STATUSCODE !== 4000) {
        allCategory=props.courseCategorylist.response.docs
        
    }

    if (props.courseSubCategorylist.success !== false && props.courseSubCategorylist.STATUSCODE !== 4000) {

        allSubCategory=props.courseSubCategorylist.response.docs
        
    }

    if (props.list.success !== false && props.list.STATUSCODE !== 4000) {
        allCourse=props.list.response.docs
    }

    if (props.courseMasterDetaillist.success !== false && props.courseMasterDetaillist.STATUSCODE !== 4000) {
        allCourseDetail=props.courseMasterDetaillist.response.docs
    }

    let pathEditView = window.location.href.split('/')[ window.location.href.split('/').length -2]
    console.log('pathEditView--------->',pathEditView);

    const isAddMode = id=='add' ? true:false;
    let definedid = ''
    let definedcourseName = ''
    let definedsubcategoryId = ''
    let definedcategoryId = ''
    let definedcourseId = ''
    let defineddeleteId = ''
    let definedcourseImage = ''
    let defineddescription = ''
    let definedimageSavedUrl =''
    let definedoverview =''
    let definedlearningElement =''
    let definedcurriculum = []
    let definedrelatedCourseDetailId = []
    
    //deleteId
    if(props.courseDetaillist.response.docs.length === 1)
    {
        console.log('props.courseDetaillist.response.docs[0].SubCategory---',props.courseDetaillist.response.docs[0].SubCategory);
        
        defineddeleteId = pathEditView == 'delete' ? props.courseDetaillist.response.docs[0]._id: ''
        definedid = props.courseDetaillist.response.docs[0]._id
        definedcourseName = props.courseDetaillist.response.docs[0].courseName
        definedcourseImage = props.courseDetaillist.response.docs[0].courseImage
        definedimageSavedUrl = baseUrl+props.courseDetaillist.response.docs[0].courseImage
        definedoverview = props.courseDetaillist.response.docs[0].overview
        definedlearningElement = props.courseDetaillist.response.docs[0].learningElement

        definedcurriculum = props.courseDetaillist.response.docs[0].curriculum.length>0 ? props.courseDetaillist.response.docs[0].curriculum: []
        definedrelatedCourseDetailId = props.courseDetaillist.response.docs[0].relatedCourseDetailId.length > 0 ? props.courseDetaillist.response.docs[0].relatedCourseDetailId: []
        
        definedsubcategoryId = props.courseDetaillist.response.docs[0].SubCategory !== null ? props.courseDetaillist.response.docs[0].SubCategory._id: ''
        definedcategoryId = props.courseDetaillist.response.docs[0].Category !== null ? props.courseDetaillist.response.docs[0].Category._id: ''
        definedcourseId = props.courseDetaillist.response.docs[0].Courses !== null ? props.courseDetaillist.response.docs[0].Courses._id: ''
        defineddescription = props.courseDetaillist.response.docs[0].description

    }
    //console.log('curriculumId----',curriculumId);
    
    let valdationShape = {}
    let addEditFields = {}

    if(isAddMode)
    {

        addEditFields ={
            deleteId: defineddeleteId,
            courseName: definedcourseName,
            curriculum: definedcurriculum,
            courseImage: definedcourseImage,
            imageSavedUrl: definedimageSavedUrl,
            overview: definedoverview,
            learningElement: definedlearningElement,

            courseId: definedcourseId,
            relatedCourseDetailId: definedrelatedCourseDetailId,
            subcategoryId: definedsubcategoryId,
            categoryId: definedcategoryId,
            description:defineddescription,
        }

        valdationShape= {
            courseName: Yup.string()
                .required('Course Category Name is required')
        }

    }else{

        addEditFields ={
            deleteId: defineddeleteId,
            detailCourseId: definedid,
            courseName: definedcourseName,
            curriculum: definedcurriculum,
            relatedCourseDetailId: definedrelatedCourseDetailId,
            courseImage: definedcourseImage,
            imageSavedUrl: definedimageSavedUrl,
            overview: definedoverview,
            learningElement: definedlearningElement,
            courseId: definedcourseId,
            categoryId: definedcategoryId,
            subcategoryId: definedsubcategoryId,
            description:defineddescription,
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

        // fields.courseId    = JSON.stringify(fields.courseId)
        // fields.categoryId    = JSON.stringify(fields.categoryId)
        // fields.subcategoryId = JSON.stringify(fields.subcategoryId)

        if (isAddMode) {

            props.postAddCourseDetail(fields)

        } else {

            props.postEditCourseDetail(fields)
        }

    }

    function onDeleteCategory(id){
        console.log('id---',id);
        props.postDeleteCourseDetail({detailCourseId:id})
        setTimeout( ()=>{

            document.getElementById('close-delete-button-model').click() ;

        },500)

    }

    function onChangeCkeditor(evt){
        console.log("onChange fired with event info: ", evt);
        var newContent = evt.editor.getData();
        setoverview(newContent)

        // this.setState({
        //   content: newContent
        // })
      }

    
            const roundButtonStyle = {
                borderRadius: '50%'
            }
            const Courses=({onChange, onBlur, name, courses, value, errors, touched, mode}) => {
                console.log('name---------->',name);
                console.log('value---------->',value);
                console.log('courses---------->',courses);
                //let savedValue= value.map( mappval => mappval._id)

                const handleChange = value => {
                // This is going to call setFieldValue and manually update values 
                onChange(name,  value.value  );
                };
            
                const handleBlur = () => {
                // this is going to call setFieldTouched and manually update touched.topcis
                onBlur(name, true);
                };
        
                return (
                <div>
                    <Select
                    options={courses.map(v=>({value:v._id, label:v.courseName, isDisabled: mode ==='view'? true:false}))}
                    withAll={true}
                    isDisabled={mode ==='view'? true:false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={courses.map(v=>({value:v._id, label:v.courseName})).filter(v=>value ===v.value)}

                    />
                </div>);
            }

            const RelatedCourseDetail=({onChange, onBlur, name, relatedcoursedetail, value, errors, touched,mode}) => {
                console.log('value---------->',value);
                console.log('relatedcoursedetail---------->',relatedcoursedetail);
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
                    options={relatedcoursedetail.map(v=>({value:v._id, label:v.courseName}))}
                    isMulti
                    withAll={true}
                    isDisabled={mode == 'view'? true:false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={relatedcoursedetail.map(v=>({value:v._id, label:v.courseName})).filter(v=>value.includes(v.value))}

                    />
                </div>);
            }

            const SubCategories=({onChange, onBlur, name, subCategories, value, errors, touched, mode}) => {
                console.log('name---------->',name);
                console.log('value---------->',value);
                console.log('subCategories---------->',subCategories);
                //let savedValue= value.map( mappval => mappval._id)

                const handleChange = value => {
                // This is going to call setFieldValue and manually update values 
                onChange(name,  value.value  );
                };
            
                const handleBlur = () => {
                // this is going to call setFieldTouched and manually update touched.topcis
                onBlur(name, true);
                };
        
                return (
                <div>
                    <Select
                    options={subCategories.map(v=>({value:v._id, label:v.subcategoryName, isDisabled: mode ==='view'? true:false}))}
                    withAll={true}
                    onChange={handleChange}
                    isDisabled={mode ==='view'? true:false}

                    onBlur={handleBlur}
                    value={subCategories.map(v=>({value:v._id, label:v.subcategoryName})).filter(v=>value ===v.value)}

                    />
                </div>);
            }

            const Categories=({onChange, onBlur, name, categories, value, errors, touched, mode}) => {
                console.log('value---------->',value);
                console.log('categories---------->',categories);
                //let savedValue= value.map( mappval => mappval._id)

                const handleChange = value => {
                // This is going to call setFieldValue and manually update values 
                onChange(name, value.value );
                };
            
                const handleBlur = () => {
                // this is going to call setFieldTouched and manually update touched.topcis
                onBlur(name, true);
                };
        
                return (
                <div>
                    <Select
                    options={categories.map(v=>({value:v._id, label:v.categoryName, isDisabled: mode ==='view'? true:false}))}
                    withAll={true}
                    onChange={handleChange}
                    isDisabled={mode ==='view'? true:false}

                    onBlur={handleBlur}
                    value={categories.map(v=>({value:v._id, label:v.categoryName})).filter(v=>value === v.value)}

                    />
                </div>);
            }

            const Curriculum = ({handleChange, prefix, curriculum, values, setFieldValue, mode,id}) => {
                console.log('curriculum----', curriculum);
                
                return(
                <>
                    <FormGroup row className="mb-0">
                    <Label  md={3}>Curriculum</Label>
                    </FormGroup>
                    <FieldArray
                    name={prefix}
                    render={ arrayHelpers => (
                        <>
                        { curriculum.map( (photo,ix) => {
                            console.log('photo---->',(photo));
                            //ix = photo._id ? photo._id : ix
                            return(
                            photo.deleted ? 
                            <></>
                            :
                            <React.Fragment key={ix}>
                            {mode != 'view' ?
                            <FormGroup row className="mb-4">
                                <Col md={{size:3, offset:3}}>
                                { photo.media && photo.media.length > 0  ?
                                    <Media center >

                                <ReactDropzone onDrop={ files => {
                                    setFieldValue(`curriculum[${ix}].media`,files[0]);
                                    //setFieldValue(`venue.photos[${ix}].file`,files[0]);
                                }} >
                                {
                                    (values.curriculum[ix].media === undefined) ? 
                                    <div className="dropzoneBox d-flex justify-content-center align-items-center">
                                        Drop Curriculum File here.<br />
                                        Or click to select a file.
                                    </div>
                                    :
                                    <span key={ix}  >{values.curriculum[ix].media.name ? values.curriculum[ix].media.name: values.curriculum[ix].media.split('/')[3]}</span>
                                }                               
                                </ReactDropzone>
                                    {/*typeof(photo.media) == 'string' ? <span className="formImg" alt="file not uploaded" > {photo.media.split('/')[3]} </span>
                                :photo.media.name */}
                                </Media>
                                    :
                                    
                                    <ReactDropzone onDrop={ files => {
                                        setFieldValue(`curriculum[${ix}].media`,files[0]);
                                    //setFieldValue(`venue.photos[${ix}].file`,files[0]);
                                }} >
                                {
                                
                                    (values.curriculum[ix].media === undefined) ? 
                                    <div className="dropzoneBox d-flex justify-content-center align-items-center">
                                        Drop Curriculum File here.<br />
                                        Or click to select a file.
                                    </div>
                                    :
                                    <span key={ix}  >{values.curriculum[ix].media.name}</span>
                                }                               
                                </ReactDropzone>

                                }
                                </Col>
                                
                                <Col md={5}>
                                <Input onChange={handleChange} name={`curriculum[${ix}].title`} type="text" value={photo.title} />
                                </Col>
                                <Col md={1} className="text-center" title="Delete">
                                <Button style={roundButtonStyle} 
                                    color="danger"
                                    // Mark as deleted, instead of removing:
                                    onClick={() => {
                                        console.log('curriculum with ix -------',curriculum, ix);
                                    setFieldValue(`curriculum[${ix}].deleted`,true)

                                    // curriculum.splice(ix,1)
                                        console.log('curriculum after delete-------',curriculum);

                                    }
                                    }
                                ><span className="fa fa-remove fa-sm"></span></Button>
                                </Col>
                            </FormGroup>
                            :
                            <FormGroup row className="lg-4">
                            <Col md={{size:3, offset:3}}>
                            <a href= {`${baseUrl}uploads/courseDetail/curriculum/${id}/${values.curriculum[ix].media.split('/')[3]}`} target="_blank" download>
                            <Button  
                                    color="success"
                                    // Mark as deleted, instead of removing:
                                    onClick={() => {

                                    }
                                    }
                                ><span className="fa fa-download fa-sm"></span></Button>
                            </a>
                            <span key={ix}  >{values.curriculum[ix].media.name ? values.curriculum[ix].media.name: values.curriculum[ix].media.split('/')[3]}</span>
                                            
                            </Col>

                            <Col md={5}>
                                <Input disabled={true} name={`curriculum[${ix}].title`} type="text" value={photo.title} />
                            </Col> 

                            </FormGroup>
                            }


                            </React.Fragment>
                            )}
                        )}
                        {mode != 'view' &&
                        <FormGroup row className="mb-4">
                            <Col md={{size:3, offset:3}}>
                            <Button color="primary" onClick={() => arrayHelpers.push({title:''})}>Add Curriculum</Button>
                            </Col>
                        </FormGroup>
                        }
                        </>
                    )}
                    />
                </>
                );
            }


    return (
        <div className="wrapper">
            <Header />
            <Menu />
           <div className="content-wrapper" style={{minHeight:'0px'}}>
            <Container fluid={true} className="page" style={{marginLeft: '113px'}}>
            <Row>
                <Col xs="12" md={{size:10, offset:0}}></Col>



                {/*   THIS PART FOR EDIT  START   */}

                { pathEditView == 'edit' && props.courseDetaillist.success !== false && props.courseDetaillist.response.docs.length == 1  && 
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit }>
                    {({ values, errors, touched, handleChange, isSubmitting, setFieldValue, setFieldTouched }) => {

                    console.log('values.relatedCourseDetailId---->',values.relatedCourseDetailId);
                    //   let catId = values.subcategoryId.map(cat => cat._id)
                    return (
                        <Form>

                        <h1>{isAddMode ? 'Add Course Detail' : 'Edit Course Detail'}</h1>
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
                        <Label for="courseName" md={3}>Course Detail Name</Label>
                        <Col md={9}>

                                <Field name="courseName" type="text" className={'form-control' + (errors.courseName && touched.courseName ? ' is-invalid' : '')} />
                                
                                <ErrorMessage name="courseName" component="div" className="invalid-feedback" />
                        
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                            <Label for="courseImage" md={3}>Course Image</Label>
                            <Col md={9}>

                            <input id="file" name="courseImage"  type="file" accept="image/*" onChange={(e) => {
                                        e.preventDefault();

                                        let reader = new FileReader();
                                        let file = e.target.files[0];
                                    
                                        reader.onloadend = () => {
                                            console.log('reader.result---',reader.result);
                                            
                                            setFieldValue(`imagePreviewUrl`, reader.result)
                                            setFieldValue(`courseImage`, file)
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
                        <Label for="overview" md={3}>Overview</Label>
                        <Col md={9}>

                            <CKEditor
                                editor={ ClassicEditor }
                                data={values.overview}
                                disabled={false}
                                onInit={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFieldValue(`overview`, data)
                                    console.log( { event, editor, data } );
                                } }
                                onBlur={ ( event, editor ) => {
                                    console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                    console.log( 'Focus.', editor );
                                } }
                            />

                            <ErrorMessage name="overview" component="div" className="invalid-feedback" />
                        
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                            <Label for="learningElement" md={3}>Learning Element</Label>
                            <Col md={9}>

                            <CKEditor
                                editor={ ClassicEditor }
                                disabled={false}
                                data={values.learningElement}
                                onInit={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFieldValue(`learningElement`, data)
                                    console.log( { event, editor, data } );
                                } }
                                onBlur={ ( event, editor ) => {
                                    console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                    console.log( 'Focus.', editor );
                                } }
                            />                                
                            <ErrorMessage name="learningElement" component="div" className="invalid-feedback" />
                            
                            </Col>
                        </FormGroup>                    

                        <FormGroup row>
                            <Label for="relatedCourseDetailId" md={3}>Related Course Detail</Label>
                            <Col md={9}>

                                <RelatedCourseDetail 
                                name={"relatedCourseDetailId"} 
                                relatedcoursedetail={allCourseDetail}
                                value={values.relatedCourseDetailId} 
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                errors={errors}
                                touched={touched}
                                mode={"edit"} 

                                    />
                            </Col>
                        </FormGroup>
                        
                        <FormGroup row>
                        <Label for="courseId" md={3}>Course</Label>
                        <Col md={9}>

                            <Courses 
                            name={"courseId"} 
                            courses={allCourse}
                            value={values.courseId} 
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            errors={errors}
                            touched={touched}
                            mode={"edit"}
                                />
                                                
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
                            mode={"edit"}

                                />
                                                
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="subcategoryId" md={3}>Sub Category</Label>
                        <Col md={9}>
                        <SubCategories 
                            name={"subcategoryId"} 
                            subCategories={allSubCategory}
                            value={values.subcategoryId} 
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            errors={errors}
                            touched={touched}
                            mode={"edit"}

                            />
                                            
                        </Col>
                        </FormGroup>
                            

                        <Curriculum 
                            handleChange={handleChange} 
                            prefix="curriculum" 
                            curriculum={values.curriculum} 
                            values={values} 
                            setFieldValue={setFieldValue}
                            mode={"edit"}

                         />

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

                { pathEditView == 'view' && props.courseDetaillist.success !== false && props.courseDetaillist.response.docs.length == 1  && 
                <Formik initialValues={initialValues}>
                    {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched, handleChange }) => {

                    return (
                        <Form>


                        <h1>{isAddMode ? 'Add Course Detail' : 'View Course Detail'}</h1>
                        <FormGroup row>
                        <Col  md={12}>

                            <Link to={isAddMode ? '.' : '..'} className=" pull-right btn btn-link">Cancel</Link>

                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="courseName" md={3}>Course Detail Name</Label>
                        <Col md={9}>

                                <Field  disabled={true}  name="courseName" type="text" className={'form-control' + (errors.courseName && touched.courseName ? ' is-invalid' : '')} />
                            
                                <ErrorMessage name="courseName" component="div" className="invalid-feedback" />
                    
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="courseImage" md={3}>Course Image</Label>
                        <Col md={9}>

                            {
                                values.imageSavedUrl && 
                                
                                <img src={values.imageSavedUrl} style={{height:'150px', width:'150px'}} /> 
                                
                            } 
                        
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="overview" md={3}>Overview</Label>
                        <Col md={9}>

                            <CKEditor
                                editor={ ClassicEditor }
                                data={values.overview}
                                disabled={true}
                                onInit={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFieldValue(`overview`, data)
                                    console.log( { event, editor, data } );
                                } }
                                onBlur={ ( event, editor ) => {
                                    console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                    console.log( 'Focus.', editor );
                                } }
                            />

                            <ErrorMessage name="overview" component="div" className="invalid-feedback" />
                        
                        </Col>
                        </FormGroup>


                        <FormGroup row>
                            <Label for="learningElement" md={3}>Learning Element</Label>
                            <Col md={9}>

                            <CKEditor
                                editor={ ClassicEditor }
                                disabled={true}
                                data={values.learningElement}
                                onInit={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFieldValue(`learningElement`, data)
                                    console.log( { event, editor, data } );
                                } }
                                onBlur={ ( event, editor ) => {
                                    console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                    console.log( 'Focus.', editor );
                                } }
                            />                                
                            <ErrorMessage name="learningElement" component="div" className="invalid-feedback" />
                            
                            </Col>
                        </FormGroup>                      

                 
                        <FormGroup row>
                            <Label for="relatedCourseDetailId" md={3}>Related Course Detail</Label>
                            <Col md={9}>

                                <RelatedCourseDetail 
                                name={"relatedCourseDetailId"} 
                                relatedcoursedetail={allCourseDetail}
                                value={values.relatedCourseDetailId} 
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                errors={errors}
                                touched={touched}
                                mode={"view"}
                                    />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="courseId" md={3}>Course</Label>
                        <Col md={9}>

                            <Courses 
                            name={"courseId"} 
                            courses={allCourse}
                            value={values.courseId} 
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            errors={errors}
                            touched={touched}
                            mode={"view"}
                                />
                                                
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
                            mode={"view"}

                                />
                                                
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label for="subcategoryId" md={3}>Sub Category</Label>
                        <Col md={9}>
                        <SubCategories 
                            name={"subcategoryId"} 
                            subCategories={allSubCategory}
                            value={values.subcategoryId} 
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            errors={errors}
                            touched={touched}
                            mode={"view"}

                            />
                                            
                        </Col>
                        </FormGroup>
                        
                        <Curriculum 
                            handleChange={handleChange} 
                            prefix="curriculum" 
                            curriculum={values.curriculum} 
                            values={values} 
                            setFieldValue={setFieldValue} 
                            mode={"view"}
                            id={id}

                        />


                        <FormGroup row>
                        <Col md={9}>

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
                    {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched, handleChange }) => {

                    return (
                        <Form>

                        <h1>{isAddMode ? 'Add Course Detail' : 'Edit Course Detail'}</h1>
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
                    <Label for="courseName" md={3}>Course Detail Name</Label>
                    <Col md={9}>

                            <Field name="courseName" type="text" className={'form-control' + (errors.courseName && touched.courseName ? ' is-invalid' : '')} />
                            
                            <ErrorMessage name="courseName" component="div" className="invalid-feedback" />
                    
                    </Col>
                    </FormGroup>


                    <FormGroup row>
                        <Label for="courseImage" md={3}>Course Image</Label>
                        <Col md={9}>

                        <input id="file" name="courseImage"  type="file" accept="image/*" onChange={(e) => {
                                    e.preventDefault();

                                    let reader = new FileReader();
                                    let file = e.target.files[0];
                                
                                    reader.onloadend = () => {
                                        console.log('reader.result---',reader.result);
                                        
                                        setFieldValue(`imagePreviewUrl`, reader.result)
                                        setFieldValue(`courseImage`, file)
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
                        <Label for="overview" md={3}>Overview</Label>
                        <Col md={9}>

                            <CKEditor
                                editor={ ClassicEditor }
                                data={values.overview}
                                disabled={false}
                                onInit={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFieldValue(`overview`, data)
                                    console.log( { event, editor, data } );
                                } }
                                onBlur={ ( event, editor ) => {
                                    console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                    console.log( 'Focus.', editor );
                                } }
                            />

                            <ErrorMessage name="overview" component="div" className="invalid-feedback" />
                        
                        </Col>
                    </FormGroup>


                    <FormGroup row>
                            <Label for="learningElement" md={3}>Learning Element</Label>
                            <Col md={9}>

                            <CKEditor
                                editor={ ClassicEditor }
                                disabled={false}
                                data={values.learningElement}
                                onInit={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFieldValue(`learningElement`, data)
                                    console.log( { event, editor, data } );
                                } }
                                onBlur={ ( event, editor ) => {
                                    console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                    console.log( 'Focus.', editor );
                                } }
                            />                                
                            <ErrorMessage name="learningElement" component="div" className="invalid-feedback" />
                            
                            </Col>
                    </FormGroup>                    

                    <FormGroup row>
                        <Label for="relatedCourseDetailId" md={3}>Related Course Detail</Label>
                        <Col md={9}>

                            <RelatedCourseDetail 
                            name={"relatedCourseDetailId"} 
                            relatedcoursedetail={allCourseDetail}
                            value={values.relatedCourseDetailId} 
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            errors={errors}
                            touched={touched}
                            mode={"add"} 

                                />
                        </Col>
                    </FormGroup>
                    
                    <FormGroup row>
                    <Label for="courseId" md={3}>Course</Label>
                    <Col md={9}>

                        <Courses 
                        name={"courseId"} 
                        courses={allCourse}
                        value={values.courseId} 
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        errors={errors}
                        touched={touched}
                        mode={"add"}
                            />
                                            
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
                        mode={"add"}

                            />
                                            
                    </Col>
                    </FormGroup>

                    <FormGroup row>
                    <Label for="subcategoryId" md={3}>Sub Category</Label>
                    <Col md={9}>
                    <SubCategories 
                        name={"subcategoryId"} 
                        subCategories={allSubCategory}
                        value={values.subcategoryId} 
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        errors={errors}
                        touched={touched}
                        mode={"add"}

                        />
                                        
                    </Col>
                    </FormGroup>
                        

                    <Curriculum 
                        handleChange={handleChange} 
                        prefix="curriculum" 
                        curriculum={values.curriculum} 
                        values={values} 
                        setFieldValue={setFieldValue}
                        mode={"add"}

                     />

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

                { pathEditView == 'delete' && props.courseDetaillist.success !== false && props.courseDetaillist.response.docs.length == 1  && 
            
                <div className="modal show" id="modal-form-delete">
                                <input type="hidden" name="deleteId" ></input>

                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                        <Link to={'/content/courseDetail'}>

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

                                                    <Link to={'/content/courseDetail'} className="btn btn-link">

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
            </div>
        </div>
    );    


}

const mapStateToProps = ({courseCategoryReducer, courseSubCategoryReducer, detailCourseReducer, courseReducer}) => ({
    
    courseDetaillist:detailCourseReducer.courseDetaillist,
    courseMasterDetaillist:detailCourseReducer.courseMasterDetaillist,
    iscourseDetailAddSuccess:detailCourseReducer.iscourseDetailAddSuccess,
    iscourseDetailSuccess:detailCourseReducer.iscourseDetailSuccess,
    courseCategorylist:courseCategoryReducer.courseCategorylist,
    courseSubCategorylist:courseSubCategoryReducer.courseSubCategorylist,
    list:courseReducer.list

})

export default connect(mapStateToProps, 
                                        {
                                        fetchlistCourseDetail,
                                        fetchlistMasterCourseDetail,
                                        postAddCourseDetail,
                                        postEditCourseDetail,
                                        postDeleteCourseDetail,
                                        fetchlistCategory, 
                                        fetchlistSubCategory, 
                                        fetchCourses 
                                        }
                      )(CourseDetailForm)
