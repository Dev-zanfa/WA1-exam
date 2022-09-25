import { Col, Container, Table, Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { ArrowsAngleContract, ArrowsAngleExpand, PlusCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';



function CourseApp(props) {
    return (
        <Col className='mt-4'>
            <h1>List of all courses available</h1>
            <CourseTable credits={props.credits} addCredits={props.addCredits} loggedIn={props.loggedIn} time={props.time} studyplan={props.studyplan} addToPlan={props.addToPlan} courses={props.courses} className='table'> </CourseTable>
        </Col>
    )
};

function CourseTable(props) {
    return (
        <Container>
            <Table responsive="sm" hover>
                <thead style={{ position: 'sticky', top: 55 }} >
                    <tr>
                        <th style={{ width: "25%", backgroundColor: 'white' }}>Code</th>
                        <th style={{ backgroundColor: 'white' }}>Name</th>
                        <th style={{ backgroundColor: 'white' }}>Credits</th>
                        <th style={{ backgroundColor: 'white' }}>Enrolled Students</th>
                        <th style={{ backgroundColor: 'white' }}>Max Students</th>
                        {props.loggedIn && <th style={{ backgroundColor: 'white' }}>Add</th>}
                        <th style={{ backgroundColor: 'white' }}>Expand</th>
                    </tr>
                </thead>
                <tbody>
                    {props.courses.sort(function (a, b) {
                        if (a.name < b.name) {
                            return -1;
                        }
                        if (a.name > b.name) {
                            return 1;
                        }
                        return 0;
                    }).map((c) => <CourseRow courses={props.courses} credits={props.credits} addCredits={props.addCredits} loggedIn={props.loggedIn} time={props.time} studyplan={props.studyplan} addToPlan={props.addToPlan} course={c} key={c.code} />)}
                </tbody>
            </Table>
        </Container>
    )
};


function CourseRow(props) {
    const [expanded, setExpanded] = useState(false);
    const colour = () => {
        return ((props.loggedIn && !props.studyplan.includes(props.course.code) && props.studyplan.some(c => props.course.incopatibleWith.includes(c))) ||
            (props.loggedIn && !props.studyplan.includes(props.course.code) && props.course.PreparatoryCourse && !(props.studyplan.includes(props.course.PreparatoryCourse))) ||
            (!props.studyplan.includes(props.course.code) && props.loggedIn && props.course.maxStudents && (props.course.maxStudents === props.course.enrolledStudents))
        ) ? 'lightsalmon' : 'lightgray  '
    }
    const colourExpanded = () => {
        return expanded ? 'lightsalmon' : 'lightsalmon';
    }

    return (
        <>
            <tr style={{ backgroundColor: `${colour()}` }}>
                <CourseData courses={props.courses} credits={props.credits} addCredits={props.addCredits} loggedIn={props.loggedIn} time={props.time} studyplan={props.studyplan} addToPlan={props.addToPlan} course={props.course} setExpanded={setExpanded} expanded={expanded} />
            </tr>
            <>
                {expanded &&
                    <tr style={{ backgroundColor: `${colour()}` }}>
                        <CourseMoreInfo courses={props.courses} course={props.course} expanded={expanded} />
                    </tr>
                }</>
            {props.loggedIn && !props.studyplan.includes(props.course.code) && props.studyplan.some(c => props.course.incopatibleWith.includes(c)) &&
                <tr>
                    <td align='left' colSpan={7} style={{ borderStyle: 'hidden', color: 'red', backgroundColor: `${colourExpanded()}`/*, background: `linear-gradient(${colourExpanded()}  ,transparent)` */ }}>
                        &ensp; Impossible to add this course, incopatible with {props.course.incopatibleWith.find(c => props.studyplan.includes(c))}</td>
                </tr>}
            {props.loggedIn && !props.studyplan.includes(props.course.code) && props.course.PreparatoryCourse && !(props.studyplan.includes(props.course.PreparatoryCourse)) &&
                <tr>
                    <td align='left' colSpan={7} style={{ borderStyle: 'hidden', color: 'red', backgroundColor: `${colourExpanded()}`/*, background: `linear-gradient(${colourExpanded()}  ,transparent)` */ }}>
                        &ensp; Impossible to add this course, preparatory course {props.course.PreparatoryCourse} not present in current study plan</td>
                </tr>}
            {!props.studyplan.includes(props.course.code) && props.loggedIn && props.course.maxStudents && (props.course.maxStudents === props.course.enrolledStudents) &&
                <tr>
                    <td align='left' colSpan={7} style={{ borderStyle: 'hidden', color: 'red', backgroundColor: `${colourExpanded()}`/*, background: `linear-gradient(${colourExpanded()}  ,transparent)` */ }}>
                        &ensp; Impossible to add this course, max number of students for this course reached</td>
                </tr>}

        </>
    )
};

function CourseData(props) {
    return (
        <>
            <td align="left" > <strong>{props.course.code}</strong> </td>
            <td align='centre'> <strong>{props.course.name}</strong> </td>
            <td> <strong>{props.course.credits}</strong> </td>
            <td> <strong>{props.course.enrolledStudents}</strong></td>
            <td> <strong>{props.course.maxStudents}</strong></td>
            {props.loggedIn && <td>
                {!props.studyplan.includes(props.course.code) &&
                    <OverlayTrigger key={'left'} placement={'left'} overlay={<Tooltip id={`tooltip-left`}>Add to plan</Tooltip>}>
                        <PlusCircle onClick={() => {
                            if (!props.loggedIn) //if user not logged in 
                                toast.error('Please login to add courses');
                            else if (!props.time) //if plan doesn't exists
                                toast.error('Create a Plan First')
                            else if (props.studyplan.some(c => props.course.incopatibleWith.includes(c))
                                /*props.studyplan.includes(props.course.incopatibleWith[0])*/
                            ) { //try to add incopatible course 
                                toast.error(`Impossible to add this course, incopatible with ${props.course.incopatibleWith.find(c => props.studyplan.includes(c))}`);
                            } else if (props.course.PreparatoryCourse && !(props.studyplan.includes(props.course.PreparatoryCourse))) {
                                toast.error(`Impossible to add this course, preparatory course ${props.course.PreparatoryCourse} not present in current study plan`);
                            } else if (props.time === 'full' && (props.credits + props.course.credits) > 80) {
                                toast.error(`Impossible to add this course, maximum credit for your studyplan is 80 - Current value: ${props.credits}`)
                            } else if (props.time === 'part' && (props.credits + props.course.credits) > 40) {
                                toast.error(`Impossible to add this course, maximum credit for your studyplan is 40 - Current value: ${props.credits}`)
                                //} else if (props.course.maxStudents && (props.course.maxStudents === props.course.enrolledStudents)) {
                                //    toast.error(`Impossible to add this course, max number of students for this course reached`);
                            } else {
                                props.addToPlan(props.course.code);
                                props.addCredits(props.course.credits);
                            }
                        }}>
                        </PlusCircle>
                    </OverlayTrigger>
                }
            </td>
            }
            <td > {
                props.expanded ?
                    (<OverlayTrigger key={'left'} placement={'left'} overlay={<Tooltip id={`tooltip-left`}>Contract </Tooltip>}>
                        <ArrowsAngleContract onClick={() => { props.setExpanded(!props.expanded) }}></ArrowsAngleContract>
                    </OverlayTrigger>) :
                    (<OverlayTrigger key={'left'} placement={'left'} overlay={<Tooltip id={`tooltip-left`}>Expand </Tooltip>}>
                        <ArrowsAngleExpand onClick={() => { props.setExpanded(!props.expanded) }}></ArrowsAngleExpand>
                    </OverlayTrigger>)
            }
            </td>
        </>);
};

function CourseMoreInfo(props) {
    return (
        <>
            <td style={{ borderStyle: 'hidden' }} colSpan={2} align="left"> &ensp; {props.course.incopatibleWith.length ? `Incompatibilities:  ${props.course.incopatibleWith.map(c => `${c} (${props.courses.find(x => x.code === c).name.trim()}) `).join(", ")}` : "No incompatible course"} </td>
            <td style={{ borderStyle: 'hidden' }} colSpan={5} align="left"> {props.course.PreparatoryCourse ? `PreparatoryCourse: ${props.course.PreparatoryCourse} (${props.courses.find(x => x.code === props.course.PreparatoryCourse).name.trim()})` : "No preparatory course needed"} </td>
        </>);
};


export { CourseApp };