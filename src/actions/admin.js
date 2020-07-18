import axios from 'axios'
import { type } from 'os';
import { baseUrl, localUrl } from '../shared/baseUrl'

export const POST_ADMIN_LOGIN_START = 'POST_ADMIN_LOGIN_START'
export const POST_ADMIN_LOGIN_SUCCESS = 'POST_ADMIN_LOGIN_SUCCESS'
export const POST_ADMIN_LOGIN_FAILURE = 'POST_ADMIN_LOGIN_FAILURE'

export const POST_ADMIN_LOGINOUT_SUCCESS = 'POST_ADMIN_LOGINOUT_SUCCESS'

export const FETCH_ADMIN_LIST_START = 'FETCH_ADMIN_LIST_START'
export const FETCH_ADMIN_LIST_SUCCESS = 'FETCH_ADMIN_LIST_SUCCESS'
export const FETCH_ADMIN_LIST_FAILURE = 'FETCH_ADMIN_LIST_FAILURE'

export const POST_ADMIN_ADD_START = 'POST_ADMIN_ADD_START'
export const POST_ADMIN_ADD_SUCCESS = 'POST_ADMIN_ADD_SUCCESS'
export const POST_ADMIN_ADD_FAILURE = 'POST_ADMIN_ADD_FAILURE'

export const POST_ADMIN_EDIT_START = 'POST_ADMIN_EDIT_START'
export const POST_ADMIN_EDIT_SUCCESS = 'POST_ADMIN_EDIT_SUCCESS'
export const POST_ADMIN_EDIT_FAILURE = 'POST_ADMIN_EDIT_FAILURE'

export const POST_ADMIN_DELETE_START = 'POST_ADMIN_DELETE_START'
export const POST_ADMIN_DELETE_SUCCESS = 'POST_ADMIN_DELETE_SUCCESS'
export const POST_ADMIN_DELETE_FAILURE = 'POST_ADMIN_DELETE_FAILURE'

export const POST_ADMIN_CHANGEPASSWORD_START = 'POST_ADMIN_CHANGEPASSWORD_START'
export const POST_ADMIN_CHANGEPASSWORD_SUCCESS = 'POST_ADMIN_CHANGEPASSWORD_SUCCESS'
export const POST_ADMIN_CHANGEPASSWORD_FAILURE = 'POST_ADMIN_CHANGEPASSWORD_FAILURE'

export const FETCH_USER_LIST_START = 'FETCH_USER_LIST_START'
export const FETCH_USER_LIST_SUCCESS = 'FETCH_USER_LIST_SUCCESS'
export const FETCH_USER_LIST_FAILURE = 'FETCH_USER_LIST_FAILURE'

export const POST_USER_ADD_START = 'POST_USER_ADD_START'
export const POST_USER_ADD_SUCCESS = 'POST_USER_ADD_SUCCESS'
export const POST_USER_ADD_FAILURE = 'POST_USER_ADD_FAILURE'

export const POST_USER_EDIT_START = 'POST_USER_EDIT_START'
export const POST_USER_EDIT_SUCCESS = 'POST_USER_EDIT_SUCCESS'
export const POST_USER_EDIT_FAILURE = 'POST_USER_EDIT_FAILURE'

export const POST_USER_DELETE_START = 'POST_USER_DELETE_START'
export const POST_USER_DELETE_SUCCESS = 'POST_USER_DELETE_SUCCESS'
export const POST_USER_DELETE_FAILURE = 'POST_USER_DELETE_FAILURE'

//...................LOGIN ...............................

export const postLoginAdmin = (data) => dispatch =>{

        console.log('post data--->', data);
       // console.log('post auth data--->', JSON.parse(getToken()).isAuthenticated);
        
        dispatch( {type:'POST_ADMIN_LOGIN_START'} )

        const headers = {
            'Content-Type': 'application/json',
        }

        axios
        .post(baseUrl+'admin/adminLogin/', data,  {
            headers: headers
            })
        .then(res =>{

            console.log('res---->',res)
            let token = res.data.response.token;
            let isAuthenticated = true;
            localStorage.setItem('auth',JSON.stringify({token:token, isAuthenticated: isAuthenticated}));

            dispatch( { type:'POST_ADMIN_LOGIN_SUCCESS', payload: res.data } )

        })
        .catch(err => {
            console.log(err.response)
            dispatch( { type:'POST_ADMIN_LOGIN_FAILURE', payload: err.response  } )
            
        })
}

export const postLoginOutAdmin = () =>{


        let token = '';
        let isAuthenticated = false;
        localStorage.setItem('auth',JSON.stringify({token:token, isAuthenticated: isAuthenticated}));
        console.log('Logout data--->',localStorage.getItem('auth'));


//        dispatch( { type:'POST_ADMIN_LOGINOUT_SUCCESS', payload: localStorage.getItem('auth') } )
    
}

export const getToken = () =>{

    let token = localStorage.getItem('auth');
    return token
}

//...................ADMIN ...............................
export const fetchAdmin = (id,page,limit,searchName) => dispatch =>{

        console.log('LOGIN auth data--->', JSON.parse(getToken()).token);
        //let token = 'eyJhbciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhamVldjVAZ21haWwuY29tIiwiYWRtaW5JZCI6IjVlZWEwMjU2NjlkNTgxNGU0NTBiMGFjZiIsImlhdCI6MTU5MzY3NDgxNCwiZXhwIjoxNTkzNzE4MDE0fQ.10TvFMH9Loo1vxaouYSd_wVnrU7LGQpJZ1wTk3ANVfI'
        let token = JSON.parse(getToken()).token

        dispatch( {type:'FETCH_ADMIN_LIST_START'} )

        const headers = {
            'Content-Type': 'application/json',
            'x-access-token': token
          }

        axios
        .get(baseUrl+'admin/listAdmin/', {
            headers: headers,
            params:{
                ...(id ? { adminId: id } : {}),
                ...(searchName ? { searchName: searchName } : {}),
                ...(page ? { page: page } : {}),
                ...(limit ? { limit: limit } : {})
            }
            })
        .then(res =>{
            console.log(res)
            dispatch( { type:'FETCH_ADMIN_LIST_SUCCESS', payload: res.data } )
        })
        .catch(err => {
            console.log(err.response)
            dispatch( { type:'FETCH_ADMIN_LIST_FAILURE', payload: err.response  } )
            
        })
}

export const postAddAdmin = postData => dispatch =>{

    dispatch( {type:'POST_ADMIN_ADD_START'} )

    console.log('Post add data--->', postData);
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
    .post(baseUrl+'admin/addAdmin/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_ADMIN_ADD_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_ADMIN_ADD_FAILURE', payload: err.response  } )
        
    })
}

export const postEditAdmin = postData => dispatch =>{

    dispatch( {type:'POST_ADMIN_EDIT_START'} )

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
   // formData.append('profileImage', updateFile);
   // const headers = new Headers({ 'Accept': 'application/json' });

    axios
    .post(baseUrl+'admin/editAdmin/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_ADMIN_EDIT_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_ADMIN_EDIT_FAILURE', payload: err.response  } )
        
    })
}

export const postChangePasswordAdmin = postData => dispatch =>{

    dispatch( {type:'POST_ADMIN_CHANGEPASSWORD_START'} )

    console.log('Post  edit data--->', postData);
    let token = JSON.parse(getToken()).token

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token
      }
      postData.token = token
      
    axios
    .post(baseUrl+'admin/changePassword/',postData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_ADMIN_CHANGEPASSWORD_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_ADMIN_CHANGEPASSWORD_FAILURE', payload: err.response  } )
        
    })
}

export const postDeleteAdmin = postData => dispatch =>{

    dispatch( {type:'POST_ADMIN_DELETE_START'} )

    console.log('Post delete data--->', postData);
    let token = JSON.parse(getToken()).token

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }

    axios
    .post(baseUrl+'admin/deleteAdmin/',postData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_ADMIN_DELETE_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_ADMIN_DELETE_FAILURE', payload: err.response  } )
        
    })
}


//...................USER ...............................
export const fetchUser = (id,page,limit,searchName) => dispatch =>{

    console.log('LOGIN auth data--->', JSON.parse(getToken()).token);
    let token = JSON.parse(getToken()).token

    dispatch( {type:'FETCH_USER_LIST_START'} )

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
      
    axios
    .get(baseUrl+'api/listUser/', {
        headers: headers,
        params:{
            ...(id ? { userId: id } : {}),
            ...(searchName ? { searchName: searchName } : {}),
            ...(page ? { page: page } : {}),
            ...(limit ? { limit: limit } : {})
        }
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'FETCH_USER_LIST_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'FETCH_USER_LIST_FAILURE', payload: err.response  } )
        
    })
}

export const postAddUser = postData => dispatch =>{

    dispatch( {type:'POST_USER_ADD_START'} )

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
    .post(baseUrl+'admin/addUser/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_USER_ADD_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_USER_ADD_FAILURE', payload: err.response  } )
        
    })
}

export const postEditUser = postData => dispatch =>{

    dispatch( {type:'POST_USER_EDIT_START'} )

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
    .post(baseUrl+'api/editUser/',formData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_USER_EDIT_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_USER_EDIT_FAILURE', payload: err.response  } )
        
    })
}

export const postDeleteUser = postData => dispatch =>{

    dispatch( {type:'POST_USER_DELETE_START'} )

    console.log('Post delete data--->', postData);
    let token = JSON.parse(getToken()).token

    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': token
      }

    axios
    .post(baseUrl+'api/deleteUser/',postData, {
        headers: headers
        })
    .then(res =>{
        console.log(res)
        dispatch( { type:'POST_USER_DELETE_SUCCESS', payload: res.data } )
    })
    .catch(err => {
        console.log(err.response)
        dispatch( { type:'POST_USER_DELETE_FAILURE', payload: err.response  } )
        
    })
}