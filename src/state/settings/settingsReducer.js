import { isMobile } from '../../utils';

export const initialSettings = {
  trackSwitchOffMode: undefined,
  dominantSpeakerPriority: 'standard',
  bandwidthProfileMode: 'collaboration',
  maxTracks: isMobile ? '5' : '10',
  maxAudioBitrate: '16000',
  renderDimensionLow: 'low',
  renderDimensionStandard: '960p',
  renderDimensionHigh: 'wide1080p',
  symblAppId: localStorage.getItem('symblAppId') || '',
  symblAppSecret: localStorage.getItem('symblAppSecret') || ''
};

// This inputLabels object is used by ConnectionOptions.js. It is used to populate the id, name, and label props
// of the various input elements. Using a typed object like this (instead of strings) eliminates the possibility
// of there being a typo.
export const inputLabels = (() => {
  const target = {};
  for (const setting in initialSettings) {
    target[setting] = setting;
  }
  return target;
})();

export function settingsReducer(state, action) {
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
