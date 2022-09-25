import { useState } from 'react';
import { Form, Button, FloatingLabel, Row, Col } from 'react-bootstrap';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };

        props.login(credentials);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <br />
            <Form.Group controlId='username' className="formLogIn">
                <FloatingLabel label="Email">
                    <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                </FloatingLabel>
            </Form.Group>
            <br />
            <Form.Group controlId='password' className="formLogIn">
                <FloatingLabel label="password">
                    <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6} />
                    <Form.Control.Feedback type="invalid">
                        password must be at least 6 digit long
                    </Form.Control.Feedback>
                </FloatingLabel>
            </Form.Group>
            <br />
            <Button variant='dark' type="submit">
                Login
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-right" viewBox="-5 -1 20 20">
                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                </svg>
            </Button>
        </Form>
    )
};

function LogoutButton(props) {
    return (
        <Row>
            <Col>
                <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
            </Col>
        </Row>
    )
}

export { LoginForm, LogoutButton };