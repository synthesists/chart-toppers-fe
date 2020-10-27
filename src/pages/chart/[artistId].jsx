import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";

import Chart from '../../components/Chart'
import { datasets, getVisibleTracks, getMostPopularTrack } from '../../utils/parseChartHistory';
const AudioPlayer = dynamic(() => import("../../components/Audio"), { ssr: false });

const Page = () => {
  const [currentWeek, setCurrentWeek] = useState(-1);
  const [previewUrl, setPreviewUrl] = useState('');
  const [playFunction, setPlayFunction] = useState(() => () => {});
  
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();
  const toPlay = React.useRef(false);
  const toRestart = React.useRef(false);

  const visibleTracks = getVisibleTracks(currentWeek);
  const mostPopularTrack = getMostPopularTrack(Math.floor(currentWeek));

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); 

  useEffect(() => {
    if (mostPopularTrack) {
      setPreviewUrl(mostPopularTrack.previewUrl);
    }
  }, [mostPopularTrack]);

  const togglePlay = () => {
    playFunction();
    toPlay.current = !toPlay.current;
  }
  const restart = () => {
    toRestart.current = !toRestart.current;
  }

  const animate = (time) => {
    if (previousTimeRef.current != undefined) {
      if (toRestart.current) {
        setCurrentWeek(0)
        previousTimeRef.current = time
        toRestart.current = false;
      } else {
        const deltaTime = time - previousTimeRef.current;
        
        if (toPlay.current) {
          setCurrentWeek(week => (week + deltaTime * 0.005));
        } else {
          previousTimeRef.current = time
        }
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  return (
    <div>
      <AudioPlayer setPlayFunction={setPlayFunction} url={previewUrl}/>
      <button onClick={togglePlay}>{"Toggle Play"}</button>
      <button onClick={restart} >Reset</button>
      <Chart datasets={datasets} currentWeek={currentWeek}/>
      <ul>
        {visibleTracks.map((track) => <li key={track.id} >{track.id}</li>)}
      </ul>
    </div>
  )
}

export default Page
