import "symbl-node/build/client.sdk.min";
const clientSDK = new window.ClientSDK();

export const startEndpoint = async (roomName, options = {}, callback) => {
    try {
        await clientSDK.init({
            appId: process.env.SYMBL_APP_ID || '343975686f32655930584c377a594c5159745a467a5a3863357530316f494438',
            appSecret: process.env.SYMBL_APP_SECRET || '4836554e4e377849744e6b314958726d3174715772674435695874545f78674e522d34536c454349716f3256745334486d6869516e4477553378587a597a5044',
            basePath: process.env.SYMBL_API_BASE_PATH || 'https://api.symbl.ai'
        });

        const connection = await clientSDK.startEndpoint({
            endpoint: {
                type: 'sip',
                uri: `sip:${roomName}@${process.env.TWILIO_SIP_URI || 'symbl.sip.twilio.com'}`
            },
            actions: [{
                "invokeOn": "stop",
                "name": "sendSummaryEmail",
                "parameters": {
                    "emails": [ // Add any email addresses to which the email should be sent
                        "toshish@symbl.ai"
                    ]
                }
            }],
            data: {
                session: {
                    name: `Live Intent Detection Demo - ${phoneNumber}` // Title of the Meeting, this will be reflected in summary email if configured.
                }
            }
        }, callback);

        const connectionId = connection.connectionId;
        console.log('Call established for connectionId: ' + connectionId);
        return connectionId;
    } catch (e) {
        console.error('Error in establishing startEndpoint call with SDK', e);
        throw e;
    }
};

export const stopEndpoint = async (connectionId) => {
    console.log('Stopping connection for ' + connectionId);

    try {
        const connection = await clientSDK.stopEndpoint({
            connectionId
        });

        console.log('Summary Info:', connection.summaryInfo);
        console.log('Conversation ID:', connection.conversationId);

        return {
            summaryInfo: connection.summaryInfo,
            conversationId: connection.conversationId
        };
    } catch (e) {
        console.error('Error while stopping the connection.', e);
        throw e;
    }
};
