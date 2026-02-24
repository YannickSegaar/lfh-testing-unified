/**
 * Last Frontier Hub - Weather Tab
 *
 * Extracted from lfh-weather-conditions-modal-unified.js.
 * Renders iframe with loading/fallback inside the hub.
 * No modal shell — the hub handles that.
 *
 * Special: Weather tab DOM is hidden (not destroyed) on tab switch
 * to avoid expensive iframe reload.
 *
 * @version 1.0.0
 * @author Last Frontier Heliskiing / RomAIx
 */

import {
  LFH_COLORS, WEATHER_URL, IFRAME_TIMEOUT,
  silentVariableUpdate, interactWithAgent,
} from './lfh-hub-shared.js';

// ============================================================================
// MODULE STATE
// ============================================================================

let _state = null;

export function getWeatherTabState() {
  if (!_state) return null;
  return { loaded: _state.loaded };
}

// ============================================================================
// RENDER: Weather Tab Entry Point
// ============================================================================

/**
 * @param {HTMLElement} container - The tab panel element
 * @param {Object} config - Hub config
 * @param {Object|null} savedState - Restored state from tab snapshot
 */
export function renderWeatherTab(container, config, savedState) {
  const { onSwitchTab, onActionTaken } = config;

  _state = {
    loaded: savedState?.loaded || false,
  };

  container.innerHTML = '';

  // Content wrapper
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

  container.appendChild(content);

  silentVariableUpdate('ext_last_action', 'weather_conditions_opened');

  // --- iframe load / fallback logic ---
  const timeoutId = setTimeout(() => {
    if (!_state.loaded) showFallback();
  }, IFRAME_TIMEOUT);

  iframe.addEventListener('load', () => {
    _state.loaded = true;
    clearTimeout(timeoutId);
    loading.style.opacity = '0';
    loading.style.pointerEvents = 'none';
    iframe.style.opacity = '1';
    setTimeout(() => loading.remove(), 400);
  });

  iframe.addEventListener('error', () => {
    if (!_state.loaded) {
      clearTimeout(timeoutId);
      showFallback();
    }
  });

  function showFallback() {
    _state.loaded = true;
    iframe.remove();
    loading.innerHTML = `
      <div class="lfhwc-fallback">
        <div class="lfhwc-fallback-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${LFH_COLORS.textSecondary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h2m4-7l1 1m7-1l-1 1M12 3v2m5 3a5 5 0 0 0-10 0 4 4 0 1 0 0 8h10a3 3 0 1 0-1-5.8"/></svg></div>
        <p class="lfhwc-fallback-message">View current snow conditions, weather forecasts, and terrain updates for our heliskiing areas.</p>
        <button class="lfhwc-fallback-btn" id="lfhwc-open-external">Open Weather Conditions</button>
        <p class="lfhwc-fallback-subtext">Opens lastfrontierheli.com in a new tab</p>
      </div>
    `;
    loading.style.opacity = '1';
    loading.querySelector('#lfhwc-open-external')?.addEventListener('click', () => {
      window.open(WEATHER_URL, '_blank');
      onActionTaken();
      interactWithAgent('ext_user_action', {
        action: 'weather_view_external',
        source: 'weather_modal',
      });
    });
  }

}

// ============================================================================
// STYLES (all .lfhwc-* prefixed)
// ============================================================================

export function buildWeatherStyles() {
  return `
@keyframes lfhwc-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes lfhwc-fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes lfhwc-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

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
.lfhwc-fallback-icon { font-size: 48px; margin-bottom: 16px; color: ${LFH_COLORS.textSecondary}; }
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
.lfhwc-fallback-btn:hover { background: #c4221a; transform: translateY(-1px); }
.lfhwc-fallback-subtext {
  margin: 10px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 12px; color: ${LFH_COLORS.textSecondary};
}

`;
}
