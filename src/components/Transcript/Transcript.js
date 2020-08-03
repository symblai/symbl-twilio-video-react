import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import moment from 'moment';
import words from 'lodash-es/words';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import Paper from "@material-ui/core/Paper";
import {range} from "lodash-es";
import Grid from "@material-ui/core/Grid";
import TranscriptItem from "./TranscriptItem/TranscriptItem";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import useSymblContext from "../../hooks/useSymblContext/useSymblContext";
import padStart from "lodash-es/padStart";
// import AttendeeSearch from "../AttendeeSearch";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    mainContainer: {
        padding: 12,
        overflow: "hidden",
        minWidth: '200px',
        height: '100%',
        // maxWidth: '300px',
        width: '20vw',
        border: 'none',
        borderRadius: 0,
        position: 'fixed',
        background: 'rgb(0, 0, 0, 0.5)',
        top: 0,
        right: 0,
        zIndex: 1500
    },
    transcriptContainer: {
        overflowY: "auto",
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
    p: {
        margin: "5px 0",
        fontSize: 14
    },
    avatar: {
        backgroundColor: red[500],
    },
    transcriptsHeader: {
        display: "flex",
        justifyContent: "center",
        paddingBottom: "20px"
    }

}));
export const updateTranscript = ({messageId, transcriptId, meetingId, updatePayload, resource, action}) => {


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

function getTranscriptCopyPayload(transcripts = {}) {
    let transcriptForClipboard = '';
    if (transcripts.items) {
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
    }
    transcriptForClipboard = transcriptForClipboard.trim();
    return transcriptForClipboard;
}

export function TranscriptElement({onSave, width, height, editable = false, transcriptItems}) {

    const classes = useStyles();
    const w = width;
    const h = height;
    // console.log('TranscriptElement', transcriptItems)

    const [containerRef, setContainerRef] = useState(null);

    useEffect(() => {
        if (!containerRef) {
            setContainerRef(React.createRef());
        }
    });

    useEffect(() => {
        if (containerRef && containerRef.current) {
            const element = containerRef.current;
            element.scrollTop = element.scrollHeight;
        }
    }, [transcriptItems, width, height, containerRef])

    return (
        <Grid container style={{width: w}} className={classes.root}>
            <Paper id={"transcript-paper"} className={classes.mainContainer}
                   variant={"outlined"}
            >
                <Grid className={classes.transcriptsHeader}>
                    <Typography variant="h6">
                        Transcript
                    </Typography>
                    {/*<CopyToClipboard
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
                    </CopyToClipboard>*/}
                </Grid>
                <Grid className={classes.transcriptContainer} ref={containerRef} style={{height: `calc(${h} - 62px)`}}>
                    {transcriptItems.filter(item => !!item).map(({text, timeDiff, from}, index) => (
                        <TranscriptItem
                            key={index} index={index}
                            description={text}
                            timeDiff={timeDiff}
                            from={from}
                            updateTranscript={onSave}
                            editable={editable}
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

const convertMessageToTranscriptItem = (message, startedTime) => {
    if (message) {
        const text = message.text || message.payload.content;
        let timeDiff = {};
        if (message.duration && message.duration.startTime) {
            const messageTime = moment(message.duration.startTime);
            let diff = moment.duration(messageTime.diff(startedTime));
            timeDiff = {
                hours: padStart(diff.hours().toString(), 2, '0'),
                minutes: padStart(diff.minutes().toString(), 2, '0'),
                seconds: padStart(diff.seconds().toString(), 2, '0'),
            };
        }
        const from = message.from;

        return {
            text,
            timeDiff,
            from
        }
    }
}

export default function Transcript({ height }) {
    const {newMessages, messages, startedTime} = useSymblContext()

    // console.log('Transcript', newMessages, messages)
    let [transcriptItems, setTranscriptItems] = useState([]);

    useEffect(() => {
        if (newMessages && newMessages.length > 0) {
            // console.log('Converting to item')
            const newTranscriptItems = newMessages.map(message => convertMessageToTranscriptItem(message, startedTime));
            setTranscriptItems([...transcriptItems, ...newTranscriptItems]);
        }
    }, [newMessages]);

    return <TranscriptElement transcriptItems={transcriptItems} height={height}/>

}