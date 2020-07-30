import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import words from 'lodash-es/words';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Paper from "@material-ui/core/Paper";
import {range} from "lodash-es";
import Grid from "@material-ui/core/Grid";
import TranscriptItem from "./TranscriptItem/TranscriptItem";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
// import AttendeeSearch from "../AttendeeSearch";

const useStyles = makeStyles((theme) => ({
    root: {
        // width: '100%',
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
    },
    mainContainer:{
        padding:24,
        // height:"250px",
        overflow:"hidden"
    },
    transcriptContainer: {
        overflowY:"auto",
        height: "100%"
    },
    item: {
        display: "flex",
        alignItems: "center",
        margin: "0 10px"
    },
    avatarContainer: {
        margin: 10,
    },
    p:{
        margin:"5px 0",
        fontSize:14
    },
    avatar: {
        backgroundColor: red[500],
    },
    transcriptsHeader: {
        display: "flex",
        justifyContent: "space-between"
    }

}));
export const updateTranscript = ({ messageId, transcriptId, meetingId, updatePayload, resource, action }) => {


    const transcriptPayload = updatePayload;


    // fetch(apiConfig.summaryApiBaseurl + '/' + meetingId + '/transcript/' + transcriptId + '/' + messageId + '/' + resource, {
    //     method: getMethodFromAction(action),
    //     cache: 'no-cache',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(transcriptPayload)
    // }).then((response) => {
    //     // if(!response.ok) {
    //     //     return dispatch({
    //     //         type: UPDATE_TRANSCRIPT_FAILED,
    //     //         insightPayload: transcriptPayload
    //     //     });
    //     // }
    //     // return dispatch({
    //     //     type: UPDATE_TRANSCRIPT_SUCCESS,
    //     //     insightPayload: transcriptPayload
    //     // });
    // }).catch(err => {
    //     // return dispatch({
    //     //     type: UPDATE_TRANSCRIPT_FAILED,
    //     //     insightPayload: transcriptPayload,
    //     //     err
    //     // });
    // });
};
function getTranscriptCopyPayload(transcripts) {
    var transcriptForClipboard = '';
    transcripts.items
        .filter(transcript => transcript.metadata && transcript.metadata.originalMessageId)
        .forEach((transcript) => {
            transcriptForClipboard +=
                (transcript.from && Object.keys(transcript.from).length > 0 ? transcript.from.name + ': ' : '') +
                '(' +
                [
                    (transcript.timeDiff.hours === '00' ? '' : transcript.timeDiff.hours + ':') +
                    transcript.timeDiff.minutes,
                    transcript.timeDiff.seconds,
                ].join(':') +
                '): ' +
                transcript.text +
                '\r\n\r\n';
        });

    transcriptForClipboard = transcriptForClipboard.trim();
    return transcriptForClipboard;
}
export function TranscriptElement({transcripts, onSave, width, height}) {
    const classes = useStyles();
    const w = width || 400;
    const h = height || 250;
    return (
        <Grid container style={{width: w}} className={classes.root}>
            <Paper style={{height: h}} className={classes.mainContainer}>
                <Grid className={classes.transcriptsHeader}>
                    <Typography variant="h6">
                        Transcript
                    </Typography>
                    <CopyToClipboard
                        text={getTranscriptCopyPayload(transcripts)}
                        onCopy={() => {
                        }}
                    >
                        <IconButton
                            style={{
                                padding: 6,
                                color: '#777',
                            }}
                        >
                            <SvgIcon className={classes.copyIcon}>
                                <path
                                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </SvgIcon>
                        </IconButton>
                    </CopyToClipboard>
                </Grid>
                <Grid className={classes.transcriptContainer}>
                    {transcripts.items.map( ({text, timeDiff, from}, index) => (
                        <TranscriptItem
                            key={index} index={index}
                            description={text}
                            timeDiff={timeDiff}
                            from={from}
                            updateTranscript={onSave}
                        />))}
                </Grid>
                {/*<AttendeeSearch*/}
                {/*    attendees={[]}*/}
                {/*    attendeeAvatarColors={[]}*/}
                {/*    anchorEl={null}*/}
                {/*    transcript={{}}*/}
                {/*    attendeeSelectionCallback={() => null}*/}
                {/*    clickAwayCallback={() => null}*/}
                {/*    attendeeClearedCallback={() => null}*/}
                {/*/>*/}
            </Paper>
        </Grid>
    );
}

export default function Transcript(props) {
    const { onSave, conversationId, transcript } = props;

    const updateTranscript = (index, payload, items) => {
        const updatedItems = items.map( (item, ind) => {
            if(ind=== index) return { ...item, ...payload};
            return item
        })
        const messageId = items[index].id;
        const transcriptPayload = {content: payload};
        // fetch(`${apiConfig.summaryApiBaseurl}/conversationId/transcript/${transcripts.transcriptId}/${messageId}/payload`, {
        //     method: 'PUT',
        //     cache: 'no-cache',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(transcriptPayload)
        // }).then((response) => {
        //     if (!response.ok) {
        //         console.log(('Failed to update'))
        //     } else {
        //         console.log('updated');
        //     }
        // })
    };

    let initialTranscript = {items: []};
    let onSaveCallback = () => null;
    if(transcript){
        initialTranscript = transcript;
        onSaveCallback = onSave
    }
    else {
        onSaveCallback = updateTranscript;
    }
    let [transcripts, setTranscripts] =useState(initialTranscript);
    useEffect(() => {
        if(!transcripts){
            // fetch(`${apiConfig.summaryApiBaseurl}/${conversationId}/transcripts/${conversationId}`) //Passing sessionId as transcriptId for now
            //     .then(response => response.json())
            //     .then( resp => {
            //         console.log('resp',resp)
            //         setTranscripts(resp.transcripts)
            //     })
        }
    },[]);
    return <TranscriptElement transcripts={transcripts} onSave={onSaveCallback} />

}