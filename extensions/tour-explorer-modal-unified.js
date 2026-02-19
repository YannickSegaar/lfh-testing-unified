/**
 * Last Frontier Tour Explorer - Enhanced Modal with Booking
 * VoiceFlow-Ready — Unified Event Architecture
 *
 * Self-contained version for VoiceFlow widget (no ES module imports).
 * Cross-modal navigation uses window.__lfh namespace.
 *
 * Uses the Unified Event Architecture for all agent interactions:
 *   - ext_user_action  (tour_inquiry, booking_request_submitted)
 *   - ext_modal_closed (tour_explorer)
 *
 * @version 2.0.0-vf
 * @author Last Frontier Heliskiing / RomAIx
 */

// ============================================================================
// SHARED CONSTANTS (inlined — no ES module import)
// ============================================================================

const LFH_COLORS_TE = {
  primaryRed: '#e62b1e',
  textPrimary: '#42494e',
  textSecondary: '#666666',
  background: '#FFFFFF',
  infoBox: '#F5F5F5',
  border: '#E5E8EB',
  selectedTint: 'rgba(230, 43, 30, 0.04)',
};

const LFH_ASSETS_TE = {
  bgImage: 'https://yannicksegaar.github.io/RomAIx-Logo/LFH_bg_content_and_image_black.png',
  logo: 'https://yannicksegaar.github.io/RomAIx-Logo/LFH_Logo_FullName_White.svg',
  videoMask: 'https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/videos-img-mask.png',
};

const LFH_VIDEOS_TE = {
  dayInLife: { id: '247898299', title: 'A Day in the Life' },
  location: { id: '234398800', title: 'Location' },
  lodging: { id: '237992712', title: 'Lodging' },
  terrain: { id: '242847858', title: 'Terrain' },
  safety: { id: '251401988', title: 'Safety' },
  crew: { id: '256697044', title: 'The Crew' },
};

const LFH_TOURS_TE = [
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

const INCLUDED_ITEMS_TE = [
  'Accommodation at lodge',
  'All meals by professional chefs',
  'Certified mountain guides (ACMG/IFMGA)',
  'Avalanche safety equipment',
  'Ski and snowboard tuning',
  'Ground transfers from Terrace airport',
  'Small group skiing (max 4 guests/guide)',
];

// ============================================================================
// CROSS-MODAL NAMESPACE
// ============================================================================

window.__lfh = window.__lfh || {};

// ============================================================================
// HELPERS (prefixed to avoid collisions)
// ============================================================================

function _teLodgeName(id) {
  if (id === 'bell2') return 'Bell 2 Lodge';
  if (id === 'ripley') return 'Ripley Creek';
  if (id === 'both') return 'Both Lodges';
  if (id === 'safari') return 'Safari';
  return id;
}

function _teLodgeBadgeColor(lodges) {
  if (lodges.includes('both')) return '#8B6914';
  if (lodges.includes('ripley') && lodges.includes('bell2')) return LFH_COLORS_TE.primaryRed;
  if (lodges.includes('ripley')) return '#2E7D32';
  return '#1565C0';
}

function _teSilentVariableUpdate(name, value) {
  try {
    if (window.voiceflow?.chat) {
      window.voiceflow.chat.proactive.push({ type: 'save', payload: { [name]: value } });
    }
  } catch (e) { /* silent */ }
}

function _teInteractWithAgent(eventName, data) {
  try {
    window.voiceflow?.chat?.interact({
      type: 'event',
      payload: {
        event: { name: eventName },
        data: data
      }
    });
  } catch (e) { console.log('[TourExplorer] interact error:', e); }
}

// ============================================================================
// MODAL: Open
// ============================================================================

/**
 * @param {string|null} focusTourId - Tour ID to focus on immediately
 * @param {Object} config
 * @param {string} [config.bookingVariant='replace'] - 'replace' or 'slide'
 * @param {string} [config.webhookUrl=''] - n8n webhook endpoint
 * @param {string|null} [config.conversationId]
 * @param {string|null} [config.userId]
 * @param {string} [config.initialLodgeFilter='all']
 * @param {Function|null} [config.onCompareLodges]
 * @param {Function|null} [config.onCheckConditions]
 */
function openTourExplorerModal(focusTourId, config) {
  if (document.getElementById('lfh-tour-explorer-modal')) return;

  focusTourId = focusTourId || null;
  config = config || {};

  var bookingVariant = config.bookingVariant || 'replace';
  var webhookUrl = config.webhookUrl || '';
  var conversationId = config.conversationId || null;
  var userId = config.userId || null;
  var initialLodgeFilter = config.initialLodgeFilter || 'all';
  var onCompareLodges = config.onCompareLodges || null;
  var onCheckConditions = config.onCheckConditions || null;

  var C = LFH_COLORS_TE;

  // State
  var filteredTours = LFH_TOURS_TE.slice();
  var activeFilters = { lodge: initialLodgeFilter, duration: 'all', skill: 'all' };
  var compareTours = [];
  var currentView = 'grid'; // 'grid' | 'detail' | 'compare' | 'booking'
  var currentTourId = null;
  var actionTaken = false;
  var abortController = new AbortController();

  // --- Create Modal Shell ---
  var backdrop = document.createElement('div');
  backdrop.id = 'lfh-tour-explorer-modal';
  backdrop.style.cssText = '\
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;\
    background: rgba(0, 0, 0, 0.7); z-index: 10000;\
    display: flex; justify-content: center; align-items: center;\
    animation: lfhte-fadeIn 0.3s ease;\
  ';

  var modal = document.createElement('div');
  modal.style.cssText = '\
    width: 90%; max-width: 1000px; height: 85%; max-height: 800px;\
    background: ' + C.background + '; border-radius: 12px;\
    overflow: hidden; display: flex; flex-direction: column;\
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\
    animation: lfhte-slideUp 0.4s ease;\
    position: relative;\
  ';

  // --- Inject Styles ---
  var styleEl = document.createElement('style');
  styleEl.textContent = _teBuildModalStyles(C) + _teBuildSlidePanelStyles(C);
  modal.appendChild(styleEl);

  // --- Header Bar ---
  var headerBar = document.createElement('div');
  headerBar.className = 'lfhte-header-bar';
  headerBar.innerHTML = '\
    <span class="lfhte-header-title">Tour Explorer</span>\
    <button class="lfhte-close-btn" aria-label="Close">&times;</button>\
  ';
  modal.appendChild(headerBar);

  // --- Filter Bar ---
  var filterBar = document.createElement('div');
  filterBar.className = 'lfhte-filter-bar';
  filterBar.id = 'lfhte-filter-bar';
  filterBar.innerHTML = '\
    <div class="lfhte-filters-row">\
      <div class="lfhte-filter-group">\
        <label>Lodge</label>\
        <select id="lfhte-filter-lodge">\
          <option value="all">All Lodges</option>\
          <option value="bell2">Bell 2 Lodge</option>\
          <option value="ripley">Ripley Creek</option>\
          <option value="both">Safari (Both)</option>\
        </select>\
      </div>\
      <div class="lfhte-filter-group">\
        <label>Duration</label>\
        <select id="lfhte-filter-duration">\
          <option value="all">All Durations</option>\
          <option value="4">4-Day</option>\
          <option value="5">5-Day</option>\
          <option value="7">7-Day</option>\
          <option value="safari">Safari</option>\
          <option value="private">Private</option>\
        </select>\
      </div>\
      <div class="lfhte-filter-group">\
        <label>Skill Level</label>\
        <select id="lfhte-filter-skill">\
          <option value="all">All Levels</option>\
          <option value="intermediate">Intermediate-Expert</option>\
          <option value="expert">Expert Only</option>\
        </select>\
      </div>\
      <span class="lfhte-results-count" id="lfhte-results-count">' + LFH_TOURS_TE.length + ' tours</span>\
      ' + (onCompareLodges ? '<button class="lfhte-compare-lodges-link" id="lfhte-compare-lodges-btn">&#9776; Compare Lodges</button>' : '') + '\
      ' + (onCheckConditions ? '<button class="lfhte-conditions-link" id="lfhte-check-conditions-btn">&#9729; Conditions</button>' : '') + '\
    </div>\
  ';
  modal.appendChild(filterBar);

  // --- Compare Lodges button handler ---
  if (onCompareLodges) {
    filterBar.querySelector('#lfhte-compare-lodges-btn')?.addEventListener('click', function () {
      actionTaken = true;
      closeModal();
      setTimeout(function () { onCompareLodges(); }, 350);
    });
  }

  // --- Check Conditions button handler ---
  if (onCheckConditions) {
    filterBar.querySelector('#lfhte-check-conditions-btn')?.addEventListener('click', function () {
      actionTaken = true;
      closeModal();
      setTimeout(function () { onCheckConditions(); }, 350);
    });
  }

  // --- Main Content Area ---
  var content = document.createElement('div');
  content.className = 'lfhte-content';
  content.id = 'lfhte-content';
  modal.appendChild(content);

  // --- Compare Tray ---
  var compareTray = document.createElement('div');
  compareTray.className = 'lfhte-compare-tray';
  compareTray.id = 'lfhte-compare-tray';
  compareTray.style.display = 'none';
  modal.appendChild(compareTray);

  // --- Slide Panel (for 'slide' variant) ---
  var slidePanel = document.createElement('div');
  slidePanel.className = 'lfhte-sp-overlay';
  slidePanel.id = 'lfhte-sp-overlay';
  slidePanel.style.display = 'none';
  slidePanel.innerHTML = '\
    <div class="lfhte-sp-backdrop"></div>\
    <div class="lfhte-sp-panel" id="lfhte-sp-panel">\
      <div class="lfhte-sp-header">\
        <button class="lfhte-sp-back" id="lfhte-sp-back">&larr; Back to Tour</button>\
        <span class="lfhte-sp-title">Booking Request</span>\
      </div>\
      <div class="lfhte-sp-content" id="lfhte-sp-content"></div>\
    </div>\
  ';
  modal.appendChild(slidePanel);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // --- Apply initial lodge filter if set ---
  if (initialLodgeFilter !== 'all') {
    modal.querySelector('#lfhte-filter-lodge').value = initialLodgeFilter;
    filteredTours = LFH_TOURS_TE.filter(function (tour) {
      if (initialLodgeFilter === 'both') {
        return tour.lodges.includes('both');
      }
      return tour.lodges.includes(initialLodgeFilter) || tour.lodges.includes('both');
    });
    modal.querySelector('#lfhte-results-count').textContent =
      filteredTours.length + ' tour' + (filteredTours.length !== 1 ? 's' : '');
  }

  // --- Render Initial Grid ---
  renderTourGrid();

  if (focusTourId) {
    var focusTour = LFH_TOURS_TE.find(function (t) { return t.id === focusTourId; });
    if (focusTour) {
      setTimeout(function () { renderTourDetail(focusTour); }, 300);
    }
  }

  _teSilentVariableUpdate('ext_last_action', 'tour_explorer_booking_opened');

  // ========================================================================
  // RENDER: Tour Grid
  // ========================================================================

  function renderTourGrid() {
    currentView = 'grid';
    filterBar.style.display = '';

    var grid = document.createElement('div');
    grid.className = 'lfhte-tour-grid';

    if (filteredTours.length === 0) {
      grid.innerHTML = '\
        <div class="lfhte-no-results">\
          <div class="lfhte-no-results-icon">&#9968;</div>\
          <p>No tours match your filters</p>\
          <button class="lfhte-btn-outline" id="lfhte-clear-filters">Clear Filters</button>\
        </div>\
      ';
      content.innerHTML = '';
      content.appendChild(grid);
      content.querySelector('#lfhte-clear-filters')?.addEventListener('click', function () {
        activeFilters = { lodge: 'all', duration: 'all', skill: 'all' };
        modal.querySelector('#lfhte-filter-lodge').value = 'all';
        modal.querySelector('#lfhte-filter-duration').value = 'all';
        modal.querySelector('#lfhte-filter-skill').value = 'all';
        applyFilters();
      });
      return;
    }

    filteredTours.forEach(function (tour) {
      var card = document.createElement('div');
      card.className = 'lfhte-tour-card';
      var isComparing = compareTours.includes(tour.id);
      var lodgeBadges = tour.lodges
        .map(function (l) { return '<span class="lfhte-lodge-badge" style="background:' + _teLodgeBadgeColor(tour.lodges) + '">' + _teLodgeName(l) + '</span>'; })
        .join('');
      var priceDisplay = 'From $' + tour.priceFrom.toLocaleString() + ' CAD';

      card.innerHTML = '\
        <div class="lfhte-card-image" style="background-image: url(\'' + tour.heroImage + '\')">\
          <div class="lfhte-card-badges">' + lodgeBadges + '</div>\
        </div>\
        <div class="lfhte-card-body">\
          <h3 class="lfhte-card-title">' + tour.name + '</h3>\
          <div class="lfhte-card-stats">\
            <span>' + tour.duration + '</span>\
            <span class="lfhte-stat-divider">|</span>\
            <span>' + tour.verticalGuarantee + '</span>\
            <span class="lfhte-stat-divider">|</span>\
            <span>4 guests/guide</span>\
          </div>\
          <p class="lfhte-card-price">' + priceDisplay + '</p>\
          <p class="lfhte-card-desc">' + tour.description.substring(0, 100) + '...</p>\
          <div class="lfhte-card-actions">\
            <button class="lfhte-btn-outline lfhte-compare-toggle ' + (isComparing ? 'active' : '') + '" data-tour-id="' + tour.id + '">\
              ' + (isComparing ? '&#10003; Comparing' : 'Compare') + '\
            </button>\
            <button class="lfhte-btn-primary lfhte-view-detail" data-tour-id="' + tour.id + '">View Details</button>\
          </div>\
        </div>\
      ';
      grid.appendChild(card);
    });

    content.innerHTML = '';
    content.appendChild(grid);

    content.querySelectorAll('.lfhte-view-detail').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tour = LFH_TOURS_TE.find(function (t) { return t.id === btn.dataset.tourId; });
        if (tour) renderTourDetail(tour);
      });
    });

    content.querySelectorAll('.lfhte-compare-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () { toggleCompare(btn.dataset.tourId); });
    });
  }

  // ========================================================================
  // RENDER: Tour Detail (with booking button override)
  // ========================================================================

  function renderTourDetail(tour) {
    currentView = 'detail';
    currentTourId = tour.id;
    filterBar.style.display = '';
    _teSilentVariableUpdate('ext_current_tour', tour.id);

    var detail = document.createElement('div');
    detail.className = 'lfhte-detail';

    var videoEntry = Object.values(LFH_VIDEOS_TE).find(function (v) { return v.id === tour.videoId; });
    var videoTitle = videoEntry ? videoEntry.title : 'A Day in the Life';

    // Pricing table rows
    var pricingRows = '';
    if (tour.pricing.safari) {
      pricingRows = '<tr><td>Safari Rate</td><td>' + (tour.pricing.safari.peak || '\u2014') + '</td></tr>';
    } else {
      var lodgeKeys = Object.keys(tour.pricing);
      lodgeKeys.forEach(function (key) {
        var p = tour.pricing[key];
        var lodgeLabel = onCompareLodges
          ? '<button class="lfhte-lodge-name-link" data-lodge-id="' + key + '">' + _teLodgeName(key) + '</button>'
          : '<strong>' + _teLodgeName(key) + '</strong>';
        pricingRows += '\
          <tr>\
            <td>' + lodgeLabel + '</td>\
            <td>' + (p.early || '\u2014') + '</td>\
            <td>' + (p.peak || '\u2014') + '</td>\
            <td>' + (p.late || '\u2014') + '</td>\
          </tr>\
        ';
      });
    }

    var pricingHeader = tour.pricing.safari
      ? '<tr><th>Rate Type</th><th>Peak Season</th></tr>'
      : '<tr><th>Lodge</th><th>Early (Dec-Jan)</th><th>Peak (Feb-Mar)</th><th>Late (Apr)</th></tr>';

    var galleryHTML = tour.galleryImages
      .map(function (img, i) { return '<div class="lfhte-gallery-thumb" style="background-image: url(\'' + img + '\')" data-index="' + i + '"></div>'; })
      .join('');

    var includedHTML = INCLUDED_ITEMS_TE.map(function (item) {
      return '<div class="lfhte-included-item"><span class="lfhte-check-icon">&#10003;</span> ' + item + '</div>';
    }).join('');

    var bestForHTML = tour.bestFor
      .map(function (bf) { return '<span class="lfhte-best-for-badge">' + bf + '</span>'; })
      .join('');

    detail.innerHTML = '\
      <div class="lfhte-detail-header">\
        <button class="lfhte-back-btn" id="lfhte-back-to-grid">&larr; All Tours</button>\
        <h2 class="lfhte-detail-title">' + tour.name + '</h2>\
        <span class="lfhte-detail-subtitle">' + tour.subtitle + '</span>\
      </div>\
      <div class="lfhte-detail-scroll">\
        <div class="lfhte-hero-media" id="lfhte-hero-media">\
          <div class="lfhte-hero-image" style="background-image: url(\'' + tour.heroImage + '\')">\
            <button class="lfhte-play-btn" id="lfhte-play-video" data-vimeo="' + tour.videoId + '">\
              <span class="lfhte-play-triangle"></span>\
            </button>\
            <div class="lfhte-hero-label">Watch: ' + videoTitle + '</div>\
          </div>\
        </div>\
        <div class="lfhte-gallery-strip">' + galleryHTML + '</div>\
        <div class="lfhte-detail-section">\
          <p class="lfhte-full-desc">' + tour.description + '</p>\
          <div class="lfhte-best-for">' + bestForHTML + '</div>\
        </div>\
        <div class="lfhte-stats-bar">\
          <div class="lfhte-stat-box">\
            <div class="lfhte-stat-value">' + tour.duration + '</div>\
            <div class="lfhte-stat-label">Duration</div>\
          </div>\
          <div class="lfhte-stat-box">\
            <div class="lfhte-stat-value">' + tour.verticalGuarantee + '</div>\
            <div class="lfhte-stat-label">Vertical Guarantee</div>\
          </div>\
          <div class="lfhte-stat-box">\
            <div class="lfhte-stat-value">' + tour.skillLevel.replace(' / Expert', '') + '</div>\
            <div class="lfhte-stat-label">Skill Level</div>\
          </div>\
          <div class="lfhte-stat-box">\
            <div class="lfhte-stat-value">4:1</div>\
            <div class="lfhte-stat-label">Guest:Guide</div>\
          </div>\
        </div>\
        <div class="lfhte-detail-section">\
          <h3 class="lfhte-section-title">Pricing (CAD per person)</h3>\
          <table class="lfhte-pricing-table">\
            <thead>' + pricingHeader + '</thead>\
            <tbody>' + pricingRows + '</tbody>\
          </table>\
          <p class="lfhte-pricing-note">5% GST applies. 20% deposit to confirm. Extra vertical: $210/1,000m.</p>\
        </div>\
        <div class="lfhte-detail-section">\
          <h3 class="lfhte-section-title">What\'s Included</h3>\
          <div class="lfhte-included-grid">' + includedHTML + '</div>\
        </div>\
        <div class="lfhte-detail-actions">\
          <div class="lfhte-actions-row">\
            <button class="lfhte-btn-primary lfhte-action-book" data-tour-id="' + tour.id + '">I Want to Book</button>\
            <button class="lfhte-btn-outline lfhte-action-ask" data-tour-id="' + tour.id + '">Ask About This Tour</button>\
          </div>\
          <div class="lfhte-actions-row">\
            <button class="lfhte-btn-outline lfhte-back-link" id="lfhte-back-link">&larr; Back to All Tours</button>\
            ' + (onCompareLodges ? '<button class="lfhte-btn-outline lfhte-compare-lodges-detail" id="lfhte-compare-lodges-detail">Compare Lodges</button>' : '') + '\
          </div>\
        </div>\
      </div>\
    ';

    content.innerHTML = '';
    content.appendChild(detail);

    // Event Listeners
    detail.querySelector('#lfhte-back-to-grid')?.addEventListener('click', renderTourGrid);
    detail.querySelector('#lfhte-back-link')?.addEventListener('click', renderTourGrid);

    // Gallery thumbnails
    detail.querySelectorAll('.lfhte-gallery-thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var idx = parseInt(thumb.dataset.index);
        var heroMedia = detail.querySelector('#lfhte-hero-media');
        heroMedia.innerHTML = '\
          <div class="lfhte-hero-image" style="background-image: url(\'' + tour.galleryImages[idx] + '\')">\
            <button class="lfhte-play-btn" id="lfhte-play-video" data-vimeo="' + tour.videoId + '">\
              <span class="lfhte-play-triangle"></span>\
            </button>\
            <div class="lfhte-hero-label">Watch: ' + videoTitle + '</div>\
          </div>\
        ';
        heroMedia.querySelector('#lfhte-play-video')?.addEventListener('click', function (e) {
          heroMedia.innerHTML = '\
            <div class="lfhte-video-embed">\
              <iframe src="https://player.vimeo.com/video/' + e.currentTarget.dataset.vimeo + '?autoplay=1&title=0&byline=0&portrait=0"\
                allow="autoplay; fullscreen" allowfullscreen></iframe>\
            </div>\
          ';
        });
        detail.querySelectorAll('.lfhte-gallery-thumb').forEach(function (t) { t.style.borderColor = 'transparent'; });
        thumb.style.borderColor = C.primaryRed;
      });
    });

    detail.querySelector('#lfhte-play-video')?.addEventListener('click', function (e) {
      var heroMedia = detail.querySelector('#lfhte-hero-media');
      heroMedia.innerHTML = '\
        <div class="lfhte-video-embed">\
          <iframe src="https://player.vimeo.com/video/' + e.currentTarget.dataset.vimeo + '?autoplay=1&title=0&byline=0&portrait=0"\
            allow="autoplay; fullscreen" allowfullscreen></iframe>\
        </div>\
      ';
    });

    // ===== BOOKING BUTTON =====
    detail.querySelector('.lfhte-action-book')?.addEventListener('click', function () {
      if (bookingVariant === 'slide') {
        openSlidePanel(tour);
      } else {
        openReplaceBooking(tour);
      }
    });

    detail.querySelector('.lfhte-action-ask')?.addEventListener('click', function () {
      _teInteractWithAgent('ext_user_action', {
        action: 'tour_inquiry',
        source: 'tour_explorer',
        tourId: tour.id,
        tourName: tour.name,
        lodge: tour.lodges.join(', '),
        duration: tour.duration,
      });
      actionTaken = true;
      closeModal();
    });

    // Compare Lodges - pricing table lodge name links
    if (onCompareLodges) {
      detail.querySelectorAll('.lfhte-lodge-name-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.stopPropagation();
          var lodgeId = link.dataset.lodgeId;
          actionTaken = true;
          closeModal();
          setTimeout(function () { onCompareLodges(lodgeId); }, 350);
        });
      });

      // Compare Lodges - detail actions text button
      detail.querySelector('#lfhte-compare-lodges-detail')?.addEventListener('click', function () {
        actionTaken = true;
        closeModal();
        setTimeout(function () { onCompareLodges(); }, 350);
      });
    }
  }

  // ========================================================================
  // BOOKING: Variant A - Replace Content
  // ========================================================================

  function openReplaceBooking(tour) {
    currentView = 'booking';
    filterBar.style.display = 'none';
    _teSilentVariableUpdate('ext_last_action', 'booking_form_opened');

    var bookingContainer = document.createElement('div');
    bookingContainer.style.cssText = 'height:100%;overflow-y:auto;';

    // Back button header
    var backHeader = document.createElement('div');
    backHeader.style.cssText = '\
      padding: 12px 20px; border-bottom: 1px solid ' + C.border + ';\
      display: flex; align-items: center; gap: 12px;\
    ';
    backHeader.innerHTML = '\
      <button class="lfhte-back-btn" id="lfhte-booking-back">&larr; Back to ' + tour.name + '</button>\
      <span style="font-family:\'Nexa Rust Sans Black 2\',sans-serif;font-size:14px;font-weight:900;color:' + C.textPrimary + ';text-transform:uppercase;letter-spacing:1px;">Booking Request</span>\
    ';

    var formContainer = document.createElement('div');
    formContainer.style.cssText = 'flex:1;overflow-y:auto;';

    bookingContainer.appendChild(backHeader);
    bookingContainer.appendChild(formContainer);

    content.innerHTML = '';
    content.appendChild(bookingContainer);

    // Render the booking form — use window.__lfh.renderBookingForm if available
    if (window.__lfh && typeof window.__lfh.renderBookingForm === 'function') {
      window.__lfh.renderBookingForm(formContainer, {
        tour: tour,
        webhookUrl: webhookUrl,
        variant: 'replace',
        conversationId: conversationId,
        userId: userId,
        onSubmitSuccess: function (payload) { handleBookingSuccess(tour, payload); },
        onBack: function () { renderTourDetail(tour); },
      });
    } else {
      // Fallback: no booking form available
      formContainer.innerHTML = '\
        <div style="padding:40px 20px;text-align:center;font-family:Inter,sans-serif;">\
          <p style="font-size:16px;color:' + C.textPrimary + ';margin:0 0 12px;">Please contact us to book</p>\
          <p style="font-size:13px;color:' + C.textSecondary + ';margin:0 0 20px;">Our team will be happy to help you arrange your ' + tour.name + ' trip.</p>\
          <a href="https://www.lastfrontierheli.com/contact/" target="_blank" style="\
            display:inline-block;padding:12px 28px;background:' + C.primaryRed + ';color:#fff;\
            border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;\
          ">Contact Last Frontier</a>\
        </div>\
      ';
    }

    // Back button
    backHeader.querySelector('#lfhte-booking-back')?.addEventListener('click', function () {
      renderTourDetail(tour);
    });
  }

  // ========================================================================
  // BOOKING: Variant B - Slide-in Panel
  // ========================================================================

  function openSlidePanel(tour) {
    _teSilentVariableUpdate('ext_last_action', 'booking_form_opened');

    var overlay = modal.querySelector('#lfhte-sp-overlay');
    var panelContent = modal.querySelector('#lfhte-sp-content');
    var backBtn = modal.querySelector('#lfhte-sp-back');

    overlay.style.display = 'block';
    // Trigger animation
    requestAnimationFrame(function () {
      overlay.classList.add('open');
    });

    // Render the booking form — use window.__lfh.renderBookingForm if available
    if (window.__lfh && typeof window.__lfh.renderBookingForm === 'function') {
      window.__lfh.renderBookingForm(panelContent, {
        tour: tour,
        webhookUrl: webhookUrl,
        variant: 'slide',
        conversationId: conversationId,
        userId: userId,
        onSubmitSuccess: function (payload) { handleBookingSuccess(tour, payload); },
        onBack: function () { closeSlidePanel(); },
      });
    } else {
      // Fallback: no booking form available
      panelContent.innerHTML = '\
        <div style="padding:40px 20px;text-align:center;font-family:Inter,sans-serif;">\
          <p style="font-size:16px;color:' + C.textPrimary + ';margin:0 0 12px;">Please contact us to book</p>\
          <p style="font-size:13px;color:' + C.textSecondary + ';margin:0 0 20px;">Our team will be happy to help you arrange your ' + tour.name + ' trip.</p>\
          <a href="https://www.lastfrontierheli.com/contact/" target="_blank" style="\
            display:inline-block;padding:12px 28px;background:' + C.primaryRed + ';color:#fff;\
            border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;\
          ">Contact Last Frontier</a>\
        </div>\
      ';
    }

    // Back handler
    var handleBack = function () { closeSlidePanel(); };
    backBtn.addEventListener('click', handleBack, { once: true });

    // Backdrop click to close
    var spBackdrop = overlay.querySelector('.lfhte-sp-backdrop');
    spBackdrop.addEventListener('click', handleBack, { once: true });
  }

  function closeSlidePanel() {
    var overlay = modal.querySelector('#lfhte-sp-overlay');
    overlay.classList.remove('open');
    setTimeout(function () {
      overlay.style.display = 'none';
      var panelContent = modal.querySelector('#lfhte-sp-content');
      if (panelContent) panelContent.innerHTML = '';
    }, 300);
  }

  // ========================================================================
  // BOOKING: Post-Submit
  // ========================================================================

  function handleBookingSuccess(tour, payload) {
    // Fire interact event for VoiceFlow — no PII (email/name/phone)
    // PII is sent directly to the webhook by the booking form, not through VoiceFlow
    _teInteractWithAgent('ext_user_action', {
      action: 'booking_request_submitted',
      source: 'tour_explorer',
      tourId: tour.id,
      tourName: tour.name,
      requestType: payload.bookingRequest.requestType,
    });

    // Suppress duplicate ext_modal_closed since action was already fired
    actionTaken = true;

    // Auto-close modal after delay
    setTimeout(function () {
      closeModal();
    }, 2500);
  }

  // ========================================================================
  // RENDER: Compare View
  // ========================================================================

  function renderCompareView() {
    currentView = 'compare';
    var tours = compareTours.map(function (id) { return LFH_TOURS_TE.find(function (t) { return t.id === id; }); }).filter(Boolean);
    _teSilentVariableUpdate('ext_tours_compared', compareTours.join(','));

    var compare = document.createElement('div');
    compare.className = 'lfhte-compare';

    var headerCells = tours.map(function (t) {
      return '<th class="lfhte-compare-th"><div class="lfhte-compare-tour-name">' + t.name + '</div><div class="lfhte-compare-tour-sub">' + t.subtitle + '</div></th>';
    }).join('');

    var rows = [
      { label: 'Duration', fn: function (t) { return t.duration; } },
      { label: 'Vertical Guarantee', fn: function (t) { return t.verticalGuarantee; } },
      { label: 'Lodges', fn: function (t) { return t.lodges.map(_teLodgeName).join(' & '); } },
      { label: 'Skill Level', fn: function (t) { return t.skillLevel; } },
      { label: 'Starting Price', fn: function (t) { return '$' + t.priceFrom.toLocaleString() + ' CAD'; } },
      { label: 'Best For', fn: function (t) { return t.bestFor.join(', '); } },
    ];

    var rowsHTML = rows
      .map(function (row) {
        return '<tr><td class="lfhte-compare-label">' + row.label + '</td>' + tours.map(function (t) { return '<td>' + row.fn(t) + '</td>'; }).join('') + '</tr>';
      }).join('');

    compare.innerHTML = '\
      <div class="lfhte-compare-header">\
        <button class="lfhte-back-btn" id="lfhte-compare-back">&larr; Back to Tours</button>\
        <h2 class="lfhte-compare-title">Comparing ' + tours.length + ' Tours</h2>\
      </div>\
      <div class="lfhte-compare-scroll">\
        <table class="lfhte-compare-table">\
          <thead><tr><th></th>' + headerCells + '</tr></thead>\
          <tbody>' + rowsHTML + '</tbody>\
        </table>\
      </div>\
      <div class="lfhte-compare-actions">\
        <button class="lfhte-btn-outline" id="lfhte-compare-clear">Clear Comparison</button>\
      </div>\
    ';

    content.innerHTML = '';
    content.appendChild(compare);

    compare.querySelector('#lfhte-compare-back')?.addEventListener('click', renderTourGrid);
    compare.querySelector('#lfhte-compare-clear')?.addEventListener('click', function () {
      compareTours = [];
      updateCompareTray();
      renderTourGrid();
    });
  }

  // ========================================================================
  // COMPARE: Toggle & Tray
  // ========================================================================

  function toggleCompare(tourId) {
    var idx = compareTours.indexOf(tourId);
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
    var thumbs = compareTours.map(function (id) {
      var t = LFH_TOURS_TE.find(function (tour) { return tour.id === id; });
      return t
        ? '<div class="lfhte-tray-thumb">\
             <div class="lfhte-tray-img" style="background-image:url(\'' + t.thumbnailImage + '\')"></div>\
             <span>' + t.name + '</span>\
             <button class="lfhte-tray-remove" data-tour-id="' + id + '">&times;</button>\
           </div>'
        : '';
    }).join('');

    compareTray.innerHTML = '\
      <div class="lfhte-tray-tours">' + thumbs + '</div>\
      <button class="lfhte-btn-primary lfhte-tray-compare-btn">Compare ' + compareTours.length + ' Tours</button>\
    ';

    compareTray.querySelectorAll('.lfhte-tray-remove').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
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
    filteredTours = LFH_TOURS_TE.filter(function (tour) {
      if (activeFilters.lodge !== 'all') {
        if (activeFilters.lodge === 'both') {
          if (!tour.lodges.includes('both')) return false;
        } else {
          if (!tour.lodges.includes(activeFilters.lodge) && !tour.lodges.includes('both')) return false;
        }
      }
      if (activeFilters.duration !== 'all') {
        if (activeFilters.duration === 'safari') {
          if (!tour.id.startsWith('safari')) return false;
        } else if (activeFilters.duration === 'private') {
          if (tour.id !== 'private') return false;
        } else {
          if (tour.durationDays !== parseInt(activeFilters.duration)) return false;
        }
      }
      if (activeFilters.skill !== 'all') {
        if (activeFilters.skill === 'expert' && !tour.skillLevel.includes('Expert')) return false;
        if (activeFilters.skill === 'intermediate' && tour.skillLevel === 'Expert Only') return false;
      }
      return true;
    });

    _teSilentVariableUpdate('ext_filters_applied', JSON.stringify(activeFilters));
    modal.querySelector('#lfhte-results-count').textContent =
      filteredTours.length + ' tour' + (filteredTours.length !== 1 ? 's' : '');
    renderTourGrid();
  }

  modal.querySelector('#lfhte-filter-lodge')?.addEventListener('change', function (e) {
    activeFilters.lodge = e.target.value;
    _teSilentVariableUpdate('ext_current_lodge', e.target.value);
    applyFilters();
  });

  modal.querySelector('#lfhte-filter-duration')?.addEventListener('change', function (e) {
    activeFilters.duration = e.target.value;
    applyFilters();
  });

  modal.querySelector('#lfhte-filter-skill')?.addEventListener('change', function (e) {
    activeFilters.skill = e.target.value;
    applyFilters();
  });

  // ========================================================================
  // CLOSE MODAL
  // ========================================================================

  function closeModal() {
    if (!actionTaken) {
      _teInteractWithAgent('ext_modal_closed', {
        modal: 'tour_explorer',
        lastViewed: currentTourId,
        toursCompared: compareTours,
      });
    }

    abortController.abort();
    backdrop.style.animation = 'lfhte-fadeOut 0.3s ease forwards';
    setTimeout(function () { backdrop.remove(); }, 300);
  }

  headerBar.querySelector('.lfhte-close-btn')?.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.contains(backdrop)) {
      // Close slide panel first if open
      var overlay = document.querySelector('#lfhte-sp-overlay.open');
      if (overlay) {
        closeSlidePanel();
      } else {
        closeModal();
      }
    }
  }, { signal: abortController.signal });
}

// Register on namespace
window.__lfh.openTourExplorer = openTourExplorerModal;

// ============================================================================
// VOICEFLOW EXTENSION WRAPPER
// ============================================================================

export const LastFrontierTourExplorer = {
  name: 'LastFrontierTourExplorer',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_tourExplorer' ||
    trace.payload?.name === 'ext_tourExplorer',
  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    openTourExplorerModal(payload.tourId || null, {
      initialLodgeFilter: payload.lodgeFilter || 'all',
      onCompareLodges: (lodgeId) => window.__lfh.openLodgeCompare?.(lodgeId || null),
      onCheckConditions: () => window.__lfh.openWeatherConditions?.(),
    });
  },
};

// ============================================================================
// STYLES
// ============================================================================

function _teBuildModalStyles(C) {
  return '\
@import url(\'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap\');\
\
@font-face {\
  font-family: \'Nexa Rust Sans Black 2\';\
  src: url(\'https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2\') format(\'woff2\');\
  font-weight: 900; font-style: normal; font-display: swap;\
}\
\
@keyframes lfhte-fadeIn { from { opacity: 0; } to { opacity: 1; } }\
@keyframes lfhte-fadeOut { from { opacity: 1; } to { opacity: 0; } }\
@keyframes lfhte-slideUp {\
  from { opacity: 0; transform: translateY(30px); }\
  to { opacity: 1; transform: translateY(0); }\
}\
\
.lfhte-header-bar {\
  display: flex; align-items: center; justify-content: space-between;\
  padding: 14px 20px; background: ' + C.textPrimary + '; flex-shrink: 0;\
}\
.lfhte-header-title {\
  font-family: \'Nexa Rust Sans Black 2\', sans-serif;\
  font-size: 20px; font-weight: 900; color: #fff;\
  text-transform: uppercase; letter-spacing: 2px;\
}\
.lfhte-close-btn {\
  background: transparent; border: none; color: #fff;\
  font-size: 28px; cursor: pointer; padding: 0;\
  width: 36px; height: 36px; display: flex;\
  align-items: center; justify-content: center;\
  border-radius: 50%; transition: background 0.2s;\
}\
.lfhte-close-btn:hover { background: rgba(255,255,255,0.15); }\
\
.lfhte-filter-bar {\
  padding: 12px 20px; background: ' + C.infoBox + ';\
  border-bottom: 1px solid ' + C.border + '; flex-shrink: 0;\
}\
.lfhte-filters-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }\
.lfhte-filter-group { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 130px; }\
.lfhte-filter-group label {\
  font-family: \'Inter\', sans-serif; font-size: 10px;\
  font-weight: 700; color: ' + C.textSecondary + ';\
  text-transform: uppercase; letter-spacing: 0.5px;\
}\
.lfhte-filter-group select {\
  padding: 8px 10px; border: 1px solid ' + C.border + ';\
  border-radius: 6px; font-family: \'Inter\', sans-serif;\
  font-size: 12px; color: ' + C.textPrimary + ';\
  background: #fff; cursor: pointer; outline: none;\
}\
.lfhte-filter-group select:focus { border-color: ' + C.primaryRed + '; }\
.lfhte-results-count {\
  font-family: \'Inter\', sans-serif; font-size: 12px;\
  font-weight: 600; color: ' + C.textSecondary + ';\
  white-space: nowrap; margin-left: auto;\
}\
.lfhte-compare-lodges-link {\
  padding: 6px 14px; background: ' + C.infoBox + ';\
  border: 1.5px solid ' + C.border + '; border-radius: 20px;\
  font-family: \'Inter\', sans-serif; font-size: 11px;\
  font-weight: 600; color: ' + C.textSecondary + ';\
  cursor: pointer; transition: all 0.2s; white-space: nowrap;\
}\
.lfhte-compare-lodges-link:hover {\
  border-color: ' + C.primaryRed + '; color: ' + C.primaryRed + ';\
}\
.lfhte-conditions-link {\
  padding: 6px 14px; background: ' + C.infoBox + ';\
  border: 1.5px solid ' + C.border + '; border-radius: 20px;\
  font-family: \'Inter\', sans-serif; font-size: 11px;\
  font-weight: 600; color: ' + C.textSecondary + ';\
  cursor: pointer; transition: all 0.2s; white-space: nowrap;\
}\
.lfhte-conditions-link:hover {\
  border-color: ' + C.primaryRed + '; color: ' + C.primaryRed + ';\
}\
.lfhte-lodge-name-link {\
  background: none; border: none; padding: 0;\
  font-weight: 700; font-size: inherit; font-family: inherit;\
  color: ' + C.primaryRed + '; cursor: pointer;\
  text-decoration: underline; text-decoration-style: dotted;\
  text-underline-offset: 2px; transition: color 0.2s;\
}\
.lfhte-lodge-name-link:hover { color: #c4221a; }\
\
.lfhte-content {\
  flex: 1; overflow-y: auto; padding: 20px;\
  font-family: \'Inter\', sans-serif;\
}\
.lfhte-content::-webkit-scrollbar { width: 6px; }\
.lfhte-content::-webkit-scrollbar-track { background: ' + C.infoBox + '; }\
.lfhte-content::-webkit-scrollbar-thumb { background: ' + C.border + '; border-radius: 3px; }\
\
.lfhte-tour-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }\
@media (max-width: 700px) { .lfhte-tour-grid { grid-template-columns: 1fr; } }\
\
.lfhte-tour-card {\
  border: 1.5px solid ' + C.border + '; border-radius: 10px;\
  overflow: hidden; transition: all 0.2s ease; background: #fff;\
}\
.lfhte-tour-card:hover {\
  border-color: ' + C.primaryRed + ';\
  box-shadow: 0 4px 16px rgba(230, 43, 30, 0.1);\
}\
.lfhte-card-image {\
  height: 160px; background-size: cover;\
  background-position: center; position: relative;\
}\
.lfhte-card-badges {\
  position: absolute; top: 10px; right: 10px;\
  display: flex; gap: 6px; flex-wrap: wrap;\
}\
.lfhte-lodge-badge {\
  padding: 4px 10px; border-radius: 20px;\
  font-size: 10px; font-weight: 600; color: #fff;\
  text-transform: uppercase; letter-spacing: 0.3px;\
}\
.lfhte-card-body { padding: 14px; }\
.lfhte-card-title {\
  font-size: 16px; font-weight: 700;\
  color: ' + C.primaryRed + '; margin: 0 0 8px;\
}\
.lfhte-card-stats {\
  font-size: 11px; color: ' + C.textSecondary + '; margin-bottom: 6px;\
}\
.lfhte-stat-divider { margin: 0 6px; opacity: 0.4; }\
.lfhte-card-price {\
  font-size: 14px; font-weight: 700;\
  color: ' + C.textPrimary + '; margin: 0 0 8px;\
}\
.lfhte-card-desc {\
  font-size: 12px; color: ' + C.textSecondary + ';\
  line-height: 1.5; margin: 0 0 12px;\
  display: -webkit-box; -webkit-line-clamp: 2;\
  -webkit-box-orient: vertical; overflow: hidden;\
}\
.lfhte-card-actions { display: flex; gap: 8px; }\
\
.lfhte-btn-primary {\
  flex: 1; padding: 10px 16px;\
  background: ' + C.primaryRed + '; color: #fff;\
  border: none; border-radius: 6px; font-family: \'Inter\', sans-serif;\
  font-size: 12px; font-weight: 600; cursor: pointer;\
  transition: all 0.2s; text-align: center;\
}\
.lfhte-btn-primary:hover { background: #c4221a; transform: translateY(-1px); }\
.lfhte-btn-outline {\
  flex: 1; padding: 10px 16px;\
  background: #fff; color: ' + C.textPrimary + ';\
  border: 1.5px solid ' + C.border + '; border-radius: 6px;\
  font-family: \'Inter\', sans-serif; font-size: 12px;\
  font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: center;\
}\
.lfhte-btn-outline:hover { border-color: ' + C.primaryRed + '; color: ' + C.primaryRed + '; }\
.lfhte-btn-outline.active {\
  background: ' + C.selectedTint + ';\
  border-color: ' + C.primaryRed + '; color: ' + C.primaryRed + ';\
}\
.lfhte-btn-text {\
  background: transparent; border: none;\
  color: ' + C.textSecondary + '; font-family: \'Inter\', sans-serif;\
  font-size: 12px; cursor: pointer; padding: 8px; transition: color 0.2s;\
}\
.lfhte-btn-text:hover { color: ' + C.primaryRed + '; }\
\
.lfhte-no-results { grid-column: 1 / -1; text-align: center; padding: 60px 20px; }\
.lfhte-no-results-icon { font-size: 48px; margin-bottom: 12px; }\
.lfhte-no-results p { font-size: 16px; color: ' + C.textSecondary + '; margin-bottom: 16px; }\
\
.lfhte-detail { display: flex; flex-direction: column; height: 100%; }\
.lfhte-detail-header {\
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;\
}\
.lfhte-back-btn {\
  background: ' + C.infoBox + '; border: 1px solid ' + C.border + ';\
  border-radius: 6px; padding: 8px 14px;\
  font-family: \'Inter\', sans-serif; font-size: 11px;\
  font-weight: 700; color: ' + C.textSecondary + ';\
  cursor: pointer; transition: all 0.2s; text-transform: uppercase;\
}\
.lfhte-back-btn:hover {\
  background: #eee; border-color: ' + C.primaryRed + ';\
  color: ' + C.textPrimary + ';\
}\
.lfhte-detail-title {\
  font-size: 22px; font-weight: 900; color: ' + C.textPrimary + ';\
  margin: 0; font-family: \'Nexa Rust Sans Black 2\', sans-serif;\
  text-transform: uppercase; letter-spacing: 1px;\
}\
.lfhte-detail-subtitle { font-size: 13px; color: ' + C.textSecondary + '; font-style: italic; }\
.lfhte-detail-scroll { flex: 1; overflow-y: auto; }\
\
.lfhte-hero-media { margin-bottom: 12px; }\
.lfhte-hero-image {\
  width: 100%; height: 280px; background-size: cover;\
  background-position: center; border-radius: 10px;\
  position: relative; display: flex;\
  align-items: center; justify-content: center; cursor: pointer;\
}\
.lfhte-hero-image::after {\
  content: \'\'; position: absolute; inset: 0;\
  background: linear-gradient(transparent 50%, rgba(0,0,0,0.6));\
  border-radius: 10px; pointer-events: none;\
}\
.lfhte-play-btn {\
  position: relative; z-index: 2;\
  width: 64px; height: 64px; border-radius: 50%;\
  background: rgba(255,255,255,0.9); border: none;\
  cursor: pointer; display: flex; align-items: center;\
  justify-content: center; transition: all 0.2s;\
}\
.lfhte-play-btn:hover { background: ' + C.primaryRed + '; transform: scale(1.1); }\
.lfhte-play-btn:hover .lfhte-play-triangle { border-left-color: #fff; }\
.lfhte-play-triangle {\
  width: 0; height: 0;\
  border-left: 18px solid ' + C.textPrimary + ';\
  border-top: 11px solid transparent;\
  border-bottom: 11px solid transparent;\
  margin-left: 4px; transition: border-color 0.2s;\
}\
.lfhte-hero-label {\
  position: absolute; bottom: 14px; left: 14px; z-index: 2;\
  color: #fff; font-size: 12px; font-weight: 600;\
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);\
}\
.lfhte-video-embed {\
  width: 100%; aspect-ratio: 16/9; border-radius: 10px;\
  overflow: hidden; background: #000;\
}\
.lfhte-video-embed iframe { width: 100%; height: 100%; border: none; }\
\
.lfhte-gallery-strip {\
  display: flex; gap: 8px; overflow-x: auto;\
  padding-bottom: 8px; margin-bottom: 16px;\
}\
.lfhte-gallery-strip::-webkit-scrollbar { height: 4px; }\
.lfhte-gallery-strip::-webkit-scrollbar-thumb { background: ' + C.border + '; border-radius: 2px; }\
.lfhte-gallery-thumb {\
  flex: 0 0 120px; height: 80px; border-radius: 8px;\
  background-size: cover; background-position: center;\
  border: 2px solid transparent; cursor: pointer; transition: all 0.2s;\
}\
.lfhte-gallery-thumb:hover { border-color: ' + C.primaryRed + '; }\
\
.lfhte-detail-section { margin-bottom: 20px; }\
.lfhte-section-title {\
  font-size: 14px; font-weight: 700; color: ' + C.textPrimary + ';\
  margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px;\
}\
.lfhte-full-desc {\
  font-size: 13px; line-height: 1.7; color: ' + C.textPrimary + '; margin: 0 0 12px;\
}\
.lfhte-best-for { display: flex; gap: 6px; flex-wrap: wrap; }\
.lfhte-best-for-badge {\
  padding: 4px 12px; background: ' + C.infoBox + ';\
  border: 1px solid ' + C.border + '; border-radius: 20px;\
  font-size: 11px; font-weight: 600; color: ' + C.textSecondary + ';\
}\
\
.lfhte-stats-bar {\
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;\
}\
.lfhte-stat-box {\
  text-align: center; padding: 12px 8px;\
  background: ' + C.infoBox + '; border-radius: 8px;\
}\
.lfhte-stat-value {\
  font-size: 14px; font-weight: 700; color: ' + C.primaryRed + '; margin-bottom: 2px;\
}\
.lfhte-stat-label {\
  font-size: 10px; color: ' + C.textSecondary + ';\
  text-transform: uppercase; letter-spacing: 0.3px;\
}\
\
.lfhte-pricing-table { width: 100%; border-collapse: collapse; font-size: 12px; }\
.lfhte-pricing-table th {\
  padding: 10px 8px; background: ' + C.textPrimary + ';\
  color: #fff; text-align: left; font-weight: 600;\
  font-size: 11px; text-transform: uppercase;\
}\
.lfhte-pricing-table td {\
  padding: 10px 8px; border-bottom: 1px solid ' + C.border + ';\
  color: ' + C.textPrimary + ';\
}\
.lfhte-pricing-table tbody tr:hover { background: ' + C.selectedTint + '; }\
.lfhte-pricing-note {\
  font-size: 11px; color: ' + C.textSecondary + ';\
  margin-top: 8px; font-style: italic;\
}\
\
.lfhte-included-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }\
.lfhte-included-item {\
  font-size: 12px; color: ' + C.textPrimary + ';\
  display: flex; align-items: center; gap: 6px;\
}\
.lfhte-check-icon { color: #2E7D32; font-weight: 700; }\
\
.lfhte-detail-actions {\
  display: flex; flex-direction: column; gap: 10px;\
  padding: 16px 0; border-top: 1px solid ' + C.border + ';\
  margin-top: 8px;\
}\
.lfhte-actions-row { display: flex; gap: 10px; }\
\
.lfhte-compare-tray {\
  display: flex; align-items: center; gap: 12px;\
  padding: 12px 20px; background: ' + C.textPrimary + ';\
  border-top: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;\
}\
.lfhte-tray-tours { display: flex; gap: 10px; flex: 1; overflow-x: auto; }\
.lfhte-tray-thumb {\
  display: flex; align-items: center; gap: 8px;\
  padding: 6px 10px; background: rgba(255,255,255,0.1);\
  border-radius: 6px; flex-shrink: 0;\
}\
.lfhte-tray-img {\
  width: 32px; height: 32px; border-radius: 4px;\
  background-size: cover; background-position: center;\
}\
.lfhte-tray-thumb span { color: #fff; font-size: 11px; font-weight: 600; }\
.lfhte-tray-remove {\
  background: transparent; border: none; color: rgba(255,255,255,0.6);\
  cursor: pointer; font-size: 16px; padding: 0; margin-left: 4px;\
}\
.lfhte-tray-remove:hover { color: #fff; }\
.lfhte-tray-compare-btn {\
  padding: 10px 20px; background: ' + C.primaryRed + ';\
  color: #fff; border: none; border-radius: 6px;\
  font-family: \'Inter\', sans-serif; font-size: 12px;\
  font-weight: 600; cursor: pointer; white-space: nowrap;\
  transition: background 0.2s;\
}\
.lfhte-tray-compare-btn:hover { background: #c4221a; }\
\
.lfhte-compare { display: flex; flex-direction: column; height: 100%; }\
.lfhte-compare-header {\
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px;\
}\
.lfhte-compare-title {\
  font-size: 18px; font-weight: 700; color: ' + C.textPrimary + '; margin: 0;\
}\
.lfhte-compare-scroll { flex: 1; overflow: auto; }\
.lfhte-compare-table { width: 100%; border-collapse: collapse; font-size: 13px; }\
.lfhte-compare-table th, .lfhte-compare-table td {\
  padding: 12px; border: 1px solid ' + C.border + ';\
  text-align: left; vertical-align: top;\
}\
.lfhte-compare-th { background: ' + C.infoBox + '; min-width: 160px; }\
.lfhte-compare-tour-name { font-size: 14px; font-weight: 700; color: ' + C.primaryRed + '; }\
.lfhte-compare-tour-sub { font-size: 11px; color: ' + C.textSecondary + '; margin-top: 2px; }\
.lfhte-compare-label { font-weight: 600; background: ' + C.infoBox + '; white-space: nowrap; }\
.lfhte-compare-actions {\
  display: flex; gap: 10px; padding: 16px 0;\
  border-top: 1px solid ' + C.border + '; margin-top: 8px;\
}\
\
@media (max-width: 500px) {\
  .lfhte-stats-bar { grid-template-columns: repeat(2, 1fr); }\
  .lfhte-pricing-table { display: block; overflow-x: auto; }\
  .lfhte-compare-table { min-width: 500px; }\
  .lfhte-hero-image { height: 200px; }\
  .lfhte-filter-bar { padding: 10px 12px; }\
  .lfhte-filter-group { min-width: 100px; }\
  .lfhte-filter-group select { padding: 6px 8px; }\
  .lfhte-included-grid { grid-template-columns: 1fr; }\
}\
';
}

// ============================================================================
// SLIDE PANEL STYLES
// ============================================================================

function _teBuildSlidePanelStyles(C) {
  return '\
.lfhte-sp-overlay {\
  position: absolute; inset: 0; z-index: 100;\
  display: flex; pointer-events: none;\
}\
.lfhte-sp-overlay.open { pointer-events: auto; }\
\
.lfhte-sp-backdrop {\
  flex: 1; background: rgba(0,0,0,0);\
  transition: background 0.3s ease;\
}\
.lfhte-sp-overlay.open .lfhte-sp-backdrop {\
  background: rgba(0,0,0,0.3);\
}\
\
.lfhte-sp-panel {\
  width: 70%; max-width: 480px; height: 100%;\
  background: ' + C.background + ';\
  box-shadow: -4px 0 20px rgba(0,0,0,0.15);\
  display: flex; flex-direction: column;\
  transform: translateX(100%);\
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);\
  overflow: hidden;\
}\
.lfhte-sp-overlay.open .lfhte-sp-panel {\
  transform: translateX(0);\
}\
\
.lfhte-sp-header {\
  display: flex; align-items: center; gap: 12px;\
  padding: 14px 16px; background: ' + C.textPrimary + ';\
  flex-shrink: 0;\
}\
.lfhte-sp-back {\
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);\
  border-radius: 6px; padding: 6px 12px;\
  font-family: \'Inter\', sans-serif; font-size: 11px;\
  font-weight: 700; color: #fff; cursor: pointer;\
  transition: all 0.2s; text-transform: uppercase;\
}\
.lfhte-sp-back:hover { background: rgba(255,255,255,0.2); }\
.lfhte-sp-title {\
  font-family: \'Nexa Rust Sans Black 2\', sans-serif;\
  font-size: 13px; font-weight: 900; color: #fff;\
  text-transform: uppercase; letter-spacing: 1.5px;\
}\
\
.lfhte-sp-content {\
  flex: 1; overflow-y: auto;\
}\
.lfhte-sp-content::-webkit-scrollbar { width: 5px; }\
.lfhte-sp-content::-webkit-scrollbar-thumb {\
  background: ' + C.border + '; border-radius: 3px;\
}\
\
@media (max-width: 600px) {\
  .lfhte-sp-panel { width: 100%; max-width: 100%; }\
}\
';
}
