/**
 * Last Frontier Welcome Carousel Extension — Unified Event Architecture
 *
 * Displays a horizontal scrollable carousel of 4 visual cards on chat open,
 * introducing the agent's capabilities with branded imagery.
 *
 * Uses ext_navigate event pattern instead of type: 'intent'.
 *
 * Trace type: ext_welcomeCarousel
 * Payload: (none required)
 *
 * @version 2.0.0 (Unified Event Architecture)
 */

export const LastFrontierWelcomeCarouselUnified = {
  name: 'LastFrontierWelcomeCarouselUnified',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_welcomeCarousel_unified' ||
    trace.payload?.name === 'ext_welcomeCarousel_unified',

  render: ({ trace, element }) => {
    const cards = [
      {
        id: 'lodges',
        title: 'Explore Our Lodges',
        subtitle: 'Two world-class lodges in Northern BC',
        cta: 'Show me',
        image: 'https://lastfrontierheli.com/wp-content/uploads/bell2-lodge-hero.jpg',
        fallbackGradient: 'linear-gradient(135deg, #1a3a4a 0%, #2d5a6a 40%, #4a8a9a 100%)',
        action: 'show_lodges'
      },
      {
        id: 'tours',
        title: 'Tours & Pricing',
        subtitle: '4 to 7-day packages from $11,760 CAD',
        cta: 'See options',
        image: 'https://lastfrontierheli.com/wp-content/uploads/helicopter-powder.jpg',
        fallbackGradient: 'linear-gradient(135deg, #2a1a3a 0%, #4a3a5a 40%, #6a5a7a 100%)',
        action: 'show_tours'
      },
      {
        id: 'videos',
        title: 'Watch Our Story',
        subtitle: '6 short films about the experience',
        cta: 'Play videos',
        image: 'https://lastfrontierheli.com/wp-content/uploads/terrain-hero.jpg',
        fallbackGradient: 'linear-gradient(135deg, #1a2a1a 0%, #2d4a2d 40%, #4a6a4a 100%)',
        action: 'show_self_service'
      },
      {
        id: 'plan',
        title: 'Plan Your Trip',
        subtitle: 'Gear, fitness, booking — I\'ll walk you through it',
        cta: 'Let\'s plan',
        image: 'https://lastfrontierheli.com/wp-content/uploads/preparation-hero.jpg',
        fallbackGradient: 'linear-gradient(135deg, #3a2a1a 0%, #5a4a3a 40%, #7a6a5a 100%)',
        action: 'plan_trip'
      }
    ];

    // ========================================================================
    // STYLES
    // ========================================================================

    const styles = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      .lfh-welcome {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        max-width: 100%;
        margin: 0;
        padding: 0;
      }

      .lfh-welcome * {
        box-sizing: border-box;
      }

      .lfh-welcome-scroll {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        padding: 4px 4px 12px 4px;
        scrollbar-width: none;
      }

      .lfh-welcome-scroll::-webkit-scrollbar {
        display: none;
      }

      .lfh-welcome-card {
        flex: 0 0 200px;
        scroll-snap-align: start;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        background: #fff;
      }

      .lfh-welcome-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      }

      .lfh-welcome-card:active {
        transform: translateY(0);
      }

      .lfh-welcome-card-image {
        position: relative;
        height: 120px;
        background-size: cover;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 12px;
      }

      .lfh-welcome-card-image::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%);
        pointer-events: none;
      }

      .lfh-welcome-card-title {
        position: relative;
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        margin: 0 0 2px 0;
        line-height: 1.2;
        text-shadow: 0 1px 4px rgba(0,0,0,0.4);
      }

      .lfh-welcome-card-subtitle {
        position: relative;
        font-size: 11px;
        color: #fff;
        opacity: 0.9;
        margin: 0;
        line-height: 1.3;
        text-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }

      .lfh-welcome-card-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 38px;
        background: #E62B1E;
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.2px;
        border: none;
        cursor: pointer;
        transition: background 0.2s;
      }

      .lfh-welcome-card:hover .lfh-welcome-card-cta {
        background: #c4221a;
      }

      .lfh-welcome-card-cta-arrow {
        font-size: 14px;
        transition: transform 0.2s;
      }

      .lfh-welcome-card:hover .lfh-welcome-card-cta-arrow {
        transform: translateX(2px);
      }

      .lfh-welcome-hint {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin: 4px 0 0 0;
        padding: 0;
      }

      .lfh-welcome-dots {
        display: flex;
        justify-content: center;
        gap: 6px;
        margin-top: 8px;
      }

      .lfh-welcome-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ddd;
        transition: background 0.2s;
      }

      .lfh-welcome-dot.active {
        background: #E62B1E;
      }
    `;

    // ========================================================================
    // BUILD HTML
    // ========================================================================

    const cardsHtml = cards.map(card => `
      <div class="lfh-welcome-card" data-action="${card.action}" data-card-id="${card.id}">
        <div class="lfh-welcome-card-image" style="background-image: url('${card.image}');"
             data-fallback="${card.fallbackGradient}">
          <p class="lfh-welcome-card-title">${card.title}</p>
          <p class="lfh-welcome-card-subtitle">${card.subtitle}</p>
        </div>
        <div class="lfh-welcome-card-cta">
          ${card.cta} <span class="lfh-welcome-card-cta-arrow">&rarr;</span>
        </div>
      </div>
    `).join('');

    const dotsHtml = cards.map((_, i) => `
      <div class="lfh-welcome-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></div>
    `).join('');

    const container = document.createElement('div');
    container.innerHTML = `
      <style>${styles}</style>
      <div class="lfh-welcome">
        <div class="lfh-welcome-scroll">
          ${cardsHtml}
        </div>
        <div class="lfh-welcome-dots">
          ${dotsHtml}
        </div>
        <p class="lfh-welcome-hint">Or just type your question below</p>
      </div>
    `;

    // ========================================================================
    // IMAGE FALLBACKS
    // ========================================================================

    container.querySelectorAll('.lfh-welcome-card-image').forEach(imageEl => {
      const img = new Image();
      const fallback = imageEl.dataset.fallback;
      img.onerror = () => {
        imageEl.style.backgroundImage = fallback;
      };
      img.src = imageEl.style.backgroundImage.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');
    });

    // ========================================================================
    // SCROLL DOTS
    // ========================================================================

    const scrollContainer = container.querySelector('.lfh-welcome-scroll');
    const dots = container.querySelectorAll('.lfh-welcome-dot');

    if (scrollContainer && dots.length) {
      scrollContainer.addEventListener('scroll', () => {
        const scrollLeft = scrollContainer.scrollLeft;
        const cardWidth = 212; // 200px card + 12px gap
        const activeIndex = Math.round(scrollLeft / cardWidth);

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIndex);
        });
      });
    }

    // ========================================================================
    // CARD CLICK HANDLERS — Unified Event Architecture
    // ========================================================================

    container.querySelectorAll('.lfh-welcome-card').forEach(card => {
      card.addEventListener('click', () => {
        const actionKey = card.dataset.action;
        const cardTitle = card.querySelector('.lfh-welcome-card-title')?.textContent || '';

        window.voiceflow?.chat?.interact({
          type: 'event',
          payload: {
            event: { name: 'ext_navigate' },
            data: {
              action: actionKey,
              label: cardTitle,
              source: 'welcome_carousel'
            }
          }
        });
      });
    });

    element.appendChild(container);
  }
};

export default LastFrontierWelcomeCarouselUnified;
