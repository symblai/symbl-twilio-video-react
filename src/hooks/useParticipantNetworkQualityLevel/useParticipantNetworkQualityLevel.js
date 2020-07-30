import {useEffect, useState} from 'react';

export default function useParticipantNetworkQualityLevel(participant = {}) {
    const [networkQualityLevel, setNetworkQualityLevel] = useState(participant.networkQualityLevel);

    useEffect(() => {
        const handleNetworkQualityLevelChange = (newNetworkQualityLevel) =>
            setNetworkQualityLevel(newNetworkQualityLevel);

        setNetworkQualityLevel(participant.networkQualityLevel);
        if (participant.on) {
            participant.on('networkQualityLevelChanged', handleNetworkQualityLevelChange);
            return () => {
                participant.off('networkQualityLevelChanged', handleNetworkQualityLevelChange);
            };
        }
    }, [participant]);

    return networkQualityLevel;
}
