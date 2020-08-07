import SymblTwilioConnector from "../../../utils/symbl/SymblTwilioConnector";
import {useCallback, useState} from 'react';
import SymblWebSocketAPI from "../../../utils/symbl/SymblWebSocketAPI";

export default function useSymbl(onError, onResult, options) {
    const [isStarting, setIsStarting] = useState(false);
    const [connectionId, setConnectionId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isMute, setIsMuted] = useState(false);
    const [startedTime, setStartedTime] = useState(null);

    const startSymbl = useCallback(
        (roomName, email) => {
            console.log(roomName, email)
            setIsStarting(true);
            window.connector = new SymblTwilioConnector({
                callback: onResult,
                roomName
            });
            return window.connector.startSymblConnector(email)
                .then(response => {
                    console.log('Symbl Started. ', response);
                    if (response && response.connectionId) {
                        console.log('Subscribing')
                        window.connector.subscribe()
                        console.log('Subscribed to Symbl')
                        setConnectionId(response.connectionId);
                        console.log('ConnectionId: ', connectionId);
                        setIsConnected(true);
                    } else {
                        onError("Symbl couldn't be started.");
                    }
                    setIsStarting(false);
                }).catch(err => {
                onError(err);
                    setIsStarting(false);
            });
        },
        [onError, onResult, connectionId]
    );

    const stopSymbl = useCallback(async (connectionId) => {
        console.log('Stop symbl called for connectionId: ', connectionId, window.connector);
        if (window.connector) {
            console.log('Stopping Symbl: ', connectionId);
            try {
                const response = await window.connector.stopSymbl(connectionId)
                if (response && response.connectionId) {
                    console.log('Connection Stopped: ', response.connectionId);
                } else {
                    onError("Symbl couldn't be stopped.");
                }
                setIsConnected(false);
            } catch(err) {
                onError(err);
            }
        }
    }, [onError]);

    const startSymblWebSocketApi = useCallback(
        async (handlers, options) => {
            if (isStarting) {
                console.log('Another connection already starting. Returning');
            }
            setIsStarting(true);
            window.websocketApi = new SymblWebSocketAPI('en-US',
                handlers, options);
                // {
                //     participants,
                //     localParticipant,
                //     meetingId,
                //     meetingTitle
                // });
            try {
                await window.websocketApi.openConnectionAndStart();
                setStartedTime(new Date().toISOString());
                setIsConnected(true);
                setIsStarting(false);
            } catch (err) {
                onError(err);
                setIsStarting(false);
            }
        },
        [onError]
    );

    const stopSymblWebSocketApi = useCallback(
        async (callback) => {
            if (window.websocketApi) {
                try {
                    await window.websocketApi.stop(callback)
                    setIsConnected(false);
                } catch (err) {
                    onError(err);
                }
            }
        },
        [onError]
    );

    const muteSymbl = useCallback(
        () => {
            if (window.websocketApi) {
                try {
                    window.websocketApi.mute()
                    setIsMuted(true);
                } catch (err) {
                    onError(err);
                }
            }
        },
        [onError]
    );

    const unMuteSymbl = useCallback(
        () => {
            if (window.websocketApi) {
                try {
                    window.websocketApi.unmute()
                    setIsMuted(false);
                } catch (err) {
                    onError(err);
                }
            }
        },
        [onError]
    );

    return {
        isConnected,
        isStarting,
        connectionId,
        startSymbl,
        stopSymbl,
        startSymblWebSocketApi,
        stopSymblWebSocketApi,
        muteSymbl,
        isMute,
        unMuteSymbl,
        startedTime
    };
}
