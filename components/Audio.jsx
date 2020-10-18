import { useEffect } from 'react';

const audio = new Audio();
let playing = false;

const player = ({ url, setPlayFunction }) => {
  useEffect(() => {
    if (url) {
      audio.src = url;
      if (playing) audio.play();
    }
  }, [url]);

  useEffect(() => setPlayFunction(() => () => {
    if (playing && audio.src) {
      audio.pause();
      playing = false;
    } else {
      audio.play();
      playing = true;
    }
  }), [setPlayFunction]);

  return null;
};

export default player