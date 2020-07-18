

import {
    
    FETCH_COURSESUBCATEGORY_LIST_START,
    FETCH_COURSESUBCATEGORY_LIST_SUCCESS,
    FETCH_COURSESUBCATEGORY_LIST_FAILURE,

    POST_COURSESUBCATEGORY_ADD_START,
    POST_COURSESUBCATEGORY_ADD_SUCCESS,
    POST_COURSESUBCATEGORY_ADD_FAILURE,

    POST_COURSESUBCATEGORY_EDIT_START,
    POST_COURSESUBCATEGORY_EDIT_SUCCESS,
    POST_COURSESUBCATEGORY_EDIT_FAILURE,

    POST_COURSESUBCATEGORY_DELETE_START,
    POST_COURSESUBCATEGORY_DELETE_SUCCESS,
    POST_COURSESUBCATEGORY_DELETE_FAILURE,


} from  '../../actions/content/courseSubCategory'


const initialState = {
    courseSubCategorylist:{ success: false ,STATUSCODE:2000, error: false , response : {docs:[]}},
    isloading:false
}

export default( state=initialState, action) =>{

    const newState = {...state}

    switch(action.type){
        
        case FETCH_COURSESUBCATEGORY_LIST_START:
            return {
                ...state,
                isloading:true
            };
        case FETCH_COURSESUBCATEGORY_LIST_SUCCESS:
            return {
                ...state,
                isloading:false,
                courseSubCategorylist:action.payload
            };
        case FETCH_COURSESUBCATEGORY_LIST_FAILURE:
            return {
                ...state,
                isloading:false
            };
        case POST_COURSESUBCATEGORY_ADD_START:
            return {
                ...state,
                isloading:true
            };
        case POST_COURSESUBCATEGORY_ADD_SUCCESS:
            return {
                ...state,
                isloading:false,
            };
        case POST_COURSESUBCATEGORY_ADD_FAILURE:
            return {
                ...state,
                isloading:false
            }; 

        case POST_COURSESUBCATEGORY_EDIT_START:
            return {
                ...state,
                isloading:true
            };
        case POST_COURSESUBCATEGORY_EDIT_SUCCESS:
            return {
                ...state,
                isloading:false,
            };
        case POST_COURSESUBCATEGORY_EDIT_FAILURE:
            return {
                ...state,
                isloading:false
            };             

        case POST_COURSESUBCATEGORY_DELETE_START:
            return {
                ...state,
                isloading:true
            };
        case POST_COURSESUBCATEGORY_DELETE_SUCCESS:
            return {
                ...state,
                isloading:false,
            };
        case POST_COURSESUBCATEGORY_DELETE_FAILURE:
            return {
                ...state,
                isloading:false
            };           

        default :
            return state
    }
    //console.log(newState);
    
    
}

//export default reducer