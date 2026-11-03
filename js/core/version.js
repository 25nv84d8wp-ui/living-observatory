/* The ONE place the build version lives. Change it here only. */
window.LO_VERSION = Object.freeze({
  number: '11.4',
  label: 'CHEF KITCHEN RECOGNITION 11.4 · REVERSIBLE CANDIDATE',
  title: 'The Living Observatory — Chef Kitchen Recognition 11.4',
  buildId: 'CHEF-KITCHEN-RECOGNITION-11.4',
  parentBuildId: 'HOUSE-BACKBONE-COMMISSIONING-11.3'
});
document.title = window.LO_VERSION.title;
document.addEventListener('DOMContentLoaded', function () {
  var m = document.getElementById('build-marker');
  if (m) m.textContent = window.LO_VERSION.label;
});
