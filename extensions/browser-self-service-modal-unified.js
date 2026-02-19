/**
 * Last Frontier Browser Self-Service - Modal Extension
 * VoiceFlow-Ready — Unified Event Architecture
 *
 * Self-contained version for VoiceFlow widget (no ES module imports).
 * Cross-modal navigation uses window.__lfh namespace.
 *
 * Full-screen overlay modal with 3-tab navigation:
 * - Videos: Backgrounder video series (6 episodes) with inline player
 * - FAQ: Accordion-style frequently asked questions
 * - Resources: External links to helpful pages
 *
 * Uses the Unified Event Architecture for all agent interactions:
 *   - ext_modal_closed (browser_ss)
 *
 * @version 4.0.0-vf
 * @author Last Frontier Heliskiing / RomAIx
 */

// ============================================================================
// SHARED CONSTANTS (inlined — no ES module import)
// ============================================================================

const LFH_COLORS_SS = {
  primaryRed: '#e62b1e',
  textPrimary: '#42494e',
  textSecondary: '#666666',
  background: '#FFFFFF',
  infoBox: '#F5F5F5',
  border: '#E5E8EB',
  selectedTint: 'rgba(230, 43, 30, 0.04)',
};

const LFH_ASSETS_SS = {
  bgImage: 'https://yannicksegaar.github.io/RomAIx-Logo/LFH_bg_content_and_image_black.png',
  logo: 'https://yannicksegaar.github.io/RomAIx-Logo/LFH_Logo_FullName_White.svg',
  videoMask: 'https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/videos-img-mask.png',
};

// ============================================================================
// CROSS-MODAL NAMESPACE
// ============================================================================

window.__lfh = window.__lfh || {};

// ============================================================================
// HELPER: VoiceFlow Agent Communication
// ============================================================================

function _ssSilentVariableUpdate(name, value) {
  try {
    if (window.voiceflow?.chat) {
      window.voiceflow.chat.proactive.push({ type: 'save', payload: { [name]: value } });
    }
  } catch (e) { /* silent */ }
}

function _ssInteractWithAgent(eventName, data) {
  try {
    window.voiceflow?.chat?.interact({
      type: 'event',
      payload: {
        event: { name: eventName },
        data: data
      }
    });
  } catch (e) { console.log('[BrowserSelfService] interact error:', e); }
}

// ============================================================================
// INLINE SVG ICONS FOR RESOURCES
// ============================================================================

const _SS_RESOURCE_ICONS = {
  faq: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>`,

  prep: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>`,

  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>`,

  lodges: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>`,
};

// ============================================================================
// DATA
// ============================================================================

const _SS_VIDEOS = [
  {
    id: 'location',
    episode: 1,
    title: 'Location',
    vimeoId: '234398800',
    thumbnail: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/01_Last_Frontier_Backgrounder_Series_Location-510x339.jpg',
    description: "Where we fly - Northern BC's Skeena Mountains",
  },
  {
    id: 'lodging',
    episode: 2,
    title: 'Lodging',
    vimeoId: '237992712',
    thumbnail: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/02_Last_Frontier_Backgrounder_Series_Lodging-510x340.jpg',
    description: 'Where you stay - Two unique lodge experiences',
  },
  {
    id: 'terrain',
    episode: 3,
    title: 'Terrain',
    vimeoId: '242847858',
    thumbnail: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/03_Last_Frontier_Backgrounder_Series_Terrain-496x350.jpg',
    description: 'What you ski - From alpine bowls to gladed trees',
  },
  {
    id: 'day-in-life',
    episode: 4,
    title: 'Day in the Life',
    vimeoId: '247898299',
    thumbnail: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/04_Last_Frontier_Backgrounder_Series_Day_In_The_Life-510x340.jpg',
    description: 'How a day unfolds - 8-12 runs, 15,000+ feet',
  },
  {
    id: 'safety',
    episode: 5,
    title: 'Safety',
    vimeoId: '251401988',
    thumbnail: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/05_Last_Frontier_Backgrounder_Series_Safety-510x340.jpg',
    description: 'How we keep you safe - Protocols and equipment',
  },
  {
    id: 'crew',
    episode: 6,
    title: 'The Crew',
    vimeoId: '256697044',
    thumbnail: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/06_Last_Frontier_Backgrounder_Series_The_Crew-510x340.jpg',
    description: "Who you'll meet - Guides, pilots, and staff",
  },
];

const _SS_FAQS = [
  {
    id: 'skill',
    question: 'How good do I have to be?',
    answer:
      "You should be a strong intermediate skier comfortable on ungroomed terrain. You don't need to be a pro, but you do need confident parallel turns and the ability to handle varied snow conditions. For Ripley Creek specifically, expert-level skills are required.",
  },
  {
    id: 'included',
    question: "What's included?",
    answer:
      'Your package includes helicopter access, certified guides, all meals, lodging, powder skis/poles, and complete safety equipment (transceivers, ABS airbags). You just need to bring your boots and outerwear.',
  },
  {
    id: 'safety',
    question: 'Is it safe?',
    answer:
      'Safety is our top priority. All guests are trained on avalanche equipment, travel with ACMG-certified guides, and carry ABS airbag systems. Our guides assess conditions daily and choose terrain accordingly.',
  },
  {
    id: 'day',
    question: 'What does a typical day look like?',
    answer:
      "After breakfast, you'll fly out around 8:30 AM. Expect 8-12 runs totaling 15,000-20,000+ vertical feet. Lunch is in the mountains. You're usually back at the lodge by 4 PM for hot tub, sauna, and dinner.",
  },
  {
    id: 'lodge',
    question: 'Which lodge should I choose?',
    answer:
      'Bell 2 Lodge is great for strong intermediate to expert skiers who want a remote, off-grid experience. Ripley Creek is for experts only - steeper terrain, 30% more snow, quirky historic town setting.',
  },
  {
    id: 'bring',
    question: 'What do I need to bring?',
    answer:
      'Your ski or snowboard boots, outerwear, thermal layers, goggles, helmet, gloves, and comfortable evening clothes. We provide powder skis, poles, and all safety equipment.',
  },
];

const _SS_RESOURCES = [
  {
    id: 'faq',
    title: 'FAQ for First-Timers',
    description: 'Comprehensive answers to common questions',
    url: 'https://lastfrontierheli.com/heliski-resource-guide/faq-first-time-heli-skiers/',
    icon: 'faq',
  },
  {
    id: 'prep',
    title: 'Is Heliskiing For Me?',
    description: 'Honest guide to skill and fitness requirements',
    url: 'https://lastfrontierheli.com/is-heliskiing-for-me/',
    icon: 'prep',
  },
  {
    id: 'youtube',
    title: 'YouTube Channel',
    description: 'More videos and guest footage',
    url: 'https://youtube.com/LastFrontierHeli1',
    icon: 'youtube',
  },
  {
    id: 'lodges',
    title: 'Compare Lodges',
    description: 'Bell 2 vs Ripley Creek in detail',
    url: 'https://lastfrontierheli.com/lodges/',
    icon: 'lodges',
  },
];

// ============================================================================
// SHARED SVGs
// ============================================================================

const _SS_CHEVRON_SVG = `<svg class="lfhbss-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

const _SS_ARROW_SVG = `<svg class="lfhbss-resource-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

const _SS_BACK_ARROW = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`;

// ============================================================================
// MODAL: Open
// ============================================================================

function openBrowserSelfServiceModal(initialTab) {
  if (document.getElementById('lfh-bss-modal')) return;

  initialTab = initialTab || 'videos';

  const C = LFH_COLORS_SS;
  const A = LFH_ASSETS_SS;

  // State
  var activeTab = initialTab;
  var currentVideoId = null;

  _ssSilentVariableUpdate('ext_last_action', 'browser_ss_opened');

  // --- Create Modal Shell ---
  var backdrop = document.createElement('div');
  backdrop.id = 'lfh-bss-modal';
  backdrop.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7); z-index: 10000;
    display: flex; justify-content: center; align-items: center;
    animation: lfhbss-fadeIn 0.3s ease;
  `;

  var modal = document.createElement('div');
  modal.id = 'lfh-bss-modal-inner';
  modal.style.cssText = `
    width: 90%; max-width: 960px; height: 85%; max-height: 780px;
    background: ${C.background}; border-radius: 12px;
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: lfhbss-slideUp 0.4s ease;
  `;

  // --- Inject Styles ---
  var styleEl = document.createElement('style');
  styleEl.textContent = _ssBuildModalStyles(C, A);
  modal.appendChild(styleEl);

  // --- Header Bar ---
  var headerBar = document.createElement('div');
  headerBar.className = 'lfhbss-header-bar';
  headerBar.innerHTML = `
    <div class="lfhbss-header-left">
      <img src="${A.logo}" alt="LFH" class="lfhbss-header-logo" />
      <span class="lfhbss-header-title">Discover Heliskiing</span>
    </div>
    <button class="lfhbss-close-btn" aria-label="Close">&times;</button>
  `;
  modal.appendChild(headerBar);

  // --- Tab Bar ---
  var tabBar = document.createElement('div');
  tabBar.className = 'lfhbss-tab-bar';
  tabBar.innerHTML = `
    <button class="lfhbss-tab ${activeTab === 'videos' ? 'active' : ''}" data-tab="videos">Videos</button>
    <button class="lfhbss-tab ${activeTab === 'faq' ? 'active' : ''}" data-tab="faq">FAQ</button>
    <button class="lfhbss-tab ${activeTab === 'resources' ? 'active' : ''}" data-tab="resources">Resources</button>
  `;
  modal.appendChild(tabBar);

  // --- Content Area ---
  var content = document.createElement('div');
  content.className = 'lfhbss-content';
  content.id = 'lfhbss-content';
  modal.appendChild(content);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // ========================================================================
  // TAB SWITCHING
  // ========================================================================

  function switchTab(tabName) {
    activeTab = tabName;
    currentVideoId = null;
    _ssSilentVariableUpdate('ext_current_tab', tabName);

    // Update tab buttons
    tabBar.querySelectorAll('.lfhbss-tab').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Render tab content
    if (tabName === 'videos') renderVideosTab();
    else if (tabName === 'faq') renderFaqTab();
    else if (tabName === 'resources') renderResourcesTab();
  }

  tabBar.addEventListener('click', function (e) {
    var tab = e.target.closest('.lfhbss-tab');
    if (tab && tab.dataset.tab) switchTab(tab.dataset.tab);
  });

  // ========================================================================
  // RENDER: Videos Tab
  // ========================================================================

  function renderVideosTab() {
    content.innerHTML = `
      <div class="lfhbss-section-header">
        <h3 class="lfhbss-section-title">Dig Deeper With Our Backgrounder Videos</h3>
        <p class="lfhbss-section-subtitle">6 episodes covering everything from location to crew</p>
      </div>
      <div class="lfhbss-video-grid" id="lfhbss-video-grid">
        ${_SS_VIDEOS.map(function (v) { return `
          <div class="lfhbss-video-card" data-video-id="${v.id}">
            <div class="lfhbss-video-thumb" style="background-image: url('${v.thumbnail}');">
              <span class="lfhbss-video-episode">Episode ${v.episode}</span>
              <div class="lfhbss-video-play"></div>
            </div>
            <div class="lfhbss-video-info">
              <p class="lfhbss-video-title">${v.title}</p>
              <p class="lfhbss-video-desc">${v.description}</p>
            </div>
          </div>
        `; }).join('')}
      </div>
      <div class="lfhbss-player" id="lfhbss-player">
        <button class="lfhbss-player-back" id="lfhbss-player-back">${_SS_BACK_ARROW} Back to all videos</button>
        <div class="lfhbss-player-frame" id="lfhbss-player-frame"></div>
        <h3 class="lfhbss-player-title" id="lfhbss-player-title"></h3>
        <p class="lfhbss-player-desc" id="lfhbss-player-desc"></p>
        <p class="lfhbss-related-label">Up Next</p>
        <div class="lfhbss-related-strip" id="lfhbss-related-strip"></div>
      </div>
    `;

    // Video card clicks
    content.querySelectorAll('.lfhbss-video-card').forEach(function (card) {
      card.addEventListener('click', function () { showVideoPlayer(card.dataset.videoId); });
    });

    // Back button
    content.querySelector('#lfhbss-player-back')?.addEventListener('click', hideVideoPlayer);
  }

  function showVideoPlayer(videoId) {
    var video = _SS_VIDEOS.find(function (v) { return v.id === videoId; });
    if (!video) return;

    currentVideoId = videoId;
    _ssSilentVariableUpdate('ext_video_played', videoId);

    // Hide grid, show player
    content.querySelector('#lfhbss-video-grid').style.display = 'none';
    content.querySelector('.lfhbss-section-header').style.display = 'none';
    var player = content.querySelector('#lfhbss-player');
    player.classList.add('active');

    // Set player content
    content.querySelector('#lfhbss-player-title').textContent = 'Episode ' + video.episode + ': ' + video.title;
    content.querySelector('#lfhbss-player-desc').textContent = video.description;
    content.querySelector('#lfhbss-player-frame').innerHTML = `
      <iframe
        src="https://player.vimeo.com/video/${video.vimeoId}?autoplay=1&title=0&byline=0&portrait=0"
        allow="autoplay; fullscreen"
        allowfullscreen>
      </iframe>
    `;

    // Related videos
    var related = _SS_VIDEOS.filter(function (v) { return v.id !== videoId; }).slice(0, 3);
    content.querySelector('#lfhbss-related-strip').innerHTML = related
      .map(function (v) { return `
        <div class="lfhbss-related-card" data-video-id="${v.id}" style="background-image: url('${v.thumbnail}');">
          <div class="lfhbss-related-card-overlay">
            <p class="lfhbss-related-card-episode">Ep ${v.episode}</p>
            <p class="lfhbss-related-card-title">${v.title}</p>
          </div>
        </div>
      `; })
      .join('');

    // Related video clicks
    content.querySelectorAll('.lfhbss-related-card').forEach(function (card) {
      card.addEventListener('click', function () { showVideoPlayer(card.dataset.videoId); });
    });
  }

  function hideVideoPlayer() {
    content.querySelector('#lfhbss-player-frame').innerHTML = '';
    content.querySelector('#lfhbss-player').classList.remove('active');
    content.querySelector('#lfhbss-video-grid').style.display = '';
    content.querySelector('.lfhbss-section-header').style.display = '';
    content.scrollTop = 0;
    currentVideoId = null;
  }

  // ========================================================================
  // RENDER: FAQ Tab
  // ========================================================================

  function renderFaqTab() {
    content.innerHTML = `
      <div class="lfhbss-section-header">
        <h3 class="lfhbss-section-title">Frequently Asked Questions</h3>
        <p class="lfhbss-section-subtitle">Quick answers to the most common questions about heliskiing</p>
      </div>
      <div class="lfhbss-faq-list">
        ${_SS_FAQS.map(function (f) { return `
          <div class="lfhbss-faq-item" data-faq-id="${f.id}">
            <button class="lfhbss-faq-question">
              <span>${f.question}</span>
              ${_SS_CHEVRON_SVG}
            </button>
            <div class="lfhbss-faq-answer">
              <div class="lfhbss-faq-answer-inner">${f.answer}</div>
            </div>
          </div>
        `; }).join('')}
      </div>
    `;

    // Accordion behavior
    content.querySelectorAll('.lfhbss-faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.lfhbss-faq-item');
        var wasExpanded = item.classList.contains('expanded');
        var answer = item.querySelector('.lfhbss-faq-answer');

        // Close all
        content.querySelectorAll('.lfhbss-faq-item.expanded').forEach(function (other) {
          other.classList.remove('expanded');
          other.querySelector('.lfhbss-faq-answer').style.maxHeight = '0';
        });

        // Toggle clicked (if wasn't already open)
        if (!wasExpanded) {
          item.classList.add('expanded');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // ========================================================================
  // RENDER: Resources Tab
  // ========================================================================

  function renderResourcesTab() {
    content.innerHTML = `
      <div class="lfhbss-section-header">
        <h3 class="lfhbss-section-title">Helpful Resources</h3>
        <p class="lfhbss-section-subtitle">Explore these links to learn more about heliskiing with Last Frontier</p>
      </div>
      <div class="lfhbss-resource-grid">
        ${_SS_RESOURCES.map(function (r) { return `
          <a class="lfhbss-resource-card" href="${r.url}" target="_blank" rel="noopener noreferrer">
            <div class="lfhbss-resource-icon">${_SS_RESOURCE_ICONS[r.icon]}</div>
            <div class="lfhbss-resource-body">
              <p class="lfhbss-resource-title">${r.title}</p>
              <p class="lfhbss-resource-desc">${r.description}</p>
            </div>
            ${_SS_ARROW_SVG}
          </a>
        `; }).join('')}
      </div>
    `;
  }

  // ========================================================================
  // CLOSE MODAL
  // ========================================================================

  function escHandler(e) {
    if (e.key === 'Escape' && document.getElementById('lfh-bss-modal')) {
      closeModal();
    }
  }

  function closeModal() {
    document.removeEventListener('keydown', escHandler);
    _ssInteractWithAgent('ext_modal_closed', { modal: 'browser_ss', lastTab: activeTab });

    backdrop.style.animation = 'lfhbss-fadeOut 0.3s ease forwards';
    setTimeout(function () {
      backdrop.remove();
    }, 300);
  }

  // Close handlers (3 ways)
  headerBar.querySelector('.lfhbss-close-btn')?.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', escHandler);

  // ========================================================================
  // RESPONSIVE: Full-screen on mobile
  // ========================================================================

  function _ssApplyResponsiveModal() {
    var width = window.innerWidth;
    if (width <= 500) {
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.maxWidth = 'none';
      modal.style.maxHeight = 'none';
      modal.style.borderRadius = '0';
    } else if (width <= 700) {
      modal.style.width = '95%';
      modal.style.height = '90%';
      modal.style.maxWidth = '960px';
      modal.style.maxHeight = '780px';
      modal.style.borderRadius = '12px';
    } else {
      modal.style.width = '90%';
      modal.style.height = '85%';
      modal.style.maxWidth = '960px';
      modal.style.maxHeight = '780px';
      modal.style.borderRadius = '12px';
    }
  }

  _ssApplyResponsiveModal();
  window.addEventListener('resize', _ssApplyResponsiveModal);

  // Clean up resize listener when modal is removed
  var observer = new MutationObserver(function () {
    if (!document.getElementById('lfh-bss-modal')) {
      window.removeEventListener('resize', _ssApplyResponsiveModal);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true });

  // ========================================================================
  // INITIAL RENDER
  // ========================================================================

  switchTab(activeTab);
}

// Register on namespace
window.__lfh.openSelfService = openBrowserSelfServiceModal;

// ============================================================================
// STYLES
// ============================================================================

function _ssBuildModalStyles(C, A) {
  return `
@font-face {
  font-family: 'Nexa Rust';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* Animations */
@keyframes lfhbss-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes lfhbss-fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes lfhbss-slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header Bar */
.lfhbss-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: ${C.textPrimary};
  flex-shrink: 0;
}
.lfhbss-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.lfhbss-header-logo {
  height: 28px;
  filter: brightness(0) invert(1);
}
.lfhbss-header-title {
  font-family: 'Nexa Rust', sans-serif;
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 0.5px;
}
.lfhbss-close-btn {
  background: none;
  border: none;
  color: #FFFFFF;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.lfhbss-close-btn:hover { opacity: 1; }

/* Tab Bar */
.lfhbss-tab-bar {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  background: ${C.infoBox};
  border-bottom: 1px solid ${C.border};
  flex-shrink: 0;
}
.lfhbss-tab {
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: ${C.textSecondary};
}
.lfhbss-tab:hover {
  background: rgba(0, 0, 0, 0.05);
}
.lfhbss-tab.active {
  background: ${C.primaryRed};
  color: #FFFFFF;
}

/* Content Area */
.lfhbss-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Section Header */
.lfhbss-section-header {
  margin-bottom: 20px;
}
.lfhbss-section-title {
  font-family: 'Nexa Rust', sans-serif;
  font-size: 16px;
  color: ${C.textPrimary};
  margin: 0 0 4px 0;
  letter-spacing: 0.3px;
}
.lfhbss-section-subtitle {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 13px;
  color: ${C.textSecondary};
  margin: 0;
}

/* ============================== */
/* VIDEOS TAB                     */
/* ============================== */

.lfhbss-video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.lfhbss-video-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: ${C.infoBox};
  transition: transform 0.2s, box-shadow 0.2s;
}
.lfhbss-video-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.lfhbss-video-thumb {
  position: relative;
  width: 100%;
  padding-top: 60%;
  background-size: cover;
  background-position: center;
}
.lfhbss-video-thumb::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url('${A.videoMask}') center/cover no-repeat;
  opacity: 0.6;
  pointer-events: none;
}
.lfhbss-video-play {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 40px; height: 40px;
  background: rgba(230, 43, 30, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.lfhbss-video-play::after {
  content: '';
  display: block;
  width: 0; height: 0;
  border-style: solid;
  border-width: 7px 0 7px 12px;
  border-color: transparent transparent transparent #FFFFFF;
  margin-left: 2px;
}
.lfhbss-video-episode {
  position: absolute;
  top: 8px; left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #FFFFFF;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  z-index: 1;
}
.lfhbss-video-info {
  padding: 10px 12px;
}
.lfhbss-video-title {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${C.textPrimary};
  margin: 0 0 4px 0;
}
.lfhbss-video-desc {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 12px;
  color: ${C.textSecondary};
  margin: 0;
  line-height: 1.4;
}

/* Video Player View */
.lfhbss-player {
  display: none;
}
.lfhbss-player.active {
  display: block;
}
.lfhbss-player-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${C.primaryRed};
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
}
.lfhbss-player-back:hover { text-decoration: underline; }
.lfhbss-player-frame {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}
.lfhbss-player-frame iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border: none;
}
.lfhbss-player-title {
  font-family: 'Nexa Rust', sans-serif;
  font-size: 16px;
  color: ${C.textPrimary};
  margin: 0 0 6px 0;
}
.lfhbss-player-desc {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 14px;
  color: ${C.textSecondary};
  margin: 0 0 20px 0;
  line-height: 1.5;
}
.lfhbss-related-label {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${C.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 10px 0;
}
.lfhbss-related-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}
.lfhbss-related-card {
  flex-shrink: 0;
  width: 140px;
  height: 85px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.lfhbss-related-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 60%;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
}
.lfhbss-related-card-overlay {
  position: absolute;
  bottom: 6px; left: 8px;
  z-index: 1;
}
.lfhbss-related-card-episode {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 10px;
  color: rgba(255,255,255,0.8);
  margin: 0;
}
.lfhbss-related-card-title {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
}

/* ============================== */
/* FAQ TAB                        */
/* ============================== */

.lfhbss-faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.lfhbss-faq-item {
  border: 1px solid ${C.border};
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.lfhbss-faq-item.expanded {
  border-color: ${C.primaryRed};
}
.lfhbss-faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: ${C.textPrimary};
  line-height: 1.4;
  transition: background 0.2s;
}
.lfhbss-faq-question:hover {
  background: ${C.infoBox};
}
.lfhbss-faq-chevron {
  flex-shrink: 0;
  width: 20px; height: 20px;
  transition: transform 0.3s;
  color: ${C.textSecondary};
}
.lfhbss-faq-item.expanded .lfhbss-faq-chevron {
  transform: rotate(180deg);
}
.lfhbss-faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.lfhbss-faq-answer-inner {
  padding: 0 16px 16px 16px;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 14px;
  color: ${C.textSecondary};
  line-height: 1.7;
}

/* ============================== */
/* RESOURCES TAB                  */
/* ============================== */

.lfhbss-resource-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.lfhbss-resource-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid ${C.border};
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.lfhbss-resource-card:hover {
  border-color: ${C.primaryRed};
  box-shadow: 0 2px 8px rgba(230, 43, 30, 0.1);
}
.lfhbss-resource-icon {
  flex-shrink: 0;
  width: 48px; height: 48px;
  color: ${C.primaryRed};
}
.lfhbss-resource-icon svg {
  width: 100%; height: 100%;
}
.lfhbss-resource-body {
  flex: 1;
  min-width: 0;
}
.lfhbss-resource-title {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${C.textPrimary};
  margin: 0 0 2px 0;
}
.lfhbss-resource-desc {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 13px;
  color: ${C.textSecondary};
  margin: 0;
}
.lfhbss-resource-arrow {
  flex-shrink: 0;
  width: 20px; height: 20px;
  color: ${C.textSecondary};
  transition: transform 0.2s;
}
.lfhbss-resource-card:hover .lfhbss-resource-arrow {
  transform: translateX(3px);
  color: ${C.primaryRed};
}

/* ============================== */
/* RESPONSIVE                     */
/* ============================== */

@media (max-width: 960px) {
  .lfhbss-video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 700px) {
  .lfhbss-resource-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 500px) {
  .lfhbss-video-grid {
    grid-template-columns: 1fr;
  }
  .lfhbss-tab-bar {
    padding: 10px 12px;
    gap: 6px;
  }
  .lfhbss-tab {
    font-size: 12px;
    padding: 5px 12px;
  }
  .lfhbss-content {
    padding: 16px;
  }
  .lfhbss-related-card {
    width: 120px;
    height: 72px;
  }
}
  `;
}
