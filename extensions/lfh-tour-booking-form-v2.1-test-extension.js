/**
 * Standalone test extension for Tour Booking Form v2.1
 *
 * Wraps the v2.1 booking form (with partial submission) as a standalone
 * VoiceFlow extension for independent testing. Renders the form directly
 * in the chat widget without requiring the tour explorer flow.
 *
 * Trigger from VoiceFlow: ext_tourBookingForm_v2_1
 *
 * @version 1.0.0
 */

import { LFH_TOURS } from './lfh-tour-explorer-modal.js';
import { renderBookingForm } from './lfh-tour-booking-form-v2.1.js';

export const TourBookingFormV21TestExtension = {
  name: 'TourBookingFormV21Test',
  type: 'response',

  match: ({ trace }) =>
    trace.type === 'ext_tourBookingForm_v2_1' ||
    trace.payload?.name === 'ext_tourBookingForm_v2_1',

  render: ({ trace, element }) => {
    const {
      tourId = '7day',
      webhookUrl = '',
      conversationId = null,
      userId = null,
      visitorContext = {},
      conversationHistory = null,
      intentSignals = {},
    } = trace.payload || {};

    // Find the requested tour (default to 7-day)
    const tour = LFH_TOURS.find(t => t.id === tourId) || LFH_TOURS[0];

    const container = document.createElement('div');
    container.style.padding = '8px';
    element.innerHTML = '';
    element.appendChild(container);

    renderBookingForm(container, {
      tour,
      webhookUrl,
      conversationId,
      userId,
      visitorContext,
      conversationHistory,
      intentSignals,
      onSubmitSuccess: (payload) => {
        console.log('[BookingForm v2.1 Test] Submit success:', payload);
        window.voiceflow?.chat?.interact({
          type: 'complete',
          payload: {
            event: { name: 'ext_booking_submitted' },
            data: {
              tourId: tour.id,
              tourName: tour.name,
              submissionType: payload.submissionType,
              formSessionId: payload.formSessionId,
            },
          },
        });
      },
      onBack: () => {
        console.log('[BookingForm v2.1 Test] Back pressed');
      },
    });
  },
};
