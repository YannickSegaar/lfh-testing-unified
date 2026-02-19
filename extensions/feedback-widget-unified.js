/**
 * Last Frontier Feedback Widget — Unified Event Variant (Variant A)
 *
 * Same UI as feedback-widget.js but uses the unified event contract
 * (ext_complete event with structured data) instead of the VoiceFlow
 * `complete` trace type. Created for POC comparison testing.
 *
 * Compare with feedback-widget.js (Variant B, current pattern) to decide
 * which routing approach is cleaner on the VoiceFlow canvas.
 *
 * Trace type: ext_feedback_unified
 * Event fired: ext_complete
 *
 * @version 1.0.0
 */

export const LastFrontierFeedbackWidgetUnified = {
  name: 'LastFrontierFeedbackWidgetUnified',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_feedback_unified' ||
    trace.payload?.name === 'ext_feedback_unified',

  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const messageId = payload.messageId || Date.now().toString();
    const webhookUrl = payload.webhookUrl || '';

    // ========================================================================
    // STYLES (identical to feedback-widget.js)
    // ========================================================================

    const styles = `
      .lfh-feedback {
        font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
        padding: 8px 0;
      }

      .lfh-feedback * {
        box-sizing: border-box;
      }

      .lfh-feedback-prompt {
        font-size: 12px;
        color: #888;
        margin-bottom: 8px;
      }

      .lfh-feedback-buttons {
        display: flex;
        gap: 8px;
      }

      .lfh-feedback-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 6px 12px;
        font-size: 13px;
        font-family: inherit;
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #666;
      }

      .lfh-feedback-btn:hover {
        background: #eee;
        border-color: #ccc;
      }

      .lfh-feedback-btn.selected {
        border-width: 2px;
      }

      .lfh-feedback-btn.positive.selected {
        background: #e8f5e9;
        border-color: #4caf50;
        color: #2e7d32;
      }

      .lfh-feedback-btn.negative.selected {
        background: #ffebee;
        border-color: #f44336;
        color: #c62828;
      }

      .lfh-feedback-btn .icon {
        font-size: 14px;
      }

      .lfh-feedback-comment {
        margin-top: 12px;
        display: none;
      }

      .lfh-feedback-comment.visible {
        display: block;
        animation: lfh-fadeIn 0.2s ease;
      }

      @keyframes lfh-fadeIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .lfh-feedback-comment label {
        display: block;
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }

      .lfh-feedback-textarea {
        width: 100%;
        padding: 8px 10px;
        font-size: 13px;
        font-family: inherit;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        resize: vertical;
        min-height: 60px;
        transition: border-color 0.2s ease;
      }

      .lfh-feedback-textarea:focus {
        outline: none;
        border-color: #E62B1E;
      }

      .lfh-feedback-submit {
        margin-top: 8px;
        padding: 6px 16px;
        font-size: 12px;
        font-weight: 600;
        background: #E62B1E;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .lfh-feedback-submit:hover {
        background: #c42419;
      }

      .lfh-feedback-thanks {
        font-size: 13px;
        color: #4caf50;
        padding: 8px 0;
        display: none;
      }

      .lfh-feedback-thanks.visible {
        display: block;
        animation: lfh-fadeIn 0.2s ease;
      }
    `;

    // ========================================================================
    // BUILD COMPONENT
    // ========================================================================

    const container = document.createElement('div');
    container.innerHTML = `
      <style>${styles}</style>
      <div class="lfh-feedback" data-message-id="${messageId}">
        <div class="lfh-feedback-prompt">Was this helpful?</div>

        <div class="lfh-feedback-buttons">
          <button class="lfh-feedback-btn positive" data-value="positive">
            <span class="icon">\u{1F44D}</span>
            <span>Yes</span>
          </button>
          <button class="lfh-feedback-btn negative" data-value="negative">
            <span class="icon">\u{1F44E}</span>
            <span>No</span>
          </button>
        </div>

        <div class="lfh-feedback-comment" id="lfh-comment-section-unified">
          <label for="lfh-comment-unified">What could be improved?</label>
          <textarea class="lfh-feedback-textarea" id="lfh-comment-unified"
                    placeholder="Your feedback helps us improve..."></textarea>
          <button class="lfh-feedback-submit" id="lfh-submit-comment-unified">
            Submit Feedback
          </button>
        </div>

        <div class="lfh-feedback-thanks" id="lfh-thanks-unified">
          Thanks for your feedback!
        </div>
      </div>
    `;

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    const buttons = container.querySelectorAll('.lfh-feedback-btn');
    const commentSection = container.querySelector('#lfh-comment-section-unified');
    const commentTextarea = container.querySelector('#lfh-comment-unified');
    const submitBtn = container.querySelector('#lfh-submit-comment-unified');
    const thanksDiv = container.querySelector('#lfh-thanks-unified');

    let selectedFeedback = null;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        selectedFeedback = value;

        buttons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        if (value === 'negative') {
          commentSection.classList.add('visible');
        } else {
          submitFeedback();
        }
      });
    });

    submitBtn.addEventListener('click', () => {
      submitFeedback(commentTextarea.value.trim());
    });

    async function submitFeedback(comment = '') {
      const feedbackData = {
        messageId: messageId,
        rating: selectedFeedback,
        comment: comment,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
        sessionId: window.voiceflow?.chat?.session?.id || null
      };

      try {
        // Send to webhook if configured
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData)
          });
        }

        // UNIFIED PATTERN: Send as ext_complete event with structured data
        window.voiceflow?.chat?.interact({
          type: 'event',
          payload: {
            event: { name: 'ext_complete' },
            data: {
              action: selectedFeedback === 'positive' ? 'feedback_positive' : 'feedback_negative',
              source: 'feedback_widget',
              label: selectedFeedback === 'positive' ? 'Thumbs Up' : 'Thumbs Down',
              feedback: feedbackData,
            },
          },
        });

      } catch (error) {
        console.error('Feedback submission error:', error);
      }

      // Hide buttons and show thanks
      container.querySelector('.lfh-feedback-buttons').style.display = 'none';
      container.querySelector('.lfh-feedback-prompt').style.display = 'none';
      commentSection.classList.remove('visible');
      thanksDiv.classList.add('visible');
    }

    element.appendChild(container);
  }
};

export default LastFrontierFeedbackWidgetUnified;
