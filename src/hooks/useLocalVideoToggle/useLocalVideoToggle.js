import { useCallback, useRef, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalVideoToggle() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
    removeLocalVideoTrack,
    onError,
  } = useVideoContext();
  const videoTrack = localTracks.find(track => track.name.includes('camera'));
  const [isPublishing, setIspublishing] = useState(false);
  const previousDeviceIdRef = useRef();

  const toggleVideoEnabled = useCallback(() => {
    if (!isPublishing) {
      if (videoTrack) {
        previousDeviceIdRef.current = videoTrack.mediaStreamTrack.getSettings().deviceId;
        const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        if (localParticipant) {
          localParticipant.emit('trackUnpublished', localTrackPublication);
        }
        removeLocalVideoTrack();
      } else {
        setIspublishing(true);
        getLocalVideoTrack({ deviceId: { exact: previousDeviceIdRef.current } })
          .then((track) => localParticipant?.publishTrack(track, { priority: 'low' }))
          .catch(onError)
          .finally(() => setIspublishing(false));
      }
    }
  }, [videoTrack, localParticipant, getLocalVideoTrack, isPublishing, onError, removeLocalVideoTrack]);

  return [!!videoTrack, toggleVideoEnabled];
}
