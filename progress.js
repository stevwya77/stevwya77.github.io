/* Now Recording: progress bars for things in progress.
 *
 * Two kinds of item:
 *   Timed (courses): give `start` and `end` (YYYY-MM-DD). The bar fills on
 *     its own from today's date, and `weeks` picks the current topic.
 *     A week entry can cover several weeks with `span`.
 *   Manual (projects): give `percent` (0-100) and an optional `note`
 *     instead of dates. Update the number whenever you make progress.
 *
 * Items show in the order listed here.
 */
var NOW_RECORDING = [
  {
    title: "CodePath AI 301",
    subtitle: "Open source capstone",
    url: "https://github.com/stevwya77/ai301-coursework-template",
    start: "2026-09-16",
    end: "2026-11-25",
    unit: "Week",
    weeks: [
      { topic: "Issue selection and an issue-selection skill", due: "Assignment 1" },
      { topic: "Claiming and reproducing an issue; a repro-check skill", due: "Assignment 2" },
      { topic: "Planning the fix and directing the build; a plan-check skill", due: "Assignment 3" },
      { topic: "Testing and submitting; the pr-precheck tool end to end", due: "Assignment 4" },
      { topic: "Into the wild: growing the skill into a GitHub-wide scout", due: "Assignment 5 (due week 9)" },
      { topic: "Working with maintainers: claim day, voice guard, repo memory", due: "Assignment 5 (due week 9)" },
      { topic: "Shipping it: the PR gate and the repo's checks", due: "Assignment 5 (due week 9)" },
      { topic: "Keeping it alive: review responses and a PR watcher", due: "Assignment 5 (due week 9)" },
      { topic: "Portfolio week", due: "Assignment 6" },
      { topic: "Demo Day presentations", due: "Demo Day" }
    ]
  },
  {
    title: "CodePath CYB101",
    subtitle: "Intro to cybersecurity",
    start: "2026-09-16",
    end: "2026-11-25",
    unit: "Unit",
    weeks: [
      { topic: "The cybersecurity mindset, CTFs, basic cryptography", due: "Project 1" },
      { topic: "Linux CLI, virtualization, SSH encryption", due: "Project 2" },
      { topic: "Password hashes, asymmetric encryption, data leaks", due: "Project 3" },
      { topic: "DNS exploits, networking protocols", due: "Project 4" },
      { topic: "Malware, virus detection, payloads", due: "Project 5" },
      { topic: "Data, metadata, steganography", due: "Project 6" },
      { topic: "Open-source intelligence, Shodan, CVEs", due: "Project 7" },
      { topic: "Capstone launch, social engineering, phishing", due: "Milestone 1" },
      { topic: "Capstone continued, anonymity, privacy", due: "Milestone 2" },
      { topic: "Demo Day presentations", due: "Demo Day and slides" }
    ]
  },
  {
    title: "ML Zoomcamp 2026",
    subtitle: "DataTalks.Club cohort",
    url: "https://github.com/stevwya77/ML_refresher",
    start: "2026-09-14",
    end: "2027-01-18",
    unit: "Week",
    weeks: [
      { topic: "Introduction to machine learning and prerequisites" },
      { topic: "Machine learning for regression" },
      { topic: "Machine learning for classification" },
      { topic: "Evaluation metrics for classification" },
      { topic: "Deploying machine learning models" },
      { topic: "Decision trees and ensemble learning" },
      { topic: "Midterm project", span: 3 },
      { topic: "Neural networks and deep learning" },
      { topic: "Serverless deep learning" },
      { topic: "Kubernetes and TensorFlow Serving" },
      { topic: "Capstone projects and peer reviews", span: 6 }
    ]
  }

  // Manual example (add a comma after the item above, then uncomment):
  // ,{
  //   title: "Game Boy emulator",
  //   subtitle: "Personal project",
  //   url: "https://github.com/stevwya77/...",
  //   percent: 40,
  //   note: "CPU instructions pass; working on the PPU"
  // }
];

(function () {
  var list = document.getElementById("now-list");
  if (!list) return;

  var DAY = 86400000;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function parse(d) { var p = d.split("-"); return new Date(+p[0], p[1] - 1, +p[2]); }
  function fmt(d) { return MONTHS[d.getMonth()] + " " + d.getDate(); }
  function esc(s) { var e = document.createElement("span"); e.textContent = s == null ? "" : s; return e.innerHTML; }
  function pad(n) { n = String(Math.floor(n)); return "000".slice(n.length) + n; }

  // Expand week entries with `span` into one entry per week.
  function weekList(item) {
    var out = [];
    (item.weeks || []).forEach(function (w) { for (var i = 0; i < (w.span || 1); i++) out.push(w); });
    return out;
  }

  // Work out percent and labels for an item as of `now`.
  function state(item, now) {
    if (item.start && item.end) {
      var start = parse(item.start), end = new Date(parse(item.end).getTime() + DAY); // end date counts as a full day
      var pct = Math.max(0, Math.min(100, (now - start) / (end - start) * 100));
      var weeks = weekList(item), total = weeks.length || Math.ceil((end - start) / DAY / 7);
      var week = Math.floor((now - start) / DAY / 7) + 1;
      var unit = item.unit || "Week", where, w;
      if (now < start) { where = "Starts " + fmt(start); week = 0; }
      else if (now >= end) { where = "Complete"; week = total; }
      else {
        week = Math.min(week, total);
        w = weeks[week - 1];
        where = unit + " " + week + " of " + total + (w && w.topic ? " · " + w.topic : "");
      }
      return { pct: pct, where: where, due: w && w.due, dates: fmt(start) + " – " + fmt(parse(item.end)), ticks: total, week: week };
    }
    return { pct: Math.max(0, Math.min(100, item.percent || 0)), where: item.note || "", ticks: 10 };
  }

  var now = new Date();
  list.innerHTML = NOW_RECORDING.map(function (item, i) {
    var s = state(item, now);
    var name = item.url
      ? '<a href="' + esc(item.url) + '">' + esc(item.title) + ' <span class="ext" aria-hidden="true">↗</span></a>'
      : esc(item.title);
    var sub = [item.subtitle, s.dates].filter(Boolean).map(esc).join(" · ");
    var shown = Math.floor(s.pct);
    var label = s.where === "Complete" ? "Complete" : shown + "% complete" + (s.where ? ", " + s.where : "");
    return '<li class="rec-item' + (s.pct >= 100 ? ' is-done' : '') + '">' +
      '<span class="code">R' + (i + 1) + '</span>' +
      '<div class="rec-body">' +
        '<div class="rec-head"><h3>' + name + '</h3>' +
        '<span class="counter" aria-hidden="true">' + pad(s.pct) + '<small>%</small></span></div>' +
        (sub ? '<p class="rec-sub">' + sub + '</p>' : '') +
        '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + shown + '" aria-valuetext="' + esc(label) + '" aria-label="' + esc(item.title) + ' progress" style="--ticks:' + s.ticks + '">' +
          '<span class="glow" style="--pct:' + s.pct.toFixed(2) + '%"></span>' +
          '<span class="fill" style="--pct:' + s.pct.toFixed(2) + '%"></span>' +
        '</div>' +
        '<p class="rec-now"><span>' + esc(s.where) + '</span>' + (s.due ? '<span class="due">Due: ' + esc(s.due) + '</span>' : '') + '</p>' +
      '</div></li>';
  }).join("");

  // Fill the bars from empty the first time the section scrolls into view.
  var section = list.closest("section");
  if ("IntersectionObserver" in window && section) {
    section.classList.add("rec-wait");
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { section.classList.remove("rec-wait"); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(section);
  }
})();
