import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import React from 'react';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import Transcript from "../Transcript/Transcript";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";

export default function MainParticipant() {

  const mainParticipant = useMainSpeaker();
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const {
    room: { localParticipant },
  } = useVideoContext();

  



  const videoPriority =
    mainParticipant === selectedParticipant || mainParticipant === screenShareParticipant ? 'high' : null;

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant} screenShareParticipant={screenShareParticipant} localParticipant={localParticipant}>
      <ParticipantTracks participant={mainParticipant} disableAudio enableScreenShare videoPriority={videoPriority} mainPariticipant={true}/>
      <Transcript height={"100%"}/>
    </MainParticipantInfo>
  );
}




