import React from 'react';
import "./header.css";
import { Link } from 'react-router-dom';
import { UserData } from '../../context/UserContext';

const Header = () => {
  const { isAuth } = UserData(); // Access context directly

  return (
    <header>
      <div className='logo'>MUARIF</div>
      <div className='link'>
        <Link to={'/'}>Home</Link>
        <Link to={'/courses'}>Courses</Link>
        <Link to={'/about'}>About</Link>
        {isAuth ? (
          <Link to={'/account'}>Account</Link>
        ) : (
          <Link to={'/login'}>Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
