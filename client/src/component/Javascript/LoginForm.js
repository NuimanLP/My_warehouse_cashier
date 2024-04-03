import React, { useState } from 'react';
import { Form, Button, Alert, Container, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../CSS/LoginForm.css';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import config from '../../config.js';

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [honeypot, setHoneypot] = useState('');


    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (honeypot) {
            console.log('Bot detected');
            setErrMsg('Bot detected');
            return; 
        }
        setIsLoading(true);
        setErrMsg(null);
        console.log('Form submitted:', { username, password });
 

        try {

            console.log('Sending login request...');
            const response = await axios.post(`${config.serverUrlPrefix}/auth/local`, {
                identifier: username,
                password: password
            });

            console.log('Login response:', response);

            const token = response.data.jwt;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Fetching user details...');
            const userResponse = await axios.get(`${config.serverUrlPrefix}/users/me?populate=role`);
            console.log('User response:', userResponse);

            console.log("User role:", userResponse.data.role.name);
            //Session Storage
            sessionStorage.setItem('jwt', token);
            sessionStorage.setItem('username', userResponse.data.username);
            sessionStorage.setItem('role', userResponse.data.role.name);


            if (userResponse.data.role.name === 'Authenticated') {
                navigate('/admin');
            } else if (userResponse.data.role.name === 'Public') {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            setErrMsg('ชื่อผู้ใช้หรือรหัสผ่านผิด');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <Form.Group style={{ display: "none" }}>
                <Form.Label>Honeypot</Form.Label>
                <Form.Control
                    type="text"
                    name="honeypot"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                />
            </Form.Group>
            <Container id="Login-Container" className="Login-Container" style={{height:"100vh"}}>
                
                <Form onSubmit={handleSubmit} className="Form-Container">
                    {errMsg && (
                        <Alert variant="danger">{errMsg}</Alert>
                    )}
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label className="form-label">ชื่อผู้ใช้</Form.Label>
                        <Form.Control
                            className="form-control"
                            type="text"
                            placeholder="ชื่อผู้ใช้"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="form-label">รหัสผ่าน</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="รหัสผ่าน"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <Button variant="outline-secondary" onClick={togglePasswordVisibility} className="p-0">
                                {showPassword ? <EyeSlashFill /> : <EyeFill />}
                            </Button>
                        </InputGroup>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'เข้าสู่ระบบ'}
                        {isLoading && (
                            <Spinner animation="border" role="status">
                                <span >Loading...</span>
                            </Spinner>
                        )}
                    </Button>
                    <Link to="/register" >สมัครสมาชิก</Link>
                </Form>
            </Container>
        </div>
    );
};


export default LoginForm;
