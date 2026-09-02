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

  function getContext() {
    var r = parseRoute(window.location.hash);
    if (r.path === "/") return { level: "home", currentId: r.id };

    var m = /^\/sections\/([a-z0-9-]+)$/.exec(r.path);
    if (m && SECTIONS[m[1]]) return { level: "section", slug: m[1], currentId: r.id, currentPath: "sections/" + m[1] };

    var m2 = /^\/programming-fundamentals\/([a-z0-9_]+)$/.exec(r.path);
    if (m2) return { level: "section", slug: "programming-fundamentals", currentPath: "programming-fundamentals/" + m2[1] };

    return { level: "home", currentId: r.id };
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

  var root, hitZone, railEl, tickEl, wheelEl, panelEl, itemsEl, isTouch;
  var items = [];
  var itemNodes = [];
  var focusIndex = 0;
  var isOpen = false;
  var searchFocused = false;
  var pivotY = window.innerHeight / 2;

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

  function render() {
    panelEl.style.top = pivotY + "px";
    var n = itemNodes.length;

    itemNodes.forEach(function (node, i) {
      var delta = i - focusIndex;
      var y = delta * ROW_H;

      if (Math.abs(y) > VISIBLE_HALF) {
        node.style.opacity = "0";
        node.style.pointerEvents = "none";
        return;
      }

      var t = Math.abs(y) / VISIBLE_HALF;
      var curve = Math.cos(t * Math.PI / 2);
      var x = BULGE_MAX * curve;
      var isFocus = i === focusIndex;
      var labelWidth = LABEL_MIN + (LABEL_MAX - LABEL_MIN) * curve;

      node.style.transform = "translate(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px) translateY(-50%)";
      node.style.opacity = String(0.28 + curve * 0.72);
      node.style.pointerEvents = "auto";
      node.classList.toggle("wn-focus", isFocus);
      node._label.style.maxWidth = labelWidth.toFixed(0) + "px";
    });
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
      '<div id="wn-hitzone"><div id="wn-search-slot"></div></div>' +
      '<div id="wn-rail"><div id="wn-rail-tick"></div></div>' +
      '<div id="wn-wheel"><div id="wn-panel"><div id="wn-items"></div></div></div>';
    document.body.appendChild(root);

    hitZone = document.getElementById("wn-hitzone");
    railEl = document.getElementById("wn-rail");
    tickEl = document.getElementById("wn-rail-tick");
    wheelEl = document.getElementById("wn-wheel");
    panelEl = document.getElementById("wn-panel");
    itemsEl = document.getElementById("wn-items");

    isTouch = window.matchMedia && !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isTouch) root.classList.add("wn-touch");

    // Docsify's search plugin builds its own input + results DOM once and
    // normally mounts it inside .sidebar; reparent that same element (not
    // a copy) into the wheel so typing, results, and the plugin's own
    // event listeners keep working exactly as before, just relocated.
    var searchBox = document.querySelector(".search");
    if (searchBox) {
      searchBox.classList.add("wn-search");
      document.getElementById("wn-search-slot").appendChild(searchBox);

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
