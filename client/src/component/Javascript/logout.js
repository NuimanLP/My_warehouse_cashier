import React from "react";
import { Button } from 'react-bootstrap';
import config from "../../config";

const Logout = () => {
    const handleLogout = () => {
        sessionStorage.removeItem('jwt');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('role');
        window.location.href = config.windowlocateHome;
    };

    return (
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
    );
};

export default Logout;
