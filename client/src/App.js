
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DefaultRoute, CourseRoute, LoginRoute } from './components/courseRoute'
import { useState, useEffect } from 'react';
import API from './API';


function App() {
  const [totalcourses, setTotalCourses] = useState([]); //state that contains the list of all courses, static in this implementation
  const [studyPlan, setStudyPlan] = useState([]); //state containing the local study plan for the user, the one changed locally, not saved in DB
  const [time, setTime] = useState(''); //state containing the local choice for full-time/part-time
  const [user, setUser] = useState(''); //state containing information of the user, used get old version of full/part - time 
  const [credits, setCredits] = useState(0); //state containing current value of credits for the current study plan
  const [loggedIn, setLoggedIn] = useState(false); //this state is true if the user is logged in, otherwise it is false

  useEffect(() => {
    getAllCourses();
  }, []); //trigger the use effect only at startup, no need to update them 

  const getAllCourses = async () => {
    try {
      const coursesList = await API.getAllCourses();
      setTotalCourses(coursesList);
    } catch (err) {
      toast.error(err.msg);
      setLoggedIn(false);
    }
  };

  //update user infos when login is performed. When user is logged in infos about his studyplan are retreived and state updated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userinfo = await API.getUserInfo();
        setUser(userinfo);
        setTime(userinfo.time);
        setLoggedIn(true);
        if (loggedIn) {
          const studyPlanlist = await API.getStudyPlan();
          setStudyPlan(studyPlanlist.map(el => el.course));
          setCredits(studyPlanlist.map(el => totalcourses.find(c => c.code === el.course).credits).reduce((prev, curr) => prev + curr, 0))
        }
      } catch (err) {
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, [loggedIn, totalcourses]);

  //add course to plan
  const addToPlan = (course) => {
    setStudyPlan((oldPlan) => [...oldPlan, course]);
  }
  //remove course from plan
  const removeFromPlan = (course) => {
    setStudyPlan(studyPlan.filter(c => c !== course));
  }

  const addCredits = (credit) => {
    setCredits((oldCredits) => { return oldCredits + credit });
  }

  //delete current study plan and also full-time / part-time info linked to the user
  const deleteStudyPlan = async () => {
    await API.deleteStudyPlan().then(() => {
      setStudyPlan([]);
      setTime('');
      toast.success("Study plan deleted with success!");
    }).catch((err) => { toast.error('Error deleting study plan'); });
    getAllCourses();
  }

  //add current study plan to DB, if an error in DB occurs (not for validation), the old (valid) study plan is restored
  const addStudyplan = async (studyPlan, time) => {
    const old = await API.getStudyPlan();
    await API.deleteStudyPlan();
    await API.addStudyplan(studyPlan, time).then(() => {
      toast.success("Study plan successfully added!");
    }).catch(async (err) => {
      API.deleteStudyPlan().then().catch((err) => { toast.error('error in delete old'); }); //delete needed only in case of DB error (i.e. duplicated course)
      if (old.length) {  // if add new plan returns an error, the old study plan is added, if exists
        await API.addStudyplan(old.map(c => c.course), user.time);
      }
      if (err.message)
        toast.error(err.message);
      else {
        toast.error('Generic Error');
      }
    });

    const studyPlanlist = await API.getStudyPlan();
    setStudyPlan(studyPlanlist.map(el => el.course));
    getAllCourses();
  };

  //when pressing the cancel button, old information of the studyplan are retrieved and states are updated
  const getOldPlan = async () => {
    const oldPlan = await API.getStudyPlan();
    setStudyPlan(oldPlan.map(el => el.course));
    const userinfo = await API.getUserInfo();
    setTime(userinfo.time);
    setCredits(oldPlan.map(el => totalcourses.find(c => c.code === el.course).credits).reduce((prev, curr) => prev + curr, 0))
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      toast.success(`Welcome, ${user.name}!`, { position: "top-center" });
      setLoggedIn(true);
    } catch (err) {
      toast.error(err, { position: "top-center" });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setStudyPlan([]);
  };


  return (
    <BrowserRouter>
      <ToastContainer position="top-right" theme="light" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover={false} limit={3} transition={Slide} />
      <Routes>
        <Route path='/' element={<CourseRoute setCredits={setCredits} addCredits={addCredits} getOldPlan={getOldPlan} deleteStudyPlan={deleteStudyPlan} removeFromPlan={removeFromPlan} addToPlan={addToPlan} SetStudyPlan={setStudyPlan} user={user} addStudyplan={addStudyplan} time={time} setTime={setTime} credits={credits} courses={totalcourses} studyPlan={studyPlan} loggedIn={loggedIn} logout={handleLogout} />}></Route>
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginRoute login={handleLogin} />} />
        <Route path='*' element={<DefaultRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
