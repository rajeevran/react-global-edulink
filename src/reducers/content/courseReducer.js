

import {
    
    FETCH_COURSE_LIST_START,
    FETCH_COURSE_LIST_SUCCESS,
    FETCH_COURSE_LIST_FAILURE,

    POST_COURSE_ADD_START,
    POST_COURSE_ADD_SUCCESS,
    POST_COURSE_ADD_FAILURE,

    POST_COURSE_EDIT_START,
    POST_COURSE_EDIT_SUCCESS,
    POST_COURSE_EDIT_FAILURE,

    POST_COURSE_DELETE_START,
    POST_COURSE_DELETE_SUCCESS,
    POST_COURSE_DELETE_FAILURE,


} from  '../../actions/content/course'


const initialState = {
    list:{ success: false ,STATUSCODE:2000, error: false , response : {docs:[]}},
    iscourseSuccess:false,
    isloading:false
}

export default( state=initialState, action) =>{

    const newState = {...state}

    switch(action.type){
        
        case FETCH_COURSE_LIST_START:
            return {
                ...state,
                isloading:true
            };
        case FETCH_COURSE_LIST_SUCCESS:
            return {
                ...state,
                isloading:false,
                list:action.payload
            };
        case FETCH_COURSE_LIST_FAILURE:
            return {
                ...state,
                isloading:false
            };
        case POST_COURSE_ADD_START:
            return {
                ...state,
                isloading:true
            };
        case POST_COURSE_ADD_SUCCESS:
            return {
                ...state,
                isloading:false,
            };
        case POST_COURSE_ADD_FAILURE:
            return {
                ...state,
                isloading:false
            }; 

        case POST_COURSE_EDIT_START:
            return {
                ...state,
                iscourseSuccess:false,
                isloading:true
            };
        case POST_COURSE_EDIT_SUCCESS:
            return {
                ...state,
                iscourseSuccess:true,
                isloading:false,
            };
        case POST_COURSE_EDIT_FAILURE:
            return {
                ...state,
                iscourseSuccess:false,
                isloading:false
            };             

        case POST_COURSE_DELETE_START:
            return {
                ...state,
                isloading:true
            };
        case POST_COURSE_DELETE_SUCCESS:
            return {
                ...state,
                isloading:false,
            };
        case POST_COURSE_DELETE_FAILURE:
            return {
                ...state,
                isloading:false
            };           

        default :
            return state
    }
    //console.log(newState);
    
    
}
