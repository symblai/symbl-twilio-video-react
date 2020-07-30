import { DEFAULT_VIDEO_CONSTRAINTS } from '../../../constants';
import { useCallback, useEffect, useState } from 'react';
import Video from 'twilio-video';

export default function useLocalTracks() {
  const [audioTrack, setAudioTrack] = useState();
  const [videoTrack, setVideoTrack] = useState();
  const [isAcquiringLocalTracks, setIsAcquiringLocalTracks] = useState(false);

  const getLocalAudioTrack = useCallback((deviceId) => {
    const options= {};

    if (deviceId) {
      options.deviceId = { exact: deviceId };
    }

    return Video.createLocalAudioTrack(options).then(newTrack => {
      setAudioTrack(newTrack);
      return newTrack;
    });
  }, []);

  const getLocalVideoTrack = useCallback((newOptions) => {
    // In the DeviceSelector and FlipCameraButton components, a new video track is created,
    // then the old track is unpublished and the new track is published. Unpublishing the old
    // track and publishing the new track at the same time sometimes causes a conflict when the
    // track name is 'camera', so here we append a timestamp to the track name to avoid the
    // conflict.
    const options = {
      ...(DEFAULT_VIDEO_CONSTRAINTS),
      name: `camera-${Date.now()}`,
      ...newOptions,
    };

    return Video.createLocalVideoTrack(options).then(newTrack => {
      setVideoTrack(newTrack);
      return newTrack;
    });
  }, []);

  const removeLocalVideoTrack = useCallback(() => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(undefined);
    }
  }, [videoTrack]);

  useEffect(() => {
    setIsAcquiringLocalTracks(true);
    Video.createLocalTracks({
      video: {
        ...(DEFAULT_VIDEO_CONSTRAINTS),
        name: `camera-${Date.now()}`,
      },
      audio: true,
    })
      .then(tracks => {
        const videoTrack = tracks.find(track => track.kind === 'video');
        const audioTrack = tracks.find(track => track.kind === 'audio');
        if (videoTrack) {
          setVideoTrack(videoTrack);
        }
        if (audioTrack) {
          setAudioTrack(audioTrack);
        }
      })
      .finally(() => setIsAcquiringLocalTracks(false));
  }, []);

  const localTracks = [audioTrack, videoTrack].filter(track => track !== undefined);

  return { localTracks, getLocalVideoTrack, getLocalAudioTrack, isAcquiringLocalTracks, removeLocalVideoTrack };
}
