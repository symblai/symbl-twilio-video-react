# Symbl Video React App

This is a multi-party video conferencing application that demonstrates Symbl's Real-time APIs. This application is inspired by [Twilio's video app](https://github.com/twilio/twilio-video-app-react) and is built using [twilio-video.js](https://github.com/twilio/twilio-video-app-react) and [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites
You must have the following installed:

* [Node.js v10+](https://nodejs.org/en/download/)
* NPM v6+ (comes installed with newer Node versions)

## Install Dependencies

Run `npm install` to install all dependencies from NPM.

If you want to use `yarn` to install dependencies, first run the [yarn import](https://classic.yarnpkg.com/en/docs/cli/import/) command. This will ensure that yarn installs the package versions that are specified in `package-lock.json`.

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

## Set Up

### Running a local token server
This application requires Symbl access token to connect to talk to Symbl and Twilio access token to connect to a Twilio Room.

The included local token server provides the application with access tokens for both Symbl and Twilio. Perform the following steps to set up the local token server:

##### Symbl Credentials
* Create an account in the [Symbl Console](https://platform.symbl.ai) if you don't have one already.
* After you login, you will find your appId and appSecret on the home page.
* Store your appId and appSecret in the `.env` file in the root level of the application (example below).

```.env
SYMBL_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SYMBL_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

##### Twilio Credentials
* Create an account in the [Twilio Console](https://www.twilio.com/login).
* Click on 'Settings' and take note of your Account SID.
* Create a new API Key in the API Keys Section under Programmable Video Tools in the Twilio Console. 
* Take note of the SID and Secret of the new API key.
Store your Account SID, API Key SID, and API Key Secret in the `.env` in the root level of the application (example below).

```.env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Now the local token server (see [server.js](https://github.com/symblai/symbl-video-react/blob/master/server.js)) can dispense Access Tokens for Symbl as well as Twilio to connect to a Room.

### Running the App locally

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
curl 'localhost:8081/token?identity=TestName&roomName=TestRoom'
```

### Multiple Participants in a Room

If you want to see how the application behaves with multiple participants, you can simply open `localhost:3000` in multiple tabs in your browser and connect to the same room using different user names.

Additionally, if you would like to invite other participants to a room, each participant would need to have their own installation of this application and use the same room name and Account SID (the API Key and Secret can be different).

## License
See the [LICENSE](https://github.com/symblai/symbl-video-react/blob/master/LICENSE) file for details.