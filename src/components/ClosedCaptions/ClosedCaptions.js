import {Paper, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import useSymblContext from "../../hooks/useSymblContext/useSymblContext";
import useIsUserActive from "../Controls/useIsUserActive/useIsUserActive";
import useRoomState from "../../hooks/useRoomState/useRoomState";

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            textAlign: 'center',
            bottom: 50,
            position: 'absolute',
            width: '100%',
            zIndex: 1000,
            height: '6.8em',
            overflow: 'hidden',
            // maxWidth: 'min-content'
        },
        paper: {
            padding: 12,
            width: 'fit-content',
            border: 'none',
            alignItems: 'center',
            display: 'inline-block',
            backgroundColor: 'rgb(0,0,0, 0)',
            zIndex: 1000,
            maxWidth: '60vw'
        },
        caption: {
            fontWeight: 600,
            fontSize: '3vh',
            color: '#fefefe',
            textShadow: '2px 2px #1A1A1A'
        }
    })
);

const getContent = (data = {}) => {
    const {punctuated, payload} = data;
    if (punctuated && punctuated.transcript) {
        return punctuated.transcript;
    } else if (payload && payload.content) {
        return payload.content;
    } else if (payload && payload.raw && payload.raw.alternatives && payload.raw.alternatives.length > 0) {
        return payload.raw.alternatives[0].transcript || '';
    }
    return undefined;
}

const ClosedCaptions = (props, context) => {
    const {closedCaptionResponse} = useSymblContext()
    const text = getContent(closedCaptionResponse);
    const classes = useStyles();

    const {roomState} = useRoomState();
    const isUserActive = useIsUserActive();
    const addExtraMargin = isUserActive || roomState === 'disconnected';

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
    }, [text, containerRef])


    return (
        <div className={classes.container} ref={containerRef} style={{marginBottom: addExtraMargin ? 80 : 0 }}>
            {text ? (
            <Paper variant={"outlined"} className={classes.paper}>
                <Typography variant={"caption"} className={classes.caption}>
                    {text}
                </Typography>
            </Paper>) : undefined}
        </div>
    );
};

export default ClosedCaptions;