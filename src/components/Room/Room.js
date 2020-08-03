import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import {useAppState} from "../../state";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import Transcript from "../Transcript/Transcript";

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `${theme.sidebarWidth}px 1fr`,
  gridTemplateAreas: '". participantList transcript"',
  gridTemplateRows: '100%',
  [theme.breakpoints.down('xs')]: {
    gridTemplateAreas: '"participantList" "."',
    gridTemplateColumns: `auto`,
    gridTemplateRows: `calc(100% - ${theme.sidebarMobileHeight + 12}px) ${theme.sidebarMobileHeight + 6}px`,
    gridGap: '6px',
  },
}));

export default function Room() {
  return (
    <Container>
      <ParticipantStrip />
      <MainParticipant />
      <Transcript height={"100%"}/>
    </Container>
  );
}
