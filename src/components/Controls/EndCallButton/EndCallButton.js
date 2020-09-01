import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import config from '../../../config';

import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

import useSymblContext from "../../../hooks/useSymblContext/useSymblContext";

const useStyles = makeStyles((theme) =>
    createStyles({
        fab: {
            margin: theme.spacing(1),
        },
    })
);

const disconnect = async (room, stopSymblWebSocketApi, isConnected) => {
    if (isConnected) {
        await stopSymblWebSocketApi(() => {
            room.disconnect();
            if (!window.location.origin.includes('twil.io')) {
                window.location = config.appBasePath || "/";
            }
        });
    } else {
        room.disconnect();
        if (!window.location.origin.includes('twil.io')) {
            window.location = config.appBasePath || "/";
        }
    }
};

export default function EndCallButton() {
    const classes = useStyles();
    const {room} = useVideoContext();
    const {stopSymblWebSocketApi, isConnected} = useSymblContext()

    return (
        <Tooltip title={'End Call'} onClick={() => disconnect(room, stopSymblWebSocketApi, isConnected)} placement="top"
                 PopperProps={{disablePortal: true}}>
            <Fab className={classes.fab} style={{backgroundColor: 'darkred', color: 'white'}}>
                <CallEnd/>
            </Fab>
        </Tooltip>
    );
}
