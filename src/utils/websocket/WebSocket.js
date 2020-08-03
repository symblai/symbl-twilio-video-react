export default class WebSocket {

    constructor(options = {}) {
        if (!options.url) {
            throw new Error('url is required in the options.');
        }

        this.url = options.url;
        this.accessToken = options.accessToken || '';
        this.appId = options.appId;
        this.appSecret = options.appSecret;


        this.options = options;

        this.connect = this.connect.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onError = this.onError.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onClose = this.onClose.bind(this);

        this.send = this.send.bind(this);
        this.disconnect = this.disconnect.bind(this);

        this.connect();
    }

    onError(err) {
        this.options['onError'] ? this.options['onError'](err) : console.error(err);
    }

    onMessage(payload) {
        // Incoming results for this connection
        const data = payload.data;
        this.options['onMessage'] ? this.options['onMessage'](data) : console.debug(data);
    }

    onClose() {
        this.options['onClose'] ? this.options['onClose']() : console.info('Connection Closed.');
    }

    onConnect(connection) {
        this.webSocketConnection = connection;
        this.webSocket.onerror = this.onError;
        this.webSocket.onmessage = this.onMessage;
        this.webSocket.onclose = this.onClose;
        this.options['onConnect'] ? this.options['onConnect'](connection) : console.info('Connection established.');
    }

    connect() {
        if (!!window && window.WebSocket) {
            const url = `${this.url}?appId=${this.appId}&appSecret=${this.appSecret}`;
            console.log('Making call on: ', url, window.WebSocket)
            this.webSocket = new window.WebSocket(url, null, null, {
                'X-APP-ID': this.appId,
                'X-APP-SECRET': this.appSecret
            });
            console.log('WebSocket: ', this.webSocket);
        }
        this.webSocket.binaryType = 'arraybuffer';
        // TODO: Support for token in url
        this.webSocket.onopen = this.onConnect;
        this.webSocket.onerror = this.onError;
    }

    send(data, cb) {
        if (!data) {
            cb && cb({
                message: 'undefined data detected.'
            });
        } else {
            try {
                if (this.webSocket.readyState === 1) {
                    this.webSocket.send(data);
                } else {
                    console.warn('WebSocket Connection not open. Couldn\'t send data.');
                }
            } catch (e) {
                console.error('Error while sending the data.', e);
            }
        }
    }

    disconnect() {
        this.webSocket.close();
    }

}
