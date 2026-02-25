/**
 * Last Frontier Welcome Grid Extension V2 (Unified Event Architecture)
 *
 * Same UI as V1, but fires a single `ext_navigate` event with structured
 * payload instead of per-action event names. This is the POC for the
 * unified event routing architecture.
 *
 * V1 fires: { event: { name: 'show_lodges' } }        — action AS the event name
 * V2 fires: { event: { name: 'ext_navigate' }, data: { action: 'show_lodges', ... } }
 *
 * Trace type: ext_welcomeGrid_v2
 * Event fired: ext_navigate (always)
 *
 * @version 2.0.0
 */

export const LastFrontierWelcomeGridV2 = {
  name: 'LastFrontierWelcomeGridV2',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_welcomeGrid_v2' ||
    trace.payload?.name === 'ext_welcomeGrid_v2',

  render: ({ trace, element }) => {
    const videoMask =
      'https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/videos-img-mask.png';

    const cards = [
      {
        id: 'lodges',
        title: 'Explore Our Lodges',
        subtitle: 'Two world-class lodges',
        image:
          'https://www.lastfrontierheli.com/wp-content/uploads/2018/09/01-bell-2-lodge-heliski-village.jpg',
        fallbackGradient:
          'linear-gradient(135deg, #1a3a4a 0%, #2d5a6a 40%, #4a8a9a 100%)',
        action: 'show_lodges',
        ai_input: null,  // Direct route — exit condition handles this
        cta: 'Show me',
      },
      {
        id: 'videos',
        title: 'Watch Our Story',
        subtitle: '6 short films about the experience',
        image:
          'https://www.lastfrontierheli.com/wp-content/uploads/2018/08/01_Last_Frontier_Backgrounder_Series_Location-510x339.jpg',
        fallbackGradient:
          'linear-gradient(135deg, #1a2a1a 0%, #2d4a2d 40%, #4a6a4a 100%)',
        action: 'show_self_service',
        ai_input: null,  // Direct route — exit condition handles this
        cta: 'Watch now',
      },
      {
        id: 'tours',
        title: 'Our Heli Tours',
        subtitle: '4 to 7-day packages in Northern BC',
        image:
          'https://www.lastfrontierheli.com/wp-content/uploads/2019/11/heli-skiing-Canada-adventure.jpg',
        fallbackGradient:
          'linear-gradient(135deg, #2a1a3a 0%, #4a3a5a 40%, #6a5a7a 100%)',
        action: 'show_tours',
        ai_input: null,  // Direct route — exit condition handles this
        cta: 'See options',
      },
      {
        id: 'plan',
        title: 'Plan Your Trip',
        subtitle: "Gear, fitness, booking \u2014 I'll help",
        image:
          'https://www.lastfrontierheli.com/wp-content/uploads/2019/11/huge-alpine-terrain-heliskiing.jpg',
        fallbackGradient:
          'linear-gradient(135deg, #3a2a1a 0%, #5a4a3a 40%, #7a6a5a 100%)',
        action: 'plan_trip',
        ai_input: "I'd like help planning my heliskiing trip",
        cta: "Let's plan",
      },
    ];

    // ========================================================================
    // STYLES
    // ========================================================================

    const styles = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      .lfh-grid-welcome {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      .lfh-grid-welcome * {
        box-sizing: border-box;
      }

      .lfh-grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .lfh-grid-card {
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 2px solid transparent;
        background: #fff;
      }
      .lfh-grid-card:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-color: #E62B1E;
      }
      .lfh-grid-card:active {
        transform: scale(0.98);
      }

      .lfh-grid-card-image {
        position: relative;
        aspect-ratio: 4 / 3;
        overflow: hidden;
      }

      .lfh-grid-card-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
      }

      .lfh-grid-card-mask {
        position: absolute;
        inset: 0;
        background-image: url('${videoMask}');
        background-size: cover;
        background-position: center;
        z-index: 1;
        pointer-events: none;
      }

      .lfh-grid-card-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.85));
        padding: 28px 10px 10px;
        color: #fff;
        z-index: 2;
      }

      .lfh-grid-card-title {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin: 0 0 2px;
        line-height: 1.3;
        text-shadow: 0 1px 3px rgba(0,0,0,0.4);
      }

      .lfh-grid-card-subtitle {
        font-size: 10px;
        font-weight: 400;
        opacity: 0.9;
        margin: 0;
        line-height: 1.3;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }

      .lfh-grid-card-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        height: 32px;
        background: #E62B1E;
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.2px;
        transition: background 0.2s;
      }
      .lfh-grid-card:hover .lfh-grid-card-cta {
        background: #c4221a;
      }
      .lfh-grid-card-cta-arrow {
        font-size: 13px;
        transition: transform 0.2s;
      }
      .lfh-grid-card:hover .lfh-grid-card-cta-arrow {
        transform: translateX(2px);
      }

      .lfh-grid-footer {
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        color: #666;
        margin: 12px 0 0 0;
        padding: 0;
        letter-spacing: 0.2px;
      }
    `;

    // ========================================================================
    // BUILD HTML
    // ========================================================================

    const cardsHtml = cards
      .map(
        (card) => `
      <div class="lfh-grid-card" data-action="${card.action}" data-card-id="${card.id}">
        <div class="lfh-grid-card-image">
          <div class="lfh-grid-card-bg" style="background-image: url('${card.image}');"
               data-fallback="${card.fallbackGradient}"></div>
          <div class="lfh-grid-card-mask"></div>
          <div class="lfh-grid-card-overlay">
            <p class="lfh-grid-card-title">${card.title}</p>
            <p class="lfh-grid-card-subtitle">${card.subtitle}</p>
          </div>
        </div>
        <div class="lfh-grid-card-cta">
          ${card.cta} <span class="lfh-grid-card-cta-arrow">&rarr;</span>
        </div>
      </div>
    `
      )
      .join('');

    const container = document.createElement('div');
    container.innerHTML = `
      <style>${styles}</style>
      <div class="lfh-grid-welcome">
        <div class="lfh-grid-container">
          ${cardsHtml}
        </div>
        <p class="lfh-grid-footer">or just type your question below</p>
      </div>
    `;

    // ========================================================================
    // IMAGE FALLBACKS
    // ========================================================================

    container.querySelectorAll('.lfh-grid-card-bg').forEach((bgEl) => {
      const img = new Image();
      const fallback = bgEl.dataset.fallback;
      img.onerror = () => {
        bgEl.style.backgroundImage = fallback;
      };
      img.src = bgEl.style.backgroundImage
        .replace(/url\(['"]?/, '')
        .replace(/['"]?\)/, '');
    });

    // ========================================================================
    // CARD CLICK HANDLERS — Unified Event Architecture
    // ========================================================================

    container.querySelectorAll('.lfh-grid-card').forEach((card) => {
      card.addEventListener('click', () => {
        const action = card.dataset.action;
        const cardData = cards.find((c) => c.action === action);
        if (cardData) {
          const eventData = {
            action: cardData.action,
            source: 'welcome_grid',
            label: cardData.title,
          };
          if (cardData.ai_input) {
            eventData.ai_input = cardData.ai_input;
          }
          window.voiceflow?.chat?.interact({
            type: 'event',
            payload: {
              event: { name: 'ext_navigate' },
              data: eventData,
            },
          });
        }
      });
    });

    element.appendChild(container);

    // ========================================================================
    // FIX VOICEFLOW MESSAGE BUBBLE WIDTH
    // VoiceFlow wraps extensions in .vfrc-message (inline-block with padding),
    // which constrains our grid to ~222px. Force it to use full available width.
    // ========================================================================

    requestAnimationFrame(() => {
      let parent = element.closest
        ? element.closest('.vfrc-message')
        : null;
      // Fallback: walk up the DOM tree
      if (!parent) {
        let p = element.parentElement;
        while (p && p.tagName !== 'BODY') {
          if (p.classList?.contains('vfrc-message')) {
            parent = p;
            break;
          }
          p = p.parentElement;
        }
      }
      if (parent) {
        parent.style.display = 'block';
        parent.style.width = '100%';
        parent.style.padding = '0';
        parent.style.background = 'none';
        parent.style.boxShadow = 'none';
      }
    });
  },
};

export default LastFrontierWelcomeGridV2;
