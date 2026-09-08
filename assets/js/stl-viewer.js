// Small bootstrap: even a failed module download leaves a readable fallback.
(() => {
  const moduleURL = new URL('./stl-viewer-scene.js', document.currentScript.src);
  let library;
  const viewers = new Map();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = viewers.get(entry.target);
      state.visible = entry.isIntersecting;
      if (state.viewer) {
        state.viewer.setVisible(state.visible);
      } else if (state.visible && !state.loading) {
        state.loading = true;
        library ||= import(moduleURL.href);
        library.then(({ STLViewer }) => {
          state.viewer = new STLViewer(entry.target);
          state.viewer.setVisible(state.visible);
        }).catch(() => {
          entry.target.dataset.state = 'error';
          entry.target.querySelector('[role="status"]').textContent =
            'The 3D preview could not start. Please download the STL below.';
        });
      }
    }
  }, { rootMargin: '100px 0px' });
  for (const element of document.querySelectorAll('.stl-viewer')) {
    element.dataset.state = 'idle';
    element.querySelector('[role="status"]').textContent = '3D preview loads when in view.';
    viewers.set(element, { visible: false, loading: false });
    observer.observe(element);
  }
  // Release GPU resources when navigating away; re-create them after bfcache restore.
  window.addEventListener('pagehide', () => {
    for (const state of viewers.values()) state.viewer?.setVisible(false);
  });
  window.addEventListener('pageshow', () => {
    for (const state of viewers.values()) state.viewer?.setVisible(state.visible);
  });
})();
