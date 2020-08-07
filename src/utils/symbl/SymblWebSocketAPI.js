import {getAccessToken} from "./utils";
import config from '../../config';
const {symbl} = config;

const appId = process.env.SYMBL_APP_ID || symbl.appId;
const appSecret = process.env.SYMBL_APP_SECRET || symbl.appSecret;
const apiBase = process.env.SYMBL_API_BASE_PATH || 'https://api.symbl.ai';

export default class SymblWebSocketAPI {

    constructor(lang = 'en-US', handlers = {}, options = {}) {
        this.status = 'NONE';

        this.options = options;
        this.handlers = handlers;

        this.meetingId = this.options.meetingId;

        if (!this.options.hasOwnProperty('autoStart')) {
            this.options.autoStart = true;
        }
        this.options.enableAutomaticPunctuation = true;
        if (options.hasOwnProperty('enableAutomaticPunctuation')) {
            this.options.enableAutomaticPunctuation = options.enableAutomaticPunctuation;
        }
        if (!this.options.hasOwnProperty('enableAutomaticPunctuation')) {
            this.options.enableAutomaticPunctuation = true;
        }

        this.participants = this.options.participants;
        this.localParticipant = this.options.localParticipant;

        this.options.mode = options.mode || 'multi-speaker';
        this.options.lang = lang;
        this.options.bufferSize = options.bufferSize || 4096;
        this.options.participantNames = options.participantNames || [];

        this.onStopCallback = null;
        this.start = this.start.bind(this);
        const _url = new URL(apiBase);
        _url.protocol = 'wss:';
        const wssBasePath = _url.origin;
        const url = `${wssBasePath}/v1/realtime/insights/` + this.options.meetingId;
        this.speechConfig = {languageCode: lang, url};

        this.processAudio = this.processAudio.bind(this);
        this.silenceDetected = this.silenceDetected.bind(this);
        this.checkSpeechStatus = this.checkSpeechStatus.bind(this);
        this.onNoSpeech = this.onNoSpeech.bind(this);
        this.openConnectionAndStart = this.openConnectionAndStart.bind(this);
        this.onRecognitionStopped = this.onRecognitionStopped.bind(this);
        this.onMessageResponse = this.onMessageResponse.bind(this);
        this.onTopicResponse = this.onTopicResponse.bind(this);
        this.onConversationCompleted = this.onConversationCompleted.bind(this);

        this.isSpeechStarted = false;
        this.timeSinceSpeechNotDetected = 0;

        this.recognitionResult = {
            transcript: undefined,
            isFinal: false
        };

        this.retryCount = 0;

        this.connectionHandlingInProgress = false;

        this.defaultPhrases = [

        ];

        this.timeOutRef = null;

    }

    async openConnectionAndStart() {
        try {
            const json = await getAccessToken({appId, appSecret});
            const {accessToken, message} = json;
            if (message) {
                console.log('Error in fetching oauth2 token: ', message);
                return;
            }

            this.ws = new WebSocket(this.speechConfig.url + "?access_token=" + accessToken);

            this.ws.onclose = this.onEnd.bind(this);
            this.ws.onerror = this.onError.bind(this);
            this.ws.onmessage = this.onMessageReceived.bind(this);
            this.ws.onopen = async (event) => {
                console.debug('Connection established with Symbl.');
                await this.start();
            };
        } catch (err) {
            console.error(err)
        }
    }

    silenceDetected() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            // this.ws.send(JSON.stringify({
            //     type: 'message',
            //     message: {
            //         type: 'silence_detected'
            //     }
            // }));
            if (this.recognitionResult.transcript && !this.recognitionResult.isFinal) {
                this.onSpeechDetected({isFinal: true, punctuated: {transcript: this.recognitionResult.transcript}});
            }

            console.log("silence_detected..");
        }
    }

    async start() {
        if (this.status !== 'NONE' && this.status !== 'STOPPED') {
            return;
        }

        this.status = 'STARTING';
        // Get media stream

        await (async () => {
            if (!this.audioContext) {
                // console.log('Getting Media Stream.');
                this.getUserMediaStream().then(stream => {
                    // console.log('Got the media stream: ', stream);
                    this.stream = stream;
                    this.audioContext = this.createAudioProcessingTopology(stream);
                    // console.log('Sample rate: ', this.audioContext.sampleRate, this.audioContext);
                    this.sendStartRecognitionRequest();
                }).catch(err => {
                    console.error(err);
                    this.onError(err);
                });
            } else {
                this.sendStartRecognitionRequest();
            }
        })();
    }

    sendStartRecognitionRequest() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            // console.log('Sending start_recognition message.');

            if (this.participants) {
                const additional = Object.keys(this.participants).filter(name => !this.defaultPhrases.includes(name));
                if (additional && additional.length > 0) {
                    this.defaultPhrases = this.defaultPhrases.concat(additional);
                }
            }

            this.ws.send(JSON.stringify({
                type: 'start_request',
                // insightTypes: ["action_item", "question"],
                config: {
                    confidenceThreshold: 0.5,
                    timezoneOffset: this.options.timezoneOffset || -480,
                    languageCode: "en-US",
                    meetingTitle: this.options.meetingTitle,
                    speechRecognition: {
                        languageCode: this.speechConfig.languageCode,
                        sampleRateHertz: this.audioContext.sampleRate,
                        mode: this.options.mode || 'multi-speaker',
                        enableAutomaticPunctuation: true,
                        speechContexts: [
                            {
                                phrases: this.defaultPhrases
                            }
                        ]
                    }
                },
                speaker: {
                    userId: this.localParticipant && this.localParticipant.email,
                    name: this.localParticipant && this.localParticipant.name
                }
            }));
        } else {
            console.error('WebSocket connection is not established. Cannot start Symbl.');
        }
    }

    checkSpeechStatus() {
        // console.log(this.isSpeechStarted, this.timeSinceSpeechNotDetected);
        this.timeSinceSpeechNotDetected++;
        if (this.timeSinceSpeechNotDetected > 1) {
            this.onSpeechEnd();
        }
        if (this.timeSinceSpeechNotDetected > 3) {
            // If more that 5 seconds has been passed since last speech detected. Mark current speech as final.
            this.onNoSpeech();
            this.timeSinceSpeechNotDetected = 0;
        }
    }

    createAudioProcessingTopology(stream) {
        const AudioContext = window.AudioContext // Default
            || window.webkitAudioContext; // Safari and old versions of Chrome

        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);

        const processor = context.createScriptProcessor(this.options.bufferSize, 1, 1);

        this.gainNode = context.createGain();

        source.connect(this.gainNode);
        this.gainNode.connect(processor);
        processor.connect(context.destination);

        processor.onaudioprocess = this.processAudio;
        return context;
    }

    mute() {
        if (this.gainNode) {
            this.gainNode.gain.value = 0;
            console.log('Muted');
        }
        // TODO: Stop and start recognition service.
    }

    unmute() {
        if (this.gainNode) {
            this.gainNode.gain.value = 1;
            console.log('Unmuted');
        }
    }

    processAudio(e) {
        if (this.status === 'STARTED') {
            const inputData = e.inputBuffer.getChannelData(0) || new Float32Array(this.options.bufferSize);
            // console.log(e.inputBuffer.duration);
            const targetBuffer = new Int16Array(inputData.length);
            for (let index = inputData.length; index > 0; index--)
                targetBuffer[index] = 32767 * Math.min(1, inputData[index]);

            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(targetBuffer.buffer);
            } else {
                if (this.ws.readyState !== WebSocket.OPEN && !this.connectionHandlingInProgress) {
                    this.connectionHandlingInProgress = true;
                    this.stop(true);
                    const retry = () => {
                        if (this.retryCount < 3 && this.ws.readyState !== WebSocket.OPEN) {
                            console.log('Retry attempt: ', this.retryCount);
                            this.openConnectionAndStart();
                            this.retryCount++;
                            setTimeout(retry, 2000 * this.retryCount);
                        }
                    };
                    setTimeout(retry, 0);
                }
            }
        }
    }

    onMessageReceived(event) {
        const data = JSON.parse(event.data);
        if (this.timeOutRef)
            clearTimeout(this.timeOutRef);

        if (data.type === 'message') {
            const {message: {type}} = data;

            if (type === 'recognition_started') {
                // call the onStart callback
                this.onStart(data.message);
                this.status = 'STARTED';
                this.retryCount = 0;
                this.connectionHandlingInProgress = false;
            } else if (type === 'recognition_result') {
                this.onSpeechDetected(data.message);
            } else if (type === 'recognition_stopped') {
                this.onRecognitionStopped();
            } else if (type === 'conversation_completed') {
                this.onConversationCompleted(data.message)
            } if (type === 'error') {
                this.onError(data);
            }
        } else {
            if (data.type === 'message_response') {
                this.onMessageResponse(data.messages);
            } else if (data.type === 'insight_response') {
                this.onInsightResponse(data.insights);
            } else if (data.type === 'topic_response') {
                this.onTopicResponse(data.topics);
            } else if (data.type === 'context_response') {
                this.onContextResponse(data.context);
            }
        }
    }

    getUserMediaStream() {
        return navigator.mediaDevices.getUserMedia({audio: true, video: false});
    }

    stop(callback) {
        this.onStopCallback = callback;

        if (this.stream) {
            this.stream.getTracks()
                .forEach(track => track.stop());
        }
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({type: 'stop_request'}));
        }
        this.status = 'STOPPED';
        this.onEnd();
    }

    onRecognitionStopped() {
        this.onStopCallback && this.onStopCallback();
    }

    onNoMatch() {
        super.onNoMatch();
    }

    onStart(message) {
        console.debug('Symbl WebSocket API started.');
        this.handlers.onStart && setTimeout(() => {
            this.handlers.onStart({conversationId: message.data && message.data.conversationId})
        }, 0)
    }

    onEnd(event) {
        console.debug('Symbl WebSocket API Stopped.');
    }

    onSpeechDetected(data) {
        // console.log('speech detected', data);
        if (!this.isSpeechStarted) {
            this.onSpeechStart();
        }

        this.timeSinceSpeechNotDetected = 0;
        if (this.handlers.onSpeechDetected) {
            setImmediate(() => {
                this.handlers.onSpeechDetected(data);
            });
        }
    }

    onMessageResponse(messages) {
        if (this.handlers.onMessageResponse) {
            setImmediate(() => {
                this.handlers.onMessageResponse(messages);
            });
        }
    }

    onInsightResponse(messages) {
        if (this.handlers.onInsightResponse) {
            setImmediate(() => {
                this.handlers.onInsightResponse(messages);
            });
        }
    }

    onTopicResponse(topics) {
        if (this.handlers.onTopicResponse) {
            setImmediate(() => {
                this.handlers.onTopicResponse(topics);
            });
        }
    }

    onContextResponse(context) {
        if (this.handlers.onContextResponse) {
            setImmediate(() => {
                this.handlers.onContextResponse(context);
            });
        }
    }

    onConversationCompleted(message, callback) {
        if (this.handlers.onConversationCompleted) {
            setImmediate(() => {
                this.handlers.onConversationCompleted(message);
            });
        }
        this.ws.close();
    }

    onSpeechStart(event) {
        this.isSpeechStarted = true;
        if (this.handlers.onSpeechStart) {
            setTimeout(this.handlers.onSpeechStart, 0);
        }
    }

    onSpeechEnd(event) {
        // console.log('speech end');
        this.isSpeechStarted = false;
        if (this.handlers.onSpeechEnd) {
            setTimeout(this.handlers.onSpeechEnd, 0);
        }
    }

    onNoSpeech() {
        this.silenceDetected();
        if (this.handlers.onNoSpeech) {
            setTimeout(this.handlers.onNoSpeech, 0);
        }
    }

    onError(event) {
        if (event.message && event.message.type === 'error') {
            const errorPayload = event.message.payload;
            console.error(errorPayload);
        } else {
            console.error(event);
        }
    }

    onSoundStart(event) {
        super.onSoundStart(event);
    }

    onSoundEnd(event) {
        super.onSoundEnd(event);
    }

    onAudioStart(event) {
        super.onAudioStart(event);
    }

    onAudioEnd(event) {
        super.onAudioEnd(event);
    }
}
