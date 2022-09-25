'use strict';

const express = require('express');
const { check, validationResult, body } = require('express-validator');
const morgan = require('morgan');
const CourseDAO = require('./CourseDAO');
const userDao = require('./UserDAO');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {

    const user = await userDao.getUser(username, password)
    if (!user || user.error || user == 422)
      return cb(null, false, 'Incorrect username or password.');
    return cb(null, user);
  }
  catch (err) {
    throw err;
  }

}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ err: 401, msg: 'Not authorized' });
}

app.use(session({
  secret: "NOT_SO_SECRET",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


app.get('/api/courses',
  async (req, res) => {
    try {
      const courses = await CourseDAO.getAllCourses();
      return res.status(200).json(courses);
    } catch (err) {
      return res.status(500).end();
    }
  }
);

app.get('/api/studyplan', isLoggedIn,
  async (req, res) => {
    try {
      const courses = await CourseDAO.getStudyPlan(req.user.id);
      return res.status(200).json(courses);
    } catch (err) {
      return res.status(500).end();
    }
  }
);


app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

app.get('/api/sessions/current', async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await userDao.getUserById(req.user.id);
    return res.json(user);
  }
  return res.status(401).json({ error: 'Not authenticated' });
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.post('/api/studyplan',
  [check('time').isString(),
  check('time').isIn(["full", "part", null]),
  check('studyplan').isArray(),
  body('studyplan.*').isString().isLength({ min: 7, max: 7 })], isLoggedIn,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ msg: "Data not valid, validation errors" });
      }
      const result = await CourseDAO.addStudyplan(req.body.studyplan, req.body.time, req.user.id);
      return res.status(201).end();
    } catch (err) {
      if (err.err === 422) {
        return res.status(422).json({ msg: err.msg });
      } else if (err.err === 404) {
        return res.status(404).json({ msg: err.msg });
      }
      return res.status(500).json({ msg: 'Error in Database' });
    }
  }
);

app.delete('/api/studyplan', [isLoggedIn],
  async (req, res) => {
    try {
      await CourseDAO.deleteStudyPlan(req.user.id);
      res.status(200).end();
    }
    catch (err) {
      return res.status(500).end();
    }
  });

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});