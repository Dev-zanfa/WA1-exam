
function Course(code, name, credits, maxStudents, incopatibleWith, PreparatoryCourse, enrolledStudents) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.maxStudents = maxStudents;
    this.incopatibleWith = incopatibleWith;
    this.PreparatoryCourse = PreparatoryCourse;
    this.enrolledStudents = enrolledStudents;
}

export{Course}