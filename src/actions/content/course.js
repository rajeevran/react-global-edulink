import axios from 'axios'
import { type } from 'os';
import { baseUrl, localUrl } from '../../shared/baseUrl'
import { getToken } from '../../actions/admin'


export const FETCH_COURSE_LIST_START = 'FETCH_COURSE_LIST_START'
export const FETCH_COURSE_LIST_SUCCESS = 'FETCH_COURSE_LIST_SUCCESS'
export const FETCH_COURSE_LIST_FAILURE = 'FETCH_COURSE_LIST_FAILURE'

export const POST_COURSE_ADD_START = 'POST_COURSE_ADD_START'
export const POST_COURSE_ADD_SUCCESS = 'POST_COURSE_ADD_SUCCESS'
export const POST_COURSE_ADD_FAILURE = 'POST_COURSE_ADD_FAILURE'

export const POST_COURSE_EDIT_START = 'POST_COURSE_EDIT_START'
export const POST_COURSE_EDIT_SUCCESS = 'POST_COURSE_EDIT_SUCCESS'
export const POST_COURSE_EDIT_FAILURE = 'POST_COURSE_EDIT_FAILURE'

export const POST_COURSE_DELETE_START = 'POST_COURSE_DELETE_START'
export const POST_COURSE_DELETE_SUCCESS = 'POST_COURSE_DELETE_SUCCESS'
export const POST_COURSE_DELETE_FAILURE = 'POST_COURSE_DELETE_FAILURE'



//...................COURSE ...............................
export const fetchCourses = (id,page,limit,searchName) => dispatch =>{

    console.log('LOGIN auth data--->', JSON.parse(getToken()).token);
    let token = JSON.parse(getToken()).token

    dispatch( {type:'FETCH_COURSE_LIST_START'} )

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
      
    axios
    .get(baseUrl+'admin/listCourses/', {
        headers: headers,
        params:{
            ...(id ? { courseId: id } : {}),
            ...(searchName ? { searchName: searchName } : {}),
            ...(page ? { page: page } : {}),
            ...(limit ? { limit: limit } : {})
        }
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'FETCH_COURSE_LIST_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'FETCH_COURSE_LIST_FAILURE', payload: err.response  } )
        
    })
}

export const postAddCourse = postData => dispatch =>{

    dispatch( {type:'POST_COURSE_ADD_START'} )

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
    }

    axios
    .post(baseUrl+'admin/addCourse/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_COURSE_ADD_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_COURSE_ADD_FAILURE', payload: err.response  } )
        
    })
}

export const postEditCourse = postData => dispatch =>{

    dispatch( {type:'POST_COURSE_EDIT_START'} )

    console.log('Post  edit data--->', postData);
    let token = JSON.parse(getToken()).token

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token
      }

    const formData = new FormData();
    for (const key in postData) {
      formData.append(key, postData[key]);
    }

    axios
    .post(baseUrl+'admin/editCourse/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_COURSE_EDIT_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_COURSE_EDIT_FAILURE', payload: err.response  } )
        
    })
}

export const postDeleteCourse = postData => dispatch =>{

    dispatch( {type:'POST_COURSE_DELETE_START'} )

    console.log('Post delete data--->', postData);
    let token = JSON.parse(getToken()).token

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }

    axios
    .post(baseUrl+'api/deleteCourse/',postData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_COURSE_DELETE_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_COURSE_DELETE_FAILURE', payload: err.response  } )
        
    })
}