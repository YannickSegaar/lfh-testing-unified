/**
 * Last Frontier Tour Explorer - Enhanced Modal with Booking (Unified Event Architecture)
 *
 * Extends the Tour Explorer modal with in-modal booking form.
 * Two UI variants: Replace (content swap) and Slide (side panel).
 *
 * Does NOT modify the original modal module. Imports shared data
 * and rebuilds the modal with booking functionality.
 *
 * Uses the Unified Event Architecture for all agent interactions:
 *   - ext_user_action  (tour_inquiry, booking_request_submitted)
 *   - ext_modal_closed (tour_explorer)
 *
 * @version 2.0.0-unified
 * @author Last Frontier Heliskiing / RomAIx
 */

import { LFH_TOURS, LFH_COLORS, LFH_ASSETS, LFH_VIDEOS } from './lfh-tour-explorer-modal.js';
import { renderBookingForm } from './lfh-tour-booking-form.js';

// ============================================================================
// HELPERS (mirrored from modal module to avoid deep coupling)
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

function silentVariableUpdate(name, value) {
  try {
    if (window.voiceflow?.chat) {
      window.voiceflow.chat.proactive.push({ type: 'save', payload: { [name]: value } });
    }
  } catch (e) { /* silent */ }
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
  } catch (e) { console.log('[TourExplorer] interact error:', e); }
}

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
// MODAL: Open with Booking
// ============================================================================

/**
 * @param {string|null} focusTourId - Tour ID to focus on immediately
 * @param {Object} config
 * @param {string} [config.bookingVariant='replace'] - 'replace' or 'slide'
 * @param {string} [config.webhookUrl=''] - n8n webhook endpoint
 * @param {string|null} [config.conversationId]
 * @param {string|null} [config.userId]
 */
export function openTourExplorerModalWithBookingUnified(focusTourId = null, config = {}) {
  if (document.getElementById('lfh-tour-explorer-modal')) return;

  const {
    bookingVariant = 'replace',
    webhookUrl = '',
    conversationId = null,
    userId = null,
    visitorContext = {},
    conversationHistory = null,
    intentSignals = {},
    initialLodgeFilter = 'all',
    onCompareLodges = null,
    onCheckConditions = null,
    isMobile = false,
  } = config;

  // State
  let filteredTours = [...LFH_TOURS];
  let activeFilters = { lodge: initialLodgeFilter, duration: 'all', skill: 'all' };
  let compareTours = [];
  let currentView = 'grid'; // 'grid' | 'detail' | 'compare' | 'booking'
  let currentTourId = null;
  let actionTaken = false;
  const abortController = new AbortController();

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
    position: relative;
  `;

  // --- Inject Styles ---
  const styleEl = document.createElement('style');
  styleEl.textContent = buildModalStyles() + buildSlidePanelStyles() + (isMobile ? buildMobileCompareStyles() : '');
  modal.appendChild(styleEl);

  if (isMobile) modal.classList.add('lfhte-mobile');

  // --- Header Bar ---
  const headerBar = document.createElement('div');
  headerBar.className = 'lfhte-header-bar';
  headerBar.innerHTML = `
    <span class="lfhte-header-title">Tour Explorer</span>
    <button class="lfhte-close-btn" aria-label="Close">&times;</button>
  `;
  modal.appendChild(headerBar);

  // --- Filter Bar ---
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
      ${onCompareLodges ? '<button class="lfhte-compare-lodges-link" id="lfhte-compare-lodges-btn">&#9776; Compare Lodges</button>' : ''}
      ${onCheckConditions ? '<button class="lfhte-conditions-link" id="lfhte-check-conditions-btn">&#9729; Conditions</button>' : ''}
    </div>
  `;
  modal.appendChild(filterBar);

  // --- Compare Lodges button handler ---
  if (onCompareLodges) {
    filterBar.querySelector('#lfhte-compare-lodges-btn')?.addEventListener('click', () => {
      actionTaken = true;
      interactWithAgent('ext_user_action', {
        action: 'tour_compare_lodges',
        source: 'tour_explorer'
      });
      closeModal();
      setTimeout(() => onCompareLodges(), 350);
    });
  }

  // --- Check Conditions button handler ---
  if (onCheckConditions) {
    filterBar.querySelector('#lfhte-check-conditions-btn')?.addEventListener('click', () => {
      actionTaken = true;
      interactWithAgent('ext_user_action', {
        action: 'tour_check_conditions',
        source: 'tour_explorer'
      });
      closeModal();
      setTimeout(() => onCheckConditions(), 350);
    });
  }

  // --- Main Content Area ---
  const content = document.createElement('div');
  content.className = 'lfhte-content';
  content.id = 'lfhte-content';
  modal.appendChild(content);

  // --- Compare Tray ---
  const compareTray = document.createElement('div');
  compareTray.className = 'lfhte-compare-tray';
  compareTray.id = 'lfhte-compare-tray';
  compareTray.style.display = 'none';
  modal.appendChild(compareTray);

  // --- Slide Panel (for 'slide' variant) ---
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
  modal.appendChild(slidePanel);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // --- Apply initial lodge filter if set ---
  if (initialLodgeFilter !== 'all') {
    modal.querySelector('#lfhte-filter-lodge').value = initialLodgeFilter;
    filteredTours = LFH_TOURS.filter((tour) => {
      if (initialLodgeFilter === 'both') {
        return tour.lodges.includes('both');
      }
      return tour.lodges.includes(initialLodgeFilter) || tour.lodges.includes('both');
    });
    modal.querySelector('#lfhte-results-count').textContent =
      `${filteredTours.length} tour${filteredTours.length !== 1 ? 's' : ''}`;
  }

  // --- Render Initial Grid ---
  renderTourGrid();

  if (focusTourId) {
    const tour = LFH_TOURS.find((t) => t.id === focusTourId);
    if (tour) {
      setTimeout(() => renderTourDetail(tour), 300);
    }
  }

  silentVariableUpdate('ext_last_action', 'tour_explorer_booking_opened');

  // ========================================================================
  // RENDER: Tour Grid
  // ========================================================================

  function renderTourGrid() {
    currentView = 'grid';
    filterBar.style.display = '';

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
  // RENDER: Tour Detail (with booking button override)
  // ========================================================================

  function renderTourDetail(tour) {
    currentView = 'detail';
    currentTourId = tour.id;
    filterBar.style.display = '';
    silentVariableUpdate('ext_current_tour', tour.id);

    const detail = document.createElement('div');
    detail.className = 'lfhte-detail';

    const videoEntry = Object.values(LFH_VIDEOS).find((v) => v.id === tour.videoId);
    const videoTitle = videoEntry ? videoEntry.title : 'A Day in the Life';

    // Pricing table rows
    let pricingRows = '';
    if (tour.pricing.safari) {
      pricingRows = `<tr><td>Safari Rate</td><td>${tour.pricing.safari.peak || '\u2014'}</td></tr>`;
    } else {
      const lodgeKeys = Object.keys(tour.pricing);
      lodgeKeys.forEach((key) => {
        const p = tour.pricing[key];
        const lodgeLabel = onCompareLodges
          ? `<button class="lfhte-lodge-name-link" data-lodge-id="${key}">${lodgeName(key)}</button>`
          : `<strong>${lodgeName(key)}</strong>`;
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
      (item) => `<div class="lfhte-included-item"><span class="lfhte-check-icon">&#10003;</span> ${item}</div>`
    ).join('');

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
            ${onCompareLodges ? '<button class="lfhte-btn-outline lfhte-compare-lodges-detail" id="lfhte-compare-lodges-detail">Compare Lodges</button>' : ''}
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
        heroMedia.querySelector('#lfhte-play-video')?.addEventListener('click', (e) => {
          heroMedia.innerHTML = `
            <div class="lfhte-video-embed">
              <iframe src="https://player.vimeo.com/video/${e.currentTarget.dataset.vimeo}?autoplay=1&title=0&byline=0&portrait=0"
                allow="autoplay; fullscreen" allowfullscreen></iframe>
            </div>
          `;
        });
        detail.querySelectorAll('.lfhte-gallery-thumb').forEach((t) => (t.style.borderColor = 'transparent'));
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

    // ===== BOOKING BUTTON (overridden behavior) =====
    detail.querySelector('.lfhte-action-book')?.addEventListener('click', () => {
      if (bookingVariant === 'slide') {
        openSlidePanel(tour);
      } else {
        openReplaceBooking(tour);
      }
    });

    detail.querySelector('.lfhte-action-ask')?.addEventListener('click', () => {
      interactWithAgent('ext_user_action', {
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
      detail.querySelectorAll('.lfhte-lodge-name-link').forEach((link) => {
        link.addEventListener('click', (e) => {
          e.stopPropagation();
          const lodgeId = link.dataset.lodgeId;
          actionTaken = true;
          interactWithAgent('ext_user_action', {
            action: 'tour_compare_lodges',
            source: 'tour_explorer'
          });
          closeModal();
          setTimeout(() => onCompareLodges(lodgeId), 350);
        });
      });

      // Compare Lodges - detail actions text button
      detail.querySelector('#lfhte-compare-lodges-detail')?.addEventListener('click', () => {
        actionTaken = true;
        interactWithAgent('ext_user_action', {
          action: 'tour_compare_lodges',
          source: 'tour_explorer'
        });
        closeModal();
        setTimeout(() => onCompareLodges(), 350);
      });
    }
  }

  // ========================================================================
  // BOOKING: Variant A - Replace Content
  // ========================================================================

  function openReplaceBooking(tour) {
    currentView = 'booking';
    filterBar.style.display = 'none';
    silentVariableUpdate('ext_last_action', 'booking_form_opened');

    const bookingContainer = document.createElement('div');
    bookingContainer.style.cssText = 'height:100%;overflow-y:auto;';

    // Back button header
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

    // Render the form
    renderBookingForm(formContainer, {
      tour,
      webhookUrl,
      variant: 'replace',
      conversationId,
      userId,
      visitorContext,
      conversationHistory,
      intentSignals,
      onSubmitSuccess: (payload) => handleBookingSuccess(tour, payload),
      onBack: () => renderTourDetail(tour),
    });

    // Back button
    backHeader.querySelector('#lfhte-booking-back')?.addEventListener('click', () => {
      renderTourDetail(tour);
    });
  }

  // ========================================================================
  // BOOKING: Variant B - Slide-in Panel
  // ========================================================================

  function openSlidePanel(tour) {
    silentVariableUpdate('ext_last_action', 'booking_form_opened');

    const overlay = modal.querySelector('#lfhte-sp-overlay');
    const panelContent = modal.querySelector('#lfhte-sp-content');
    const backBtn = modal.querySelector('#lfhte-sp-back');

    overlay.style.display = 'block';
    // Trigger animation
    requestAnimationFrame(() => {
      overlay.classList.add('open');
    });

    renderBookingForm(panelContent, {
      tour,
      webhookUrl,
      variant: 'slide',
      conversationId,
      userId,
      visitorContext,
      conversationHistory,
      intentSignals,
      onSubmitSuccess: (payload) => handleBookingSuccess(tour, payload),
      onBack: () => closeSlidePanel(),
    });

    // Back handler
    const handleBack = () => closeSlidePanel();
    backBtn.addEventListener('click', handleBack, { once: true });

    // Backdrop click to close
    const spBackdrop = overlay.querySelector('.lfhte-sp-backdrop');
    spBackdrop.addEventListener('click', handleBack, { once: true });
  }

  function closeSlidePanel() {
    const overlay = modal.querySelector('#lfhte-sp-overlay');
    overlay.classList.remove('open');
    setTimeout(() => {
      overlay.style.display = 'none';
      const panelContent = modal.querySelector('#lfhte-sp-content');
      if (panelContent) panelContent.innerHTML = '';
    }, 300);
  }

  // ========================================================================
  // BOOKING: Post-Submit
  // ========================================================================

  function handleBookingSuccess(tour, payload) {
    // Fire interact event for VoiceFlow — no PII (email/name/phone)
    // PII is sent directly to the webhook by the booking form, not through VoiceFlow
    interactWithAgent('ext_user_action', {
      action: 'booking_request_submitted',
      source: 'tour_explorer',
      tourId: tour.id,
      tourName: tour.name,
      requestType: payload.bookingRequest.requestType,
    });

    // Suppress duplicate ext_modal_closed since action was already fired
    actionTaken = true;

    // Auto-close modal after delay
    setTimeout(() => {
      closeModal();
    }, 2500);
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

    const headerCells = tours.map((t) =>
      `<th class="lfhte-compare-th"><div class="lfhte-compare-tour-name">${t.name}</div><div class="lfhte-compare-tour-sub">${t.subtitle}</div></th>`
    ).join('');

    const rows = [
      { label: 'Duration', fn: (t) => t.duration },
      { label: 'Vertical Guarantee', fn: (t) => t.verticalGuarantee },
      { label: 'Lodges', fn: (t) => t.lodges.map(lodgeName).join(' & ') },
      { label: 'Skill Level', fn: (t) => t.skillLevel },
      { label: 'Starting Price', fn: (t) => `$${t.priceFrom.toLocaleString()} CAD` },
      { label: 'Best For', fn: (t) => t.bestFor.join(', ') },
    ];

    const rowsHTML = rows
      .map((row) =>
        `<tr><td class="lfhte-compare-label">${row.label}</td>${tours.map((t) => `<td>${row.fn(t)}</td>`).join('')}</tr>`
      ).join('');

    let compareBody;
    if (isMobile) {
      const cardsHTML = rows.map((row) => {
        const valuesHTML = tours.map((t) =>
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
    const thumbs = compareTours.map((id) => {
      const t = LFH_TOURS.find((tour) => tour.id === id);
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

    silentVariableUpdate('ext_filters_applied', JSON.stringify(activeFilters));
    modal.querySelector('#lfhte-results-count').textContent =
      `${filteredTours.length} tour${filteredTours.length !== 1 ? 's' : ''}`;
    renderTourGrid();
  }

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
    if (!actionTaken) {
      interactWithAgent('ext_modal_closed', {
        modal: 'tour_explorer',
        lastViewed: currentTourId,
        toursCompared: compareTours,
      });
    }

    abortController.abort();
    backdrop.style.animation = 'lfhte-fadeOut 0.3s ease forwards';
    setTimeout(() => backdrop.remove(), 300);
  }

  headerBar.querySelector('.lfhte-close-btn')?.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.contains(backdrop)) {
      // Close slide panel first if open
      const overlay = document.querySelector('#lfhte-sp-overlay.open');
      if (overlay) {
        closeSlidePanel();
      } else {
        closeModal();
      }
    }
  }, { signal: abortController.signal });
}

// ============================================================================
// STYLES (same as original modal)
// ============================================================================

function buildModalStyles() {
  return `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

@font-face {
  font-family: 'Nexa Rust Sans Black 2';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: 900; font-style: normal; font-display: swap;
}

@keyframes lfhte-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes lfhte-fadeOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes lfhte-slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.lfhte-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; background: ${LFH_COLORS.textPrimary}; flex-shrink: 0;
}
.lfhte-header-title {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 20px; font-weight: 900; color: #fff;
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
.lfhte-compare-lodges-link {
  padding: 6px 14px; background: ${LFH_COLORS.infoBox};
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 20px;
  font-family: 'Inter', sans-serif; font-size: 11px;
  font-weight: 600; color: ${LFH_COLORS.textSecondary};
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.lfhte-compare-lodges-link:hover {
  border-color: ${LFH_COLORS.primaryRed}; color: ${LFH_COLORS.primaryRed};
}
.lfhte-conditions-link {
  padding: 6px 14px; background: ${LFH_COLORS.infoBox};
  border: 1.5px solid ${LFH_COLORS.border}; border-radius: 20px;
  font-family: 'Inter', sans-serif; font-size: 11px;
  font-weight: 600; color: ${LFH_COLORS.textSecondary};
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.lfhte-conditions-link:hover {
  border-color: ${LFH_COLORS.primaryRed}; color: ${LFH_COLORS.primaryRed};
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
@media (max-width: 700px) { .lfhte-tour-grid { grid-template-columns: 1fr; } }

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
.lfhte-btn-text {
  background: transparent; border: none;
  color: ${LFH_COLORS.textSecondary}; font-family: 'Inter', sans-serif;
  font-size: 12px; cursor: pointer; padding: 8px; transition: color 0.2s;
}
.lfhte-btn-text:hover { color: ${LFH_COLORS.primaryRed}; }

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

// ============================================================================
// SLIDE PANEL STYLES
// ============================================================================

function buildSlidePanelStyles() {
  return `
/* Slide Panel Overlay */
.lfhte-sp-overlay {
  position: absolute; inset: 0; z-index: 100;
  display: flex; pointer-events: none;
}
.lfhte-sp-overlay.open { pointer-events: auto; }

.lfhte-sp-backdrop {
  flex: 1; background: rgba(0,0,0,0);
  transition: background 0.3s ease;
}
.lfhte-sp-overlay.open .lfhte-sp-backdrop {
  background: rgba(0,0,0,0.3);
}

.lfhte-sp-panel {
  width: 70%; max-width: 480px; height: 100%;
  background: ${LFH_COLORS.background};
  box-shadow: -4px 0 20px rgba(0,0,0,0.15);
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.lfhte-sp-overlay.open .lfhte-sp-panel {
  transform: translateX(0);
}

.lfhte-sp-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; background: ${LFH_COLORS.textPrimary};
  flex-shrink: 0;
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

.lfhte-sp-content {
  flex: 1; overflow-y: auto;
}
.lfhte-sp-content::-webkit-scrollbar { width: 5px; }
.lfhte-sp-content::-webkit-scrollbar-thumb {
  background: ${LFH_COLORS.border}; border-radius: 3px;
}

@media (max-width: 600px) {
  .lfhte-sp-panel { width: 100%; max-width: 100%; }
}
`;
}

// ============================================================================
// MOBILE COMPARE STYLES (stacked cards instead of table)
// ============================================================================

function buildMobileCompareStyles() {
  return `
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
`;
}
