import React from 'react';
import VideoTrack from '../VideoTrack/VideoTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

export default function LocalVideoPreview() {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find(track => track.name.includes('camera'));

  return videoTrack ? <VideoTrack track={videoTrack} isLocal /> : null;
}
