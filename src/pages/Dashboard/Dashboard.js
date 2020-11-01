import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import lunaApi from '../../api/lunaApi';
import {connect, keepOnTrack} from '../../api/socket';
import { useAuth } from '../../hooks/Auth'
import { useCallback } from 'react';

function Dashboard() {
  
  const [trackInfo, setTrackInfo] = useState({});
  const [progress, setProgress] = useState(0);
  const [currentLyrics, setCurrentLyrics] = useState('');
  const [syncLyrics, setSyncLyrics] = useState([]);
  const {getToken} = useAuth();
  

  const handleProgressUpdate = useCallback(progress => {
    setProgress(progress)
  }, [])

  const handleTrackUpdate = useCallback(track => {
    setTrackInfo((state) => {
      if(state.track !== track.track){
        return track
      }
      else
      return state
    });
  }, [])

  
  useEffect(() => {
    async function loadTrack(){
      const response = await lunaApi.get(`/current/track?token=${getToken()}`);

      setTrackInfo(response.data);
    }

    function setupWebSocket(){
      connect();
    }
  
    loadTrack();

    setupWebSocket();
  
  }, [getToken]);


  useEffect(() => {
    keepOnTrack(track => {
      handleProgressUpdate(track.progress_ms);
      handleTrackUpdate(track)
    })
}, [handleProgressUpdate, handleTrackUpdate])

useEffect(() => {

  async function loadLyric(){
    const response = await lunaApi.get(`/lyrics/${trackInfo.track_id}`);
    
    if(response.data)
      setSyncLyrics(response.data.lines)
  }
  
  loadLyric();

}, [trackInfo]);

useEffect(() => {
  
  if(!!syncLyrics){
  
    const lyricsSoFar = syncLyrics.filter(lyric => {
     
      if(Math.abs(lyric.time) <= (Math.abs(progress) + 100)){
        
        return lyric
      }

      return null
    })
    if(lyricsSoFar.length){
      console.log(lyricsSoFar[lyricsSoFar.length - 1])
      setCurrentLyrics((state) => {
        if(state !== lyricsSoFar[lyricsSoFar.length - 1].words[0].string){
          return lyricsSoFar[lyricsSoFar.length - 1].words[0].string
        }
        else
        return state
      });
      
    }
  }
}, [syncLyrics, progress])

  
  return (
    <div className="Dashboard">
      <div className="Dashboard-content">
        <div>
          <span>
            {currentLyrics}
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
