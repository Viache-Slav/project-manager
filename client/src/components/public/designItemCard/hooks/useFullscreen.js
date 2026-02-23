import { useCallback, useEffect, useState } from 'react';

const useFullscreen = (ref, { onExit } = {}) => {
  const [isFs, setIsFs] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    const el = ref.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
    }
  }, [ref]);

  const exitFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
    } catch {
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFs(active);
      if (!active) onExit?.();
    };

    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [onExit]);

  return { isFs, toggleFullscreen, exitFullscreen };
};

export default useFullscreen;