import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";

import Chart from '../components/Chart'
import { datasets, getVisibleTracks, getMostPopularTrack } from '../utils/parseChartHistory';
const AudioPlayer = dynamic(() => import("../components/Audio"), { ssr: false });
import useAnimationFrame from '../utils/useAnimationFrame';

const Page = () => {
  const [currentWeek, setCurrentWeek] = useState(-1);
  const [previewUrl, setPreviewUrl] = useState('');
  const [visibleTracks, setVisibleTracks] = useState([])
  const [mostPopularTrack, setMostPopularTrack] = useState();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [toggleAnimationPlay, restart] = useAnimationFrame(setCurrentWeek, 0.005);

  useEffect(()  => {
    setVisibleTracks(getVisibleTracks(currentWeek))
    setMostPopularTrack(getMostPopularTrack(Math.floor(currentWeek)))
  }, [Math.floor(currentWeek)])

  useEffect(() => {
    if (mostPopularTrack) {
      setPreviewUrl(mostPopularTrack.previewUrl);
    }
  }, [mostPopularTrack]);

  const togglePlay = () => {
    setIsAudioPlaying(!isAudioPlaying);
    toggleAnimationPlay()
  }

  return (
    <div>
      <AudioPlayer isPlaying={isAudioPlaying} url={previewUrl}/>
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
