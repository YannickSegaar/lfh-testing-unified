/**
 * Last Frontier Tour Booking Form - Reusable Component
 *
 * Standalone booking request form that renders into any container.
 * Designed for use inside the Tour Explorer modal but decoupled
 * enough for standalone use.
 *
 * @version 1.0.0
 * @author Last Frontier Heliskiing / RomAIx
 */

import { LFH_TOURS, LFH_COLORS, LFH_ASSETS } from './lfh-tour-explorer-modal.js';

// ============================================================================
// TOUR DATES (2027 Season)
// ============================================================================

export const TOUR_DATES = {
  '7day': [
    { value: '2027-01: Dec 30 - Jan 6', label: 'Dec 30 - Jan 6' },
    { value: '2027-02: Jan 6 - 13', label: 'Jan 6 - 13' },
    { value: '2027-03: Jan 13 - 20', label: 'Jan 13 - 20' },
    { value: '2027-04: Jan 20 - 27', label: 'Jan 20 - 27' },
    { value: '2027-05: Jan 27 - Feb 3', label: 'Jan 27 - Feb 3' },
    { value: '2027-06: Feb 3 - 10', label: 'Feb 3 - 10' },
    { value: '2027-07: Feb 10 - 17', label: 'Feb 10 - 17' },
    { value: '2027-08: Feb 17 - 24', label: 'Feb 17 - 24' },
    { value: '2027-09: Feb 24 - Mar 3', label: 'Feb 24 - Mar 3' },
    { value: '2027-10: Mar 3 - 10', label: 'Mar 3 - 10' },
    { value: '2027-11: Mar 10 - 17', label: 'Mar 10 - 17' },
    { value: '2027-12: Mar 17 - 24', label: 'Mar 17 - 24' },
    { value: '2027-13: Mar 24 - 31', label: 'Mar 24 - 31' },
  ],
  '5day': [
    { value: '2027-01: Jan 3 - 8', label: 'Jan 3 - 8' },
    { value: '2027-02: Jan 10 - 15', label: 'Jan 10 - 15' },
    { value: '2027-03: Jan 17 - 22', label: 'Jan 17 - 22' },
    { value: '2027-04: Jan 24 - 29', label: 'Jan 24 - 29' },
    { value: '2027-05: Jan 31 - Feb 5', label: 'Jan 31 - Feb 5' },
    { value: '2027-06: Feb 7 - 12', label: 'Feb 7 - 12' },
    { value: '2027-07: Feb 14 - 19', label: 'Feb 14 - 19' },
    { value: '2027-08: Feb 21 - 26', label: 'Feb 21 - 26' },
    { value: '2027-09: Feb 28 - Mar 5', label: 'Feb 28 - Mar 5' },
    { value: '2027-10: Mar 7 - 12', label: 'Mar 7 - 12' },
    { value: '2027-11: Mar 14 - 19', label: 'Mar 14 - 19' },
    { value: '2027-12: Mar 21 - 26', label: 'Mar 21 - 26' },
    { value: '2027-13: Mar 28 - Apr 2', label: 'Mar 28 - Apr 2' },
    { value: '2027-14: Apr 4 - 9', label: 'Apr 4 - 9' },
  ],
  '4day': [
    { value: '2027-01: Jan 5 - 9', label: 'Jan 5 - 9' },
    { value: '2027-02: Jan 12 - 16', label: 'Jan 12 - 16' },
    { value: '2027-03: Jan 19 - 23', label: 'Jan 19 - 23' },
    { value: '2027-04: Jan 26 - 30', label: 'Jan 26 - 30' },
    { value: '2027-05: Feb 2 - 6', label: 'Feb 2 - 6' },
    { value: '2027-06: Feb 9 - 13', label: 'Feb 9 - 13' },
    { value: '2027-07: Feb 16 - 20', label: 'Feb 16 - 20' },
    { value: '2027-08: Feb 23 - 27', label: 'Feb 23 - 27' },
    { value: '2027-09: Mar 2 - 6', label: 'Mar 2 - 6' },
    { value: '2027-10: Mar 9 - 13', label: 'Mar 9 - 13' },
    { value: '2027-11: Mar 16 - 20', label: 'Mar 16 - 20' },
    { value: '2027-12: Mar 23 - 27', label: 'Mar 23 - 27' },
  ],
  'safari10': [
    { value: '2027-01: Jan 6 - 16', label: 'Jan 6 - 16 (10-Day)' },
    { value: '2027-02: Jan 20 - 30', label: 'Jan 20 - 30 (10-Day)' },
    { value: '2027-03: Feb 3 - 13', label: 'Feb 3 - 13 (10-Day)' },
    { value: '2027-04: Feb 17 - 27', label: 'Feb 17 - 27 (10-Day)' },
    { value: '2027-05: Mar 3 - 13', label: 'Mar 3 - 13 (10-Day)' },
    { value: '2027-06: Jan 6 - 15', label: 'Jan 6 - 15 (9-Day)' },
    { value: '2027-07: Feb 10 - 19', label: 'Feb 10 - 19 (9-Day)' },
  ],
  'safari7': [
    { value: '2027-01: Jan 13 - 20', label: 'Jan 13 - 20' },
    { value: '2027-02: Jan 27 - Feb 3', label: 'Jan 27 - Feb 3' },
    { value: '2027-03: Feb 10 - 17', label: 'Feb 10 - 17' },
    { value: '2027-04: Feb 24 - Mar 3', label: 'Feb 24 - Mar 3' },
    { value: '2027-05: Mar 10 - 17', label: 'Mar 10 - 17' },
    { value: '2027-06: Mar 24 - 31', label: 'Mar 24 - 31' },
  ],
  'private': null,
};

// ============================================================================
// COUNTRY LIST
// ============================================================================

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina',
  'Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados',
  'Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana',
  'Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon',
  'Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros',
  'Congo (DRC)','Congo (Republic)','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic',
  'Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador',
  'Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France',
  'Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea',
  'Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia',
  'Iran','Iraq','Ireland','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon',
  'Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi',
  'Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico',
  'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar',
  'Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria',
  'North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Palestine','Panama',
  'Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania',
  'Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines',
  'Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles',
  'Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa',
  'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland',
  'Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga',
  'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu',
  'Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
];

// ============================================================================
// REQUEST TYPE DEFINITIONS
// ============================================================================

const REQUEST_TYPES = [
  {
    id: 'inquiry',
    label: 'General Inquiry',
    description: 'I have questions about this tour',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 8a1.5 1.5 0 0 0-1.5 1.5c0 .83.68 1.5 1.5 1.5"/><circle cx="12" cy="14" r="0.5" fill="currentColor" stroke="none"/></svg>',
  },
  {
    id: 'hold',
    label: 'Reservation Hold',
    description: 'Hold a spot while I decide (no commitment)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="2.5"/><polyline points="12 14 12 15 13 15.75"/></svg>',
  },
  {
    id: 'booking',
    label: 'Booking Request',
    description: "I'm ready to book this tour",
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1.5 0-2.5.5-3.5 1L4 6.5l2.5 1L12 5l5.5 2.5L20 6.5 15.5 4C14.5 3.5 13.5 3 12 3z"/><path d="M4 6.5v2l8 4 8-4v-2"/><path d="M4 8.5l8 4 8-4"/><line x1="12" y1="12.5" x2="12" y2="15"/><path d="M16 17l2 2 4-4" stroke-width="2.2"/></svg>',
  },
];

// ============================================================================
// BOOKING FORM STYLES
// ============================================================================

function buildBookingFormStyles() {
  return `
/* Booking Form Container */
.lfhte-bf-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 20px;
  animation: lfhte-bf-fadeIn 0.3s ease;
}
@keyframes lfhte-bf-fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tour Summary Card */
.lfhte-bf-tour-card {
  display: flex; gap: 14px; align-items: center;
  padding: 14px; background: ${LFH_COLORS.infoBox};
  border: 1px solid ${LFH_COLORS.border}; border-radius: 10px;
  margin-bottom: 20px;
}
.lfhte-bf-tour-thumb {
  width: 80px; height: 60px; border-radius: 8px;
  background-size: cover; background-position: center; flex-shrink: 0;
}
.lfhte-bf-tour-info { flex: 1; min-width: 0; }
.lfhte-bf-tour-name {
  font-size: 14px; font-weight: 700; color: ${LFH_COLORS.primaryRed};
  margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.lfhte-bf-tour-meta {
  font-size: 11px; color: ${LFH_COLORS.textSecondary}; margin: 0;
}
.lfhte-bf-tour-price {
  font-size: 13px; font-weight: 700; color: ${LFH_COLORS.textPrimary}; margin: 2px 0 0;
}

/* Section Title */
.lfhte-bf-section-title {
  font-size: 11px; font-weight: 700; color: ${LFH_COLORS.textSecondary};
  text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 10px;
}
.lfhte-bf-section-title:first-of-type { margin-top: 0; }

/* Form Fields */
.lfhte-bf-row { display: flex; gap: 10px; margin-bottom: 12px; }
.lfhte-bf-field { flex: 1; min-width: 0; }
.lfhte-bf-field label {
  display: block; font-size: 12px; font-weight: 600;
  color: ${LFH_COLORS.textPrimary}; margin-bottom: 4px;
}
.lfhte-bf-field label .lfhte-bf-req { color: ${LFH_COLORS.primaryRed}; }
.lfhte-bf-input, .lfhte-bf-select {
  width: 100%; padding: 9px 11px; font-size: 13px;
  font-family: 'Inter', sans-serif; border: 1px solid ${LFH_COLORS.border};
  border-radius: 6px; background: #fff; color: ${LFH_COLORS.textPrimary};
  transition: border-color 0.2s, box-shadow 0.2s; outline: none;
}
.lfhte-bf-input:focus, .lfhte-bf-select:focus {
  border-color: ${LFH_COLORS.primaryRed};
  box-shadow: 0 0 0 2px rgba(230, 43, 30, 0.08);
}
.lfhte-bf-input::placeholder { color: #aaa; }
.lfhte-bf-input.lfhte-bf-error, .lfhte-bf-select.lfhte-bf-error {
  border-color: ${LFH_COLORS.primaryRed};
}
.lfhte-bf-error-msg {
  font-size: 11px; color: ${LFH_COLORS.primaryRed};
  margin-top: 3px; display: none;
}
.lfhte-bf-error-msg.visible { display: block; }

/* Country dropdown wrapper */
.lfhte-bf-country-wrap { position: relative; }
.lfhte-bf-country-list {
  position: absolute; top: 100%; left: 0; right: 0;
  max-height: 180px; overflow-y: auto; background: #fff;
  border: 1px solid ${LFH_COLORS.border}; border-top: none;
  border-radius: 0 0 6px 6px; z-index: 10; display: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.lfhte-bf-country-list.open { display: block; }
.lfhte-bf-country-item {
  padding: 8px 11px; font-size: 13px; cursor: pointer;
  color: ${LFH_COLORS.textPrimary}; transition: background 0.15s;
}
.lfhte-bf-country-item:hover { background: ${LFH_COLORS.selectedTint}; }
.lfhte-bf-country-item.highlighted { background: ${LFH_COLORS.infoBox}; }
.lfhte-bf-country-list::-webkit-scrollbar { width: 5px; }
.lfhte-bf-country-list::-webkit-scrollbar-thumb {
  background: ${LFH_COLORS.border}; border-radius: 3px;
}

/* Custom dates message */
.lfhte-bf-custom-dates {
  padding: 10px 12px; background: ${LFH_COLORS.infoBox};
  border: 1px solid ${LFH_COLORS.border}; border-radius: 6px;
  font-size: 12px; color: ${LFH_COLORS.textSecondary};
  font-style: italic;
}

/* Group Size Slider */
.lfhte-bf-slider-wrap { display: flex; align-items: center; gap: 12px; }
.lfhte-bf-slider {
  flex: 1; -webkit-appearance: none; appearance: none;
  height: 4px; background: ${LFH_COLORS.border}; border-radius: 2px;
  outline: none;
}
.lfhte-bf-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px;
  border-radius: 50%; background: ${LFH_COLORS.primaryRed};
  cursor: pointer; border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.lfhte-bf-slider::-moz-range-thumb {
  width: 20px; height: 20px; border-radius: 50%;
  background: ${LFH_COLORS.primaryRed}; cursor: pointer;
  border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.lfhte-bf-slider-value {
  min-width: 32px; text-align: center; font-size: 16px;
  font-weight: 700; color: ${LFH_COLORS.primaryRed};
}

/* Request Type Cards */
.lfhte-bf-request-types { display: flex; gap: 8px; margin-bottom: 16px; }
.lfhte-bf-rt-card {
  flex: 1; padding: 12px 10px; border: 1.5px solid ${LFH_COLORS.border};
  border-radius: 8px; text-align: center; cursor: pointer;
  transition: all 0.2s; background: #fff;
}
.lfhte-bf-rt-card:hover {
  border-color: ${LFH_COLORS.primaryRed};
  background: ${LFH_COLORS.selectedTint};
}
.lfhte-bf-rt-card.selected {
  border-color: ${LFH_COLORS.primaryRed};
  background: ${LFH_COLORS.selectedTint};
  box-shadow: 0 0 0 1px ${LFH_COLORS.primaryRed};
}
.lfhte-bf-rt-icon { margin-bottom: 4px; height: 28px; display: flex; align-items: center; justify-content: center; color: ${LFH_COLORS.primaryRed}; }
.lfhte-bf-rt-label {
  font-size: 11px; font-weight: 700; color: ${LFH_COLORS.textPrimary};
  margin-bottom: 2px;
}
.lfhte-bf-rt-desc {
  font-size: 10px; color: ${LFH_COLORS.textSecondary}; line-height: 1.3;
}

/* Consent */
.lfhte-bf-consent {
  display: flex; align-items: flex-start; gap: 8px;
  margin: 16px 0; font-size: 11px; color: ${LFH_COLORS.textSecondary};
  line-height: 1.4;
}
.lfhte-bf-consent input[type="checkbox"] {
  margin-top: 2px; accent-color: ${LFH_COLORS.primaryRed}; flex-shrink: 0;
}
.lfhte-bf-consent a {
  color: #007C89; text-decoration: none;
}
.lfhte-bf-consent a:hover { text-decoration: underline; }
.lfhte-bf-consent-error {
  font-size: 11px; color: ${LFH_COLORS.primaryRed}; margin-top: -12px;
  margin-bottom: 8px; display: none;
}
.lfhte-bf-consent-error.visible { display: block; }

/* Submit Button */
.lfhte-bf-submit {
  width: 100%; padding: 13px 20px;
  background: ${LFH_COLORS.primaryRed}; color: #fff;
  border: none; border-radius: 6px; font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 700; cursor: pointer;
  text-transform: uppercase; letter-spacing: 0.5px;
  transition: all 0.2s; position: relative;
}
.lfhte-bf-submit:hover:not(:disabled) {
  background: #c4221a; transform: translateY(-1px);
}
.lfhte-bf-submit:disabled { background: #ccc; cursor: not-allowed; }
.lfhte-bf-submit.loading { color: transparent; }
.lfhte-bf-submit.loading::after {
  content: ''; position: absolute; top: 50%; left: 50%;
  width: 18px; height: 18px; margin: -9px 0 0 -9px;
  border: 2px solid #fff; border-top-color: transparent;
  border-radius: 50%; animation: lfhte-bf-spin 0.7s linear infinite;
}
@keyframes lfhte-bf-spin { to { transform: rotate(360deg); } }

/* Success State */
.lfhte-bf-success {
  text-align: center; padding: 40px 20px;
  animation: lfhte-bf-fadeIn 0.4s ease;
}
.lfhte-bf-success-icon {
  width: 56px; height: 56px; margin: 0 auto 16px;
  border-radius: 50%; background: #2E7D32; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; animation: lfhte-bf-popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes lfhte-bf-popIn {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
.lfhte-bf-success h3 {
  font-size: 18px; font-weight: 700; color: ${LFH_COLORS.textPrimary};
  margin: 0 0 8px;
}
.lfhte-bf-success p {
  font-size: 13px; color: ${LFH_COLORS.textSecondary};
  line-height: 1.5; margin: 0;
}

/* Loading State */
.lfhte-bf-loading-state {
  text-align: center; padding: 60px 20px;
  animation: lfhte-bf-fadeIn 0.3s ease;
}
.lfhte-bf-loading-spinner {
  width: 36px; height: 36px; margin: 0 auto 16px;
  border: 3px solid ${LFH_COLORS.border};
  border-top-color: ${LFH_COLORS.primaryRed};
  border-radius: 50%; animation: lfhte-bf-spin 0.8s linear infinite;
}
.lfhte-bf-loading-state p {
  font-size: 13px; color: ${LFH_COLORS.textSecondary}; margin: 0;
}

/* Mobile */
@media (max-width: 500px) {
  .lfhte-bf-row { flex-direction: column; gap: 0; }
  .lfhte-bf-request-types { flex-direction: column; }
  .lfhte-bf-tour-card { flex-direction: column; text-align: center; }
  .lfhte-bf-tour-thumb { width: 100%; height: 80px; }
  .lfhte-bf-container { padding: 14px; }
}
`;
}

// ============================================================================
// RENDER BOOKING FORM
// ============================================================================

/**
 * Renders a booking request form into the given container.
 *
 * @param {HTMLElement} container - DOM element to render into
 * @param {Object} options
 * @param {Object} options.tour - Tour object from LFH_TOURS
 * @param {string} options.webhookUrl - n8n webhook endpoint
 * @param {string} [options.variant='replace'] - UI variant ('replace' | 'slide')
 * @param {Function} [options.onSubmitSuccess] - Callback after successful submit
 * @param {Function} [options.onBack] - Callback to return to tour detail
 * @param {string|null} [options.conversationId] - VoiceFlow conversation ID
 * @param {string|null} [options.userId] - VoiceFlow user ID
 */
export function renderBookingForm(container, options = {}) {
  const {
    tour,
    webhookUrl = '',
    onSubmitSuccess = () => {},
    onBack = () => {},
    conversationId = null,
    userId = null,
  } = options;

  if (!tour) {
    container.innerHTML = '<p style="color:#999;text-align:center;padding:20px;">No tour selected.</p>';
    return;
  }

  // State
  let selectedRequestType = null;
  let selectedCountry = '';
  let groupSize = 4;

  // Get tour dates for this tour type
  const tourDates = TOUR_DATES[tour.id] || null;
  const isPrivate = tour.id === 'private';

  // Lodges display
  function lodgeName(id) {
    if (id === 'bell2') return 'Bell 2 Lodge';
    if (id === 'ripley') return 'Ripley Creek';
    if (id === 'both') return 'Both Lodges';
    return id;
  }
  const lodgesDisplay = tour.lodges.map(lodgeName).join(' & ');

  // --- Build HTML ---
  const styleEl = document.createElement('style');
  styleEl.textContent = buildBookingFormStyles();

  const formWrap = document.createElement('div');
  formWrap.className = 'lfhte-bf-container';

  // Tour date options
  let dateFieldHTML;
  if (isPrivate) {
    dateFieldHTML = `
      <div class="lfhte-bf-field">
        <label>Tour Dates</label>
        <div class="lfhte-bf-custom-dates">Contact us for custom dates tailored to your group</div>
      </div>
    `;
  } else if (tourDates && tourDates.length > 0) {
    const dateOpts = tourDates.map(d => `<option value="${d.value}">${d.label}</option>`).join('');
    dateFieldHTML = `
      <div class="lfhte-bf-field">
        <label for="lfhte-bf-date">Preferred Date</label>
        <select id="lfhte-bf-date" class="lfhte-bf-select">
          <option value="">Select a date (optional)</option>
          ${dateOpts}
        </select>
      </div>
    `;
  } else {
    dateFieldHTML = `
      <div class="lfhte-bf-field">
        <label for="lfhte-bf-date">Preferred Date</label>
        <select id="lfhte-bf-date" class="lfhte-bf-select">
          <option value="">No dates available</option>
        </select>
      </div>
    `;
  }

  // Request type cards
  const rtCardsHTML = REQUEST_TYPES.map(rt => `
    <div class="lfhte-bf-rt-card" data-rt="${rt.id}">
      <div class="lfhte-bf-rt-icon">${rt.icon}</div>
      <div class="lfhte-bf-rt-label">${rt.label}</div>
      <div class="lfhte-bf-rt-desc">${rt.description}</div>
    </div>
  `).join('');

  formWrap.innerHTML = `
    <!-- Tour Summary -->
    <div class="lfhte-bf-tour-card">
      <div class="lfhte-bf-tour-thumb" style="background-image:url('${tour.thumbnailImage}')"></div>
      <div class="lfhte-bf-tour-info">
        <p class="lfhte-bf-tour-name">${tour.name}</p>
        <p class="lfhte-bf-tour-meta">${tour.duration} &middot; ${lodgesDisplay} &middot; ${tour.verticalGuarantee} vertical</p>
        <p class="lfhte-bf-tour-price">From $${tour.priceFrom.toLocaleString()} CAD</p>
      </div>
    </div>

    <form id="lfhte-bf-form" novalidate>
      <!-- Contact Details -->
      <div class="lfhte-bf-section-title">Your Details</div>
      <div class="lfhte-bf-row">
        <div class="lfhte-bf-field">
          <label for="lfhte-bf-fname">First Name <span class="lfhte-bf-req">*</span></label>
          <input type="text" id="lfhte-bf-fname" class="lfhte-bf-input" placeholder="John" autocomplete="given-name" required>
          <div class="lfhte-bf-error-msg">Please enter your first name</div>
        </div>
        <div class="lfhte-bf-field">
          <label for="lfhte-bf-lname">Last Name <span class="lfhte-bf-req">*</span></label>
          <input type="text" id="lfhte-bf-lname" class="lfhte-bf-input" placeholder="Smith" autocomplete="family-name" required>
          <div class="lfhte-bf-error-msg">Please enter your last name</div>
        </div>
      </div>

      <div class="lfhte-bf-field" style="margin-bottom:12px">
        <label for="lfhte-bf-email">Email <span class="lfhte-bf-req">*</span></label>
        <input type="email" id="lfhte-bf-email" class="lfhte-bf-input" placeholder="john@example.com" autocomplete="email" required>
        <div class="lfhte-bf-error-msg">Please enter a valid email address</div>
      </div>

      <div class="lfhte-bf-row">
        <div class="lfhte-bf-field">
          <label for="lfhte-bf-phone">Phone <span class="lfhte-bf-req">*</span></label>
          <input type="tel" id="lfhte-bf-phone" class="lfhte-bf-input" placeholder="+1 (555) 123-4567" autocomplete="tel" required>
          <div class="lfhte-bf-error-msg">Please enter your phone number</div>
        </div>
        <div class="lfhte-bf-field">
          <label for="lfhte-bf-country">Country <span class="lfhte-bf-req">*</span></label>
          <div class="lfhte-bf-country-wrap">
            <input type="text" id="lfhte-bf-country" class="lfhte-bf-input" placeholder="Start typing..." autocomplete="off" required>
            <div class="lfhte-bf-country-list" id="lfhte-bf-country-list"></div>
          </div>
          <div class="lfhte-bf-error-msg">Please select your country</div>
        </div>
      </div>

      <!-- Trip Preferences -->
      <div class="lfhte-bf-section-title">Trip Preferences</div>

      ${dateFieldHTML}

      <div class="lfhte-bf-field" style="margin:12px 0 16px">
        <label>Group Size: <span id="lfhte-bf-group-val" style="color:${LFH_COLORS.primaryRed};font-weight:700">4</span></label>
        <div class="lfhte-bf-slider-wrap">
          <span style="font-size:11px;color:${LFH_COLORS.textSecondary}">1</span>
          <input type="range" id="lfhte-bf-group" class="lfhte-bf-slider" min="1" max="12" value="4">
          <span style="font-size:11px;color:${LFH_COLORS.textSecondary}">12</span>
        </div>
      </div>

      <!-- Request Type -->
      <div class="lfhte-bf-section-title">What would you like to do? <span class="lfhte-bf-req">*</span></div>
      <div class="lfhte-bf-request-types" id="lfhte-bf-rt-cards">${rtCardsHTML}</div>
      <div class="lfhte-bf-error-msg" id="lfhte-bf-rt-error">Please select a request type</div>

      <!-- Consent -->
      <div class="lfhte-bf-consent">
        <input type="checkbox" id="lfhte-bf-consent">
        <label for="lfhte-bf-consent">
          I agree to receive communications from Last Frontier Heliskiing.
          View our <a href="https://lastfrontierheli.com/privacy" target="_blank" rel="noopener">Privacy Policy</a>.
        </label>
      </div>
      <div class="lfhte-bf-consent-error" id="lfhte-bf-consent-error">Please accept the privacy policy</div>

      <!-- Submit -->
      <button type="submit" class="lfhte-bf-submit" id="lfhte-bf-submit">Send Request</button>
    </form>
  `;

  container.innerHTML = '';
  container.appendChild(styleEl);
  container.appendChild(formWrap);

  // --- Interactivity ---

  const form = formWrap.querySelector('#lfhte-bf-form');
  const submitBtn = formWrap.querySelector('#lfhte-bf-submit');

  // Country searchable dropdown
  const countryInput = formWrap.querySelector('#lfhte-bf-country');
  const countryList = formWrap.querySelector('#lfhte-bf-country-list');
  let highlightedIdx = -1;

  function renderCountryList(filter = '') {
    const filtered = filter
      ? COUNTRIES.filter(c => c.toLowerCase().includes(filter.toLowerCase()))
      : COUNTRIES;
    highlightedIdx = -1;
    if (filtered.length === 0) {
      countryList.innerHTML = '<div style="padding:8px 11px;color:#999;font-size:12px;">No matches</div>';
    } else {
      countryList.innerHTML = filtered.map((c, i) =>
        `<div class="lfhte-bf-country-item" data-country="${c}" data-idx="${i}">${c}</div>`
      ).join('');
    }
    countryList.classList.add('open');
  }

  countryInput.addEventListener('focus', () => renderCountryList(countryInput.value));
  countryInput.addEventListener('input', () => {
    selectedCountry = '';
    renderCountryList(countryInput.value);
  });

  countryList.addEventListener('click', (e) => {
    const item = e.target.closest('.lfhte-bf-country-item');
    if (item) {
      selectedCountry = item.dataset.country;
      countryInput.value = selectedCountry;
      countryList.classList.remove('open');
      countryInput.classList.remove('lfhte-bf-error');
      const errEl = countryInput.closest('.lfhte-bf-field')?.querySelector('.lfhte-bf-error-msg');
      if (errEl) errEl.classList.remove('visible');
    }
  });

  countryInput.addEventListener('keydown', (e) => {
    const items = countryList.querySelectorAll('.lfhte-bf-country-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIdx = Math.min(highlightedIdx + 1, items.length - 1);
      items.forEach((it, i) => it.classList.toggle('highlighted', i === highlightedIdx));
      items[highlightedIdx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIdx = Math.max(highlightedIdx - 1, 0);
      items.forEach((it, i) => it.classList.toggle('highlighted', i === highlightedIdx));
      items[highlightedIdx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && highlightedIdx >= 0 && items[highlightedIdx]) {
      e.preventDefault();
      selectedCountry = items[highlightedIdx].dataset.country;
      countryInput.value = selectedCountry;
      countryList.classList.remove('open');
    }
  });

  // Close country list on outside click
  document.addEventListener('click', (e) => {
    if (!countryInput.contains(e.target) && !countryList.contains(e.target)) {
      countryList.classList.remove('open');
    }
  });

  // Group size slider
  const groupSlider = formWrap.querySelector('#lfhte-bf-group');
  const groupVal = formWrap.querySelector('#lfhte-bf-group-val');
  if (groupSlider) {
    groupSlider.addEventListener('input', () => {
      groupSize = parseInt(groupSlider.value);
      groupVal.textContent = groupSize;
    });
  }

  // Request type selection
  const rtCards = formWrap.querySelectorAll('.lfhte-bf-rt-card');
  const rtError = formWrap.querySelector('#lfhte-bf-rt-error');
  rtCards.forEach(card => {
    card.addEventListener('click', () => {
      rtCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRequestType = card.dataset.rt;
      if (rtError) rtError.classList.remove('visible');
    });
  });

  // Field validation
  function validateField(input) {
    const errEl = input.closest('.lfhte-bf-field')?.querySelector('.lfhte-bf-error-msg');
    let valid = true;

    if (input.required && !input.value.trim()) {
      valid = false;
    }
    if (input.type === 'email' && input.value.trim()) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    }
    // Country must be in list
    if (input.id === 'lfhte-bf-country' && input.value.trim() && !COUNTRIES.includes(input.value.trim())) {
      valid = false;
    }

    input.classList.toggle('lfhte-bf-error', !valid);
    if (errEl) errEl.classList.toggle('visible', !valid);
    return valid;
  }

  // Blur validation for required fields
  formWrap.querySelectorAll('.lfhte-bf-input[required]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
  });

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    formWrap.querySelectorAll('.lfhte-bf-input[required]').forEach(input => {
      if (!validateField(input)) allValid = false;
    });

    // Country validation
    if (!selectedCountry || !COUNTRIES.includes(selectedCountry)) {
      const cInput = formWrap.querySelector('#lfhte-bf-country');
      cInput.classList.add('lfhte-bf-error');
      const errEl = cInput.closest('.lfhte-bf-field')?.querySelector('.lfhte-bf-error-msg');
      if (errEl) errEl.classList.add('visible');
      allValid = false;
    }

    // Request type
    if (!selectedRequestType) {
      if (rtError) rtError.classList.add('visible');
      allValid = false;
    }

    // Consent
    const consentBox = formWrap.querySelector('#lfhte-bf-consent');
    const consentError = formWrap.querySelector('#lfhte-bf-consent-error');
    if (!consentBox.checked) {
      if (consentError) consentError.classList.add('visible');
      allValid = false;
    } else {
      if (consentError) consentError.classList.remove('visible');
    }

    if (!allValid) return;

    // Build payload
    const dateSelect = formWrap.querySelector('#lfhte-bf-date');
    const payload = {
      lead: {
        firstName: formWrap.querySelector('#lfhte-bf-fname').value.trim(),
        lastName: formWrap.querySelector('#lfhte-bf-lname').value.trim(),
        email: formWrap.querySelector('#lfhte-bf-email').value.trim(),
        phone: formWrap.querySelector('#lfhte-bf-phone').value.trim(),
        country: selectedCountry,
      },
      bookingRequest: {
        tourId: tour.id,
        tourName: tour.name,
        tourDuration: tour.duration,
        tourLodges: lodgesDisplay,
        requestedDate: dateSelect ? dateSelect.value : '',
        groupSize,
        requestType: selectedRequestType,
      },
      conversationData: {
        conversationId,
        userId,
        timestamp: new Date().toISOString(),
      },
      source: 'tour_booking_request',
      formVersion: '1.0.0',
    };

    // Show loading
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Replace form with loading state
    formWrap.innerHTML = `
      <div class="lfhte-bf-loading-state">
        <div class="lfhte-bf-loading-spinner"></div>
        <p>Preparing your request...</p>
      </div>
    `;

    try {
      // Send to webhook
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.warn('[BookingForm] Webhook error (non-blocking):', err);
    }

    // Wait for loading animation
    await new Promise(r => setTimeout(r, 1500));

    // Show success
    const requestLabel = REQUEST_TYPES.find(rt => rt.id === selectedRequestType)?.label || 'Request';
    formWrap.innerHTML = `
      <div class="lfhte-bf-success">
        <div class="lfhte-bf-success-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
        <h3>Request Sent!</h3>
        <p>Your <strong>${requestLabel}</strong> for the <strong>${tour.name}</strong> has been submitted.
        Our team will review your request and get back to you within 24 hours.</p>
      </div>
    `;

    // Callback
    onSubmitSuccess(payload);
  });
}
