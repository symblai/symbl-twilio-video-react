import React, {useCallback, useState} from 'react';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab, Tabs,
    TextField,
    Typography,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {inputLabels, Settings} from '../../../state/settings/settingsReducer';
import {RenderDimensions} from '../../../state/settings/renderDimensions';
import {useAppState} from '../../../state';
import useRoomState from '../../../hooks/useRoomState/useRoomState';
import {DeviceSelector} from "../DeviceSelector/DeviceSelector";
import ConnectionOptions from "../ConnectionOptions/ConnectionOptions";
import CredentialsOptions from "../CredentialsOptions/CredentialsOptions";

const useStyles = makeStyles({
    formControl: {
        display: 'block',
    },
    label: {
        width: '133%', // Labels have scale(0.75) applied to them, so this effectively makes the width 100%
    },
});

const withDefault = (val) => (val && typeof val === 'undefined' ? 'default' : val);

const RenderDimensionItems = RenderDimensions.map(({label, value}) => (
    <MenuItem value={value} key={value}>
        {label}
    </MenuItem>
));

export default function SymblCredentialsDialog({className, hidden}) {
    const classes = useStyles();
    const {settings, dispatchSetting} = useAppState();
    const roomState = useRoomState();
    const isDisabled = roomState && roomState.roomState !== 'disconnected';

    const handleChange = useCallback(
        (e) => {
            dispatchSetting({name: e.target.name, value: e.target.value});
        },
        [dispatchSetting]
    );

    const handleNumberChange = useCallback(
        (e) => {
            if (!/[^\d]/.test(e.target.value)) handleChange(e);
        },
        [handleChange]
    );

    const handleAppIdChange = useCallback((e) => {
    }, [handleChange]);


    return (
        <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
            <DialogContent className={className} hidden={hidden}>

                <Grid item xs={12}>
                    <Typography variant="body2">
                        Symbl Credentials not found. Please add appId and appSecret below to continue. You can find your Symbl credentials at https://platform.symbl.ai.
                    </Typography>
                    <Typography variant="body1">Symbl Credentials:</Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                        <TextField
                            disabled={isDisabled}
                            fullWidth
                            id={inputLabels.symblAppId}
                            label="App ID"
                            placeholder="897174314759235a356e4d4c4254314f7665684237585a76327a45ba37535649"
                            name={inputLabels.symblAppId}
                            value={withDefault(settings.symblAppId)}
                            onChange={handleAppIdChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                        <TextField
                            disabled={isDisabled}
                            fullWidth
                            id={inputLabels.symblAppSecret}
                            label="App Secret"
                            placeholder="91544a6c374b7349736d56416b7836746135416b3162434f4e4271745033f8702d6542625773cf33356168583150776643724a30475a7a7a79453278434e5971"
                            name={inputLabels.symblAppSecret}
                            value={withDefault(settings.symblAppSecret)}
                            onChange={handleAppIdChange}
                        />
                    </FormControl>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className={classes.button} onClick={onClose}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}
