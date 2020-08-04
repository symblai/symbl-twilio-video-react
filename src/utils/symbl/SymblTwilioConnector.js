import WebSocket from '../websocket/WebSocket';
import {postData} from "./utils";

const webSocketConnectionStatus = {
    notAvailable: 'not_available',
    notConnected: 'not_connected',
    connected: 'connected',
    error: 'error',
    closed: 'closed',
    connecting: 'connecting'
};

const appId = process.env.SYMBL_APP_ID;
const appSecret = process.env.SYMBL_APP_SECRET;

const symblTwilioConnectorBasePath = process.env.SYMBL_API_BASE_PATH;
const twilioSipUri = process.env.TWILIO_SIP_URI || 'symbl.sip.us1.twilio.com'

export default class SymblTwilioConnector {

    constructor(options = {}) {
        let callback = options.callback;

        if (!callback || typeof callback !== 'function') {
            throw new Error('callback function is required for establishing connection with Symbl Connector.');
        }

        let basePath = symblTwilioConnectorBasePath;
        if (!basePath) {
            throw new Error('Base Path is required!');
        }

        if (basePath.startsWith('https')) {
            basePath = basePath.replace('https', 'wss')
        } else if (basePath.startsWith('http')) {
            basePath = basePath.replace('https', 'wss')
        }

        const uri = `${basePath}/connector/twilio/subscribe/events`;

        const {roomName, onConnectionEstablished, onConnectionEstablishmentFailed} = options;

        if (!roomName) {
            throw new Error('roomName is required for establishing connection.');
        }

        this.roomName = roomName;
        this.callback = callback;
        this.webSocketUrl = `${uri}/${this.roomName}`;

        this.onConnectionEstablished = onConnectionEstablished;
        this.onConnectionEstablishmentFailed = onConnectionEstablishmentFailed;

        this.subscribe = this.subscribe.bind(this);
        this.onConnectWebSocket = this.onConnectWebSocket.bind(this);
        this.onErrorWebSocket = this.onErrorWebSocket.bind(this);
        this.onMessageWebSocket = this.onMessageWebSocket.bind(this);
        this.onCloseWebSocket = this.onCloseWebSocket.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
    }

    onCloseWebSocket() {
        console.debug(new Date().toISOString(), 'WebSocket Closed.');
        this.webSocketStatus = webSocketConnectionStatus.closed;
    }

    onConnectWebSocket() {
        console.debug('WebSocket Connected.');
        this.webSocketStatus = webSocketConnectionStatus.connected;
        if (this.onConnectionEstablished) {
            this.onConnectionEstablished();
        }
    }

    onErrorWebSocket(err) {
        this.webSocketStatus = webSocketConnectionStatus.error;
        console.error(err);
        if (this.onConnectionEstablishmentFailed) {
            this.onConnectionEstablishmentFailed(err);
        }
    }

    onMessageWebSocket(result) {
        //Expecting insight data
        if (result) {
            const data = JSON.parse(result);
            console.debug('Websocket Message: ', {data});
            this.callback(data);
        }
    }

    subscribe() {
        console.debug('WebSocket Connecting on: ' + this.webSocketUrl);
        this.webSocketStatus = webSocketConnectionStatus.connecting;
        this.webSocket = new WebSocket({
            url: this.webSocketUrl,
            appId: appId,
            appSecret: appSecret,
            //accessToken: this.oauth2.activeToken,
            onError: this.onErrorWebSocket,
            onClose: this.onCloseWebSocket,
            onMessage: this.onMessageWebSocket,
            onConnect: this.onConnectWebSocket
        });
        console.debug('Connected: ', this.webSocket)
    }

    unsubscribe() {
        console.log('Disconnecting WebSocket Connection');
        this.webSocket.disconnect();
    }

    async startSymblConnector(email) {
        const roomName = this.roomName;
        if (!roomName) {
            throw new Error(`'roomName' is required to connect to Symbl Connector.`);
        }
        return await postData(
            `${symblTwilioConnectorBasePath}/v1/connector/twilio/endpoint:connect`,
            {
                "operation": "start",
                "roomName": roomName,
                "endpoint": {
                    "type": "sip",
                    "providerName": "Twilio",
                    "uri": `sip:${roomName.toLowerCase()}@${twilioSipUri}`
                },
                "actions": email ? [{
                    "invokeOn": "stop",
                    "name": "sendSummaryEmail",
                    "parameters": {
                        "emails": [
                            email
                        ]
                    }
                }] : undefined
            }, {
                credentialsInHeader: true,
                appId,
                appSecret
            });
    }

    async stopSymbl(connectionId) {
        if (connectionId) {
            console.log('ConnectionID for termination: ', connectionId);
            return postData(
                `${symblTwilioConnectorBasePath}/v1/connector/twilio/endpoint:connect`,
                {
                    "operation": "stop",
                    "connectionId": connectionId
                }, {
                    credentialsInHeader: true,
                    appId,
                    appSecret
                });
        }
    };

}
