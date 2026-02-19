/**
 * Last Frontier Tour Explorer - Shared Modal Module
 *
 * Full-screen overlay modal with filter bar, tour card grid,
 * compare mode, tour detail view with video embeds, and
 * VoiceFlow agent communication.
 *
 * Imported by all 3 in-chat widget variants (grid, carousel, tabs).
 *
 * @version 1.0.0
 * @author Last Frontier Heliskiing / RomAIx
 */

// ============================================================================
// TOUR DATA
// ============================================================================

export const LFH_TOURS = [
  {
    id: '4day',
    name: '4-Day Tour',
    subtitle: 'The Quick Getaway',
    description: 'Perfect for a focused heliski experience. Four days of world-class powder in the remote mountains of Northern BC, with a guaranteed 17,500 meters of vertical skiing. Ideal for those who want maximum adventure in a shorter timeframe.',
    lodges: ['bell2', 'ripley'],
    duration: '4 days',
    durationDays: 4,
    verticalGuarantee: '17,500m',
    pricing: {
      bell2: { early: null, peak: '$10,400 - $12,710', late: null },
      ripley: { early: null, peak: '$9,300 - $11,310', late: null },
    },
    priceFrom: 9300,
    skillLevel: 'Intermediate-Expert / Expert',
    heroImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2019/11/heliski-powder-tree-skiing.jpg',
    thumbnailImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/04_Last_Frontier_Backgrounder_Series_Day_In_The_Life-510x340.jpg',
    galleryImages: [
      'https://www.lastfrontierheli.com/wp-content/uploads/2019/11/heliski-powder-tree-skiing.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/01-bell-2-lodge-heliski-village.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/02-ripley-creek-inn-stewart.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2025/12/2025-12-08-Bell2-Emilie_Bowyer-14.jpg',
    ],
    videoId: '234398800',
    bestFor: ['Quick trip', 'First-timers', 'Budget-friendly'],
  },
  {
    id: '5day',
    name: '5-Day Tour',
    subtitle: 'The Sweet Spot',
    description: 'Our most popular package balancing time and value. Five days of helicopter skiing with a 22,000-meter vertical guarantee. Available year-round at both lodges, this tour gives you enough time to settle into the rhythm of mountain life.',
    lodges: ['bell2', 'ripley'],
    duration: '5 days',
    durationDays: 5,
    verticalGuarantee: '22,000m',
    pricing: {
      bell2: { early: '$11,800 - $14,010', peak: '$12,400 - $15,640', late: '$14,440' },
      ripley: { early: '$10,100 - $12,440', peak: '$11,000 - $13,890', late: '$10,700 - $12,840' },
    },
    priceFrom: 10100,
    skillLevel: 'Intermediate-Expert / Expert',
    heroImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2019/11/heli-skiing-Canada-adventure.jpg',
    thumbnailImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/01_Last_Frontier_Backgrounder_Series_Location-510x339.jpg',
    galleryImages: [
      'https://www.lastfrontierheli.com/wp-content/uploads/2019/11/heli-skiing-Canada-adventure.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/05-bell-2-lodge-dusk.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/04-guest-room-ripley-creek-inn.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2025/11/1-Canadian-Cam-2025-11-16.jpg',
    ],
    videoId: '247898299',
    bestFor: ['Most popular', 'Great value', 'Year-round'],
  },
  {
    id: '7day',
    name: '7-Day Tour',
    subtitle: 'The Full Experience',
    description: 'The flagship Last Frontier tour. Seven days of heliskiing with a 30,500-meter vertical guarantee delivers the full immersion — maximum skiing, deepest disconnect, and the complete mountain lifestyle. The longer you stay, the better it gets.',
    lodges: ['bell2', 'ripley'],
    duration: '7 days',
    durationDays: 7,
    verticalGuarantee: '30,500m',
    pricing: {
      bell2: { early: '$14,500 - $19,490', peak: '$20,980', late: null },
      ripley: { early: '$13,600 - $17,300', peak: '$14,500 - $18,630', late: null },
    },
    priceFrom: 13600,
    skillLevel: 'Intermediate-Expert / Expert',
    heroImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2019/11/huge-alpine-terrain-heliskiing.jpg',
    thumbnailImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/03_Last_Frontier_Backgrounder_Series_Terrain-496x350.jpg',
    galleryImages: [
      'https://www.lastfrontierheli.com/wp-content/uploads/2019/11/huge-alpine-terrain-heliskiing.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/06-dining-room-bell-2-lodge.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/08-outdoor-hot-tub-northern-bc.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2025/08/Last_Frontier_Dave_Silver_T13-2.jpg',
    ],
    videoId: '242847858',
    bestFor: ['Maximum skiing', 'Full immersion', 'Flagship tour'],
  },
  {
    id: 'safari7',
    name: '7-Day Safari',
    subtitle: 'Two Lodges, One Epic Journey',
    description: 'The flagship lodge-to-lodge safari links the high alpine glaciers of the Skeena Mountains (Bell 2) with the steep pitches and tall timber of the Coast Mountains (Ripley Creek). Midweek, power through heli lifts and travel 90km between lodges by helicopter.',
    lodges: ['both'],
    duration: '7 days',
    durationDays: 7,
    verticalGuarantee: '30,500m',
    pricing: {
      safari: { peak: '$20,130' },
    },
    priceFrom: 20130,
    skillLevel: 'Intermediate-Expert',
    heroImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/2-heli-skiing-safari-map-canada.jpg',
    thumbnailImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/02_Last_Frontier_Backgrounder_Series_Lodging-510x340.jpg',
    galleryImages: [
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/2-heli-skiing-safari-map-canada.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/2-bell-2-lodge-skeena-mountains-aerial-context.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2019/10/4-ripley-creek-stewart-bc-aerial-context2.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/04-bonfire-bell-2-lodge.jpg',
    ],
    videoId: '237992712',
    bestFor: ['Both lodges', 'Dual terrain', 'Ultimate variety'],
  },
  {
    id: 'safari10',
    name: '10-Day Safari',
    subtitle: 'The Ultimate Experience',
    description: 'The ultimate Last Frontier experience: five days at each lodge with a ground transfer in between. A 44,000-meter vertical guarantee delivers more skiing than most people get in years. This is the trip of a lifetime.',
    lodges: ['both'],
    duration: '10 days',
    durationDays: 10,
    verticalGuarantee: '44,000m',
    pricing: {
      safari: { peak: '$23,980' },
    },
    priceFrom: 23980,
    skillLevel: 'Intermediate-Expert',
    heroImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/1-largest-heli-skiing-area-Canada.jpg',
    thumbnailImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/06_Last_Frontier_Backgrounder_Series_The_Crew-510x340.jpg',
    galleryImages: [
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/1-largest-heli-skiing-area-Canada.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/01-bell-2-lodge-heliski-village.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/01-ocean-boardwalk-stewart-bc.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/05-dinner-dining-room-stewart.jpg',
    ],
    videoId: '256697044',
    bestFor: ['Trip of a lifetime', 'Maximum vertical', 'Both lodges'],
  },
  {
    id: 'private',
    name: 'Private Heli',
    subtitle: 'Your Helicopter, Your Rules',
    description: 'The most exclusive heliskiing concept: unlimited vertical with your own dedicated A-Star helicopter and two private ACMG-certified guides. You set the pace, plan your perfect day, and ski as much as you want. Includes private transfers and meet-and-greet.',
    lodges: ['bell2', 'ripley'],
    duration: '5-7 days',
    durationDays: 6,
    verticalGuarantee: 'Unlimited',
    pricing: {
      bell2: { early: 'From $89,570', peak: 'From $108,370' },
      ripley: { early: 'From $83,570', peak: 'From $99,910' },
    },
    priceFrom: 83570,
    skillLevel: 'Intermediate-Expert / Expert',
    heroImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/1-deep-alpine-heliski-british-columbia.jpg',
    thumbnailImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/05_Last_Frontier_Backgrounder_Series_Safety-510x340.jpg',
    galleryImages: [
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/1-deep-alpine-heliski-british-columbia.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2024/05/2024-03-28-Bell-2-Lodge-Steve-Rosset-3.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2019/11/remote-wilderness-heliski-village.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2026/01/2026-01-09-RC-Anne-Boeddinghaus-8.jpg',
    ],
    videoId: '251401988',
    bestFor: ['Exclusive groups', 'Unlimited vertical', 'VIP experience'],
  },
];

// ============================================================================
// SHARED CONSTANTS
// ============================================================================

export const LFH_COLORS = {
  primaryRed: '#e62b1e',
  textPrimary: '#42494e',
  textSecondary: '#666666',
  background: '#FFFFFF',
  infoBox: '#F5F5F5',
  border: '#E5E8EB',
  selectedTint: 'rgba(230, 43, 30, 0.04)',
};

export const LFH_ASSETS = {
  bgImage: 'https://yannicksegaar.github.io/RomAIx-Logo/LFH_bg_content_and_image_black.png',
  logo: 'https://yannicksegaar.github.io/RomAIx-Logo/LFH_Logo_FullName_White.svg',
  videoMask: 'https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/videos-img-mask.png',
};

export const LFH_VIDEOS = {
  dayInLife: { id: '247898299', title: 'A Day in the Life' },
  location: { id: '234398800', title: 'Location' },
  lodging: { id: '237992712', title: 'Lodging' },
  terrain: { id: '242847858', title: 'Terrain' },
  safety: { id: '251401988', title: 'Safety' },
  crew: { id: '256697044', title: 'The Crew' },
};

const INCLUDED_ITEMS = [
  'Accommodation at lodge',
  'All meals by professional chefs',
  'Certified mountain guides (ACMG/IFMGA)',
  'Avalanche safety equipment',
  'Ski and snowboard tuning',
  'Ground transfers from Terrace airport',
  'Small group skiing (max 4 guests/guide)',
];

// ============================================================================
// HELPER: Lodge display name
// ============================================================================

function lodgeName(id) {
  if (id === 'bell2') return 'Bell 2 Lodge';
  if (id === 'ripley') return 'Ripley Creek';
  if (id === 'both') return 'Both Lodges';
  if (id === 'safari') return 'Safari';
  return id;
}

function lodgeBadgeColor(lodges) {
  if (lodges.includes('both')) return '#8B6914';
  if (lodges.includes('ripley') && lodges.includes('bell2')) return LFH_COLORS.primaryRed;
  if (lodges.includes('ripley')) return '#2E7D32';
  return '#1565C0';
}

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

function interactWithAgent(type, payload) {
  try {
    if (window.voiceflow?.chat) {
      window.voiceflow.chat.interact({ type, payload });
    }
  } catch (e) {
    console.log('[TourExplorer] interact:', type, payload);
  }
}

// ============================================================================
// MODAL: Open
// ============================================================================

export function openTourExplorerModal(focusTourId = null) {
  if (document.getElementById('lfh-tour-explorer-modal')) return;

  // State
  let filteredTours = [...LFH_TOURS];
  let activeFilters = { lodge: 'all', duration: 'all', skill: 'all' };
  let compareTours = [];
  let currentView = 'grid'; // 'grid' | 'detail' | 'compare'
  let currentTourId = null;

  // --- Create Modal Shell ---
  const backdrop = document.createElement('div');
  backdrop.id = 'lfh-tour-explorer-modal';
  backdrop.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7); z-index: 10000;
    display: flex; justify-content: center; align-items: center;
    animation: lfhte-fadeIn 0.3s ease;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    width: 90%; max-width: 1000px; height: 85%; max-height: 800px;
    background: ${LFH_COLORS.background}; border-radius: 12px;
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: lfhte-slideUp 0.4s ease;
  `;

  // --- Inject Styles ---
  const styleEl = document.createElement('style');
  styleEl.textContent = buildModalStyles();
  modal.appendChild(styleEl);

  // --- Header Bar ---
  const headerBar = document.createElement('div');
  headerBar.className = 'lfhte-header-bar';
  headerBar.innerHTML = `
    <div class="lfhte-header-left">
      <img src="${LFH_ASSETS.logo}" alt="LFH" class="lfhte-header-logo" />
      <span class="lfhte-header-title">Tour Explorer</span>
    </div>
    <button class="lfhte-close-btn" aria-label="Close">&times;</button>
  `;
  modal.appendChild(headerBar);

  // --- Filter Bar ---
  const filterBar = document.createElement('div');
  filterBar.className = 'lfhte-filter-bar';
  filterBar.innerHTML = `
    <div class="lfhte-filters-row">
      <div class="lfhte-filter-group">
        <label>Lodge</label>
        <select id="lfhte-filter-lodge">
          <option value="all">All Lodges</option>
          <option value="bell2">Bell 2 Lodge</option>
          <option value="ripley">Ripley Creek</option>
          <option value="both">Safari (Both)</option>
        </select>
      </div>
      <div class="lfhte-filter-group">
        <label>Duration</label>
        <select id="lfhte-filter-duration">
          <option value="all">All Durations</option>
          <option value="4">4-Day</option>
          <option value="5">5-Day</option>
          <option value="7">7-Day</option>
          <option value="safari">Safari</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div class="lfhte-filter-group">
        <label>Skill Level</label>
        <select id="lfhte-filter-skill">
          <option value="all">All Levels</option>
          <option value="intermediate">Intermediate-Expert</option>
          <option value="expert">Expert Only</option>
        </select>
      </div>
      <span class="lfhte-results-count" id="lfhte-results-count">${LFH_TOURS.length} tours</span>
    </div>
  `;
  modal.appendChild(filterBar);

  // --- Main Content Area ---
  const content = document.createElement('div');
  content.className = 'lfhte-content';
  content.id = 'lfhte-content';
  modal.appendChild(content);

  // --- Compare Tray (initially hidden) ---
  const compareTray = document.createElement('div');
  compareTray.className = 'lfhte-compare-tray';
  compareTray.id = 'lfhte-compare-tray';
  compareTray.style.display = 'none';
  modal.appendChild(compareTray);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // --- Render Initial Grid ---
  renderTourGrid();

  // Focus on specific tour if requested
  if (focusTourId) {
    const tour = LFH_TOURS.find((t) => t.id === focusTourId);
    if (tour) {
      setTimeout(() => renderTourDetail(tour), 300);
    }
  }

  // Silent variable update
  silentVariableUpdate('ext_last_action', 'tour_explorer_opened');

  // ========================================================================
  // RENDER: Tour Grid
  // ========================================================================

  function renderTourGrid() {
    currentView = 'grid';
    const grid = document.createElement('div');
    grid.className = 'lfhte-tour-grid';

    if (filteredTours.length === 0) {
      grid.innerHTML = `
        <div class="lfhte-no-results">
          <div class="lfhte-no-results-icon">&#9968;</div>
          <p>No tours match your filters</p>
          <button class="lfhte-btn-outline" id="lfhte-clear-filters">Clear Filters</button>
        </div>
      `;
      content.innerHTML = '';
      content.appendChild(grid);
      content.querySelector('#lfhte-clear-filters')?.addEventListener('click', () => {
        activeFilters = { lodge: 'all', duration: 'all', skill: 'all' };
        modal.querySelector('#lfhte-filter-lodge').value = 'all';
        modal.querySelector('#lfhte-filter-duration').value = 'all';
        modal.querySelector('#lfhte-filter-skill').value = 'all';
        applyFilters();
      });
      return;
    }

    filteredTours.forEach((tour) => {
      const card = document.createElement('div');
      card.className = 'lfhte-tour-card';
      const isComparing = compareTours.includes(tour.id);
      const lodgeBadges = tour.lodges
        .map((l) => `<span class="lfhte-lodge-badge" style="background:${lodgeBadgeColor(tour.lodges)}">${lodgeName(l)}</span>`)
        .join('');
      const priceDisplay = `From $${tour.priceFrom.toLocaleString()} CAD`;

      card.innerHTML = `
        <div class="lfhte-card-image" style="background-image: url('${tour.heroImage}')">
          <div class="lfhte-card-badges">${lodgeBadges}</div>
        </div>
        <div class="lfhte-card-body">
          <h3 class="lfhte-card-title">${tour.name}</h3>
          <div class="lfhte-card-stats">
            <span>${tour.duration}</span>
            <span class="lfhte-stat-divider">|</span>
            <span>${tour.verticalGuarantee}</span>
            <span class="lfhte-stat-divider">|</span>
            <span>4 guests/guide</span>
          </div>
          <p class="lfhte-card-price">${priceDisplay}</p>
          <p class="lfhte-card-desc">${tour.description.substring(0, 100)}...</p>
          <div class="lfhte-card-actions">
            <button class="lfhte-btn-outline lfhte-compare-toggle ${isComparing ? 'active' : ''}" data-tour-id="${tour.id}">
              ${isComparing ? '&#10003; Comparing' : 'Compare'}
            </button>
            <button class="lfhte-btn-primary lfhte-view-detail" data-tour-id="${tour.id}">View Details</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    content.innerHTML = '';
    content.appendChild(grid);

    // Attach event listeners
    content.querySelectorAll('.lfhte-view-detail').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tour = LFH_TOURS.find((t) => t.id === btn.dataset.tourId);
        if (tour) renderTourDetail(tour);
      });
    });

    content.querySelectorAll('.lfhte-compare-toggle').forEach((btn) => {
      btn.addEventListener('click', () => toggleCompare(btn.dataset.tourId));
    });
  }

  // ========================================================================
  // RENDER: Tour Detail
  // ========================================================================

  function renderTourDetail(tour) {
    currentView = 'detail';
    currentTourId = tour.id;
    silentVariableUpdate('ext_current_tour', tour.id);

    const detail = document.createElement('div');
    detail.className = 'lfhte-detail';

    // Look up video title from LFH_VIDEOS
    const videoEntry = Object.values(LFH_VIDEOS).find((v) => v.id === tour.videoId);
    const videoTitle = videoEntry ? videoEntry.title : 'A Day in the Life';

    // Pricing table rows
    let pricingRows = '';
    if (tour.pricing.safari) {
      pricingRows = `<tr><td>Safari Rate</td><td>${tour.pricing.safari.peak || '—'}</td></tr>`;
    } else {
      const lodgeKeys = Object.keys(tour.pricing);
      lodgeKeys.forEach((key) => {
        const p = tour.pricing[key];
        pricingRows += `
          <tr>
            <td><strong>${lodgeName(key)}</strong></td>
            <td>${p.early || '—'}</td>
            <td>${p.peak || '—'}</td>
            <td>${p.late || '—'}</td>
          </tr>
        `;
      });
    }

    const pricingHeader = tour.pricing.safari
      ? '<tr><th>Rate Type</th><th>Peak Season</th></tr>'
      : '<tr><th>Lodge</th><th>Early (Dec-Jan)</th><th>Peak (Feb-Mar)</th><th>Late (Apr)</th></tr>';

    // Gallery strip
    const galleryHTML = tour.galleryImages
      .map(
        (img, i) => `
        <div class="lfhte-gallery-thumb" style="background-image: url('${img}')" data-index="${i}"></div>
      `
      )
      .join('');

    // Included items
    const includedHTML = INCLUDED_ITEMS.map(
      (item) => `<div class="lfhte-included-item"><span class="lfhte-check-icon">&#10003;</span> ${item}</div>`
    ).join('');

    // Best for badges
    const bestForHTML = tour.bestFor
      .map((bf) => `<span class="lfhte-best-for-badge">${bf}</span>`)
      .join('');

    detail.innerHTML = `
      <div class="lfhte-detail-header">
        <button class="lfhte-back-btn" id="lfhte-back-to-grid">&larr; All Tours</button>
        <h2 class="lfhte-detail-title">${tour.name}</h2>
        <span class="lfhte-detail-subtitle">${tour.subtitle}</span>
      </div>

      <div class="lfhte-detail-scroll">
        <!-- Hero Media -->
        <div class="lfhte-hero-media" id="lfhte-hero-media">
          <div class="lfhte-hero-image" style="background-image: url('${tour.heroImage}')">
            <button class="lfhte-play-btn" id="lfhte-play-video" data-vimeo="${tour.videoId}">
              <span class="lfhte-play-triangle"></span>
            </button>
            <div class="lfhte-hero-label">Watch: ${videoTitle}</div>
          </div>
        </div>

        <!-- Gallery Strip -->
        <div class="lfhte-gallery-strip">${galleryHTML}</div>

        <!-- Description -->
        <div class="lfhte-detail-section">
          <p class="lfhte-full-desc">${tour.description}</p>
          <div class="lfhte-best-for">${bestForHTML}</div>
        </div>

        <!-- Quick Stats -->
        <div class="lfhte-stats-bar">
          <div class="lfhte-stat-box">
            <div class="lfhte-stat-value">${tour.duration}</div>
            <div class="lfhte-stat-label">Duration</div>
          </div>
          <div class="lfhte-stat-box">
            <div class="lfhte-stat-value">${tour.verticalGuarantee}</div>
            <div class="lfhte-stat-label">Vertical Guarantee</div>
          </div>
          <div class="lfhte-stat-box">
            <div class="lfhte-stat-value">${tour.skillLevel.replace(' / Expert', '')}</div>
            <div class="lfhte-stat-label">Skill Level</div>
          </div>
          <div class="lfhte-stat-box">
            <div class="lfhte-stat-value">4:1</div>
            <div class="lfhte-stat-label">Guest:Guide</div>
          </div>
        </div>

        <!-- Pricing Table -->
        <div class="lfhte-detail-section">
          <h3 class="lfhte-section-title">Pricing (CAD per person)</h3>
          <table class="lfhte-pricing-table">
            <thead>${pricingHeader}</thead>
            <tbody>${pricingRows}</tbody>
          </table>
          <p class="lfhte-pricing-note">5% GST applies. 20% deposit to confirm. Extra vertical: $210/1,000m.</p>
        </div>

        <!-- What's Included -->
        <div class="lfhte-detail-section">
          <h3 class="lfhte-section-title">What's Included</h3>
          <div class="lfhte-included-grid">${includedHTML}</div>
        </div>

        <!-- Action Buttons -->
        <div class="lfhte-detail-actions">
          <button class="lfhte-btn-primary lfhte-action-book" data-tour-id="${tour.id}">I Want to Book</button>
          <button class="lfhte-btn-outline lfhte-action-ask" data-tour-id="${tour.id}">Ask About This Tour</button>
          <button class="lfhte-btn-text lfhte-back-link" id="lfhte-back-link">Back to All Tours</button>
        </div>
      </div>
    `;

    content.innerHTML = '';
    content.appendChild(detail);

    // Event Listeners
    detail.querySelector('#lfhte-back-to-grid')?.addEventListener('click', renderTourGrid);
    detail.querySelector('#lfhte-back-link')?.addEventListener('click', renderTourGrid);

    // Gallery thumbnail click → swap hero image
    detail.querySelectorAll('.lfhte-gallery-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.index);
        const heroMedia = detail.querySelector('#lfhte-hero-media');
        heroMedia.innerHTML = `
          <div class="lfhte-hero-image" style="background-image: url('${tour.galleryImages[idx]}')">
            <button class="lfhte-play-btn" id="lfhte-play-video" data-vimeo="${tour.videoId}">
              <span class="lfhte-play-triangle"></span>
            </button>
            <div class="lfhte-hero-label">Watch: ${videoTitle}</div>
          </div>
        `;
        // Re-attach play button listener
        heroMedia.querySelector('#lfhte-play-video')?.addEventListener('click', (e) => {
          const vimeoId = e.currentTarget.dataset.vimeo;
          heroMedia.innerHTML = `
            <div class="lfhte-video-embed">
              <iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0"
                allow="autoplay; fullscreen" allowfullscreen></iframe>
            </div>
          `;
        });
        // Highlight active thumbnail
        detail.querySelectorAll('.lfhte-gallery-thumb').forEach((t) => (t.style.borderColor = 'transparent'));
        thumb.style.borderColor = LFH_COLORS.primaryRed;
      });
    });

    detail.querySelector('#lfhte-play-video')?.addEventListener('click', (e) => {
      const vimeoId = e.currentTarget.dataset.vimeo;
      const heroMedia = detail.querySelector('#lfhte-hero-media');
      heroMedia.innerHTML = `
        <div class="lfhte-video-embed">
          <iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0"
            allow="autoplay; fullscreen" allowfullscreen></iframe>
        </div>
      `;
    });

    detail.querySelector('.lfhte-action-book')?.addEventListener('click', () => {
      const priceRange = tour.pricing.safari
        ? tour.pricing.safari.peak
        : `From $${tour.priceFrom.toLocaleString()}`;
      interactWithAgent('booking_intent', {
        tourId: tour.id,
        tourName: tour.name,
        lodge: tour.lodges.join(', '),
        priceRange,
      });
      closeModal();
    });

    detail.querySelector('.lfhte-action-ask')?.addEventListener('click', () => {
      interactWithAgent('tour_inquiry', {
        tourId: tour.id,
        tourName: tour.name,
        lodge: tour.lodges.join(', '),
        duration: tour.duration,
      });
      closeModal();
    });
  }

  // ========================================================================
  // RENDER: Compare View
  // ========================================================================

  function renderCompareView() {
    currentView = 'compare';
    const tours = compareTours.map((id) => LFH_TOURS.find((t) => t.id === id)).filter(Boolean);

    silentVariableUpdate('ext_tours_compared', compareTours.join(','));

    const compare = document.createElement('div');
    compare.className = 'lfhte-compare';

    const headerCells = tours.map((t) => `<th class="lfhte-compare-th"><div class="lfhte-compare-tour-name">${t.name}</div><div class="lfhte-compare-tour-sub">${t.subtitle}</div></th>`).join('');

    const rows = [
      { label: 'Duration', fn: (t) => t.duration },
      { label: 'Vertical Guarantee', fn: (t) => t.verticalGuarantee },
      { label: 'Lodges', fn: (t) => t.lodges.map(lodgeName).join(' & ') },
      { label: 'Skill Level', fn: (t) => t.skillLevel },
      { label: 'Starting Price', fn: (t) => `$${t.priceFrom.toLocaleString()} CAD` },
      { label: 'Best For', fn: (t) => t.bestFor.join(', ') },
    ];

    const rowsHTML = rows
      .map(
        (row) =>
          `<tr><td class="lfhte-compare-label">${row.label}</td>${tours.map((t) => `<td>${row.fn(t)}</td>`).join('')}</tr>`
      )
      .join('');

    compare.innerHTML = `
      <div class="lfhte-compare-header">
        <button class="lfhte-back-btn" id="lfhte-compare-back">&larr; Back to Tours</button>
        <h2 class="lfhte-compare-title">Comparing ${tours.length} Tours</h2>
      </div>
      <div class="lfhte-compare-scroll">
        <table class="lfhte-compare-table">
          <thead><tr><th></th>${headerCells}</tr></thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
      <div class="lfhte-compare-actions">
        <button class="lfhte-btn-outline" id="lfhte-compare-clear">Clear Comparison</button>
      </div>
    `;

    content.innerHTML = '';
    content.appendChild(compare);

    compare.querySelector('#lfhte-compare-back')?.addEventListener('click', renderTourGrid);
    compare.querySelector('#lfhte-compare-clear')?.addEventListener('click', () => {
      compareTours = [];
      updateCompareTray();
      renderTourGrid();
    });
  }

  // ========================================================================
  // COMPARE: Toggle & Tray
  // ========================================================================

  function toggleCompare(tourId) {
    const idx = compareTours.indexOf(tourId);
    if (idx >= 0) {
      compareTours.splice(idx, 1);
    } else if (compareTours.length < 3) {
      compareTours.push(tourId);
    }
    updateCompareTray();
    if (currentView === 'grid') renderTourGrid();
  }

  function updateCompareTray() {
    if (compareTours.length < 2) {
      compareTray.style.display = 'none';
      return;
    }

    compareTray.style.display = 'flex';
    const thumbs = compareTours
      .map((id) => {
        const t = LFH_TOURS.find((tour) => tour.id === id);
        return t
          ? `<div class="lfhte-tray-thumb">
               <div class="lfhte-tray-img" style="background-image:url('${t.thumbnailImage}')"></div>
               <span>${t.name}</span>
               <button class="lfhte-tray-remove" data-tour-id="${id}">&times;</button>
             </div>`
          : '';
      })
      .join('');

    compareTray.innerHTML = `
      <div class="lfhte-tray-tours">${thumbs}</div>
      <button class="lfhte-btn-primary lfhte-tray-compare-btn">Compare ${compareTours.length} Tours</button>
    `;

    compareTray.querySelectorAll('.lfhte-tray-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCompare(btn.dataset.tourId);
      });
    });

    compareTray.querySelector('.lfhte-tray-compare-btn')?.addEventListener('click', renderCompareView);
  }

  // ========================================================================
  // FILTERS
  // ========================================================================

  function applyFilters() {
    filteredTours = LFH_TOURS.filter((tour) => {
      // Lodge filter
      if (activeFilters.lodge !== 'all') {
        if (activeFilters.lodge === 'both') {
          if (!tour.lodges.includes('both')) return false;
        } else {
          if (!tour.lodges.includes(activeFilters.lodge) && !tour.lodges.includes('both')) return false;
        }
      }

      // Duration filter
      if (activeFilters.duration !== 'all') {
        if (activeFilters.duration === 'safari') {
          if (!tour.id.startsWith('safari')) return false;
        } else if (activeFilters.duration === 'private') {
          if (tour.id !== 'private') return false;
        } else {
          if (tour.durationDays !== parseInt(activeFilters.duration)) return false;
        }
      }

      // Skill filter
      if (activeFilters.skill !== 'all') {
        if (activeFilters.skill === 'expert' && !tour.skillLevel.includes('Expert')) return false;
        if (activeFilters.skill === 'intermediate' && tour.skillLevel === 'Expert Only') return false;
      }

      return true;
    });

    silentVariableUpdate('ext_filters_applied', JSON.stringify(activeFilters));
    modal.querySelector('#lfhte-results-count').textContent = `${filteredTours.length} tour${filteredTours.length !== 1 ? 's' : ''}`;
    renderTourGrid();
  }

  // Filter event listeners
  modal.querySelector('#lfhte-filter-lodge')?.addEventListener('change', (e) => {
    activeFilters.lodge = e.target.value;
    silentVariableUpdate('ext_current_lodge', e.target.value);
    applyFilters();
  });

  modal.querySelector('#lfhte-filter-duration')?.addEventListener('change', (e) => {
    activeFilters.duration = e.target.value;
    applyFilters();
  });

  modal.querySelector('#lfhte-filter-skill')?.addEventListener('change', (e) => {
    activeFilters.skill = e.target.value;
    applyFilters();
  });

  // ========================================================================
  // CLOSE MODAL
  // ========================================================================

  function closeModal() {
    interactWithAgent('tour_explorer_closed', {
      lastViewed: currentTourId,
      toursCompared: compareTours,
    });

    backdrop.style.animation = 'lfhte-fadeOut 0.3s ease forwards';
    setTimeout(() => {
      backdrop.remove();
    }, 300);
  }

  // Close handlers
  headerBar.querySelector('.lfhte-close-btn')?.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape' && document.getElementById('lfh-tour-explorer-modal')) {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
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
@keyframes lfhte-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes lfhte-fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes lfhte-slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header Bar */
.lfhte-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; background: ${LFH_COLORS.textPrimary};
  flex-shrink: 0;
}
.lfhte-header-left { display: flex; align-items: center; gap: 12px; }
.lfhte-header-logo { height: 28px; filter: brightness(0) invert(1); }
.lfhte-header-title {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 16px; font-weight: 900; color: #fff;
  text-transform: uppercase; letter-spacing: 2px;
}
.lfhte-close-btn {
  background: transparent; border: none; color: #fff;
  font-size: 28px; cursor: pointer; padding: 0;
  width: 36px; height: 36px; display: flex;
  align-items: center; justify-content: center;
  border-radius: 50%; transition: background 0.2s;
}
.lfhte-close-btn:hover { background: rgba(255,255,255,0.15); }

/* Filter Bar */
.lfhte-filter-bar {
  padding: 12px 20px; background: ${LFH_COLORS.infoBox};
  border-bottom: 1px solid ${LFH_COLORS.border}; flex-shrink: 0;
}
.lfhte-filters-row {
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
}
.lfhte-filter-group { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 130px; }
.lfhte-filter-group label {
  font-family: 'Inter', sans-serif; font-size: 10px;
  font-weight: 700; color: ${LFH_COLORS.textSecondary};
  text-transform: uppercase; letter-spacing: 0.5px;
}
.lfhte-filter-group select {
  padding: 8px 10px; border: 1px solid ${LFH_COLORS.border};
  border-radius: 6px; font-family: 'Inter', sans-serif;
  font-size: 12px; color: ${LFH_COLORS.textPrimary};
  background: #fff; cursor: pointer; outline: none;
}
.lfhte-filter-group select:focus { border-color: ${LFH_COLORS.primaryRed}; }
.lfhte-results-count {
  font-family: 'Inter', sans-serif; font-size: 12px;
  font-weight: 600; color: ${LFH_COLORS.textSecondary};
  white-space: nowrap; margin-left: auto;
}

/* Content Area */
.lfhte-content {
  flex: 1; overflow-y: auto; padding: 20px;
  font-family: 'Inter', sans-serif;
}
.lfhte-content::-webkit-scrollbar { width: 6px; }
.lfhte-content::-webkit-scrollbar-track { background: ${LFH_COLORS.infoBox}; }
.lfhte-content::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 3px; }

/* Tour Grid */
.lfhte-tour-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
}
@media (max-width: 700px) {
  .lfhte-tour-grid { grid-template-columns: 1fr; }
}

/* Tour Card */
.lfhte-tour-card {
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 10px;
  overflow: hidden; transition: all 0.2s ease;
  background: #fff;
}
.lfhte-tour-card:hover {
  border-color: ${LFH_COLORS.primaryRed};
  box-shadow: 0 4px 16px rgba(230, 43, 30, 0.1);
}
.lfhte-card-image {
  height: 160px; background-size: cover;
  background-position: center; position: relative;
}
.lfhte-card-badges {
  position: absolute; top: 10px; right: 10px;
  display: flex; gap: 6px; flex-wrap: wrap;
}
.lfhte-lodge-badge {
  padding: 4px 10px; border-radius: 20px;
  font-size: 10px; font-weight: 600; color: #fff;
  text-transform: uppercase; letter-spacing: 0.3px;
}
.lfhte-card-body { padding: 14px; }
.lfhte-card-title {
  font-size: 16px; font-weight: 700;
  color: ${LFH_COLORS.primaryRed}; margin: 0 0 8px;
}
.lfhte-card-stats {
  font-size: 11px; color: ${LFH_COLORS.textSecondary};
  margin-bottom: 6px;
}
.lfhte-stat-divider { margin: 0 6px; opacity: 0.4; }
.lfhte-card-price {
  font-size: 14px; font-weight: 700;
  color: ${LFH_COLORS.textPrimary}; margin: 0 0 8px;
}
.lfhte-card-desc {
  font-size: 12px; color: ${LFH_COLORS.textSecondary};
  line-height: 1.5; margin: 0 0 12px;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.lfhte-card-actions { display: flex; gap: 8px; }

/* Buttons */
.lfhte-btn-primary {
  flex: 1; padding: 10px 16px;
  background: ${LFH_COLORS.primaryRed}; color: #fff;
  border: none; border-radius: 6px; font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.2s; text-align: center;
}
.lfhte-btn-primary:hover { background: #c4221a; transform: translateY(-1px); }
.lfhte-btn-outline {
  flex: 1; padding: 10px 16px;
  background: #fff; color: ${LFH_COLORS.textPrimary};
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 6px;
  font-family: 'Inter', sans-serif; font-size: 12px;
  font-weight: 600; cursor: pointer; transition: all 0.2s;
  text-align: center;
}
.lfhte-btn-outline:hover {
  border-color: ${LFH_COLORS.primaryRed};
  color: ${LFH_COLORS.primaryRed};
}
.lfhte-btn-outline.active {
  background: ${LFH_COLORS.selectedTint};
  border-color: ${LFH_COLORS.primaryRed};
  color: ${LFH_COLORS.primaryRed};
}
.lfhte-btn-text {
  background: transparent; border: none;
  color: ${LFH_COLORS.textSecondary}; font-family: 'Inter', sans-serif;
  font-size: 12px; cursor: pointer; padding: 8px;
  transition: color 0.2s;
}
.lfhte-btn-text:hover { color: ${LFH_COLORS.primaryRed}; }

/* No Results */
.lfhte-no-results {
  grid-column: 1 / -1; text-align: center; padding: 60px 20px;
}
.lfhte-no-results-icon { font-size: 48px; margin-bottom: 12px; }
.lfhte-no-results p {
  font-size: 16px; color: ${LFH_COLORS.textSecondary}; margin-bottom: 16px;
}

/* Detail View */
.lfhte-detail { display: flex; flex-direction: column; height: 100%; }
.lfhte-detail-header {
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
}
.lfhte-back-btn {
  background: ${LFH_COLORS.infoBox}; border: 1px solid ${LFH_COLORS.border};
  border-radius: 6px; padding: 8px 14px;
  font-family: 'Inter', sans-serif; font-size: 11px;
  font-weight: 700; color: ${LFH_COLORS.textSecondary};
  cursor: pointer; transition: all 0.2s; text-transform: uppercase;
}
.lfhte-back-btn:hover {
  background: #eee; border-color: ${LFH_COLORS.primaryRed};
  color: ${LFH_COLORS.textPrimary};
}
.lfhte-detail-title {
  font-size: 22px; font-weight: 900; color: ${LFH_COLORS.textPrimary};
  margin: 0; font-family: 'Nexa Rust Sans Black 2', sans-serif;
  text-transform: uppercase; letter-spacing: 1px;
}
.lfhte-detail-subtitle {
  font-size: 13px; color: ${LFH_COLORS.textSecondary}; font-style: italic;
}
.lfhte-detail-scroll { flex: 1; overflow-y: auto; }

/* Hero Media */
.lfhte-hero-media { margin-bottom: 12px; }
.lfhte-hero-image {
  width: 100%; height: 280px; background-size: cover;
  background-position: center; border-radius: 10px;
  position: relative; display: flex;
  align-items: center; justify-content: center; cursor: pointer;
}
.lfhte-hero-image::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(transparent 50%, rgba(0,0,0,0.6));
  border-radius: 10px; pointer-events: none;
}
.lfhte-play-btn {
  position: relative; z-index: 2;
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(255,255,255,0.9); border: none;
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; transition: all 0.2s;
}
.lfhte-play-btn:hover {
  background: ${LFH_COLORS.primaryRed}; transform: scale(1.1);
}
.lfhte-play-btn:hover .lfhte-play-triangle {
  border-left-color: #fff;
}
.lfhte-play-triangle {
  width: 0; height: 0;
  border-left: 18px solid ${LFH_COLORS.textPrimary};
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  margin-left: 4px; transition: border-color 0.2s;
}
.lfhte-hero-label {
  position: absolute; bottom: 14px; left: 14px; z-index: 2;
  color: #fff; font-size: 12px; font-weight: 600;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}
.lfhte-video-embed {
  width: 100%; aspect-ratio: 16/9; border-radius: 10px;
  overflow: hidden; background: #000;
}
.lfhte-video-embed iframe { width: 100%; height: 100%; border: none; }

/* Gallery Strip */
.lfhte-gallery-strip {
  display: flex; gap: 8px; overflow-x: auto;
  padding-bottom: 8px; margin-bottom: 16px;
}
.lfhte-gallery-strip::-webkit-scrollbar { height: 4px; }
.lfhte-gallery-strip::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 2px; }
.lfhte-gallery-thumb {
  flex: 0 0 120px; height: 80px; border-radius: 8px;
  background-size: cover; background-position: center;
  border: 2px solid transparent; cursor: pointer; transition: all 0.2s;
}
.lfhte-gallery-thumb:hover { border-color: ${LFH_COLORS.primaryRed}; }

/* Detail Sections */
.lfhte-detail-section { margin-bottom: 20px; }
.lfhte-section-title {
  font-size: 14px; font-weight: 700; color: ${LFH_COLORS.textPrimary};
  margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px;
}
.lfhte-full-desc {
  font-size: 13px; line-height: 1.7; color: ${LFH_COLORS.textPrimary}; margin: 0 0 12px;
}
.lfhte-best-for { display: flex; gap: 6px; flex-wrap: wrap; }
.lfhte-best-for-badge {
  padding: 4px 12px; background: ${LFH_COLORS.infoBox};
  border: 1px solid ${LFH_COLORS.border}; border-radius: 20px;
  font-size: 11px; font-weight: 600; color: ${LFH_COLORS.textSecondary};
}

/* Stats Bar */
.lfhte-stats-bar {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  margin-bottom: 20px;
}
.lfhte-stat-box {
  text-align: center; padding: 12px 8px;
  background: ${LFH_COLORS.infoBox}; border-radius: 8px;
}
.lfhte-stat-value {
  font-size: 14px; font-weight: 700; color: ${LFH_COLORS.primaryRed};
  margin-bottom: 2px;
}
.lfhte-stat-label {
  font-size: 10px; color: ${LFH_COLORS.textSecondary};
  text-transform: uppercase; letter-spacing: 0.3px;
}

/* Pricing Table */
.lfhte-pricing-table {
  width: 100%; border-collapse: collapse; font-size: 12px;
}
.lfhte-pricing-table th {
  padding: 10px 8px; background: ${LFH_COLORS.textPrimary};
  color: #fff; text-align: left; font-weight: 600;
  font-size: 11px; text-transform: uppercase;
}
.lfhte-pricing-table td {
  padding: 10px 8px; border-bottom: 1px solid ${LFH_COLORS.border};
  color: ${LFH_COLORS.textPrimary};
}
.lfhte-pricing-table tbody tr:hover { background: ${LFH_COLORS.selectedTint}; }
.lfhte-pricing-note {
  font-size: 11px; color: ${LFH_COLORS.textSecondary};
  margin-top: 8px; font-style: italic;
}

/* Included Grid */
.lfhte-included-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
}
.lfhte-included-item {
  font-size: 12px; color: ${LFH_COLORS.textPrimary};
  display: flex; align-items: center; gap: 6px;
}
.lfhte-check-icon { color: #2E7D32; font-weight: 700; }

/* Detail Actions */
.lfhte-detail-actions {
  display: flex; gap: 10px; align-items: center;
  padding: 16px 0; border-top: 1px solid ${LFH_COLORS.border};
  margin-top: 8px; flex-wrap: wrap;
}

/* Compare Tray */
.lfhte-compare-tray {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 20px; background: ${LFH_COLORS.textPrimary};
  border-top: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;
}
.lfhte-tray-tours { display: flex; gap: 10px; flex: 1; overflow-x: auto; }
.lfhte-tray-thumb {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; background: rgba(255,255,255,0.1);
  border-radius: 6px; flex-shrink: 0;
}
.lfhte-tray-img {
  width: 32px; height: 32px; border-radius: 4px;
  background-size: cover; background-position: center;
}
.lfhte-tray-thumb span { color: #fff; font-size: 11px; font-weight: 600; }
.lfhte-tray-remove {
  background: transparent; border: none; color: rgba(255,255,255,0.6);
  cursor: pointer; font-size: 16px; padding: 0; margin-left: 4px;
}
.lfhte-tray-remove:hover { color: #fff; }
.lfhte-tray-compare-btn {
  padding: 10px 20px; background: ${LFH_COLORS.primaryRed};
  color: #fff; border: none; border-radius: 6px;
  font-family: 'Inter', sans-serif; font-size: 12px;
  font-weight: 600; cursor: pointer; white-space: nowrap;
  transition: background 0.2s;
}
.lfhte-tray-compare-btn:hover { background: #c4221a; }

/* Compare View */
.lfhte-compare { display: flex; flex-direction: column; height: 100%; }
.lfhte-compare-header {
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
}
.lfhte-compare-title {
  font-size: 18px; font-weight: 700; color: ${LFH_COLORS.textPrimary}; margin: 0;
}
.lfhte-compare-scroll { flex: 1; overflow: auto; }
.lfhte-compare-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
}
.lfhte-compare-table th, .lfhte-compare-table td {
  padding: 12px; border: 1px solid ${LFH_COLORS.border};
  text-align: left; vertical-align: top;
}
.lfhte-compare-th { background: ${LFH_COLORS.infoBox}; min-width: 160px; }
.lfhte-compare-tour-name {
  font-size: 14px; font-weight: 700; color: ${LFH_COLORS.primaryRed};
}
.lfhte-compare-tour-sub {
  font-size: 11px; color: ${LFH_COLORS.textSecondary}; margin-top: 2px;
}
.lfhte-compare-label { font-weight: 600; background: ${LFH_COLORS.infoBox}; white-space: nowrap; }
.lfhte-compare-actions {
  display: flex; gap: 10px; padding: 16px 0;
  border-top: 1px solid ${LFH_COLORS.border}; margin-top: 8px;
}

/* Mobile breakpoint */
@media (max-width: 500px) {
  .lfhte-stats-bar { grid-template-columns: repeat(2, 1fr); }
  .lfhte-pricing-table { display: block; overflow-x: auto; }
  .lfhte-compare-table { min-width: 500px; }
  .lfhte-hero-image { height: 200px; }
  .lfhte-filter-bar { padding: 10px 12px; }
  .lfhte-filter-group { min-width: 100px; }
  .lfhte-filter-group select { padding: 6px 8px; }
  .lfhte-included-grid { grid-template-columns: 1fr; }
}
`;
}
