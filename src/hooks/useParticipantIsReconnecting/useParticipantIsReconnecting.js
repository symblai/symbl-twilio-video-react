import { useEffect, useState } from 'react';

export default function useParticipantIsReconnecting(participant) {
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    if (participant.on) {
      const handleReconnecting = () => setIsReconnecting(true);
      const handleReconnected = () => setIsReconnecting(false);

      participant.on('reconnecting', handleReconnecting);
      participant.on('reconnected', handleReconnected);
      return () => {
        participant.off('reconnecting', handleReconnecting);
        participant.off('reconnected', handleReconnected);
      };
    }
  }, [participant]);

  return isReconnecting;
}
