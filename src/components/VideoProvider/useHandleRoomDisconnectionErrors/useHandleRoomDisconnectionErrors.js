import { useEffect } from 'react';

export default function useHandleRoomDisconnectionErrors(room, onError) {
  useEffect(() => {
    const onDisconnected = (room, error) => {
      if (error) {
        onError(error);
      }
    };

    room.on('disconnected', onDisconnected);
    return () => {
      room.off('disconnected', onDisconnected);
    };
  }, [room, onError]);
}
