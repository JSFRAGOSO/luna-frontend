import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import lunaApi from '../../api/lunaApi';
import {connect, keepOnTrack} from '../../api/socket';
import { useAuth } from '../../hooks/Auth'
import { useCallback } from 'react';

function Dashboard() {
  
  const [trackInfo, setTrackInfo] = useState({});
  const [progress, setProgress] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  
  const [prevLine, setPrevLine] = useState({});
  const [currentLine, setCurrentLine] = useState({});
  const [nextLine, setNextLine] = useState({});

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
    const token = getToken();
    console.log(token)
    async function loadTrack(){
      const response = await lunaApi.get(`/current/track?token=${token}`);

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
    setCurrentLine({})
    setPrevLine({})
    setNextLine({})
    if(response.data)
      setSyncLyrics(response.data.lines)
  }
  
  loadLyric();

}, [trackInfo]);

useEffect(() => {
  
  if(!!syncLyrics){
    syncLyrics.forEach((line, index) => {
      
      if(line.time <= progress){   
        
        setCurrentLine(line)
        setPrevLine(syncLyrics[index - 1])
        setNextLine(syncLyrics[index + 1])
      }
    })
  }
}, [syncLyrics, progress, currentLine])

  
  return (
    <div className="Dashboard">
      <div className="Dashboard-content">
        <div className="Dashboard-lyrics">
        {
          prevLine &&
          <span id="NocurrentLine" className={`${animationClass}`} onAnimationEnd={() => setAnimationClass('')}>
            {!!prevLine.words ? prevLine.words[0].string : ''}
          </span>
        }

        {
          currentLine && 
          <span id="currentLine" className={`${animationClass}`} onAnimationEnd={() => setAnimationClass('')}>
            {!!currentLine.words ? currentLine.words[0].string : ''}
          </span>
        }
          {
          nextLine && 
          <span id="NocurrentLine" className={`${animationClass}`} onAnimationEnd={() => setAnimationClass('')}>
            {!!nextLine.words ? nextLine.words[0].string : ''}
          </span>
          }
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
