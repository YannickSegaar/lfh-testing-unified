/**
 * Last Frontier Hub - Tours Tab
 *
 * Extracted from lfh-tour-explorer-modal-booking-unified.js.
 * Renders tour grid, detail, compare, and booking views inside the hub.
 * No modal shell — the hub handles that.
 *
 * Cross-nav callbacks replaced with config.onSwitchTab().
 * State save/restore enables tab memory.
 *
 * @version 1.0.0
 * @author Last Frontier Heliskiing / RomAIx
 */

import {
  LFH_TOURS, LFH_COLORS, LFH_VIDEOS, INCLUDED_ITEMS,
  silentVariableUpdate, interactWithAgent, lodgeName, lodgeBadgeColor,
} from './lfh-hub-shared.js';
import { renderBookingForm } from './lfh-tour-booking-form.js';

// ============================================================================
// MODULE STATE (scoped per render call)
// ============================================================================

let _state = null;

export function getToursTabState() {
  if (!_state) return null;
  return {
    currentView: _state.currentView,
    currentTourId: _state.currentTourId,
    activeFilters: { ..._state.activeFilters },
    compareTours: [..._state.compareTours],
  };
}

// ============================================================================
// RENDER: Tours Tab Entry Point
// ============================================================================

/**
 * @param {HTMLElement} container - The tab panel element
 * @param {Object} config - Hub config (onSwitchTab, webhookUrl, etc.)
 * @param {Object|null} savedState - Restored state from tab snapshot
 */
export function renderToursTab(container, config, savedState) {
  const {
    onSwitchTab, onActionTaken, onCloseHub,
    webhookUrl = '', conversationId = null, userId = null,
    isMobile = false, tourId = null,
  } = config;

  // Initialize or restore state
  _state = {
    filteredTours: [...LFH_TOURS],
    activeFilters: savedState?.activeFilters || { lodge: 'all', duration: 'all', skill: 'all' },
    compareTours: savedState?.compareTours || [],
    currentView: savedState?.currentView || 'grid',
    currentTourId: savedState?.currentTourId || null,
    actionTaken: false,
  };

  // Build DOM structure
  container.innerHTML = '';

  // Filter Bar
  const filterBar = document.createElement('div');
  filterBar.className = 'lfhte-filter-bar';
  filterBar.id = 'lfhte-filter-bar';
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
  container.appendChild(filterBar);

  // Content Area
  const content = document.createElement('div');
  content.className = 'lfhte-content';
  content.id = 'lfhte-content';
  container.appendChild(content);

  // Compare Tray
  const compareTray = document.createElement('div');
  compareTray.className = 'lfhte-compare-tray';
  compareTray.id = 'lfhte-compare-tray';
  compareTray.style.display = 'none';
  container.appendChild(compareTray);

  // Slide Panel (for 'slide' booking variant)
  const slidePanel = document.createElement('div');
  slidePanel.className = 'lfhte-sp-overlay';
  slidePanel.id = 'lfhte-sp-overlay';
  slidePanel.style.display = 'none';
  slidePanel.innerHTML = `
    <div class="lfhte-sp-backdrop"></div>
    <div class="lfhte-sp-panel" id="lfhte-sp-panel">
      <div class="lfhte-sp-header">
        <button class="lfhte-sp-back" id="lfhte-sp-back">&larr; Back to Tour</button>
        <span class="lfhte-sp-title">Booking Request</span>
      </div>
      <div class="lfhte-sp-content" id="lfhte-sp-content"></div>
    </div>
  `;
  container.appendChild(slidePanel);

  // Apply initial filters if restored
  if (_state.activeFilters.lodge !== 'all') {
    filterBar.querySelector('#lfhte-filter-lodge').value = _state.activeFilters.lodge;
  }
  if (_state.activeFilters.duration !== 'all') {
    filterBar.querySelector('#lfhte-filter-duration').value = _state.activeFilters.duration;
  }
  if (_state.activeFilters.skill !== 'all') {
    filterBar.querySelector('#lfhte-filter-skill').value = _state.activeFilters.skill;
  }
  applyFilters();

  // Restore view or render grid
  if (savedState?.currentView === 'detail' && savedState.currentTourId) {
    const tour = LFH_TOURS.find(t => t.id === savedState.currentTourId);
    if (tour) {
      renderTourDetail(tour);
    } else {
      renderTourGrid();
    }
  } else if (savedState?.currentView === 'compare' && savedState.compareTours?.length >= 2) {
    renderCompareView();
  } else {
    renderTourGrid();
  }

  // If initial tourId provided, go to detail
  if (tourId && !savedState) {
    const tour = LFH_TOURS.find(t => t.id === tourId);
    if (tour) {
      setTimeout(() => renderTourDetail(tour), 300);
    }
  }

  silentVariableUpdate('ext_last_action', 'tour_explorer_opened');

  // ========================================================================
  // RENDER: Tour Grid
  // ========================================================================

  function renderTourGrid() {
    _state.currentView = 'grid';
    filterBar.style.display = '';

    const grid = document.createElement('div');
    grid.className = 'lfhte-tour-grid';

    if (_state.filteredTours.length === 0) {
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
        _state.activeFilters = { lodge: 'all', duration: 'all', skill: 'all' };
        filterBar.querySelector('#lfhte-filter-lodge').value = 'all';
        filterBar.querySelector('#lfhte-filter-duration').value = 'all';
        filterBar.querySelector('#lfhte-filter-skill').value = 'all';
        applyFilters();
      });
      return;
    }

    _state.filteredTours.forEach(tour => {
      const card = document.createElement('div');
      card.className = 'lfhte-tour-card';
      const isComparing = _state.compareTours.includes(tour.id);
      const lodgeBadges = tour.lodges
        .map(l => `<span class="lfhte-lodge-badge" style="background:${lodgeBadgeColor(tour.lodges)}">${lodgeName(l)}</span>`)
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

    content.querySelectorAll('.lfhte-view-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const tour = LFH_TOURS.find(t => t.id === btn.dataset.tourId);
        if (tour) renderTourDetail(tour);
      });
    });

    content.querySelectorAll('.lfhte-compare-toggle').forEach(btn => {
      btn.addEventListener('click', () => toggleCompare(btn.dataset.tourId));
    });
  }

  // ========================================================================
  // RENDER: Tour Detail
  // ========================================================================

  function renderTourDetail(tour) {
    _state.currentView = 'detail';
    _state.currentTourId = tour.id;
    filterBar.style.display = '';
    silentVariableUpdate('ext_current_tour', tour.id);

    const detail = document.createElement('div');
    detail.className = 'lfhte-detail';

    const videoEntry = Object.values(LFH_VIDEOS).find(v => v.id === tour.videoId);
    const videoTitle = videoEntry ? videoEntry.title : 'A Day in the Life';

    // Pricing table
    let pricingRows = '';
    if (tour.pricing.safari) {
      pricingRows = `<tr><td>Safari Rate</td><td>${tour.pricing.safari.peak || '\u2014'}</td></tr>`;
    } else {
      Object.keys(tour.pricing).forEach(key => {
        const p = tour.pricing[key];
        const lodgeLabel = `<button class="lfhte-lodge-name-link" data-lodge-id="${key}">${lodgeName(key)}</button>`;
        pricingRows += `
          <tr>
            <td>${lodgeLabel}</td>
            <td>${p.early || '\u2014'}</td>
            <td>${p.peak || '\u2014'}</td>
            <td>${p.late || '\u2014'}</td>
          </tr>
        `;
      });
    }

    const pricingHeader = tour.pricing.safari
      ? '<tr><th>Rate Type</th><th>Peak Season</th></tr>'
      : '<tr><th>Lodge</th><th>Early (Dec-Jan)</th><th>Peak (Feb-Mar)</th><th>Late (Apr)</th></tr>';

    const galleryHTML = tour.galleryImages
      .map((img, i) => `<div class="lfhte-gallery-thumb" style="background-image: url('${img}')" data-index="${i}"></div>`)
      .join('');

    const includedHTML = INCLUDED_ITEMS.map(
      item => `<div class="lfhte-included-item"><span class="lfhte-check-icon">&#10003;</span> ${item}</div>`
    ).join('');

    const bestForHTML = tour.bestFor
      .map(bf => `<span class="lfhte-best-for-badge">${bf}</span>`)
      .join('');

    detail.innerHTML = `
      <div class="lfhte-detail-header">
        <button class="lfhte-back-btn" id="lfhte-back-to-grid">&larr; All Tours</button>
        <h2 class="lfhte-detail-title">${tour.name}</h2>
        <span class="lfhte-detail-subtitle">${tour.subtitle}</span>
      </div>

      <div class="lfhte-detail-scroll">
        <div class="lfhte-hero-media" id="lfhte-hero-media">
          <div class="lfhte-hero-image" style="background-image: url('${tour.heroImage}')">
            <button class="lfhte-play-btn" id="lfhte-play-video" data-vimeo="${tour.videoId}">
              <span class="lfhte-play-triangle"></span>
            </button>
            <div class="lfhte-hero-label">Watch: ${videoTitle}</div>
          </div>
        </div>

        <div class="lfhte-gallery-strip">${galleryHTML}</div>

        <div class="lfhte-detail-section">
          <p class="lfhte-full-desc">${tour.description}</p>
          <div class="lfhte-best-for">${bestForHTML}</div>
        </div>

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

        <div class="lfhte-detail-section">
          <h3 class="lfhte-section-title">Pricing (CAD per person)</h3>
          <table class="lfhte-pricing-table">
            <thead>${pricingHeader}</thead>
            <tbody>${pricingRows}</tbody>
          </table>
          <p class="lfhte-pricing-note">5% GST applies. 20% deposit to confirm. Extra vertical: $210/1,000m.</p>
        </div>

        <div class="lfhte-detail-section">
          <h3 class="lfhte-section-title">What's Included</h3>
          <div class="lfhte-included-grid">${includedHTML}</div>
        </div>

        <div class="lfhte-detail-actions">
          <div class="lfhte-actions-row">
            <button class="lfhte-btn-primary lfhte-action-book" data-tour-id="${tour.id}">I Want to Book</button>
            <button class="lfhte-btn-outline lfhte-action-ask" data-tour-id="${tour.id}">Ask About This Tour</button>
          </div>
          <div class="lfhte-actions-row">
            <button class="lfhte-btn-outline lfhte-back-link" id="lfhte-back-link">&larr; Back to All Tours</button>
            <button class="lfhte-btn-outline lfhte-compare-lodges-detail" id="lfhte-compare-lodges-detail">Compare Lodges</button>
          </div>
        </div>
      </div>
    `;

    content.innerHTML = '';
    content.appendChild(detail);

    // Event Listeners
    detail.querySelector('#lfhte-back-to-grid')?.addEventListener('click', renderTourGrid);
    detail.querySelector('#lfhte-back-link')?.addEventListener('click', renderTourGrid);

    // Gallery thumbnails
    detail.querySelectorAll('.lfhte-gallery-thumb').forEach(thumb => {
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
        heroMedia.querySelector('#lfhte-play-video')?.addEventListener('click', (e) => {
          heroMedia.innerHTML = `
            <div class="lfhte-video-embed">
              <iframe src="https://player.vimeo.com/video/${e.currentTarget.dataset.vimeo}?autoplay=1&title=0&byline=0&portrait=0"
                allow="autoplay; fullscreen" allowfullscreen></iframe>
            </div>
          `;
        });
        detail.querySelectorAll('.lfhte-gallery-thumb').forEach(t => (t.style.borderColor = 'transparent'));
        thumb.style.borderColor = LFH_COLORS.primaryRed;
      });
    });

    detail.querySelector('#lfhte-play-video')?.addEventListener('click', (e) => {
      const heroMedia = detail.querySelector('#lfhte-hero-media');
      heroMedia.innerHTML = `
        <div class="lfhte-video-embed">
          <iframe src="https://player.vimeo.com/video/${e.currentTarget.dataset.vimeo}?autoplay=1&title=0&byline=0&portrait=0"
            allow="autoplay; fullscreen" allowfullscreen></iframe>
        </div>
      `;
    });

    // Booking button
    detail.querySelector('.lfhte-action-book')?.addEventListener('click', () => {
      openReplaceBooking(tour);
    });

    // Ask about tour
    detail.querySelector('.lfhte-action-ask')?.addEventListener('click', () => {
      interactWithAgent('ext_user_action', {
        action: 'tour_inquiry',
        source: 'tour_explorer',
        tourId: tour.id,
        tourName: tour.name,
        lodge: tour.lodges.join(', '),
        duration: tour.duration,
      });
      _state.actionTaken = true;
      onActionTaken();
      onCloseHub();
    });

    // Lodge name links in pricing table → switch to lodges tab
    detail.querySelectorAll('.lfhte-lodge-name-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        interactWithAgent('ext_user_action', {
          action: 'tour_compare_lodges',
          source: 'tour_explorer'
        });
        onSwitchTab('lodges', { focusLodge: link.dataset.lodgeId });
      });
    });

    // Compare Lodges detail button → switch to lodges tab
    detail.querySelector('#lfhte-compare-lodges-detail')?.addEventListener('click', () => {
      interactWithAgent('ext_user_action', {
        action: 'tour_compare_lodges',
        source: 'tour_explorer'
      });
      onSwitchTab('lodges');
    });
  }

  // ========================================================================
  // BOOKING: Replace Content
  // ========================================================================

  function openReplaceBooking(tour) {
    _state.currentView = 'booking';
    filterBar.style.display = 'none';
    silentVariableUpdate('ext_last_action', 'booking_form_opened');

    const bookingContainer = document.createElement('div');
    bookingContainer.style.cssText = 'height:100%;overflow-y:auto;';

    const backHeader = document.createElement('div');
    backHeader.style.cssText = `
      padding: 12px 20px; border-bottom: 1px solid ${LFH_COLORS.border};
      display: flex; align-items: center; gap: 12px;
    `;
    backHeader.innerHTML = `
      <button class="lfhte-back-btn" id="lfhte-booking-back">&larr; Back to ${tour.name}</button>
      <span style="font-family:'Nexa Rust Sans Black 2',sans-serif;font-size:14px;font-weight:900;color:${LFH_COLORS.textPrimary};text-transform:uppercase;letter-spacing:1px;">Booking Request</span>
    `;

    const formContainer = document.createElement('div');
    formContainer.style.cssText = 'flex:1;overflow-y:auto;';

    bookingContainer.appendChild(backHeader);
    bookingContainer.appendChild(formContainer);

    content.innerHTML = '';
    content.appendChild(bookingContainer);

    renderBookingForm(formContainer, {
      tour,
      webhookUrl,
      variant: 'replace',
      conversationId,
      userId,
      onSubmitSuccess: (payload) => handleBookingSuccess(tour, payload),
      onBack: () => renderTourDetail(tour),
    });

    backHeader.querySelector('#lfhte-booking-back')?.addEventListener('click', () => {
      renderTourDetail(tour);
    });
  }

  // ========================================================================
  // BOOKING: Post-Submit
  // ========================================================================

  function handleBookingSuccess(tour, payload) {
    interactWithAgent('ext_user_action', {
      action: 'booking_request_submitted',
      source: 'tour_explorer',
      tourId: tour.id,
      tourName: tour.name,
      requestType: payload.bookingRequest.requestType,
    });

    _state.actionTaken = true;
    onActionTaken();

    setTimeout(() => {
      onCloseHub();
    }, 2500);
  }

  // ========================================================================
  // RENDER: Compare View
  // ========================================================================

  function renderCompareView() {
    _state.currentView = 'compare';
    const tours = _state.compareTours.map(id => LFH_TOURS.find(t => t.id === id)).filter(Boolean);
    silentVariableUpdate('ext_tours_compared', _state.compareTours.join(','));

    const compare = document.createElement('div');
    compare.className = 'lfhte-compare';

    const headerCells = tours.map(t =>
      `<th class="lfhte-compare-th"><div class="lfhte-compare-tour-name">${t.name}</div><div class="lfhte-compare-tour-sub">${t.subtitle}</div></th>`
    ).join('');

    const rows = [
      { label: 'Duration', fn: t => t.duration },
      { label: 'Vertical Guarantee', fn: t => t.verticalGuarantee },
      { label: 'Lodges', fn: t => t.lodges.map(lodgeName).join(' & ') },
      { label: 'Skill Level', fn: t => t.skillLevel },
      { label: 'Starting Price', fn: t => `$${t.priceFrom.toLocaleString()} CAD` },
      { label: 'Best For', fn: t => t.bestFor.join(', ') },
    ];

    const rowsHTML = rows
      .map(row =>
        `<tr><td class="lfhte-compare-label">${row.label}</td>${tours.map(t => `<td>${row.fn(t)}</td>`).join('')}</tr>`
      ).join('');

    let compareBody;
    if (isMobile) {
      const cardsHTML = rows.map(row => {
        const valuesHTML = tours.map(t =>
          `<div class="lfhte-compare-card-value"><span class="lfhte-compare-card-tour">${t.name}</span><span>${row.fn(t)}</span></div>`
        ).join('');
        return `<div class="lfhte-compare-card"><div class="lfhte-compare-card-label">${row.label}</div>${valuesHTML}</div>`;
      }).join('');
      compareBody = `<div class="lfhte-compare-cards">${cardsHTML}</div>`;
    } else {
      compareBody = `
        <div class="lfhte-compare-scroll">
          <table class="lfhte-compare-table">
            <thead><tr><th></th>${headerCells}</tr></thead>
            <tbody>${rowsHTML}</tbody>
          </table>
        </div>`;
    }

    compare.innerHTML = `
      <div class="lfhte-compare-header">
        <button class="lfhte-back-btn" id="lfhte-compare-back">&larr; Back to Tours</button>
        <h2 class="lfhte-compare-title">Comparing ${tours.length} Tours</h2>
      </div>
      ${compareBody}
      <div class="lfhte-compare-actions">
        <button class="lfhte-btn-outline" id="lfhte-compare-clear">Clear Comparison</button>
      </div>
    `;

    content.innerHTML = '';
    content.appendChild(compare);

    compare.querySelector('#lfhte-compare-back')?.addEventListener('click', renderTourGrid);
    compare.querySelector('#lfhte-compare-clear')?.addEventListener('click', () => {
      _state.compareTours = [];
      updateCompareTray();
      renderTourGrid();
    });
  }

  // ========================================================================
  // COMPARE: Toggle & Tray
  // ========================================================================

  function toggleCompare(tourId) {
    const idx = _state.compareTours.indexOf(tourId);
    if (idx >= 0) {
      _state.compareTours.splice(idx, 1);
    } else if (_state.compareTours.length < 3) {
      _state.compareTours.push(tourId);
    }
    updateCompareTray();
    if (_state.currentView === 'grid') renderTourGrid();
  }

  function updateCompareTray() {
    if (_state.compareTours.length < 2) {
      compareTray.style.display = 'none';
      return;
    }

    compareTray.style.display = 'flex';
    const thumbs = _state.compareTours.map(id => {
      const t = LFH_TOURS.find(tour => tour.id === id);
      return t
        ? `<div class="lfhte-tray-thumb">
             <div class="lfhte-tray-img" style="background-image:url('${t.thumbnailImage}')"></div>
             <span>${t.name}</span>
             <button class="lfhte-tray-remove" data-tour-id="${id}">&times;</button>
           </div>`
        : '';
    }).join('');

    compareTray.innerHTML = `
      <div class="lfhte-tray-tours">${thumbs}</div>
      <button class="lfhte-btn-primary lfhte-tray-compare-btn">Compare ${_state.compareTours.length} Tours</button>
    `;

    compareTray.querySelectorAll('.lfhte-tray-remove').forEach(btn => {
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
    _state.filteredTours = LFH_TOURS.filter(tour => {
      if (_state.activeFilters.lodge !== 'all') {
        if (_state.activeFilters.lodge === 'both') {
          if (!tour.lodges.includes('both')) return false;
        } else {
          if (!tour.lodges.includes(_state.activeFilters.lodge) && !tour.lodges.includes('both')) return false;
        }
      }
      if (_state.activeFilters.duration !== 'all') {
        if (_state.activeFilters.duration === 'safari') {
          if (!tour.id.startsWith('safari')) return false;
        } else if (_state.activeFilters.duration === 'private') {
          if (tour.id !== 'private') return false;
        } else {
          if (tour.durationDays !== parseInt(_state.activeFilters.duration)) return false;
        }
      }
      if (_state.activeFilters.skill !== 'all') {
        if (_state.activeFilters.skill === 'expert' && !tour.skillLevel.includes('Expert')) return false;
        if (_state.activeFilters.skill === 'intermediate' && tour.skillLevel === 'Expert Only') return false;
      }
      return true;
    });

    silentVariableUpdate('ext_filters_applied', JSON.stringify(_state.activeFilters));
    const countEl = container.querySelector('#lfhte-results-count');
    if (countEl) {
      countEl.textContent = `${_state.filteredTours.length} tour${_state.filteredTours.length !== 1 ? 's' : ''}`;
    }
    renderTourGrid();
  }

  filterBar.querySelector('#lfhte-filter-lodge')?.addEventListener('change', (e) => {
    _state.activeFilters.lodge = e.target.value;
    silentVariableUpdate('ext_current_lodge', e.target.value);
    applyFilters();
  });

  filterBar.querySelector('#lfhte-filter-duration')?.addEventListener('change', (e) => {
    _state.activeFilters.duration = e.target.value;
    applyFilters();
  });

  filterBar.querySelector('#lfhte-filter-skill')?.addEventListener('change', (e) => {
    _state.activeFilters.skill = e.target.value;
    applyFilters();
  });
}

// ============================================================================
// STYLES (unchanged from original modal — all .lfhte-* prefixed)
// ============================================================================

export function buildToursStyles() {
  return `
@keyframes lfhte-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes lfhte-fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes lfhte-slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.lfhte-filter-bar {
  padding: 12px 20px; background: ${LFH_COLORS.infoBox};
  border-bottom: 1px solid ${LFH_COLORS.border}; flex-shrink: 0;
}
.lfhte-filters-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
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
.lfhte-lodge-name-link {
  background: none; border: none; padding: 0;
  font-weight: 700; font-size: inherit; font-family: inherit;
  color: ${LFH_COLORS.primaryRed}; cursor: pointer;
  text-decoration: underline; text-decoration-style: dotted;
  text-underline-offset: 2px; transition: color 0.2s;
}
.lfhte-lodge-name-link:hover { color: #c4221a; }

.lfhte-content {
  flex: 1; overflow-y: auto; padding: 20px;
  font-family: 'Inter', sans-serif;
}
.lfhte-content::-webkit-scrollbar { width: 6px; }
.lfhte-content::-webkit-scrollbar-track { background: ${LFH_COLORS.infoBox}; }
.lfhte-content::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 3px; }

.lfhte-tour-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 700px) {
  .lfhte-tour-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .lfhte-card-image { height: 100px; }
  .lfhte-card-body { padding: 10px; }
  .lfhte-card-title { font-size: 13px; margin-bottom: 4px; }
  .lfhte-card-stats { font-size: 10px; margin-bottom: 4px; }
  .lfhte-card-price { font-size: 12px; margin-bottom: 4px; }
  .lfhte-card-desc { display: none; }
  .lfhte-card-actions { flex-direction: column; gap: 4px; }
  .lfhte-card-actions .lfhte-btn-primary,
  .lfhte-card-actions .lfhte-btn-outline { padding: 7px 8px; font-size: 10px; }
}

.lfhte-tour-card {
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 10px;
  overflow: hidden; transition: all 0.2s ease; background: #fff;
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
  font-size: 11px; color: ${LFH_COLORS.textSecondary}; margin-bottom: 6px;
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
  font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: center;
}
.lfhte-btn-outline:hover { border-color: ${LFH_COLORS.primaryRed}; color: ${LFH_COLORS.primaryRed}; }
.lfhte-btn-outline.active {
  background: ${LFH_COLORS.selectedTint};
  border-color: ${LFH_COLORS.primaryRed}; color: ${LFH_COLORS.primaryRed};
}

.lfhte-no-results { grid-column: 1 / -1; text-align: center; padding: 60px 20px; }
.lfhte-no-results-icon { font-size: 48px; margin-bottom: 12px; }
.lfhte-no-results p { font-size: 16px; color: ${LFH_COLORS.textSecondary}; margin-bottom: 16px; }

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
.lfhte-detail-subtitle { font-size: 13px; color: ${LFH_COLORS.textSecondary}; font-style: italic; }
.lfhte-detail-scroll { flex: 1; overflow-y: auto; }

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
.lfhte-play-btn:hover { background: ${LFH_COLORS.primaryRed}; transform: scale(1.1); }
.lfhte-play-btn:hover .lfhte-play-triangle { border-left-color: #fff; }
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

.lfhte-stats-bar {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;
}
.lfhte-stat-box {
  text-align: center; padding: 12px 8px;
  background: ${LFH_COLORS.infoBox}; border-radius: 8px;
}
.lfhte-stat-value {
  font-size: 14px; font-weight: 700; color: ${LFH_COLORS.primaryRed}; margin-bottom: 2px;
}
.lfhte-stat-label {
  font-size: 10px; color: ${LFH_COLORS.textSecondary};
  text-transform: uppercase; letter-spacing: 0.3px;
}

.lfhte-pricing-table { width: 100%; border-collapse: collapse; font-size: 12px; }
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

.lfhte-included-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.lfhte-included-item {
  font-size: 12px; color: ${LFH_COLORS.textPrimary};
  display: flex; align-items: center; gap: 6px;
}
.lfhte-check-icon { color: #2E7D32; font-weight: 700; }

.lfhte-detail-actions {
  display: flex; flex-direction: column; gap: 10px;
  padding: 16px 0; border-top: 1px solid ${LFH_COLORS.border};
  margin-top: 8px;
}
.lfhte-actions-row { display: flex; gap: 10px; }

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

.lfhte-compare { display: flex; flex-direction: column; height: 100%; }
.lfhte-compare-header {
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
}
.lfhte-compare-title {
  font-size: 18px; font-weight: 700; color: ${LFH_COLORS.textPrimary}; margin: 0;
}
.lfhte-compare-scroll { flex: 1; overflow: auto; }
.lfhte-compare-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.lfhte-compare-table th, .lfhte-compare-table td {
  padding: 12px; border: 1px solid ${LFH_COLORS.border};
  text-align: left; vertical-align: top;
}
.lfhte-compare-th { background: ${LFH_COLORS.infoBox}; min-width: 160px; }
.lfhte-compare-tour-name { font-size: 14px; font-weight: 700; color: ${LFH_COLORS.primaryRed}; }
.lfhte-compare-tour-sub { font-size: 11px; color: ${LFH_COLORS.textSecondary}; margin-top: 2px; }
.lfhte-compare-label { font-weight: 600; background: ${LFH_COLORS.infoBox}; white-space: nowrap; }
.lfhte-compare-actions {
  display: flex; gap: 10px; padding: 16px 0;
  border-top: 1px solid ${LFH_COLORS.border}; margin-top: 8px;
}

/* Mobile compare cards */
.lfhte-compare-cards {
  display: flex; flex-direction: column; gap: 10px;
  padding: 0 2px; flex: 1; overflow-y: auto;
}
.lfhte-compare-card {
  border: 1px solid ${LFH_COLORS.border}; border-radius: 8px; overflow: hidden;
}
.lfhte-compare-card-label {
  padding: 10px 14px; background: ${LFH_COLORS.textPrimary}; color: #fff;
  font-size: 13px; font-weight: 700;
}
.lfhte-compare-card-value {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-bottom: 1px solid ${LFH_COLORS.border};
  font-size: 12px; color: ${LFH_COLORS.textPrimary};
}
.lfhte-compare-card-value:last-child { border-bottom: none; }
.lfhte-compare-card-tour {
  font-weight: 700; font-size: 12px; flex-shrink: 0; margin-right: 12px;
}

/* Slide Panel */
.lfhte-sp-overlay {
  position: absolute; inset: 0; z-index: 100;
  display: flex; pointer-events: none;
}
.lfhte-sp-overlay.open { pointer-events: auto; }
.lfhte-sp-backdrop {
  flex: 1; background: rgba(0,0,0,0);
  transition: background 0.3s ease;
}
.lfhte-sp-overlay.open .lfhte-sp-backdrop { background: rgba(0,0,0,0.3); }
.lfhte-sp-panel {
  width: 70%; max-width: 480px; height: 100%;
  background: ${LFH_COLORS.background};
  box-shadow: -4px 0 20px rgba(0,0,0,0.15);
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.lfhte-sp-overlay.open .lfhte-sp-panel { transform: translateX(0); }
.lfhte-sp-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; background: ${LFH_COLORS.textPrimary}; flex-shrink: 0;
}
.lfhte-sp-back {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px; padding: 6px 12px;
  font-family: 'Inter', sans-serif; font-size: 11px;
  font-weight: 700; color: #fff; cursor: pointer;
  transition: all 0.2s; text-transform: uppercase;
}
.lfhte-sp-back:hover { background: rgba(255,255,255,0.2); }
.lfhte-sp-title {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 13px; font-weight: 900; color: #fff;
  text-transform: uppercase; letter-spacing: 1.5px;
}
.lfhte-sp-content { flex: 1; overflow-y: auto; }
.lfhte-sp-content::-webkit-scrollbar { width: 5px; }
.lfhte-sp-content::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 3px; }

@media (max-width: 600px) {
  .lfhte-sp-panel { width: 100%; max-width: 100%; }
}

@media (max-width: 500px) {
  .lfhte-stats-bar { grid-template-columns: repeat(2, 1fr); }
  .lfhte-pricing-table { display: block; overflow-x: auto; }
  .lfhte-hero-image { height: 200px; }
  .lfhte-filter-bar { padding: 10px 12px; }
  .lfhte-filter-group { min-width: 100px; }
  .lfhte-filter-group select { padding: 6px 8px; }
  .lfhte-included-grid { grid-template-columns: 1fr; }
}
`;
}
