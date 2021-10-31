import { useEffect, useState, useContext , createContext} from 'react';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '../useVideoContext/useVideoContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import 'font-awesome/css/font-awesome.min.css';

let hasEnter = false, hasLeft = false

const NotyfContext = createContext(
  // Notyf configuration
  new Notyf({
    duration: 3000,
    position: {
      x: 'left',
      y: 'bottom',
    },
    types: [
      {
        type: 'enter',
        background: '#88C0D0',
        className: "message",
        icon: {
          className: "fas fa-sign-out-alt",
          tagName: "i",
          text: ""
        }
      },
      {
        type: 'left',
        background: '#8FBCBB',
        icon: {
          className: "fas fa-sign-in-alt",
          tagName: "i",
        },
        className: "message"
      }
    ]
  })
);

export default function useParticipants() {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const [participants, setParticipants] = useState(Array.from(room.participants.values()));
  const notyf = useContext(NotyfContext);

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  useEffect(() => {
    if (dominantSpeaker) {
      setParticipants(prevParticipants => [
        dominantSpeaker,
        ...prevParticipants.filter(participant => participant !== dominantSpeaker),
      ]);
    }
  }, [dominantSpeaker]);

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
      if(!hasEnter){
        notyf.open({
          "type": "enter",
          "message": `${participant.identity} joined the meeting`
        })
      }

      hasEnter = !hasEnter
    }
    const participantDisconnected = (participant) => {
      setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
      if(!hasLeft){
        notyf.open({
          "type": "left",
          "message": `${participant.identity} has left the meeting`
        })
      }

      hasLeft = !hasLeft
    }
    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  return participants;
}
