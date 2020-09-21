import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import lunaApi from '../../api/lunaApi';
import { useAuth } from '../../hooks/Auth'

function Dashboard() {
  
  const [trackInfo, setTrackInfo] = useState({});
  const [lyrics, setLyrics] = useState('');
  
  const {getToken} = useAuth();
  
  
  useEffect(() => {
    async function loadTrack(){
      const response = await lunaApi.get(`/current/track?token=${getToken()}`);

      setTrackInfo(response.data);
      
    }

    async function loadLyric(){
      const response = await lunaApi.get('/searchLyrics', {
        params:{
          artist: trackInfo.artist,
          track: trackInfo.track,
        }
      });

      setLyrics(response.data);
      
    }
  
    loadTrack();
    loadLyric();
  
  }, [getToken, trackInfo.artist, trackInfo.track]);
  
  return (
    <div className="Dashboard">
      <div className="Dashboard-content">
        <div>
          <span>
            {lyrics}
          </span>
        </div>
      </div>
      <div className="Dashboard-track-info">
        <img src={trackInfo.thumbnail_url} alt="Album"/>
        <div>
          <strong>
            {trackInfo.artist}
          </strong>
          <span>
            {trackInfo.track}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
