import { Course } from "./courseLibrary";

const SERVER_URL = "http://localhost:3001";

const getAllCourses = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/courses');
    const courseJson = await response.json();
    if (response.ok) {
      return courseJson.map(c => new Course(c.code, c.name, c.credits, c.maxStudents, c.incopatibleWith, c.PreparatoryCourse, c.enrolledStudents));
    }
    else
      throw courseJson;
  } catch (err) {
    const error = new Error(err.msg);
    error.err = err.err;
    throw error
  }
};

const getStudyPlan = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/studyplan', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    const courseJson = await response.json();
    if (response.ok) {
      return courseJson;
    }
    else
      throw courseJson;
  } catch (err) {
    const error = new Error(err.msg);
    error.err = err.err;
    throw error
  }
};

const addStudyplan = async (studyplan, time) => {
  try {
    const response = await fetch(SERVER_URL + '/api/studyplan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    body: JSON.stringify({ 'studyplan': studyplan, 'time': time/*, 'user': user*/ })
    });
    if (!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
    }
    else return null;
  } catch (err) {
    throw new Error(err.msg);
  }
};

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;
    }
  } catch (err) {
    throw new Error('No session available');
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const deleteStudyPlan = async () => {
  try{
    const response = await fetch(SERVER_URL + `/api/studyplan`, 
    { method: 'DELETE', credentials: 'include' });
    if(!response.ok) {
      const errMessage = await response.json(); 
      throw errMessage;
    }
    return null;
  }catch(err){
    throw new Error(err.msg);
  }
};



const API = { getAllCourses, logIn, logOut, getUserInfo, getStudyPlan, addStudyplan, deleteStudyPlan };
export default API;