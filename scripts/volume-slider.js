let savedWidth = 125;

const globalTooltip = document.createElement('div');
Object.assign(globalTooltip.style, {
  position: 'fixed',
  padding: '4px 8px',
  background: 'rgba(0,0,0,0.8)',
  color: '#fff',
  borderRadius: '4px',
  fontSize: '12px',
  pointerEvents: 'none',
  userSelect: 'none',
  opacity: '0',
  transition: 'opacity 0.2s',
  whiteSpace: 'nowrap',
  zIndex: '9999',
  transform: 'translate(-50%, -150%)',
});
document.body.appendChild(globalTooltip);

function attachTooltipEvents(slider) {
  let hideTimeout;

  function showTooltip() {
    globalTooltip.style.opacity = '1';
    if (hideTimeout) clearTimeout(hideTimeout);
  }

  function hideTooltip() {
    hideTimeout = setTimeout(() => {
      globalTooltip.style.opacity = '0';
    }, 500);
  }

  function updateTooltip(value, pageX, pageY) {
    globalTooltip.textContent = `${value}%`;
    globalTooltip.style.left = pageX + 'px';
    globalTooltip.style.top = (pageY - 20) + 'px';
  }


  slider.removeEventListener('mousemove', slider._mousemoveHandler);
  slider.removeEventListener('input', slider._inputHandler);
  slider.removeEventListener('mouseleave', slider._mouseleaveHandler);
  slider.removeEventListener('mouseenter', slider._mouseenterHandler);


  slider._mousemoveHandler = (e) => {
    const val = slider.value || slider.getAttribute('aria-valuenow') || 0;
    updateTooltip(val, e.pageX, e.pageY);
    showTooltip();
  };

  slider._inputHandler = (e) => {
    const val = e.target.value || 0;

    const rect = slider.getBoundingClientRect();
    const pageX = e.pageX || rect.left + rect.width / 2;
    const pageY = e.pageY || rect.top;
    updateTooltip(val, pageX, pageY);
    showTooltip();
  };

  slider._mouseleaveHandler = hideTooltip;

  slider._mouseenterHandler = (e) => {
    const val = slider.value || slider.getAttribute('aria-valuenow') || 0;
    updateTooltip(val, e.pageX, e.pageY);
    showTooltip();
  };

  slider.addEventListener('mousemove', slider._mousemoveHandler);
  slider.addEventListener('input', slider._inputHandler);
  slider.addEventListener('mouseleave', slider._mouseleaveHandler);
  slider.addEventListener('mouseenter', slider._mouseenterHandler);
}

function initVolumeSliderLogger(slider) {
  if (slider._observer) {
    slider._observer.disconnect();
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'aria-valuenow') {
        const newVolume = slider.getAttribute('aria-valuenow');
        console.log('Volume changed to: ' + newVolume);
      }
    }
  });

  observer.observe(slider, { attributes: true });
  slider._observer = observer;
}

function reinitVolumeFeatures() {
  const slider = document.querySelector('ytmusic-player-bar #volume-slider');
  if (!slider) return;

  if (!slider.dataset._customized) {
    slider.dataset._customized = 'true';
    slider.style.width = `${savedWidth}px`;
    initVolumeSliderLogger(slider);
    attachTooltipEvents(slider);
  }
}
const mainObserver = new MutationObserver(() => {
  const slider = document.querySelector('ytmusic-player-bar #volume-slider');
  if (slider && !slider.dataset._customized) {
    reinitVolumeFeatures();
  }
});

const playerBar = document.querySelector('ytmusic-player-bar');
if (playerBar) {
  mainObserver.observe(playerBar, { childList: true, subtree: true });
} else {
  mainObserver.observe(document.body, { childList: true, subtree: true });
}

reinitVolumeFeatures();