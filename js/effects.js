(function(){
var obs = new IntersectionObserver(function(es){
  for (var i = 0; i < es.length; i++) {
    if (es[i].isIntersecting) es[i].target.classList.add('visible');
  }
}, { threshold: 0.1 });
var els = document.querySelectorAll('.home-section, .page-hero, .stats-banner, .stats-dynamic, .article-cards, .carousel-wrap, .video-section, .parallax, .author');
for (var i = 0; i < els.length; i++) {
  els[i].classList.add('reveal');
  obs.observe(els[i]);
}
})();

var scTooltip = null;
function scShowTip(e,type,crop,period) {
  if (!scTooltip) {
    scTooltip = document.createElement('div');
    scTooltip.className = 'sc-tooltip';
    document.body.appendChild(scTooltip);
  }
  scTooltip.innerHTML = '<strong>' + type + '</strong><br><span>' + crop + '</span><br><span>' + period + '</span>';
  scTooltip.innerHTML = '<strong>' + type + '</strong><br><span>' + crop + '</span><br><span>' + period + '</span>';
  scTooltip.classList.add('show');
  var x = e.clientX + 12, y = e.clientY - 10;
  var mw = 220;
  if (x + mw > window.innerWidth) x = e.clientX - mw - 8;
  scTooltip.style.left = x + 'px';
  scTooltip.style.top = y + 'px';
}
function scHideTip() { if (scTooltip) scTooltip.classList.remove('show'); }
function scShowCropDetail(name) {
  for (var si = 0; si < SEASONS.length; si++) {
    if (SEASONS[si].c === name) {
      var s = SEASONS[si];
      var msg = s.c + '\nRegion: ' + (s.r || 'N/A') + '\n' +
        (s.sw ? 'Sowing: ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][s.sw[0]-1] + ' – ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][s.sw[1]-1] : '') +
        (s.hv ? '\nHarvest: ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][s.hv[0]-1] + ' – ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][s.hv[1]-1] : '') +
        (s.note ? '\n' + s.note : '');
      alert(msg);
      return;
    }
  }
}
document.addEventListener('mousemove', function(e) {
  if (scTooltip && scTooltip.classList.contains('show')) {
    var x = e.clientX + 12, y = e.clientY - 10;
    var mw = 220;
    if (x + mw > window.innerWidth) x = e.clientX - mw - 8;
    scTooltip.style.left = x + 'px';
    scTooltip.style.top = y + 'px';
  }
});

updateStats('COFFEE');
renderTags();
renderArticles();
renderContent();
renderMostRead();
renderCarousel();
initPriceBoard();

} catch(e) {
  document.body.innerHTML += '<div style="position:fixed;bottom:0;left:0;right:0;background:red;color:white;padding:20px;z-index:9999;font-size:14px">JS Error: ' + e.message + '</div>';
}
})();