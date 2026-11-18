/* Restaurar Fotos · métricas (Google Analytics, Pixel da Meta, Clarity, Cloudflare, Vercel)
   - Os códigos ficam em config.js > metricas. Campo vazio = ferramenta desligada.
   - Ferramentas com cookies só carregam depois do "Aceitar" e da primeira interação
     (rolar, tocar, clicar ou teclar), para não pesar a abertura da página.
   - Cloudflare e Vercel não usam cookies e carregam sem o aviso. */
(function () {
  'use strict';
  var C = (window.SITE && window.SITE.metricas) || {}, L = window.LANG || 'pt', D = document, W = window;
  var GA = (C.googleAnalytics || '').trim(), PX = (C.metaPixel || '').trim(), CL = (C.clarity || '').trim(), CF = (C.cloudflare || '').trim();
  var KEY = 'rf-cookies', ready = false, queue = [], seen = {};

  function store(v) { try { if (v == null) return localStorage.getItem(KEY); localStorage.setItem(KEY, v); } catch (e) { return null; } }
  function script(src, attrs) { var s = D.createElement('script'); s.async = true; s.src = src; for (var k in attrs || {}) s.setAttribute(k, attrs[k]); D.head.appendChild(s); }

  /* ---------- sem cookies: carregam sempre ---------- */
  if (CF) script('https://static.cloudflareinsights.com/beacon.min.js', { defer: '', 'data-cf-beacon': JSON.stringify({ token: CF }) });
  if (C.vercel) { W.va = W.va || function () { (W.vaq = W.vaq || []).push(arguments); }; script('/_vercel/insights/script.js', { defer: '' }); script('/_vercel/speed-insights/script.js', { defer: '' }); }

  /* ---------- com cookies: só com consentimento ---------- */
  function loadTrackers() {
    if (ready) return; ready = true;
    if (GA) {
      W.dataLayer = W.dataLayer || []; W.gtag = function () { W.dataLayer.push(arguments); };
      W.gtag('js', new Date()); W.gtag('config', GA, { language: L });
      script('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA));
    }
    if (PX) {
      /* código-base oficial do Pixel da Meta */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(W, D, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      W.fbq('init', PX); W.fbq('track', 'PageView');
    }
    if (CL) {
      (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(W, D, 'clarity', 'script', CL);
    }
    queue.forEach(function (q) { send(q[0], q[1], q[2]); }); queue = [];
  }
  var hasCookieTools = !!(GA || PX || CL);
  function whenInteracted(fn) {
    var done = false, evs = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    function go() { if (done) return; done = true; evs.forEach(function (e) { removeEventListener(e, go, true); }); fn(); }
    evs.forEach(function (e) { addEventListener(e, go, { capture: true, passive: true }); });
    setTimeout(go, 6000);   // quem só olha a abertura também conta
  }

  /* ---------- eventos ---------- */
  var META_STD = { clique_whatsapp: 'Contact', viu_precos: 'ViewContent' };
  function send(name, params, once) {
    if (W.gtag && GA) { W.gtag('event', name, params || {}); if (name === 'clique_whatsapp') W.gtag('event', 'generate_lead', params || {}); }
    if (W.fbq && PX) { if (META_STD[name]) W.fbq('track', META_STD[name], params || {}); else W.fbq('trackCustom', name, params || {}); }
    if (W.clarity && CL) W.clarity('event', name);
  }
  function track(name, params, once) {
    if (once) { if (seen[name]) return; seen[name] = 1; }
    if (!hasCookieTools) return;
    if (ready) send(name, params); else queue.push([name, params]);
  }
  W.rfTrack = track;

  function where(el) {
    if (el.closest('.sticky')) return 'botao_flutuante';
    if (el.closest('.seq')) return 'abertura';
    var s = el.closest('section[id], footer[id], section[class]');
    return s ? (s.id || s.className.split(' ')[1] || s.className) : 'pagina';
  }
  D.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a, button, summary'); if (!a) return;
    if (a.hasAttribute('data-wa')) track('clique_whatsapp', { local: where(a), item: (a.getAttribute('data-wa') || 'geral').slice(0, 90), idioma: L });
    else if (a.hasAttribute('data-ig')) track('clique_instagram', { local: where(a) });
    else if (a.hasAttribute('hreflang')) track('troca_idioma', { para: a.getAttribute('hreflang') });
    else if (a.classList.contains('car__btn')) track('carrossel', { direcao: a.classList.contains('car__btn--next') ? 'proxima' : 'anterior' });
    else if (a.hasAttribute('data-pair')) track('trocou_caso', { caso: a.getAttribute('data-pair') });
    else if (a.tagName === 'SUMMARY') track('abriu_duvida', { pergunta: a.textContent.trim().slice(0, 90) });
  }, true);
  var cmp = D.querySelector('[data-cmp], .cmp'); if (cmp) cmp.addEventListener('pointerdown', function () { track('usou_comparador', null, true); }, { passive: true });
  var test = D.querySelector('.sec--test'); if (test) test.addEventListener('pointerdown', function () { track('testou_limpeza', null, true); }, { passive: true });
  if ('IntersectionObserver' in W) {
    [['#servicos', 'viu_servicos'], ['#pacotes', 'viu_precos'], ['#duvidas', 'viu_duvidas'], ['#contato', 'chegou_ao_fim']].forEach(function (p) {
      var el = D.querySelector(p[0]); if (!el) return;
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { track(p[1], null, true); io.disconnect(); } }, { threshold: 0.25 });
      io.observe(el);
    });
  }
  var seq = D.querySelector('.seq');
  if (seq) addEventListener('scroll', function onS() { if (seq.getBoundingClientRect().bottom < innerHeight * 1.02) { track('viu_restauracao_completa', null, true); removeEventListener('scroll', onS); } }, { passive: true });

  /* ---------- aviso de cookies e política de privacidade ---------- */
  var TXT = {
    pt: { msg: 'Uso cookies para entender como o site é usado e melhorar o atendimento.', ok: 'Aceitar', no: 'Só o necessário', more: 'Privacidade',
      h: 'Privacidade', close: 'Fechar',
      body: '<p>Este site não pede cadastro e não guarda dados pessoais. O contato acontece pelo WhatsApp, e as fotos que você envia são usadas só para o seu pedido. Elas só aparecem no site ou no Instagram com a sua autorização.</p><p>Se você aceitar os cookies, uso ferramentas de medição (como Google Analytics, Pixel da Meta e Microsoft Clarity) para saber quantas pessoas visitam o site, de onde vêm e quais partes funcionam melhor. Os dados são anônimos e servem também para mostrar anúncios a quem já visitou o site.</p><p>Você pode mudar sua escolha quando quiser pelo link "Privacidade" no rodapé. Dúvidas: fale comigo pelo WhatsApp.</p>' },
    en: { msg: 'I use cookies to understand how the site is used and improve the service.', ok: 'Accept', no: 'Only essential', more: 'Privacy',
      h: 'Privacy', close: 'Close',
      body: '<p>This site has no sign-up and stores no personal data. Contact happens on WhatsApp, and the photos you send are used only for your order. They appear on the site or Instagram only with your permission.</p><p>If you accept cookies, I use analytics tools (such as Google Analytics, Meta Pixel and Microsoft Clarity) to learn how many people visit, where they come from and what works best. The data is anonymous and is also used to show ads to past visitors.</p><p>You can change your choice anytime through the "Privacy" link in the footer. Questions? Message me on WhatsApp.</p>' },
    es: { msg: 'Uso cookies para entender cómo se usa el sitio y mejorar la atención.', ok: 'Aceptar', no: 'Solo lo necesario', more: 'Privacidad',
      h: 'Privacidad', close: 'Cerrar',
      body: '<p>Este sitio no pide registro ni guarda datos personales. El contacto es por WhatsApp, y las fotos que envías se usan solo para tu pedido. Solo aparecen en el sitio o en Instagram con tu autorización.</p><p>Si aceptas las cookies, uso herramientas de medición (como Google Analytics, el Píxel de Meta y Microsoft Clarity) para saber cuántas personas visitan el sitio, de dónde vienen y qué funciona mejor. Los datos son anónimos y también sirven para mostrar anuncios a quien ya visitó el sitio.</p><p>Puedes cambiar tu elección cuando quieras en el enlace "Privacidad" del pie de página. ¿Dudas? Escríbeme por WhatsApp.</p>' }
  }[L] || {};

  var bar = null;
  function closeBar() { if (bar) { bar.classList.remove('is-on'); D.documentElement.classList.remove('ck-open'); var b = bar; setTimeout(function () { b.remove(); }, 400); bar = null; } }
  function choose(v) { store(v); closeBar(); if (v === 'sim') whenInteracted(loadTrackers); }
  function openBar() {
    if (bar || !hasCookieTools) return;
    bar = D.createElement('div'); bar.className = 'ck'; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', TXT.more);
    bar.innerHTML = '<p>' + TXT.msg + ' <button type="button" class="ck__more">' + TXT.more + '</button></p><div class="ck__btns"><button type="button" class="ck__no">' + TXT.no + '</button><button type="button" class="ck__ok">' + TXT.ok + '</button></div>';
    D.body.appendChild(bar);
    bar.querySelector('.ck__ok').onclick = function () { choose('sim'); track('aceitou_cookies'); };
    bar.querySelector('.ck__no').onclick = function () { choose('nao'); };
    bar.querySelector('.ck__more').onclick = openPolicy;
    requestAnimationFrame(function () { bar.classList.add('is-on'); D.documentElement.classList.add('ck-open'); });
  }
  function openPolicy(e) {
    if (e) e.preventDefault();
    var dlg = D.querySelector('.privacy');
    if (!dlg) {
      dlg = D.createElement('dialog'); dlg.className = 'privacy';
      dlg.innerHTML = '<h2>' + TXT.h + '</h2>' + TXT.body + '<div class="ck__btns">' + (hasCookieTools ? '<button type="button" class="ck__no">' + TXT.no + '</button><button type="button" class="ck__ok">' + TXT.ok + '</button>' : '') + '<button type="button" class="ck__x">' + TXT.close + '</button></div>';
      D.body.appendChild(dlg);
      dlg.querySelector('.ck__x').onclick = function () { dlg.close(); };
      if (hasCookieTools) {
        dlg.querySelector('.ck__ok').onclick = function () { choose('sim'); dlg.close(); };
        dlg.querySelector('.ck__no').onclick = function () { var was = store() === 'sim'; choose('nao'); dlg.close(); if (was) location.reload(); };
      }
      dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
    }
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  Array.prototype.forEach.call(D.querySelectorAll('[data-privacy]'), function (a) { a.textContent = TXT.more; a.addEventListener('click', openPolicy); });

  var choice = store();
  if (choice === 'sim') whenInteracted(loadTrackers);
  else if (!choice && hasCookieTools) {
    // no celular o aviso espera a primeira rolagem, para não cobrir o botão da abertura
    if (innerWidth < 900) { var onS = function () { if (scrollY > innerHeight * 0.6) { removeEventListener('scroll', onS); setTimeout(openBar, 400); } }; addEventListener('scroll', onS, { passive: true }); }
    else setTimeout(openBar, 1800);
  }
})();
