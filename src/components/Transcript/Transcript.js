import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TranscriptItem from "./TranscriptItem/TranscriptItem";
import useSymblContext from "../../hooks/useSymblContext/useSymblContext";
import padStart from "lodash-es/padStart";
import Draggable from "react-draggable"

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        justifyContent: "center",
        cursor: "grab",
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

export function TranscriptElement({onSave, width, height, editable = false, transcriptItems}) {

    const classes = useStyles();
    const w = width;
    const h = height;

    const [containerRef, setContainerRef] = useState(null);

    useEffect(() => {
        if (!containerRef) {
            setContainerRef(React.createRef());
        }
    }, [containerRef]);

    useEffect(() => {
        if (containerRef && containerRef.current) {
            const element = containerRef.current;
            element.scrollTop = element.scrollHeight;
        }
    }, [transcriptItems, width, height, containerRef])

    return (
        <Grid container style={{width: w}} className={classes.root}>
            <Draggable>
                <Paper id={"transcript-paper"} className={classes.mainContainer}
                    variant={"outlined"}
                >
                    <Grid className={classes.transcriptsHeader}>
                        <Typography variant="h6">
                            Transcript
                        </Typography>
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
                </Paper>
            </Draggable>    
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
    const {newMessages, startedTime} = useSymblContext()

    let [transcriptItems, setTranscriptItems] = useState([]);

    useEffect(() => {
        if (newMessages && newMessages.length > 0) {
            const newTranscriptItems = newMessages.map(message => convertMessageToTranscriptItem(message, startedTime));
            setTranscriptItems([...transcriptItems, ...newTranscriptItems]);
        }
    }, [newMessages]);

    return <TranscriptElement transcriptItems={transcriptItems} height={height}/>

}