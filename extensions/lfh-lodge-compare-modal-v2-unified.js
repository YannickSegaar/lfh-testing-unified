/**
 * Last Frontier Lodge Compare - Shared Modal Module
 *
 * Full-screen overlay modal with 3-tab navigation:
 * - Overview: Side-by-side comparison
 * - Bell 2 Lodge: Full detail view with video, gallery, terrain
 * - Ripley Creek: Full detail view with video, gallery, terrain
 *
 * Imported by the in-chat lodge compare widget.
 *
 * Unified Event Architecture: All interact calls use { type: 'event', payload: { event, data } }
 *
 * @version 2.0.1-unified
 * @author Last Frontier Heliskiing / RomAIx
 */

// Import shared constants from tour explorer
import { LFH_COLORS, LFH_ASSETS } from '../lfh-tour-explorer-modal.js';
// Import tour explorer for lodge→tour handoff
import { openTourExplorerModalWithBookingUnified } from './lfh-tour-explorer-modal-booking-unified.js';
// Import weather modal for cross-navigation
import { openWeatherConditionsModal } from './lfh-weather-conditions-modal-unified.js';

// Re-export for widget use
export { LFH_COLORS, LFH_ASSETS };

// ============================================================================
// VIMEO VIDEO IDS
// ============================================================================

export const LFH_LODGE_VIDEOS = {
  lodging: '237992712',
  location: '234398800',
  dayInLife: '247898299',
};

// ============================================================================
// LODGE DATA
// ============================================================================

export const LFH_LODGES = {
  bell2: {
    id: 'bell2',
    name: 'Bell 2 Lodge',
    tagline: 'Remote & Off-the-Grid',
    capacity: 36,
    location: 'Skeena Mountains',
    style: 'Log Cabins',
    description:
      'Off-the-grid village custom-built for heli skiing. A purpose-built heliski village nestled in the heart of the Skeena Mountains, Bell 2 Lodge offers total immersion in the wilderness with no distractions.',
    fullDescription:
      'Bell 2 Lodge is a purpose-built heliski village nestled in the heart of the Skeena Mountains. This off-the-grid sanctuary offers total immersion in the wilderness—no cell service, no distractions, just pristine powder and mountain living. The lodge features cozy log chalets with wood-burning soapstone stoves, a main lodge with world-class dining, and a true sense of adventure community.',
    heroImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/01-bell-2-lodge-heliski-village.jpg',
    videoId: '237992712',
    images: {
      hero: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/01-bell-2-lodge-heliski-village.jpg',
      dusk: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/05-bell-2-lodge-dusk.jpg',
      dining: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/06-dining-room-bell-2-lodge.jpg',
      bar: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/09-bell-2-lodge-rustic-bar.jpg',
      lobby: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/07-lobby-gift-shop-bell-2-lodge.jpg',
      chalet: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/03-log-chalet-village.jpg',
      bonfire: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/04-bonfire-bell-2-lodge.jpg',
      fitness: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/19-fitness-centre.jpg',
      room: 'https://www.lastfrontierheli.com/wp-content/uploads/2023/04/2023-02-01-Bell-2-Lodge-Steve-Rosset-27-2.jpg',
      hotTub: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/08-outdoor-hot-tub-northern-bc.jpg',
      aerial: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/2-bell-2-lodge-skeena-mountains-aerial-context.jpg',
    },
    gallery: [
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/01-bell-2-lodge-heliski-village.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/05-bell-2-lodge-dusk.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/06-dining-room-bell-2-lodge.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/03-log-chalet-village.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/08-outdoor-hot-tub-northern-bc.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/09-bell-2-lodge-rustic-bar.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/04-bonfire-bell-2-lodge.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/19-fitness-centre.jpg',
    ],
    features: {
      accommodation: 'Cozy log chalet rooms with wood-burning soapstone stoves',
      dining: 'Main lodge dining room with full bar and professional chefs',
      amenities: ['Hot tub', 'Sauna', 'Fitness centre', 'Games room', 'Gift shop'],
      activities: ['Snowshoeing', 'Fat biking', 'Cross-country skiing', 'Archery', 'Skeet shooting'],
      connectivity: 'Off-grid, no cell service, high-speed internet available',
      helipad: 'On-site, depart directly from lodge',
    },
    terrain: {
      skillLevel: 'Strong Intermediate to Expert',
      type: 'Skeena Mountains',
      characteristics: ['Towering peaks', 'Wide-open bowls', 'Glaciers', 'Natural glades'],
      treeSkiing: 'Close to lodge during unfavourable weather',
      commute: '5-minute flight to closest runs',
      snowfall: 'Consistent deep powder',
      aerialImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/2-bell-2-lodge-skeena-mountains-aerial-context.jpg',
      runPhotos: [
        'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/1-heli-skiing-terrain-bell-2-lodge.jpg',
        'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/2-heli-skiing-terrain-bell-2-lodge.jpg',
        'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/3-heli-skiing-terrain-bell-2-lodge.jpg',
        'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/4-heli-skiing-terrain-bell-2-lodge.jpg',
      ],
      aerialContextImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/2-bell-2-lodge-skeena-mountains-aerial-context.jpg',
      locationLayoutImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/3-bell-2-lodge-property-map-location-layout.jpg',
    },
  },
  ripley: {
    id: 'ripley',
    name: 'Ripley Creek',
    tagline: 'Historic Mining Town Character',
    capacity: 24,
    location: 'Stewart, BC (Alaska Border)',
    style: 'Heritage Hotel',
    description:
      'Historic mining town of Stewart, BC offers a unique character-filled experience. The Ripley Creek Inn features quirky heritage rooms in converted prospector houses and old shops, with the charming town of Stewart at your doorstep.',
    fullDescription:
      'Ripley Creek offers a completely different heliski experience in the historic mining town of Stewart, BC, at the Alaska border. The quirky heritage accommodations are spread across converted prospector houses and old shops, each with unique character. After skiing the massive Coast Mountain terrain, explore the charming town, visit local establishments, and experience the legendary "getting Hyderized" across the border in Hyder, Alaska.',
    heroImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/02-ripley-creek-inn-stewart.jpg',
    videoId: '237992712',
    images: {
      hero: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/02-ripley-creek-inn-stewart.jpg',
      boardwalk: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/01-ocean-boardwalk-stewart-bc.jpg',
      room: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/04-guest-room-ripley-creek-inn.jpg',
      dining: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/05-dinner-dining-room-stewart.jpg',
      bar: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/06-last-frontier-bar-stewart.jpg',
      lounge: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/10-lounging-area-ripley-creek.jpg',
      bootRoom: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/14-ski-boot-room-ripley-creek.jpg',
      giftShop: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/11-gift-shop-stewart-bc.jpg',
      stewartDusk: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/12-stweart-bc-dusk-winter.jpg',
      mainStreet: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/16-main-street-stewart-spring.jpg',
      aerial: 'https://www.lastfrontierheli.com/wp-content/uploads/2019/10/4-ripley-creek-stewart-bc-aerial-context2.jpg',
    },
    gallery: [
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/02-ripley-creek-inn-stewart.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/01-ocean-boardwalk-stewart-bc.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/04-guest-room-ripley-creek-inn.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/05-dinner-dining-room-stewart.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/06-last-frontier-bar-stewart.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/10-lounging-area-ripley-creek.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/12-stweart-bc-dusk-winter.jpg',
      'https://www.lastfrontierheli.com/wp-content/uploads/2019/10/4-ripley-creek-stewart-bc-aerial-context2.jpg',
    ],
    features: {
      accommodation: 'Unique heritage rooms - converted prospector houses and old shops',
      dining: 'Bitter Creek Cafe across the street, legendary local cuisine',
      amenities: ['Hot tub', 'Sauna', 'Lounge areas', 'Gift shop', 'Boot room'],
      activities: ['Explore Stewart', 'Museum visits', 'Get Hyderized in Alaska', 'Local pubs'],
      connectivity: 'Cell service and medium-speed internet',
      helipad: 'In town, shuttle to staging areas',
    },
    terrain: {
      skillLevel: 'Advanced to Expert Only',
      type: 'Coast Mountains',
      characteristics: ['Steeper terrain', 'Epic old-growth tree skiing', 'Massive glacier runs'],
      treeSkiing: 'Sweeping glaciated slopes and longer tree runs',
      commute: 'Longer commute, terrain further from Stewart',
      snowfall: '30% more snow on average',
      aerialImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2019/10/4-ripley-creek-stewart-bc-aerial-context2.jpg',
      runPhotos: [
        'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/1-heli-skiing-terrain-ripley-creek.jpg',
        'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/2-heli-skiing-terrain-ripley-creek.jpg',
        'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/3-heli-skiing-terrain-ripley-creek.jpg',
        'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/4-heli-skiing-terrain-ripley-creek.jpg',
      ],
      aerialContextImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2019/10/4-ripley-creek-stewart-bc-aerial-context2.jpg',
      locationLayoutImage: 'https://www.lastfrontierheli.com/wp-content/uploads/2018/11/ripley-creek-stewart-property-map-location-layout.jpg',
    },
  },
};

// ============================================================================
// COMPARISON DATA
// ============================================================================

const COMPARISON_CATEGORIES = [
  {
    label: 'Capacity',
    bell2: '36 guests',
    ripley: '24 guests',
    icon: '●●',
  },
  {
    label: 'Location',
    bell2: 'Skeena Mountains',
    ripley: 'Stewart, BC',
    icon: '◉',
  },
  {
    label: 'Accommodation Style',
    bell2: 'Log cabin chalets',
    ripley: 'Heritage hotel rooms',
    icon: '⌂',
  },
  {
    label: 'Terrain Level',
    bell2: 'Intermediate to Expert',
    ripley: 'Advanced to Expert',
    icon: '⛰',
  },
  {
    label: 'Snowfall',
    bell2: 'Consistent deep powder',
    ripley: '30% more snow on average',
    icon: '❄',
  },
  {
    label: 'Commute to Terrain',
    bell2: '5-minute helicopter flight',
    ripley: 'Longer commute, varied staging',
    icon: '→',
  },
  {
    label: 'Connectivity',
    bell2: 'Off-grid (WiFi available)',
    ripley: 'Cell service + WiFi',
    icon: '◎',
  },
  {
    label: 'Vibe',
    bell2: 'Wilderness immersion',
    ripley: 'Town character & culture',
    icon: '★',
  },
];

// ============================================================================
// HELPER: VoiceFlow Agent Communication (Unified Event Architecture)
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
  } catch (e) { console.log('[LodgeCompare] interact error:', e); }
}

// ============================================================================
// LIGHTBOX: Location Layout
// ============================================================================

function showLayoutLightbox(lodgeId) {
  const lodge = LFH_LODGES[lodgeId];
  if (!lodge?.terrain?.locationLayoutImage) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lfhlc-lightbox';
  lightbox.id = 'lfhlc-layout-lightbox';
  lightbox.innerHTML = `
    <div class="lfhlc-lightbox-backdrop"></div>
    <div class="lfhlc-lightbox-content">
      <button class="lfhlc-lightbox-close">&times;</button>
      <img src="${lodge.terrain.locationLayoutImage}" alt="${lodge.name} Layout" />
      <p class="lfhlc-lightbox-caption">${lodge.name} Property Layout • Tap to close</p>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Close handlers
  const closeLightbox = () => {
    lightbox.style.animation = 'lfhlc-fadeOut 0.2s ease forwards';
    setTimeout(() => lightbox.remove(), 200);
    document.removeEventListener('keydown', escHandler);
  };

  lightbox.querySelector('.lfhlc-lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lfhlc-lightbox-backdrop')?.addEventListener('click', closeLightbox);

  // Touch: swipe down to close
  let touchStartY = 0;
  const contentEl = lightbox.querySelector('.lfhlc-lightbox-content');
  contentEl?.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  contentEl?.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].screenY;
    if (touchEndY - touchStartY > 100) {
      closeLightbox(); // Swipe down to close
    }
  }, { passive: true });

  const escHandler = (e) => {
    if (e.key === 'Escape' && document.getElementById('lfhlc-layout-lightbox')) {
      closeLightbox();
    }
  };
  document.addEventListener('keydown', escHandler);

  silentVariableUpdate('ext_viewed_layout', lodgeId);
}

// ============================================================================
// LIGHTBOX: Run Photo
// ============================================================================

function showRunPhotoLightbox(lodgeId, photoIndex) {
  const lodge = LFH_LODGES[lodgeId];
  if (!lodge?.terrain?.runPhotos?.[photoIndex]) return;

  const photos = lodge.terrain.runPhotos;
  let currentIndex = photoIndex;

  const lightbox = document.createElement('div');
  lightbox.className = 'lfhlc-lightbox';
  lightbox.id = 'lfhlc-run-photo-lightbox';

  // Touch swipe state
  let touchStartX = 0;
  let touchEndX = 0;

  function nextPhoto() {
    if (photos.length > 1) {
      currentIndex = (currentIndex + 1) % photos.length;
      updateLightboxContent();
    }
  }

  function prevPhoto() {
    if (photos.length > 1) {
      currentIndex = (currentIndex - 1 + photos.length) % photos.length;
      updateLightboxContent();
    }
  }

  function updateLightboxContent() {
    lightbox.innerHTML = `
      <div class="lfhlc-lightbox-backdrop"></div>
      <div class="lfhlc-lightbox-content lfhlc-lightbox-photo">
        <button class="lfhlc-lightbox-close">&times;</button>
        ${photos.length > 1 ? `<button class="lfhlc-lightbox-nav lfhlc-nav-prev">‹</button>` : ''}
        <img src="${photos[currentIndex]}" alt="${lodge.name} Run ${currentIndex + 1}" />
        ${photos.length > 1 ? `<button class="lfhlc-lightbox-nav lfhlc-nav-next">›</button>` : ''}
        <p class="lfhlc-lightbox-caption">${lodge.name} - Run ${currentIndex + 1} of ${photos.length}${photos.length > 1 ? ' • Swipe to navigate' : ''}</p>
      </div>
    `;

    // Re-attach event listeners
    lightbox.querySelector('.lfhlc-lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lfhlc-lightbox-backdrop')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lfhlc-nav-prev')?.addEventListener('click', prevPhoto);
    lightbox.querySelector('.lfhlc-nav-next')?.addEventListener('click', nextPhoto);

    // Touch swipe handlers for mobile
    const contentEl = lightbox.querySelector('.lfhlc-lightbox-content');
    contentEl?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    contentEl?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (swipeDistance < -50) nextPhoto();  // Swipe left = next
      if (swipeDistance > 50) prevPhoto();   // Swipe right = prev
    }, { passive: true });
  }

  const closeLightbox = () => {
    lightbox.style.animation = 'lfhlc-fadeOut 0.2s ease forwards';
    setTimeout(() => lightbox.remove(), 200);
    document.removeEventListener('keydown', keyHandler);
  };

  const keyHandler = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevPhoto();
    } else if (e.key === 'ArrowRight') {
      nextPhoto();
    }
  };
  document.addEventListener('keydown', keyHandler);

  updateLightboxContent();
  document.body.appendChild(lightbox);

  silentVariableUpdate('ext_viewed_run_photo', `${lodgeId}_${photoIndex}`);
}

// ============================================================================
// MODAL: Open
// ============================================================================

export function openLodgeCompareModal(focusLodge = null, initialTab = 'overview') {
  if (document.getElementById('lfh-lodge-compare-modal')) return;

  // Map old tab names to new ones
  if (initialTab === 'lodges' || initialTab === 'terrain') {
    initialTab = 'overview';
  }

  // State
  let activeTab = focusLodge || initialTab; // 'overview' | 'bell2' | 'ripley'
  let activeGalleryIndex = 0;
  let actionTaken = false;
  const abortController = new AbortController();

  // --- Create Modal Shell ---
  const backdrop = document.createElement('div');
  backdrop.id = 'lfh-lodge-compare-modal';
  backdrop.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7); z-index: 10000;
    display: flex; justify-content: center; align-items: center;
    animation: lfhlc-fadeIn 0.3s ease;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    width: 90%; max-width: 960px; height: 85%; max-height: 780px;
    background: ${LFH_COLORS.background}; border-radius: 12px;
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: lfhlc-slideUp 0.4s ease;
  `;

  // --- Inject Styles ---
  const styleEl = document.createElement('style');
  styleEl.textContent = buildModalStyles();
  modal.appendChild(styleEl);

  // --- Header Bar ---
  const headerBar = document.createElement('div');
  headerBar.className = 'lfhlc-header-bar';
  headerBar.innerHTML = `
    <span class="lfhlc-header-title">Lodge Compare</span>
    <button class="lfhlc-close-btn" aria-label="Close">&times;</button>
  `;
  modal.appendChild(headerBar);

  // --- Tab Bar ---
  const tabBar = document.createElement('div');
  tabBar.className = 'lfhlc-tab-bar';
  tabBar.innerHTML = `
    <button class="lfhlc-tab ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
      Overview
    </button>
    <button class="lfhlc-tab ${activeTab === 'bell2' ? 'active' : ''}" data-tab="bell2">
      Bell 2 Lodge
    </button>
    <button class="lfhlc-tab ${activeTab === 'ripley' ? 'active' : ''}" data-tab="ripley">
      Ripley Creek
    </button>
    <button class="lfhlc-tab ${activeTab === 'terrain' ? 'active' : ''}" data-tab="terrain">
      Terrain
    </button>
  `;
  modal.appendChild(tabBar);

  // --- Main Content Area ---
  const content = document.createElement('div');
  content.className = 'lfhlc-content';
  content.id = 'lfhlc-content';
  modal.appendChild(content);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // --- Render Initial View ---
  renderActiveTab();

  // Silent variable update
  silentVariableUpdate('ext_last_action', 'lodge_compare_opened');
  if (focusLodge) {
    silentVariableUpdate('ext_focus_lodge', focusLodge);
  }

  // ========================================================================
  // RENDER: Active Tab
  // ========================================================================

  function renderActiveTab() {
    updateTabState();
    activeGalleryIndex = 0;

    if (activeTab === 'overview') {
      renderOverviewTab();
    } else if (activeTab === 'bell2') {
      renderLodgeDetail(LFH_LODGES.bell2);
    } else if (activeTab === 'ripley') {
      renderLodgeDetail(LFH_LODGES.ripley);
    } else if (activeTab === 'terrain') {
      renderTerrainTab();
    }
  }

  // ========================================================================
  // RENDER: Overview Tab (Side-by-Side Comparison)
  // ========================================================================

  function renderOverviewTab() {
    const bell2 = LFH_LODGES.bell2;
    const ripley = LFH_LODGES.ripley;

    content.innerHTML = `
      <div class="lfhlc-overview">
        <!-- Lodge Cards Row -->
        <div class="lfhlc-overview-cards">
          <div class="lfhlc-overview-card" data-lodge="bell2">
            <div class="lfhlc-overview-hero" style="background-image: url('${bell2.heroImage}')">
              <div class="lfhlc-overview-hero-overlay">
                <h3 class="lfhlc-overview-lodge-name">${bell2.name}</h3>
                <p class="lfhlc-overview-lodge-tagline">${bell2.tagline}</p>
              </div>
            </div>
            <div class="lfhlc-overview-card-body">
              <div class="lfhlc-overview-quick-stats">
                <span class="lfhlc-quick-stat">${bell2.capacity} guests</span>
                <span class="lfhlc-quick-stat">${bell2.style}</span>
                <span class="lfhlc-quick-stat">${bell2.terrain.skillLevel.split(' to ')[0]}+</span>
              </div>
              <div class="lfhlc-card-actions">
                <button class="lfhlc-btn-primary lfhlc-view-lodge-btn" data-lodge="bell2">Explore Bell 2</button>
                <button class="lfhlc-btn-outline lfhlc-view-lodge-tours-btn" data-lodge="bell2">View Tours</button>
              </div>
            </div>
          </div>

          <div class="lfhlc-overview-card" data-lodge="ripley">
            <div class="lfhlc-overview-hero" style="background-image: url('${ripley.heroImage}')">
              <div class="lfhlc-overview-hero-overlay">
                <h3 class="lfhlc-overview-lodge-name">${ripley.name}</h3>
                <p class="lfhlc-overview-lodge-tagline">${ripley.tagline}</p>
              </div>
            </div>
            <div class="lfhlc-overview-card-body">
              <div class="lfhlc-overview-quick-stats">
                <span class="lfhlc-quick-stat">${ripley.capacity} guests</span>
                <span class="lfhlc-quick-stat">${ripley.style}</span>
                <span class="lfhlc-quick-stat">${ripley.terrain.skillLevel.split(' to ')[0]}+</span>
              </div>
              <div class="lfhlc-card-actions">
                <button class="lfhlc-btn-primary lfhlc-view-lodge-btn" data-lodge="ripley">Explore Ripley Creek</button>
                <button class="lfhlc-btn-outline lfhlc-view-lodge-tours-btn" data-lodge="ripley">View Tours</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Table -->
        <div class="lfhlc-comparison-section">
          <h3 class="lfhlc-section-title">Side-by-Side Comparison</h3>
          <div class="lfhlc-comparison-table">
            <div class="lfhlc-comparison-header">
              <div class="lfhlc-comp-cell lfhlc-comp-label"></div>
              <div class="lfhlc-comp-cell lfhlc-comp-lodge">Bell 2 Lodge</div>
              <div class="lfhlc-comp-cell lfhlc-comp-lodge">Ripley Creek</div>
            </div>
            ${COMPARISON_CATEGORIES.map(
              (cat) => `
              <div class="lfhlc-comparison-row">
                <div class="lfhlc-comp-cell lfhlc-comp-label">
                  <span class="lfhlc-comp-icon">${cat.icon}</span>
                  ${cat.label}
                </div>
                <div class="lfhlc-comp-cell">${cat.bell2}</div>
                <div class="lfhlc-comp-cell">${cat.ripley}</div>
              </div>
            `
            ).join('')}
          </div>
        </div>

        <!-- Help Me Choose CTA -->
        <div class="lfhlc-overview-cta">
          <div class="lfhlc-cta-buttons">
            <button class="lfhlc-btn-primary lfhlc-help-choose-btn">
              Help Me Choose the Right Lodge
            </button>
            <button class="lfhlc-btn-outline lfhlc-browse-tours-btn">
              Browse All Tours &rarr;
            </button>
            <button class="lfhlc-btn-outline lfhlc-conditions-btn">
              &#9729; Check Conditions
            </button>
          </div>
          <p class="lfhlc-cta-subtext">Our AI will ask about your preferences and recommend the best fit</p>
        </div>
      </div>
    `;

    // Event listeners
    content.querySelectorAll('.lfhlc-view-lodge-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.lodge;
        renderActiveTab();
      });
    });

    content.querySelectorAll('.lfhlc-overview-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.lfhlc-view-lodge-btn') && !e.target.closest('.lfhlc-view-lodge-tours-btn')) {
          activeTab = card.dataset.lodge;
          renderActiveTab();
        }
      });
    });

    // View Tours buttons on lodge cards (filtered to that lodge)
    content.querySelectorAll('.lfhlc-view-lodge-tours-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lodgeId = btn.dataset.lodge;
        actionTaken = true;
        closeModal();
        setTimeout(() => {
          openTourExplorerModalWithBookingUnified(null, {
            initialLodgeFilter: lodgeId,
            onCompareLodges: (returnLodgeId) => {
              openLodgeCompareModal(returnLodgeId || lodgeId);
            },
            onCheckConditions: () => openWeatherConditionsModal(),
          });
        }, 350);
      });
    });

    content.querySelector('.lfhlc-help-choose-btn')?.addEventListener('click', () => {
      interactWithAgent('ext_user_action', { action: 'lodge_recommendation_request', source: 'lodge_compare' });
      actionTaken = true;
      closeModal();
    });

    content.querySelector('.lfhlc-browse-tours-btn')?.addEventListener('click', () => {
      actionTaken = true;
      closeModal();
      setTimeout(() => {
        openTourExplorerModalWithBookingUnified(null, {
          onCompareLodges: (lodgeId) => {
            openLodgeCompareModal(lodgeId || null);
          },
          onCheckConditions: () => openWeatherConditionsModal(),
        });
      }, 350);
    });

    content.querySelector('.lfhlc-conditions-btn')?.addEventListener('click', () => {
      actionTaken = true;
      closeModal();
      setTimeout(() => openWeatherConditionsModal(), 350);
    });
  }

  // ========================================================================
  // RENDER: Terrain Tab (Side-by-Side Terrain Comparison)
  // ========================================================================

  function renderTerrainTab() {
    const bell2 = LFH_LODGES.bell2;
    const ripley = LFH_LODGES.ripley;

    const terrainCategories = [
      { label: 'Skill Level', bell2: bell2.terrain.skillLevel, ripley: ripley.terrain.skillLevel, icon: '⛰' },
      { label: 'Mountain Range', bell2: bell2.terrain.type, ripley: ripley.terrain.type, icon: '◉' },
      { label: 'Snowfall', bell2: bell2.terrain.snowfall, ripley: ripley.terrain.snowfall, icon: '❄' },
      { label: 'Tree Skiing', bell2: bell2.terrain.treeSkiing, ripley: ripley.terrain.treeSkiing, icon: '↟' },
      { label: 'Commute', bell2: bell2.terrain.commute, ripley: ripley.terrain.commute, icon: '→' },
      { label: 'Characteristics', bell2: bell2.terrain.characteristics.join(', '), ripley: ripley.terrain.characteristics.join(', '), icon: '★' },
    ];

    // Generate run photos HTML
    const bell2RunPhotosHTML = (bell2.terrain.runPhotos || [])
      .map((url, i) => `<div class="lfhlc-run-photo" style="background-image: url('${url}')" data-lodge="bell2" data-index="${i}"></div>`)
      .join('');
    const ripleyRunPhotosHTML = (ripley.terrain.runPhotos || [])
      .map((url, i) => `<div class="lfhlc-run-photo" style="background-image: url('${url}')" data-lodge="ripley" data-index="${i}"></div>`)
      .join('');

    content.innerHTML = `
      <div class="lfhlc-terrain-tab">
        <h3 class="lfhlc-section-title">Terrain Comparison</h3>

        <!-- Aerial Context Section -->
        <div class="lfhlc-aerial-context-section">
          <div class="lfhlc-terrain-images">
            <div class="lfhlc-terrain-card">
              <img src="${bell2.terrain.aerialContextImage || bell2.terrain.aerialImage}" alt="Bell 2 terrain" class="lfhlc-terrain-card-img" />
              <div class="lfhlc-terrain-card-label">
                <strong>Bell 2 Lodge</strong>
                <span>${bell2.terrain.type}</span>
              </div>
            </div>
            <div class="lfhlc-terrain-card">
              <img src="${ripley.terrain.aerialContextImage || ripley.terrain.aerialImage}" alt="Ripley Creek terrain" class="lfhlc-terrain-card-img" />
              <div class="lfhlc-terrain-card-label">
                <strong>Ripley Creek</strong>
                <span>${ripley.terrain.type}</span>
              </div>
            </div>
          </div>
          <div class="lfhlc-layout-btns">
            <button class="lfhlc-layout-btn" data-lodge="bell2">View Bell 2 Layout</button>
            <button class="lfhlc-layout-btn" data-lodge="ripley">View Ripley Layout</button>
          </div>
        </div>

        <!-- Run Photos Gallery -->
        <div class="lfhlc-run-photos-section">
          <div class="lfhlc-run-photos-group">
            <p class="lfhlc-run-photos-label">Bell 2 Lodge Runs</p>
            <div class="lfhlc-run-photos-strip">${bell2RunPhotosHTML}</div>
          </div>
          <div class="lfhlc-run-photos-group">
            <p class="lfhlc-run-photos-label">Ripley Creek Runs</p>
            <div class="lfhlc-run-photos-strip">${ripleyRunPhotosHTML}</div>
          </div>
        </div>

        <!-- Terrain comparison table -->
        <div class="lfhlc-comparison-table">
          <div class="lfhlc-comparison-header">
            <div class="lfhlc-comp-cell lfhlc-comp-label"></div>
            <div class="lfhlc-comp-cell lfhlc-comp-lodge">Bell 2 Lodge</div>
            <div class="lfhlc-comp-cell lfhlc-comp-lodge">Ripley Creek</div>
          </div>
          ${terrainCategories.map(
            (cat) => `
            <div class="lfhlc-comparison-row">
              <div class="lfhlc-comp-cell lfhlc-comp-label">
                <span class="lfhlc-comp-icon">${cat.icon}</span>
                ${cat.label}
              </div>
              <div class="lfhlc-comp-cell">${cat.bell2}</div>
              <div class="lfhlc-comp-cell">${cat.ripley}</div>
            </div>
          `
          ).join('')}
        </div>

        <!-- CTA -->
        <div class="lfhlc-terrain-cta">
          <div class="lfhlc-cta-buttons">
            <button class="lfhlc-btn-primary lfhlc-terrain-recommend-btn">
              Which Terrain Suits My Skill Level?
            </button>
            <button class="lfhlc-btn-outline lfhlc-browse-tours-btn">
              Browse All Tours &rarr;
            </button>
          </div>
          <p class="lfhlc-cta-subtext">Our AI will help match you to the right terrain</p>
        </div>
      </div>
    `;

    // Event listener for CTA
    content.querySelector('.lfhlc-terrain-recommend-btn')?.addEventListener('click', () => {
      interactWithAgent('ext_user_action', { action: 'terrain_recommendation_request', source: 'lodge_compare' });
      actionTaken = true;
      closeModal();
    });

    content.querySelector('.lfhlc-browse-tours-btn')?.addEventListener('click', () => {
      actionTaken = true;
      closeModal();
      setTimeout(() => {
        openTourExplorerModalWithBookingUnified(null, {
          onCompareLodges: (lodgeId) => {
            openLodgeCompareModal(lodgeId || null);
          },
          onCheckConditions: () => openWeatherConditionsModal(),
        });
      }, 350);
    });

    // Event listeners for layout buttons
    content.querySelectorAll('.lfhlc-layout-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        showLayoutLightbox(btn.dataset.lodge);
      });
    });

    // Event listeners for run photos
    content.querySelectorAll('.lfhlc-run-photo').forEach((photo) => {
      photo.addEventListener('click', () => {
        showRunPhotoLightbox(photo.dataset.lodge, parseInt(photo.dataset.index));
      });
    });
  }

  // ========================================================================
  // RENDER: Lodge Detail View
  // ========================================================================

  function renderLodgeDetail(lodge) {
    const galleryHTML = lodge.gallery
      .map(
        (img, i) => `
        <div class="lfhlc-gallery-thumb ${i === 0 ? 'active' : ''}"
             style="background-image: url('${img}')"
             data-index="${i}"></div>
      `
      )
      .join('');

    const amenitiesHTML = lodge.features.amenities
      .map((a) => `<span class="lfhlc-feature-tag">${a}</span>`)
      .join('');

    const activitiesHTML = lodge.features.activities
      .map((a) => `<span class="lfhlc-feature-tag">${a}</span>`)
      .join('');

    const terrainCharsHTML = lodge.terrain.characteristics
      .map((c) => `<span class="lfhlc-feature-tag">${c}</span>`)
      .join('');

    content.innerHTML = `
      <div class="lfhlc-detail">
        <div class="lfhlc-detail-scroll">
          <!-- Hero Media -->
          <div class="lfhlc-hero-media" id="lfhlc-hero-media">
            <div class="lfhlc-hero-image" style="background-image: url('${lodge.gallery[0]}')">
              <button class="lfhlc-play-btn" id="lfhlc-play-video" data-vimeo="${lodge.videoId}">
                <span class="lfhlc-play-triangle"></span>
              </button>
              <div class="lfhlc-hero-label">Watch: Lodging Experience</div>
            </div>
          </div>

          <!-- Gallery Strip -->
          <div class="lfhlc-gallery-strip">${galleryHTML}</div>

          <!-- Lodge Info -->
          <div class="lfhlc-detail-section">
            <p class="lfhlc-full-desc">${lodge.fullDescription}</p>
          </div>

          <!-- Quick Stats -->
          <div class="lfhlc-stats-bar">
            <div class="lfhlc-stat-box">
              <div class="lfhlc-stat-value">${lodge.capacity}</div>
              <div class="lfhlc-stat-label">Guests</div>
            </div>
            <div class="lfhlc-stat-box">
              <div class="lfhlc-stat-value">${lodge.style}</div>
              <div class="lfhlc-stat-label">Accommodation</div>
            </div>
            <div class="lfhlc-stat-box">
              <div class="lfhlc-stat-value">${lodge.terrain.skillLevel.split(' to ')[0]}</div>
              <div class="lfhlc-stat-label">Skill Level</div>
            </div>
            <div class="lfhlc-stat-box">
              <div class="lfhlc-stat-value">4:1</div>
              <div class="lfhlc-stat-label">Guest:Guide</div>
            </div>
          </div>

          <!-- Features Grid -->
          <div class="lfhlc-features-grid">
            <div class="lfhlc-feature-section">
              <h4 class="lfhlc-feature-title">Accommodation</h4>
              <p class="lfhlc-feature-text">${lodge.features.accommodation}</p>
            </div>

            <div class="lfhlc-feature-section">
              <h4 class="lfhlc-feature-title">Dining</h4>
              <p class="lfhlc-feature-text">${lodge.features.dining}</p>
            </div>

            <div class="lfhlc-feature-section">
              <h4 class="lfhlc-feature-title">Amenities</h4>
              <div class="lfhlc-feature-tags">${amenitiesHTML}</div>
            </div>

            <div class="lfhlc-feature-section">
              <h4 class="lfhlc-feature-title">Activities</h4>
              <div class="lfhlc-feature-tags">${activitiesHTML}</div>
            </div>

            <div class="lfhlc-feature-section">
              <h4 class="lfhlc-feature-title">Connectivity</h4>
              <p class="lfhlc-feature-text">${lodge.features.connectivity}</p>
            </div>

            <div class="lfhlc-feature-section">
              <h4 class="lfhlc-feature-title">Helipad Access</h4>
              <p class="lfhlc-feature-text">${lodge.features.helipad}</p>
            </div>
          </div>

          <!-- Terrain Section (Collapsible) -->
          <div class="lfhlc-terrain-section">
            <button class="lfhlc-terrain-toggle" id="lfhlc-terrain-toggle">
              <span class="lfhlc-terrain-toggle-icon">⛰</span>
              Terrain Information
              <span class="lfhlc-terrain-arrow" style="transform: rotate(180deg)">▾</span>
            </button>
            <div class="lfhlc-terrain-content open" id="lfhlc-terrain-content">
              <div class="lfhlc-terrain-map">
                <img src="${lodge.terrain.aerialImage}" alt="${lodge.name} terrain" class="lfhlc-terrain-image" />
              </div>
              <div class="lfhlc-terrain-details">
                <div class="lfhlc-terrain-row">
                  <span class="lfhlc-terrain-label">Skill Level</span>
                  <span class="lfhlc-terrain-value">${lodge.terrain.skillLevel}</span>
                </div>
                <div class="lfhlc-terrain-row">
                  <span class="lfhlc-terrain-label">Mountain Range</span>
                  <span class="lfhlc-terrain-value">${lodge.terrain.type}</span>
                </div>
                <div class="lfhlc-terrain-row">
                  <span class="lfhlc-terrain-label">Characteristics</span>
                  <div class="lfhlc-feature-tags">${terrainCharsHTML}</div>
                </div>
                <div class="lfhlc-terrain-row">
                  <span class="lfhlc-terrain-label">Tree Skiing</span>
                  <span class="lfhlc-terrain-value">${lodge.terrain.treeSkiing}</span>
                </div>
                <div class="lfhlc-terrain-row">
                  <span class="lfhlc-terrain-label">Commute</span>
                  <span class="lfhlc-terrain-value">${lodge.terrain.commute}</span>
                </div>
                <div class="lfhlc-terrain-row">
                  <span class="lfhlc-terrain-label">Snowfall</span>
                  <span class="lfhlc-terrain-value lfhlc-highlight">${lodge.terrain.snowfall}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="lfhlc-detail-actions">
            <button class="lfhlc-btn-primary lfhlc-action-book" data-lodge="${lodge.id}">
              Book ${lodge.name}
            </button>
            <button class="lfhlc-btn-outline lfhlc-action-ask" data-lodge="${lodge.id}">
              Ask About ${lodge.name}
            </button>
          </div>
        </div>
      </div>
    `;

    // Event listeners

    // Gallery thumbnails
    content.querySelectorAll('.lfhlc-gallery-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        activeGalleryIndex = parseInt(thumb.dataset.index);
        updateHeroImage(lodge);

        // Update active state
        content.querySelectorAll('.lfhlc-gallery-thumb').forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    // Play video
    content.querySelector('#lfhlc-play-video')?.addEventListener('click', (e) => {
      playVideo(e.currentTarget.dataset.vimeo, lodge);
    });

    // Terrain toggle
    content.querySelector('#lfhlc-terrain-toggle')?.addEventListener('click', () => {
      const terrainContent = content.querySelector('#lfhlc-terrain-content');
      const arrow = content.querySelector('.lfhlc-terrain-arrow');
      const isOpen = terrainContent.classList.contains('open');

      if (isOpen) {
        terrainContent.classList.remove('open');
        arrow.style.transform = 'rotate(0deg)';
      } else {
        terrainContent.classList.add('open');
        arrow.style.transform = 'rotate(180deg)';
      }
    });

    // Book CTA → notify AI, then hand off to Tour Explorer pre-filtered to this lodge
    content.querySelector('.lfhlc-action-book')?.addEventListener('click', () => {
      silentVariableUpdate('ext_lodge_selected', lodge.id);
      actionTaken = true;

      // Fire event so AI responds with contextual message in chat
      interactWithAgent('ext_user_action', {
        action: 'view_lodge_tours',
        source: 'lodge_compare',
        lodge: lodge.id,
        lodgeName: lodge.name,
      });

      closeModal();

      // Open Tour Explorer after AI has time to respond (~1.5s)
      setTimeout(() => {
        openTourExplorerModalWithBookingUnified(null, {
          initialLodgeFilter: lodge.id,
          onCompareLodges: (lodgeId) => {
            openLodgeCompareModal(lodgeId || lodge.id);
          },
          onCheckConditions: () => openWeatherConditionsModal(),
        });
      }, 1500);
    });

    // Ask CTA
    content.querySelector('.lfhlc-action-ask')?.addEventListener('click', () => {
      interactWithAgent('ext_user_action', {
        action: 'lodge_inquiry',
        source: 'lodge_compare',
        lodge: lodge.id,
        lodgeName: lodge.name,
      });
      actionTaken = true;
      closeModal();
    });
  }

  function updateHeroImage(lodge) {
    const heroMedia = content.querySelector('#lfhlc-hero-media');
    heroMedia.innerHTML = `
      <div class="lfhlc-hero-image" style="background-image: url('${lodge.gallery[activeGalleryIndex]}')">
        <button class="lfhlc-play-btn" id="lfhlc-play-video" data-vimeo="${lodge.videoId}">
          <span class="lfhlc-play-triangle"></span>
        </button>
        <div class="lfhlc-hero-label">Watch: Lodging Experience</div>
      </div>
    `;

    // Re-attach play button listener
    heroMedia.querySelector('#lfhlc-play-video')?.addEventListener('click', (e) => {
      playVideo(e.currentTarget.dataset.vimeo, lodge);
    });
  }

  function playVideo(vimeoId, lodge) {
    const heroMedia = content.querySelector('#lfhlc-hero-media');
    heroMedia.innerHTML = `
      <div class="lfhlc-video-embed">
        <iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0"
          allow="autoplay; fullscreen" allowfullscreen></iframe>
      </div>
    `;

    silentVariableUpdate('ext_video_played', `lodge_${lodge.id}`);
  }

  // ========================================================================
  // HELPERS
  // ========================================================================

  function updateTabState() {
    tabBar.querySelectorAll('.lfhlc-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.tab === activeTab);
    });
    silentVariableUpdate('ext_lodge_compare_tab', activeTab);
  }

  // ========================================================================
  // EVENT LISTENERS
  // ========================================================================

  // Tab switching
  tabBar.querySelectorAll('.lfhlc-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      renderActiveTab();
    });
  });

  // ========================================================================
  // CLOSE MODAL
  // ========================================================================

  function closeModal() {
    if (!actionTaken) {
      interactWithAgent('ext_modal_closed', {
        modal: 'lodge_compare',
        lastTab: activeTab,
      });
    }

    abortController.abort();
    backdrop.style.animation = 'lfhlc-fadeOut 0.3s ease forwards';
    setTimeout(() => {
      backdrop.remove();
    }, 300);
  }

  // Close handlers
  headerBar.querySelector('.lfhlc-close-btn')?.addEventListener('click', closeModal);
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
@keyframes lfhlc-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes lfhlc-fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes lfhlc-slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header Bar */
.lfhlc-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; background: ${LFH_COLORS.textPrimary};
  flex-shrink: 0;
}
.lfhlc-header-title {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 20px; font-weight: 900; color: #fff;
  text-transform: uppercase; letter-spacing: 2px;
}
.lfhlc-close-btn {
  background: transparent; border: none; color: #fff;
  font-size: 28px; cursor: pointer; padding: 0;
  width: 44px; height: 44px; display: flex;
  align-items: center; justify-content: center;
  border-radius: 50%; transition: background 0.2s;
}
.lfhlc-close-btn:hover { background: rgba(255,255,255,0.15); }

/* Tab Bar */
.lfhlc-tab-bar {
  display: flex; gap: 8px; padding: 12px 20px;
  background: #fff; border-bottom: 1px solid ${LFH_COLORS.border};
  flex-shrink: 0;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}
.lfhlc-tab-bar::-webkit-scrollbar { display: none; }
.lfhlc-tab {
  padding: 10px 20px; background: ${LFH_COLORS.infoBox};
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 24px;
  font-family: 'Inter', sans-serif; font-size: 13px;
  font-weight: 600; color: ${LFH_COLORS.textSecondary};
  cursor: pointer; transition: all 0.2s;
}
.lfhlc-tab:hover {
  border-color: ${LFH_COLORS.primaryRed}; color: ${LFH_COLORS.textPrimary};
}
.lfhlc-tab.active {
  background: ${LFH_COLORS.primaryRed}; border-color: ${LFH_COLORS.primaryRed};
  color: #fff;
}

/* Content Area */
.lfhlc-content {
  flex: 1; overflow-y: auto; padding: 20px;
  font-family: 'Inter', sans-serif;
}
.lfhlc-content::-webkit-scrollbar { width: 6px; }
.lfhlc-content::-webkit-scrollbar-track { background: ${LFH_COLORS.infoBox}; }
.lfhlc-content::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 3px; }

/* ========== OVERVIEW TAB ========== */

.lfhlc-overview { }

/* Overview Cards */
.lfhlc-overview-cards {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  margin-bottom: 24px;
}

.lfhlc-overview-card {
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 12px;
  overflow: hidden; cursor: pointer; transition: all 0.2s;
  background: #fff;
}
.lfhlc-overview-card:hover {
  border-color: ${LFH_COLORS.primaryRed};
  box-shadow: 0 6px 20px rgba(230, 43, 30, 0.1);
  transform: translateY(-2px);
}

.lfhlc-overview-hero {
  height: 180px; background-size: cover; background-position: center;
  position: relative;
}
.lfhlc-overview-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(transparent 40%, rgba(0,0,0,0.75));
  display: flex; flex-direction: column;
  justify-content: flex-end; padding: 16px;
}
.lfhlc-overview-lodge-name {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 18px; font-weight: 900; color: #fff;
  text-transform: uppercase; letter-spacing: 1px;
  margin: 0 0 4px; text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}
.lfhlc-overview-lodge-tagline {
  font-size: 12px; color: #fff; opacity: 0.9;
  margin: 0; font-style: italic;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}

.lfhlc-overview-card-body { padding: 14px; }

.lfhlc-overview-quick-stats {
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;
}
.lfhlc-quick-stat {
  padding: 4px 10px; background: ${LFH_COLORS.infoBox};
  border: 1px solid ${LFH_COLORS.border}; border-radius: 14px;
  font-size: 11px; font-weight: 500; color: ${LFH_COLORS.textPrimary};
}

/* Comparison Section */
.lfhlc-comparison-section { margin-bottom: 24px; }

.lfhlc-section-title {
  font-size: 14px; font-weight: 700; color: ${LFH_COLORS.textPrimary};
  text-transform: uppercase; letter-spacing: 0.5px;
  margin: 0 0 14px;
}

.lfhlc-comparison-table {
  border: 1px solid ${LFH_COLORS.border}; border-radius: 10px;
  overflow: hidden;
}

.lfhlc-comparison-header {
  display: grid; grid-template-columns: 160px 1fr 1fr;
  background: #fff;
  border-bottom: 2px solid ${LFH_COLORS.primaryRed};
}
.lfhlc-comparison-header .lfhlc-comp-cell {
  font-weight: 700; font-size: 12px; text-transform: uppercase;
  letter-spacing: 0.3px;
  color: ${LFH_COLORS.primaryRed};
}

.lfhlc-comparison-row {
  display: grid; grid-template-columns: 160px 1fr 1fr;
  border-bottom: 1px solid ${LFH_COLORS.border};
}
.lfhlc-comparison-row:last-child { border-bottom: none; }
.lfhlc-comparison-row:hover { background: ${LFH_COLORS.selectedTint}; }

.lfhlc-comp-cell {
  padding: 12px 14px; font-size: 12px;
  color: ${LFH_COLORS.textPrimary};
}
.lfhlc-comp-label {
  background: ${LFH_COLORS.infoBox}; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
}
.lfhlc-comp-icon {
  font-size: 14px;
  color: ${LFH_COLORS.textSecondary};
  font-family: sans-serif;
}
.lfhlc-comp-lodge { text-align: center; }

/* Overview CTA */
.lfhlc-overview-cta { text-align: center; padding: 10px 0 20px; }
.lfhlc-help-choose-btn { }
.lfhlc-cta-subtext {
  font-size: 12px; color: ${LFH_COLORS.textSecondary};
  margin: 10px 0 0;
}

/* ========== TERRAIN TAB ========== */

.lfhlc-terrain-tab { }

.lfhlc-terrain-images {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  margin-bottom: 24px;
}

.lfhlc-terrain-card {
  border-radius: 10px; overflow: hidden;
  border: 1.5px solid ${LFH_COLORS.border};
  background: #fff;
}

.lfhlc-terrain-card-img {
  width: 100%; height: 180px; object-fit: cover;
  display: block;
}

.lfhlc-terrain-card-label {
  padding: 12px 14px;
  display: flex; flex-direction: column; gap: 2px;
}
.lfhlc-terrain-card-label strong {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 14px; font-weight: 900; color: ${LFH_COLORS.textPrimary};
  text-transform: uppercase; letter-spacing: 0.5px;
}
.lfhlc-terrain-card-label span {
  font-size: 12px; color: ${LFH_COLORS.textSecondary};
  font-style: italic;
}

.lfhlc-terrain-cta {
  text-align: center; padding: 20px 0 10px;
}
.lfhlc-terrain-recommend-btn { }

/* Aerial Context Section */
.lfhlc-aerial-context-section {
  margin-bottom: 24px;
}
.lfhlc-aerial-context-section .lfhlc-terrain-images {
  margin-bottom: 12px;
}

/* Layout Buttons */
.lfhlc-layout-btns {
  display: flex; gap: 12px; justify-content: center;
}
.lfhlc-layout-btn {
  padding: 8px 16px; background: transparent;
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 600; color: ${LFH_COLORS.textSecondary};
  cursor: pointer; transition: all 0.2s;
}
.lfhlc-layout-btn:hover {
  border-color: ${LFH_COLORS.primaryRed};
  color: ${LFH_COLORS.primaryRed};
}

/* Run Photos Gallery */
.lfhlc-run-photos-section {
  margin-bottom: 24px;
}
.lfhlc-run-photos-group {
  margin-bottom: 16px;
}
.lfhlc-run-photos-group:last-child {
  margin-bottom: 0;
}
.lfhlc-run-photos-label {
  font-size: 12px; font-weight: 700; color: ${LFH_COLORS.textSecondary};
  text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;
}
.lfhlc-run-photos-strip {
  display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px;
}
.lfhlc-run-photos-strip::-webkit-scrollbar { height: 4px; }
.lfhlc-run-photos-strip::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 2px; }
.lfhlc-run-photo {
  flex: 0 0 200px; height: 112px;
  border-radius: 8px; background-size: cover; background-position: center;
  cursor: pointer; border: 2px solid transparent; transition: all 0.2s;
}
.lfhlc-run-photo:hover {
  border-color: ${LFH_COLORS.primaryRed};
  transform: scale(1.02);
}

/* ========== LIGHTBOX ========== */

.lfhlc-lightbox {
  position: fixed; inset: 0; z-index: 10001;
  display: flex; align-items: center; justify-content: center;
  animation: lfhlc-fadeIn 0.2s ease;
}
.lfhlc-lightbox-backdrop {
  position: absolute; inset: 0; background: rgba(0,0,0,0.9);
}
.lfhlc-lightbox-content {
  position: relative; max-width: 90%; max-height: 90%;
  display: flex; flex-direction: column; align-items: center;
}
.lfhlc-lightbox-content img {
  max-width: 100%; max-height: 85vh; border-radius: 8px;
  object-fit: contain;
}
.lfhlc-lightbox-close {
  position: absolute; top: -50px; right: 0;
  background: rgba(255,255,255,0.15); border: none; color: #fff;
  font-size: 32px; cursor: pointer; padding: 0;
  width: 48px; height: 48px; display: flex;
  align-items: center; justify-content: center;
  border-radius: 50%; transition: all 0.2s;
}
.lfhlc-lightbox-close:hover { transform: scale(1.1); background: rgba(255,255,255,0.25); }
.lfhlc-lightbox-caption {
  text-align: center; color: #fff; margin-top: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px; font-weight: 600;
}

/* Lightbox Navigation (for run photos) */
.lfhlc-lightbox-photo {
  flex-direction: row; align-items: center; gap: 16px;
}
.lfhlc-lightbox-photo img {
  max-width: calc(100% - 100px);
}
.lfhlc-lightbox-nav {
  background: rgba(255,255,255,0.15); border: none;
  color: #fff; font-size: 36px; cursor: pointer;
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.lfhlc-lightbox-nav:hover {
  background: rgba(255,255,255,0.3);
  transform: scale(1.1);
}
.lfhlc-nav-prev { margin-right: auto; }
.lfhlc-nav-next { margin-left: auto; }

/* ========== DETAIL VIEW ========== */

.lfhlc-detail { display: flex; flex-direction: column; height: 100%; }
.lfhlc-detail-scroll { flex: 1; overflow-y: auto; }

/* Hero Media */
.lfhlc-hero-media { margin-bottom: 12px; }
.lfhlc-hero-image {
  width: 100%; height: 280px; background-size: cover;
  background-position: center; border-radius: 10px;
  position: relative; display: flex;
  align-items: center; justify-content: center; cursor: pointer;
}
.lfhlc-hero-image::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(transparent 50%, rgba(0,0,0,0.6));
  border-radius: 10px; pointer-events: none;
}
.lfhlc-play-btn {
  position: relative; z-index: 2;
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(255,255,255,0.9); border: none;
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; transition: all 0.2s;
}
.lfhlc-play-btn:hover {
  background: ${LFH_COLORS.primaryRed}; transform: scale(1.1);
}
.lfhlc-play-btn:hover .lfhlc-play-triangle { border-left-color: #fff; }
.lfhlc-play-triangle {
  width: 0; height: 0;
  border-left: 18px solid ${LFH_COLORS.textPrimary};
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  margin-left: 4px; transition: border-color 0.2s;
}
.lfhlc-hero-label {
  position: absolute; bottom: 14px; left: 14px; z-index: 2;
  color: #fff; font-size: 12px; font-weight: 600;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}
.lfhlc-video-embed {
  width: 100%; aspect-ratio: 16/9; border-radius: 10px;
  overflow: hidden; background: #000;
}
.lfhlc-video-embed iframe { width: 100%; height: 100%; border: none; }

/* Gallery Strip */
.lfhlc-gallery-strip {
  display: flex; gap: 8px; overflow-x: auto;
  padding-bottom: 8px; margin-bottom: 20px;
}
.lfhlc-gallery-strip::-webkit-scrollbar { height: 4px; }
.lfhlc-gallery-strip::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 2px; }
.lfhlc-gallery-thumb {
  flex: 0 0 120px; height: 80px; border-radius: 8px;
  background-size: cover; background-position: center;
  border: 2px solid transparent; cursor: pointer; transition: all 0.2s;
}
.lfhlc-gallery-thumb:hover { border-color: ${LFH_COLORS.primaryRed}; }
.lfhlc-gallery-thumb.active { border-color: ${LFH_COLORS.primaryRed}; }

/* Detail Sections */
.lfhlc-detail-section { margin-bottom: 20px; }
.lfhlc-full-desc {
  font-size: 13px; line-height: 1.7; color: ${LFH_COLORS.textPrimary};
  margin: 0;
}

/* Stats Bar */
.lfhlc-stats-bar {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  margin-bottom: 24px;
}
.lfhlc-stat-box {
  text-align: center; padding: 14px 8px;
  background: ${LFH_COLORS.infoBox}; border-radius: 8px;
}
.lfhlc-stat-value {
  font-size: 15px; font-weight: 700; color: ${LFH_COLORS.primaryRed};
  margin-bottom: 3px;
}
.lfhlc-stat-label {
  font-size: 10px; color: ${LFH_COLORS.textSecondary};
  text-transform: uppercase; letter-spacing: 0.3px;
}

/* Features Grid */
.lfhlc-features-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  margin-bottom: 24px;
}
.lfhlc-feature-section { }
.lfhlc-feature-title {
  font-size: 11px; font-weight: 700; color: ${LFH_COLORS.textSecondary};
  text-transform: uppercase; letter-spacing: 0.5px;
  margin: 0 0 8px;
}
.lfhlc-feature-text {
  font-size: 13px; line-height: 1.5; color: ${LFH_COLORS.textPrimary};
  margin: 0;
}
.lfhlc-feature-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.lfhlc-feature-tag {
  padding: 5px 12px; background: ${LFH_COLORS.infoBox};
  border: 1px solid ${LFH_COLORS.border}; border-radius: 16px;
  font-size: 11px; font-weight: 500; color: ${LFH_COLORS.textPrimary};
}

/* Terrain Section */
.lfhlc-terrain-section {
  background: ${LFH_COLORS.infoBox}; border-radius: 10px;
  margin-bottom: 24px; overflow: hidden;
}
.lfhlc-terrain-toggle {
  width: 100%; padding: 14px 18px;
  background: transparent; border: none;
  display: flex; align-items: center; gap: 10px;
  font-family: 'Inter', sans-serif; font-size: 14px;
  font-weight: 700; color: ${LFH_COLORS.textPrimary};
  cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;
}
.lfhlc-terrain-toggle:hover { background: rgba(0,0,0,0.03); }
.lfhlc-terrain-toggle-icon { font-size: 18px; }
.lfhlc-terrain-arrow {
  margin-left: auto; font-size: 12px;
  transition: transform 0.2s;
}
.lfhlc-terrain-content {
  max-height: 0; overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 18px;
}
.lfhlc-terrain-content.open {
  max-height: 500px; padding: 0 18px 18px;
}
.lfhlc-terrain-map { margin-bottom: 16px; }
.lfhlc-terrain-image {
  width: 100%; height: 180px; object-fit: cover;
  border-radius: 8px;
}
.lfhlc-terrain-details { }
.lfhlc-terrain-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 0; border-bottom: 1px solid ${LFH_COLORS.border};
}
.lfhlc-terrain-row:last-child { border-bottom: none; }
.lfhlc-terrain-label {
  flex: 0 0 120px; font-size: 11px; font-weight: 700;
  color: ${LFH_COLORS.textSecondary}; text-transform: uppercase;
}
.lfhlc-terrain-value {
  flex: 1; font-size: 13px; color: ${LFH_COLORS.textPrimary};
}
.lfhlc-terrain-value.lfhlc-highlight {
  color: #2E7D32; font-weight: 600;
}

/* Detail Actions */
.lfhlc-detail-actions {
  display: flex; gap: 12px; padding: 16px 0;
  border-top: 1px solid ${LFH_COLORS.border};
}

/* Buttons */
.lfhlc-btn-primary {
  flex: 1; padding: 12px 20px;
  background: ${LFH_COLORS.primaryRed}; color: #fff;
  border: none; border-radius: 8px; font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all 0.2s; text-align: center;
}
.lfhlc-btn-primary:hover { background: #c4221a; transform: translateY(-1px); }
.lfhlc-btn-outline {
  flex: 1; padding: 12px 20px;
  background: #fff; color: ${LFH_COLORS.textPrimary};
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 8px;
  font-family: 'Inter', sans-serif; font-size: 13px;
  font-weight: 600; cursor: pointer; transition: all 0.2s;
  text-align: center;
}
.lfhlc-btn-outline:hover {
  border-color: ${LFH_COLORS.primaryRed};
  color: ${LFH_COLORS.primaryRed};
}
.lfhlc-btn-text {
  background: transparent; border: none;
  color: ${LFH_COLORS.textSecondary}; font-family: 'Inter', sans-serif;
  font-size: 12px; cursor: pointer; padding: 8px; transition: color 0.2s;
}
.lfhlc-btn-text:hover { color: ${LFH_COLORS.primaryRed}; }
.lfhlc-card-actions { display: flex; gap: 8px; }
.lfhlc-card-actions .lfhlc-btn-primary,
.lfhlc-card-actions .lfhlc-btn-outline { font-size: 12px; padding: 10px 14px; }
.lfhlc-cta-buttons { display: flex; gap: 12px; justify-content: center; }
.lfhlc-cta-buttons .lfhlc-btn-primary,
.lfhlc-cta-buttons .lfhlc-btn-outline { flex: 1; padding: 14px 20px; font-size: 14px; max-width: 300px; }
.lfhlc-browse-tours-btn { display: inline-block; margin-top: 8px; }

/* ========== MOBILE RESPONSIVE ========== */

@media (max-width: 700px) {
  .lfhlc-overview-cards { grid-template-columns: 1fr; }
  .lfhlc-overview-hero { height: 160px; }
  .lfhlc-cta-buttons { flex-direction: column; align-items: stretch; }
  .lfhlc-cta-buttons .lfhlc-btn-primary,
  .lfhlc-cta-buttons .lfhlc-btn-outline { width: 100%; }

  .lfhlc-comparison-header,
  .lfhlc-comparison-row {
    grid-template-columns: 100px 1fr 1fr;
  }
  .lfhlc-comp-cell { padding: 10px 8px; font-size: 11px; }
  .lfhlc-comp-icon { display: none; }

  .lfhlc-stats-bar { grid-template-columns: repeat(2, 1fr); }
  .lfhlc-features-grid { grid-template-columns: 1fr; }

  .lfhlc-hero-image { height: 200px; }
  .lfhlc-play-btn { width: 54px; height: 54px; }
  .lfhlc-play-triangle {
    border-left-width: 14px;
    border-top-width: 9px;
    border-bottom-width: 9px;
  }

  .lfhlc-tab { padding: 8px 14px; font-size: 11px; white-space: nowrap; }
  .lfhlc-tab-bar { gap: 6px; padding: 10px 16px; }

  .lfhlc-terrain-images { grid-template-columns: 1fr; }
  .lfhlc-terrain-card-img { height: 160px; }

  /* Run Photos - smaller on tablet */
  .lfhlc-run-photo { flex: 0 0 160px; height: 90px; }

  /* Run photos strip - fade hint for scroll */
  .lfhlc-run-photos-strip {
    position: relative;
    -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);
    mask-image: linear-gradient(to right, black 90%, transparent 100%);
  }

  /* Layout buttons - stack on tablet */
  .lfhlc-layout-btns { flex-direction: column; align-items: stretch; gap: 8px; }
  .lfhlc-layout-btn { text-align: center; min-height: 44px; }

  /* Lightbox - full screen on mobile, hide nav buttons, use swipe */
  .lfhlc-lightbox-content { max-width: 100%; max-height: 100%; padding: 16px; }
  .lfhlc-lightbox-photo { flex-direction: column; }
  .lfhlc-lightbox-photo img { max-width: 100%; max-height: 70vh; }
  .lfhlc-lightbox-nav { display: none; }
  .lfhlc-lightbox-close { top: 10px; right: 10px; position: fixed; z-index: 10002; }
  .lfhlc-lightbox-caption { font-size: 13px; padding: 0 16px; }
}

@media (max-width: 500px) {
  .lfhlc-header-title { font-size: 14px; letter-spacing: 1px; }
  .lfhlc-header-bar { padding: 12px 16px; }
  .lfhlc-content { padding: 14px; }

  .lfhlc-comparison-header,
  .lfhlc-comparison-row {
    grid-template-columns: 80px 1fr 1fr;
  }
  .lfhlc-comp-cell { padding: 8px 6px; font-size: 10px; }

  .lfhlc-detail-actions { flex-direction: column; }
  .lfhlc-btn-primary, .lfhlc-btn-outline { width: 100%; min-height: 48px; }

  .lfhlc-gallery-thumb { flex: 0 0 100px; height: 66px; }

  .lfhlc-terrain-row { flex-direction: column; gap: 4px; }
  .lfhlc-terrain-label { flex: none; }

  /* Tab bar - ensure tabs are scrollable and minimum touch targets */
  .lfhlc-tab { min-height: 40px; padding: 8px 12px; font-size: 10px; }
  .lfhlc-tab-bar { padding: 8px 12px; }

  /* Run Photos - even smaller on mobile */
  .lfhlc-run-photo { flex: 0 0 140px; height: 78px; }
  .lfhlc-run-photos-label { font-size: 11px; }

  /* Lightbox - full screen on mobile */
  .lfhlc-lightbox-content {
    max-width: 100%; max-height: 100%; padding: 12px;
    justify-content: center;
  }
  .lfhlc-lightbox-content img { max-height: 65vh; border-radius: 6px; }
  .lfhlc-lightbox-close {
    top: 8px; right: 8px; position: fixed; z-index: 10002;
    width: 44px; height: 44px; font-size: 28px;
  }
  .lfhlc-lightbox-caption { font-size: 12px; margin-top: 10px; }

  /* Terrain card images smaller */
  .lfhlc-terrain-card-img { height: 140px; }

  /* Section titles */
  .lfhlc-section-title { font-size: 13px; }

  /* Hero image smaller */
  .lfhlc-hero-image { height: 180px; }
  .lfhlc-play-btn { width: 48px; height: 48px; }
  .lfhlc-play-triangle {
    border-left-width: 12px;
    border-top-width: 8px;
    border-bottom-width: 8px;
    margin-left: 3px;
  }
}
`;
}
