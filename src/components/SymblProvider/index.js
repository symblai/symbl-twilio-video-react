import React, {createContext, useEffect, useState} from 'react';
import useSymbl from "./useSymbl/useSymbl";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";

const symblConnectionMode = 'websocket_api';

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

    const onResultCallback = (data) => {
        if (data) {
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

    const onSpeechDetected = (data) => {
        setClosedCaptionResponse(data)
    };

    const onMessageResponse = (newMessages) => {
        // console.log('newMessages: ', newMessages);
        setNewMessages(newMessages);
        setMessages([messages, ...newMessages]);
    };

    const onConversationCompleted = (messages) => {
        console.log('Conversation completed.', messages);
    }

    const handlers = {
        onSpeechDetected,
        onMessageResponse,
        onConversationCompleted,
        onInsightResponse: (data) => {
            console.log(JSON.stringify(data))
        },
    };

    const {
        isConnected, connectionId, startedTime, startSymbl, stopSymbl, startSymblWebSocketApi, stopSymblWebSocketApi,
        muteSymbl, unMuteSymbl, isMute
    } =
        useSymbl(onErrorCallback, onResultCallback, {...options});

    useEffect(() => {
        (async () => {
            if (roomName) {
                if (symblConnectionMode === 'websocket_api') {
                    await startSymblWebSocketApi(handlers, {
                        meetingTitle: roomName,
                        meetingId: btoa(roomName),
                        handlers,
                        localParticipant: {
                            name: localParticipant.identity
                        }
                    });
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
            }}
        >
            {children}
        </SymblContext.Provider>
    );
}
