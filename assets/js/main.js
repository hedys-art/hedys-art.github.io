/* Hedy's Atelier 홈페이지 — 화면 그리기
   내용은 content/*.json에 있고(Pages CMS로 편집), 이 파일은 그것을 읽어 화면을 만든다.
   main.js나 style.css를 고치면 HTML 5개의 ?v= 값을 함께 바꾼다(브라우저 캐시). */
(function () {
  "use strict";

  var PAGE = document.body.getAttribute("data-page") || "home";
  var NAV = [
    { id: "home", href: "/", label: "홈" },
    { id: "works", href: "/works.html", label: "작품" },
    { id: "about", href: "/about.html", label: "작가 소개" },
    { id: "exhibitions", href: "/exhibitions.html", label: "전시·소식" },
    { id: "class", href: "/class.html", label: "수업·체험" }
  ];

  function load(name) {
    return fetch("/content/" + name + ".json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(name + ".json " + r.status);
      return r.json();
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content;
  }

  function fmtDate(d) {
    if (!d) return "";
    var p = String(d).slice(0, 10).split("-");
    return p.length === 3 ? p[0] + ". " + (+p[1]) + ". " + (+p[2]) + "." : esc(d);
  }

  function period(a, b) {
    if (!a) return "";
    if (!b || b === a) return fmtDate(a);
    var pa = a.split("-"), pb = b.split("-");
    var tail = pa[0] === pb[0] ? (+pb[1]) + ". " + (+pb[2]) + "." : fmtDate(b);
    return fmtDate(a) + " – " + tail;
  }

  function caption(w) {
    var parts = ["〈" + esc(w.title) + "〉"];
    if (w.year) parts.push(esc(w.year));
    if (w.medium) parts.push(esc(w.medium));
    if (w.size) parts.push(esc(w.size));
    return parts.join(", ");
  }

  /* ---------- 머리말·꼬리말 ---------- */
  function header(site) {
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.id === PAGE ? ' class="active" aria-current="page"' : "") + ">" + n.label + "</a>";
    }).join("");
    document.getElementById("site-header").appendChild(el(
      '<div class="wrap header-inner">' +
        '<a class="brand" href="/"><span class="brand-name">' + esc(site.brand || site.name) + '</span>' +
        '<span class="brand-sub">' + esc(site.tagline) + "</span></a>" +
        '<button class="nav-toggle" aria-label="메뉴 열기" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '<nav class="site-nav">' + links + "</nav>" +
      "</div>"
    ));
    var btn = document.querySelector(".nav-toggle"), nav = document.querySelector(".site-nav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function contactLinks(site) {
    var out = [];
    if (site.instagram) out.push('<a href="' + esc(site.instagram) + '" target="_blank" rel="noopener">Instagram</a>');
    if (site.blog) out.push('<a href="' + esc(site.blog) + '" target="_blank" rel="noopener">Blog</a>');
    if (site.email) out.push('<a href="mailto:' + esc(site.email) + '">' + esc(site.email) + "</a>");
    return out;
  }

  function footer(site) {
    var c = contactLinks(site);
    document.getElementById("site-footer").appendChild(el(
      '<div class="wrap footer-inner">' +
        '<div><div class="footer-name">' + esc(site.brand || site.name) + "</div>" +
        '<div class="muted">' + esc(site.tagline) + " · " + esc(site.location) + "</div></div>" +
        '<div class="footer-right">' + (c.length ? c.join(" · ") : '<span class="muted">' + esc(site.contact_note) + "</span>") +
        '<div class="muted small">' + esc(site.footer) + "</div></div>" +
      "</div>"
    ));
  }

  /* ---------- 사진 크게 보기 ---------- */
  var LB = null;
  function lightbox(list, i) {
    if (!LB) {
      LB = document.createElement("div");
      LB.className = "lightbox";
      LB.innerHTML = '<button class="lb-close" aria-label="닫기">×</button>' +
        '<button class="lb-prev" aria-label="이전">‹</button><figure><img alt=""><figcaption></figcaption></figure>' +
        '<button class="lb-next" aria-label="다음">›</button>';
      document.body.appendChild(LB);
      LB.addEventListener("click", function (e) { if (e.target === LB || e.target.classList.contains("lb-close")) close(); });
      LB.querySelector(".lb-prev").addEventListener("click", function () { show(LB._i - 1); });
      LB.querySelector(".lb-next").addEventListener("click", function () { show(LB._i + 1); });
      document.addEventListener("keydown", function (e) {
        if (!LB.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(LB._i - 1);
        if (e.key === "ArrowRight") show(LB._i + 1);
      });
    }
    function show(k) {
      var n = LB._list.length;
      LB._i = (k + n) % n;
      var it = LB._list[LB._i];
      LB.querySelector("img").src = it.src;
      LB.querySelector("img").alt = it.alt || "";
      LB.querySelector("figcaption").innerHTML = it.cap || "";
      LB.querySelector(".lb-prev").style.display = LB.querySelector(".lb-next").style.display = n > 1 ? "" : "none";
    }
    function close() { LB.classList.remove("open"); document.body.classList.remove("noscroll"); }
    LB._list = list;
    show(i);
    LB.classList.add("open");
    document.body.classList.add("noscroll");
  }

  function workImages(w) {
    return [w.image].concat(w.images || []).filter(Boolean).map(function (src) {
      return { src: src, alt: w.title, cap: caption(w) };
    });
  }

  function workCard(w) {
    var more = (w.images || []).length;
    return '<figure class="work-card" data-id="' + esc(w.id) + '">' +
      '<button class="work-thumb" aria-label="' + esc(w.title) + ' 크게 보기"><img loading="lazy" src="' + esc(w.image) + '" alt="' + esc(w.title) + '">' +
      (more ? '<span class="badge">+' + more + "</span>" : "") + "</button>" +
      '<figcaption><span class="work-title">' + esc(w.title) + "</span>" +
      '<span class="work-meta">' + [w.year, w.size].filter(Boolean).map(esc).join(" · ") + "</span></figcaption></figure>";
  }

  function bindCards(root, works) {
    root.querySelectorAll(".work-card").forEach(function (card) {
      card.querySelector(".work-thumb").addEventListener("click", function () {
        var w = works.filter(function (x) { return x.id === card.getAttribute("data-id"); })[0];
        if (w) lightbox(workImages(w), 0);
      });
    });
  }

  function sortWorks(list) {
    return list.slice().sort(function (a, b) { return String(b.year || "0").localeCompare(String(a.year || "0")); });
  }

  /* ---------- 쪽마다 ---------- */
  function pageHome(app, site, data) {
    var works = data.works.works, feat = sortWorks(works.filter(function (w) { return w.featured; }));
    var news = (data.news || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).slice(0, 3);
    var ex = data.exhibitions.exhibitions.slice().sort(function (a, b) { return String(b.start).localeCompare(String(a.start)); }).slice(0, 4);
    app.appendChild(el(
      '<section class="hero"><div class="wrap hero-inner">' +
        '<div class="hero-text"><p class="eyebrow">' + esc(site.tagline) + "</p>" +
        "<h1>" + esc(site.hero_title) + "</h1><p class=\"lead\">" + esc(site.hero_text) + "</p>" +
        '<p class="hero-links"><a class="btn" href="/works.html">작품 보기</a><a class="btn ghost" href="/about.html">작가 소개</a></p></div>' +
        '<figure class="hero-figure"><img src="' + esc(site.hero_image) + '" alt="' + esc(site.hero_title) + '">' +
        "<figcaption>" + esc(site.hero_caption) + "</figcaption></figure>" +
      "</div></section>" +
      '<section class="wrap section"><div class="section-head"><h2>대표 작품</h2><a href="/works.html">전체 작품 →</a></div>' +
        '<div class="work-grid">' + feat.map(workCard).join("") + "</div></section>" +
      '<section class="wrap section two-col">' +
        '<div><div class="section-head"><h2>전시</h2><a href="/exhibitions.html">전체 →</a></div><ul class="ex-list compact">' +
          ex.map(exItem).join("") + "</ul></div>" +
        '<div><div class="section-head"><h2>소식</h2><a href="/exhibitions.html#news">전체 →</a></div><ul class="news-list compact">' +
          news.map(function (n) { return '<li><a href="/exhibitions.html#' + esc(n.id) + '"><span class="date">' + fmtDate(n.date) + "</span>" + esc(n.title) + "</a></li>"; }).join("") +
        "</ul></div></section>"
    ));
    bindCards(app, works);
  }

  function pageWorks(app, site, data) {
    var cats = data.works.categories, works = sortWorks(data.works.works);
    app.appendChild(el(
      '<section class="wrap section"><h1 class="page-title">작품</h1>' +
        '<div class="filters" role="tablist"><button class="on" data-cat="">전체</button>' +
          cats.map(function (c) { return '<button data-cat="' + esc(c.id) + '">' + esc(c.label) + "</button>"; }).join("") + "</div>" +
        '<div class="work-grid" id="grid"></div></section>'
    ));
    var grid = document.getElementById("grid");
    function draw(cat) {
      var list = works.filter(function (w) { return !cat || w.category === cat; });
      grid.innerHTML = list.map(workCard).join("") || '<p class="muted">아직 올린 작품이 없습니다.</p>';
      bindCards(grid, works);
    }
    app.querySelectorAll(".filters button").forEach(function (b) {
      b.addEventListener("click", function () {
        app.querySelectorAll(".filters button").forEach(function (x) { x.classList.toggle("on", x === b); });
        draw(b.getAttribute("data-cat"));
      });
    });
    draw("");
  }

  function pageAbout(app, site, data) {
    var a = data.about;
    app.appendChild(el(
      '<section class="wrap section narrow"><h1 class="page-title">작가 소개</h1>' +
        '<div class="about-head">' + (a.photo ? '<img class="about-photo" src="' + esc(a.photo) + '" alt="' + esc(site.name) + '">' : "") +
        '<div><div class="about-name">작가 ' + esc(site.name) + (site.name_en ? " <span>" + esc(site.name_en) + "</span>" : "") + "</div>" +
        '<div class="rich">' + (a.intro || "") + "</div></div></div></section>" +
      '<section class="wrap section narrow"><h2>' + esc(a.statement_title) + '</h2><div class="rich statement">' + (a.statement || "") + "</div></section>" +
      '<section class="wrap section narrow"><h2>' + esc(a.process_title) + '</h2><ol class="process">' +
        (a.process || []).map(function (p) { return "<li><strong>" + esc(p.title) + "</strong><span>" + esc(p.text) + "</span></li>"; }).join("") +
      "</ol></section>" +
      '<section class="wrap section narrow"><h2>약력</h2>' +
        (a.cv || []).map(function (s) {
          return '<div class="cv-block"><h3>' + esc(s.section) + '</h3><ul class="cv">' +
            (s.items || []).map(function (it) { return '<li><span class="cv-year">' + esc(it.year) + "</span><span>" + esc(it.text) + "</span></li>"; }).join("") +
            "</ul></div>";
        }).join("") +
      "</section>"
    ));
  }

  var KIND = { solo: "개인전", group: "단체전", fair: "아트페어", etc: "전시" };
  function exItem(e) {
    return '<li id="' + esc(e.id) + '"><span class="date">' + period(e.start, e.end) + "</span>" +
      '<span class="ex-body"><span class="tag">' + (KIND[e.kind] || "전시") + "</span> " + esc(e.title) +
      '<span class="venue">' + esc(e.venue) + "</span></span></li>";
  }

  function pageExhibitions(app, site, data) {
    var ex = data.exhibitions.exhibitions.slice().sort(function (a, b) { return String(b.start).localeCompare(String(a.start)); });
    var news = (data.news || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    app.appendChild(el(
      '<section class="wrap section" id="news"><h1 class="page-title">전시·소식</h1><h2>소식</h2>' +
        '<div class="news-cards">' + news.map(function (n) {
          return '<article class="news-card" id="' + esc(n.id) + '">' + (n.image ? '<img loading="lazy" src="' + esc(n.image) + '" alt="">' : "") +
            '<div><div class="date">' + fmtDate(n.date) + "</div><h3>" + esc(n.title) + "</h3>" +
            (n.summary ? '<p class="muted">' + esc(n.summary) + "</p>" : "") + '<div class="rich">' + (n.body || "") + "</div></div></article>";
        }).join("") + "</div></section>" +
      '<section class="wrap section"><h2>전시</h2><div class="ex-cards">' + ex.map(function (e) {
          return '<article class="ex-card" id="' + esc(e.id) + '">' +
            (e.image ? '<img loading="lazy" src="' + esc(e.image) + '" alt="">' : '<div class="ex-noimg">' + (KIND[e.kind] || "전시") + "</div>") +
            '<div><div class="date">' + period(e.start, e.end) + ' · <span class="tag">' + (KIND[e.kind] || "전시") + "</span></div>" +
            "<h3>" + esc(e.title) + '</h3><div class="venue">' + esc(e.venue) + "</div>" +
            (e.text ? '<p class="muted">' + esc(e.text) + "</p>" : "") + "</div></article>";
        }).join("") + "</div></section>"
    ));
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }

  function pageClass(app, site, data) {
    var c = data.class, links = contactLinks(site);
    app.appendChild(el(
      '<section class="wrap section narrow"><h1 class="page-title">수업·체험</h1><div class="rich lead-rich">' + (c.intro || "") + "</div></section>" +
      '<section class="wrap section"><div class="program-grid">' + (c.programs || []).map(function (p) {
          return '<article class="program">' + (p.image ? '<img loading="lazy" src="' + esc(p.image) + '" alt="">' : "") +
            "<h3>" + esc(p.title) + '</h3><div class="who">' + esc(p.who) + "</div><p>" + esc(p.text) + "</p></article>";
        }).join("") + "</div></section>" +
      '<section class="wrap section narrow"><h2>진행 순서</h2><ol class="process">' +
        (c.steps || []).map(function (s, i) { return "<li><strong>" + (i + 1) + "</strong><span>" + esc(s) + "</span></li>"; }).join("") +
      "</ol></section>" +
      '<section class="wrap section narrow"><div class="contact-box"><h2>문의</h2><p>' + esc(c.note) + "</p>" +
        "<p>" + (links.length ? links.join(" · ") : '<span class="muted">' + esc(site.contact_note) + "</span>") + "</p></div></section>"
    ));
  }

  /* ---------- 시작 ---------- */
  var NEED = { home: ["works", "exhibitions", "news"], works: ["works"], about: ["about"], exhibitions: ["exhibitions", "news"], class: ["class"] };
  var names = ["site"].concat(NEED[PAGE] || []);
  Promise.all(names.map(load)).then(function (arr) {
    var data = {};
    names.forEach(function (n, i) { data[n] = arr[i]; });
    header(data.site);
    footer(data.site);
    var app = document.getElementById("app");
    ({ home: pageHome, works: pageWorks, about: pageAbout, exhibitions: pageExhibitions, class: pageClass }[PAGE] || pageHome)(app, data.site, data);
  }).catch(function (e) {
    document.getElementById("app").innerHTML = '<p style="padding:40px">내용을 불러오지 못했습니다. (' + esc(e.message) + ")</p>";
  });
})();
