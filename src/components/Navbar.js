// job-skill-app/src/components/Navbar.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Job Skill App
        </Typography>
        {user ? (
          <>
            {user.role === 'worker' && (
              <Button color="inherit" component={Link} to="/worker-dashboard">
                Worker Dashboard
              </Button>
            )}
            {user.role === 'client' && (
              <Button color="inherit" component={Link} to="/client-dashboard">
                Client Dashboard
              </Button>
            )}
            {user.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin-dashboard">
                Admin Dashboard
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register-worker">
              Register as Worker
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;