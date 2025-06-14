function removeSubscribeBanner() {
  document.querySelectorAll('tp-yt-paper-item').forEach(item => {
    const path = item.querySelector('yt-icon path');
    if (path?.getAttribute('d')?.includes('M10 9.35L15 12l-5 2.65')) {
      item.remove();
      console.log('Banner with Subscribe removed!');
    }
  });
}

function checkAndRemove() {
  removeSubscribeBanner();
  if (document.readyState !== 'complete') {
    requestAnimationFrame(checkAndRemove);
  }
}

const observer = new MutationObserver(() => {
  removeSubscribeBanner();
});

const targetNode = document.querySelector('ytmusic-app') || document.body;
if (targetNode) {
  observer.observe(targetNode, {
    childList: true,
    subtree: true,
  });
}


checkAndRemove();

window.addEventListener('load', removeSubscribeBanner);