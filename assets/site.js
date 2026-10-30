/* Restaurar Fotos · comportamento do site (sem bibliotecas) */
(function () {
  'use strict';
  var C = window.SITE || {}, L = window.LANG || 'pt', ROOT = window.ROOT || '';
  var D = document, $ = function (s, r) { return (r || D).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };
  var clamp = function (x, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.min(b, Math.max(a, x)); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var desk = function () { return innerWidth >= 900; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var t = function (v) { return v == null ? '' : (typeof v === 'object' && !Array.isArray(v)) ? (v[L] != null ? v[L] : v.pt) : v; };
  var url = function (p) { return !p || /^(https?:|data:|\/)/.test(p) ? p : ROOT + p; };
  var LOC = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }[L];
  var CUR = L === 'pt' ? { k: 'brl', s: 'R$' } : { k: 'usd', s: 'US$' };
  var money = function (o) { var n = o && typeof o === 'object' ? o[CUR.k] : o; return typeof n === 'number' ? n.toLocaleString(LOC) : n; };
  var UI = {
    pt: { orc: 'Pedir orçamento', esc: 'Escolher', mais: 'Mais pedido para presente', quero: 'Quero o pacote', de: 'de', prod: 'Vídeo em produção', original: 'foto original', video: 'vídeo', antes: 'antes', depois: 'depois', arraste: 'Arraste', wa: 'WhatsApp', alt: 'antes e depois da restauração', memo: 'Foto antiga transformada em vídeo', depo: 'Depoimento de cliente', msgP: 'Olá! Quero a restauração ', msgH: 'Olá! Quero o ' },
    en: { orc: 'Get a quote', esc: 'Choose', mais: 'Most popular gift', quero: 'I want this package', de: 'was', prod: 'Video in production', original: 'original photo', video: 'video', antes: 'before', depois: 'after', arraste: 'Drag', wa: 'WhatsApp', alt: 'before and after restoration', memo: 'Old photo turned into a video', depo: 'Client testimonial', msgP: 'Hi! I would like the restoration level: ', msgH: 'Hi! I would like the ' },
    es: { orc: 'Pedir presupuesto', esc: 'Elegir', mais: 'El más pedido para regalar', quero: 'Quiero el paquete', de: 'antes', prod: 'Video en producción', original: 'foto original', video: 'video', antes: 'antes', depois: 'después', arraste: 'Arrastra', wa: 'WhatsApp', alt: 'antes y después de la restauración', memo: 'Foto antigua convertida en video', depo: 'Testimonio de cliente', msgP: '¡Hola! Quiero la restauración ', msgH: '¡Hola! Quiero el ' }
  }[L];
  var ARROW = '<svg class="ico ico--s" aria-hidden="true"><use href="#i-arrow"/></svg>';
  var WAICO = '<svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg>';

  /* ---------- contatos ---------- */
  var num = String(C.whatsapp || '').replace(/\D/g, '');
  var wa = function (msg) { return 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg || t(C.mensagem) || ''); };
  var ig = String(C.instagram || '').replace(/^@/, '');
  function bindLinks(root) {
    $$('[data-wa]', root).forEach(function (a) { a.href = wa(a.getAttribute('data-wa')); a.target = '_blank'; a.rel = 'noopener'; });
  }
  bindLinks();
  $$('[data-ig]').forEach(function (a) { if (ig) a.href = 'https://instagram.com/' + ig; else a.hidden = true; });
  $$('[data-wa-num]').forEach(function (s) { s.textContent = C.whatsappVisivel || ('+' + num); });
  $$('[data-mail]').forEach(function (a) { if (C.email) { a.href = 'mailto:' + C.email; a.textContent = C.email; a.hidden = false; } });
  $$('[data-anos]').forEach(function (s) { if (C.anos) s.textContent = C.anos; });
  $$('[data-fotos]').forEach(function (s) { if (C.fotosRestauradas) s.textContent = Number(C.fotosRestauradas).toLocaleString(LOC); });
  $$('[data-year]').forEach(function (s) { s.textContent = new Date().getFullYear(); });

  /* ---------- mídia (imagem ou vídeo) com capa provisória ---------- */
  var isVideo = function (p) { return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(p || ''); };
  function placeholder(word) {
    return '<div class="ph"><span class="ph__w">' + esc(word) + '</span><span class="ph__s">' + UI.prod + '</span></div>';
  }
  window.__ph = placeholder;
  function media(path, alt, word) {
    if (!path) return placeholder(word);
    path = url(path);
    if (isVideo(path)) {
      var poster = path.replace(/\.(mp4|webm|mov|m4v)$/i, '.jpg');
      return '<video muted loop playsinline preload="none" data-lazy-video data-src="' + esc(path) + '" data-poster="' + esc(poster) + '" data-word="' + esc(word) + '" aria-label="' + esc(alt) + '"></video>';
    }
    return '<img src="' + esc(path) + '" alt="' + esc(alt) + '" loading="lazy" data-word="' + esc(word) + '" onerror="this.outerHTML=window.__ph(this.dataset.word)">';
  }

  /* serviços */
  var svcBox = $('[data-services]');
  if (svcBox && C.servicos) {
    svcBox.innerHTML = C.servicos.map(function (s) {
      var path = (C.midias || {})[s.midia] || '', title = t(s.titulo);
      return '<article class="svc reveal"><div class="svc__media">' + media(path, title, title) + '</div>' +
        '<div class="svc__body"><h3 class="svc__t">' + esc(title) + '</h3><p class="svc__p">' + esc(t(s.texto)) + '</p>' +
        '<div class="svc__foot"><span class="svc__price">' + esc(t(s.preco)) + '</span><a class="svc__go" data-cur="whatsapp" data-wa="' + esc(t(s.mensagem)) + '" href="#">' + UI.orc + ' ' + ARROW + '</a></div></div></article>';
    }).join('');
  }

  /* memórias em vídeo */
  var memo = $('[data-memorias]');
  if (memo && C.memorias) {
    memo.innerHTML = C.memorias.map(function (m) {
      return '<figure class="pair reveal"><div class="pair__video"><span class="pair__live">' + UI.video + '</span>' + media(m.video, UI.memo, '') + '</div>' +
        (m.foto ? '<div class="pair__old"><img src="' + esc(url(m.foto)) + '" alt="' + UI.original + '" loading="lazy"><span>' + UI.original + '</span></div>' : '') + '</figure>';
    }).join('');
  }

  /* pacotes */
  var hom = C.homenagem, homBox = $('[data-homenagem]');
  if (hom && homBox) {
    homBox.innerHTML = '<div class="homenagem__main"><span class="homenagem__badge">' + UI.mais + '</span>' +
      '<h3 class="homenagem__name">' + esc(t(hom.nome)) + '</h3><p class="homenagem__txt">' + esc(t(hom.texto)) + '</p>' +
      '<div class="homenagem__price">' + (hom.precoDe ? '<s>' + UI.de + ' ' + CUR.s + ' ' + money(hom.precoDe) + '</s>' : '') + '<span class="price"><small>' + CUR.s + '</small>' + money(hom.preco) + '</span></div>' +
      '<a class="btn btn--wa" data-cur="whatsapp" data-wa="' + esc(UI.msgH + t(hom.nome) + '.') + '" href="#">' + WAICO + UI.quero + '</a></div>' +
      '<ul>' + (t(hom.itens) || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    homBox.classList.add('reveal');
  }
  var tiers = $('[data-tiers]');
  if (tiers && C.pacotes) {
    tiers.innerHTML = C.pacotes.map(function (p) {
      var nome = t(p.nome);
      return '<div class="tier reveal' + (p.selo ? ' tier--hot' : '') + '">' + (p.selo ? '<span class="tier__selo">' + esc(t(p.selo)) + '</span>' : '') +
        '<h3 class="tier__name">' + esc(nome) + '</h3><p class="tier__txt">' + esc(t(p.texto)) + '</p>' +
        '<span class="price"><small>' + CUR.s + '</small>' + money(p.preco) + '</span>' +
        '<ul>' + (t(C.incluso) || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<a class="btn btn--wa" data-cur="whatsapp" data-wa="' + esc(UI.msgP + nome) + '" href="#">' + WAICO + UI.esc + ' ' + esc(nome) + '</a></div>';
    }).join('');
  }
  var ad = $('[data-adicionais]');
  if (ad && C.adicionais) ad.innerHTML = C.adicionais.map(function (a) { return '<dt>' + esc(t(a.nome)) + '</dt><dd>' + esc(t(a.valor)) + '</dd>'; }).join('');
  var vol = $('[data-volume]');
  if (vol && C.volume) vol.innerHTML = (t(C.volume) || []).map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('');

  /* antes e depois (carrossel) */
  var rail = $('[data-rail]');
  if (rail && C.antesDepois) {
    rail.innerHTML = C.antesDepois.map(function (a) {
      var tx = t(a.texto);
      return '<figure><img src="' + esc(url(a.foto)) + '" alt="' + esc(tx) + ', ' + UI.alt + '" loading="lazy" draggable="false"><figcaption>' + esc(tx) + '</figcaption><span class="tag tag--l">' + UI.antes + '</span><span class="tag tag--r">' + UI.depois + '</span></figure>';
    }).join('');
  }
  var depo = $('[data-depo]');
  if (depo && C.depoimentos && C.depoimentos.length) {
    depo.classList.add('rail--depo');
    depo.innerHTML = C.depoimentos.map(function (p) { return '<figure><img src="' + esc(url(p)) + '" alt="' + UI.depo + '" loading="lazy" draggable="false"></figure>'; }).join('');
    $('[data-depo-sec]').hidden = false;
  }
  bindLinks();

  /* ---------- vídeos: carregam só quando aparecem ---------- */
  var vio = new IntersectionObserver(function (ens) {
    ens.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (!v.dataset.loaded) {
          v.dataset.loaded = '1';
          v.addEventListener('error', function () { v.outerHTML = placeholder(v.dataset.word || ''); }, { once: true });
          if (v.dataset.poster) { var test = new Image(); test.onload = function () { v.poster = v.dataset.poster; }; test.src = v.dataset.poster; }
          v.src = v.dataset.src;
        }
        if (!reduced) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
      } else if (!v.paused) v.pause();
    });
  }, { rootMargin: '200px 0px' });
  $$('[data-lazy-video]').forEach(function (v) { vio.observe(v); });

  /* ---------- surgir ao rolar (já visível por padrão; só anima se o JS rodar) ---------- */
  D.documentElement.classList.add('js');
  $$('.sec__head, .memo__text, .cmp, .clean, .how, .faq, .extras, .final__text, .method, .guarantee').forEach(function (el) { el.classList.add('reveal'); });
  var rio = new IntersectionObserver(function (ens) {
    ens.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(function (el, i) {
    if (el.classList.contains('svc') || el.classList.contains('tier') || el.classList.contains('how')) el.style.transitionDelay = (i % 3) * 70 + 'ms';
    rio.observe(el);
  });

  /* =========================================================
     ABERTURA: restauração guiada pela rolagem
     ========================================================= */
  var seq = $('[data-seq]'), stick = $('[data-stick]');
  var S = [0.08, 0.23, 0.38, 0.53, 0.68, 0.82];
  var E = {
    poster: $('[data-poster]'), gl: $('[data-gl]'), pct: $('[data-pct]'), pct2: $('[data-pct2]'), segs: $$('[data-seg]'),
    layersBox: $('[data-layers]'), layers: $$('[data-layer]'), hero: $('[data-hero]'), stages: $$('[data-stage]'),
    bands: $$('[data-band]'), sticky: $('[data-sticky]'), final: $('[data-final]')
  };
  var bandSec = E.bands[0] && E.bands[0].parentElement;
  var GL = null, fallback = false, p = 0, dirty = true, stickyOn = null;
  var heroCfg = C.hero || {}, heroImg = E.poster.querySelector('img');
  if (heroCfg.foto && heroImg.getAttribute('src') !== url(heroCfg.foto)) heroImg.src = url(heroCfg.foto);
  var A = 1037 / 1600;
  function layout(w, h, a) {
    a = a || A;
    if (w >= 900) { var ph = h * 0.76; if (ph * a > w * 0.44) ph = (w * 0.44) / a; return { cx: w * 0.67, cy: h * 0.54, h: ph }; }
    var ph2 = Math.min(h * 0.52, (w * 0.8) / a);
    return { cx: w / 2, cy: 74 + ph2 / 2, h: ph2 };
  }
  function placePoster() {
    var Lo = layout(stick.clientWidth, stick.clientHeight), w = Lo.h * A;
    Object.assign(E.poster.style, { left: Lo.cx - w / 2 + 'px', top: Lo.cy - Lo.h / 2 + 'px', width: w + 'px', height: Lo.h + 'px' });
  }
  var setA = function () { if (heroImg.naturalWidth) { A = heroImg.naturalWidth / heroImg.naturalHeight; placePoster(); } };
  if (heroImg.complete) setTimeout(setA); else heroImg.addEventListener('load', setA, { once: true });
  function progress() {
    var r = seq.getBoundingClientRect(), span = seq.offsetHeight - stick.offsetHeight;
    return clamp(-r.top / Math.max(1, span));
  }
  function update() {
    var vh = innerHeight;
    p = progress();
    if (GL) GL.setProgress(p);
    else if (fallback) { var q = clamp(p / S[5]); heroImg.style.filter = 'sepia(' + 0.85 * (1 - q) + ') contrast(' + (0.8 + 0.2 * q) + ') blur(' + (1 - q) + 'px)'; }
    var pc = Math.round(clamp((p - S[0]) / (S[5] - S[0])) * 100) + '%';
    E.pct.textContent = pc; E.pct2.textContent = pc;
    E.segs.forEach(function (s, k) { s.style.transform = 'scaleX(' + clamp((p - S[k]) / (S[k + 1] - S[k])) + ')'; });
    E.layers.forEach(function (l, k) {
      var done = p >= S[k + 1], act = p >= S[k] && !done;
      l.classList.toggle('is-done', done); l.classList.toggle('is-act', act);
    });
    var h = 1 - clamp((p - 0.02) / 0.06);
    E.layersBox.style.opacity = 1 - h * 0.6;
    E.hero.style.opacity = h; E.hero.style.transform = 'translateY(' + (-(1 - h) * 24) + 'px)'; E.hero.style.visibility = h < 0.01 ? 'hidden' : '';
    E.stages.forEach(function (st, k) {
      var a = S[k] + 0.005, b = k < 5 ? S[k + 1] : 9;
      var e = clamp((p - a) / 0.03), x = k < 5 ? clamp((b - p) / 0.03) : 1, o = e * x;
      st.style.opacity = o;
      st.style.transform = 'translateY(' + ((1 - e) * 28 - (1 - x) * 18) + 'px)';
      st.style.filter = o > 0.99 || o < 0.01 ? 'none' : 'blur(' + (1 - o) * 6 + 'px)';
      st.style.visibility = o < 0.01 ? 'hidden' : '';
    });
    if (bandSec) {
      var br = bandSec.getBoundingClientRect(), tt = clamp((vh - br.top) / (vh + br.height));
      E.bands[0].style.transform = 'translate3d(' + (-tt * 30) + '%,0,0)';
      E.bands[1].style.transform = 'translate3d(' + (-30 + tt * 30) + '%,0,0)';
    }
    var fr = E.final ? E.final.getBoundingClientRect().top : 1e9;
    var show = p > 0.06 && fr > vh * 0.85;
    if (show !== stickyOn) { stickyOn = show; E.sticky.classList.toggle('is-on', show); }
  }
  addEventListener('scroll', function () { dirty = true; }, { passive: true });
  addEventListener('resize', function () { dirty = true; placePoster(); });
  placePoster();

  if (!reduced && Element.prototype.animate) $$('[data-hl]').forEach(function (el, i) {
    el.animate([{ opacity: 0, transform: 'translateY(.4em)', filter: 'blur(10px)', letterSpacing: '.05em' }, { opacity: 1, transform: 'none', filter: 'blur(0px)', letterSpacing: '-0.01em' }],
      { duration: 1200, delay: 200 + i * 150, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
  });

  function startGL() {
    if (!window.RestaurarGL) { fallback = true; dirty = true; return; }
    window.RestaurarGL.mount(E.gl, {
      src: heroImg.currentSrc || heroImg.src, eye: heroCfg.olhos || [0.5, 0.58], box: heroCfg.caixa || [0.12, 0.05],
      layout: layout, reduced: reduced, heal: fine, stages: S,
      mobile: !desk(), maxDpr: desk() ? 2 : 1.5, maxTex: desk() ? 1600 : 1100
    }).then(function (g) { GL = g; g.setProgress(p); E.poster.style.opacity = 0; })
      .catch(function (err) { console.warn('WebGL indisponível, usando imagem estática.', err); fallback = true; dirty = true; });
  }
  if (D.readyState === 'complete') startGL(); else addEventListener('load', startGL);

  /* ---------- cursor: seta pixelada; pincel só sobre a foto ---------- */
  var cur = $('[data-cursor]'), clabel = $('[data-clabel]');
  var LABELS = { whatsapp: UI.wa, arraste: UI.arraste };
  var mx = -100, my = -100, cx = -100, cy = -100, mode = '', overPhoto = false;
  if (fine) { cur.style.display = 'block'; D.documentElement.classList.add('cc-on'); }
  function setMode(el) {
    var tEl = el && el.closest ? el.closest('[data-cur]') : null, k = tEl ? tEl.getAttribute('data-cur') : '';
    var brush = k === 'limpar' || (overPhoto && !!(el && el.closest && el.closest('[data-seq]')));
    var m = brush ? 'brush' : (LABELS[k] ? k : '');
    if (m !== mode) {
      mode = m; cur.classList.toggle('is-brush', brush); cur.classList.toggle('is-link', !!LABELS[k]);
      clabel.textContent = LABELS[k] || ''; clabel.style.opacity = LABELS[k] ? 1 : 0;
    }
  }
  addEventListener('pointermove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (e.pointerType !== 'mouse') return;
    var inSeq = !!(e.target.closest && e.target.closest('[data-seq]')) && desk();
    overPhoto = GL ? !!GL.setPointer(e.clientX, e.clientY, inSeq) : false;
    setMode(e.target);
  }, { passive: true });
  if (fine) addEventListener('scroll', function () { if (GL) overPhoto = !!GL.setPointer(mx, my, desk() && !!(D.elementFromPoint(mx, my) || { closest: function () {} }).closest('[data-seq]')); setMode(D.elementFromPoint(mx, my)); }, { passive: true });
  D.addEventListener('mouseleave', function () { cur.style.opacity = 0; });
  D.addEventListener('mouseenter', function () { cur.style.opacity = 1; });

  function loop() {
    requestAnimationFrame(loop);
    if (dirty) { dirty = false; update(); }
    if (fine) { cx += (mx - cx) * 0.5; cy += (my - cy) * 0.5; cur.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; }
  }
  requestAnimationFrame(loop);

  /* =========================================================
     COMPARADOR antes/depois
     ========================================================= */
  var cmp = $('[data-cmp]');
  if (cmp) {
    var bef = $('[data-cmp-before]'), aft = $('[data-cmp-after]'), dragging = false, swept = false, sx0 = 0, sy0 = 0, decided = false;
    var setX = function (v) { cmp.style.setProperty('--x', clamp(v, 0, 100) + '%'); };
    var fromEvt = function (e) { var r = cmp.getBoundingClientRect(); setX(((e.clientX - r.left) / r.width) * 100); };
    cmp.addEventListener('pointerdown', function (e) { dragging = true; decided = e.pointerType === 'mouse'; sx0 = e.clientX; sy0 = e.clientY; if (decided) { fromEvt(e); cmp.setPointerCapture(e.pointerId); } });
    cmp.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (!decided) { var dx = Math.abs(e.clientX - sx0), dy = Math.abs(e.clientY - sy0); if (dx < 6 && dy < 6) return; if (dy > dx) { dragging = false; return; } decided = true; try { cmp.setPointerCapture(e.pointerId); } catch (er) {} }
      fromEvt(e);
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) { cmp.addEventListener(ev, function () { dragging = false; }); });
    cmp.tabIndex = 0;
    cmp.addEventListener('keydown', function (e) { var x = parseFloat(getComputedStyle(cmp).getPropertyValue('--x')) || 50; if (e.key === 'ArrowLeft') { setX(x - 5); e.preventDefault(); } if (e.key === 'ArrowRight') { setX(x + 5); e.preventDefault(); } });
    $$('[data-pair]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-pair]').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        var k = b.getAttribute('data-pair');
        aft.src = ROOT + 'img/comparar/' + k + '-depois.jpg'; bef.src = ROOT + 'img/comparar/' + k + '-antes.jpg';
        sweep();
      });
    });
    function sweep() {
      if (reduced) return setX(50);
      var t0 = performance.now();
      (function f(now) { var k = Math.min(1, (now - t0) / 1600); setX(50 + Math.sin(k * Math.PI * 2) * 30 * (1 - k * 0.3)); if (k < 1) requestAnimationFrame(f); else setX(50); })(t0);
    }
    new IntersectionObserver(function (en, o) { if (en[0].isIntersecting && !swept) { swept = true; sweep(); o.disconnect(); } }, { threshold: 0.5 }).observe(cmp);
  }

  /* ---------- trilhos arrastáveis (desktop) ---------- */
  $$('[data-drag]').forEach(function (el) {
    var down = false, sx = 0, sl = 0, moved = false;
    el.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; });
    addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (!moved && Math.abs(dx) > 4) { moved = true; el.style.scrollSnapType = 'none'; } if (moved) el.scrollLeft = sl - dx; });
    addEventListener('pointerup', function () { if (!down) return; down = false; el.style.scrollSnapType = ''; });
    el.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });
  var rc = $('[data-rail-count]');
  if (rail && rc) {
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var count = function () {
      var figs = $$('figure', rail); if (!figs.length) return;
      var best = 0, bd = 1e9, x0 = figs[0].offsetLeft;
      figs.forEach(function (f, i) { var d = Math.abs(f.offsetLeft - x0 - rail.scrollLeft); if (d < bd) { bd = d; best = i; } });
      rc.textContent = pad(best + 1) + ' / ' + pad(figs.length);
    };
    rail.addEventListener('scroll', count, { passive: true }); count();
  }

  /* =========================================================
     TESTE DE LIMPEZA
     ========================================================= */
  var wrap = $('[data-clean]');
  if (wrap) (function () {
    var cv = $('canvas', wrap), img = $('img', wrap), pctEl = $('[data-clean-pct]');
    var ctx = cv.getContext('2d', { willReadFrequently: true });
    var small = D.createElement('canvas'); small.width = 32; small.height = 40;
    var sctx = small.getContext('2d', { willReadFrequently: true });
    var last = null, drawing = false, moves = 0, done = false, dpr = 1, paintedW = 0;
    var R = function (a, b) { return a + Math.random() * (b - a); };
    function paint() {
      var w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !img.naturalWidth) return;
      dpr = Math.min(devicePixelRatio || 1, 2); paintedW = w;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      var W = cv.width, H = cv.height, ir = img.naturalWidth / img.naturalHeight, cr = W / H, sw, sh, sx, sy;
      if (ir > cr) { sh = img.naturalHeight; sw = sh * cr; sx = (img.naturalWidth - sw) / 2; sy = 0; } else { sw = img.naturalWidth; sh = sw / cr; sx = 0; sy = (img.naturalHeight - sh) / 2; }
      var tmp = D.createElement('canvas'); tmp.width = Math.max(1, W / 3 | 0); tmp.height = Math.max(1, H / 3 | 0);
      tmp.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, tmp.width, tmp.height);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.drawImage(tmp, 0, 0, W, H);
      var id = ctx.getImageData(0, 0, W, H), a = id.data;
      for (var i = 0; i < a.length; i += 4) {
        var l = 0.299 * a[i] + 0.587 * a[i + 1] + 0.114 * a[i + 2], n = (Math.random() - 0.5) * 34;
        a[i] = l * 0.66 + 82 + n; a[i + 1] = l * 0.58 + 70 + n; a[i + 2] = l * 0.44 + 54 + n;
      }
      ctx.putImageData(id, 0, 0);
      for (var k = 0; k < 7; k++) {
        var x = R(0, W), y = R(0, H), r = R(0.08, 0.3) * W, g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
        g.addColorStop(0, 'rgba(92,60,30,.45)'); g.addColorStop(0.7, 'rgba(120,84,44,.22)'); g.addColorStop(1, 'rgba(120,84,44,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      var vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.85);
      vg.addColorStop(0, 'rgba(60,40,20,0)'); vg.addColorStop(1, 'rgba(60,40,20,.6)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      for (k = 0; k < 650; k++) { ctx.fillStyle = Math.random() < 0.7 ? 'rgba(245,238,225,' + R(0.4, 0.9) + ')' : 'rgba(30,22,15,' + R(0.3, 0.7) + ')'; ctx.beginPath(); ctx.arc(R(0, W), R(0, H), R(0.4, 1.8) * dpr, 0, 7); ctx.fill(); }
      ctx.lineCap = 'round';
      for (k = 0; k < 9; k++) {
        ctx.strokeStyle = 'rgba(250,245,235,' + R(0.5, 0.9) + ')'; ctx.lineWidth = R(0.6, 1.6) * dpr;
        var xx = R(0, W), yy = R(-0.1, 0.5) * H, len = R(0.3, 0.9) * H, drift = (k % 2 ? 0.004 : -0.004) * W;
        ctx.beginPath(); ctx.moveTo(xx, yy);
        for (var s = 1; s <= 14; s++) { xx += R(-0.01, 0.01) * W + drift; ctx.lineTo(xx, yy + (len * s) / 14); }
        ctx.stroke();
      }
      for (k = 0; k < 4; k++) {
        ctx.strokeStyle = 'rgba(40,28,18,.55)'; ctx.lineWidth = R(0.8, 1.4) * dpr;
        var x2 = R(0, W), y2 = R(0, H); ctx.beginPath(); ctx.moveTo(x2, y2);
        for (s = 0; s < 22; s++) { x2 += R(-0.04, 0.04) * W; y2 += R(-0.04, 0.04) * H; ctx.lineTo(x2, y2); }
        ctx.stroke();
      }
      ctx.fillStyle = '#e9dfcb'; ctx.beginPath(); ctx.moveTo(W, H * 0.76);
      for (s = 1; s <= 16; s++) { var tt = s / 16; ctx.lineTo(W - tt * W * 0.3 + R(-0.012, 0.012) * W, H * 0.76 + tt * H * 0.24 + R(-0.012, 0.012) * H); }
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      done = false; cv.style.opacity = 1; wrap.classList.remove('is-done'); if (pctEl) pctEl.textContent = '0%';
    }
    function sample() {
      if (done) return; // já concluído: não recalcula (evita voltar para 75%)
      sctx.clearRect(0, 0, 32, 40); sctx.drawImage(cv, 0, 0, 32, 40);
      var d = sctx.getImageData(0, 0, 32, 40).data, c = 0;
      for (var i = 3; i < d.length; i += 4) if (d[i] < 128) c++;
      var f = c / (32 * 40);
      if (f > 0.7) { done = true; cv.style.opacity = 0; wrap.classList.add('is-done'); if (pctEl) pctEl.textContent = '100%'; return; }
      if (pctEl) pctEl.textContent = Math.round(f / 0.7 * 100) + '%';
    }
    function dab(x, y) {
      var r = 30 * dpr, g = ctx.createRadialGradient(x, y, r * 0.45, x, y, r);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    function erase(e) {
      if (done) return;
      var b = cv.getBoundingClientRect(), x = (e.clientX - b.left) * dpr, y = (e.clientY - b.top) * dpr;
      ctx.globalCompositeOperation = 'destination-out';
      if (last) { var dx = x - last[0], dy = y - last[1], n = Math.max(1, Math.hypot(dx, dy) / (8 * dpr) | 0); for (var i = 1; i <= n; i++) dab(last[0] + (dx * i) / n, last[1] + (dy * i) / n); } else dab(x, y);
      last = [x, y];
      if (++moves % 6 === 0) sample();
    }
    cv.addEventListener('pointerdown', function (e) { drawing = true; last = null; erase(e); });
    cv.addEventListener('pointermove', function (e) { if (drawing || e.pointerType === 'mouse') erase(e); });
    var stop = function () { drawing = false; last = null; sample(); };
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { cv.addEventListener(ev, stop); });
    $('[data-clean-reset]').addEventListener('click', paint);
    addEventListener('resize', function () { if (Math.abs(wrap.clientWidth - paintedW) > 8) paint(); });
    new IntersectionObserver(function (en, o) {
      if (!en[0].isIntersecting) return; o.disconnect();
      if (img.complete && img.naturalWidth) paint(); else img.addEventListener('load', paint, { once: true });
    }, { rootMargin: '400px 0px' }).observe(wrap);
  })();

  /* ---------- animações do "como enviar" só rodam quando visíveis ---------- */
  var how = $('[data-howto]');
  if (how) new IntersectionObserver(function (en) { how.classList.toggle('is-on', en[0].isIntersecting); }, { threshold: 0.15 }).observe(how);

  /* =========================================================
     SOBRE MIM: texto revela com a rolagem + animação
     ========================================================= */
  var about = $('[data-about]');
  if (about) (function () {
    var txt = $('[data-about-text]');
    var words = txt.textContent.trim().split(/\s+/);
    txt.setAttribute('aria-label', txt.textContent.trim());
    txt.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + esc(w) + '</span>'; }).join(' ');
    var spans = $$('.w', txt), lastN = -1, stickA = $('.about__stick', about);
    function upd() {
      var r = about.getBoundingClientRect(), span = about.offsetHeight - stickA.offsetHeight;
      var k = clamp((-r.top + innerHeight * 0.35) / Math.max(1, span * 0.92));
      var n = reduced ? spans.length : Math.round(k * spans.length);
      if (n !== lastN) { lastN = n; spans.forEach(function (s, i) { s.classList.toggle('on', i < n); }); }
    }
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    var video = $('[data-about-video]'), src = url((C.midias || {}).sobreMim || '');
    if (!video || !src) return;
    if (isVideo(src)) {
      video.poster = src.replace(/\.(mp4|webm|mov|m4v)$/i, '.jpg');
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { if (!video.src) video.src = src; if (!reduced) { var pr = video.play(); if (pr && pr.catch) pr.catch(function () {}); } } else video.pause();
      }, { rootMargin: '200px 0px' }).observe(about);
    } else {
      var im = new Image(); im.src = src; im.alt = video.getAttribute('aria-label') || ''; im.className = 'about__img'; video.replaceWith(im);
    }
  })();

  /* =========================================================
     FINAL: olhares antigos se transformando nos novos (nuvem)
     ========================================================= */
  (function () {
    var eyes = $$('[data-eye]'); if (!eyes.length) return;
    var NW = 128, NH = 40, BIG = NW * 4;
    function hash(x, y) { var s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
    function vnoise(x, y) { var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
      var a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1); return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy; }
    var field = new Float32Array(BIG * NH);
    for (var y = 0; y < NH; y++) for (var x = 0; x < BIG; x++) {
      var v = 0, amp = 0.5, f = 1 / 14;
      for (var o = 0; o < 4; o++) { v += amp * vnoise(x * f, y * f * 1.25); f *= 2; amp *= 0.5; }
      field[y * BIG + x] = v;
    }
    var states = eyes.map(function (el, i) {
      var cv = $('canvas', el), ctx = cv.getContext('2d'), lbl = $('[data-eye-lbl]', el);
      var m = D.createElement('canvas'); m.width = NW; m.height = NH; var mctx = m.getContext('2d'), mdata = mctx.createImageData(NW, NH);
      var tmp = D.createElement('canvas'), tctx = tmp.getContext('2d');
      var b = new Image(), a = new Image(), ready = 0;
      b.onload = a.onload = function () { ready++; };
      return { el: el, cv: cv, ctx: ctx, lbl: lbl, m: m, mctx: mctx, mdata: mdata, tmp: tmp, tctx: tctx, b: b, a: a, ready: function () { return ready === 2; },
        load: function () { if (!b.src) { b.src = el.dataset.before; a.src = el.dataset.after; } },
        period: [11.5, 13, 10.5, 12.2][i % 4], phase: [0, 3.1, 6.2, 1.7][i % 4], off: i * 97, lastSide: null };
    });
    var vis = false;
    new IntersectionObserver(function (en) { vis = en[0].isIntersecting; if (vis) states.forEach(function (s) { s.load(); }); }, { rootMargin: '200px 0px' }).observe($('[data-eyes]'));
    function sizeAll() { states.forEach(function (s) { var dpr = Math.min(devicePixelRatio || 1, 1.5); s.cv.width = Math.round(s.cv.clientWidth * dpr); s.cv.height = Math.round(s.cv.clientHeight * dpr); s.tmp.width = s.cv.width; s.tmp.height = s.cv.height; }); }
    sizeAll(); addEventListener('resize', sizeAll);
    function cover(ctx, im, W, H) { var r = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * r, h = im.naturalHeight * r; ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); }
    function cycle(k) { if (k < 0.22) return 0; if (k < 0.5) return (k - 0.22) / 0.28; if (k < 0.76) return 1; return 1 - (k - 0.76) / 0.24; }
    var lastF = 0, t0 = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      if (!vis || now - lastF < 33) return; lastF = now;
      var T = (now - t0) / 1000;
      states.forEach(function (s) {
        if (!s.ready()) return;
        var W = s.cv.width, H = s.cv.height; if (!W || !H) return;
        var k = reduced ? 1 : cycle(((T + s.phase) % s.period) / s.period);
        var th = -0.3 + k * 1.6, soft = 0.38, drift = (T * 3 + s.off) | 0, d = s.mdata.data;
        for (var yy = 0; yy < NH; yy++) for (var xx = 0; xx < NW; xx++) {
          var n = field[yy * BIG + ((xx + drift) % BIG)], vv = clamp((th - n) / soft + 0.5);
          d[(yy * NW + xx) * 4 + 3] = (vv * vv * (3 - 2 * vv)) * 255;
        }
        s.mctx.putImageData(s.mdata, 0, 0);
        s.ctx.globalCompositeOperation = 'source-over';
        cover(s.ctx, s.b, W, H);
        if (k > 0) {
          s.tctx.globalCompositeOperation = 'source-over'; s.tctx.clearRect(0, 0, W, H); cover(s.tctx, s.a, W, H);
          s.tctx.globalCompositeOperation = 'destination-in'; s.tctx.imageSmoothingEnabled = true; s.tctx.drawImage(s.m, 0, 0, W, H);
          s.ctx.drawImage(s.tmp, 0, 0);
        }
        var side = k > 0.5 ? UI.depois : UI.antes;
        if (side !== s.lastSide) { s.lastSide = side; s.lbl.textContent = side; }
      });
    }
    requestAnimationFrame(frame);
  })();
})();
