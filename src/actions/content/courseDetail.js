import axios from 'axios'
import { type } from 'os';
import { baseUrl, localUrl } from '../../shared/baseUrl'
import { getToken } from '../admin'


export const FETCH_COURSEDETAIL_LIST_START = 'FETCH_COURSEDETAIL_LIST_START'
export const FETCH_COURSEDETAIL_LIST_SUCCESS = 'FETCH_COURSEDETAIL_LIST_SUCCESS'
export const FETCH_COURSEDETAIL_LIST_FAILURE = 'FETCH_COURSEDETAIL_LIST_FAILURE'

export const FETCH_COURSEMASTERDETAIL_LIST_START = 'FETCH_COURSEMASTERDETAIL_LIST_START'
export const FETCH_COURSEMASTERDETAIL_LIST_SUCCESS = 'FETCH_COURSEMASTERDETAIL_LIST_SUCCESS'
export const FETCH_COURSEMASTERDETAIL_LIST_FAILURE = 'FETCH_COURSEMASTERDETAIL_LIST_FAILURE'

export const POST_COURSEDETAIL_ADD_START = 'POST_COURSEDETAIL_ADD_START'
export const POST_COURSEDETAIL_ADD_SUCCESS = 'POST_COURSEDETAIL_ADD_SUCCESS'
export const POST_COURSEDETAIL_ADD_FAILURE = 'POST_COURSEDETAIL_ADD_FAILURE'

export const POST_COURSEDETAIL_EDIT_START = 'POST_COURSEDETAIL_EDIT_START'
export const POST_COURSEDETAIL_EDIT_SUCCESS = 'POST_COURSEDETAIL_EDIT_SUCCESS'
export const POST_COURSEDETAIL_EDIT_FAILURE = 'POST_COURSEDETAIL_EDIT_FAILURE'

export const POST_COURSEDETAIL_DELETE_START = 'POST_COURSEDETAIL_DELETE_START'
export const POST_COURSEDETAIL_DELETE_SUCCESS = 'POST_COURSEDETAIL_DELETE_SUCCESS'
export const POST_COURSEDETAIL_DELETE_FAILURE = 'POST_COURSEDETAIL_DELETE_FAILURE'



//...................COURSEDETAIL ...............................
export const fetchlistCourseDetail = (id,page,limit,searchName) => dispatch =>{

    console.log('fetchlistCourseDetail--->', id);
    let token = JSON.parse(getToken()).token

    dispatch( {type:'FETCH_COURSEDETAIL_LIST_START'} )

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
      
    axios
    .get(baseUrl+'api/detailCourses/', {
        headers: headers,
        params:{
            ...(id ? { detailCourseId: id } : {}),
            ...(searchName ? { searchName: searchName } : {}),
            ...(page ? { page: page } : {}),
            ...(limit ? { limit: limit } : {})
        }
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'FETCH_COURSEDETAIL_LIST_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'FETCH_COURSEDETAIL_LIST_FAILURE', payload: err.response  } )
        
    })
}

export const fetchlistMasterCourseDetail = (id,page,limit,searchName) => dispatch =>{

    console.log('fetchlistCourseDetail--->', id);
    let token = JSON.parse(getToken()).token

    dispatch( {type:'FETCH_COURSEMASTERDETAIL_LIST_START'} )

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
      
    axios
    .get(baseUrl+'admin/listCourseDetail/', {
        headers: headers,
        params:{
            ...(id ? { detailCourseId: id } : {}),
            ...(searchName ? { searchName: searchName } : {}),
            ...(page ? { page: page } : {}),
            ...(limit ? { limit: limit } : {})
        }
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'FETCH_COURSEMASTERDETAIL_LIST_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'FETCH_COURSEMASTERDETAIL_LIST_FAILURE', payload: err.response  } )
        
    })
}

export const postAddCourseDetail = postData => dispatch =>{

    dispatch( {type:'POST_COURSEDETAIL_ADD_START'} )

    console.log('post add user data--->', JSON.parse(getToken()).token);
    let token = JSON.parse(getToken()).token

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token
      }

    const formData = new FormData();
    for (const key in postData) {
        formData.append(key, postData[key]);

        if(key != 'curriculum')
        {
            formData.append(key, postData[key]);

        }

        if(key == 'relatedCourseDetailId')
        {
            formData.append(key, JSON.stringify(postData[key]) );

        }

    }

    if(postData.curriculum.length > 0)
    {
        postData.curriculum.map( (curr, i) => {

            if(!curr.deleted){
                console.log('curr.media typeof ---->',typeof(curr.media));
                i= curr._id ? curr._id : i
                formData.append(`curriculum${i}`, curr.media)
                formData.append(`curriculumTitle${i}`, curr.title)    
            }
        })
       
    }

    console.log('Post after edit data--->', postData);


    axios
    .post(baseUrl+'admin/addDetailCourse/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_COURSEDETAIL_ADD_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_COURSEDETAIL_ADD_FAILURE', payload: err.response  } )
        
    })
}

export const postEditCourseDetail = postData => dispatch =>{

    dispatch( {type:'POST_COURSEDETAIL_EDIT_START'} )

    console.log('Post initial edit data--->', postData);
    let token = JSON.parse(getToken()).token

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token
      }

    const formData = new FormData();
    for (const key in postData) {
        console.log('key----',key);
        
        if(key != 'curriculum')
        {
            formData.append(key, postData[key]);

        }
        if(key == 'relatedCourseDetailId')
        {
            formData.append(key, JSON.stringify(postData[key]) );

        }
    }

    if(postData.curriculum.length > 0)
    {
        postData.curriculum.map( (curr, i) => {

            if(!curr.deleted){
                console.log('curr.media typeof ---->',typeof(curr.media));
                i= curr._id ? curr._id : i
                formData.append(`curriculum${i}`, curr.media)
                formData.append(`curriculumTitle${i}`, curr.title)    
            }
        })
       
    }

    console.log('Post after edit data--->', postData);

    axios
    .post(baseUrl+'admin/editDetailCourse/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_COURSEDETAIL_EDIT_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_COURSEDETAIL_EDIT_FAILURE', payload: err.response  } )
        
    })
}

export const postDeleteCourseDetail = postData => dispatch =>{

    dispatch( {type:'POST_COURSEDETAIL_DELETE_START'} )

    console.log('Post delete data--->', postData);
    let token = JSON.parse(getToken()).token

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }

    axios
    .post(baseUrl+'api/deleteDetailCourse/',postData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_COURSEDETAIL_DELETE_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_COURSEDETAIL_DELETE_FAILURE', payload: err.response  } )
        
    })
}