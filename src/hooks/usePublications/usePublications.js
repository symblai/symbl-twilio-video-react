import { useEffect, useState } from 'react';

export default function usePublications(participant = {}) {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    // Reset the publications when the 'participant' variable changes.
    setPublications(Array.from(participant.tracks ? participant.tracks.values() : []));

    const publicationAdded = (publication) =>
      setPublications(prevPublications => [...prevPublications, publication]);
    const publicationRemoved = (publication) =>
      setPublications(prevPublications => prevPublications.filter(p => p !== publication));
    if (participant.on) {
      participant.on('trackPublished', publicationAdded);
      participant.on('trackUnpublished', publicationRemoved);
      return () => {
        participant.off('trackPublished', publicationAdded);
        participant.off('trackUnpublished', publicationRemoved);
      };
    }
  }, [participant]);

  return publications;
}
