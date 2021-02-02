# Symbl & Twilio Video React App


[![Websocket](https://img.shields.io/badge/symbl-websocket-brightgreen)](https://docs.symbl.ai/docs/streamingapi/overview/introduction)

Symbl's APIs empower developers to enable: 
- **Real-time** analysis of free-flowing discussions to automatically surface highly relevant summary discussion topics, contextual insights, suggestive action items, follow-ups, decisions, and questions.
- **Voice APIs** that makes it easy to add AI-powered conversational intelligence to either [telephony][telephony] or [WebSocket][websocket] interfaces.
- **Conversation APIs** that provide a REST interface for managing and processing your conversation data.
- **Summary UI** with a fully customizable and editable reference experience that indexes a searchable transcript and shows generated actionable insights, topics, timecodes, and speaker information.

<hr />

## Enable Symbl for Twilio Video Conference

<hr />

 * [Introduction](#introduction)
 * [Pre-requisites](#pre-requisites)
 * [Features](#features)
 * [Browser Support](#browsersupport)
 * [Setup and Deploy](#setupanddeploy)
 * [Dependencies](#dependencies)
 * [Conclusion](#conclusion)
 * [Community](#community)

## Introduction

This is a multi-party video conferencing application that demonstrates [Symbl's Real-time APIs](https://docs.symbl.ai/docs/streamingapi/overview/introduction). This application is inspired by [Twilio's video app](https://github.com/twilio/twilio-video-app-react) and is built using [twilio-video.js](https://github.com/twilio/twilio-video-app-react) and [Create React App](https://github.com/facebook/create-react-app).

## Pre-requisites

* JS ES6+
* [Node.js v10+](https://nodejs.org/en/download/)*
* NPM v6+
* Twilio account - https://www.twilio.com/try-twilio

## Features
* Live Closed Captioning
* Real-time Transcription
* Video conferencing with real-time video and audio
* Enable/Disable camera
* Mute/unmute mic
* Screen sharing
* Dominant Speaker indicator
* Network Quality Indicator

## Browser Support
This application is supported only on Google Chrome.

## Setup and Deploy
The first step to getting setup is to [sign up][signup]. 

Gather your Symbl credentials:
1. Your App Id that you can get from [Platform](https://platform.symbl.ai)
2. Your App Secret that you can get from [Platform](https://platform.symbl.ai)

This application offers two options for authorizing your Symbl account, in the application, or via the included token server.  Your Twilio account will be authorized via the token server.  

The default behavior is for your Symbl account to authorize in-app.  A dialog box will be shown automatically if you're opening the app for the first time. In the [config.js](https://github.com/symblai/symbl-twilio-video-react/blob/a42d0394ae7ff7c67cdf35df0bd3b013a3cdcfb5/src/config.js#L5) file you will find `enableInAppCredentials` set to `true`.  For this option you are not required to update the [.env](https://github.com/symblai/symbl-twilio-video-react/blob/master/.env) file with Symbl credentials. 

![Symbl Credentials Dialog](./docs/symbl-credentials.png?v=4&s=100)

If you are planning to use the included token server for generating your Symbl token you may disable the in app App ID/App Secret configuration. You can disable by setting `enableInAppCredentials` to `false` in the [config.js](https://github.com/symblai/symbl-twilio-video-react/blob/a42d0394ae7ff7c67cdf35df0bd3b013a3cdcfb5/src/config.js#L5)

Store your Symbl credentials in the [.env](https://github.com/symblai/symbl-twilio-video-react/blob/master/.env) file.

```.env
SYMBL_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SYMBL_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Store your Twilio credentials in the [.env](https://github.com/symblai/symbl-twilio-video-react/blob/master/.env) file:
1. In your Twilio console click on 'Settings' and take note of your Account SID.
2. Navigate to Settings/API Keys to generate a new Key SID and Secret

```.env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The local token server is managed by [server.js](https://github.com/symblai/symbl-video-react/blob/master/server.js)

Run the app locally with

    $ npm start

This will start the local token server and run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to see the application in the browser.

The page will reload if you make changes to the source code in `src/`.
You will also see any linting errors in the console. Start the token server locally with

    $ npm run server

The token server runs on port 8081 exposes two `GET` endpoints. One to generate access token for Symbl and one for generating access token for Twilio. 

Symbl token endpoint expects `GET` request at `/symbl-token` route with no parameters.

The response will be a JSON response with `accessToken` and `expiresIn` values with Symbl access token and expiry of token.

Try it out with this sample `curl` command:

```bash
curl 'localhost:8081/symbl-token'
```

Twilio token endpoint expects `GET` request at `/twilio-token` route with the following query parameters: 

```
identity: string,  // the user's identity
roomName: string   // the room name
```

The response will be a token that can be used to connect to a room.

Try it out with this sample `curl` command:

```bash
curl 'localhost:8081/twilio-token?identity=TestName&roomName=TestRoom'
```

### Multiple Participants in a Room

If you want to see how the application behaves with multiple participants, you can simply open `localhost:3000` in multiple tabs in your browser and connect to the same room using different user names.

Additionally, if you would like to invite other participants to a room, each participant would need to have their own installation of this application and use the same room name and Account SID (the API Key and Secret can be different).

## Dependencies

```json
  "dependencies": {
    "@material-ui/core": "^4.11.0",
    "@material-ui/icons": "^4.9.1",
    "@material-ui/styles": "^4.10.0",
    "@primer/octicons-react": "^10.0.0",
    "@testing-library/jest-dom": "^4.2.4",
    "@testing-library/react": "^9.5.0",
    "@testing-library/user-event": "^7.2.1",
    "clsx": "^1.1.1",
    "concurrently": "^5.1.0",
    "d3-timer": "^1.0.10",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "fscreen": "^1.0.2",
    "is-plain-object": "^4.1.1",
    "lodash-es": "^4.17.15",
    "lodash.throttle": "^4.1.1",
    "moment": "^2.27.0",
    "node-fetch": "^2.6.0",
    "react": "^16.13.1",
    "react-copy-to-clipboard": "^5.0.2",
    "react-dom": "^16.13.1",
    "react-router-dom": "^5.2.0",
    "react-scripts": "3.4.1",
    "twilio": "^3.48.1",
    "twilio-video": "^2.7.1"
  }
```

## Conclusion
When implemented this application will allow you to join a demo Twilio video conference, and Symbl transcripts will be displayed on screen in real time. 

## Community

If you have any questions, feel free to reach out to us at devrelations@symbl.ai or through our [Community Slack][slack] or our [forum][developer_community].

This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][pulls] with your questions, comments, suggestions and feedback.  If you liked our integration guide, please star our repo!

This library is released under the [Apache License][license]

[license]: LICENSE.txt
[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[websocket]: https://docs.symbl.ai/docs/streamingapi/overview/introduction
[developer_community]: https://community.symbl.ai/?_ga=2.134156042.526040298.1609788827-1505817196.1609788827
[slack]: https://join.slack.com/t/symbldotai/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA
[signup]: https://platform.symbl.ai/?_ga=2.63499307.526040298.1609788827-1505817196.1609788827
[issues]: https://github.com/symblai/symbl-for-zoom/issues
[pulls]: https://github.com/symblai/symbl-for-zoom/pulls