/**
 * Last Frontier Weather Conditions Widget v2 — Hero Image Card
 * Unified Event Architecture
 *
 * Image-forward card with skiing hero photo, gradient overlay,
 * Nexa Rust title with red accent line, and slim red footer CTA.
 * Entire card is clickable and opens the weather conditions modal.
 *
 * Triggers on VoiceFlow trace: ext_weather_conditions
 *
 * @version 2.1.0-unified
 * @author Last Frontier Heliskiing / RomAIx
 */

import { LFH_COLORS, LFH_ASSETS } from './lfh-tour-explorer-modal.js';
import { openWeatherConditionsModal } from './lfh-weather-conditions-modal-unified.js';

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_HERO_IMAGE =
  'https://yannicksegaar.github.io/RomAIx-Logo/weather_report_background.jpg';

const FALLBACK_GRADIENT =
  'linear-gradient(135deg, #1a3a4a 0%, #2d5a6a 40%, #3a7080 100%)';

// ============================================================================
// STYLES
// ============================================================================

function buildStyles() {
  return `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

@font-face {
  font-family: 'Nexa Rust Sans Black 2';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: 900; font-style: normal; font-display: swap;
}

/* Animations */
@keyframes lfhww2-fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Card container */
.lfhww2-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.lfhww2-card * { box-sizing: border-box; }
.lfhww2-card:hover {
  transform: scale(1.015);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

/* Hero image area */
.lfhww2-hero {
  position: relative;
  height: 180px;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px 18px;
}
.lfhww2-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 55%);
  pointer-events: none;
  z-index: 1;
}

/* Title with red accent line */
.lfhww2-title {
  position: relative; z-index: 2;
  font-family: 'Nexa Rust Sans Black 2', 'Inter', sans-serif;
  font-size: 16px; font-weight: 900; color: #fff;
  text-transform: uppercase; letter-spacing: 2px;
  margin: 0 0 4px; padding-left: 18px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  line-height: 1.2;
}
.lfhww2-title::before {
  content: '';
  position: absolute; left: 0; top: 0;
  width: 3px; height: 100%;
  background: ${LFH_COLORS.primaryRed};
  border-radius: 2px;
}

/* Subtitle */
.lfhww2-subtitle {
  position: relative; z-index: 2;
  font-family: 'Inter', sans-serif;
  font-size: 12px; color: #fff; opacity: 0.9;
  margin: 0; padding-left: 18px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  line-height: 1.4;
}

/* Description body */
.lfhww2-body {
  padding: 12px 16px;
  background: ${LFH_COLORS.background};
  border-top: none;
}
.lfhww2-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px; line-height: 1.55;
  color: ${LFH_COLORS.textSecondary};
  margin: 0;
}

/* Red footer strip */
.lfhww2-footer {
  display: flex; align-items: center; justify-content: center;
  gap: 8px;
  height: 44px;
  background: ${LFH_COLORS.primaryRed};
  font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 600;
  color: #fff; letter-spacing: 0.3px;
  transition: background 0.2s;
}
.lfhww2-card:hover .lfhww2-footer {
  background: #c4221a;
}
.lfhww2-footer-arrow {
  font-size: 16px;
  transition: transform 0.2s;
}
.lfhww2-card:hover .lfhww2-footer-arrow {
  transform: translateX(3px);
}

/* Mobile */
@media (max-width: 480px) {
  .lfhww2-hero { height: 150px; padding: 16px 14px; }
  .lfhww2-title { font-size: 14px; letter-spacing: 1.5px; }
  .lfhww2-subtitle { font-size: 11px; }
  .lfhww2-body { padding: 10px 14px; }
  .lfhww2-desc { font-size: 11px; }
  .lfhww2-footer { height: 40px; font-size: 12px; }
}
`;
}

// ============================================================================
// EXTENSION
// ============================================================================

export const LFHWeatherConditionsWidgetV2Unified = {
  name: 'LFHWeatherConditionsWidgetV2Unified',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_weather_conditions_v2_unified' ||
    trace.payload?.name === 'ext_weather_conditions_v2_unified',

  render: ({ trace, element }) => {
    const {
      title = 'CONDITIONS REPORT',
      subtitle = 'Live heliskiing conditions',
      description = 'View forecast reports, snowfall updates & historic weather data for Bell 2 Lodge and Ripley Creek.',
      buttonText = 'View Current Conditions',
      imageUrl = DEFAULT_HERO_IMAGE,
      animateIn = true,
    } = trace.payload || {};

    element.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'lfhww2-card';

    if (animateIn) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(12px)';
      container.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    container.innerHTML = `
<style>${buildStyles()}</style>
<div class="lfhww2-hero" style="background-image: url('${imageUrl}');">
  <p class="lfhww2-title">${title}</p>
  <p class="lfhww2-subtitle">${subtitle}</p>
</div>
<div class="lfhww2-body">
  <p class="lfhww2-desc">${description}</p>
</div>
<div class="lfhww2-footer">${buttonText} <span class="lfhww2-footer-arrow">&rarr;</span></div>
`;

    // Image fallback: if image fails, apply CSS gradient
    const heroEl = container.querySelector('.lfhww2-hero');
    const testImg = new Image();
    testImg.onerror = () => {
      heroEl.style.backgroundImage = FALLBACK_GRADIENT;
    };
    testImg.src = imageUrl;

    element.appendChild(container);

    // Animate in
    if (animateIn) {
      setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 50);
    }

    // Click handler — entire card opens the modal
    container.addEventListener('click', () => {
      openWeatherConditionsModal();
    });

    return function cleanup() {};
  },
};

export default LFHWeatherConditionsWidgetV2Unified;
