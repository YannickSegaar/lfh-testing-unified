/**
 * Last Frontier Hub Modal - Unified Tabbed Experience
 *
 * Single modal combining Tours, Lodges, and Weather into a tabbed interface.
 * Two UI variants: standard overlay modal and full-page takeover.
 * Lives alongside existing standalone extensions — triggered by ext_hubModal trace.
 *
 * Uses the Unified Event Architecture for all agent interactions:
 *   - ext_modal_closed (hub)
 *
 * @version 1.0.0
 * @author Last Frontier Heliskiing / RomAIx
 */

import { LFH_COLORS, silentVariableUpdate, interactWithAgent } from './lfh-hub-shared.js';
import { renderToursTab, getToursTabState, buildToursStyles } from './lfh-hub-tab-tours.js';
import { renderLodgesTab, getLodgesTabState, buildLodgesStyles } from './lfh-hub-tab-lodges.js';
import { renderWeatherTab, getWeatherTabState, buildWeatherStyles } from './lfh-hub-tab-weather.js';

// ============================================================================
// TAB DEFINITIONS
// ============================================================================

const TABS = [
  { id: 'tours', label: 'Tours', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21l4-10 4 10"/><path d="M2 21l6-14 4 8"/><path d="M14 15l4-8 4 14"/></svg>' },
  { id: 'lodges', label: 'Lodges', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V10l9-7 9 7v11"/><path d="M9 21V14h6v7"/><path d="M3 21h18"/></svg>' },
  { id: 'weather', label: 'Weather', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h2m4-7l1 1m7-1l-1 1M12 3v2m5 3a5 5 0 0 0-10 0 4 4 0 1 0 0 8h10a3 3 0 1 0-1-5.8"/></svg>' },
];

// ============================================================================
// HUB: Open
// ============================================================================

/**
 * @param {Object} config
 * @param {string} [config.variant='modal'] - 'modal' or 'fullpage'
 * @param {string} [config.tab='tours'] - Initial tab: 'tours', 'lodges', 'weather'
 * @param {string|null} [config.tourId] - Focus on a specific tour
 * @param {string|null} [config.lodgeId] - Focus on a specific lodge
 * @param {string} [config.device_type='desktop'] - Device type for responsive behavior
 * @param {string} [config.webhookUrl=''] - n8n webhook endpoint for booking
 * @param {string|null} [config.conversationId]
 * @param {string|null} [config.userId]
 */
export function openHubModal(config = {}) {
  if (document.getElementById('lfh-hub-modal')) return;

  const {
    variant = 'modal',
    tab = 'tours',
    tourId = null,
    lodgeId = null,
    device_type = 'desktop',
    webhookUrl = '',
    conversationId = null,
    userId = null,
    visitorContext = {},
    conversationHistory = null,
    intentSignals = {},
  } = config;

  const isMobile = device_type === 'mobile' || window.innerWidth < 768;
  const openedAt = Date.now();
  const abortController = new AbortController();

  // --- Hub State ---
  const hubState = {
    activeTab: tab,
    tabHistory: [{ tab, timestamp: Date.now() }],
    openedAt,
    actionTaken: false,
    variant,
    tabSnapshots: {},
  };

  // Track unique tabs visited
  const tabsVisited = new Set([tab]);

  // --- Create Backdrop ---
  const backdrop = document.createElement('div');
  backdrop.id = 'lfh-hub-modal';
  backdrop.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7); z-index: 10000;
    display: flex; justify-content: center; align-items: center;
    animation: lfhub-fadeIn 0.3s ease;
  `;

  // --- Create Modal Container ---
  const modal = document.createElement('div');
  modal.className = variant === 'fullpage' ? 'lfhub-fullpage' : 'lfhub-modal';

  if (variant === 'fullpage') {
    modal.style.cssText = `
      width: 100%; height: 100%;
      background: ${LFH_COLORS.background};
      overflow: hidden; display: flex; flex-direction: column;
    `;
  } else {
    modal.style.cssText = `
      width: 94%; max-width: 1100px; height: 90%; max-height: 850px;
      background: ${LFH_COLORS.background}; border-radius: 12px;
      overflow: hidden; display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: lfhub-slideUp 0.4s ease;
    `;
  }

  // --- Inject Styles ---
  const styleEl = document.createElement('style');
  styleEl.textContent = buildHubStyles() + buildToursStyles() + buildLodgesStyles() + buildWeatherStyles();
  modal.appendChild(styleEl);

  // --- Header Bar ---
  const headerBar = document.createElement('div');
  headerBar.className = 'lfhub-header-bar';
  headerBar.innerHTML = `
    <span class="lfhub-header-title">Last Frontier</span>
    <button class="lfhub-close-btn" aria-label="Close">&times;</button>
  `;
  modal.appendChild(headerBar);

  // --- Tab Bar ---
  const tabBar = document.createElement('div');
  tabBar.className = 'lfhub-tab-bar';
  tabBar.innerHTML = TABS.map(t => `
    <button class="lfhub-tab ${t.id === tab ? 'active' : ''}" data-tab="${t.id}">
      <span class="lfhub-tab-icon">${t.icon}</span>
      <span class="lfhub-tab-label">${t.label}</span>
    </button>
  `).join('');
  modal.appendChild(tabBar);

  // --- Tab Content Containers (one per tab, hidden/shown) ---
  const tabContainer = document.createElement('div');
  tabContainer.className = 'lfhub-tab-container';
  tabContainer.style.cssText = 'flex: 1; overflow: hidden; position: relative;';

  const tabPanels = {};
  TABS.forEach(t => {
    const panel = document.createElement('div');
    panel.className = 'lfhub-tab-panel';
    panel.dataset.tab = t.id;
    panel.style.cssText = `
      position: absolute; inset: 0;
      display: ${t.id === tab ? 'flex' : 'none'};
      flex-direction: column; overflow: hidden;
    `;
    tabPanels[t.id] = panel;
    tabContainer.appendChild(panel);
  });

  modal.appendChild(tabContainer);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // --- Tab switch function (shared with tab modules via config) ---
  function switchToTab(targetTab, options = {}) {
    if (targetTab === hubState.activeTab) return;

    const fromTab = hubState.activeTab;

    // Save state snapshot from current tab
    saveTabState(fromTab);

    // Hide current panel
    tabPanels[fromTab].style.display = 'none';

    // Show target panel
    hubState.activeTab = targetTab;
    tabsVisited.add(targetTab);
    hubState.tabHistory.push({ tab: targetTab, timestamp: Date.now() });

    tabPanels[targetTab].style.display = 'flex';

    // Update tab bar active state
    tabBar.querySelectorAll('.lfhub-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === targetTab);
    });

    // Render or restore target tab
    renderTab(targetTab, options);

    // Update variables
    silentVariableUpdate('ext_hub_active_tab', targetTab);
    silentVariableUpdate('ext_hub_tabs_visited', [...tabsVisited].join(','));
  }

  function saveTabState(tabId) {
    if (tabId === 'tours') {
      hubState.tabSnapshots.tours = getToursTabState();
    } else if (tabId === 'lodges') {
      hubState.tabSnapshots.lodges = getLodgesTabState();
    } else if (tabId === 'weather') {
      hubState.tabSnapshots.weather = getWeatherTabState();
    }
  }

  // --- Tab config factory (shared config passed to each tab render) ---
  function makeTabConfig(options = {}) {
    return {
      onSwitchTab: switchToTab,
      onActionTaken: () => { hubState.actionTaken = true; },
      onCloseHub: closeModal,
      webhookUrl,
      conversationId,
      userId,
      visitorContext,
      conversationHistory,
      intentSignals,
      isMobile,
      variant,
      ...options,
    };
  }

  // --- Render a tab (initial or restore from snapshot) ---
  function renderTab(tabId, options = {}) {
    const panel = tabPanels[tabId];
    const savedState = hubState.tabSnapshots[tabId] || null;
    const tabConfig = makeTabConfig(options);

    if (tabId === 'tours') {
      renderToursTab(panel, tabConfig, savedState);
    } else if (tabId === 'lodges') {
      renderLodgesTab(panel, tabConfig, savedState);
    } else if (tabId === 'weather') {
      // Weather tab uses hide/show, only render once
      if (!panel.dataset.rendered) {
        renderWeatherTab(panel, tabConfig, savedState);
        panel.dataset.rendered = 'true';
      }
    }
  }

  // --- Render initial tab ---
  renderTab(tab, { tourId, lodgeId });

  // Fire hub opened event
  silentVariableUpdate('ext_last_action', 'hub_opened');
  silentVariableUpdate('ext_hub_active_tab', tab);

  // ========================================================================
  // TAB BAR EVENT LISTENERS
  // ========================================================================

  tabBar.querySelectorAll('.lfhub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      switchToTab(btn.dataset.tab);
    });
  });

  // ========================================================================
  // CLOSE MODAL
  // ========================================================================

  function closeModal() {
    const viewDurationMs = Date.now() - openedAt;

    if (!hubState.actionTaken) {
      interactWithAgent('ext_modal_closed', {
        modal: 'hub',
        variant,
        viewDurationMs,
        tabsVisited: [...tabsVisited],
        lastTab: hubState.activeTab,
      });
    }

    abortController.abort();
    backdrop.style.animation = 'lfhub-fadeOut 0.3s ease forwards';
    setTimeout(() => backdrop.remove(), 300);
  }

  headerBar.querySelector('.lfhub-close-btn')?.addEventListener('click', closeModal);
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
// VOICEFLOW EXTENSION
// ============================================================================

export const LastFrontierHub = {
  name: 'LastFrontierHub',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_hubModal' || trace.payload?.name === 'ext_hubModal',
  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    openHubModal({
      variant: payload.variant || 'modal',
      tab: payload.tab || 'tours',
      tourId: payload.tourId || null,
      lodgeId: payload.lodgeId || null,
      device_type: payload.device_type || 'desktop',
      webhookUrl: payload.webhookUrl || '',
      conversationId: payload.conversationId || null,
      userId: payload.userId || null,
      visitorContext: payload.visitorContext || {},
      conversationHistory: payload.conversationHistory || null,
      intentSignals: payload.intentSignals || {},
    });
  },
};

// ============================================================================
// HUB STYLES
// ============================================================================

function buildHubStyles() {
  return `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

@font-face {
  font-family: 'Nexa Rust Sans Black 2';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: 900; font-style: normal; font-display: swap;
}

/* Animations */
@keyframes lfhub-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes lfhub-fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes lfhub-slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header Bar */
.lfhub-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px; background: ${LFH_COLORS.textPrimary};
  flex-shrink: 0;
}
.lfhub-header-title {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 18px; font-weight: 900; color: #fff;
  text-transform: uppercase; letter-spacing: 2px;
}
.lfhub-close-btn {
  background: transparent; border: none; color: #fff;
  font-size: 28px; cursor: pointer; padding: 0;
  width: 44px; height: 44px; display: flex;
  align-items: center; justify-content: center;
  border-radius: 50%; transition: background 0.2s;
}
.lfhub-close-btn:hover { background: rgba(255,255,255,0.15); }

/* Tab Bar */
.lfhub-tab-bar {
  display: flex; gap: 0; padding: 0;
  background: #fff; border-bottom: 2px solid ${LFH_COLORS.border};
  flex-shrink: 0;
}
.lfhub-tab {
  flex: 1; padding: 12px 16px;
  background: transparent; border: none; border-bottom: 3px solid transparent;
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
  color: ${LFH_COLORS.textSecondary}; cursor: pointer;
  transition: all 0.2s; display: flex; align-items: center;
  justify-content: center; gap: 6px; margin-bottom: -2px;
}
.lfhub-tab:hover {
  color: ${LFH_COLORS.textPrimary};
  background: ${LFH_COLORS.infoBox};
}
.lfhub-tab.active {
  color: ${LFH_COLORS.primaryRed};
  border-bottom-color: ${LFH_COLORS.primaryRed};
}
.lfhub-tab-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
.lfhub-tab-icon svg { width: 16px; height: 16px; }

/* Tab Container */
.lfhub-tab-container {
  flex: 1; overflow: hidden; position: relative;
  font-family: 'Inter', sans-serif;
}
.lfhub-tab-panel {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; overflow: hidden;
}

/* Fullpage variant overrides */
.lfhub-fullpage .lfhub-header-bar {
  padding: 16px 24px;
}
.lfhub-fullpage .lfhub-header-title {
  font-size: 22px;
}

/* Mobile Responsive */
@media (max-width: 500px) {
  .lfhub-header-title { font-size: 13px; letter-spacing: 1px; }
  .lfhub-header-bar { padding: 8px 12px; }
  .lfhub-close-btn { width: 36px; height: 36px; font-size: 24px; }
  .lfhub-tab { padding: 8px 6px; font-size: 10px; }
  .lfhub-tab-bar { gap: 4px; }
  .lfhub-tab-icon { width: 14px; height: 14px; }
  .lfhub-tab-icon svg { width: 14px; height: 14px; }
}
`;
}
