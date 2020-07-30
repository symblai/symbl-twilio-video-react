import React, { createContext, useContext, useState, useEffect } from 'react';

export const selectedParticipantContext = createContext(null);

export default function useSelectedParticipant() {
  const [selectedParticipant, setSelectedParticipant] = useContext(selectedParticipantContext);
  return [selectedParticipant, setSelectedParticipant];
}

export function SelectedParticipantProvider({ room, children }) {
  const [selectedParticipant, _setSelectedParticipant] = useState(null);
  const setSelectedParticipant = (participant) =>
    _setSelectedParticipant(prevParticipant => (prevParticipant === participant ? null : participant));

  useEffect(() => {
    const onDisconnect = () => _setSelectedParticipant(null);
    room.on('disconnected', onDisconnect);
    return () => {
      room.off('disconnected', onDisconnect);
    };
  }, [room]);

  return (
    <selectedParticipantContext.Provider value={[selectedParticipant, setSelectedParticipant]}>
      {children}
    </selectedParticipantContext.Provider>
  );
}
