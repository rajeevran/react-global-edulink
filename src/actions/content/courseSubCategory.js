import axios from 'axios'
import { type } from 'os';
import { baseUrl, localUrl } from '../../shared/baseUrl'
import { getToken } from '../admin'


export const FETCH_COURSESUBCATEGORY_LIST_START = 'FETCH_COURSESUBCATEGORY_LIST_START'
export const FETCH_COURSESUBCATEGORY_LIST_SUCCESS = 'FETCH_COURSESUBCATEGORY_LIST_SUCCESS'
export const FETCH_COURSESUBCATEGORY_LIST_FAILURE = 'FETCH_COURSESUBCATEGORY_LIST_FAILURE'

export const POST_COURSESUBCATEGORY_ADD_START = 'POST_COURSESUBCATEGORY_ADD_START'
export const POST_COURSESUBCATEGORY_ADD_SUCCESS = 'POST_COURSESUBCATEGORY_ADD_SUCCESS'
export const POST_COURSESUBCATEGORY_ADD_FAILURE = 'POST_COURSESUBCATEGORY_ADD_FAILURE'

export const POST_COURSESUBCATEGORY_EDIT_START = 'POST_COURSESUBCATEGORY_EDIT_START'
export const POST_COURSESUBCATEGORY_EDIT_SUCCESS = 'POST_COURSESUBCATEGORY_EDIT_SUCCESS'
export const POST_COURSESUBCATEGORY_EDIT_FAILURE = 'POST_COURSESUBCATEGORY_EDIT_FAILURE'

export const POST_COURSESUBCATEGORY_DELETE_START = 'POST_COURSESUBCATEGORY_DELETE_START'
export const POST_COURSESUBCATEGORY_DELETE_SUCCESS = 'POST_COURSESUBCATEGORY_DELETE_SUCCESS'
export const POST_COURSESUBCATEGORY_DELETE_FAILURE = 'POST_COURSESUBCATEGORY_DELETE_FAILURE'



//...................COURSESUBCATEGORY ...............................
export const fetchlistSubCategory = (id,page,limit,searchName) => dispatch =>{

    console.log('LOGIN auth data--->', JSON.parse(getToken()).token);
    let token = JSON.parse(getToken()).token

    dispatch( {type:'FETCH_COURSESUBCATEGORY_LIST_START'} )

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
      
    axios
    .get(baseUrl+'admin/listSubCategory/', {
        headers: headers,
        params:{
            ...(id ? { subcategoryId: id } : {}),
            ...(searchName ? { searchName: searchName } : {}),
            ...(page ? { page: page } : {}),
            ...(limit ? { limit: limit } : {})
        }
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'FETCH_COURSESUBCATEGORY_LIST_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'FETCH_COURSESUBCATEGORY_LIST_FAILURE', payload: err.response  } )
        
    })
}

export const postAddSubCategory = postData => dispatch =>{

    dispatch( {type:'POST_COURSESUBCATEGORY_ADD_START'} )

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
    .post(baseUrl+'admin/addSubCategory/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_COURSESUBCATEGORY_ADD_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_COURSESUBCATEGORY_ADD_FAILURE', payload: err.response  } )
        
    })
}

export const postEditSubCategory = postData => dispatch =>{

    dispatch( {type:'POST_COURSESUBCATEGORY_EDIT_START'} )

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
    .post(baseUrl+'admin/editSubCategory/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_COURSESUBCATEGORY_EDIT_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_COURSESUBCATEGORY_EDIT_FAILURE', payload: err.response  } )
        
    })
}

export const postDeleteSubCategory = postData => dispatch =>{

    dispatch( {type:'POST_COURSESUBCATEGORY_DELETE_START'} )

    console.log('Post delete data--->', postData);
    let token = JSON.parse(getToken()).token

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }

    axios
    .post(baseUrl+'api/deleteSubCategory/',postData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_COURSESUBCATEGORY_DELETE_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_COURSESUBCATEGORY_DELETE_FAILURE', payload: err.response  } )
        
    })
}