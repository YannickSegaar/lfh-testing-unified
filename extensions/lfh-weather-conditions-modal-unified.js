/**
 * Last Frontier Weather Conditions - iFrame Modal Extension
 * Unified Event Architecture
 *
 * Opens the live heliskiing weather conditions page in a branded
 * modal overlay with iframe, loading state, and graceful fallback.
 *
 * Uses the Unified Event Architecture for all agent interactions:
 *   - ext_user_action  (weather_view_external, weather_browse_tours, weather_compare_lodges)
 *   - ext_modal_closed (weather)
 *
 * @version 2.0.0-unified
 * @author Last Frontier Heliskiing / RomAIx
 */

import { LFH_COLORS, LFH_ASSETS } from '../lfh-tour-explorer-modal.js';
import { openLodgeCompareModal } from './lfh-lodge-compare-modal-v2-unified.js';
import { openTourExplorerModalWithBookingUnified } from './lfh-tour-explorer-modal-booking-unified.js';

// ============================================================================
// CONSTANTS
// ============================================================================

const WEATHER_URL = 'https://www.lastfrontierheli.com/heliskiing-conditions/';
const IFRAME_TIMEOUT = 8000;

// ============================================================================
// HELPER: VoiceFlow Agent Communication
// ============================================================================

function silentVariableUpdate(name, value) {
  try {
    if (window.voiceflow?.chat) {
      window.voiceflow.chat.proactive.push({ type: 'save', payload: { [name]: value } });
    }
  } catch (e) {
    // Silent fail - VF may not be available in test
  }
}

function interactWithAgent(eventName, data) {
  try {
    window.voiceflow?.chat?.interact({
      type: 'event',
      payload: {
        event: { name: eventName },
        data: data
      }
    });
  } catch (e) { console.log('[WeatherConditions] interact error:', e); }
}

// ============================================================================
// MODAL: Open
// ============================================================================

export function openWeatherConditionsModal() {
  if (document.getElementById('lfh-weather-conditions-modal')) return;

  const openedAt = Date.now();
  let actionTaken = false;
  const abortController = new AbortController();

  // --- Create Modal Shell ---
  const backdrop = document.createElement('div');
  backdrop.id = 'lfh-weather-conditions-modal';
  backdrop.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7); z-index: 10000;
    display: flex; justify-content: center; align-items: center;
    animation: lfhwc-fadeIn 0.3s ease;
  `;

  const modal = document.createElement('div');
  modal.className = 'lfhwc-modal';
  modal.style.cssText = `
    width: 94%; max-width: 1100px; height: 90%; max-height: 850px;
    background: ${LFH_COLORS.background}; border-radius: 12px;
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: lfhwc-slideUp 0.4s ease;
  `;

  // --- Inject Styles ---
  const styleEl = document.createElement('style');
  styleEl.textContent = buildModalStyles();
  modal.appendChild(styleEl);

  // --- Header Bar ---
  const headerBar = document.createElement('div');
  headerBar.className = 'lfhwc-header-bar';
  headerBar.innerHTML = `
    <div class="lfhwc-header-left">
      <span class="lfhwc-header-title">Weather Conditions</span>
    </div>
    <button class="lfhwc-close-btn" aria-label="Close">&times;</button>
  `;
  modal.appendChild(headerBar);

  // --- Content Area ---
  const content = document.createElement('div');
  content.className = 'lfhwc-content';
  content.style.cssText = 'flex: 1; position: relative; overflow: hidden;';

  // Loading overlay
  const loading = document.createElement('div');
  loading.className = 'lfhwc-loading';
  loading.innerHTML = `
    <div class="lfhwc-spinner"></div>
    <p class="lfhwc-loading-text">Loading weather conditions...</p>
  `;
  content.appendChild(loading);

  // iframe
  const iframe = document.createElement('iframe');
  iframe.src = WEATHER_URL;
  iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms';
  iframe.style.cssText = `
    width: 100%; height: 100%; border: none;
    opacity: 0; transition: opacity 0.4s ease;
    position: absolute; top: 0; left: 0;
  `;
  iframe.title = 'Last Frontier Heliskiing - Weather Conditions';
  content.appendChild(iframe);

  modal.appendChild(content);

  // --- Cross-Navigation Footer ---
  const footerBar = document.createElement('div');
  footerBar.className = 'lfhwc-footer-bar';
  footerBar.innerHTML = `
    <span class="lfhwc-footer-label">Explore more:</span>
    <button class="lfhwc-footer-btn" data-nav="tours">Browse Tours &rarr;</button>
    <button class="lfhwc-footer-btn" data-nav="lodges">Compare Lodges &rarr;</button>
  `;
  modal.appendChild(footerBar);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Silent variable update
  silentVariableUpdate('ext_last_action', 'weather_conditions_opened');

  // --- iframe load / fallback logic ---
  let loaded = false;

  const timeoutId = setTimeout(() => {
    if (!loaded) {
      showFallback();
    }
  }, IFRAME_TIMEOUT);

  iframe.addEventListener('load', () => {
    loaded = true;
    clearTimeout(timeoutId);
    // Fade out loading, fade in iframe
    loading.style.opacity = '0';
    loading.style.pointerEvents = 'none';
    iframe.style.opacity = '1';
    setTimeout(() => loading.remove(), 400);
  });

  iframe.addEventListener('error', () => {
    if (!loaded) {
      clearTimeout(timeoutId);
      showFallback();
    }
  });

  function showFallback() {
    loaded = true;
    iframe.remove();
    loading.innerHTML = `
      <div class="lfhwc-fallback">
        <div class="lfhwc-fallback-icon">&#9729;</div>
        <p class="lfhwc-fallback-message">This page couldn't be loaded inline due to security settings.</p>
        <button class="lfhwc-fallback-btn" id="lfhwc-open-external">Open Weather Conditions</button>
        <p class="lfhwc-fallback-subtext">Opens in a new tab</p>
      </div>
    `;
    loading.style.opacity = '1';
    loading.querySelector('#lfhwc-open-external')?.addEventListener('click', () => {
      window.open(WEATHER_URL, '_blank');
      actionTaken = true;
      interactWithAgent('ext_user_action', {
        action: 'weather_view_external',
        source: 'weather_modal',
      });
    });
  }

  // --- Cross-Navigation Handlers ---
  footerBar.querySelector('[data-nav="tours"]')?.addEventListener('click', () => {
    actionTaken = true;
    interactWithAgent('ext_user_action', {
      action: 'weather_browse_tours',
      source: 'weather_modal',
    });
    closeModal();
    setTimeout(() => {
      openTourExplorerModalWithBookingUnified(null, {
        onCompareLodges: (lodgeId) => openLodgeCompareModal(lodgeId || null),
        onCheckConditions: () => openWeatherConditionsModal(),
      });
    }, 350);
  });

  footerBar.querySelector('[data-nav="lodges"]')?.addEventListener('click', () => {
    actionTaken = true;
    interactWithAgent('ext_user_action', {
      action: 'weather_compare_lodges',
      source: 'weather_modal',
    });
    closeModal();
    setTimeout(() => openLodgeCompareModal(), 350);
  });

  // ========================================================================
  // CLOSE MODAL
  // ========================================================================

  function closeModal() {
    const viewDurationMs = Date.now() - openedAt;
    if (!actionTaken) {
      interactWithAgent('ext_modal_closed', { modal: 'weather', viewDurationMs });
    }

    abortController.abort();
    backdrop.style.animation = 'lfhwc-fadeOut 0.3s ease forwards';
    setTimeout(() => {
      backdrop.remove();
    }, 300);
  }

  // Close handlers
  headerBar.querySelector('.lfhwc-close-btn')?.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.contains(backdrop)) {
      closeModal();
    }
  }, { signal: abortController.signal });
}

// ============================================================================
// STYLES
// ============================================================================

function buildModalStyles() {
  return `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

@font-face {
  font-family: 'Nexa Rust Sans Black 2';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* Animations */
@keyframes lfhwc-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes lfhwc-fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes lfhwc-slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes lfhwc-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Header Bar */
.lfhwc-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; background: ${LFH_COLORS.textPrimary};
  flex-shrink: 0;
}
.lfhwc-header-left { display: flex; align-items: center; gap: 12px; }
.lfhwc-header-title {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 16px; font-weight: 900; color: #fff;
  text-transform: uppercase; letter-spacing: 2px;
}
.lfhwc-close-btn {
  background: transparent; border: none; color: #fff;
  font-size: 28px; cursor: pointer; padding: 0;
  width: 44px; height: 44px; display: flex;
  align-items: center; justify-content: center;
  border-radius: 50%; transition: background 0.2s;
}
.lfhwc-close-btn:hover { background: rgba(255,255,255,0.15); }

/* Loading State */
.lfhwc-loading {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: ${LFH_COLORS.background};
  transition: opacity 0.4s ease;
  z-index: 1;
}
.lfhwc-spinner {
  width: 40px; height: 40px;
  border: 4px solid ${LFH_COLORS.border};
  border-top-color: ${LFH_COLORS.primaryRed};
  border-radius: 50%;
  animation: lfhwc-spin 0.8s linear infinite;
}
.lfhwc-loading-text {
  margin-top: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px; color: ${LFH_COLORS.textSecondary};
}

/* Fallback State */
.lfhwc-fallback {
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
  padding: 40px 20px;
}
.lfhwc-fallback-icon {
  font-size: 48px; margin-bottom: 16px;
  color: ${LFH_COLORS.textSecondary};
}
.lfhwc-fallback-message {
  font-family: 'Inter', sans-serif;
  font-size: 15px; color: ${LFH_COLORS.textPrimary};
  margin: 0 0 20px; max-width: 360px; line-height: 1.5;
}
.lfhwc-fallback-btn {
  padding: 14px 32px;
  background: ${LFH_COLORS.primaryRed}; color: #fff;
  border: none; border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.lfhwc-fallback-btn:hover {
  background: #c4221a; transform: translateY(-1px);
}
.lfhwc-fallback-subtext {
  margin: 10px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 12px; color: ${LFH_COLORS.textSecondary};
}

/* Cross-Navigation Footer */
.lfhwc-footer-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 20px;
  background: ${LFH_COLORS.background};
  border-top: 1px solid #E5E8EB;
  flex-shrink: 0;
}
.lfhwc-footer-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px; color: ${LFH_COLORS.textSecondary};
  white-space: nowrap;
}
.lfhwc-footer-btn {
  flex: 1; padding: 10px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 600;
  border-radius: 6px; cursor: pointer;
  transition: all 0.2s; text-align: center;
  border: 1px solid #E5E8EB;
  background: ${LFH_COLORS.background};
  color: ${LFH_COLORS.textPrimary};
}
.lfhwc-footer-btn:hover {
  border-color: ${LFH_COLORS.primaryRed};
  color: ${LFH_COLORS.primaryRed};
}

/* Mobile Responsive */
@media (max-width: 500px) {
  .lfhwc-modal {
    width: 100% !important; height: 100% !important;
    max-width: 100% !important; max-height: 100% !important;
    border-radius: 0 !important;
  }
  .lfhwc-header-title { font-size: 14px; letter-spacing: 1px; }
  .lfhwc-header-bar { padding: 12px 16px; }
  .lfhwc-close-btn { width: 44px; height: 44px; }
  .lfhwc-footer-bar { flex-wrap: wrap; padding: 10px 16px; }
  .lfhwc-footer-label { width: 100%; margin-bottom: 4px; }
  .lfhwc-footer-btn { font-size: 12px; padding: 8px 12px; }
}
`;
}
