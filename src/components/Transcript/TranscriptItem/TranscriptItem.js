import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import words from "lodash-es/words";
import {Button} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import {Group} from "@material-ui/icons";
import PhoneIcon from '@material-ui/icons/Phone';
import capitalize from "lodash-es/capitalize";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    speakerAvatar: {
        color: '#fefefe',
        // '&:hover': {
        //     cursor: 'pointer',
        //     opacity: 0.75
        // },
        width: theme.spacing(4),
        height: theme.spacing(4),
        border: '1px solid'
        // transform: 'scale(0.80)'
    },

    timeText: {
        ...theme.typography.caption,
        fontWeight: 700,
        overflow: 'hidden'
    },
    mainContainer: {
        padding: 24,
        height: "250px",
        overflowY: "auto"
    },
    item: {
        display: "flex",
        alignItems: "center",
        margin: "5px 10px",
        flexGrow: 1,
        width: "90%"
    },
    avatarContainer: {
        margin: 10,
        marginTop: 0
    },
    p: {
        margin: "5px 0",
        fontSize: 14
    },
    avatar: {
        backgroundColor: red[500],
    },
    editIcon: {
        position: "absolute",
        right: "15px"
    },
    transcript: {
        position: "relative",
        flexGrow: 1,
        width: "80%",
        wordBreak: "break-all"
    },
    inputBox: {
        width: "100%",
        // height:"30px",
        outline: "none"
    },
    description: {
        width: "80%",
        textOverflow: "ellipsis",
        minHeight: 36,
        display: "block",
        overflow: "hidden",
        whiteSpace: "break-spaces",
    },
    cancelButton: {
        color: '#888888',
        borderColor: '#888888',
        textTransform: 'none',
        padding: 0,
        margin: "10px"
    },

    saveButton: {
        color: '#1C921CCC',
        borderColor: '#1C921C88',
        textTransform: 'none',
        padding: 0,
        margin: "10px"
    }

}));

const getTextAvatarContent = name => {
    let text = words(name)
    const len = text.length
    text = len < 2 ? text[0].slice(0, 2) : text.map(w => w[0]).join('')
    text = len < 2 ? capitalize(text).slice(0, 2) : text.toUpperCase().slice(0, 2)
    return text
}


const isPhoneNumber = (text) => {
    return new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/g).test(text);
}


const EditableText = React.forwardRef(({value, handleChange, onBlur, classes, updateTranscript, dismissEdit}, ref) => {
    return (
        <>
            <input ref={ref} type="text" value={value} onBlur={onBlur} onChange={handleChange}
                   className={classes.inputBox}/>
            <Grid container justify="flex-start">
                <Grid item key={'cancel-edit'}>
                    <Button
                        variant={"outlined"}
                        size={"small"}
                        color={"primary"}
                        className={classes.cancelButton}
                        tabIndex={4}
                        onClick={() => {
                            console.log('ehheheh');
                            dismissEdit()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={"outlined"}
                        size={"small"}
                        color={"primary"}
                        style={{marginLeft: 8, paddingRight: 6, paddingLeft: 6}}
                        className={classes.saveButton}
                        // disabled={!!disableSave}
                        // tabIndex={5}
                        onClick={() => {
                            console.log('in editabletext')
                            updateTranscript()
                        }}
                    >
                        {/*<KeyboardReturnIcon fontSize={'small'} style={{marginRight: 8}} />*/}
                        Save
                    </Button>
                </Grid>
            </Grid>
        </>
    )

});

export default function TranscriptItem({from = {}, description, timeDiff = {}, editable, updateTranscript, index}) {
    const classes = useStyles();
    const speakerName = from.name;
    const editRef = useRef(null);
    const [isEditable, setIsEditable] = useState(false);
    const [showEditIcon, setShowEditIcon] = useState(false);
    const [text, setText] = useState(description);
    const onBlur = () => setTimeout(() => setIsEditable(false), 0);
    const handleEditIconClick = () => {
        window.editRef = editRef
        setIsEditable(true);
    }
    useEffect(() => {
        if (editable && isEditable) {
            editRef.current.focus();
        }
    }, [isEditable, editable])
    const handleDescriptionChange = (e) => setText(e.target.value);
    return (<Grid item className={classes.item}>
        <Grid item className={classes.avatarContainer}>
            <Avatar
                className={classes.speakerAvatar}
                style={{backgroundColor: 'inherit'}}
            >
                {!!speakerName ? (
                    speakerName.includes('Multiple Speakers') ? (
                        <Group/>
                    ) : !isPhoneNumber(speakerName) ? (
                        <Typography
                            style={{fontSize: 16}}
                            id={'avatar_' + from.userId}
                            variant={'body1'}
                        >
                            {getTextAvatarContent(speakerName)}
                        </Typography>
                    ) : (
                        <PhoneIcon/>
                    )
                ) : null}
            </Avatar>

        </Grid>
        {
            editable ? (
                <Grid item className={classes.transcript} onMouseEnter={() => setShowEditIcon(true)}
                      onMouseLeave={() => setShowEditIcon(false)}>
                    {showEditIcon && !isEditable &&
                    <EditIcon onClick={handleEditIconClick} color={"action"} className={classes.editIcon}/>}
                    <div>
                        <Typography className={classes.timeText}>
                            {speakerName} &nbsp;
                            {[
                                (timeDiff.hours === '00' ? '' : timeDiff.hours + ':') +
                                timeDiff.minutes,
                                timeDiff.seconds
                            ].join(':')}
                        </Typography>
                    </div>

                    {(isEditable) ?
                        <EditableText ref={editRef} updateTranscript={() => {
                            updateTranscript(index, text)
                        }}
                                      dismissEdit={onBlur}
                                      value={text}
                                      handleChange={handleDescriptionChange}
                                      onBlur={onBlur} classes={classes}
                        /> :
                        <Typography variant="caption" className={classes.description}>{description}</Typography>
                    }
                </Grid>
            ) : (
                <Grid item className={classes.transcript}>
                    <div>
                        <Typography className={classes.timeText}>
                            {speakerName} &nbsp;
                            {[
                                (timeDiff.hours === '00' ? '' : timeDiff.hours + ':') +
                                timeDiff.minutes,
                                timeDiff.seconds
                            ].join(':')}
                        </Typography>
                    </div>
                    <Typography variant="caption" className={classes.description}>{description}</Typography>
                </Grid>
            )
        }

    </Grid>);
}
