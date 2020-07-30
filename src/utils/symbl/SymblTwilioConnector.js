import WebSocket from '../websocket/WebSocket';
import {apiBase} from '../config';

const webSocketConnectionStatus = {
    notAvailable: 'not_available',
    notConnected: 'not_connected',
    connected: 'connected',
    error: 'error',
    closed: 'closed',
    connecting: 'connecting'
};

export default class SymblTwilioConnector {

    constructor(options = {}) {
        let callback = options.callback;

        if (!callback || typeof callback !== 'function') {
            throw new Error('callback function is required for establishing connection with Session-Manger Websocket.');
        }

        let basePath = options.basePath || apiBase;
        if (basePath.startsWith('https')) {
            basePath = basePath.replace('https', 'wss')
        } else if (basePath.startsWith('http')) {
            basePath = basePath.replace('https', 'wss')
        }
        const uri = `${basePath}/connector/twilio/subscribe/events`;

        const {id, onConnectionEstablished, onConnectionEstablishmentFailed} = options;

        if (!id) {
            throw new Error('id is required for establishing connection.');
        }

        this.id = id;
        this.callback = callback;
        this.webSocketUrl = `${uri}/${this.id}`;

        this.onConnectionEstablished = onConnectionEstablished;
        this.onConnectionEstablishmentFailed = onConnectionEstablishmentFailed;

        this.connect = this.connect.bind(this);
        this.onConnectWebSocket = this.onConnectWebSocket.bind(this);
        this.onErrorWebSocket = this.onErrorWebSocket.bind(this);
        this.onMessageWebSocket = this.onMessageWebSocket.bind(this);
        this.onCloseWebSocket = this.onCloseWebSocket.bind(this);
        this.disconnect = this.disconnect.bind(this);
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

    connect() {
        console.debug('WebSocket Connecting on: ' + this.webSocketUrl);
        this.webSocketStatus = webSocketConnectionStatus.connecting;
        this.webSocket = new WebSocket({
            url: this.webSocketUrl,
            //accessToken: this.oauth2.activeToken,
            onError: this.onErrorWebSocket,
            onClose: this.onCloseWebSocket,
            onMessage: this.onMessageWebSocket,
            onConnect: this.onConnectWebSocket
        });
    }

    disconnect() {
        console.debug('Disconnecting WebSocket Connection');
        this.webSocket.disconnect();
    }
}
