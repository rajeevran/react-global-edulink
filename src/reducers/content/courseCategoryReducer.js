

import {
    
    FETCH_COURSECATEGORY_LIST_START,
    FETCH_COURSECATEGORY_LIST_SUCCESS,
    FETCH_COURSECATEGORY_LIST_FAILURE,

    POST_COURSECATEGORY_ADD_START,
    POST_COURSECATEGORY_ADD_SUCCESS,
    POST_COURSECATEGORY_ADD_FAILURE,

    POST_COURSECATEGORY_EDIT_START,
    POST_COURSECATEGORY_EDIT_SUCCESS,
    POST_COURSECATEGORY_EDIT_FAILURE,

    POST_COURSECATEGORY_DELETE_START,
    POST_COURSECATEGORY_DELETE_SUCCESS,
    POST_COURSECATEGORY_DELETE_FAILURE,


} from  '../../actions/content/courseCategory'


const initialState = {
    courseCategorylist:{ success: false ,STATUSCODE:2000, error: false , response : {docs:[]}},
    isloading:false,
    iscourseCategorySuccess:false,
    iscourseCategoryAddSuccess:false,
    courseCategoryMessage:'',

}

export default( state=initialState, action) =>{

    const newState = {...state}

    switch(action.type){
        
        case FETCH_COURSECATEGORY_LIST_START:
            return {
                ...state,
                isloading:true,

            };
        case FETCH_COURSECATEGORY_LIST_SUCCESS:
            return {
                ...state,
                isloading:false,
                courseCategorylist:action.payload,

            };
        case FETCH_COURSECATEGORY_LIST_FAILURE:
            return {
                ...state,
                isloading:false,
            };
        case POST_COURSECATEGORY_ADD_START:
            return {
                ...state,
                isloading:true,
                iscourseCategoryAddSuccess:false,

            };
        case POST_COURSECATEGORY_ADD_SUCCESS:
            return {
                ...state,
                isloading:false,
                iscourseCategoryAddSuccess:true,
            };
        case POST_COURSECATEGORY_ADD_FAILURE:
            return {
                ...state,
                isloading:false,
                iscourseCategoryAddSuccess:false,

            }; 

        case POST_COURSECATEGORY_EDIT_START:
            return {
                ...state,
                isloading:true,
                iscourseCategorySuccess:false,

            };
        case POST_COURSECATEGORY_EDIT_SUCCESS:
            return {
                ...state,
                isloading:false,
                iscourseCategorySuccess:true,
            };
        case POST_COURSECATEGORY_EDIT_FAILURE:
            return {
                ...state,
                isloading:false,
                iscourseCategorySuccess:false
            };             

        case POST_COURSECATEGORY_DELETE_START:
            return {
                ...state,
                isloading:true,

            };
        case POST_COURSECATEGORY_DELETE_SUCCESS:
            return {
                ...state,
                isloading:false,
            };
        case POST_COURSECATEGORY_DELETE_FAILURE:
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