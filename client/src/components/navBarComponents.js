import { Navbar, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DoorOpen, Mortarboard } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

function NavBarApp(props) {
    const navigate = useNavigate();
    return (
        <Navbar expand="lg" variant="dark" fixed="top" className="navbar-padding" style={{ backgroundColor: 'dimgrey' }}>
            <Navbar.Brand>
                <Link to="/">
                    <Mortarboard color="white" size={30} />
                </Link>
                <span> Study Plan</span>
            </Navbar.Brand>
            {!props.loggedIn &&
                (<Navbar.Collapse className="justify-content-end">
                    <Navbar.Brand href="#account" className='justify-content-end'>
                        <OverlayTrigger key={'left'} placement={'left'} overlay={<Tooltip id={`tooltip-left`}>Login </Tooltip>}>
                            <DoorOpen color='white' size={25} onClick={() => navigate('/login')} />
                        </OverlayTrigger>
                    </Navbar.Brand>
                </Navbar.Collapse>)
            }
            {props.loggedIn && <Navbar.Collapse className="justify-content-end">
                <Navbar.Brand href="#account" className='justify-content-end'>
                    <OverlayTrigger key={'left'} placement={'left'} overlay={<Tooltip id={`tooltip-left`}>Logout </Tooltip>}>
                        <Button variant='outline-light' onClick={props.logout}> Logout </Button>
                    </OverlayTrigger>
                </Navbar.Brand>
            </Navbar.Collapse>
            }

        </Navbar>
    )
};

export { NavBarApp };