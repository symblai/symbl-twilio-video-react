import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import AudioTrack from '../AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';

export default function Publication({ publication, isLocal, disableAudio, videoPriority, mainParticipant }) {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.kind) {
    case 'video':
      return (
        <VideoTrack
          track={track}
          priority={videoPriority}
          mainParticipant={mainParticipant}
          isLocal={track.name.includes('camera') && isLocal}
        />
      );
    case 'audio':
      return disableAudio ? null : <AudioTrack track={track} />;
    default:
      return null;
  }
}
