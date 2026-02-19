/**
 * Last Frontier Browser Self-Service Widget v4.0
 * Unified Event Architecture
 *
 * Renders the full v3-style inline UI (header, tabs, video grid, FAQ accordion,
 * resource cards) inside the VoiceFlow chat. When the user interacts with any
 * content item (video card, FAQ question, resource link), the full-screen modal
 * opens to that tab for an expanded experience.
 *
 * Tab switching still works inline — only content interactions trigger the modal.
 *
 * @version 4.0.0-unified
 * @author Last Frontier Heliskiing / RomAIx
 */

import { LFH_COLORS, LFH_ASSETS, openBrowserSelfServiceModal } from './browser-self-service-v4-modal-unified.js';

// ============================================================================
// INLINE SVG ICONS FOR RESOURCES
// ============================================================================

const resourceIcons = {
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
// DATA (same as v3, needed for rendering inline preview)
// ============================================================================

const videos = [
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

const faqs = [
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

const resources = [
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
// EXTENSION REGISTRATION
// ============================================================================

export const LastFrontierBrowserSelfService_v4_Unified = {
  name: 'LastFrontierBrowserSelfService_v4_Unified',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_browserSelfService_v4_unified' ||
    trace.payload?.name === 'ext_browserSelfService_v4_unified',

  render: ({ trace, element }) => {
    const {
      formTitle = 'Discover Heliskiing',
      formSubtitle = 'Explore our videos, FAQs, and resources',
      initialTab = 'videos',
      animateIn = true,
    } = trace.payload || {};

    let currentTab = initialTab;

    element.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'lfh-ss-v4';

    if (animateIn) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(10px)';
      container.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // ==================================================================
    // STYLES & HTML (v3 layout, no logo)
    // ==================================================================

    container.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

@font-face {
  font-family: 'Nexa Rust Sans Black 2';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

.lfh-ss-v4 {
  width: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: ${LFH_COLORS.background};
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
}

.lfh-ss-v4 * {
  box-sizing: border-box;
}

/* ===== HEADER ===== */
.lfh-ss-v4-header {
  position: relative;
  background-image: url('${LFH_ASSETS.bgImage}');
  background-size: cover;
  background-position: center;
  text-align: center;
  overflow: hidden;
  padding: 24px 20px 28px 20px;
}

.lfh-ss-v4-header::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;
  z-index: 1;
}

.lfh-ss-v4-header-label {
  position: relative;
  z-index: 2;
  font-family: 'Nexa Rust Sans Black 2', 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: #FFFFFF;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.lfh-ss-v4-header-description {
  position: relative;
  z-index: 2;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.5;
  margin: 0;
  opacity: 0.95;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

/* ===== TAB NAVIGATION ===== */
.lfh-ss-v4-tabs {
  display: flex;
  background: ${LFH_COLORS.infoBox};
  border-bottom: 1px solid ${LFH_COLORS.border};
  padding: 0;
  margin: 0;
  list-style: none;
}

.lfh-ss-v4-tab {
  flex: 1;
  padding: 12px 8px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: ${LFH_COLORS.textSecondary};
  cursor: pointer;
  border: none;
  background: transparent;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lfh-ss-v4-tab:hover {
  background: #eee;
  color: ${LFH_COLORS.textPrimary};
}

.lfh-ss-v4-tab.active {
  color: ${LFH_COLORS.primaryRed};
  border-bottom-color: ${LFH_COLORS.primaryRed};
  background: ${LFH_COLORS.background};
}

/* ===== CONTENT AREA ===== */
.lfh-ss-v4-content {
  padding: 16px;
  max-height: 420px;
  overflow-y: auto;
  background: ${LFH_COLORS.background};
}

.lfh-ss-v4-panel {
  display: none;
  animation: lfh-ss-v4-fadeIn 0.3s ease-out;
}

.lfh-ss-v4-panel.active {
  display: block;
}

@keyframes lfh-ss-v4-fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== DIG DEEPER SECTION HEADER ===== */
.lfh-ss-v4-dig-deeper-header {
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${LFH_COLORS.border};
}

.lfh-ss-v4-dig-deeper-title {
  font-family: 'Nexa Rust Sans Black 2', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 900;
  color: ${LFH_COLORS.textPrimary};
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 6px 0;
}

.lfh-ss-v4-dig-deeper-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: ${LFH_COLORS.textSecondary};
  line-height: 1.5;
  margin: 0;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

/* ===== VIDEO GRID ===== */
.lfh-ss-v4-video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.lfh-ss-v4-video-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-size: cover;
  background-position: center;
  aspect-ratio: 16/10;
  border: 2px solid transparent;
}

.lfh-ss-v4-video-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url('${LFH_ASSETS.videoMask}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
  pointer-events: none;
}

.lfh-ss-v4-video-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: ${LFH_COLORS.primaryRed};
}

.lfh-ss-v4-video-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  padding: 24px 10px 10px;
  color: #fff;
  z-index: 2;
}

.lfh-ss-v4-video-episode {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 2px 0;
  opacity: 0.85;
}

.lfh-ss-v4-video-title {
  font-size: 12px;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.lfh-ss-v4-play-icon {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 40px; height: 40px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;
}

.lfh-ss-v4-video-card:hover .lfh-ss-v4-play-icon {
  transform: translate(-50%, -50%) scale(1.05);
  background: ${LFH_COLORS.primaryRed};
  border-color: ${LFH_COLORS.primaryRed};
  box-shadow: 0 4px 12px rgba(230, 43, 30, 0.5);
}

.lfh-ss-v4-play-icon::after {
  content: '';
  width: 0; height: 0;
  border-left: 12px solid #fff;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  margin-left: 3px;
}

/* ===== FAQ ACCORDION ===== */
.lfh-ss-v4-faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lfh-ss-v4-faq-item {
  border: 1.5px solid ${LFH_COLORS.border};
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease;
  cursor: pointer;
}

.lfh-ss-v4-faq-item:hover {
  border-color: #ccc;
}

.lfh-ss-v4-faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  background: ${LFH_COLORS.background};
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${LFH_COLORS.textPrimary};
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
}

.lfh-ss-v4-faq-question:hover {
  background: ${LFH_COLORS.infoBox};
}

.lfh-ss-v4-faq-icon {
  font-size: 16px;
  font-weight: 700;
  color: ${LFH_COLORS.primaryRed};
  flex-shrink: 0;
  margin-left: 10px;
}

/* ===== RESOURCES ===== */
.lfh-ss-v4-resources {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lfh-ss-v4-resource-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: ${LFH_COLORS.background};
  border: 1.5px solid ${LFH_COLORS.border};
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lfh-ss-v4-resource-card:hover {
  border-color: ${LFH_COLORS.primaryRed};
  border-left: 3px solid ${LFH_COLORS.primaryRed};
  background: ${LFH_COLORS.selectedTint};
}

.lfh-ss-v4-resource-icon {
  width: 36px; height: 36px;
  background: ${LFH_COLORS.primaryRed};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lfh-ss-v4-resource-icon svg {
  width: 18px; height: 18px;
  color: white;
}

.lfh-ss-v4-resource-info {
  flex: 1;
  min-width: 0;
}

.lfh-ss-v4-resource-title {
  font-size: 13px;
  font-weight: 600;
  color: ${LFH_COLORS.textPrimary};
  margin: 0 0 2px 0;
}

.lfh-ss-v4-resource-desc {
  font-size: 11px;
  color: ${LFH_COLORS.textSecondary};
  margin: 0;
}

.lfh-ss-v4-resource-arrow {
  color: ${LFH_COLORS.primaryRed};
  font-size: 16px;
  flex-shrink: 0;
}

/* ===== FOOTER ===== */
.lfh-ss-v4-footer {
  padding: 12px 16px;
  background: ${LFH_COLORS.infoBox};
  border-top: 1px solid ${LFH_COLORS.border};
  text-align: center;
}

.lfh-ss-v4-footer-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: ${LFH_COLORS.textSecondary};
  margin: 0;
}

.lfh-ss-v4-footer-text strong {
  color: ${LFH_COLORS.textPrimary};
  font-weight: 700;
}

/* ===== SCROLLBAR ===== */
.lfh-ss-v4-content::-webkit-scrollbar { width: 4px; }
.lfh-ss-v4-content::-webkit-scrollbar-track { background: ${LFH_COLORS.infoBox}; border-radius: 2px; }
.lfh-ss-v4-content::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 2px; }
.lfh-ss-v4-content::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
</style>

<!-- HEADER - Dark wood background, NO logo -->
<div class="lfh-ss-v4-header">
  <p class="lfh-ss-v4-header-label">${formTitle}</p>
  <p class="lfh-ss-v4-header-description">${formSubtitle}</p>
</div>

<!-- TAB NAVIGATION -->
<ul class="lfh-ss-v4-tabs" role="tablist">
  <li class="lfh-ss-v4-tab ${initialTab === 'videos' ? 'active' : ''}" role="tab" data-tab="videos">Videos</li>
  <li class="lfh-ss-v4-tab ${initialTab === 'faq' ? 'active' : ''}" role="tab" data-tab="faq">FAQ</li>
  <li class="lfh-ss-v4-tab ${initialTab === 'resources' ? 'active' : ''}" role="tab" data-tab="resources">Resources</li>
</ul>

<!-- CONTENT AREA -->
<div class="lfh-ss-v4-content">
  <!-- Videos Panel -->
  <div class="lfh-ss-v4-panel ${initialTab === 'videos' ? 'active' : ''}" data-panel="videos">
    <div class="lfh-ss-v4-dig-deeper-header">
      <h3 class="lfh-ss-v4-dig-deeper-title">Dig Deeper With Our Backgrounder Videos</h3>
      <p class="lfh-ss-v4-dig-deeper-subtitle">Discover more about who we are, what we do and how we do it in our six-part helicopter skiing mini-series.</p>
    </div>
    <div class="lfh-ss-v4-video-grid">
      ${videos
        .map(
          (video) => `
        <div class="lfh-ss-v4-video-card" data-video-id="${video.id}" style="background-image: url('${video.thumbnail}');">
          <div class="lfh-ss-v4-play-icon"></div>
          <div class="lfh-ss-v4-video-overlay">
            <p class="lfh-ss-v4-video-episode">Episode ${video.episode}</p>
            <p class="lfh-ss-v4-video-title">${video.title}</p>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  </div>

  <!-- FAQ Panel -->
  <div class="lfh-ss-v4-panel ${initialTab === 'faq' ? 'active' : ''}" data-panel="faq">
    <div class="lfh-ss-v4-faq-list">
      ${faqs
        .map(
          (faq) => `
        <div class="lfh-ss-v4-faq-item" data-faq="${faq.id}">
          <button class="lfh-ss-v4-faq-question">
            <span>${faq.question}</span>
            <span class="lfh-ss-v4-faq-icon">\u2192</span>
          </button>
        </div>
      `
        )
        .join('')}
    </div>
  </div>

  <!-- Resources Panel -->
  <div class="lfh-ss-v4-panel ${initialTab === 'resources' ? 'active' : ''}" data-panel="resources">
    <div class="lfh-ss-v4-resources">
      ${resources
        .map(
          (resource) => `
        <div class="lfh-ss-v4-resource-card" data-resource="${resource.id}">
          <div class="lfh-ss-v4-resource-icon">
            ${resourceIcons[resource.icon] || resourceIcons.faq}
          </div>
          <div class="lfh-ss-v4-resource-info">
            <p class="lfh-ss-v4-resource-title">${resource.title}</p>
            <p class="lfh-ss-v4-resource-desc">${resource.description}</p>
          </div>
          <span class="lfh-ss-v4-resource-arrow">\u2192</span>
        </div>
      `
        )
        .join('')}
    </div>
  </div>
</div>

<!-- FOOTER -->
<div class="lfh-ss-v4-footer">
  <p class="lfh-ss-v4-footer-text">Still have questions? <strong>Just ask!</strong></p>
</div>
`;

    element.appendChild(container);

    // ==================================================================
    // ANIMATE IN
    // ==================================================================

    if (animateIn) {
      setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 50);
    }

    // ==================================================================
    // EVENT HANDLERS
    // ==================================================================

    // Tab navigation (inline switching, same as v3)
    container.querySelectorAll('.lfh-ss-v4-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        // Update tabs
        container.querySelectorAll('.lfh-ss-v4-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        // Update panels
        container.querySelectorAll('.lfh-ss-v4-panel').forEach((p) => p.classList.remove('active'));
        container.querySelector(`[data-panel="${tabName}"]`)?.classList.add('active');

        currentTab = tabName;
      });
    });

    // Video card clicks → open modal to Videos tab
    container.addEventListener('click', (e) => {
      const videoCard = e.target.closest('.lfh-ss-v4-video-card');
      if (videoCard) {
        openBrowserSelfServiceModal('videos');
      }
    });

    // FAQ item clicks → open modal to FAQ tab
    container.querySelectorAll('.lfh-ss-v4-faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        openBrowserSelfServiceModal('faq');
      });
    });

    // Resource card clicks → open modal to Resources tab
    container.querySelectorAll('.lfh-ss-v4-resource-card').forEach((card) => {
      card.addEventListener('click', () => {
        openBrowserSelfServiceModal('resources');
      });
    });

    return function cleanup() {};
  },
};

export default LastFrontierBrowserSelfService_v4_Unified;
