import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Redirect, Switch} from 'react-router-dom';
import './index.css';
import App from './App';
import AppStateProvider, {useAppState} from './state';
import * as serviceWorker from './serviceWorker';
import {VideoProvider} from "./components/VideoProvider";
import UnsupportedBrowserWarning from "./components/UnsupportedBrowserWarning/UnsupportedBrowserWarning";
import generateConnectionOptions from "./utils/generateConnectionOptions/generateConnectionOptions";
import CssBaseline from "@material-ui/core/CssBaseline";
import {MuiThemeProvider} from '@material-ui/core/styles';
import theme from "./theme";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

const VideoApp = () => {
    const {setError, settings} = useAppState();
    const connectionOptions = generateConnectionOptions(settings);

    return (
        <UnsupportedBrowserWarning>
            <VideoProvider options={connectionOptions} onError={setError}>
                {/*<ErrorDialog dismissError={() => setError(null)} error={error} />*/}
                <App/>
            </VideoProvider>
        </UnsupportedBrowserWarning>
    );
};

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <CssBaseline/>
        <Router>
            <AppStateProvider>
                <Switch>
                    <PrivateRoute exact path="/">
                        <VideoApp/>
                    </PrivateRoute>
                    <PrivateRoute exact path="/room/:URLRoomName">
                        <VideoApp/>
                    </PrivateRoute>
                    <PrivateRoute exact path="/room/:URLRoomName/:UserName">
                        <VideoApp/>
                    </PrivateRoute>
                    <Redirect to="/"/>
                </Switch>
            </AppStateProvider>
        </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
