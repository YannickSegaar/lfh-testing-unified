/**
 * LFH Feedback Extension v10
 *
 * Key architectural change from v9:
 * - ZERO interact() calls to VoiceFlow. Feedback data goes to webhook only.
 * - Requires Custom Action "Stop on action" = OFF in VoiceFlow canvas.
 * - Canvas continues past the Custom Action to Listen immediately.
 * - User's typed messages always reach Listen directly — never consumed or lost.
 * - Eliminates the feedback loop caused by phantom 'complete' interactions.
 *
 * Flow:
 *   AI responds → ext_feedback10 Custom Action (Stop on action: OFF) →
 *   canvas continues to Listen → extension renders in browser →
 *   user interacts with feedback (or ignores it) → webhook receives data →
 *   user types next message → Listen processes it normally
 */

const SVG_Thumb = `
<svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <path fill-rule="evenodd" clip-rule="evenodd"
    d="M5.29398 20.4966C4.56534 20.4966 4 19.8827 4 19.1539V12.3847C4 11.6559 4.56534 11.042 5.29398 11.042H8.12364L10.8534 4.92738C10.9558 4.69809 11.1677 4.54023 11.4114 4.50434L11.5175 4.49658C12.3273 4.49658 13.0978 4.85402 13.6571 5.48039C14.2015 6.09009 14.5034 6.90649 14.5034 7.7535L14.5027 8.92295L18.1434 8.92346C18.6445 8.92346 19.1173 9.13931 19.4618 9.51188L19.5612 9.62829C19.8955 10.0523 20.0479 10.6054 19.9868 11.1531L19.1398 18.742C19.0297 19.7286 18.2529 20.4966 17.2964 20.4966H8.69422H5.29398ZM11.9545 6.02658L9.41727 11.7111L9.42149 11.7693L9.42091 19.042H17.2964C17.4587 19.042 17.6222 18.8982 17.6784 18.6701L17.6942 18.5807L18.5412 10.9918C18.5604 10.8194 18.5134 10.6486 18.4189 10.5287C18.3398 10.4284 18.2401 10.378 18.1434 10.378H13.7761C13.3745 10.378 13.0488 10.0524 13.0488 9.65073V7.7535C13.0488 7.2587 12.8749 6.78825 12.5721 6.44915C12.4281 6.28794 12.2615 6.16343 12.0824 6.07923L11.9545 6.02658ZM7.96636 12.4966H5.45455V19.042H7.96636V12.4966Z"
    fill="currentColor"/>
</svg>`;

export const FeedbackExtension10 = {
  name: 'Feedback',
  type: 'response',
  // TODO: revert to ext_feedback10 only after canvas is updated
  match: ({ trace }) => trace.type === 'ext_feedback10' || trace.payload?.name === 'ext_feedback10' || trace.type === 'ext_feedback9' || trace.payload?.name === 'ext_feedback9',
  render: ({ trace, element }) => {
    removePreviousFeedbackElements();

    // Cooldown: if feedback rendered within 3 seconds, suppress silently.
    // With "Stop on action" OFF, the canvas is already at Listen —
    // no interact() needed, user just types their next message.
    const now = Date.now();
    const lastShown = window.__lfhFeedbackLastShown || 0;
    if (now - lastShown < 3000) {
      return;
    }
    window.__lfhFeedbackLastShown = now;

    // trace.payload may be a JSON string (from VoiceFlow TEXT mode Custom Action)
    // or an already-parsed object. Handle both.
    let parsedPayload = trace.payload || {};
    if (typeof parsedPayload === 'string') {
      try {
        parsedPayload = JSON.parse(parsedPayload);
      } catch (e) {
        console.error('Failed to parse feedback payload:', e);
        parsedPayload = {};
      }
    }

    const {
      transcriptID = 'unknown',
      sessionID = 'unknown',
      userID = 'unknown',
      conversationSummary = null,
      conversationHistory = null,
      lastUserMessage = '',
      lastAIResponse = '',
      webhookURL = 'https://n8n.romaix-n8n.xyz/webhook/1c1e9915-a050-4798-b5e2-fbc10ada63ad',
      autoSubmitDelay = 20,
      inactivityDelay = 15,
    } = parsedPayload;

    const feedbackContainer = document.createElement('div');

    feedbackContainer.innerHTML = `
      <style>
        /* Unique namespace so Voiceflow's .vfrc-* styles can't inject icons */
        .romaix-feedback { display: flex; flex-direction: column; gap: 10px; }
        .romaix-feedback__header { display: flex; align-items: center; justify-content: space-between; }
        .romaix-feedback__description { font-size: 0.8em; color: grey; pointer-events: none; font-family: 'Open Sans', sans-serif !important; }
        .romaix-feedback__buttons { display: flex; gap: 8px; align-items: center; }

        .romaix-feedback__button {
          margin: 0;
          padding: 0;
          border: none;
          background: none;
          opacity: 0.2;
          cursor: pointer;
          transition: opacity 0.2s;
          line-height: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .romaix-feedback__button:hover { opacity: 0.5; }
        .romaix-feedback__button.is-selected { opacity: 0.6; }
        .romaix-feedback__button.is-disabled { pointer-events: none; }

        /* Kill any extra pseudo-icons that might get injected */
        .romaix-feedback__button::before,
        .romaix-feedback__button::after {
          content: none !important;
          display: none !important;
        }

        .romaix-feedback__button svg { display: block; }
        .romaix-feedback__button--up svg { margin-left: 6px; }
        .romaix-feedback__button--down svg { margin-left: 4px; transform: rotate(180deg); }

        .romaix-feedback__skip-btn {
          padding: 4px 8px;
          background: transparent;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.75em;
          color: #666;
          cursor: pointer;
          font-family: 'Open Sans', sans-serif !important;
          margin-left: 8px;
          transition: background 0.2s;
        }
        .romaix-feedback__skip-btn:hover { background: #f5f5f5; }

        .romaix-feedback__comment-section { display: none; flex-direction: column; gap: 8px; margin-top: 8px; }
        .romaix-feedback__comment-section.is-visible { display: flex; }

        .romaix-feedback__comment-label { font-size: 0.75em; color: #666; font-family: 'Open Sans', sans-serif !important; }

        .romaix-feedback__comment-input {
          width: 100%;
          min-height: 60px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.85em;
          font-family: 'Open Sans', sans-serif !important;
          resize: vertical;
        }
        .romaix-feedback__comment-input:focus { outline: none; border-color: #CC3333; }

        .romaix-feedback__status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          min-height: 20px;
        }

        .romaix-feedback__status-message {
          font-size: 0.7em;
          color: #999;
          font-family: 'Open Sans', sans-serif !important;
        }

        /* Subtle pulsing dots animation */
        .romaix-feedback__dots {
          display: inline-flex;
          gap: 4px;
          align-items: center;
        }

        .romaix-feedback__dot {
          width: 4px;
          height: 4px;
          background: #CC3333;
          border-radius: 50%;
          opacity: 0.3;
          animation: romaix-pulse 1.4s ease-in-out infinite;
        }

        .romaix-feedback__dot:nth-child(1) { animation-delay: 0s; }
        .romaix-feedback__dot:nth-child(2) { animation-delay: 0.2s; }
        .romaix-feedback__dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes romaix-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .romaix-feedback__comment-actions { display: flex; gap: 8px; justify-content: flex-end; }

        .romaix-feedback__comment-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 0.8em;
          cursor: pointer;
          font-family: 'Open Sans', sans-serif !important;
          transition: background 0.2s;
        }
        .romaix-feedback__comment-btn--submit { background: #CC3333; color: white; }
        .romaix-feedback__comment-btn--submit:hover { background: #B32929; }

        /* Thank you message */
        .romaix-feedback__thanks {
          font-size: 0.8em;
          color: grey;
          font-family: 'Open Sans', sans-serif !important;
          padding: 2px 0;
          animation: romaix-fadeIn 0.3s ease;
        }

        @keyframes romaix-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes romaix-fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .romaix-feedback--fading {
          animation: romaix-fadeOut 0.4s ease forwards;
        }
      </style>

      <div class="romaix-feedback">
        <div class="romaix-feedback__header">
          <div class="romaix-feedback__description">Was this answer helpful?</div>
          <div class="romaix-feedback__buttons">
            <button class="romaix-feedback__button romaix-feedback__button--up" data-feedback="1" type="button" aria-label="Thumbs up">
              ${SVG_Thumb}
            </button>
            <button class="romaix-feedback__button romaix-feedback__button--down" data-feedback="0" type="button" aria-label="Thumbs down">
              ${SVG_Thumb}
            </button>
            <button class="romaix-feedback__skip-btn" type="button">Continue</button>
          </div>
        </div>

        <div class="romaix-feedback__comment-section">
          <div class="romaix-feedback__comment-label">Want to add a comment? (optional)</div>
          <textarea class="romaix-feedback__comment-input" placeholder="Tell us more about your experience..." maxlength="500"></textarea>
          <div class="romaix-feedback__status-bar">
            <div class="romaix-feedback__status-message"></div>
          </div>
          <div class="romaix-feedback__comment-actions">
            <button class="romaix-feedback__comment-btn romaix-feedback__comment-btn--submit" type="button">Submit Now</button>
          </div>
        </div>
      </div>
    `;

    let selectedFeedback = null;
    let feedbackSubmitted = false;
    let submitTimer = null;
    let inactivityTimer = null;
    let dismissTimer = null;
    let userHasTyped = false;

    const commentSection = feedbackContainer.querySelector('.romaix-feedback__comment-section');
    const commentInput = feedbackContainer.querySelector('.romaix-feedback__comment-input');
    const submitBtn = feedbackContainer.querySelector('.romaix-feedback__comment-btn--submit');
    const skipMainBtn = feedbackContainer.querySelector('.romaix-feedback__skip-btn');
    const statusMessage = feedbackContainer.querySelector('.romaix-feedback__status-message');

    async function sendToWebhook(feedbackData) {
      const payload = {
        transcriptID,
        sessionID,
        conversationHistory,
        conversationSummary,
        userID,
        date: new Date().toISOString(),
        lastUserMessage,
        lastAIResponse,
        feedback:
          feedbackData.feedback === '1' ? 'Thumbs Up'
          : (feedbackData.feedback === '0' ? 'Thumbs Down' : null),
        comment: feedbackData.comment || '',
        skipped: feedbackData.skipped,
        autoSubmitted: feedbackData.autoSubmitted || false,
        source: 'Voiceflow Feedback Extension v10',
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await fetch(webhookURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) console.error('Feedback webhook error:', response.status);
      } catch (error) {
        console.error('Error sending feedback to webhook:', error);
      }
    }

    // v10: completeFeedback does NOT call interact().
    // Feedback data goes to webhook only. The canvas is already at Listen
    // (Stop on action: OFF), so the user just types their next message.
    function completeFeedback(payload) {
      if (feedbackSubmitted) return;
      feedbackSubmitted = true;

      if (submitTimer) clearTimeout(submitTimer);
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (dismissTimer) clearTimeout(dismissTimer);

      // Send to webhook (skip if user gave no feedback at all)
      if (!payload.skipped || payload.feedback !== null) {
        sendToWebhook(payload);
      }

      const romaixFeedback = feedbackContainer.querySelector('.romaix-feedback');

      // Only show thank-you if the user actually gave feedback
      if (payload.skipped && payload.feedback === null) {
        // No feedback given — fade out silently
        romaixFeedback.classList.add('romaix-feedback--fading');
        romaixFeedback.addEventListener('animationend', () => {
          romaixFeedback.remove();
        });
      } else {
        // User clicked thumbs up/down — show thank you
        romaixFeedback.innerHTML = `
          <div class="romaix-feedback__thanks">Thank you for your feedback!</div>
        `;
      }
    }

    function showDotsAnimation() {
      statusMessage.innerHTML = `
        <div class="romaix-feedback__dots">
          <span class="romaix-feedback__dot"></span>
          <span class="romaix-feedback__dot"></span>
          <span class="romaix-feedback__dot"></span>
        </div>
      `;
    }

    function startAutoSubmitTimer(seconds) {
      showDotsAnimation();

      submitTimer = setTimeout(() => {
        const comment = commentInput.value.trim();
        completeFeedback({
          feedback: selectedFeedback,
          comment,
          skipped: false,
          autoSubmitted: true,
        });
      }, seconds * 1000);
    }

    function resetInactivityTimer() {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      inactivityTimer = setTimeout(() => {
        const comment = commentInput.value.trim();
        completeFeedback({
          feedback: selectedFeedback,
          comment,
          skipped: false,
          autoSubmitted: true,
        });
      }, inactivityDelay * 1000);
    }

    commentInput.addEventListener('input', () => {
      if (!userHasTyped && commentInput.value.trim().length > 0) {
        userHasTyped = true;

        if (submitTimer) {
          clearTimeout(submitTimer);
          submitTimer = null;
        }

        statusMessage.innerHTML = 'When you\'re done, just hit Submit';
      }

      if (userHasTyped) {
        resetInactivityTimer();
      }
    });

    commentInput.addEventListener('focus', () => {
      if (userHasTyped) {
        resetInactivityTimer();
      }
    });

    skipMainBtn.addEventListener('click', () => {
      completeFeedback({ feedback: null, comment: null, skipped: true });
    });

    feedbackContainer.querySelectorAll('.romaix-feedback__button').forEach((button) => {
      button.addEventListener('click', function () {
        // User engaged — cancel the dismiss timer, auto-submit takes over
        if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null; }
        selectedFeedback = this.getAttribute('data-feedback');

        feedbackContainer.querySelectorAll('.romaix-feedback__button').forEach((btn) => {
          btn.classList.add('is-disabled');
          if (btn === this) btn.classList.add('is-selected');
        });

        skipMainBtn.style.display = 'none';

        commentSection.classList.add('is-visible');
        commentInput.focus();

        startAutoSubmitTimer(autoSubmitDelay);
      });
    });

    submitBtn.addEventListener('click', () => {
      const comment = commentInput.value.trim();
      completeFeedback({
        feedback: selectedFeedback,
        comment,
        skipped: false,
        autoSubmitted: false,
      });
    });

    // No messageListener needed. With "Stop on action" OFF, the user's text
    // goes directly to Listen — no phantom interactions possible.
    // Cleanup of stale widgets is handled by removePreviousFeedbackElements()
    // at the start of each new render cycle, and by the auto-dismiss timer.

    // Auto-dismiss: if no interaction at all, fade out silently after autoSubmitDelay
    dismissTimer = setTimeout(() => {
      if (!feedbackSubmitted && selectedFeedback === null) {
        completeFeedback({ feedback: null, comment: null, skipped: true });
      }
    }, autoSubmitDelay * 1000);

    element.appendChild(feedbackContainer);
  },
};

function removePreviousFeedbackElements() {
  try {
    const voiceflowChat = document.querySelector('#voiceflow-chat');
    if (!voiceflowChat || !voiceflowChat.shadowRoot) return;

    const chatDialog = voiceflowChat.shadowRoot.querySelector('.vfrc-chat--dialog');
    if (!chatDialog) return;

    const feedbackWidgets = chatDialog.querySelectorAll('.romaix-feedback');

    feedbackWidgets.forEach((widget) => {
      const systemResponse = widget.closest('.vfrc-system-response');
      if (systemResponse) systemResponse.remove();
      else widget.remove();
    });
  } catch (error) {
    console.error('Error removing previous feedback elements:', error);
  }
}

export default FeedbackExtension10;
