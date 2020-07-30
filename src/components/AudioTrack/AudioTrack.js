import {useEffect, useRef} from 'react';
import {useAppState} from '../../state';

export default function AudioTrack({track}) {
    const {activeSinkId} = useAppState();
    const audioEl = useRef();

    useEffect(() => {
        audioEl.current = track.attach();
        audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
        document.body.appendChild(audioEl.current);
        return () => track.detach().forEach(el => el.remove());
    }, [track]);

    useEffect(() => {
        if (audioEl.current && audioEl.current.setSinkId) {
            audioEl.current.setSinkId(activeSinkId);
        }
    }, [activeSinkId]);

    return null;
}
