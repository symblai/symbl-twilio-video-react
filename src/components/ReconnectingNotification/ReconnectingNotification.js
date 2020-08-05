import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContent } from '@material-ui/core';

import useRoomState from '../../hooks/useRoomState/useRoomState';
import useSymblContext from "../../hooks/useSymblContext/useSymblContext";

const useStyles = makeStyles({
  snackbar: {
    backgroundColor: '#6db1ff',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '0.8em',
  },
});

export default function ReconnectingNotification() {
  const classes = useStyles();
  const roomState = useRoomState();

  let content = undefined;

  if (roomState === 'reconnecting') {
    content = "Reconnecting"
  }

  return (
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={roomState === 'reconnecting'}>
      <SnackbarContent
        className={classes.snackbar}
        message={
          <span className={classes.message}>
            <InfoIcon className={classes.icon} />
            {content}&hellip;
          </span>
        }
      />
    </Snackbar>
  );
}
