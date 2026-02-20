// YRS: SNOWFALL EXTENSION VERSION 1 (27 OCT 2025)

// This extension is now designed to work with the Snowify library.
export const SnowfallExtension1 = {
  name: 'Snowfall',
  type: 'effect',

  // Match the exact Custom Action name from Voiceflow
  match: ({ trace }) => trace.type === 'ext_snowfall1',

  effect: ({ trace }) => {
    console.log('Snowfall extension triggered!', trace);

    // Wait for library to be available
    if (typeof initSnowify === 'undefined') {
      console.error('Snowify library not loaded yet, retrying...');
      setTimeout(() => {
        if (typeof initSnowify !== 'undefined') {
          executeSnowfall(trace);
        } else {
          console.error('Snowify library failed to load');
        }
      }, 1000);
      return;
    }

    executeSnowfall(trace);
  }
};

function executeSnowfall(trace) {
  const action = trace.payload?.action || 'start'; // Default to start

  if (action === 'start') {
    console.log('Starting Snowify effect... ❄️');
    const options = trace.payload?.options || {};
    initSnowify(options);
  } else if (action === 'stop') {
    console.log('Stopping Snowify effect...');
    const snowCanvas = document.getElementById('snow-canvas');
    if (snowCanvas) {
      snowCanvas.remove();
    }
  }
}

export default SnowfallExtension1;
