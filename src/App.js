import React, {useEffect, useState} from 'react';
import {styled} from '@material-ui/core/styles';
import useHeight from './hooks/useHeight/useHeight';
import { useParams } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import LocalVideoPreview from "./components/LocalVideoPreview/LocalVideoPreview";
import Room from "./components/Room/Room";
import useRoomState from "./hooks/useRoomState/useRoomState";
import {useAppState} from "./state";
import useVideoContext from "./hooks/useVideoContext/useVideoContext";
import MenuBar from "./components/MenuBar/MenuBar";
import ClosedCaptions from "./components/ClosedCaptions/ClosedCaptions";
const Container = styled('div')({
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')({
    overflow: 'hidden',
});

// const user = {
//     displayName: 'Toshish'
// }

function App() {
    const roomState = useRoomState();
    const height = useHeight();
    const { URLRoomName, UserName } = useParams();
    const { getToken } = useAppState();
    const { connect } = useVideoContext();

    useEffect(() => {
        if (URLRoomName && UserName) {
            getToken(UserName, URLRoomName).then(token => connect(token));
        }
    }, []);



    return (
        <Container style={{height}}>
            { roomState === 'disconnected' ? <MenuBar /> : undefined }
            <Main>
                {/*<LocalVideoPreview/>*/}
                {/*<Room/>*/}
                {roomState === 'disconnected' ? <LocalVideoPreview /> : <Room />}
                {/*<Controls/>*/}
                <ClosedCaptions/>
            </Main>
        </Container>
    );
}

export default App;
