import React, {Fragment} from 'react';
import logo from './logo.svg';
import './App.css';
import LoginForm from './components/login/LoginForm'
import AdminList from './components/admin/AdminList'
import AdminForm from './components/admin/AdminForm'
import UserList from './components/users/UserList'
import ContentList from './components/contents/ContentList'
import UserForm from './components/users/UserForm'
import ChangePassword from './components/admin/ChangePassword'
import CourseList from './components/contents/courses/CourseList'
import CourseForm from './components/contents/courses/CourseForm'

import CourseCategoryList from './components/contents/courseCategory/CourseCategoryList'
import CourseCategoryForm from './components/contents/courseCategory/CourseCategoryForm'


import CourseDetailList from './components/contents/courseDetail/CourseDetailList'
import CourseDetailForm from './components/contents/courseDetail/CourseDetailForm'

import Dashboard from './components/dashboard/Dashboard'

import Header from './components/header/Header'
import Menu from './components/menu/Menu'
import Footer from './components/footer/Footer'

import { getToken } from './actions/admin'
import { Switch, Redirect,  Route } from 'react-router-dom';

function App() {
                  console.log('getToken----',getToken());
                  console.log('window.location.href----',window.location.href);
                  var lastIndex = window.location.href.lastIndexOf("/")

                  var urlPath = window.location.href.substring(lastIndex + 1); //after this urlPath="true"
                  console.log('path----',urlPath);

                  let isAuthenticated = getToken() !== null ? JSON.parse(getToken()).isAuthenticated: false
                  return (
                              
                              <div className="App">

                                    <Switch>
                                          <Route exact path="/" render={ () => {
                                                      return (
                                                            isAuthenticated === false ?
                                                            <Redirect to="/login" /> :
                                                            <Redirect to="/dashboard" /> 
                                                      )
                                                }}
                                          />
                                          <Route path="/dashboard" exact component={() => { return <Dashboard />}} />
                                          <Route path="/login" exact component={() => { return <LoginForm />}} /> 
                                          
                                          <Route path="/admin" exact component={() => { return <AdminList />}} /> 
                                          <Route path='/admin/view/:id' component={AdminForm} />    
                                          <Route path='/admin/edit/:id' component={AdminForm} />    
                                          <Route path='/admin/add' component={AdminForm} />    
                                          <Route path="/admin/delete/:id" component={AdminForm} />

                                          <Route path="/changepassword" exact component={() => { return <ChangePassword />}} /> 

                                          
                                          
                                          <Route path="/user" exact component={() => { return <UserList />}} /> 
                                          <Route path='/user/view/:id' component={UserForm} />    
                                          <Route path='/user/edit/:id' component={UserForm} />    
                                          <Route path='/user/add' component={UserForm} />    
                                          <Route path="/user/delete/:id" component={UserForm} />

                                          <Route path="/content" exact component={() => { return <ContentList />}} /> 

                                          <Route path="/content/courses" exact component={() => { return <CourseList />}} /> 
                                          <Route path="/content/courses/edit/:id" exact component={() => { return <CourseForm />}} /> 
                                          <Route path="/content/courses/delete/:id" exact component={() => { return <CourseForm />}} /> 
                                          <Route path="/content/courses/add" exact component={() => { return <CourseForm />}} /> 
                                          
                                          <Route path="/content/courseCategory" exact component={() => { return <CourseCategoryList />}} /> 
                                          <Route path="/content/courseCategory/view/:id" exact component={() => { return <CourseCategoryForm />}} /> 
                                          <Route path="/content/courseCategory/edit/:id" exact component={() => { return <CourseCategoryForm />}} /> 
                                          <Route path="/content/courseCategory/delete/:id" exact component={() => { return <CourseCategoryForm />}} /> 
                                          <Route path="/content/courseCategory/add" exact component={() => { return <CourseCategoryForm />}} /> 
                                          
                                          <Route path="/content/courseDetail" exact component={() => { return <CourseDetailList />}} /> 
                                          <Route path="/content/courseDetail/view/:id" exact component={() => { return <CourseDetailForm />}} /> 
                                          <Route path="/content/courseDetail/edit/:id" exact component={() => { return <CourseDetailForm />}} /> 
                                          <Route path="/content/courseDetail/delete/:id" exact component={() => { return <CourseDetailForm />}} /> 
                                          <Route path="/content/courseDetail/add" exact component={() => { return <CourseDetailForm />}} /> 
                                           
                                          
                                    </Switch>
                                    <Footer />
                              </div>
                             
                  );
}

export default App;
