/**
 * Last Frontier Hub - Lodges Tab
 *
 * Extracted from lfh-lodge-compare-modal-v2-unified.js.
 * Renders overview, lodge detail, terrain views inside the hub.
 * No modal shell — the hub handles that. Lightboxes append to document.body.
 *
 * Cross-nav callbacks replaced with config.onSwitchTab().
 * State save/restore enables tab memory.
 *
 * @version 1.0.0
 * @author Last Frontier Heliskiing / RomAIx
 */

import {
  LFH_COLORS, LFH_LODGES, COMPARISON_CATEGORIES,
  silentVariableUpdate, interactWithAgent,
} from './lfh-hub-shared.js';

// ============================================================================
// MODULE STATE
// ============================================================================

let _state = null;

export function getLodgesTabState() {
  if (!_state) return null;
  return {
    activeSubTab: _state.activeSubTab,
  };
}

// ============================================================================
// RENDER: Lodges Tab Entry Point
// ============================================================================

/**
 * @param {HTMLElement} container - The tab panel element
 * @param {Object} config - Hub config
 * @param {Object|null} savedState - Restored state from tab snapshot
 */
export function renderLodgesTab(container, config, savedState) {
  const { onSwitchTab, onActionTaken, onCloseHub, focusLodge, lodgeId, isMobile = false } = config;

  // Initialize state
  const initialTab = focusLodge || lodgeId || savedState?.activeSubTab || 'overview';
  _state = {
    activeSubTab: initialTab,
    activeGalleryIndex: 0,
  };

  // Build DOM
  container.innerHTML = '';

  // Sub-Tab Bar
  const tabBar = document.createElement('div');
  tabBar.className = 'lfhlc-tab-bar';
  tabBar.innerHTML = `
    <button class="lfhlc-tab ${_state.activeSubTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
    <button class="lfhlc-tab ${_state.activeSubTab === 'bell2' ? 'active' : ''}" data-tab="bell2">Bell 2 Lodge</button>
    <button class="lfhlc-tab ${_state.activeSubTab === 'ripley' ? 'active' : ''}" data-tab="ripley">Ripley Creek</button>
    <button class="lfhlc-tab ${_state.activeSubTab === 'terrain' ? 'active' : ''}" data-tab="terrain">Terrain</button>
  `;
  container.appendChild(tabBar);

  // Content Area
  const content = document.createElement('div');
  content.className = 'lfhlc-content';
  content.id = 'lfhlc-content';
  container.appendChild(content);

  // Tab switching
  tabBar.querySelectorAll('.lfhlc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _state.activeSubTab = tab.dataset.tab;
      _state.activeGalleryIndex = 0;
      updateSubTabState();
      renderActiveSubTab();
    });
  });

  // Render initial
  renderActiveSubTab();
  silentVariableUpdate('ext_last_action', 'lodge_compare_opened');
  if (focusLodge || lodgeId) {
    silentVariableUpdate('ext_focus_lodge', focusLodge || lodgeId);
  }

  // ========================================================================
  // SUB-TAB HELPERS
  // ========================================================================

  function updateSubTabState() {
    tabBar.querySelectorAll('.lfhlc-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === _state.activeSubTab);
    });
    silentVariableUpdate('ext_lodge_compare_tab', _state.activeSubTab);
  }

  function renderActiveSubTab() {
    updateSubTabState();
    _state.activeGalleryIndex = 0;

    if (_state.activeSubTab === 'overview') {
      renderOverviewTab();
    } else if (_state.activeSubTab === 'bell2') {
      renderLodgeDetail(LFH_LODGES.bell2);
    } else if (_state.activeSubTab === 'ripley') {
      renderLodgeDetail(LFH_LODGES.ripley);
    } else if (_state.activeSubTab === 'terrain') {
      renderTerrainTab();
    }
  }

  // ========================================================================
  // RENDER: Overview Tab
  // ========================================================================

  function renderOverviewTab() {
    const bell2 = LFH_LODGES.bell2;
    const ripley = LFH_LODGES.ripley;

    content.innerHTML = `
      <div class="lfhlc-overview">
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

        <div class="lfhlc-comparison-section">
          ${isMobile ? `
            <h3 class="lfhlc-section-title lfhlc-comparison-toggle" id="lfhlc-comparison-toggle">
              Side-by-Side Comparison <span class="lfhlc-toggle-arrow">&#9656;</span>
            </h3>
            <div class="lfhlc-comparison-table lfhlc-comparison-collapsed" id="lfhlc-comparison-content">
          ` : `
            <h3 class="lfhlc-section-title">Side-by-Side Comparison</h3>
            <div class="lfhlc-comparison-table">
          `}
            <div class="lfhlc-comparison-header">
              <div class="lfhlc-comp-cell lfhlc-comp-label"></div>
              <div class="lfhlc-comp-cell lfhlc-comp-lodge">Bell 2 Lodge</div>
              <div class="lfhlc-comp-cell lfhlc-comp-lodge">Ripley Creek</div>
            </div>
            ${COMPARISON_CATEGORIES.map(cat => `
              <div class="lfhlc-comparison-row">
                <div class="lfhlc-comp-cell lfhlc-comp-label">
                  <span class="lfhlc-comp-icon">${cat.icon}</span>
                  ${cat.label}
                </div>
                <div class="lfhlc-comp-cell">${cat.bell2}</div>
                <div class="lfhlc-comp-cell">${cat.ripley}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lfhlc-overview-cta">
          <div class="lfhlc-cta-buttons">
            <button class="lfhlc-btn-primary lfhlc-help-choose-btn">Help Me Choose the Right Lodge</button>
          </div>
        </div>
      </div>
    `;

    // Lodge card clicks → switch to detail sub-tab
    content.querySelectorAll('.lfhlc-view-lodge-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _state.activeSubTab = btn.dataset.lodge;
        renderActiveSubTab();
      });
    });

    content.querySelectorAll('.lfhlc-overview-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.lfhlc-view-lodge-btn') && !e.target.closest('.lfhlc-view-lodge-tours-btn')) {
          _state.activeSubTab = card.dataset.lodge;
          renderActiveSubTab();
        }
      });
    });

    // View Tours → switch to tours tab (filtered to that lodge)
    content.querySelectorAll('.lfhlc-view-lodge-tours-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        onSwitchTab('tours', { initialLodgeFilter: btn.dataset.lodge });
      });
    });

    // Help Me Choose
    content.querySelector('.lfhlc-help-choose-btn')?.addEventListener('click', () => {
      interactWithAgent('ext_user_action', { action: 'lodge_recommendation_request', source: 'lodge_compare' });
      onActionTaken();
      onCloseHub();
    });

    // Mobile: comparison table toggle
    if (isMobile) {
      content.querySelector('#lfhlc-comparison-toggle')?.addEventListener('click', () => {
        const table = content.querySelector('#lfhlc-comparison-content');
        const arrow = content.querySelector('#lfhlc-comparison-toggle .lfhlc-toggle-arrow');
        table.classList.toggle('lfhlc-comparison-collapsed');
        table.classList.toggle('lfhlc-comparison-expanded');
        arrow.innerHTML = table.classList.contains('lfhlc-comparison-collapsed') ? '&#9656;' : '&#9662;';
      });
    }

  }

  // ========================================================================
  // RENDER: Terrain Tab
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

    const bell2RunPhotosHTML = (bell2.terrain.runPhotos || [])
      .map((url, i) => `<div class="lfhlc-run-photo" style="background-image: url('${url}')" data-lodge="bell2" data-index="${i}"></div>`)
      .join('');
    const ripleyRunPhotosHTML = (ripley.terrain.runPhotos || [])
      .map((url, i) => `<div class="lfhlc-run-photo" style="background-image: url('${url}')" data-lodge="ripley" data-index="${i}"></div>`)
      .join('');

    content.innerHTML = `
      <div class="lfhlc-terrain-tab">
        <h3 class="lfhlc-section-title">Terrain Comparison</h3>

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

        ${isMobile ? `
          <button class="lfhlc-collapse-toggle lfhlc-run-photos-toggle" id="lfhlc-run-photos-toggle">
            Run Photos <span class="lfhlc-toggle-arrow">&#9656;</span>
          </button>
          <div class="lfhlc-run-photos-section lfhlc-run-photos-collapsed" id="lfhlc-run-photos-content">
        ` : `
          <div class="lfhlc-run-photos-section">
        `}
          <div class="lfhlc-run-photos-group">
            <p class="lfhlc-run-photos-label">Bell 2 Lodge Runs</p>
            <div class="lfhlc-run-photos-strip">${bell2RunPhotosHTML}</div>
          </div>
          <div class="lfhlc-run-photos-group">
            <p class="lfhlc-run-photos-label">Ripley Creek Runs</p>
            <div class="lfhlc-run-photos-strip">${ripleyRunPhotosHTML}</div>
          </div>
        </div>

        <div class="lfhlc-comparison-table">
          <div class="lfhlc-comparison-header">
            <div class="lfhlc-comp-cell lfhlc-comp-label"></div>
            <div class="lfhlc-comp-cell lfhlc-comp-lodge">Bell 2 Lodge</div>
            <div class="lfhlc-comp-cell lfhlc-comp-lodge">Ripley Creek</div>
          </div>
          ${terrainCategories.map(cat => `
            <div class="lfhlc-comparison-row">
              <div class="lfhlc-comp-cell lfhlc-comp-label">
                <span class="lfhlc-comp-icon">${cat.icon}</span>
                ${cat.label}
              </div>
              <div class="lfhlc-comp-cell">${cat.bell2}</div>
              <div class="lfhlc-comp-cell">${cat.ripley}</div>
            </div>
          `).join('')}
        </div>

        <div class="lfhlc-terrain-cta">
          <div class="lfhlc-cta-buttons">
            <button class="lfhlc-btn-primary lfhlc-terrain-recommend-btn">Which Terrain Suits My Skill Level?</button>
          </div>
        </div>
      </div>
    `;

    content.querySelector('.lfhlc-terrain-recommend-btn')?.addEventListener('click', () => {
      interactWithAgent('ext_user_action', { action: 'terrain_recommendation_request', source: 'lodge_compare' });
      onActionTaken();
      onCloseHub();
    });

    content.querySelectorAll('.lfhlc-layout-btn').forEach(btn => {
      btn.addEventListener('click', () => showLayoutLightbox(btn.dataset.lodge));
    });

    content.querySelectorAll('.lfhlc-run-photo').forEach(photo => {
      photo.addEventListener('click', () => {
        showRunPhotoLightbox(photo.dataset.lodge, parseInt(photo.dataset.index));
      });
    });

    // Mobile: run photos toggle
    if (isMobile) {
      content.querySelector('#lfhlc-run-photos-toggle')?.addEventListener('click', () => {
        const section = content.querySelector('#lfhlc-run-photos-content');
        const arrow = content.querySelector('#lfhlc-run-photos-toggle .lfhlc-toggle-arrow');
        section.classList.toggle('lfhlc-run-photos-collapsed');
        section.classList.toggle('lfhlc-run-photos-expanded');
        arrow.innerHTML = section.classList.contains('lfhlc-run-photos-collapsed') ? '&#9656;' : '&#9662;';
      });
    }
  }

  // ========================================================================
  // RENDER: Lodge Detail
  // ========================================================================

  function renderLodgeDetail(lodge) {
    const galleryHTML = lodge.gallery
      .map((img, i) => `
        <div class="lfhlc-gallery-thumb ${i === 0 ? 'active' : ''}"
             style="background-image: url('${img}')"
             data-index="${i}"></div>
      `).join('');

    const amenitiesHTML = lodge.features.amenities.map(a => `<span class="lfhlc-feature-tag">${a}</span>`).join('');
    const activitiesHTML = lodge.features.activities.map(a => `<span class="lfhlc-feature-tag">${a}</span>`).join('');
    const terrainCharsHTML = lodge.terrain.characteristics.map(c => `<span class="lfhlc-feature-tag">${c}</span>`).join('');

    const galleryCount = lodge.gallery.length;

    content.innerHTML = `
      <div class="lfhlc-detail">
        <div class="lfhlc-detail-scroll">
          <div class="lfhlc-hero-media" id="lfhlc-hero-media">
            <div class="lfhlc-hero-image" style="background-image: url('${lodge.gallery[0]}')">
              <button class="lfhlc-play-btn" id="lfhlc-play-video" data-vimeo="${lodge.videoId}">
                <span class="lfhlc-play-triangle"></span>
              </button>
              <div class="lfhlc-hero-label">Watch: Lodging Experience</div>
            </div>
          </div>

          ${isMobile ? `
            <button class="lfhlc-collapse-toggle lfhlc-gallery-toggle" id="lfhlc-gallery-toggle">
              Gallery (${galleryCount} photos) <span class="lfhlc-toggle-arrow">&#9662;</span>
            </button>
            <div class="lfhlc-gallery-strip lfhlc-gallery-collapsed">${galleryHTML}</div>
          ` : `
            <div class="lfhlc-gallery-strip">${galleryHTML}</div>
          `}

          <div class="lfhlc-detail-section">
            <p class="lfhlc-full-desc">${lodge.fullDescription}</p>
          </div>

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

          <div class="lfhlc-features-grid">
            <div class="lfhlc-feature-section">
              <h4 class="lfhlc-feature-title">Accommodation</h4>
              <p class="lfhlc-feature-text">${lodge.features.accommodation}</p>
            </div>
            <div class="lfhlc-feature-section">
              <h4 class="lfhlc-feature-title">Dining</h4>
              <p class="lfhlc-feature-text">${lodge.features.dining}</p>
            </div>
            ${isMobile ? '' : `
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
            `}
          </div>

          ${isMobile ? `
            <button class="lfhlc-collapse-toggle lfhlc-features-more-toggle" id="lfhlc-features-more-toggle">
              Show 4 more features <span class="lfhlc-toggle-arrow">&#9662;</span>
            </button>
            <div class="lfhlc-features-grid lfhlc-features-hidden" id="lfhlc-features-hidden">
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
          ` : ''}

          <div class="lfhlc-terrain-section">
            <button class="lfhlc-terrain-toggle" id="lfhlc-terrain-toggle">
              <span class="lfhlc-terrain-toggle-icon">⛰</span>
              Terrain Information
              <span class="lfhlc-terrain-arrow" style="transform: ${isMobile ? 'rotate(0deg)' : 'rotate(180deg)'}">▾</span>
            </button>
            <div class="lfhlc-terrain-content ${isMobile ? '' : 'open'}" id="lfhlc-terrain-content">
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

          <div class="lfhlc-detail-actions">
            <button class="lfhlc-btn-primary lfhlc-action-book" data-lodge="${lodge.id}">Book ${lodge.name}</button>
            <button class="lfhlc-btn-outline lfhlc-action-ask" data-lodge="${lodge.id}">Ask About ${lodge.name}</button>
          </div>
        </div>
      </div>
    `;

    // Gallery thumbnails
    content.querySelectorAll('.lfhlc-gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        _state.activeGalleryIndex = parseInt(thumb.dataset.index);
        updateHeroImage(lodge);
        content.querySelectorAll('.lfhlc-gallery-thumb').forEach(t => t.classList.remove('active'));
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

    // Mobile: gallery toggle
    if (isMobile) {
      content.querySelector('#lfhlc-gallery-toggle')?.addEventListener('click', () => {
        const strip = content.querySelector('.lfhlc-gallery-strip');
        const arrow = content.querySelector('#lfhlc-gallery-toggle .lfhlc-toggle-arrow');
        strip.classList.toggle('lfhlc-gallery-collapsed');
        strip.classList.toggle('lfhlc-gallery-expanded');
        arrow.innerHTML = strip.classList.contains('lfhlc-gallery-collapsed') ? '&#9662;' : '&#9652;';
      });

      // Mobile: features more toggle
      content.querySelector('#lfhlc-features-more-toggle')?.addEventListener('click', () => {
        const grid = content.querySelector('#lfhlc-features-hidden');
        const btn = content.querySelector('#lfhlc-features-more-toggle');
        const arrow = btn.querySelector('.lfhlc-toggle-arrow');
        grid.classList.toggle('lfhlc-features-hidden');
        grid.classList.toggle('lfhlc-features-shown');
        const isHidden = grid.classList.contains('lfhlc-features-hidden');
        btn.childNodes[0].textContent = isHidden ? 'Show 4 more features ' : 'Hide extra features ';
        arrow.innerHTML = isHidden ? '&#9662;' : '&#9652;';
      });
    }

    // Book CTA → switch to tours tab filtered to this lodge
    content.querySelector('.lfhlc-action-book')?.addEventListener('click', () => {
      silentVariableUpdate('ext_lodge_selected', lodge.id);
      interactWithAgent('ext_user_action', {
        action: 'view_lodge_tours',
        source: 'lodge_compare',
        lodge: lodge.id,
        lodgeName: lodge.name,
      });
      onSwitchTab('tours', { initialLodgeFilter: lodge.id });
    });

    // Ask CTA
    content.querySelector('.lfhlc-action-ask')?.addEventListener('click', () => {
      interactWithAgent('ext_user_action', {
        action: 'lodge_inquiry',
        source: 'lodge_compare',
        lodge: lodge.id,
        lodgeName: lodge.name,
      });
      onActionTaken();
      onCloseHub();
    });
  }

  function updateHeroImage(lodge) {
    const heroMedia = content.querySelector('#lfhlc-hero-media');
    heroMedia.innerHTML = `
      <div class="lfhlc-hero-image" style="background-image: url('${lodge.gallery[_state.activeGalleryIndex]}')">
        <button class="lfhlc-play-btn" id="lfhlc-play-video" data-vimeo="${lodge.videoId}">
          <span class="lfhlc-play-triangle"></span>
        </button>
        <div class="lfhlc-hero-label">Watch: Lodging Experience</div>
      </div>
    `;
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
}

// ============================================================================
// LIGHTBOX: Location Layout (appended to document.body, z-index 10002)
// ============================================================================

function showLayoutLightbox(lodgeId) {
  const lodge = LFH_LODGES[lodgeId];
  if (!lodge?.terrain?.locationLayoutImage) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lfhlc-lightbox';
  lightbox.id = 'lfhlc-layout-lightbox';
  lightbox.style.zIndex = '10002';
  lightbox.innerHTML = `
    <div class="lfhlc-lightbox-backdrop"></div>
    <div class="lfhlc-lightbox-content">
      <button class="lfhlc-lightbox-close">&times;</button>
      <img src="${lodge.terrain.locationLayoutImage}" alt="${lodge.name} Layout" />
      <p class="lfhlc-lightbox-caption">${lodge.name} Property Layout</p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const closeLightbox = () => {
    lightbox.style.animation = 'lfhlc-fadeOut 0.2s ease forwards';
    setTimeout(() => lightbox.remove(), 200);
    document.removeEventListener('keydown', escHandler);
  };

  lightbox.querySelector('.lfhlc-lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lfhlc-lightbox-backdrop')?.addEventListener('click', closeLightbox);

  let touchStartY = 0;
  const contentEl = lightbox.querySelector('.lfhlc-lightbox-content');
  contentEl?.addEventListener('touchstart', (e) => { touchStartY = e.changedTouches[0].screenY; }, { passive: true });
  contentEl?.addEventListener('touchend', (e) => {
    if (e.changedTouches[0].screenY - touchStartY > 100) closeLightbox();
  }, { passive: true });

  const escHandler = (e) => {
    if (e.key === 'Escape' && document.getElementById('lfhlc-layout-lightbox')) closeLightbox();
  };
  document.addEventListener('keydown', escHandler);

  silentVariableUpdate('ext_viewed_layout', lodgeId);
}

// ============================================================================
// LIGHTBOX: Run Photo (appended to document.body, z-index 10002)
// ============================================================================

function showRunPhotoLightbox(lodgeId, photoIndex) {
  const lodge = LFH_LODGES[lodgeId];
  if (!lodge?.terrain?.runPhotos?.[photoIndex]) return;

  const photos = lodge.terrain.runPhotos;
  let currentIndex = photoIndex;

  const lightbox = document.createElement('div');
  lightbox.className = 'lfhlc-lightbox';
  lightbox.id = 'lfhlc-run-photo-lightbox';
  lightbox.style.zIndex = '10002';

  function nextPhoto() {
    if (photos.length > 1) { currentIndex = (currentIndex + 1) % photos.length; updateLightboxContent(); }
  }
  function prevPhoto() {
    if (photos.length > 1) { currentIndex = (currentIndex - 1 + photos.length) % photos.length; updateLightboxContent(); }
  }

  function updateLightboxContent() {
    lightbox.innerHTML = `
      <div class="lfhlc-lightbox-backdrop"></div>
      <div class="lfhlc-lightbox-content lfhlc-lightbox-photo">
        <button class="lfhlc-lightbox-close">&times;</button>
        ${photos.length > 1 ? `<button class="lfhlc-lightbox-nav lfhlc-nav-prev">‹</button>` : ''}
        <img src="${photos[currentIndex]}" alt="${lodge.name} Run ${currentIndex + 1}" />
        ${photos.length > 1 ? `<button class="lfhlc-lightbox-nav lfhlc-nav-next">›</button>` : ''}
        <p class="lfhlc-lightbox-caption">${lodge.name} - Run ${currentIndex + 1} of ${photos.length}${photos.length > 1 ? ' \u2022 Swipe to navigate' : ''}</p>
      </div>
    `;

    lightbox.querySelector('.lfhlc-lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lfhlc-lightbox-backdrop')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lfhlc-nav-prev')?.addEventListener('click', prevPhoto);
    lightbox.querySelector('.lfhlc-nav-next')?.addEventListener('click', nextPhoto);

    const contentEl = lightbox.querySelector('.lfhlc-lightbox-content');
    let touchStartX = 0;
    contentEl?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    contentEl?.addEventListener('touchend', (e) => {
      const swipeDistance = e.changedTouches[0].screenX - touchStartX;
      if (swipeDistance < -50) nextPhoto();
      if (swipeDistance > 50) prevPhoto();
    }, { passive: true });
  }

  const closeLightbox = () => {
    lightbox.style.animation = 'lfhlc-fadeOut 0.2s ease forwards';
    setTimeout(() => lightbox.remove(), 200);
    document.removeEventListener('keydown', keyHandler);
  };

  const keyHandler = (e) => {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') prevPhoto();
    else if (e.key === 'ArrowRight') nextPhoto();
  };
  document.addEventListener('keydown', keyHandler);

  updateLightboxContent();
  document.body.appendChild(lightbox);

  silentVariableUpdate('ext_viewed_run_photo', `${lodgeId}_${photoIndex}`);
}

// ============================================================================
// STYLES (unchanged from original — all .lfhlc-* prefixed)
// ============================================================================

export function buildLodgesStyles() {
  return `
@keyframes lfhlc-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes lfhlc-fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes lfhlc-slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tab Bar (sub-tabs within lodges tab) */
.lfhlc-tab-bar {
  display: flex; gap: 8px; padding: 12px 20px;
  background: #fff; border-bottom: 1px solid ${LFH_COLORS.border};
  flex-shrink: 0;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
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

/* Overview Cards */
.lfhlc-overview-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.lfhlc-overview-card {
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 12px;
  overflow: hidden; cursor: pointer; transition: all 0.2s; background: #fff;
}
.lfhlc-overview-card:hover {
  border-color: ${LFH_COLORS.primaryRed};
  box-shadow: 0 6px 20px rgba(230, 43, 30, 0.1);
  transform: translateY(-2px);
}
.lfhlc-overview-hero {
  height: 180px; background-size: cover; background-position: center; position: relative;
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
  font-size: 12px; color: #fff; opacity: 0.9; margin: 0;
  font-style: italic; text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}
.lfhlc-overview-card-body { padding: 14px; }
.lfhlc-overview-quick-stats { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.lfhlc-quick-stat {
  padding: 4px 10px; background: ${LFH_COLORS.infoBox};
  border: 1px solid ${LFH_COLORS.border}; border-radius: 14px;
  font-size: 11px; font-weight: 500; color: ${LFH_COLORS.textPrimary};
}

/* Comparison Section */
.lfhlc-comparison-section { margin-bottom: 24px; }
.lfhlc-section-title {
  font-size: 14px; font-weight: 700; color: ${LFH_COLORS.textPrimary};
  text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px;
}
.lfhlc-comparison-table {
  border: 1px solid ${LFH_COLORS.border}; border-radius: 10px; overflow: hidden;
}
.lfhlc-comparison-header {
  display: grid; grid-template-columns: 160px 1fr 1fr;
  background: #fff; border-bottom: 2px solid ${LFH_COLORS.primaryRed};
}
.lfhlc-comparison-header .lfhlc-comp-cell {
  font-weight: 700; font-size: 12px; text-transform: uppercase;
  letter-spacing: 0.3px; color: ${LFH_COLORS.primaryRed};
}
.lfhlc-comparison-row {
  display: grid; grid-template-columns: 160px 1fr 1fr;
  border-bottom: 1px solid ${LFH_COLORS.border};
}
.lfhlc-comparison-row:last-child { border-bottom: none; }
.lfhlc-comparison-row:hover { background: ${LFH_COLORS.selectedTint}; }
.lfhlc-comp-cell { padding: 12px 14px; font-size: 12px; color: ${LFH_COLORS.textPrimary}; }
.lfhlc-comp-label {
  background: ${LFH_COLORS.infoBox}; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
}
.lfhlc-comp-icon { font-size: 14px; color: ${LFH_COLORS.textSecondary}; font-family: sans-serif; }
.lfhlc-comp-lodge { text-align: center; }

/* CTA */
.lfhlc-overview-cta { text-align: center; padding: 10px 0 20px; }
.lfhlc-cta-buttons { display: flex; gap: 12px; justify-content: center; }
.lfhlc-cta-buttons .lfhlc-btn-primary,
.lfhlc-cta-buttons .lfhlc-btn-outline { flex: none; padding: 14px 32px; font-size: 14px; max-width: 360px; }

/* Terrain Tab */
.lfhlc-terrain-images { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.lfhlc-terrain-card {
  border-radius: 10px; overflow: hidden;
  border: 1.5px solid ${LFH_COLORS.border}; background: #fff;
}
.lfhlc-terrain-card-img { width: 100%; height: 180px; object-fit: cover; display: block; }
.lfhlc-terrain-card-label { padding: 12px 14px; display: flex; flex-direction: column; gap: 2px; }
.lfhlc-terrain-card-label strong {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 14px; font-weight: 900; color: ${LFH_COLORS.textPrimary};
  text-transform: uppercase; letter-spacing: 0.5px;
}
.lfhlc-terrain-card-label span { font-size: 12px; color: ${LFH_COLORS.textSecondary}; font-style: italic; }
.lfhlc-terrain-cta { text-align: center; padding: 20px 0 10px; }

/* Layout Buttons */
.lfhlc-layout-btns { display: flex; gap: 12px; justify-content: center; }
.lfhlc-layout-btn {
  padding: 8px 16px; background: transparent;
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 20px;
  font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
  color: ${LFH_COLORS.textSecondary}; cursor: pointer; transition: all 0.2s;
}
.lfhlc-layout-btn:hover { border-color: ${LFH_COLORS.primaryRed}; color: ${LFH_COLORS.primaryRed}; }

/* Run Photos */
.lfhlc-run-photos-section { margin-bottom: 24px; }
.lfhlc-run-photos-group { margin-bottom: 16px; }
.lfhlc-run-photos-group:last-child { margin-bottom: 0; }
.lfhlc-run-photos-label {
  font-size: 12px; font-weight: 700; color: ${LFH_COLORS.textSecondary};
  text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;
}
.lfhlc-run-photos-strip { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; }
.lfhlc-run-photos-strip::-webkit-scrollbar { height: 4px; }
.lfhlc-run-photos-strip::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 2px; }
.lfhlc-run-photo {
  flex: 0 0 200px; height: 112px;
  border-radius: 8px; background-size: cover; background-position: center;
  cursor: pointer; border: 2px solid transparent; transition: all 0.2s;
}
.lfhlc-run-photo:hover { border-color: ${LFH_COLORS.primaryRed}; transform: scale(1.02); }

/* Lightbox */
.lfhlc-lightbox {
  position: fixed; inset: 0; z-index: 10002;
  display: flex; align-items: center; justify-content: center;
  animation: lfhlc-fadeIn 0.2s ease;
}
.lfhlc-lightbox-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.9); }
.lfhlc-lightbox-content {
  position: relative; max-width: 90%; max-height: 90%;
  display: flex; flex-direction: column; align-items: center;
}
.lfhlc-lightbox-content img {
  max-width: 100%; max-height: 85vh; border-radius: 8px; object-fit: contain;
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
  font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
}
.lfhlc-lightbox-photo { flex-direction: row; align-items: center; gap: 16px; }
.lfhlc-lightbox-photo img { max-width: calc(100% - 100px); }
.lfhlc-lightbox-nav {
  background: rgba(255,255,255,0.15); border: none;
  color: #fff; font-size: 36px; cursor: pointer;
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.lfhlc-lightbox-nav:hover { background: rgba(255,255,255,0.3); transform: scale(1.1); }

/* Detail View */
.lfhlc-detail { display: flex; flex-direction: column; height: 100%; }
.lfhlc-detail-scroll { flex: 1; overflow-y: auto; }
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
.lfhlc-play-btn:hover { background: ${LFH_COLORS.primaryRed}; transform: scale(1.1); }
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
.lfhlc-full-desc { font-size: 13px; line-height: 1.7; color: ${LFH_COLORS.textPrimary}; margin: 0; }

/* Stats Bar */
.lfhlc-stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
.lfhlc-stat-box { text-align: center; padding: 14px 8px; background: ${LFH_COLORS.infoBox}; border-radius: 8px; }
.lfhlc-stat-value { font-size: 15px; font-weight: 700; color: ${LFH_COLORS.primaryRed}; margin-bottom: 3px; }
.lfhlc-stat-label { font-size: 10px; color: ${LFH_COLORS.textSecondary}; text-transform: uppercase; letter-spacing: 0.3px; }

/* Features Grid */
.lfhlc-features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.lfhlc-feature-title {
  font-size: 11px; font-weight: 700; color: ${LFH_COLORS.textSecondary};
  text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;
}
.lfhlc-feature-text { font-size: 13px; line-height: 1.5; color: ${LFH_COLORS.textPrimary}; margin: 0; }
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
.lfhlc-terrain-arrow { margin-left: auto; font-size: 12px; transition: transform 0.2s; }
.lfhlc-terrain-content {
  max-height: 0; overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 18px;
}
.lfhlc-terrain-content.open { max-height: 800px; padding: 0 18px 18px; }
.lfhlc-terrain-map { margin-bottom: 16px; }
.lfhlc-terrain-image { width: 100%; height: 180px; object-fit: cover; border-radius: 8px; }
.lfhlc-terrain-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 0; border-bottom: 1px solid ${LFH_COLORS.border};
}
.lfhlc-terrain-row:last-child { border-bottom: none; }
.lfhlc-terrain-label {
  flex: 0 0 120px; font-size: 11px; font-weight: 700;
  color: ${LFH_COLORS.textSecondary}; text-transform: uppercase;
}
.lfhlc-terrain-value { flex: 1; font-size: 13px; color: ${LFH_COLORS.textPrimary}; }
.lfhlc-terrain-value.lfhlc-highlight { color: #2E7D32; font-weight: 600; }

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
  font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: center;
}
.lfhlc-btn-outline:hover { border-color: ${LFH_COLORS.primaryRed}; color: ${LFH_COLORS.primaryRed}; }
.lfhlc-card-actions { display: flex; gap: 8px; }
.lfhlc-card-actions .lfhlc-btn-primary,
.lfhlc-card-actions .lfhlc-btn-outline { font-size: 12px; padding: 10px 14px; }

/* Aerial Context Section */
.lfhlc-aerial-context-section { margin-bottom: 24px; }
.lfhlc-aerial-context-section .lfhlc-terrain-images { margin-bottom: 12px; }

/* Mobile Responsive */
@media (max-width: 700px) {
  .lfhlc-overview-cards { grid-template-columns: 1fr; }
  .lfhlc-overview-hero { height: 160px; }
  .lfhlc-cta-buttons { flex-direction: column; align-items: center; }
  .lfhlc-cta-buttons .lfhlc-btn-primary,
  .lfhlc-cta-buttons .lfhlc-btn-outline { width: 100%; max-width: 320px; }
  .lfhlc-comparison-header, .lfhlc-comparison-row { grid-template-columns: 100px 1fr 1fr; }
  .lfhlc-comp-cell { padding: 10px 8px; font-size: 11px; }
  .lfhlc-comp-icon { display: none; }
  .lfhlc-stats-bar { grid-template-columns: repeat(2, 1fr); }
  .lfhlc-features-grid { grid-template-columns: 1fr; }
  .lfhlc-hero-image { height: 200px; }
  .lfhlc-play-btn { width: 54px; height: 54px; }
  .lfhlc-play-triangle { border-left-width: 14px; border-top-width: 9px; border-bottom-width: 9px; }
  .lfhlc-tab { padding: 8px 14px; font-size: 11px; white-space: nowrap; }
  .lfhlc-tab-bar { gap: 6px; padding: 10px 16px; }
  .lfhlc-terrain-images { grid-template-columns: 1fr; }
  .lfhlc-terrain-card-img { height: 160px; }
  .lfhlc-run-photo { flex: 0 0 160px; height: 90px; }
  .lfhlc-layout-btns { flex-direction: column; align-items: stretch; gap: 8px; }
  .lfhlc-layout-btn { text-align: center; min-height: 44px; }
  .lfhlc-lightbox-content { max-width: 100%; max-height: 100%; padding: 16px; }
  .lfhlc-lightbox-photo { flex-direction: column; }
  .lfhlc-lightbox-photo img { max-width: 100%; max-height: 70vh; }
  .lfhlc-lightbox-nav { display: none; }
  .lfhlc-lightbox-close { top: 10px; right: 10px; position: fixed; z-index: 10003; }
  .lfhlc-lightbox-caption { font-size: 13px; padding: 0 16px; }
}

/* Mobile Progressive Disclosure */
.lfhlc-collapse-toggle {
  display: flex; align-items: center; gap: 6px;
  width: 100%; padding: 8px 12px; margin-bottom: 8px;
  background: ${LFH_COLORS.infoBox}; border: 1px solid ${LFH_COLORS.border};
  border-radius: 6px; font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 600; color: ${LFH_COLORS.textSecondary};
  cursor: pointer; transition: all 0.2s;
}
.lfhlc-collapse-toggle:hover { border-color: ${LFH_COLORS.primaryRed}; color: ${LFH_COLORS.textPrimary}; }
.lfhlc-toggle-arrow { font-size: 10px; margin-left: auto; }

.lfhlc-gallery-collapsed { display: none !important; }
.lfhlc-gallery-expanded { display: flex !important; }

.lfhlc-comparison-toggle {
  cursor: pointer; display: flex; align-items: center; gap: 6px;
}
.lfhlc-comparison-toggle:hover { color: ${LFH_COLORS.primaryRed}; }
.lfhlc-comparison-collapsed { display: none !important; }
.lfhlc-comparison-expanded { display: block !important; }

.lfhlc-features-hidden { display: none !important; }
.lfhlc-features-shown { display: grid !important; }
.lfhlc-features-more-toggle {
  border-style: dashed;
  margin-bottom: 16px;
}

.lfhlc-run-photos-collapsed { display: none !important; }
.lfhlc-run-photos-expanded { display: block !important; }
.lfhlc-run-photos-toggle { margin-bottom: 12px; }

@media (max-width: 500px) {
  .lfhlc-comparison-header, .lfhlc-comparison-row { grid-template-columns: 80px 1fr 1fr; }
  .lfhlc-comp-cell { padding: 8px 6px; font-size: 10px; }
  .lfhlc-detail-actions { flex-direction: column; }
  .lfhlc-btn-primary, .lfhlc-btn-outline { width: 100%; min-height: 48px; }
  .lfhlc-gallery-thumb { flex: 0 0 100px; height: 66px; }
  .lfhlc-terrain-row { flex-direction: column; gap: 4px; }
  .lfhlc-terrain-label { flex: none; }
  .lfhlc-tab { min-height: 32px; padding: 6px 10px; font-size: 10px; border-radius: 16px; }
  .lfhlc-tab-bar { padding: 8px 12px; gap: 4px; }
  .lfhlc-run-photo { flex: 0 0 140px; height: 78px; }
  .lfhlc-section-title { font-size: 13px; }
  .lfhlc-hero-image { height: 150px; }
  .lfhlc-terrain-card-img { height: 120px; }
  .lfhlc-play-btn { width: 48px; height: 48px; }
  .lfhlc-play-triangle { border-left-width: 12px; border-top-width: 8px; border-bottom-width: 8px; margin-left: 3px; }
  .lfhlc-content { padding: 14px; }
}
`;
}
