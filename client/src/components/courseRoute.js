import { Container, Row, Col } from 'react-bootstrap';
import { NavBarApp } from './navBarComponents';
import { CourseApp } from './courseComponents';
import { LoginForm } from './authenticationComponents';
import { StudyPlanApp, CreateStudyPlan } from './studyPlanComponents';
//route *, displayed when no ather route matches
function DefaultRoute() {
    return (
        <Container className='App'>
            <h1>No data here go to a valid route</h1>
        </Container>
    );
};

//route that displays login form
function LoginRoute(props) {
    return (
        <Container fluid className='App'>
            <Row>
                <Col className='mt-3'>
                    <h1>Login</h1>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs={6}>
                    <LoginForm login={props.login} />
                </Col>
            </Row>
        </Container>
    );
}

//Main page component with Navbar and the list of all available courses offered by the university
function CourseRoute(props) {
    return (
        <Container fluid className='App'>
            <Row>
                <Col>
                    <NavBarApp logout={props.logout} loggedIn={props.loggedIn} />
                </Col>
            </Row>
            {props.loggedIn &&
                <Row className="justify-content-md-center">
                    <Col xs={9} className='col-15 mt-5 g-5'>
                        {props.time && //if a studyplan exists show it
                            <StudyPlanApp addCredits={props.addCredits} getOldPlan={props.getOldPlan} deleteStudyPlan={props.deleteStudyPlan} removeFromPlan={props.removeFromPlan} user={props.user} addStudyplan={props.addStudyplan} time={props.time} list={props.courses} credits={props.credits} studyplan={props.studyPlan} />
                        }
                        {!props.time && //if a study plan doesn't exists, show page to create it
                            <CreateStudyPlan setCredits={props.setCredits} time={props.time} setTime={props.setTime} />
                        }
                    </Col>
                </Row>
            }
            <Row>
                <Col className='col-15 mt-5' >
                    <CourseApp credits={props.credits} addCredits={props.addCredits} loggedIn={props.loggedIn} time={props.time} addToPlan={props.addToPlan} courses={props.courses} studyplan={props.studyPlan} />
                </Col>
            </Row>
        </Container>
    );
};

export { DefaultRoute, CourseRoute, LoginRoute };
