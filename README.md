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
 * [Prerequisites](#prerequisites)
 * [Features](#features)
 * [Browser Support](#browsersupport)
 * [Setup and Deploy](#setupanddeploy)
 * [Dependencies](#dependencies)
 * [Conclusion](#conclusion)
 * [Community](#community)

## Introduction

This is a multi-party video-conferencing application that demonstrates the [Symbl's Real-Time APIs](https://symbl.ai/products/) adding intelligence to any type of conversation with no upfront efforts. 

There are different ways to connect with Symbl's Real-Time APIs and you are going to use the [Symbl Streaming APIs](https://docs.symbl.ai/docs/streamingapi/overview/introduction) over WebSocket for real-time capturing of the participants' audio for **Live Closed Captioning** and **Real-Time Transcription**.

This application is based on the sample [Twilio's Video React app](https://github.com/twilio/twilio-video-app-react) and is built using the [Twilio's Programmable Video JS SDK](https://github.com/twilio/twilio-video.js).

## Prerequisites

* A Symbl account - You can use your own or sign up for a Symbl account [here][signup]. 
* A Twilio account - You can use your own or sign up for a Twilio account [here](https://www.twilio.com/try-twilio).
* Download and install [Node.js v10+](https://nodejs.org/en/download/).


## Features
This sample application allows you to understand the power of Symbl's Real-Time APIs by providing the following capabilities:
* Live Closed Captioning
* Real-time Transcription

Other capabilities of this sample application:
* Video conferencing with real-time video and audio
* Enable/Disable camera
* Mute/unmute mic
* Screen sharing
* Dominant Speaker indicator
* Network Quality Indicator

## Browser Support
This web application can be used on browsers supported by the [Twilio's Programmable Video JS SDK](https://github.com/twilio/twilio-video.js/tree/master/#browser-support).

## Setup and Deploy

### Setting up Symbl Credentials

[Log in](https://platform.symbl.ai) to your Symbl account and retrieve both the `App ID` and `App Secret` API Credentials.

This application offers two options for authorizing your Symbl account:

#### In-App Authorization
The default behavior of this application is to use the In-App Authorization method. A dialog box is shown automatically when you're opening the app for the first time. Add your Symbl `App ID` and `App Secret` in the respective fields.

The In-App Authorization is driven by the `enableInAppCredentials` property in the [config.js](https://github.com/symblai/symbl-twilio-video-react/blob/a42d0394ae7ff7c67cdf35df0bd3b013a3cdcfb5/src/config.js#L5) file. This property value is set to `true` by default. Set it to `false` to disable the In-App Authorization.

![Symbl Credentials Dialog](./docs/symbl-credentials.png?v=4&s=100)

#### Token Server Authorization
The Token Server Authorization option allows you to provide Symbl API Credentials upfront and disable the dialog box presented when you run the application for the first time.

To use the included Token Server, you have to disable the In-App Authorization by setting the `enableInAppCredentials` property to `false` in the [config.js](https://github.com/symblai/symbl-twilio-video-react/blob/a42d0394ae7ff7c67cdf35df0bd3b013a3cdcfb5/src/config.js#L5).

Additionally, you need to add your Symbl API Credentials (`App ID` and `App Secret`) by storing their values in the [.env](https://github.com/symblai/symbl-twilio-video-react/blob/master/.env) file.

```.env
SYMBL_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SYMBL_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Setting Up Twilio Credentials
Your Twilio account is authorized via the included Token Server. You need to store your Twilio credentials in the [.env](https://github.com/symblai/symbl-twilio-video-react/blob/master/.env) file.

[Log in](https://www.twilio.com/console) to your Twilio account.

Click on 'Settings' and take note of your `Account SID`.

Click on 'API Keys' (Settings/API Keys) and generate a new API Key. Take note of the `SID` and the `Secret`. Keep in mind that the `Secret` is only shown once so make note of it before you proceed.

Add the Twilio credentials by storing their values in the [.env](https://github.com/symblai/symbl-twilio-video-react/blob/master/.env) file.

```.env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

For reference, the local Token Server is managed by [server.js](https://github.com/symblai/symbl-video-react/blob/master/server.js)

### Running the sample application
To run this application on your own machine, run the following command:

```bash
$ npm start
```

This command will start the local Token Server and run the app in the development mode. 

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application.


If you make any changes to the source code under `src/` while running the application, it will automatically reload and display errors in the console (if any).

Congratulations! You should have your video conferencing application with Live Closed Captioning and Real-time Transcription up and running.

#### Optional: Running the Token Server
The Token Server runs, by default, on port 8081 and exposes two `GET` endpoints. 

One of the endpoints is used to generate an access token for Symbl and the other endpoint is used to generate an access token for Twilio. 

To run the Token Server on your own machine, run the following command:

```bash
$ npm run server
```

The Symbl token endpoint expects a `GET` request at `/symbl-token` with no parameters.

The HTTP response contains a JSON payload with the `accessToken` and `expiresIn` values. These values are the Symbl access token and the expiration time of the token.

You can try this endpoint out with the following `curl` command:

```bash
curl 'http://localhost:8081/symbl-token'
```

The Twilio token endpoint expects `GET` request at `/twilio-token` with the following query parameters: 

```
identity: string,  // the user's identity
roomName: string   // the room name
```

The HTTP response contains a token that can be used to connect to a video conference room.

You can try this endpoint out with the following `curl` command:

```bash
curl 'localhost:8081/twilio-token?identity=TestName&roomName=TestRoom'
```

### Multiple Participants in the same room

If you want to see how the application behaves with multiple participants, you can simply open `http://localhost:3000` in multiple tabs in your web browser and connect to the same room using different user names.

Additionally, if you would like to invite other participants to a room, each participant would need to have their own installation of this application and use the same room name and Account SID (the API Key and Secret can be different).

## Conclusion
This sample application allowed you to join a Twilio-based video conference room and exploring the power of Symbl's Real-Time APIs with Live Closed Captioning and Real-time Transcription capabilities.


## Community

If you have any questions, feel free to reach out to us at devrelations@symbl.ai or through our [Community Slack][slack] or our [forum][developer_community].

This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][pulls] with your questions, comments, suggestions and feedback.  If you liked our integration guide, please star our repo!

This sample application is released under the [Apache License][license]

[license]: LICENSE.txt
[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[websocket]: https://docs.symbl.ai/docs/streamingapi/overview/introduction
[developer_community]: https://community.symbl.ai/?_ga=2.134156042.526040298.1609788827-1505817196.1609788827
[slack]: https://join.slack.com/t/symbldotai/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA
[signup]: https://platform.symbl.ai/?_ga=2.63499307.526040298.1609788827-1505817196.1609788827
[issues]: https://github.com/symblai/symbl-twilio-video-react/issues
[pulls]: https://github.com/symblai/symbl-twilio-video-react/pulls