(function () {
  "use strict";

  var HOME_ITEMS = [
    { title: "Introduction to Computer Science", weeks: "8-12w", anchor: "introduction-to-computer-science-8-12-weeks" },
    { title: "Programming Fundamentals", weeks: "4-6w", anchor: "programming-fundamentals-4-6-weeks" },
    { title: "Data Structures and Algorithms", weeks: "12-16w", anchor: "data-structures-and-algorithms-12-16-weeks" },
    { title: "Computer Architecture and Systems", weeks: "8-12w", anchor: "computer-architecture-and-systems-8-12-weeks" },
    { title: "Database Systems", weeks: "8-12w", anchor: "database-systems-8-12-weeks" },
    { title: "Web Development", weeks: "8-12w", anchor: "web-development-8-12-weeks" },
    { title: "Software Engineering", weeks: "8-12w", anchor: "software-engineering-8-12-weeks" },
    { title: "Artificial Intelligence and Machine Learning", weeks: "", anchor: "artificial-intelligence-and-machine-learning" },
    { title: "Computer Graphics and Visualization", weeks: "8-12w", anchor: "computer-graphics-and-visualization-8-12-weeks" },
    { title: "Human-Computer Interaction", weeks: "8-12w", anchor: "human-computer-interaction-8-12-weeks" },
    { title: "Cybersecurity", weeks: "8-12w", anchor: "cybersecurity-8-12-weeks" },
    { title: "Software Development Tools", weeks: "4-6w", anchor: "software-development-tools-4-6-weeks" },
    { title: "Mathematics for Computer Science", weeks: "8-12w", anchor: "mathematics-for-computer-science-8-12-weeks" },
    { title: "Ethics and Society in Computing", weeks: "8-12w", anchor: "ethics-and-society-in-computing-8-12-weeks" }
  ];

  var GENERIC_HEADINGS = [
    { title: "What to Expect", id: "what-to-expect" },
    { title: "What to Prepare", id: "what-to-prepare" },
    { title: "Resources", id: "resources" }
  ];

  var SECTIONS = {
    "introduction-to-computer-science": { title: "Introduction to Computer Science" },
    "programming-fundamentals": {
      title: "Programming Fundamentals",
      items: [
        { title: "What to Expect and Prepare", path: "sections/programming-fundamentals" },
        { title: "Introduction to Python", path: "programming-fundamentals/introduction_to_python" },
        { title: "Control Flow Statements", path: "programming-fundamentals/control_flow_statements" },
        { title: "Data Types and Structures", path: "programming-fundamentals/data_types_and_structures" },
        { title: "Functions and Modules", path: "programming-fundamentals/functions_and_modules" },
        { title: "Input and Output Operations", path: "programming-fundamentals/input_and_output_operations" },
        { title: "Debugging and Error Handling", path: "programming-fundamentals/debugging_and_error_handling" },
        { title: "Object-Oriented Programming", path: "programming-fundamentals/object_oriented_programming" }
      ]
    },
    "data-structures-and-algorithms": { title: "Data Structures and Algorithms" },
    "computer-architecture-and-systems": { title: "Computer Architecture and Systems" },
    "database-systems": { title: "Database Systems" },
    "web-development": { title: "Web Development" },
    "software-engineering": { title: "Software Engineering" },
    "artificial-intelligence-and-machine-learning": { title: "Artificial Intelligence and Machine Learning" },
    "computer-graphics-and-visualization": { title: "Computer Graphics and Visualization" },
    "human-computer-interaction": { title: "Human-Computer Interaction" },
    "cybersecurity": { title: "Cybersecurity" },
    "software-development-tools": { title: "Software Development Tools" },
    "mathematics-for-computer-science": { title: "Mathematics for Computer Science" },
    "ethics-and-society-in-computing": { title: "Ethics and Society in Computing" }
  };

  var ROW_H = 42;
  var VISIBLE_HALF = 220;
  var BULGE_MAX = 52;
  var LABEL_MIN = 110;
  var LABEL_MAX = 250;
  var VMARGIN = 30;
  var PROXIMITY = 160;

  function parseRoute(hash) {
    hash = (hash || "#/").replace(/^#/, "");
    var qIndex = hash.indexOf("?");
    var path = qIndex >= 0 ? hash.slice(0, qIndex) : hash;
    var query = qIndex >= 0 ? hash.slice(qIndex + 1) : "";
    var m = /(?:^|&)id=([^&]*)/.exec(query);
    var id = m ? decodeURIComponent(m[1]) : null;
    path = path.replace(/\/+$/, "");
    if (path === "") path = "/";
    return { path: path, id: id };
  }

  // Accepts an explicit hash so it can also resolve arbitrary hrefs (see
  // resolveResultLabel below), not just the current route.
  function getContext(hash) {
    var r = parseRoute(hash || window.location.hash);
    if (r.path === "/") return { level: "home", currentId: r.id };

    var m = /^\/sections\/([a-z0-9-]+)$/.exec(r.path);
    if (m && SECTIONS[m[1]]) return { level: "section", slug: m[1], currentId: r.id, currentPath: "sections/" + m[1] };

    var m2 = /^\/programming-fundamentals\/([a-z0-9_]+)$/.exec(r.path);
    if (m2) return { level: "section", slug: "programming-fundamentals", currentPath: "programming-fundamentals/" + m2[1] };

    return { level: "home", currentId: r.id };
  }

  // Search results only show the matched heading itself (e.g. "Resources"
  // or "What to Prepare"), and most sections share those same heading
  // names - so on their own, a results list is a wall of identical-
  // looking rows with no way to tell them apart. This resolves which
  // section/page a result's href actually belongs to, reusing the exact
  // same routing logic the wheel itself uses to know where it is.
  function resolveResultLabel(href) {
    var ctx = getContext(href);
    if (ctx.level === "home") {
      var home = HOME_ITEMS.find(function (s) { return s.anchor === ctx.currentId; });
      return home ? home.title : "Table of Contents";
    }
    var section = SECTIONS[ctx.slug];
    if (section.items) {
      // Programming Fundamentals' own item list includes an entry for
      // its overview page itself ("What to Expect and Prepare") so the
      // wheel can link back to it - but that entry's title isn't a
      // section name, it's a page name that happens to repeat the very
      // heading names ("What to Expect", "What to Prepare") it would be
      // labeling. A result on that overview page should read as
      // "Programming Fundamentals", the same as any other section's.
      var found = section.items.find(function (it) {
        return it.path === ctx.currentPath && it.path !== "sections/" + ctx.slug;
      });
      if (found) return found.title;
    }
    return section.title;
  }

  function buildItems(ctx) {
    if (ctx.level === "home") {
      return HOME_ITEMS.map(function (s) {
        return { title: s.title, weeks: s.weeks, href: "#/?id=" + s.anchor, active: s.anchor === ctx.currentId };
      });
    }

    var section = SECTIONS[ctx.slug];
    var list = [{ title: "← All Sections", weeks: "", href: "#/?id=table-of-contents", active: false, isBack: true }];

    if (section.items) {
      section.items.forEach(function (it) {
        list.push({ title: it.title, weeks: "", href: "#/" + it.path, active: it.path === ctx.currentPath });
      });
    } else {
      GENERIC_HEADINGS.forEach(function (h) {
        list.push({ title: h.title, weeks: "", href: "#/sections/" + ctx.slug + "?id=" + h.id, active: h.id === ctx.currentId });
      });
    }
    return list;
  }

  // ---------------------------------------------------------------- DOM
  //
  // Docsify fetches and renders the current page's markdown asynchronously,
  // and that first render replaces the app container's contents wholesale.
  // Appending our own DOM eagerly at script-parse time races that render
  // and reliably loses - so nothing here runs until Docsify's own
  // `doneEach` lifecycle hook says a render has actually completed.

  var root, hitZone, railEl, tickEl, wheelEl, panelEl, itemsEl, searchSlot, isTouch;
  var items = [];
  var itemNodes = [];
  var focusIndex = 0;
  var isOpen = false;
  var searchFocused = false;
  var pivotY = window.innerHeight / 2;

  // Positions one row (a regular item, or the pinned search row) along the
  // same curve as everything else in the wheel, `delta` rows from focus.
  // Regular items use `transform` (cheaper to animate); passing a row's
  // own half-height instead positions it with left/top (see
  // #wn-search-slot in wheel-nav.css for why the search row needs that).
  function positionRow(el, delta, labelEl, halfHeight) {
    var y = delta * ROW_H;

    if (Math.abs(y) > VISIBLE_HALF) {
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      return;
    }

    var t = Math.abs(y) / VISIBLE_HALF;
    var curve = Math.cos(t * Math.PI / 2);
    var x = BULGE_MAX * curve;

    if (halfHeight) {
      el.style.left = x.toFixed(1) + "px";
      el.style.top = "calc(50% - " + halfHeight.toFixed(1) + "px + " + y.toFixed(1) + "px)";
    } else {
      el.style.transform = "translate(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px) translateY(-50%)";
    }
    el.style.opacity = String(0.28 + curve * 0.72);
    el.style.pointerEvents = "auto";
    if (labelEl) labelEl.style.maxWidth = (LABEL_MIN + (LABEL_MAX - LABEL_MIN) * curve).toFixed(0) + "px";
  }

  function renderItemList() {
    itemsEl.innerHTML = "";
    itemNodes = items.map(function (it) {
      var wrap = document.createElement("div");
      wrap.className = "wn-item" + (it.isBack ? " wn-back" : "");

      var a = document.createElement("a");
      a.href = it.href;
      a.title = it.title;
      a.textContent = it.title;
      if (it.weeks) {
        var w = document.createElement("span");
        w.className = "wn-weeks";
        w.textContent = it.weeks;
        a.appendChild(w);
      }
      a.addEventListener("click", function () {
        close();
      });

      wrap.appendChild(a);
      wrap._label = a;
      itemsEl.appendChild(wrap);
      return wrap;
    });
  }

  function refreshContext() {
    var ctx = getContext();
    items = buildItems(ctx);
    renderItemList();
    var activeIdx = items.findIndex(function (it) { return it.active; });
    focusIndex = activeIdx >= 0 ? activeIdx : (ctx.level === "section" ? 1 : 0);
    focusIndex = Math.max(0, Math.min(items.length - 1, focusIndex));
    render();
  }

  function railBounds() {
    return { top: VMARGIN, bottom: window.innerHeight - VMARGIN };
  }

  function clampPivot(y) {
    var b = railBounds();
    var min = b.top + 24;
    var max = b.bottom - 24;
    if (max < min) return (min + max) / 2;
    return Math.max(min, Math.min(max, y));
  }

  // Labels each result with the section/page it belongs to (see
  // resolveResultLabel), since Docsify only shows the matched heading
  // itself and most of ours repeat the same few names across sections.
  // Docsify rebuilds these nodes from scratch on every keystroke, so
  // this just re-runs each time rather than trying to diff them.
  function annotateResults() {
    var posts = document.querySelectorAll(".wn-search .matching-post");
    posts.forEach(function (post) {
      if (post._wnLabeled) return;
      post._wnLabeled = true;
      var a = post.querySelector("a[href]");
      var h2 = post.querySelector("h2");
      if (!a || !h2) return;
      var label = resolveResultLabel(a.getAttribute("href"));
      if (!label) return;
      var tag = document.createElement("div");
      tag.className = "wn-result-section";
      tag.textContent = label;
      // h2 lives inside the <a>, not as a direct child of .matching-post -
      // insertBefore needs a direct child as its reference node
      post.insertBefore(tag, a);
    });
  }

  // Pins the search results panel to whichever side of the search field
  // actually has room, and clamps its position and height to the
  // viewport, so it's never cut off at a screen edge or hidden behind
  // the rest of the wheel regardless of where the cursor opened it.
  //
  // It stays exactly where Docsify put it in the DOM - moving it out
  // from under .wn-search sounds appealing (position: fixed would then
  // mean the actual viewport, since #wn-panel's own open/close transform
  // currently hijacks that as the containing block instead) but Docsify
  // keeps its own reference to this element and broke on the very next
  // keystroke once it was no longer where it expected. So: leave it in
  // place, keep it position: absolute, and instead convert our desired
  // viewport coordinates into coordinates relative to whatever its real
  // containing block turns out to be, via offsetParent - which, unlike
  // position: fixed, keeps working correctly under a transform.
  function positionResultsPanel() {
    var panel = document.querySelector(".wn-search .results-panel");
    var inputWrap = document.querySelector(".wn-search .input-wrap");
    if (!panel || !inputWrap || !panel.classList.contains("show")) return;

    annotateResults();

    var MARGIN = 12;
    var GAP = 10;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var iw = inputWrap.getBoundingClientRect();

    var panelWidth = Math.min(300, vw - MARGIN * 2);
    panel.style.width = panelWidth + "px";

    var left, top, maxHeight;
    var roomRight = vw - iw.right - GAP - MARGIN;

    if (roomRight >= panelWidth) {
      // plenty of room beside the field: pin to its right, top-aligned,
      // then slide up if needed so the bottom doesn't run off-screen
      left = iw.right + GAP;
      var naturalTop = iw.top;
      top = Math.max(MARGIN, Math.min(naturalTop, vh - MARGIN - 120));
      maxHeight = vh - top - MARGIN;
    } else {
      // not enough width beside it (narrow window / mobile): stack it
      // above or below instead, whichever side has more room
      left = Math.max(MARGIN, Math.min(iw.left, vw - panelWidth - MARGIN));
      var roomBelow = vh - iw.bottom - GAP - MARGIN;
      var roomAbove = iw.top - GAP - MARGIN;
      if (roomBelow >= 120 || roomBelow >= roomAbove) {
        top = iw.bottom + GAP;
        maxHeight = Math.max(120, vh - top - MARGIN);
      } else {
        maxHeight = Math.max(120, roomAbove);
        top = iw.top - GAP - maxHeight;
      }
    }

    var parent = panel.offsetParent || document.body;
    var pr = parent.getBoundingClientRect();

    panel.style.left = (left - pr.left).toFixed(0) + "px";
    panel.style.top = (top - pr.top).toFixed(0) + "px";
    panel.style.maxHeight = maxHeight.toFixed(0) + "px";
  }

  function render() {
    panelEl.style.top = pivotY + "px";

    // the search row is pinned one row above wherever "← All Sections"
    // (item 0) currently sits, so it scrolls with the wheel exactly like
    // any other row instead of floating separately over it. Measured
    // fresh each time rather than assuming a fixed height, so it stays
    // correctly centered even if the field's rendered size ever shifts.
    if (searchSlot) positionRow(searchSlot, -1 - focusIndex, null, searchSlot.offsetHeight / 2);

    itemNodes.forEach(function (node, i) {
      positionRow(node, i - focusIndex, node._label);
      node.classList.toggle("wn-focus", i === focusIndex);
    });

    positionResultsPanel();
  }

  function open(y) {
    if (!isOpen) {
      isOpen = true;
      root.classList.add("wn-open");
    }
    if (typeof y === "number") pivotY = clampPivot(y);
    var b = railBounds();
    var t = (pivotY - b.top) / (b.bottom - b.top);
    tickEl.style.top = (t * 100) + "%";
    render();
  }

  function close() {
    if (!isOpen || searchFocused) return;
    isOpen = false;
    root.classList.remove("wn-open");
  }

  function toggle(y) {
    if (isOpen) close();
    else open(y);
  }

  function stepFocus(dir) {
    focusIndex = Math.max(0, Math.min(itemNodes.length - 1, focusIndex + dir));
    render();
  }

  function init() {
    root = document.createElement("div");
    root.id = "wheel-nav";
    root.innerHTML =
      '<div id="wn-hitzone"></div>' +
      '<div id="wn-rail"><div id="wn-rail-tick"></div></div>' +
      '<div id="wn-wheel"><div id="wn-panel"><div id="wn-search-slot"></div><div id="wn-items"></div></div></div>';
    document.body.appendChild(root);

    hitZone = document.getElementById("wn-hitzone");
    railEl = document.getElementById("wn-rail");
    tickEl = document.getElementById("wn-rail-tick");
    wheelEl = document.getElementById("wn-wheel");
    panelEl = document.getElementById("wn-panel");
    itemsEl = document.getElementById("wn-items");
    searchSlot = document.getElementById("wn-search-slot");

    isTouch = window.matchMedia && !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isTouch) root.classList.add("wn-touch");

    // Docsify's search plugin builds its own input + results DOM once and
    // normally mounts it inside .sidebar; reparent that same element (not
    // a copy) into the wheel so typing, results, and the plugin's own
    // event listeners keep working exactly as before, just relocated. It
    // lives in its own row (searchSlot), positioned every render() call
    // right alongside the regular items so it rides the same curve rather
    // than sitting fixed on top of them.
    var searchBox = document.querySelector(".search");
    if (searchBox) {
      searchBox.classList.add("wn-search");
      searchSlot.appendChild(searchBox);

      var searchInput = searchBox.querySelector("input");
      if (searchInput) {
        searchInput.addEventListener("focus", function () {
          searchFocused = true;
          open(pivotY);
        });
        searchInput.addEventListener("blur", function () {
          searchFocused = false;
        });
      }

      // Docsify rewrites the results list (and toggles its "show" class)
      // on every keystroke; reposition whenever that happens rather than
      // only on our own events, so we never miss an update regardless of
      // how the plugin triggers it internally.
      // Observe the stable outer box rather than .results-panel itself -
      // some Docsify search plugin versions tear it down and rebuild it
      // from scratch on every keystroke rather than mutating it in place,
      // which would silently detach an observer attached directly to it.
      if (window.MutationObserver) {
        new MutationObserver(positionResultsPanel).observe(searchBox, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class"]
        });
      }
    }

  // ------------------------------------------------------- desktop input

  if (!isTouch) {
    hitZone.addEventListener("mousemove", function (e) { open(e.clientY); });

    hitZone.addEventListener("mouseleave", function (e) {
      var to = e.relatedTarget;
      if (to && panelEl.contains(to)) return;
      close();
    });

    panelEl.addEventListener("mouseleave", function (e) {
      var to = e.relatedTarget;
      if (to && hitZone.contains(to)) return;
      close();
    });

    function handleWheel(e) {
      if (!isOpen) return;
      // let the results panel scroll its own (possibly long) list
      // natively instead of cycling the wheel's focus underneath it
      var results = document.querySelector(".results-panel.show");
      if (results && results.contains(e.target)) return;
      e.preventDefault();
      stepFocus(e.deltaY > 0 ? 1 : -1);
    }
    hitZone.addEventListener("wheel", handleWheel, { passive: false });
    panelEl.addEventListener("wheel", handleWheel, { passive: false });
  }

  // -------------------------------------------------------- touch input

  if (isTouch) {
    railEl.addEventListener("click", function () {
      toggle(pivotY);
    });

    document.addEventListener("click", function (e) {
      if (!isOpen) return;
      if (root.contains(e.target)) return;
      close();
    });

    var dragStartY = null;
    var dragAccum = 0;
    var DRAG_STEP = 34;

    panelEl.addEventListener("touchstart", function (e) {
      dragStartY = e.touches[0].clientY;
      dragAccum = 0;
    }, { passive: true });

    panelEl.addEventListener("touchmove", function (e) {
      if (dragStartY === null) return;
      var y = e.touches[0].clientY;
      var delta = y - dragStartY;
      dragStartY = y;
      dragAccum += delta;
      while (Math.abs(dragAccum) >= DRAG_STEP) {
        stepFocus(dragAccum > 0 ? -1 : 1);
        dragAccum += dragAccum > 0 ? -DRAG_STEP : DRAG_STEP;
      }
      e.preventDefault();
    }, { passive: false });

    panelEl.addEventListener("touchend", function () {
      dragStartY = null;
    });
  }

  window.addEventListener("resize", function () {
    pivotY = clampPivot(pivotY);
    if (isOpen) render();
  });

  // in-page anchor moves (e.g. jumping between headings on the same
  // section page) don't trigger a Docsify re-render, so a plain hashchange
  // listener catches those; actual page navigations are handled below via
  // Docsify's own `doneEach` hook, which is also what's safe to build our
  // DOM inside the first time around
  window.addEventListener("hashchange", function () {
    close();
    if (root) refreshContext();
  });
  }

  // ------------------------------------------------------------ routing

  var initialized = false;

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.doneEach(function () {
      if (!initialized) {
        initialized = true;
        init();
      }
      refreshContext();
    });
  });
})();
