/**
 * Last Frontier Hub - Shared Utilities & Constants
 *
 * Re-exports data constants and provides shared helper functions
 * used across all hub tab modules. Eliminates copy-pasted helpers.
 *
 * @version 1.0.0
 * @author Last Frontier Heliskiing / RomAIx
 */

// Re-export data constants from existing modules
export { LFH_TOURS, LFH_COLORS, LFH_ASSETS, LFH_VIDEOS } from './lfh-tour-explorer-modal.js';
export { LFH_LODGES, LFH_LODGE_VIDEOS } from './lfh-lodge-compare-modal-v2-unified.js';

// ============================================================================
// SHARED HELPERS
// ============================================================================

/**
 * Silently update a VoiceFlow variable without triggering a response.
 */
export function silentVariableUpdate(name, value) {
  try {
    if (window.voiceflow?.chat) {
      window.voiceflow.chat.proactive.push({ type: 'save', payload: { [name]: value } });
    }
  } catch (e) { /* silent */ }
}

/**
 * Send an event interaction to the VoiceFlow agent.
 */
export function interactWithAgent(eventName, data) {
  try {
    window.voiceflow?.chat?.interact({
      type: 'event',
      payload: {
        event: { name: eventName },
        data: data
      }
    });
  } catch (e) { console.log('[LFH-Hub] interact error:', e); }
}

/**
 * Display name for a lodge ID.
 */
export function lodgeName(id) {
  if (id === 'bell2') return 'Bell 2 Lodge';
  if (id === 'ripley') return 'Ripley Creek';
  if (id === 'both') return 'Both Lodges';
  if (id === 'safari') return 'Safari';
  return id;
}

/**
 * Badge color based on which lodges a tour is available at.
 */
export function lodgeBadgeColor(lodges) {
  if (lodges.includes('both')) return '#8B6914';
  if (lodges.includes('ripley') && lodges.includes('bell2')) return '#e62b1e';
  if (lodges.includes('ripley')) return '#2E7D32';
  return '#1565C0';
}

// ============================================================================
// COMPARISON DATA (used by lodges tab)
// ============================================================================

export const COMPARISON_CATEGORIES = [
  { label: 'Capacity', bell2: '36 guests', ripley: '24 guests', icon: '●●' },
  { label: 'Location', bell2: 'Skeena Mountains', ripley: 'Stewart, BC', icon: '◉' },
  { label: 'Accommodation Style', bell2: 'Log cabin chalets', ripley: 'Heritage hotel rooms', icon: '⌂' },
  { label: 'Terrain Level', bell2: 'Intermediate to Expert', ripley: 'Advanced to Expert', icon: '⛰' },
  { label: 'Snowfall', bell2: 'Consistent deep powder', ripley: '30% more snow on average', icon: '❄' },
  { label: 'Commute to Terrain', bell2: '5-minute helicopter flight', ripley: 'Longer commute, varied staging', icon: '→' },
  { label: 'Connectivity', bell2: 'Off-grid (WiFi available)', ripley: 'Cell service + WiFi', icon: '◎' },
  { label: 'Vibe', bell2: 'Wilderness immersion', ripley: 'Town character & culture', icon: '★' },
];

// ============================================================================
// INCLUDED ITEMS (used by tours tab detail view)
// ============================================================================

export const INCLUDED_ITEMS = [
  'Accommodation at lodge',
  'All meals by professional chefs',
  'Certified mountain guides (ACMG/IFMGA)',
  'Avalanche safety equipment',
  'Ski and snowboard tuning',
  'Ground transfers from Terrace airport',
  'Small group skiing (max 4 guests/guide)',
];

// ============================================================================
// WEATHER CONSTANTS (used by weather tab)
// ============================================================================

export const WEATHER_URL = 'https://www.lastfrontierheli.com/heliskiing-conditions/';
export const IFRAME_TIMEOUT = 8000;
