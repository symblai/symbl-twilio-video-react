import { useState, useEffect } from 'react';

export default function useIsTrackEnabled(track) {
  const [isEnabled, setIsEnabled] = useState(track ? track.isEnabled : false);

  useEffect(() => {
    setIsEnabled(track ? track.isEnabled : false);

    if (track) {
      const setEnabled = () => setIsEnabled(true);
      const setDisabled = () => setIsEnabled(false);
      track.on('enabled', setEnabled);
      track.on('disabled', setDisabled);
      return () => {
        track.off('enabled', setEnabled);
        track.off('disabled', setDisabled);
      };
    }
  }, [track]);

  return isEnabled;
}
