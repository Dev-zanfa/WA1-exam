'use strict'

const { Course } = require('./Course');
const DBmanager = require('./DBmanager');
const db = new DBmanager();

exports.getAllCourses = async () => {
    try {
        const sql = "SELECT * FROM courses";
        const res = await db.get(sql);
        const sqlinc = "SELECT * FROM incopatibleCourses";
        const incopatibleCourses = await db.get(sqlinc);
        return res.map(c => new Course(
            c.code,
            c.name,
            c.credits,
            c.maxStudents,
            incopatibleCourses.filter(course => course.code === c.code).map(course => course.incopatible),
            c.preparatoryCourse,
            c.enrolledStudents
        ));

    } catch (err) {
        throw err;
    }
};

exports.getStudyPlan = async (user) => {
    try {
        const sql = "SELECT * FROM studyPlans WHERE user = ?";
        const res = await db.get(sql, [user]);
        return res;
    } catch (err) {
        throw err;
    }
};

exports.addStudyplan = async (studyPlan, time, user) => {
    try {
        //VALIDATION 
        const getCourses = "SELECT * FROM courses WHERE code = ?";
        let numCredits = 0;
        let enrolledStudents;

        //Validation of enrolled students
        const sql = "SELECT course, COUNT(*) as students FROM studyPlans GROUP BY course";
        enrolledStudents = await db.get(sql);

        for (let i = 0; i < studyPlan.length; i++) {
            const res = await db.get(getCourses, [studyPlan[i]]);
            if (!res.length) { throw { err: 404, msg: "Course not found in DB, impossible to add" }; } //validation for not existing course

            if (enrolledStudents.length && res[0].maxStudents) {  //validation of enrolled students
                if (enrolledStudents.find(c => c.course == studyPlan[i])) {
                    if (res[0].maxStudents <= enrolledStudents.find(c => c.course == studyPlan[i]).students) { throw { err: 422, msg: "Course" + ` ${studyPlan[i]}` + " already reached max number of students" }; }
                }
            }
            numCredits += res[0].credits;
        }
        //Validation on number of credits
        if (time == 'part' && (numCredits < 20 || numCredits > 40)) { throw { err: 422, msg: "Costraint for credit number of study plan violated" }; }
        if (time == 'full' && (numCredits < 60 || numCredits > 80)) { throw { err: 422, msg: "Costraint for credit number of study plan violated" }; }

        //Reached this point validation on preparatory courses and incompatible courses is needed
        const courseList = await this.getAllCourses(); //can use this since the presence of all the courses in the DB was previously verified
        const studyPlanCourses = studyPlan.map(c => courseList.find(x => x.code === c));
        //Incopatible courses validation
        if (studyPlanCourses.map(c => c.incopatibleWith).reduce((acc, val) => acc.concat(val), []).some(cl => studyPlan.includes(cl))) { throw { err: 422, msg: "Incompatible course constraint violated" }; }
        //Preparatory course validation
        const prepCourses = Array.from(studyPlanCourses.map(c => c.PreparatoryCourse));
        for (let i = 0; i < prepCourses.length; i++) {
            if (prepCourses[i]) {
                if (!studyPlan.includes(prepCourses[i])) {
                    throw { err: 422, msg: "Preparatory course constraint violated" };
                }
            }
        }


        //ADD
        const sql1 = 'UPDATE users SET time=? WHERE id=?'
        const result = await db.query(sql1, [`${time}`, user]);
        if (studyPlan.length) {
            const sql2 = "INSERT INTO studyPlans (user, course) VALUES (?, ?)"
            for (let i = 0; i < studyPlan.length; i++) {
                const result = await db.query(sql2, [user, studyPlan[i]]);
            }
        }

        const emptyenrolledStudents = "UPDATE courses SET enrolledStudents=NULL"; //empty the table before the update
        await db.query(emptyenrolledStudents, []);
        enrolledStudents = await db.get(sql);
        const updateEnrolled = "UPDATE courses SET enrolledStudents=? WHERE code=?";
        for (let i = 0; i < enrolledStudents.length; i++) {
            const result = await db.query(updateEnrolled, [enrolledStudents[i].students, enrolledStudents[i].course]);
        }
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
};


exports.deleteStudyPlan = async (user) => {
    try {
        const nullfield = '';
        const sql1 = 'DELETE FROM studyPlans WHERE user=?';
        const result1 = await db.query(sql1, [user]);
        const sql2 = 'UPDATE users SET time=? WHERE id=?';
        const result2 = await db.query(sql2, [null, user]);

        const sql = "SELECT course, COUNT(*) as students FROM studyPlans GROUP BY course";
        const enrolledStudents = await db.get(sql);
        const emptyenrolledStudents = "UPDATE courses SET enrolledStudents=NULL";
        await db.query(emptyenrolledStudents, []);
        const updateEnrolled = "UPDATE courses SET enrolledStudents=? WHERE code=?";
        for (let i = 0; i < enrolledStudents.length; i++) {
            const result = await db.query(updateEnrolled, [enrolledStudents[i].students, enrolledStudents[i].course]);
        }
    }
    catch (err) {
        throw err;
    }
};

