import { useEffect } from 'react';

export default function useHandleOnDisconnect(room, onDisconnect) {
  useEffect(() => {
    room.on('disconnected', onDisconnect);
    return () => {
      room.off('disconnected', onDisconnect);
    };
  }, [room, onDisconnect]);
}
