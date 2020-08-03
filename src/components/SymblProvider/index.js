import React, {createContext, useEffect, useState} from 'react';
import useSymbl from "./useSymbl/useSymbl";
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";

const symblConnectionMode = process.env.SYMBL_CONNECTION_MODE || 'websocket_api';

export const SymblContext = createContext(null);

export function SymblProvider({
                                  options, roomName, children, onError = () => {
    }
                              }) {
    const onErrorCallback = (error) => {
        console.log(`ERROR: ${error.message}`, error);
        onError(error);
    };

    const [closedCaptionResponse, setClosedCaptionResponse] = useState({});
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState([]);
    const {
        room: {localParticipant}
    } = useVideoContext();


    // const [resultCallbacks, setCallbacks] = useState([]);

    const onResultCallback = (data) => {
        // console.log(data);
        if (data) {
            // executeCallbacks(data);
            const {type} = data;
            if (type) {
                if (type === 'transcript_response') {
                    setClosedCaptionResponse(data)
                } else if (type === 'message_response') {
                    setMessages(data.messages)
                }
            }
        }
    }

    // const registerCallback = (callback) => {
    //     if (callback && typeof callback === 'function') {
    //         setCallbacks([...resultCallbacks, callback]);
    //     }
    // };
    //
    // const executeCallbacks = (data) => {
    //     resultCallbacks.forEach(callback => {
    //         setTimeout(() => {
    //             callback(data);
    //         }, 0)
    //     })
    // }

    const onSpeechDetected = (data) => {
        setClosedCaptionResponse(data)
    };

    /*const getAllMessages = () => {
        return localStorage.getItem('messages') || [];
    }

    const addMessages = (newMessages = []) => {
        const messages = getAllMessages();
        messages.push(newMessages);
        localStorage.setItem('messages', messages);

    };*/

    const onMessageResponse = (newMessages) => {
        // console.log('newMessages: ', newMessages);
        setNewMessages(newMessages);
        setMessages([messages, ...newMessages]);
    };

    const handlers = {
        onSpeechDetected,
        onMessageResponse
    };

    const {
        isConnected, connectionId, startedTime, startSymbl, stopSymbl, startSymblWebSocketApi, stopSymblWebSocketApi,
        muteSymbl, unMuteSymbl, isMute
    } =
        useSymbl(onErrorCallback, onResultCallback, {
            meetingTitle: roomName,
            meetingId: btoa(roomName),
            handlers,
            localParticipant: {
                name: localParticipant.identity
            },
            ...options
        });

    useEffect(() => {
        (async () => {
            if (roomName) {
                if (symblConnectionMode === 'websocket_api') {
                    await startSymblWebSocketApi();
                } else {
                    await startSymbl(roomName);
                }

            }
        })();
    }, [roomName])

    return (
        <SymblContext.Provider
            value={{
                isConnected,
                connectionId,
                startSymbl,
                stopSymbl,
                startSymblWebSocketApi,
                stopSymblWebSocketApi,
                muteSymbl,
                unMuteSymbl,
                isMute,
                startedTime,
                closedCaptionResponse,
                newMessages,
                messages,
                onError: onErrorCallback,
                onResultCallback: onResultCallback,
                // registerCallback: (callback) => {
                //     registerCallback(callback)
                // }
            }}
        >
            {children}
        </SymblContext.Provider>
    );
}
