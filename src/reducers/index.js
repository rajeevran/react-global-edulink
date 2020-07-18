
import { combineReducers } from 'redux'

import adminReducer from './adminReducer'
import courseReducer from './content/courseReducer'
import courseCategoryReducer from './content/courseCategoryReducer'
import courseSubCategoryReducer from './content/courseSubCategoryReducer'
import detailCourseReducer from './content/detailCourseReducer'

export default combineReducers ({

        adminReducer,
        courseReducer,
        courseCategoryReducer,
        courseSubCategoryReducer,
        detailCourseReducer

})