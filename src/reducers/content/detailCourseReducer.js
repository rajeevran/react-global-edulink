

import {
    
    FETCH_COURSEDETAIL_LIST_START,
    FETCH_COURSEDETAIL_LIST_SUCCESS,
    FETCH_COURSEDETAIL_LIST_FAILURE,

    FETCH_COURSEMASTERDETAIL_LIST_START,
    FETCH_COURSEMASTERDETAIL_LIST_SUCCESS,
    FETCH_COURSEMASTERDETAIL_LIST_FAILURE,

    POST_COURSEDETAIL_ADD_START,
    POST_COURSEDETAIL_ADD_SUCCESS,
    POST_COURSEDETAIL_ADD_FAILURE,

    POST_COURSEDETAIL_EDIT_START,
    POST_COURSEDETAIL_EDIT_SUCCESS,
    POST_COURSEDETAIL_EDIT_FAILURE,

    POST_COURSEDETAIL_DELETE_START,
    POST_COURSEDETAIL_DELETE_SUCCESS,
    POST_COURSEDETAIL_DELETE_FAILURE,


} from  '../../actions/content/courseDetail'


const initialState = {
    courseDetaillist:{ success: false ,STATUSCODE:2000, error: false , response : {docs:[]}},
    courseMasterDetaillist:{ success: false ,STATUSCODE:2000, error: false , response : {docs:[]}},
    isloading:false,
    iscourseDetailSuccess:false,
    iscourseDetailAddSuccess:false,
    courseDetailMessage:'',
}

export default( state=initialState, action) =>{

    const newState = {...state}

    switch(action.type){
        
        case FETCH_COURSEDETAIL_LIST_START:
            return {
                ...state,
                isloading:true,
            };
        case FETCH_COURSEDETAIL_LIST_SUCCESS:
            return {
                ...state,
                isloading:false,
                courseDetaillist:action.payload,
            };
        case FETCH_COURSEDETAIL_LIST_FAILURE:
            return {
                ...state,
                isloading:false,
            };

        case FETCH_COURSEMASTERDETAIL_LIST_START:
            return {
                ...state,
                isloading:true,
            };
        case FETCH_COURSEMASTERDETAIL_LIST_SUCCESS:
            return {
                ...state,
                isloading:false,
                courseMasterDetaillist:action.payload,
            };
        case FETCH_COURSEMASTERDETAIL_LIST_FAILURE:
            return {
                ...state,
                isloading:false,
            };

        case POST_COURSEDETAIL_ADD_START:
            return {
                ...state,
                isloading:true,
                iscourseDetailAddSuccess:false,

            };
        case POST_COURSEDETAIL_ADD_SUCCESS:
            return {
                ...state,
                isloading:false,
                iscourseDetailAddSuccess:true,
            };
        case POST_COURSEDETAIL_ADD_FAILURE:
            return {
                ...state,
                isloading:false,
                iscourseDetailAddSuccess:false,

            }; 

        case POST_COURSEDETAIL_EDIT_START:
            return {
                ...state,
                isloading:true,
                iscourseDetailSuccess:false,

            };
        case POST_COURSEDETAIL_EDIT_SUCCESS:
            return {
                ...state,
                isloading:false,
                iscourseDetailSuccess:true,
            };
        case POST_COURSEDETAIL_EDIT_FAILURE:
            return {
                ...state,
                isloading:false,
                iscourseDetailSuccess:false
            };             

        case POST_COURSEDETAIL_DELETE_START:
            return {
                ...state,
                isloading:true,

            };
        case POST_COURSEDETAIL_DELETE_SUCCESS:
            return {
                ...state,
                isloading:false,
            };
        case POST_COURSEDETAIL_DELETE_FAILURE:
            return {
                ...state,
                isloading:false,
            };           

        default :
            return state
    }
    //console.log(newState);
    
    
}

//export default reducer