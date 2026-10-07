// "Watch full size" opens the demo in a pop-up player over the page instead of
// navigating to the bare video file. Close it with the × button, the Esc key, or
// a click outside the video. Without JavaScript (or without <dialog> support)
// the links still open the video file directly.
(function () {
  var dialog = document.querySelector('.viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var video = dialog.querySelector('.viewer-video');
  var title = dialog.querySelector('#viewer-title');
  var closeBtn = dialog.querySelector('.viewer-close');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pausedCard = null;

  function open(link) {
    var card = link.closest('.feature-visual');
    var cardVideo = card && card.querySelector('video');
    var label = card && card.querySelector('.term-bar em');

    // Reuse the card's sources (MP4 and WebM) so every browser gets one it can play.
    video.innerHTML = '';
    var sources = cardVideo ? cardVideo.querySelectorAll('source') : [];
    if (sources.length) {
      sources.forEach(function (src) { video.appendChild(src.cloneNode()); });
    } else {
      video.src = link.getAttribute('href');
    }
    video.poster = cardVideo ? cardVideo.getAttribute('poster') || '' : '';
    video.setAttribute('aria-label', cardVideo ? cardVideo.getAttribute('aria-label') || '' : '');
    video.style.aspectRatio = cardVideo && cardVideo.classList.contains('is-wide') ? '16 / 9' : '1440 / 900';
    title.textContent = label ? label.textContent : 'demo';
    video.load();

    // Pause the small preview while the big one plays.
    if (cardVideo && !cardVideo.paused) {
      cardVideo.pause();
      pausedCard = cardVideo;
    }

    dialog.showModal();
    closeBtn.focus();
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  dialog.addEventListener('close', function () {
    video.pause();
    video.removeAttribute('src');
    video.innerHTML = '';
    video.load();
    if (pausedCard && !reduceMotion.matches) {
      var p = pausedCard.play();
      if (p && p.catch) p.catch(function () {});
    }
    pausedCard = null;
  });

  closeBtn.addEventListener('click', function () { dialog.close(); });

  // A click on the backdrop lands on the <dialog> element itself, not its contents.
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });

  document.querySelectorAll('.term-link').forEach(function (link) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', function (e) {
      // Let modified clicks (new tab, download) behave like a normal link.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open(link);
    });
  });
})();
