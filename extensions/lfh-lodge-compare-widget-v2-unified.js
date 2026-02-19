/**
 * Last Frontier Lodge Compare - In-Chat Widget v2
 *
 * VoiceFlow extension displaying side-by-side lodge preview cards
 * with branded header (dark wood bg, Nexa Rust font, NO logo).
 * Redesigned with 16:9 aspect ratio images, clean card layout,
 * and polish matching Tour Explorer quality.
 *
 * v2: Enhanced Terrain tab with run photos, aerial context, lightbox
 *
 * Unified Event Architecture: All interact calls use { type: 'event', payload: { event, data } }
 *
 * Triggers on VoiceFlow trace: ext_lodgeCompare_v2
 *
 * @version 2.0.1-unified
 * @author Last Frontier Heliskiing / RomAIx
 */

import { LFH_LODGES, LFH_COLORS, LFH_ASSETS, openLodgeCompareModal } from './lfh-lodge-compare-modal-v2-unified.js';

export const LFHLodgeCompareWidgetV2Unified = {
  name: 'LFHLodgeCompareWidgetV2Unified',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_lodgeCompare_v2_unified' ||
    trace.payload?.name === 'ext_lodgeCompare_v2_unified',

  render: ({ trace, element }) => {
    const {
      formTitle = 'COMPARE OUR LODGES',
      formSubtitle = 'Two unique bases in Northern BC • Click to explore',
      initialTab = 'overview',
      animateIn = true,
    } = trace.payload || {};

    element.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'lfhlc-widget';

    if (animateIn) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(10px)';
      container.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    const bell2 = LFH_LODGES.bell2;
    const ripley = LFH_LODGES.ripley;

    container.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

@font-face {
  font-family: 'Nexa Rust Sans Black 2';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: 900; font-style: normal; font-display: swap;
}

.lfhlc-widget {
  width: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: ${LFH_COLORS.background}; border-radius: 12px; overflow: hidden;
  box-sizing: border-box; border: 1px solid ${LFH_COLORS.border};
}
.lfhlc-widget * { box-sizing: border-box; }

/* Header (dark wood background) */
.lfhlc-w-header {
  position: relative; background-image: url('${LFH_ASSETS.bgImage}');
  background-size: cover; background-position: center;
  text-align: center; overflow: hidden; padding: 20px 16px 22px;
}
.lfhlc-w-header::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.45));
  pointer-events: none; z-index: 1;
}
.lfhlc-w-title {
  position: relative; z-index: 2;
  font-family: 'Nexa Rust Sans Black 2', 'Inter', sans-serif;
  font-size: 18px; font-weight: 900; color: #fff;
  text-transform: uppercase; letter-spacing: 2.5px;
  margin: 0 0 6px; text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}
.lfhlc-w-subtitle {
  position: relative; z-index: 2;
  font-family: 'Inter', sans-serif; font-size: 12px;
  color: #fff; line-height: 1.4; margin: 0; opacity: 0.92;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}

/* Lodge Cards Grid */
.lfhlc-w-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 12px; padding: 14px;
}

/* Lodge Card */
.lfhlc-w-card {
  background: #fff; border-radius: 10px; overflow: hidden;
  cursor: pointer; transition: all 0.2s ease;
  border: 1.5px solid ${LFH_COLORS.border};
}
.lfhlc-w-card:hover {
  border-color: ${LFH_COLORS.primaryRed};
  box-shadow: 0 6px 16px rgba(230, 43, 30, 0.12);
  transform: translateY(-2px);
}

/* Card Image - 16:9 Aspect Ratio */
.lfhlc-w-card-img {
  width: 100%; aspect-ratio: 16/9;
  background-size: cover; background-position: center;
  position: relative;
}
.lfhlc-w-card-img::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(transparent 50%, rgba(0,0,0,0.5));
  pointer-events: none;
}

/* Card Body */
.lfhlc-w-card-body { padding: 12px; }

.lfhlc-w-card-name {
  font-family: 'Nexa Rust Sans Black 2', sans-serif;
  font-size: 14px; font-weight: 900; color: ${LFH_COLORS.textPrimary};
  text-transform: uppercase; letter-spacing: 0.5px;
  margin: 0 0 4px;
}
.lfhlc-w-card-tagline {
  font-size: 11px; color: ${LFH_COLORS.textSecondary};
  margin: 0 0 10px; font-style: italic;
}

/* Stats Chips */
.lfhlc-w-stats {
  display: flex; flex-wrap: wrap; gap: 6px;
}
.lfhlc-w-stat {
  padding: 4px 9px; background: ${LFH_COLORS.infoBox};
  border: 1px solid ${LFH_COLORS.border}; border-radius: 12px;
  font-size: 10px; font-weight: 500; color: ${LFH_COLORS.textPrimary};
  white-space: nowrap;
}

/* Footer */
.lfhlc-w-footer {
  padding: 12px 14px 14px; text-align: center;
  border-top: 1px solid ${LFH_COLORS.border};
  background: ${LFH_COLORS.infoBox};
}
.lfhlc-w-cta {
  display: block; width: 100%; padding: 12px 20px;
  background: ${LFH_COLORS.primaryRed}; color: #fff;
  border: none; border-radius: 8px;
  font-family: 'Inter', sans-serif; font-size: 13px;
  font-weight: 600; cursor: pointer; transition: all 0.2s;
  margin-bottom: 8px;
}
.lfhlc-w-cta:hover { background: #c4221a; transform: translateY(-1px); }
.lfhlc-w-footer-text {
  font-family: 'Inter', sans-serif; font-size: 11px;
  color: ${LFH_COLORS.textSecondary}; margin: 0;
}
.lfhlc-w-footer-text strong { color: ${LFH_COLORS.textPrimary}; font-weight: 600; }

/* Mobile breakpoint */
@media (max-width: 480px) {
  .lfhlc-w-grid { grid-template-columns: 1fr; gap: 10px; }
  .lfhlc-w-card-img { aspect-ratio: 16/9; }
  .lfhlc-w-title { font-size: 16px; letter-spacing: 2px; }
  .lfhlc-w-card-name { font-size: 13px; }
}
</style>

<!-- Header -->
<div class="lfhlc-w-header">
  <p class="lfhlc-w-title">${formTitle}</p>
  <p class="lfhlc-w-subtitle">${formSubtitle}</p>
</div>

<!-- Lodge Cards Grid -->
<div class="lfhlc-w-grid">
  <!-- Bell 2 Card -->
  <div class="lfhlc-w-card" data-lodge="bell2">
    <div class="lfhlc-w-card-img" style="background-image: url('${bell2.heroImage}')"></div>
    <div class="lfhlc-w-card-body">
      <h3 class="lfhlc-w-card-name">${bell2.name}</h3>
      <p class="lfhlc-w-card-tagline">${bell2.tagline}</p>
      <div class="lfhlc-w-stats">
        <span class="lfhlc-w-stat">${bell2.capacity} guests</span>
        <span class="lfhlc-w-stat">${bell2.style}</span>
        <span class="lfhlc-w-stat">${bell2.location}</span>
      </div>
    </div>
  </div>

  <!-- Ripley Card -->
  <div class="lfhlc-w-card" data-lodge="ripley">
    <div class="lfhlc-w-card-img" style="background-image: url('${ripley.heroImage}')"></div>
    <div class="lfhlc-w-card-body">
      <h3 class="lfhlc-w-card-name">${ripley.name}</h3>
      <p class="lfhlc-w-card-tagline">${ripley.tagline}</p>
      <div class="lfhlc-w-stats">
        <span class="lfhlc-w-stat">${ripley.capacity} guests</span>
        <span class="lfhlc-w-stat">${ripley.style}</span>
        <span class="lfhlc-w-stat">Stewart, BC</span>
      </div>
    </div>
  </div>
</div>

<!-- Footer -->
<div class="lfhlc-w-footer">
  <button class="lfhlc-w-cta" id="lfhlc-w-compare-btn">Compare Side-by-Side</button>
  <p class="lfhlc-w-footer-text">Still have questions? <strong>Just ask!</strong></p>
</div>
`;

    element.appendChild(container);

    // Animate in
    if (animateIn) {
      setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 50);
    }

    // Card click → open modal focused on that lodge
    container.querySelectorAll('.lfhlc-w-card').forEach((card) => {
      card.addEventListener('click', () => {
        openLodgeCompareModal(card.dataset.lodge, initialTab);
      });
    });

    // CTA → open modal (overview tab)
    container.querySelector('#lfhlc-w-compare-btn')?.addEventListener('click', () => {
      openLodgeCompareModal(null, 'overview');
    });

    return function cleanup() {};
  },
};

export default LFHLodgeCompareWidgetV2Unified;
