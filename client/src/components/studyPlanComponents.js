import { Button, Col, Container, Row, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DashCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

function StudyPlanApp(props) {
    return (
        <Row className='mt-4'>
            <h2>List of courses inside your study plan</h2>
            <StudyPlanTable addCredits={props.addCredits} getOldPlan={props.getOldPlan} deleteStudyPlan={props.deleteStudyPlan} removeFromPlan={props.removeFromPlan} user={props.user} addStudyplan={props.addStudyplan} time={props.time} list={props.list} credits={props.credits} studyplan={props.studyplan} className='table'> </StudyPlanTable>
        </Row>
    )
};

const full = 'full';
const part = 'part';
function CreateStudyPlan(props) {
    return (
        <Container className='mt-4'>
            <Row>
                <Row><h3>NO STUDY PLAN AVAILABLE, CREATE A NEW ONE</h3></Row>
                <Col><Button variant='dark' onClick={() => { props.setTime(full); props.setCredits(0); }}>Full</Button></Col>
                <Col><Button variant='dark' onClick={() => { props.setTime(part); props.setCredits(0); }}>Part</Button></Col>
            </Row>
        </Container>
    )
}



function StudyPlanTable(props) {
    return (
        <Container>
            <Table responsive="sm" hover>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Credits</th>
                    </tr>
                </thead>
                <tbody>
                    {props.studyplan.map((c) => <CourseRow studyplan={props.studyplan} addCredits={props.addCredits} removeFromPlan={props.removeFromPlan} list={props.list} course={c} key={`plan ${c}`} />)}
                </tbody>
            </Table>
            <Row>
                <Col>
                    <Button onClick={() => {
                        if (props.time === 'full' && props.credits < 60) {
                            toast.error('Please add some more courses. You need at least 60 credits to create the plan');
                        } else if (props.time === 'part' && props.credits < 20) {
                            toast.error('Please add some more courses. You need at least 20 credits to create the plan');
                        }
                        else {
                            props.addStudyplan(props.studyplan, props.time).then().catch();
                        }
                    }} variant='dark' style={{ marginRight: 5 }}>Save</Button>
                    <Button variant='dark' onClick={() => { props.getOldPlan(); }} style={{ marginRight: 5 }}>Cancel</Button>
                    <Button variant='danger' onClick={() => { props.deleteStudyPlan(); }} style={{ marginRight: 5 }}>Delete Plan</Button>
                </Col>
                <Col><span>{props.time === 'full' ? 'You can insert between 60 and 80 CFU' : 'You can insert between 20 and 40 CFU'}   </span></Col>
                <Col><span>Total Plan Credits: {props.credits}   </span></Col>
            </Row>
        </Container>
    )
};

function CourseRow(props) {
    return (
        <>
            <tr>
                <CourseData studyplan={props.studyplan} addCredits={props.addCredits} removeFromPlan={props.removeFromPlan} list={props.list} course={props.course} />
            </tr>
        </>
    )
}

function CourseData(props) {
    return (
        <>
            <td align="left"> {props.course} </td>
            <td> <span> {props.list.filter(course => course.code === props.course).map(c => c.name)} </span></td>
            <td> <span> {props.list.filter(course => course.code === props.course).map(c => c.credits)} </span></td>
            <td>
                {
                    <OverlayTrigger key={'left'} placement={'left'} overlay={<Tooltip id={`tooltip-left`}>Remove </Tooltip>}>
                        <DashCircle onClick={() => {
                            if (props.studyplan.map(c => props.list.find(x => x.code === c)).find(a => a.PreparatoryCourse === props.course)) {
                                toast.error(`Could not remove this corse since it is a preparatory course for ${props.studyplan.map(c => props.list.find(x => x.code === c)).find(a => a.PreparatoryCourse === props.course).code} - ${props.studyplan.map(c => props.list.find(x => x.code === c)).find(a => a.PreparatoryCourse === props.course).name}`);
                            }
                            else {
                                props.removeFromPlan(props.course);
                                props.addCredits(-(props.list.find(c => c.code === props.course).credits));
                            }
                        }}></DashCircle>
                    </OverlayTrigger>
                }
            </td>
        </>);
};

export { StudyPlanApp, CreateStudyPlan };