import { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import streaks from '../../streaks'

import dynamic from "next/dynamic";
const response = streaks;
response.tracks = response.tracks.map((track) => ({ ...track, isMostPopularAt: new Set(track.isMostPopularAt) }))

const randomColourGenerator = () => `rgba(${Math.random() * 64 + 96}, ${Math.random() * 128 + 128}, ${Math.random() * 128 + 128}, 0.7)`

const createDatasetFromStreak = ({ startDate, positions, weekOffset }, id) => {
  const data = positions.map((position, x) => ({ x: x + weekOffset, y: position }))
  const colour = randomColourGenerator()
  return {
    label: `${id}-${startDate}`,
    fill: 'start',
    borderColor: colour,
    backgroundColor: [colour, randomColourGenerator()],
    showLine: true,
    data,
  }
}
const AudioPlayer = dynamic(() => import("../../components/Audio"), {
  ssr: false,
});

const NUMBER_OF_VISIBLE_WEEKS = 20;

const datasets = response.tracks.flatMap(track => track.streaks.map(streak => createDatasetFromStreak(streak, track.id)))
const startDate = new Date()

const streakIsVisible = ({ weekOffset, positionsLength }, currentWeek, lastWeek) => {
  return (weekOffset < lastWeek && weekOffset + positionsLength > currentWeek)
}

const getVisibleTracks = (currentWeek) => {
  const firstVisibleWeek = currentWeek - NUMBER_OF_VISIBLE_WEEKS;

  return response.tracks.filter(({ streaks }) => streaks.some((streak) => streakIsVisible(streak, firstVisibleWeek, currentWeek)))
}

const getMostPopularTrack = (currentWeek) => {
  return response.tracks.find((track) => track.isMostPopularAt.has(currentWeek))
}

const Chart = () => {
  const [currentWeek, setCurrentWeek] = useState(-1);
  const [previewUrl, setPreviewUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [playFunction, setPlayFunction] = useState(() => () => console.log(1));

  const visibleTracks = getVisibleTracks(currentWeek);
  const mostPopularTrack = getMostPopularTrack(Math.floor(currentWeek));

  if (mostPopularTrack && mostPopularTrack.previewUrl !== previewUrl) {
    setPreviewUrl(mostPopularTrack.previewUrl);
  }

  useEffect(() => {
    if (currentWeek - 1 < response.totalNumberOfWeeks) {
      setTimeout(() => {
        if (playing) {
          setCurrentWeek(currentWeek + .1);
        }
      }, 20)
    }
  }, [currentWeek, playing]);
  
  const options = {
    fill: true,
    animation: false,
    legend: {
      display: false
    },
    tooltips: {
        enabled: false
    },
    scales: {
       xAxes: [{
          type: 'linear',
          ticks: {
            min: currentWeek - NUMBER_OF_VISIBLE_WEEKS,
            max: currentWeek,
            callback: (value) => value % 1
              ? undefined
              : new Date(new Date().setDate(startDate.getDate() + 7 * value)).toJSON().substring(0, 10),
          },
          gridLines: {
            drawBorder: false,
          },
       }],
       yAxes: [{
          type: 'linear',
          ticks: {
            reverse: true,
            min: 0,
            max: 100,
          }
       }],
    }
};

  const myData = {
	  options,
    datasets
  };
  
  return (
    <div>
      <AudioPlayer setPlayFunction={setPlayFunction} url={previewUrl}/>
      <button onClick={() => {
        playFunction();
        setPlaying(!playing)
        }}>{playing ? "Pause" : "Play"}</button>
      {!playing && <button onClick={() => {
        setCurrentWeek(0)
      }} >Reset</button>}
      <Scatter style={{ 'background-color': 'red' }}data={myData} options={options} />
      <ul>
        {visibleTracks.map((track) => (
          <li key={track.id} >{track.id}</li>
        ))}
      </ul>
    </div>
  )
}

export default Chart