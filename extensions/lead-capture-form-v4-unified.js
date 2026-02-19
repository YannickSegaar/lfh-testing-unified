/**
* Last Frontier Lead Capture Form Extension v5.0 — Unified Event Architecture
*
* Updates:
* - Full dark wood background header with white logo
* - Lodge icons from website (Bell 2 home icon, Ripley Creek building icon)
* - Improved lodge card layout with icon/text alignment
* - Season terrain icons from website (trees, alpine, mixed)
* - Snow icons for snowfall indicator
* - Searchable country dropdown with all countries
* - v4.4: Fixed country dropdown closing immediately on click
* - v4.4: Fixed red error border appearing incorrectly
* - v4.5: Hidden logo, replaced date pickers with tour dates dropdown, added autocomplete attributes
* - v5.0: Unified force_handoff support — detects isForceHandoff flag, disables chat input,
*          changes header tone, fires alert webhook on submit. Replaces separate DisableInput extension.
* - v5.0-unified: Migrated to Unified Event Architecture (ext_lead_captured event pattern)
* - v5.1: Disable chat input for ALL renders (not just force handoff), re-enable after submission
* - v5.2: Render-time alert webhook for force handoff (fires even if user abandons before submit)
*
* @version 5.2.0-unified
* @author Last Frontier Heliskiing / RomAIx
*/

export const LastFrontierLeadForm_v4_Unified = {
  name: 'LastFrontierLeadForm_v4_Unified',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_lastFrontierLeadForm_v4_unified' ||
    trace.payload?.name === 'ext_lastFrontierLeadForm_v4_unified',

  render: ({ trace, element }) => {
    // --- Configuration from VoiceFlow Payload ---
    const {
      formTitle = 'Plan Your Heliski Adventure',
      formSubtitle = 'Experience world-class heliskiing in British Columbia',
      webhookUrl = 'https://n8n.romaix-n8n.xyz/webhook/9d6eaed8-9595-473f-9173-9d7b184a06df',
      alertWebhookUrl = '',           // n8n force_handoff alert endpoint
      isForceHandoff = false,         // triggers disable-input + alert webhook
      conversationHistory = null,
      conversationId = null,
      userId = null,
      animateIn = true,
      // Visitor context from launch payload (browser data)
      visitorContext = {},
      // Intent signals from conversation (set by AI before form display)
      intentSignals = {
        intentLevel: 'MEDIUM',
        hasTimeline: 'unknown',
        timelineDetails: '',
        groupComposition: 'unknown',
        priorExperience: 'unknown',
        askedLogistics: false,
        askedBookingProcess: false,
        conversationSummary: '',
      },
    } = trace.payload || {};

    // Force handoff header overrides
    const displayTitle = isForceHandoff
      ? 'Get in Touch With Our Team'
      : formTitle;
    const displaySubtitle = isForceHandoff
      ? 'Our team will follow up with you within 24 hours to help resolve your inquiry.'
      : formSubtitle;

    // --- Color Palette (from MailChimp template) ---
    const colors = {
      primaryRed: '#e62b1e',
      textPrimary: '#42494e',
      textSecondary: '#666666',
      background: '#FFFFFF',
      infoBox: '#F5F5F5',
      border: '#E5E8EB',
      selectedTint: 'rgba(230, 43, 30, 0.04)',
    };

    let currentStep = 1;
    let isSubmitting = false;

    element.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'lfh-lead-form-v3';

    if (animateIn) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(10px)';
      container.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // ========================================================================
    // STYLES
    // ========================================================================
    container.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

/* Nexa Rust Sans Black 2 - hosted on GitHub Pages */
@font-face {
  font-family: 'Nexa Rust Sans Black 2';
  src: url('https://yannicksegaar.github.io/lastfrontier-voiceflow-styles/fonts/NexaRustSansBlack2.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

.lfh-lead-form-v3 {
  width: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: ${colors.background};
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
}

.lfh-lead-form-v3 * {
  box-sizing: border-box;
}

/* ===== HEADER - Full dark wood background with logo overlay ===== */
.lfh-v3-header {
  position: relative;
  background-image: url('https://yannicksegaar.github.io/RomAIx-Logo/LFH_bg_content_and_image_black.png');
  background-size: cover;
  background-position: center;
  text-align: center;
  overflow: hidden;
  padding: 24px 20px 28px 20px;
}

/* Dark overlay for better text contrast */
.lfh-v3-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* Logo sits directly on background (hidden - can restore by removing display:none) */
.lfh-v3-logo-container {
  position: relative;
  z-index: 2;
  display: none;
  margin-bottom: 16px;
}

.lfh-v3-logo {
  max-height: 50px;
  max-width: 260px;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.lfh-v3-header-label {
  position: relative;
  z-index: 2;
  font-family: 'Nexa Rust Sans Black 2', 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: #FFFFFF;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.lfh-v3-header-description {
  position: relative;
  z-index: 2;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.5;
  margin: 0;
  opacity: 0.95;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

/* ===== PROGRESS BAR ===== */
.lfh-v3-progress {
  display: flex;
  padding: 12px 16px;
  background: ${colors.infoBox};
  border-bottom: 1px solid ${colors.border};
  gap: 8px;
}

.lfh-v3-progress-step {
  flex: 1;
  text-align: center;
}

.lfh-v3-progress-bar {
  height: 4px;
  background: ${colors.border};
  border-radius: 2px;
  margin-bottom: 6px;
  overflow: hidden;
}

.lfh-v3-progress-fill {
  height: 100%;
  background: ${colors.primaryRed};
  border-radius: 2px;
  transition: width 0.3s ease;
}

.lfh-v3-progress-label {
  font-size: 9px;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.lfh-v3-progress-step.active .lfh-v3-progress-label {
  color: ${colors.primaryRed};
}

.lfh-v3-progress-optional {
  font-size: 8px;
  font-weight: 400;
  color: #94A3B8;
}

/* ===== FORM CONTENT ===== */
.lfh-v3-content {
  padding: 16px;
  max-height: 450px;
  overflow-y: auto;
}

.lfh-v3-step {
  display: none;
  animation: lfh-v3-fadeIn 0.3s ease-out;
}

.lfh-v3-step.active {
  display: block;
}

@keyframes lfh-v3-fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== FORM GROUPS ===== */
.lfh-v3-form-group {
  margin-bottom: 14px;
}

.lfh-v3-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.lfh-v3-form-row .lfh-v3-form-group {
  margin-bottom: 0;
}

.lfh-v3-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: ${colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 5px;
}

.lfh-v3-required {
  color: ${colors.primaryRed};
  margin-left: 2px;
}

.lfh-v3-input,
.lfh-v3-select,
.lfh-v3-textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  border: 1.5px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.background};
  color: ${colors.textPrimary};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.lfh-v3-input:focus,
.lfh-v3-select:focus,
.lfh-v3-textarea:focus {
  outline: none;
  border-color: ${colors.primaryRed};
  box-shadow: 0 0 0 3px rgba(230, 43, 30, 0.08);
}

.lfh-v3-input::placeholder,
.lfh-v3-textarea::placeholder {
  color: #94A3B8;
  font-size: 12px;
}

.lfh-v3-input.error {
  border-color: #EF4444;
}

.lfh-v3-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23334155' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  cursor: pointer;
}

.lfh-v3-textarea {
  min-height: 70px;
  resize: vertical;
  line-height: 1.4;
}

/* ===== INTENT CARDS ===== */
.lfh-v3-section-title {
  font-size: 12px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 10px;
}

.lfh-v3-intent-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lfh-v3-intent-card {
  background: ${colors.background};
  border: 1.5px solid ${colors.border};
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.lfh-v3-intent-card:hover {
  border-color: ${colors.primaryRed};
}

.lfh-v3-intent-card.selected {
  border-left: 3px solid ${colors.primaryRed};
  background: ${colors.selectedTint};
  border-color: ${colors.primaryRed};
}

.lfh-v3-intent-card input[type="radio"] {
  display: none;
}

.lfh-v3-intent-title {
  font-size: 13px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 2px;
}

.lfh-v3-intent-desc {
  font-size: 11px;
  color: ${colors.textSecondary};
}

/* ===== EXPERIENCE CARDS (Horizontal) ===== */
.lfh-v3-exp-cards {
  display: flex;
  gap: 8px;
}

.lfh-v3-exp-card {
  flex: 1;
  background: ${colors.infoBox};
  border: 1.5px solid ${colors.border};
  border-radius: 6px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lfh-v3-exp-card:hover {
  border-color: ${colors.primaryRed};
}

.lfh-v3-exp-card.selected {
  border-color: ${colors.primaryRed};
  border-width: 2px;
  background: ${colors.selectedTint};
}

.lfh-v3-exp-card input[type="radio"] {
  display: none;
}

.lfh-v3-exp-label {
  font-size: 12px;
  font-weight: 600;
  color: ${colors.textPrimary};
}

/* ===== YES/NO TOGGLES ===== */
.lfh-v3-toggle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 14px;
}

.lfh-v3-toggle-group {
  display: flex;
  flex-direction: column;
}

.lfh-v3-toggle-label {
  font-size: 10px;
  font-weight: 600;
  color: ${colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.lfh-v3-toggle-options {
  display: flex;
  gap: 6px;
}

.lfh-v3-toggle-btn {
  flex: 1;
  padding: 8px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  background: ${colors.background};
  border: 1.5px solid ${colors.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${colors.textPrimary};
}

.lfh-v3-toggle-btn:hover {
  border-color: ${colors.primaryRed};
}

.lfh-v3-toggle-btn.selected {
  border-color: ${colors.primaryRed};
  background: ${colors.selectedTint};
  color: ${colors.primaryRed};
}

.lfh-v3-toggle-btn input[type="radio"] {
  display: none;
}

/* ===== SEASON CARDS ===== */
.lfh-v3-season-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

@media (max-width: 400px) {
  .lfh-v3-season-cards {
    grid-template-columns: 1fr;
  }
}

.lfh-v3-season-card {
  background: ${colors.infoBox};
  border: 1.5px solid ${colors.border};
  border-radius: 8px;
  padding: 10px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lfh-v3-season-card:hover {
  border-color: ${colors.primaryRed};
}

.lfh-v3-season-card.selected {
  border-color: ${colors.primaryRed};
  border-width: 2px;
  background: ${colors.selectedTint};
}

.lfh-v3-season-card input[type="radio"] {
  display: none;
}

.lfh-v3-season-name {
  font-size: 11px;
  font-weight: 700;
  color: ${colors.textPrimary};
  text-transform: uppercase;
  margin-bottom: 2px;
}

.lfh-v3-season-dates {
  font-size: 9px;
  color: ${colors.textSecondary};
  margin-bottom: 6px;
}

.lfh-v3-season-icon {
  height: 28px;
  margin-bottom: 4px;
}

.lfh-v3-season-icon img {
  height: 100%;
  width: auto;
}

.lfh-v3-season-terrain {
  font-size: 9px;
  color: ${colors.textSecondary};
  margin-bottom: 2px;
}

.lfh-v3-season-price {
  font-size: 10px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 2px;
}

.lfh-v3-season-snow {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.lfh-v3-season-snow img {
  height: 12px;
  width: auto;
}

/* ===== LODGE CARDS ===== */
.lfh-v3-lodge-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lfh-v3-lodge-card {
  background: ${colors.infoBox};
  border: 1.5px solid ${colors.border};
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.lfh-v3-lodge-card:hover {
  border-color: ${colors.primaryRed};
}

.lfh-v3-lodge-card.selected {
  border-color: ${colors.primaryRed};
  border-width: 2px;
  background: ${colors.selectedTint};
}

.lfh-v3-lodge-card input[type="radio"] {
  display: none;
}

.lfh-v3-lodge-icon-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lfh-v3-lodge-icon-wrapper img {
  max-height: 32px;
  max-width: 32px;
  width: auto;
  height: auto;
}

.lfh-v3-lodge-icon-safari {
  display: flex;
  gap: 2px;
  align-items: center;
}

.lfh-v3-lodge-icon-safari img {
  max-height: 24px;
  max-width: 24px;
}

.lfh-v3-lodge-content {
  flex: 1;
  min-width: 0;
}

.lfh-v3-lodge-name {
  font-size: 13px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 2px;
}

.lfh-v3-lodge-desc {
  font-size: 11px;
  color: ${colors.textSecondary};
  line-height: 1.3;
}

/* ===== TOUR DATE SELECT ===== */
.lfh-v3-select optgroup {
  font-weight: 600;
  color: ${colors.textPrimary};
  font-size: 12px;
}

.lfh-v3-select option {
  font-weight: 400;
  color: ${colors.textPrimary};
  padding: 4px 0;
}

/* ===== SEARCHABLE COUNTRY DROPDOWN ===== */
.lfh-v3-country-wrapper {
  position: relative;
}

.lfh-v3-country-input {
  width: 100%;
  padding: 10px 12px;
  padding-right: 30px;
  font-size: 13px;
  font-family: inherit;
  border: 1.5px solid ${colors.border};
  border-radius: 6px;
  background: ${colors.background};
  color: ${colors.textPrimary};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.lfh-v3-country-input:focus {
  outline: none;
  border-color: ${colors.primaryRed};
  box-shadow: 0 0 0 3px rgba(230, 43, 30, 0.08);
}

.lfh-v3-country-input::placeholder {
  color: #94A3B8;
  font-size: 12px;
}

.lfh-v3-country-input.error {
  border-color: #EF4444;
}

.lfh-v3-country-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #334155;
  font-size: 10px;
  transition: transform 0.2s ease;
}

.lfh-v3-country-wrapper.open .lfh-v3-country-arrow {
  transform: translateY(-50%) rotate(180deg);
}

.lfh-v3-country-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${colors.background};
  border: 1.5px solid ${colors.border};
  border-top: none;
  border-radius: 0 0 6px 6px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  display: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.lfh-v3-country-dropdown.open {
  display: block;
}

.lfh-v3-country-option {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  color: ${colors.textPrimary};
  transition: background 0.15s ease;
}

.lfh-v3-country-option:hover {
  background: ${colors.infoBox};
}

.lfh-v3-country-option.highlighted {
  background: ${colors.selectedTint};
}

.lfh-v3-country-no-results {
  padding: 10px 12px;
  font-size: 12px;
  color: ${colors.textSecondary};
  text-align: center;
}

/* ===== GROUP SIZE SLIDER ===== */
.lfh-v3-slider-container {
  padding: 8px 0;
}

.lfh-v3-slider-display {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: ${colors.primaryRed};
  margin-bottom: 4px;
}

.lfh-v3-slider-label {
  text-align: center;
  font-size: 10px;
  color: ${colors.textSecondary};
  margin-bottom: 10px;
}

.lfh-v3-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${colors.border};
  outline: none;
  -webkit-appearance: none;
}

.lfh-v3-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${colors.primaryRed};
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(230, 43, 30, 0.3);
}

.lfh-v3-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${colors.primaryRed};
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(230, 43, 30, 0.3);
}

/* ===== CHECKBOX ===== */
.lfh-v3-checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 14px 0;
}

.lfh-v3-checkbox {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid ${colors.border};
  border-radius: 4px;
  background: ${colors.background};
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 1px;
  transition: all 0.2s ease;
}

.lfh-v3-checkbox:checked {
  background: ${colors.primaryRed};
  border-color: ${colors.primaryRed};
}

.lfh-v3-checkbox:checked::before {
  content: '\\2713';
  display: block;
  text-align: center;
  color: white;
  font-size: 11px;
  font-weight: bold;
  line-height: 12px;
}

.lfh-v3-checkbox-label {
  font-size: 10px;
  color: ${colors.textSecondary};
  line-height: 1.4;
}

.lfh-v3-checkbox-label a {
  color: ${colors.primaryRed};
  text-decoration: none;
}

.lfh-v3-checkbox-label a:hover {
  text-decoration: underline;
}

/* ===== BUTTONS ===== */
.lfh-v3-btn-container {
  display: flex;
  gap: 10px;
  padding: 16px;
  border-top: 1px solid ${colors.border};
}

.lfh-v3-btn {
  flex: 1;
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lfh-v3-btn-primary {
  background: ${colors.background};
  color: ${colors.primaryRed};
  border: 2px solid ${colors.primaryRed};
}

.lfh-v3-btn-primary:hover {
  background: #FEF2F2;
}

.lfh-v3-btn-secondary {
  background: ${colors.background};
  color: ${colors.textSecondary};
  border: 1.5px solid ${colors.border};
}

.lfh-v3-btn-secondary:hover {
  border-color: ${colors.primaryRed};
}

/* ===== ERROR MESSAGE ===== */
.lfh-v3-error {
  background: #FEE2E2;
  color: #DC2626;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  margin-top: 12px;
}

/* ===== LOADING STATE ===== */
.lfh-v3-loading {
  text-align: center;
  padding: 40px 16px;
}

.lfh-v3-spinner {
  width: 44px;
  height: 44px;
  border: 4px solid ${colors.infoBox};
  border-top-color: ${colors.primaryRed};
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: lfh-v3-spin 0.8s linear infinite;
}

@keyframes lfh-v3-spin {
  to { transform: rotate(360deg); }
}

.lfh-v3-loading-text {
  font-size: 13px;
  color: ${colors.textPrimary};
  font-weight: 500;
}

/* ===== SUCCESS STATE ===== */
.lfh-v3-success {
  text-align: center;
  padding: 36px 16px;
}

.lfh-v3-success-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: ${colors.primaryRed};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lfh-v3-success-icon svg {
  width: 30px;
  height: 30px;
  color: white;
}

.lfh-v3-success-title {
  font-size: 18px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 8px 0;
}

.lfh-v3-success-message {
  font-size: 12px;
  color: ${colors.textSecondary};
  line-height: 1.5;
  margin: 0;
}

/* ===== SCROLLBAR ===== */
.lfh-v3-content::-webkit-scrollbar {
  width: 4px;
}

.lfh-v3-content::-webkit-scrollbar-track {
  background: ${colors.infoBox};
  border-radius: 2px;
}

.lfh-v3-content::-webkit-scrollbar-thumb {
  background: ${colors.border};
  border-radius: 2px;
}

.lfh-v3-content::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
</style>

<!-- HEADER - Full dark wood background with logo overlay -->
<div class="lfh-v3-header">
  <div class="lfh-v3-logo-container">
    <img
      src="https://yannicksegaar.github.io/RomAIx-Logo/LFH_Logo_FullName_White.svg"
      alt="Last Frontier Heliskiing"
      class="lfh-v3-logo"
    />
  </div>
  <p class="lfh-v3-header-label">${displayTitle}</p>
  <p class="lfh-v3-header-description">${displaySubtitle}</p>
</div>

<!-- PROGRESS -->
<div class="lfh-v3-progress">
  <div class="lfh-v3-progress-step active" data-step="1">
    <div class="lfh-v3-progress-bar">
      <div class="lfh-v3-progress-fill" style="width: 100%"></div>
    </div>
    <div class="lfh-v3-progress-label">Contact & Intent</div>
  </div>
  <div class="lfh-v3-progress-step" data-step="2">
    <div class="lfh-v3-progress-bar">
      <div class="lfh-v3-progress-fill" style="width: 0%"></div>
    </div>
    <div class="lfh-v3-progress-label">Trip Details <span class="lfh-v3-progress-optional">(optional)</span></div>
  </div>
</div>

<!-- FORM CONTENT -->
<div class="lfh-v3-content">
  <!-- STEP 1: Contact & Intent -->
  <div id="lfh-v3-step-1" class="lfh-v3-step active">
    <form id="lfh-v3-contact-form">
      <div class="lfh-v3-form-row">
        <div class="lfh-v3-form-group">
          <label class="lfh-v3-label">First Name <span class="lfh-v3-required">*</span></label>
          <input type="text" id="lfh-v3-firstName" name="firstName" class="lfh-v3-input" placeholder="John" autocomplete="given-name" required>
        </div>
        <div class="lfh-v3-form-group">
          <label class="lfh-v3-label">Last Name <span class="lfh-v3-required">*</span></label>
          <input type="text" id="lfh-v3-lastName" name="lastName" class="lfh-v3-input" placeholder="Smith" autocomplete="family-name" required>
        </div>
      </div>

      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">Email <span class="lfh-v3-required">*</span></label>
        <input type="email" id="lfh-v3-email" name="email" class="lfh-v3-input" placeholder="john.smith@example.com" autocomplete="email" required>
      </div>

      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">Phone <span class="lfh-v3-required">*</span></label>
        <input type="tel" id="lfh-v3-phone" name="phone" class="lfh-v3-input" placeholder="+1 (888) 655 5566" autocomplete="tel" required>
      </div>

      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">Country <span class="lfh-v3-required">*</span></label>
        <div class="lfh-v3-country-wrapper">
          <input type="text" id="lfh-v3-country-input" class="lfh-v3-country-input" placeholder="Select your country" autocomplete="country-name" readonly>
          <input type="hidden" id="lfh-v3-country" name="country" required>
          <span class="lfh-v3-country-arrow">▼</span>
          <div id="lfh-v3-country-dropdown" class="lfh-v3-country-dropdown"></div>
        </div>
      </div>

      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">City</label>
        <input type="text" id="lfh-v3-city" name="city" class="lfh-v3-input" placeholder="Vancouver" autocomplete="address-level2">
      </div>

      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">How did you hear about us? <span class="lfh-v3-required">*</span></label>
        <select id="lfh-v3-hearAboutUs" name="hearAboutUs" class="lfh-v3-select" required>
          <option value="">Select an option</option>
          <option value="Google Search">Google Search</option>
          <option value="Social Media">Social Media</option>
          <option value="Friend/Family Referral">Friend/Family Referral</option>
          <option value="Magazine/Publication">Magazine/Publication</option>
          <option value="Travel Agent">Travel Agent</option>
          <option value="Previous Guest">Previous Guest</option>
          <option value="Ski Show/Event">Ski Show/Event</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <!-- INTENT QUALIFIER -->
      <div class="lfh-v3-form-group">
        <div class="lfh-v3-section-title">What brings you here today? <span class="lfh-v3-required">*</span></div>
        <div class="lfh-v3-intent-cards">
          <label class="lfh-v3-intent-card" for="intent-learning">
            <input type="radio" id="intent-learning" name="intent" value="learning" required>
            <div class="lfh-v3-intent-title">Learning about heliskiing</div>
            <div class="lfh-v3-intent-desc">Just exploring what's possible</div>
          </label>
          <label class="lfh-v3-intent-card" for="intent-comparing">
            <input type="radio" id="intent-comparing" name="intent" value="comparing">
            <div class="lfh-v3-intent-title">Comparing operators</div>
            <div class="lfh-v3-intent-desc">Researching my options</div>
          </label>
          <label class="lfh-v3-intent-card" for="intent-planning">
            <input type="radio" id="intent-planning" name="intent" value="planning">
            <div class="lfh-v3-intent-title">Planning a trip</div>
            <div class="lfh-v3-intent-desc">Thinking about dates and details</div>
          </label>
          <label class="lfh-v3-intent-card" for="intent-ready">
            <input type="radio" id="intent-ready" name="intent" value="ready_to_book">
            <div class="lfh-v3-intent-title">Ready to book</div>
            <div class="lfh-v3-intent-desc">Want to discuss availability</div>
          </label>
        </div>
      </div>

      <div id="lfh-v3-error-1"></div>
    </form>
  </div>

  <!-- STEP 2: Trip Preferences -->
  <div id="lfh-v3-step-2" class="lfh-v3-step">
    <form id="lfh-v3-trip-form">
      <!-- SKI EXPERIENCE -->
      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">How many days a year do you ski?</label>
        <div class="lfh-v3-exp-cards">
          <label class="lfh-v3-exp-card" for="ski-days-1">
            <input type="radio" id="ski-days-1" name="skiDaysPerYear" value="0-10">
            <div class="lfh-v3-exp-label">0-10</div>
          </label>
          <label class="lfh-v3-exp-card" for="ski-days-2">
            <input type="radio" id="ski-days-2" name="skiDaysPerYear" value="10-30">
            <div class="lfh-v3-exp-label">10-30</div>
          </label>
          <label class="lfh-v3-exp-card" for="ski-days-3">
            <input type="radio" id="ski-days-3" name="skiDaysPerYear" value="30+">
            <div class="lfh-v3-exp-label">30+</div>
          </label>
        </div>
      </div>

      <!-- CAT/HELI EXPERIENCE -->
      <div class="lfh-v3-toggle-row">
        <div class="lfh-v3-toggle-group">
          <div class="lfh-v3-toggle-label">Have you cat skied?</div>
          <div class="lfh-v3-toggle-options">
            <label class="lfh-v3-toggle-btn" for="cat-yes">
              <input type="radio" id="cat-yes" name="catSkied" value="yes">
              Yes
            </label>
            <label class="lfh-v3-toggle-btn" for="cat-no">
              <input type="radio" id="cat-no" name="catSkied" value="no">
              No
            </label>
          </div>
        </div>
        <div class="lfh-v3-toggle-group">
          <div class="lfh-v3-toggle-label">Have you heli skied?</div>
          <div class="lfh-v3-toggle-options">
            <label class="lfh-v3-toggle-btn" for="heli-yes">
              <input type="radio" id="heli-yes" name="heliSkied" value="yes">
              Yes
            </label>
            <label class="lfh-v3-toggle-btn" for="heli-no">
              <input type="radio" id="heli-no" name="heliSkied" value="no">
              No
            </label>
          </div>
        </div>
      </div>

      <!-- SEASON PREFERENCE -->
      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">When would you like to visit?</label>
        <div class="lfh-v3-season-cards">
          <label class="lfh-v3-season-card" for="season-early">
            <input type="radio" id="season-early" name="seasonPreference" value="early">
            <div class="lfh-v3-season-name">Early</div>
            <div class="lfh-v3-season-dates">Dec-Jan</div>
            <div class="lfh-v3-season-icon"><img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/mostly-trees.svg" alt="Trees"></div>
            <div class="lfh-v3-season-terrain">More Trees</div>
            <div class="lfh-v3-season-price">$$</div>
            <div class="lfh-v3-season-snow">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/icon-snow.svg" alt="*">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/icon-snow.svg" alt="*">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/icon-snow.svg" alt="*">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/icon-snow.svg" alt="*">
            </div>
          </label>
          <label class="lfh-v3-season-card" for="season-middle">
            <input type="radio" id="season-middle" name="seasonPreference" value="middle">
            <div class="lfh-v3-season-name">Middle</div>
            <div class="lfh-v3-season-dates">Feb-Mar</div>
            <div class="lfh-v3-season-icon"><img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/mix-trees.svg" alt="Alpine+Trees"></div>
            <div class="lfh-v3-season-terrain">Alpine+Trees</div>
            <div class="lfh-v3-season-price">$$$$</div>
            <div class="lfh-v3-season-snow">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/icon-snow.svg" alt="*">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/icon-snow.svg" alt="*">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/icon-snow.svg" alt="*">
            </div>
          </label>
          <label class="lfh-v3-season-card" for="season-late">
            <input type="radio" id="season-late" name="seasonPreference" value="late">
            <div class="lfh-v3-season-name">Late</div>
            <div class="lfh-v3-season-dates">April</div>
            <div class="lfh-v3-season-icon"><img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/mostly-alpine.svg" alt="Alpine"></div>
            <div class="lfh-v3-season-terrain">Mostly Alpine</div>
            <div class="lfh-v3-season-price">$$$</div>
            <div class="lfh-v3-season-snow">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/icon-snow.svg" alt="*">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/icon-snow.svg" alt="*">
            </div>
          </label>
        </div>
      </div>

      <!-- TOUR DATE SELECTION -->
      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">Select Your Tour</label>
        <select id="lfh-v3-tourDate" name="tourDate" class="lfh-v3-select">
          <option value="">Select a tour date</option>
          <optgroup label="7 Day Tours">
            <option value="2027-04: Dec 30 - Jan 6">2027-04: Dec 30 - Jan 6</option>
            <option value="2027-05: Jan 6 - 13">2027-05: Jan 6 - 13</option>
            <option value="2027-07: Jan 23 - 30">2027-07: Jan 23 - 30</option>
            <option value="2027-09: Feb 4 - 11">2027-09: Feb 4 - 11</option>
            <option value="2027-11: Feb 21 - 28">2027-11: Feb 21 - 28</option>
            <option value="2027-13: Mar 5 - 12">2027-13: Mar 5 - 12</option>
            <option value="2027-15: Mar 21 - 28">2027-15: Mar 21 - 28</option>
          </optgroup>
          <optgroup label="5 Day Tours">
            <option value="2027-05-5: Jan 13 - 18">2027-05-5: Jan 13 - 18</option>
            <option value="2027-06-5: Jan 18 - 23">2027-06-5: Jan 18 - 23</option>
            <option value="2027-08-5: Jan 30 - Feb 4">2027-08-5: Jan 30 - Feb 4</option>
            <option value="2027-09-5: Feb 11 - 16">2027-09-5: Feb 11 - 16</option>
            <option value="2027-10-5: Feb 16 - 21">2027-10-5: Feb 16 - 21</option>
            <option value="2027-12-5: Feb 28 - Mar 5">2027-12-5: Feb 28 - Mar 5</option>
            <option value="2027-14-5: Mar 16 - 21">2027-14-5: Mar 16 - 21</option>
            <option value="2027-16-5: Mar 28 - Apr 2">2027-16-5: Mar 28 - Apr 2</option>
            <option value="2027-17-5: Apr 2 - 7">2027-17-5: Apr 2 - 7</option>
            <option value="2027-18-5: Apr 7 - 12">2027-18-5: Apr 7 - 12</option>
          </optgroup>
          <optgroup label="4 Day Tours">
            <option value="2027-14-4: Mar 12 - 16">2027-14-4: Mar 12 - 16</option>
          </optgroup>
          <optgroup label="10 Day Safari">
            <option value="2027-05-10: Jan 13 - 23">2027-05-10: Jan 13 - 23</option>
            <option value="2027-09-10: Feb 11 - 21">2027-09-10: Feb 11 - 21</option>
            <option value="2027-16-10: Mar 28 - Apr 7">2027-16-10: Mar 28 - Apr 7</option>
          </optgroup>
          <optgroup label="9 Day Safari">
            <option value="2027-14-9: Mar 12 - 21">2027-14-9: Mar 12 - 21</option>
          </optgroup>
          <optgroup label="7 Day Safari">
            <option value="2027-09: Feb 4 - 11">2027-09: Feb 4 - 11</option>
          </optgroup>
        </select>
      </div>

      <!-- LODGE PREFERENCE -->
      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">Which lodge interests you?</label>
        <div class="lfh-v3-lodge-cards">
          <label class="lfh-v3-lodge-card" for="lodge-bell2">
            <input type="radio" id="lodge-bell2" name="lodge" value="bell2">
            <div class="lfh-v3-lodge-icon-wrapper">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/home.svg" alt="Bell 2">
            </div>
            <div class="lfh-v3-lodge-content">
              <div class="lfh-v3-lodge-name">Bell 2 Lodge</div>
              <div class="lfh-v3-lodge-desc">Remote chalets, 36 guests. Strong intermediate+</div>
            </div>
          </label>
          <label class="lfh-v3-lodge-card" for="lodge-ripley">
            <input type="radio" id="lodge-ripley" name="lodge" value="ripley">
            <div class="lfh-v3-lodge-icon-wrapper">
              <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/ripley-icon.png" alt="Ripley Creek">
            </div>
            <div class="lfh-v3-lodge-content">
              <div class="lfh-v3-lodge-name">Ripley Creek</div>
              <div class="lfh-v3-lodge-desc">Historic mining town, 24 guests. Advanced/expert only</div>
            </div>
          </label>
          <label class="lfh-v3-lodge-card" for="lodge-both">
            <input type="radio" id="lodge-both" name="lodge" value="both">
            <div class="lfh-v3-lodge-icon-wrapper">
              <span class="lfh-v3-lodge-icon-safari">
                <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/home.svg" alt="Bell 2">
                <img src="https://www.lastfrontierheli.com/wp-content/themes/lastfrontier/dist/images/ripley-icon.png" alt="Ripley Creek">
              </span>
            </div>
            <div class="lfh-v3-lodge-content">
              <div class="lfh-v3-lodge-name">Both (Safari)</div>
              <div class="lfh-v3-lodge-desc">Experience both lodges</div>
            </div>
          </label>
          <label class="lfh-v3-lodge-card" for="lodge-not-sure">
            <input type="radio" id="lodge-not-sure" name="lodge" value="not_sure">
            <div class="lfh-v3-lodge-icon-wrapper"></div>
            <div class="lfh-v3-lodge-content">
              <div class="lfh-v3-lodge-name">Not sure yet</div>
              <div class="lfh-v3-lodge-desc">Help me decide</div>
            </div>
          </label>
        </div>
      </div>

      <!-- GROUP SIZE -->
      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">Group size</label>
        <div class="lfh-v3-slider-container">
          <div class="lfh-v3-slider-display" id="lfh-v3-group-display">4</div>
          <div class="lfh-v3-slider-label">people</div>
          <input type="range" id="lfh-v3-groupSize" name="groupSize" class="lfh-v3-slider" min="1" max="12" value="4" step="1">
        </div>
      </div>

      <!-- ADDITIONAL QUESTIONS -->
      <div class="lfh-v3-form-group">
        <label class="lfh-v3-label">Additional questions</label>
        <textarea id="lfh-v3-additionalQuestions" name="additionalQuestions" class="lfh-v3-textarea" placeholder="Tell us about your experience level, preferences, or any questions..."></textarea>
      </div>

      <!-- PRIVACY CONSENT -->
      <div class="lfh-v3-checkbox-group">
        <input type="checkbox" id="lfh-v3-privacy" name="privacyConsent" class="lfh-v3-checkbox" required>
        <label for="lfh-v3-privacy" class="lfh-v3-checkbox-label">
          I agree to the <a href="https://www.lastfrontierheli.com/privacy-policy/" target="_blank">privacy policy</a>
        </label>
      </div>

      <div id="lfh-v3-error-2"></div>
    </form>
  </div>

  <!-- LOADING STATE -->
  <div id="lfh-v3-loading" class="lfh-v3-step">
    <div class="lfh-v3-loading">
      <div class="lfh-v3-spinner"></div>
      <div class="lfh-v3-loading-text">Preparing your heliskiing adventure...</div>
    </div>
  </div>

  <!-- SUCCESS STATE -->
  <div id="lfh-v3-success" class="lfh-v3-step">
    <div class="lfh-v3-success">
      <div class="lfh-v3-success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="lfh-v3-success-title">Request Received!</h3>
      <p class="lfh-v3-success-message">
        Thank you for your interest in Last Frontier Heliskiing! Our team will review your request and contact you within 24 hours.
      </p>
    </div>
  </div>
</div>

<!-- BUTTONS -->
<div class="lfh-v3-btn-container" id="lfh-v3-btns">
  <button id="lfh-v3-back-btn" class="lfh-v3-btn lfh-v3-btn-secondary" style="display: none;">Back</button>
  <button id="lfh-v3-next-btn" class="lfh-v3-btn lfh-v3-btn-primary">Continue to Trip Details</button>
</div>
`;

    element.appendChild(container);

    // ========================================================================
    // DISABLE CHAT INPUT while form is visible in the DOM
    // ========================================================================
    let formObserver = null;

    function getShadowRoot() {
      const host = document.getElementById('voiceflow-chat');
      return host?.shadowRoot || null;
    }

    function disableChatInput() {
      const shadowRoot = getShadowRoot();
      if (!shadowRoot) return;
      const inputContainer = shadowRoot.querySelector('.vfrc-input-container');
      if (inputContainer) {
        inputContainer.style.display = 'none';
      }
    }

    function reEnableChatInput() {
      const shadowRoot = getShadowRoot();
      if (!shadowRoot) return;
      const inputContainer = shadowRoot.querySelector('.vfrc-input-container');
      if (inputContainer) {
        inputContainer.style.display = '';
      }
    }

    // Only hide input for force handoff (conversation is ending)
    if (isForceHandoff) {
      disableChatInput();

      // Watch for form removal (chat restart, etc.) and re-enable input
      formObserver = new MutationObserver(() => {
        if (!container.isConnected) {
          reEnableChatInput();
          formObserver.disconnect();
        }
      });
      const observeTarget = container.parentElement || element;
      if (observeTarget) {
        formObserver.observe(observeTarget.getRootNode(), { childList: true, subtree: true });
      }

      // Fire render-time alert immediately (safety net — fires even if user abandons)
      if (alertWebhookUrl) {
        fetch(alertWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'force_handoff',
            severity: 'critical',
            timestamp: new Date().toISOString(),
            source: 'Voiceflow Lead Form v5.0 (force_handoff_render)',
            conversationData: {
              history: conversationHistory,
              conversationId: conversationId,
              userId: userId,
            },
            conversationalIntentSignals: intentSignals,
            lead: {},
            pageUrl: window.location.href,
          }),
        }).catch(() => {}); // fire-and-forget
      }
    }

    // ========================================================================
    // ANIMATE IN
    // ========================================================================
    if (animateIn) {
      setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 50);
    }

    // ========================================================================
    // SELECTORS
    // ========================================================================
    const backBtn = container.querySelector('#lfh-v3-back-btn');
    const nextBtn = container.querySelector('#lfh-v3-next-btn');
    const btnContainer = container.querySelector('#lfh-v3-btn-container');

    // ========================================================================
    // CARD SELECTION HANDLERS
    // ========================================================================
    function setupCardSelection(selector, containerClass) {
      const cards = container.querySelectorAll(selector);
      cards.forEach(card => {
        card.addEventListener('click', () => {
          const parent = card.closest(containerClass) || card.parentElement;
          parent.querySelectorAll(selector.split(' ')[0]).forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          const radio = card.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        });
      });
    }

    setupCardSelection('.lfh-v3-intent-card', '.lfh-v3-intent-cards');
    setupCardSelection('.lfh-v3-exp-card', '.lfh-v3-exp-cards');
    setupCardSelection('.lfh-v3-toggle-btn', '.lfh-v3-toggle-options');
    setupCardSelection('.lfh-v3-season-card', '.lfh-v3-season-cards');
    setupCardSelection('.lfh-v3-lodge-card', '.lfh-v3-lodge-cards');

    // ========================================================================
    // SEARCHABLE COUNTRY DROPDOWN
    // ========================================================================
    const countries = [
      // Priority countries (most common for heliskiing guests)
      'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
      'France', 'Switzerland', 'Austria', 'Italy', 'Japan', 'Netherlands',
      'Sweden', 'Norway', 'Denmark', 'Belgium', 'New Zealand',
      // All other countries A-Z
      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
      'Argentina', 'Armenia', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh',
      'Barbados', 'Belarus', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
      'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
      'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde',
      'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
      'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
      'Democratic Republic of the Congo', 'Djibouti', 'Dominica', 'Dominican Republic',
      'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
      'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'Gabon', 'Gambia',
      'Georgia', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
      'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India',
      'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Ivory Coast', 'Jamaica',
      'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
      'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
      'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
      'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
      'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
      'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Niger',
      'Nigeria', 'North Korea', 'North Macedonia', 'Oman', 'Pakistan', 'Palau',
      'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
      'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
      'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
      'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
      'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
      'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
      'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Syria', 'Taiwan', 'Tajikistan',
      'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
      'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
      'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
      'Yemen', 'Zambia', 'Zimbabwe', 'Other'
    ];

    // Remove duplicates and sort (keeping priority countries at top)
    const priorityCountries = countries.slice(0, 16);
    const otherCountries = [...new Set(countries.slice(16))].sort();
    const allCountries = [...new Set([...priorityCountries, ...otherCountries])];

    const countryWrapper = container.querySelector('.lfh-v3-country-wrapper');
    const countryInput = container.querySelector('#lfh-v3-country-input');
    const countryHidden = container.querySelector('#lfh-v3-country');
    const countryDropdown = container.querySelector('#lfh-v3-country-dropdown');

    let isDropdownOpen = false;

    function renderCountryOptions(filter = '') {
      const filterLower = filter.toLowerCase();
      const filtered = allCountries.filter(c =>
        c.toLowerCase().includes(filterLower)
      );

      if (filtered.length === 0) {
        countryDropdown.innerHTML = '<div class="lfh-v3-country-no-results">No countries found</div>';
      } else {
        countryDropdown.innerHTML = filtered.map(c =>
          `<div class="lfh-v3-country-option" data-value="${c}">${c}</div>`
        ).join('');
      }
    }

    function openDropdown() {
      if (isDropdownOpen) return;
      isDropdownOpen = true;
      // Show all countries initially
      renderCountryOptions('');
      countryDropdown.classList.add('open');
      countryWrapper.classList.add('open');
      // Remove readonly so user can type to filter
      countryInput.removeAttribute('readonly');
      countryInput.placeholder = 'Type to search...';
    }

    function closeDropdown() {
      isDropdownOpen = false;
      countryDropdown.classList.remove('open');
      countryWrapper.classList.remove('open');
      // Restore readonly and placeholder
      countryInput.setAttribute('readonly', '');
      countryInput.placeholder = 'Select your country';
      // If nothing selected, clear the input
      if (!countryHidden.value) {
        countryInput.value = '';
      }
    }

    function selectCountry(value) {
      countryInput.value = value;
      countryHidden.value = value;
      countryInput.classList.remove('error');
      closeDropdown();
    }

    // Click to open dropdown
    countryInput.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document click handler from closing immediately
      if (!isDropdownOpen) {
        openDropdown();
        // Select all text so typing replaces it
        countryInput.select();
      }
    });

    // Focus also opens (but don't open on focus alone to avoid blur issues)
    countryInput.addEventListener('focus', (e) => {
      // Only open on keyboard focus (Tab), not mouse focus (click handles that)
      if (!isDropdownOpen && !e.relatedTarget) {
        // Small delay to let click handler run first if it's a click
        setTimeout(() => {
          if (!isDropdownOpen) {
            openDropdown();
          }
        }, 10);
      }
    });

    // Filter as user types
    countryInput.addEventListener('input', () => {
      renderCountryOptions(countryInput.value);
      // Clear hidden value when typing (will be set on selection)
      countryHidden.value = '';
    });

    countryDropdown.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document click handler from interfering
      if (e.target.classList.contains('lfh-v3-country-option')) {
        selectCountry(e.target.dataset.value);
      }
    });

    // Prevent the arrow from interfering with clicks
    const countryArrow = container.querySelector('.lfh-v3-country-arrow');
    countryArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isDropdownOpen) {
        closeDropdown();
      } else {
        openDropdown();
        countryInput.focus();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lfh-v3-country-wrapper')) {
        if (isDropdownOpen) {
          // If user typed something but didn't select, try to match
          if (countryInput.value && !countryHidden.value) {
            const match = allCountries.find(c =>
              c.toLowerCase() === countryInput.value.toLowerCase()
            );
            if (match) {
              selectCountry(match);
            } else {
              // No match, clear input
              countryInput.value = '';
            }
          }
          closeDropdown();
        }
      }
    });

    // Handle blur - but don't show error if clicking within the dropdown
    countryInput.addEventListener('blur', (e) => {
      // Use setTimeout to allow click events on dropdown options to fire first
      setTimeout(() => {
        // Only show error if dropdown is closed and no value selected
        if (!isDropdownOpen && !countryHidden.value) {
          // Don't add error class on blur - only on form validation
          // Just clear the input if nothing selected
          countryInput.value = '';
        }
      }, 150);
    });

    // Keyboard navigation
    countryInput.addEventListener('keydown', (e) => {
      if (!isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
        e.preventDefault();
        openDropdown();
        return;
      }

      const options = countryDropdown.querySelectorAll('.lfh-v3-country-option');
      const highlighted = countryDropdown.querySelector('.lfh-v3-country-option.highlighted');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!highlighted && options.length) {
          options[0].classList.add('highlighted');
          options[0].scrollIntoView({ block: 'nearest' });
        } else if (highlighted && highlighted.nextElementSibling?.classList.contains('lfh-v3-country-option')) {
          highlighted.classList.remove('highlighted');
          highlighted.nextElementSibling.classList.add('highlighted');
          highlighted.nextElementSibling.scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (highlighted && highlighted.previousElementSibling?.classList.contains('lfh-v3-country-option')) {
          highlighted.classList.remove('highlighted');
          highlighted.previousElementSibling.classList.add('highlighted');
          highlighted.previousElementSibling.scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlighted) {
          selectCountry(highlighted.dataset.value);
        } else if (options.length === 1) {
          // If only one option, select it
          selectCountry(options[0].dataset.value);
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
        countryInput.blur();
      } else if (e.key === 'Tab') {
        closeDropdown();
      }
    });

    // ========================================================================
    // GROUP SIZE SLIDER
    // ========================================================================
    const groupSlider = container.querySelector('#lfh-v3-groupSize');
    const groupDisplay = container.querySelector('#lfh-v3-group-display');
    if (groupSlider && groupDisplay) {
      groupSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        groupDisplay.textContent = value === '12' ? '12+' : value;
      });
    }

    // ========================================================================
    // PROGRESS UPDATE
    // ========================================================================
    function updateProgress(step) {
      const progressSteps = container.querySelectorAll('.lfh-v3-progress-step');
      progressSteps.forEach((el, index) => {
        const fill = el.querySelector('.lfh-v3-progress-fill');
        if (index + 1 < step) {
          el.classList.add('active');
          fill.style.width = '100%';
        } else if (index + 1 === step) {
          el.classList.add('active');
          fill.style.width = '100%';
        } else {
          el.classList.remove('active');
          fill.style.width = '0%';
        }
      });
    }

    // ========================================================================
    // STEP NAVIGATION
    // ========================================================================
    function showStep(stepNum) {
      const steps = container.querySelectorAll('.lfh-v3-step');
      steps.forEach(s => s.classList.remove('active'));

      const targetStep = container.querySelector(`#lfh-v3-step-${stepNum}`);
      if (targetStep) {
        targetStep.classList.add('active');
      }

      currentStep = stepNum;
      const btns = container.querySelector('#lfh-v3-btns');

      if (stepNum === 1) {
        btns.style.display = 'flex';
        backBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        nextBtn.textContent = 'Continue to Trip Details';
        updateProgress(1);
      } else if (stepNum === 2) {
        btns.style.display = 'flex';
        backBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        nextBtn.textContent = 'Submit Request';
        updateProgress(2);
      } else if (stepNum === 'loading') {
        btns.style.display = 'none';
        const loadingStep = container.querySelector('#lfh-v3-loading');
        if (loadingStep) loadingStep.classList.add('active');
      } else if (stepNum === 'success') {
        btns.style.display = 'none';
        const successStep = container.querySelector('#lfh-v3-success');
        if (successStep) successStep.classList.add('active');
      }
    }

    // ========================================================================
    // ERROR HANDLING
    // ========================================================================
    function showError(message, step) {
      const errorDiv = container.querySelector(`#lfh-v3-error-${step}`);
      if (errorDiv) {
        errorDiv.innerHTML = `<div class="lfh-v3-error">${message}</div>`;
      }
    }

    function clearError(step) {
      const errorDiv = container.querySelector(`#lfh-v3-error-${step}`);
      if (errorDiv) {
        errorDiv.innerHTML = '';
      }
    }

    // ========================================================================
    // VALIDATION
    // ========================================================================
    function validateStep1() {
      const form = container.querySelector('#lfh-v3-contact-form');
      let isValid = true;

      // Required fields (excluding hidden country field)
      const requiredFields = form.querySelectorAll('[required]:not([type="hidden"])');
      requiredFields.forEach(field => {
        if (!field.value || !field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      // Country validation (check hidden field, show error on visible input)
      const countryHiddenField = container.querySelector('#lfh-v3-country');
      const countryVisibleInput = container.querySelector('#lfh-v3-country-input');
      if (!countryHiddenField.value || !countryHiddenField.value.trim()) {
        isValid = false;
        countryVisibleInput.classList.add('error');
      } else {
        countryVisibleInput.classList.remove('error');
      }

      // Email validation
      const emailField = container.querySelector('#lfh-v3-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField.value && !emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
      }

      // Intent selection
      const intentSelected = container.querySelector('input[name="intent"]:checked');
      if (!intentSelected) {
        isValid = false;
      }

      return isValid;
    }

    function validateStep2() {
      const privacyConsent = container.querySelector('#lfh-v3-privacy');
      return privacyConsent.checked;
    }

    // ========================================================================
    // LEAD PRIORITY SCORING
    // ========================================================================
    function computeLeadPriority(intent, skiDays) {
      const intentScores = { learning: 1, comparing: 2, planning: 3, ready_to_book: 4 };
      const expScores = { '0-10': 1, '10-30': 2, '30+': 3 };

      const intentScore = intentScores[intent] || 1;
      const expScore = expScores[skiDays] || 2;

      if (intentScore >= 4) return 'hot';
      if (intentScore >= 3 || (intentScore >= 2 && expScore >= 2)) return 'warm';
      return 'cold';
    }

    // ========================================================================
    // WEBHOOK SUBMISSION
    // ========================================================================
    async function submitToWebhook() {
      const getVal = (id) => container.querySelector(id)?.value?.trim() || '';
      const getRadio = (name) => container.querySelector(`input[name="${name}"]:checked`)?.value || '';

      const intent = getRadio('intent');
      const skiDays = getRadio('skiDaysPerYear');
      const leadPriority = computeLeadPriority(intent, skiDays);

      const intentScores = { learning: 1, comparing: 2, planning: 3, ready_to_book: 4 };
      const expScores = { '0-10': 1, '10-30': 2, '30+': 3 };

      const payload = {
        lead: {
          firstName: getVal('#lfh-v3-firstName'),
          lastName: getVal('#lfh-v3-lastName'),
          email: getVal('#lfh-v3-email'),
          phone: getVal('#lfh-v3-phone'),
          country: getVal('#lfh-v3-country'),
          city: getVal('#lfh-v3-city'),
          hearAboutUs: getVal('#lfh-v3-hearAboutUs'),
          intent: intent,
        },
        tripPreferences: {
          skiDaysPerYear: skiDays,
          catSkied: getRadio('catSkied'),
          heliSkied: getRadio('heliSkied'),
          seasonPreference: getRadio('seasonPreference'),
          tourDate: getVal('#lfh-v3-tourDate'),
          lodge: getRadio('lodge'),
          groupSize: getVal('#lfh-v3-groupSize') === '12' ? '12+' : getVal('#lfh-v3-groupSize'),
          additionalQuestions: getVal('#lfh-v3-additionalQuestions'),
        },
        qualification: {
          intentScore: intentScores[intent] || 1,
          experienceScore: expScores[skiDays] || 2,
          leadPriority: leadPriority,
        },
        conversationalIntentSignals: {
          intentLevel: intentSignals.intentLevel || 'MEDIUM',
          hasTimeline: intentSignals.hasTimeline || 'unknown',
          timelineDetails: intentSignals.timelineDetails || '',
          groupComposition: intentSignals.groupComposition || 'unknown',
          priorExperience: intentSignals.priorExperience || 'unknown',
          askedLogistics: intentSignals.askedLogistics || false,
          askedBookingProcess: intentSignals.askedBookingProcess || false,
          conversationSummary: intentSignals.conversationSummary || '',
        },
        conversationData: {
          history: conversationHistory,
          conversationId: conversationId,
          userId: userId,
          timestamp: new Date().toISOString(),
        },
        visitorContext: {
          deviceType: visitorContext.deviceType || '',
          pageType: visitorContext.pageType || '',
          pageTopic: visitorContext.pageTopic || '',
          timezone: visitorContext.timezone || '',
          visitCount: visitorContext.visitCount || '1',
          isReturning: visitorContext.isReturning || 'false',
          language: visitorContext.language || '',
          localHour: visitorContext.localHour || '',
          dayOfWeek: visitorContext.dayOfWeek || '',
        },
        source: isForceHandoff ? 'Voiceflow Lead Form v5.0 (force_handoff)' : 'Voiceflow Lead Form v5.0',
        formVersion: '5.0.0',
      };

      console.log('Submitting lead form v4.5.0 payload:', JSON.stringify(payload, null, 2));

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        console.log('Lead form v5.0.0 submitted successfully');

        // Fire alert webhook for force_handoff (fire-and-forget, server-side Code Step is backup)
        if (isForceHandoff && alertWebhookUrl) {
          fetch(alertWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_type: 'force_handoff',
              timestamp: new Date().toISOString(),
              severity: 'critical',
              lead: payload.lead,
              conversationData: payload.conversationData,
              conversationalIntentSignals: payload.conversationalIntentSignals,
              source: 'Voiceflow Lead Form v5.0 (force_handoff_lead_captured)',
            }),
          }).catch(() => {}); // silent fail — server-side Code Step is the backup
        }

        return true;
      } catch (error) {
        console.error('Lead form v5.0.0 submission error:', error);
        return true;
      }
    }

    // ========================================================================
    // BUTTON HANDLERS
    // ========================================================================
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep === 2) {
        showStep(1);
      }
    });

    nextBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      if (currentStep === 1) {
        clearError(1);
        if (!validateStep1()) {
          showError('Please fill out all required fields correctly.', 1);
          return;
        }
        showStep(2);
      } else if (currentStep === 2) {
        clearError(2);
        if (!validateStep2()) {
          showError('Please accept the privacy policy to continue.', 2);
          return;
        }

        isSubmitting = true;
        showStep('loading');

        await new Promise(resolve => setTimeout(resolve, 1500));

        const success = await submitToWebhook();

        if (success) {
          showStep('success');

          window.voiceflow?.chat?.interact({
            type: 'event',
            payload: {
              event: { name: 'ext_lead_captured' },
              data: {
                action: isForceHandoff ? 'force_handoff_lead_captured' : 'lead_captured_v3',
                priority: computeLeadPriority(
                  container.querySelector('input[name="intent"]:checked')?.value || 'learning',
                  container.querySelector('input[name="skiDaysPerYear"]:checked')?.value || ''
                ),
                isForceHandoff: isForceHandoff,
              }
            }
          });
        } else {
          showStep(2);
          showError('Something went wrong. Please try again.', 2);
        }

        isSubmitting = false;
      }
    });

    // ========================================================================
    // INPUT BLUR VALIDATION
    // ========================================================================
    const inputs = container.querySelectorAll('.lfh-v3-input, .lfh-v3-select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });

      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });

    return function cleanup() {
      reEnableChatInput();
      if (formObserver) formObserver.disconnect();
    };
  },
};

export default LastFrontierLeadForm_v4_Unified;
