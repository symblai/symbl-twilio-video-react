const express = require('express');
const app = express();
const fetch = require('node-fetch');
const path = require('path');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

const symblAppId = process.env.SYMBL_APP_ID;
const symblAppSecret = process.env.SYMBL_APP_SECRET;
const symblApiBasePath = process.env.SYMBL_API_BASE_PATH || 'https://api.symbl.ai';

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

app.use(express.static(path.join(__dirname, 'build')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-API-KEY");
  next();
});


app.get('/symbl-token', async (req, res) => {
  try {
    const response = await fetch(`${symblApiBasePath}/oauth2/token:generate`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        type: 'application',
        appId: symblAppId,
        appSecret: symblAppSecret
      })
    });
    res.json(await response.json()).end();
  } catch (e) {
    console.error('Error while issuing Symbl Token.', e);
    res.status(401)
        .json({
          message: e.toString()
        }).end()
  }
});

app.get('/twilio-token', (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(8081, () => console.log('token server running on 8081'));
