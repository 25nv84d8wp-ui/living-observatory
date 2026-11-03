/* Phone fixes (no game logic here):
   1. Keeps --lo-nav-h in sync with the bottom button grid so panels never cover it.
   2. On narrow screens, only one panel is open at a time: opening a panel presses the
      CLOSE button of any other open panel (so the app's own close logic still runs). */
(function () {
  'use strict';
  var narrow = window.matchMedia('(max-width: 700px)');
  function syncNav() {
    var nav = document.querySelector('nav');
    if (nav) document.documentElement.style.setProperty('--lo-nav-h', nav.getBoundingClientRect().height + 'px');
  }
  function closeButtonOf(panel) {
    var buttons = panel.querySelectorAll('button');
    for (var i = buttons.length - 1; i >= 0; i--) {
      if (/^close/i.test(buttons[i].id) || /^CLOSE\b/i.test(buttons[i].textContent.trim()) || /-close$/.test(buttons[i].id)) return buttons[i];
    }
    return null;
  }
  function onPanelOpened(opened) {
    if (!narrow.matches) return;
    document.querySelectorAll('aside.panel').forEach(function (panel) {
      if (panel === opened || panel.hidden) return;
      var btn = closeButtonOf(panel);
      if (btn && !btn.disabled) btn.click();
      if (!panel.hidden) panel.hidden = true;
    });
  }
  function start() {
    syncNav();
    window.addEventListener('resize', syncNav);
    if (window.ResizeObserver) new ResizeObserver(syncNav).observe(document.querySelector('nav'));
    var observer = new MutationObserver(function (records) {
      records.forEach(function (r) { if (r.target.matches('aside.panel') && !r.target.hidden) onPanelOpened(r.target); });
    });
    document.querySelectorAll('aside.panel').forEach(function (p) { observer.observe(p, { attributes: true, attributeFilter: ['hidden'] }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
}());
