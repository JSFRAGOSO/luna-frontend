import React from 'react';
import logoSpotify from '../../assets/logo.png'
import './Header.css';

function Header() {
  return (
    <div className="Header">
      <header className="Header-header">
        <img src={logoSpotify} alt="logo"/>
      </header>
    </div>
  );
}

export default Header;
