import React from 'react';
import './Main.css';
import logoSpotify from '../../assets/spotify.png'

function Main() {
  return (
    <div className="Main">
      <div className="Main-content">
        <p>
          Acompanhe a <strong>letra</strong> das suas músicas favoritas 
          <br/> <strong>automáticamente</strong> e em <strong>tempo real</strong>
        </p>

        <a href="https://accounts.spotify.com/authorize?client_id=3ecbff2c61374e7e9c089982bf8878a0&response_type=code&redirect_uri=http:%2F%2Flocalhost:3000%2Fcallback&scope=user-read-currently-playing&state=34fFs29kd09">
          <button> 
            <img src={logoSpotify} alt="Spotify Logo"/>
            CONECTAR CONTA SPOTIFY
          </button>
        </a>
      </div>
    </div>
  );
}

export default Main;
