import {Paper, Typography} from "@material-ui/core";
import React from "react";
import {ThemeProvider} from "@material-ui/styles";
import theme from "../../theme";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            backgroundColor: theme.palette.background.default,
        },
        paper: {
            padding: 12,
            width: '100%',
            border: 'none',
            alignItems: 'center'
        }
    })
);

const ClosedCaptions = ({transcriptResponse}) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                {
                    transcriptResponse && transcriptResponse.payload.content ?
                        (<Typography variant={"body1"} style={{color: 'gray'}}>
                            {transcriptResponse.payload.content}
                        </Typography>) :

                        (<Typography variant={"body1"} style={{color: 'gray'}}>
                            Live captioning will appear here ...
                        </Typography>)
                }
            </Paper>
        </div>
    );
};

export default ClosedCaptions;