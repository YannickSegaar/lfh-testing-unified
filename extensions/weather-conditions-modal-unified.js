/**
 * Last Frontier Weather Conditions - iFrame Modal Extension
 * VoiceFlow-Ready — Unified Event Architecture
 *
 * Self-contained version for VoiceFlow widget (no ES module imports).
 * Cross-modal navigation uses window.__lfh namespace.
 *
 * Uses the Unified Event Architecture for all agent interactions:
 *   - ext_user_action  (weather_view_external, weather_browse_tours, weather_compare_lodges)
 *   - ext_modal_closed (weather)
 *
 * @version 2.0.0-vf
 * @author Last Frontier Heliskiing / RomAIx
 */

// ============================================================================
// SHARED CONSTANTS (inlined — no ES module import)
// ============================================================================

const LFH_COLORS_WC = {
  primaryRed: '#e62b1e',
  textPrimary: '#42494e',
  textSecondary: '#666666',
  background: '#FFFFFF',
  infoBox: '#F5F5F5',
  border: '#E5E8EB',
  selectedTint: 'rgba(230, 43, 30, 0.04)',
};

const WEATHER_URL = 'https://www.lastfrontierheli.com/heliskiing-conditions/';
const IFRAME_TIMEOUT = 8000;

// ============================================================================
// CROSS-MODAL NAMESPACE
// ============================================================================

window.__lfh = window.__lfh || {};

// ============================================================================
// HELPER: VoiceFlow Agent Communication
// ============================================================================

function _wcSilentVariableUpdate(name, value) {
  try {
    if (window.voiceflow?.chat) {
      window.voiceflow.chat.proactive.push({ type: 'save', payload: { [name]: value } });
    }
  } catch (e) { /* silent */ }
}

function _wcInteractWithAgent(eventName, data) {
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

function openWeatherConditionsModal() {
  if (document.getElementById('lfh-weather-conditions-modal')) return;

  const C = LFH_COLORS_WC;
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
    background: ${C.background}; border-radius: 12px;
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: lfhwc-slideUp 0.4s ease;
  `;

  // --- Inject Styles ---
  const styleEl = document.createElement('style');
  styleEl.textContent = _wcBuildModalStyles(C);
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

  const loading = document.createElement('div');
  loading.className = 'lfhwc-loading';
  loading.innerHTML = `
    <div class="lfhwc-spinner"></div>
    <p class="lfhwc-loading-text">Loading weather conditions...</p>
  `;
  content.appendChild(loading);

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

  _wcSilentVariableUpdate('ext_last_action', 'weather_conditions_opened');

  // --- iframe load / fallback logic ---
  let loaded = false;

  const timeoutId = setTimeout(() => {
    if (!loaded) showFallback();
  }, IFRAME_TIMEOUT);

  iframe.addEventListener('load', () => {
    loaded = true;
    clearTimeout(timeoutId);
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
      _wcInteractWithAgent('ext_user_action', {
        action: 'weather_view_external',
        source: 'weather_modal',
      });
    });
  }

  // --- Cross-Navigation Handlers ---
  footerBar.querySelector('[data-nav="tours"]')?.addEventListener('click', () => {
    actionTaken = true;
    _wcInteractWithAgent('ext_user_action', {
      action: 'weather_browse_tours',
      source: 'weather_modal',
    });
    closeModal();
    setTimeout(() => {
      if (window.__lfh.openTourExplorer) {
        window.__lfh.openTourExplorer(null, {
          onCompareLodges: (lodgeId) => window.__lfh.openLodgeCompare?.(lodgeId || null),
          onCheckConditions: () => window.__lfh.openWeatherConditions?.(),
        });
      }
    }, 350);
  });

  footerBar.querySelector('[data-nav="lodges"]')?.addEventListener('click', () => {
    actionTaken = true;
    _wcInteractWithAgent('ext_user_action', {
      action: 'weather_compare_lodges',
      source: 'weather_modal',
    });
    closeModal();
    setTimeout(() => {
      window.__lfh.openLodgeCompare?.();
    }, 350);
  });

  // ========================================================================
  // CLOSE MODAL
  // ========================================================================

  function closeModal() {
    var viewDurationMs = Date.now() - openedAt;
    if (!actionTaken) {
      _wcInteractWithAgent('ext_modal_closed', { modal: 'weather', viewDurationMs: viewDurationMs });
    }

    abortController.abort();
    backdrop.style.animation = 'lfhwc-fadeOut 0.3s ease forwards';
    setTimeout(function () {
      backdrop.remove();
    }, 300);
  }

  headerBar.querySelector('.lfhwc-close-btn')?.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.contains(backdrop)) {
      closeModal();
    }
  }, { signal: abortController.signal });
}

// Register on namespace
window.__lfh.openWeatherConditions = openWeatherConditionsModal;

// ============================================================================
// VOICEFLOW EXTENSION WRAPPER
// ============================================================================

export const LastFrontierWeatherConditionsModal = {
  name: 'LastFrontierWeatherConditionsModal',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_weatherConditions' ||
    trace.payload?.name === 'ext_weatherConditions',

  render: ({ trace, element }) => {
    openWeatherConditionsModal();
  },
};

// ============================================================================
// STYLES
// ============================================================================

function _wcBuildModalStyles(C) {
  return `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

@font-face {
  font-family: 'Nexa Rust Sans Black 2';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

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

.lfhwc-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; background: ${C.textPrimary};
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

.lfhwc-loading {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: ${C.background};
  transition: opacity 0.4s ease;
  z-index: 1;
}
.lfhwc-spinner {
  width: 40px; height: 40px;
  border: 4px solid ${C.border};
  border-top-color: ${C.primaryRed};
  border-radius: 50%;
  animation: lfhwc-spin 0.8s linear infinite;
}
.lfhwc-loading-text {
  margin-top: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px; color: ${C.textSecondary};
}

.lfhwc-fallback {
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
  padding: 40px 20px;
}
.lfhwc-fallback-icon {
  font-size: 48px; margin-bottom: 16px;
  color: ${C.textSecondary};
}
.lfhwc-fallback-message {
  font-family: 'Inter', sans-serif;
  font-size: 15px; color: ${C.textPrimary};
  margin: 0 0 20px; max-width: 360px; line-height: 1.5;
}
.lfhwc-fallback-btn {
  padding: 14px 32px;
  background: ${C.primaryRed}; color: #fff;
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
  font-size: 12px; color: ${C.textSecondary};
}

.lfhwc-footer-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 20px;
  background: ${C.background};
  border-top: 1px solid #E5E8EB;
  flex-shrink: 0;
}
.lfhwc-footer-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px; color: ${C.textSecondary};
  white-space: nowrap;
}
.lfhwc-footer-btn {
  flex: 1; padding: 10px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 600;
  border-radius: 6px; cursor: pointer;
  transition: all 0.2s; text-align: center;
  border: 1px solid #E5E8EB;
  background: ${C.background};
  color: ${C.textPrimary};
}
.lfhwc-footer-btn:hover {
  border-color: ${C.primaryRed};
  color: ${C.primaryRed};
}

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
