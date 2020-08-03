import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

import { postData } from "../../../utils";
import useRoom from "../../VideoProvider/useRoom/useRoom";
import useSymbl from "../../SymblProvider/useSymbl/useSymbl";
import useSymblContext from "../../../hooks/useSymblContext/useSymblContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

const disconnect = async (room, stopSymblWebSocketApi) => {
    await stopSymblWebSocketApi();
    room.disconnect();
};

export default function EndCallButton() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const {stopSymblWebSocketApi} = useSymblContext()

  return (
    <Tooltip title={'End Call'} onClick={() => disconnect(room, stopSymblWebSocketApi)} placement="top" PopperProps={{ disablePortal: true }}>
      <Fab className={classes.fab} style={{backgroundColor: 'darkred', color: 'white'}}>
        <CallEnd />
      </Fab>
    </Tooltip>
  );
}
