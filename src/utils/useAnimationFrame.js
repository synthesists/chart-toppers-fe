import { useRef, useEffect } from 'react';

const useAnimationFrame = (callback, animationSpeed) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const playing = useRef(false);
  const toRestart = useRef(false);
  const justStartedPlaying = useRef(true);

  const animate = (time) => {
    if (justStartedPlaying.current) {
      previousTimeRef.current = time;
      justStartedPlaying.current = false;
    }
    if (toRestart.current) {
      callback(-1)
      toRestart.current = false;
    }

    const deltaTime = time - previousTimeRef.current;
    callback(x => (x + deltaTime * animationSpeed));
    previousTimeRef.current = time;

    if (playing.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }

  useEffect(() => {
    if (playing.current) {
      justStartedPlaying.current = true;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current)
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [playing.current]); 

  const togglePlay = () => {
    playing.current = !playing.current
  }
  const restart = () => {
    toRestart.current = true
  }

  return [togglePlay, restart]
};

export default useAnimationFrame;