import React, {useCallback, useState} from 'react';
import {
    DialogContent,
    FormControl,
    Grid,
    TextField,
    Typography,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {inputLabels} from '../../../state/settings/settingsReducer';
import {useAppState} from '../../../state';
import useRoomState from '../../../hooks/useRoomState/useRoomState';
import Button from "@material-ui/core/Button";
import {getAccessToken} from "../../../utils/symbl/utils";
import Link from "@material-ui/core/Link";
import config from '../../../config';
const {enableInAppCredentials} = config.symbl;

const useStyles = makeStyles({
    formControl: {
        display: 'block',
        // margin: '0.8em 0',
        '&:first-child': {
            margin: '0 0 0.8em 0',
        }
    },
    label: {
        width: '133%', // Labels have scale(0.75) applied to them, so this effectively makes the width 100%
    },
});

const withDefault = (val) => (val && typeof val === 'undefined' ? 'default' : val);

const hexRegex = new RegExp('[0-9a-f]+');

export default function CredentialsOptions({className, hidden}) {
    const classes = useStyles();
    const {settings, dispatchSetting} = useAppState();
    const roomState = useRoomState();
    const isDisabled = roomState && roomState.roomState !== 'disconnected' || !enableInAppCredentials;

    const [credentialsValid, setCredentialsValid] = useState(null);

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
        handleChange(e);
    }, [handleChange]);

    const validateAppId = (appId) => {
        return appId && (appId.length === 64 || appId.length === 32) && hexRegex.test(appId);
    }

    const validateAppSecret = (appSecret) => {
        return appSecret && (appSecret.length === 128 || appSecret.length === 64) && hexRegex.test(appSecret);
    }

    return (
        <DialogContent className={className} hidden={hidden}>

            <Grid item xs={12}>
                <Typography variant="body2">
                    Please add appId and appSecret. You can find your credentials on
                    <Link
                    color={"secondary"}
                    target="_blank"
                    rel="noopener"
                    href="https://platform.symbl.ai"> Symbl Console</Link>.
                </Typography>
                <Typography variant="body1" style={{marginTop: 10}}>Symbl Credentials:</Typography>
                <Typography hidden={!isDisabled} variant="body2">
                    These settings cannot be changed when connected to a room.
                </Typography>
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
                        error={!validateAppId(settings.symblAppId)}
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
                        error={!validateAppSecret(settings.symblAppSecret)}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Button
                    disabled={!validateAppId(settings.symblAppId) || !validateAppSecret(settings.symblAppSecret)}
                    variant={"contained"}
                    onClick={async () => {
                        try {
                            const result = await getAccessToken({
                                appId: settings.symblAppId,
                                appSecret: settings.symblAppSecret
                            });
                            const {accessToken, message} = result;
                            if (accessToken) {
                                localStorage.setItem('symblAppId', settings.symblAppId);
                                localStorage.setItem('symblAppSecret', settings.symblAppSecret);
                                setCredentialsValid(true);
                            } else {
                                setCredentialsValid(false);
                            }
                        } catch (e) {
                            setCredentialsValid(false);
                        }
                    }}
                >
                    Validate
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography
                    hidden={(credentialsValid === null ||
                        credentialsValid === true ||
                        !validateAppId(settings.symblAppId) ||
                        !validateAppSecret(settings.symblAppSecret))}
                    color={"error"}
                    style={{
                        marginTop: 10
                    }}
                >
                    Provided AppId and AppSecret are not valid.
                </Typography>
                <Typography
                    hidden={!credentialsValid}
                    style={{
                        marginTop: 10,
                        color: "green"
                    }}
                >
                    AppId and AppSecret are valid.
                </Typography>
            </Grid>
        </DialogContent>
    );
}
