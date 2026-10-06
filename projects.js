// Featured project swap.
// The page works without this file: Tracy is featured and the other projects are
// plain list rows. With it, clicking a row (or its "Watch demo" button) moves that
// project into the big card and the current one back into the list.
(function () {
  var stage = document.getElementById('work-stage');
  var list = document.querySelector('.more-tracks');
  if (!stage || !list) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var section = stage.closest('section');
  var after = section && section.nextElementSibling;

  function feature(id) { return stage.querySelector('.feature[data-project="' + id + '"]'); }
  function row(id) { return list.querySelector('li[data-project="' + id + '"]'); }
  function current() { return stage.querySelector('.feature:not([hidden])'); }

  function playVideo(article) {
    var v = article && article.querySelector('video');
    if (!v || reduceMotion.matches) return;
    v.preload = 'auto';
    v.autoplay = true;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  function stopVideo(article) {
    var v = article && article.querySelector('video');
    if (!v) return;
    v.autoplay = false;
    v.pause();
  }

  // Every row gets a stable key, so each one keeps its transition name as it moves.
  Array.prototype.forEach.call(list.children, function (li, i) {
    li.dataset.key = li.dataset.project || 'row' + i;
  });

  // 'project-' names are the two cards trading places (they crossfade);
  // 'slide-' names are rows that only move, so they stay solid.
  function name(el, key, prefix) {
    if (!el) return;
    el.style.viewTransitionName = key ? (prefix || 'project-') + key : '';
  }

  function show(id, fromKeyboard) {
    var cur = current();
    var next = feature(id);
    if (!cur || !next || cur === next) return;
    var curId = cur.dataset.project;
    var rowCur = row(curId);
    var rowNext = row(id);
    var others = Array.prototype.filter.call(list.children, function (li) {
      return !li.hidden && li !== rowNext;
    });

    function update() {
      // The outgoing card and the clicked row hand their names to the elements
      // that replace them: the row grows into the card, the card shrinks into a row.
      name(cur, null);
      name(rowNext, null);
      cur.hidden = true;
      next.hidden = false;
      if (rowNext) rowNext.hidden = true;
      if (rowCur) {
        // The project leaving the card goes to the back of the list, so the rows
        // after the clicked one each move up a place.
        list.appendChild(rowCur);
        rowCur.hidden = false;
      }
      name(next, id);
      name(rowCur, curId);
      stopVideo(cur);
      playVideo(next);
    }

    function finish() {
      [cur, next, rowCur, rowNext, after].concat(others).forEach(function (el) { name(el, null); });
      // Keyboard users land on the new card's heading so they can read on from there.
      var heading = next.querySelector('h3');
      if (heading && fromKeyboard) heading.focus({ preventScroll: true });
      var top = stage.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.4) {
        stage.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
    }

    if (document.startViewTransition && !reduceMotion.matches) {
      name(cur, curId);
      name(rowNext, id);
      others.forEach(function (li) { name(li, li.dataset.key, 'slide-'); });
      // The section below moves with the list instead of jumping when the card height changes.
      name(after, 'after', 'slide-');
      var t = document.startViewTransition(update);
      t.finished.then(finish, finish);
    } else {
      update();
      finish();
    }
  }

  // Rows that can be featured get a visible button and a clickable surface.
  list.querySelectorAll('li[data-project]').forEach(function (li) {
    var id = li.dataset.project;
    if (!feature(id)) return;
    li.classList.add('is-playable');
    var btn = li.querySelector('.play');
    if (btn) btn.hidden = false;
    li.addEventListener('click', function (e) {
      // Let real links (like the GitHub link) do their own thing.
      if (e.target.closest('a')) return;
      // A button activated with Enter or Space reports a click with detail 0.
      show(id, e.detail === 0);
    });
  });

  playVideo(current());
})();
