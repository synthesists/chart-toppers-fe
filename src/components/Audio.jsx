import { useEffect, useRef } from 'react';

const player = ({ url, isPlaying }) => {
  const audio = useRef(new Audio());

  useEffect(() => {
    if (url) {
      audio.current.src = url;
      if (isPlaying) {
        audio.current.play();
      }
    }
  }, [url]);

  useEffect(() => {
    if (audio.current.readyState) {
      if (isPlaying) {
        audio.current.play();
      } else {
        audio.current.pause();
      }
    }
  }, [isPlaying])

  return null;
};

export default player