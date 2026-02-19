/**
 * Last Frontier Tour Explorer - Grid with Booking (Unified Event Architecture)
 *
 * In-chat widget displaying a 2x3 card grid of tour packages.
 * Identical to the original grid extension except card clicks
 * open the enhanced modal with in-modal booking form.
 *
 * Triggers on VoiceFlow trace: ext_tourExplorer_booking or ext_tourExplorer_grid_booking
 *
 * Uses the Unified Event Architecture via the unified modal module.
 *
 * @version 2.0.0-unified
 * @author Last Frontier Heliskiing / RomAIx
 */

import { LFH_TOURS, LFH_COLORS, LFH_ASSETS } from '../lfh-tour-explorer-modal.js';
import { openTourExplorerModalWithBookingUnified } from './lfh-tour-explorer-modal-booking-unified.js';
import { openLodgeCompareModal } from './lfh-lodge-compare-modal-v2-unified.js';
import { openWeatherConditionsModal } from './lfh-weather-conditions-modal-unified.js';

export const LFHTourExplorerGridBookingUnified = {
  name: 'LFHTourExplorerGridBookingUnified',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_tourExplorer_booking_unified' ||
    trace.type === 'ext_tourExplorer_grid_booking_unified' ||
    trace.payload?.name === 'ext_tourExplorer_booking_unified' ||
    trace.payload?.name === 'ext_tourExplorer_grid_booking',

  render: ({ trace, element }) => {
    const {
      formTitle = 'OUR HELISKIING TOURS',
      formSubtitle = 'Explore packages from two unique lodges in Northern BC',
      animateIn = true,
      bookingVariant = 'replace',
      webhookUrl = '',
    } = trace.payload || {};

    element.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'lfhte-grid-widget';

    if (animateIn) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(10px)';
      container.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    function lodgeBadgeText(lodges) {
      if (lodges.includes('both')) return 'Both Lodges';
      const names = lodges.map((l) => (l === 'bell2' ? 'Bell 2' : l === 'ripley' ? 'Ripley Creek' : l));
      return names.join(' & ');
    }

    function lodgeBadgeColor(lodges) {
      if (lodges.includes('both')) return '#8B6914';
      return LFH_COLORS.primaryRed;
    }

    const tourCardsHTML = LFH_TOURS.map(
      (tour) => `
      <div class="lfhte-gw-card" data-tour-id="${tour.id}">
        <div class="lfhte-gw-card-bg" style="background-image: url('${tour.heroImage}')">
          <div class="lfhte-gw-card-mask"></div>
          <div class="lfhte-gw-card-overlay">
            <span class="lfhte-gw-badge" style="background:${lodgeBadgeColor(tour.lodges)}">${lodgeBadgeText(tour.lodges)}</span>
            <p class="lfhte-gw-card-name">${tour.name}</p>
            <p class="lfhte-gw-card-price">From $${tour.priceFrom.toLocaleString()} CAD</p>
          </div>
        </div>
      </div>
    `
    ).join('');

    container.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

@font-face {
  font-family: 'Nexa Rust Sans Black 2';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: 900; font-style: normal; font-display: swap;
}

.lfhte-grid-widget {
  width: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: ${LFH_COLORS.background}; border-radius: 8px; overflow: hidden;
  box-sizing: border-box;
}
.lfhte-grid-widget * { box-sizing: border-box; }

.lfhte-gw-header {
  position: relative; background-image: url('${LFH_ASSETS.bgImage}');
  background-size: cover; background-position: center;
  text-align: center; overflow: hidden; padding: 24px 20px 28px;
}
.lfhte-gw-header::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.4));
  pointer-events: none; z-index: 1;
}
.lfhte-gw-title {
  position: relative; z-index: 2;
  font-family: 'Nexa Rust Sans Black 2', 'Inter', sans-serif;
  font-size: 20px; font-weight: 900; color: #fff;
  text-transform: uppercase; letter-spacing: 3px;
  margin: 0 0 8px; text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}
.lfhte-gw-subtitle {
  position: relative; z-index: 2;
  font-family: 'Inter', sans-serif; font-size: 12px;
  color: #fff; line-height: 1.5; margin: 0; opacity: 0.95;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}

.lfhte-gw-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 8px; padding: 12px; max-height: 420px; overflow-y: auto;
}
.lfhte-gw-grid::-webkit-scrollbar { width: 4px; }
.lfhte-gw-grid::-webkit-scrollbar-track { background: ${LFH_COLORS.infoBox}; }
.lfhte-gw-grid::-webkit-scrollbar-thumb { background: ${LFH_COLORS.border}; border-radius: 2px; }

.lfhte-gw-card {
  border-radius: 10px; overflow: hidden; cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid transparent;
}
.lfhte-gw-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: ${LFH_COLORS.primaryRed};
}
.lfhte-gw-card-bg {
  position: relative; width: 100%; aspect-ratio: 4/3;
  background-size: cover; background-position: center;
}
.lfhte-gw-card-mask {
  position: absolute; inset: 0;
  background-image: url('${LFH_ASSETS.videoMask}');
  background-size: cover; background-position: center;
  z-index: 1; pointer-events: none;
}
.lfhte-gw-card-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.85));
  padding: 28px 10px 10px; color: #fff; z-index: 2;
}
.lfhte-gw-badge {
  display: inline-block; padding: 2px 8px; border-radius: 10px;
  font-size: 8px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.3px; margin-bottom: 4px;
}
.lfhte-gw-card-name {
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.3px; margin: 0 0 2px;
}
.lfhte-gw-card-price {
  font-size: 10px; font-weight: 500; opacity: 0.9; margin: 0;
}

.lfhte-gw-footer {
  padding: 12px 16px; text-align: center;
  border-top: 1px solid ${LFH_COLORS.border};
}
.lfhte-gw-cta {
  display: block; width: 100%; padding: 12px 20px;
  background: ${LFH_COLORS.primaryRed}; color: #fff;
  border: none; border-radius: 6px;
  font-family: 'Inter', sans-serif; font-size: 13px;
  font-weight: 600; cursor: pointer; transition: all 0.2s;
  margin-bottom: 8px;
}
.lfhte-gw-cta:hover { background: #c4221a; transform: translateY(-1px); }
.lfhte-gw-footer-text {
  font-family: 'Inter', sans-serif; font-size: 12px;
  color: ${LFH_COLORS.textSecondary}; margin: 0;
}
.lfhte-gw-footer-text strong { color: ${LFH_COLORS.textPrimary}; font-weight: 700; }

@media (max-width: 500px) {
  .lfhte-gw-grid { grid-template-columns: 1fr; max-height: 500px; }
}
</style>

<div class="lfhte-gw-header">
  <p class="lfhte-gw-title">${formTitle}</p>
  <p class="lfhte-gw-subtitle">${formSubtitle}</p>
</div>

<div class="lfhte-gw-grid">${tourCardsHTML}</div>

<div class="lfhte-gw-footer">
  <button class="lfhte-gw-cta" id="lfhte-gw-explore-btn">Explore All Tours</button>
  <p class="lfhte-gw-footer-text">Still have questions? <strong>Just ask!</strong></p>
</div>
`;

    element.appendChild(container);

    if (animateIn) {
      setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 50);
    }

    const modalConfig = {
      bookingVariant,
      webhookUrl,
      onCompareLodges: (focusLodge) => openLodgeCompareModal(focusLodge || null),
      onCheckConditions: () => openWeatherConditionsModal(),
    };

    // Card click -> open modal with booking, focused on tour
    container.querySelectorAll('.lfhte-gw-card').forEach((card) => {
      card.addEventListener('click', () => {
        openTourExplorerModalWithBookingUnified(card.dataset.tourId, modalConfig);
      });
    });

    // CTA -> open modal with booking (no focus)
    container.querySelector('#lfhte-gw-explore-btn')?.addEventListener('click', () => {
      openTourExplorerModalWithBookingUnified(null, modalConfig);
    });

    return function cleanup() {};
  },
};

export default LFHTourExplorerGridBookingUnified;
