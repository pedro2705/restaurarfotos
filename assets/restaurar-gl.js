/* Cena WebGL da restauração (sem bibliotecas): uma foto impressa em 3D
   que se restaura conforme o progresso da rolagem (0 a 1). */
(function () {
  'use strict';

  var VS = [
    'attribute vec3 position; attribute vec2 uv;',
    'uniform mat4 uProj, uMV; uniform float uWarp, uTime;',
    'varying vec2 vUv; varying float vShade;',
    'void main(){',
    '  vUv = uv; vec3 p = position;',
    '  float cd = max(0.0, (uv.x - 0.58) + (uv.y - 0.58));',
    '  float curl = cd * cd * 1.4 * uWarp;',
    '  p.z += curl;',
    '  p.z += (sin(uv.x * 3.1 + uTime * 0.6) * 0.03 + sin(uv.y * 2.3 + uTime * 0.4) * 0.02) * uWarp;',
    '  vShade = curl;',
    '  gl_Position = uProj * uMV * vec4(p, 1.0);',
    '}'
  ].join('\n');

  var PREC = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';

  var FS = PREC + [
    'uniform sampler2D uTex;',
    'uniform vec2 uTexel, uEye, uMouse, uLight, uHs;',
    'uniform float uA, uB, uTime, uDust, uScratch, uTear, uColor, uSharp, uEyeRing, uMouseR;',
    'varying vec2 vUv; varying float vShade;',
    'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }',
    'float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }',
    'float crack(vec2 p){',
    '  vec2 n = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0;',
    '  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){',
    '    vec2 g = vec2(float(i), float(j)); vec2 o = vec2(hash(n + g), hash(n + g + 19.1));',
    '    vec2 r = g + o - f; float d = dot(r, r);',
    '    if (d < d1){ d2 = d1; d1 = d; } else if (d < d2){ d2 = d; }',
    '  }',
    '  return sqrt(d2) - sqrt(d1);',
    '}',
    'float scratches(vec2 uv){',
    '  float s = 0.0;',
    '  for (int i = 0; i < 7; i++){',
    '    float fi = float(i);',
    '    float x = 0.08 + hash(vec2(fi, 3.7)) * 0.84;',
    '    float y0 = hash(vec2(fi, 8.1)) * 0.5; float len = 0.3 + hash(vec2(fi, 1.3)) * 0.6;',
    '    float xx = x + (uv.y - y0) * (hash(vec2(fi, 5.0)) - 0.5) * 0.35 + (noise(vec2(uv.y * 9.0, fi)) - 0.5) * 0.012;',
    '    float w = 0.0012 + 0.0018 * hash(vec2(fi, 9.0));',
    '    float on = smoothstep(y0, y0 + 0.04, uv.y) * (1.0 - smoothstep(y0 + len - 0.04, y0 + len, uv.y));',
    '    s = max(s, (1.0 - smoothstep(0.0, w, abs(uv.x - xx))) * on);',
    '  }',
    '  return s;',
    '}',
    'float stageAmt(float a, float n){ return smoothstep(n - 0.12, n + 0.12, a * 1.24 - 0.12); }',
    'vec3 blur9(vec2 uv, float r){',
    '  vec2 o = uTexel * r;',
    '  vec3 c = texture2D(uTex, uv).rgb * 0.25;',
    '  c += (texture2D(uTex, uv + vec2(o.x, 0.0)).rgb + texture2D(uTex, uv - vec2(o.x, 0.0)).rgb',
    '      + texture2D(uTex, uv + vec2(0.0, o.y)).rgb + texture2D(uTex, uv - vec2(0.0, o.y)).rgb) * 0.125;',
    '  c += (texture2D(uTex, uv + o).rgb + texture2D(uTex, uv - o).rgb',
    '      + texture2D(uTex, uv + vec2(o.x, -o.y)).rgb + texture2D(uTex, uv + vec2(-o.x, o.y)).rgb) * 0.0625;',
    '  return c;',
    '}',
    'void main(){',
    '  vec2 size = vec2(uA + 2.0 * uB, 1.0 + 2.0 * uB);',
    '  vec2 iuv = vec2((vUv.x * size.x - uB) / uA, vUv.y * size.y - uB);',
    '  float inside = step(0.0, iuv.x) * step(iuv.x, 1.0) * step(0.0, iuv.y) * step(iuv.y, 1.0);',
    '  vec2 cuv = clamp(iuv, 0.0, 1.0);',
    '  float md = length((vUv - uMouse) * size);',
    '  float heal = (1.0 - smoothstep(uMouseR * 0.55, uMouseR, md)) * step(0.001, uMouseR);',
    '  float F = clamp((fbm(cuv * vec2(uA, 1.0) * 3.0) - 0.2) / 0.6, 0.0, 1.0);',
    '  float aDust = stageAmt(uDust, mix(F, cuv.y, 0.45)) * (1.0 - heal);',
    '  float aScr  = stageAmt(uScratch, mix(F, cuv.x, 0.45)) * (1.0 - heal);',
    '  float aCol  = stageAmt(uColor, mix(1.0 - F, 1.0 - cuv.y, 0.4)) * (1.0 - heal);',
    '  float aSharp = uSharp * (1.0 - heal);',
    '  float dmg = (aDust + aScr + aCol + uTear) * 0.25;',
    '  float td = (vUv.x + vUv.y * 0.9) - 0.42 + (fbm(vUv * 9.0) - 0.5) * 0.14;',
    '  float thr = mix(-0.8, 0.0, uTear);',
    '  if (uTear > 0.001 && td < thr) discard;',
    '  float e = min(min(vUv.x, 1.0 - vUv.x) * size.x, min(vUv.y, 1.0 - vUv.y) * size.y);',
    '  if (e < noise(vUv * 60.0) * 0.016 * dmg) discard;',
    '  vec3 clean = texture2D(uTex, cuv).rgb;',
    '  vec3 soft = blur9(cuv, 1.8);',
    '  vec3 col = clean + (clean - soft) * 0.35;',
    '  col = mix(col, soft, max(aSharp * 0.85, aDust * 0.6));',
    '  float l = dot(col, vec3(0.299, 0.587, 0.114));',
    '  vec3 sep = mix(vec3(l) * vec3(1.08, 0.93, 0.74), vec3(0.80, 0.72, 0.58), 0.38);',
    '  col = mix(col, sep, aCol);',
    '  float vig = smoothstep(0.25, 0.8, length((cuv - 0.5) * vec2(1.2, 1.0)));',
    '  col = mix(col, col * vec3(0.82, 0.70, 0.50), vig * aCol * 0.8);',
    '  float stain = smoothstep(0.6, 0.7, fbm(cuv * 4.0 + 3.1));',
    '  col = mix(col, col * vec3(0.72, 0.58, 0.42), stain * aDust * 0.75);',
    '  float sp1 = smoothstep(0.80, 0.84, noise(cuv * vec2(uA, 1.0) * 170.0));',
    '  float sp2 = smoothstep(0.86, 0.9, noise(cuv * vec2(uA, 1.0) * 55.0 + 7.0));',
    '  col = mix(col, vec3(0.94, 0.91, 0.85), sp1 * aDust * 0.9);',
    '  col = mix(col, vec3(0.12, 0.10, 0.08), sp2 * aDust * 0.55);',
    '  float cr = 1.0 - smoothstep(0.0, 0.035, crack(cuv * vec2(uA, 1.0) * 13.0));',
    '  col *= 1.0 - cr * 0.45 * aScr;',
    '  col = mix(col, vec3(0.96, 0.94, 0.9), scratches(cuv) * aScr * 0.85);',
    '  float cy = abs(cuv.y - 0.63 - (noise(vec2(cuv.x * 6.0, 2.0)) - 0.5) * 0.03);',
    '  col = mix(col, vec3(0.95, 0.93, 0.88), (1.0 - smoothstep(0.0, 0.004, cy)) * uTear * (1.0 - heal) * 0.8);',
    '  col *= 1.0 - (1.0 - smoothstep(0.004, 0.012, cy)) * uTear * (1.0 - heal) * 0.25;',
    '  float rebuilt = step(td, 0.0) * step(thr, td);',
    '  col = mix(col, sep * 0.95, rebuilt * uTear * 0.6);',
    '  vec3 paper = mix(vec3(0.93, 0.91, 0.86), vec3(0.80, 0.70, 0.52), aCol * 0.8 + stain * aDust * 0.3);',
    '  col = mix(paper, col, inside);',
    '  float fringe = (1.0 - smoothstep(0.0, 0.012, td - thr)) * step(0.001, uTear);',
    '  col = mix(col, vec3(0.95, 0.93, 0.88), fringe * 0.9);',
    '  vec2 tp = vUv * size * 40.0;',
    '  float h0 = fbm(tp), hx = fbm(tp + vec2(0.08, 0.0)), hy = fbm(tp + vec2(0.0, 0.08));',
    '  vec3 n = normalize(vec3((h0 - hx) * 5.0, (h0 - hy) * 5.0, 1.0));',
    '  float lit = dot(n, normalize(vec3(uLight, 0.6)));',
    '  col *= mix(1.0, 0.82 + 0.32 * lit, 0.55 * dmg + 0.08);',
    '  col *= 1.0 - vShade * 0.5;',
    '  col += (hash(vUv * 900.0 + fract(uTime) * 13.0) - 0.5) * (0.025 + 0.07 * dmg);',
    '  vec2 q = (cuv - uEye) * vec2(uA, 1.0);',
    '  vec2 hs = uHs;',
    '  vec2 dq = abs(q) - hs;',
    '  float outside = max(dq.x, dq.y);',
    '  float onEdge = 1.0 - smoothstep(0.0015, 0.003, abs(outside));',
    '  float dash = step(0.5, fract((q.x + q.y) * 55.0 - uTime * 1.5));',
    '  vec2 cq = abs(abs(q) - hs);',
    '  float handle = step(max(cq.x, cq.y), 0.011);',
    '  col *= 1.0 - 0.5 * uEyeRing * smoothstep(0.0, 0.04, outside) * inside;',
    '  col = mix(col, mix(vec3(0.07), vec3(0.97), dash), onEdge * uEyeRing * inside);',
    '  col = mix(col, vec3(0.97), handle * uEyeRing * inside);',
    '  float ring = smoothstep(uMouseR - 0.005, uMouseR - 0.002, md) - smoothstep(uMouseR, uMouseR + 0.003, md);',
    '  col = mix(col, vec3(0.97), ring * 0.7 * step(0.001, uMouseR));',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var DUST_VS = [
    'attribute vec3 position; attribute float aRnd;',
    'uniform mat4 uProj, uMV; uniform float uTime, uPR; varying float vR;',
    'void main(){',
    '  vec3 p = position;',
    '  p.y = mod(p.y + uTime * (0.04 + aRnd * 0.06) + 2.5, 5.0) - 2.5;',
    '  p.x += sin(uTime * 0.3 + aRnd * 6.28) * 0.15;',
    '  vec4 mv = uMV * vec4(p, 1.0);',
    '  gl_PointSize = (2.0 + aRnd * 5.0) * uPR * (4.0 / -mv.z);',
    '  gl_Position = uProj * mv; vR = aRnd;',
    '}'
  ].join('\n');
  var DUST_FS = PREC + [
    'uniform float uAlpha; varying float vR;',
    'void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * uAlpha * (0.25 + 0.75 * vR);',
    '  gl_FragColor = vec4(0.95, 0.9, 0.82, a); }'
  ].join('\n');

  // ---------- matrizes (coluna principal) ----------
  function ident() { var m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; }
  function mul(a, b) {
    var o = new Float32Array(16);
    for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) {
      var s = 0; for (var k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; o[i * 4 + j] = s;
    }
    return o;
  }
  function trans(x, y, z) { var m = ident(); m[12] = x; m[13] = y; m[14] = z; return m; }
  function scl(s) { var m = ident(); m[0] = m[5] = m[10] = s; return m; }
  function rx(t) { var c = Math.cos(t), s = Math.sin(t), m = ident(); m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m; }
  function ry(t) { var c = Math.cos(t), s = Math.sin(t), m = ident(); m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m; }
  function rz(t) { var c = Math.cos(t), s = Math.sin(t), m = ident(); m[0] = c; m[1] = s; m[4] = -s; m[5] = c; return m; }
  function persp(fovy, asp, n, f) {
    var t = 1 / Math.tan(fovy / 2), m = new Float32Array(16);
    m[0] = t / asp; m[5] = t; m[10] = (f + n) / (n - f); m[11] = -1; m[14] = (2 * f * n) / (n - f); return m;
  }
  // rotações inversas aplicadas a um vetor (para o pincel de cura)
  function invRot(v, ax, ay, az) {
    // R = Rx*Ry*Rz  =>  R^T v = Rz^T( Ry^T( Rx^T v ) )
    var c, s, x = v[0], y = v[1], z = v[2], t;
    c = Math.cos(ax); s = Math.sin(ax); t = c * y + s * z; z = -s * y + c * z; y = t;
    c = Math.cos(ay); s = Math.sin(ay); t = c * x - s * z; z = s * x + c * z; x = t;
    c = Math.cos(az); s = Math.sin(az); t = c * x + s * y; y = -s * x + c * y; x = t;
    return [x, y, z];
  }

  function compile(gl, type, src) {
    var sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  }
  function program(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var inf = gl.getActiveUniform(p, i); u[inf.name.replace('[0]', '')] = gl.getUniformLocation(p, inf.name); }
    return { p: p, u: u };
  }
  function ss(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function loadImg(src) {
    return new Promise(function (res, rej) { var im = new Image(); im.decoding = 'async'; im.onload = function () { res(im); }; im.onerror = rej; im.src = src; });
  }

  function mount(host, opts) {
    opts = opts || {};
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .8s ease';
    var gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!gl) return Promise.reject(new Error('sem WebGL'));
    host.appendChild(canvas);

    var P = program(gl, VS, FS), PD = program(gl, DUST_VS, DUST_FS);
    var STAGES = opts.stages;

    return loadImg(opts.src).then(function (img) {
      // reduz a textura para o tamanho útil
      var maxH = opts.maxTex || 1400, h = Math.min(img.naturalHeight, maxH), w = Math.round(h * img.naturalWidth / img.naturalHeight);
      var c2 = document.createElement('canvas'); c2.width = w; c2.height = h;
      c2.getContext('2d').drawImage(img, 0, 0, w, h);
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, c2);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      var A = w / h, B = 0.05, PW = A + 2 * B, PH = 1 + 2 * B, SEG = 72;
      // malha do plano
      var pos = [], uvs = [], idx = [];
      for (var iy = 0; iy <= SEG; iy++) for (var ix = 0; ix <= SEG; ix++) {
        var u = ix / SEG, v = iy / SEG;
        pos.push((u - 0.5) * PW, (v - 0.5) * PH, 0); uvs.push(u, v);
      }
      for (iy = 0; iy < SEG; iy++) for (ix = 0; ix < SEG; ix++) {
        var a = iy * (SEG + 1) + ix, b = a + 1, c = a + SEG + 1, d = c + 1;
        idx.push(a, b, d, a, d, c);
      }
      function buf(data, type) { var bf = gl.createBuffer(); gl.bindBuffer(type || gl.ARRAY_BUFFER, bf); gl.bufferData(type || gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); return bf; }
      var bPos = buf(new Float32Array(pos)), bUv = buf(new Float32Array(uvs)), bIdx = buf(new Uint16Array(idx), gl.ELEMENT_ARRAY_BUFFER);
      var NIDX = idx.length;

      var N = opts.reduced ? 50 : (opts.mobile ? 90 : 170), dp = new Float32Array(N * 3), dr = new Float32Array(N);
      for (var i = 0; i < N; i++) { dp[i * 3] = (Math.random() - 0.5) * 7; dp[i * 3 + 1] = (Math.random() - 0.5) * 5; dp[i * 3 + 2] = Math.random() * 3 - 0.5; dr[i] = Math.random(); }
      var bDP = buf(dp), bDR = buf(dr);

      var eye = opts.eye || [0.5, 0.6], box = opts.box || [0.19, 0.075], dpr = 1, W = 1, H = 1, fov = 32 * Math.PI / 180, camZ = 6;
      var proj = ident(), view = trans(0, 0, -camZ), model = ident();
      var st = { target: 0, p: 0, px: 0, py: 0, tx: 0, ty: 0, hover: 0, hoverT: 0, mouse: [-9, -9], rot: [0, 0, 0], pos: [0, 0], s: 1 };
      var visible = true, raf = 0, t0 = performance.now(), tReady = t0;

      function resize() {
        W = host.clientWidth || 1; H = host.clientHeight || 1;
        dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr || 2);
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        proj = persp(fov, W / H, 0.1, 50);
      }
      function place(zoom) {
        var L = opts.layout(W, H, A);
        var k = (2 * Math.tan(fov / 2) * camZ) / H;
        var s = (L.h * k) / PH;
        var cx = (L.cx - W / 2) * k, cy = -(L.cy - H / 2) * k;
        var ex = (eye[0] - 0.5) * A * s, ey = (eye[1] - 0.5) * s;
        st.s = s * zoom; st.pos = [cx + ex * (1 - zoom), cy + ey * (1 - zoom)];
      }
      resize();

      var io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 });
      io.observe(host);
      var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
      if (ro) ro.observe(host);

      gl.disable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 0);

      function frame() {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;
        var now = performance.now(), t = (now - t0) / 1000, S = STAGES;
        st.p += (st.target - st.p) * 0.14;
        var p = st.p;
        var uDust = 1 - ss(S[0], S[1], p), uScr = 1 - ss(S[1], S[2], p), uTear = 1 - ss(S[2], S[3], p),
            uCol = 1 - ss(S[3], S[4], p), uSharp = 1 - ss(S[4], S[5], p);
        var ring = ss(S[4] - 0.02, S[4] + 0.04, p) * (1 - ss(S[5] - 0.02, S[5] + 0.03, p));
        var warp = 1 - ss(0.06, S[5], p);
        var intro = opts.reduced ? 1 : ss(0, 1, (now - tReady - 300) / 1600);
        var zI = opts.mobile ? 0.12 : 0.5, zE = opts.mobile ? 0.22 : 0.38;
        var zoom = 1 + zI * intro * (1 - ss(0, S[0], p)) + zE * ss(S[4] - 0.01, S[4] + 0.06, p) * (1 - ss(S[5] - 0.03, S[5] + 0.04, p));
        place(zoom);
        st.px += (st.tx - st.px) * 0.06; st.py += (st.ty - st.py) * 0.06;
        var sw = opts.reduced ? 0 : 1;
        st.rot = [-0.32 * warp + st.py * 0.12 + Math.sin(t * 0.5) * 0.03 * warp * sw,
                  0.22 * warp + st.px * 0.16 + Math.sin(t * 0.37) * 0.05 * warp * sw,
                  -0.05 * warp];
        st.hover += (st.hoverT - st.hover) * 0.15;
        var mouseR = st.hover > 0.01 ? st.hover * 0.14 : 0;

        model = mul(trans(st.pos[0], st.pos[1], 0), mul(rx(st.rot[0]), mul(ry(st.rot[1]), mul(rz(st.rot[2]), scl(st.s)))));
        var mv = mul(view, model);

        gl.clear(gl.COLOR_BUFFER_BIT);
        // foto
        gl.disable(gl.BLEND);
        gl.useProgram(P.p); var U = P.u;
        gl.uniformMatrix4fv(U.uProj, false, proj); gl.uniformMatrix4fv(U.uMV, false, mv);
        gl.uniform1f(U.uWarp, warp); gl.uniform1f(U.uTime, t);
        gl.uniform1i(U.uTex, 0); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform2f(U.uTexel, 1 / w, 1 / h); gl.uniform2f(U.uEye, eye[0], eye[1]); gl.uniform2f(U.uHs, box[0], box[1]);
        gl.uniform2f(U.uMouse, st.mouse[0], st.mouse[1]); gl.uniform2f(U.uLight, -0.8 + st.px * 0.6, 0.5 - st.py * 0.4);
        gl.uniform1f(U.uA, A); gl.uniform1f(U.uB, B);
        gl.uniform1f(U.uDust, uDust); gl.uniform1f(U.uScratch, uScr); gl.uniform1f(U.uTear, uTear);
        gl.uniform1f(U.uColor, uCol); gl.uniform1f(U.uSharp, uSharp); gl.uniform1f(U.uEyeRing, ring); gl.uniform1f(U.uMouseR, mouseR);
        var aP = gl.getAttribLocation(P.p, 'position'), aU = gl.getAttribLocation(P.p, 'uv');
        gl.bindBuffer(gl.ARRAY_BUFFER, bPos); gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bUv); gl.enableVertexAttribArray(aU); gl.vertexAttribPointer(aU, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bIdx);
        gl.drawElements(gl.TRIANGLES, NIDX, gl.UNSIGNED_SHORT, 0);
        gl.disableVertexAttribArray(aU);
        // poeira no ar
        gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(PD.p); var V = PD.u;
        gl.uniformMatrix4fv(V.uProj, false, proj); gl.uniformMatrix4fv(V.uMV, false, view);
        gl.uniform1f(V.uTime, opts.reduced ? 0 : t); gl.uniform1f(V.uPR, dpr); gl.uniform1f(V.uAlpha, 0.2 + 0.8 * uDust);
        var dP = gl.getAttribLocation(PD.p, 'position'), dR = gl.getAttribLocation(PD.p, 'aRnd');
        gl.bindBuffer(gl.ARRAY_BUFFER, bDP); gl.enableVertexAttribArray(dP); gl.vertexAttribPointer(dP, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bDR); gl.enableVertexAttribArray(dR); gl.vertexAttribPointer(dR, 1, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, N);
        gl.disableVertexAttribArray(dR);
      }
      raf = requestAnimationFrame(frame);
      requestAnimationFrame(function () { canvas.style.opacity = '1'; });

      return {
        setProgress: function (v) { st.target = v; },
        setPointer: function (clientX, clientY, active) {
          var r = host.getBoundingClientRect();
          st.tx = ((clientX - r.left) / r.width) * 2 - 1; st.ty = ((clientY - r.top) / r.height) * 2 - 1;
          if (!opts.heal || !active) { st.hoverT = 0; return false; }
          // raio da câmera até o plano da foto (no espaço do modelo)
          var th = Math.tan(fov / 2), asp = r.width / r.height;
          var d = [st.tx * th * asp, -st.ty * th, -1], o = [0 - st.pos[0], 0 - st.pos[1], camZ];
          var dm = invRot(d, st.rot[0], st.rot[1], st.rot[2]), om = invRot(o, st.rot[0], st.rot[1], st.rot[2]);
          if (Math.abs(dm[2]) < 1e-6) { st.hoverT = 0; return false; }
          var k = -om[2] / dm[2], hx = (om[0] + k * dm[0]) / st.s, hy = (om[1] + k * dm[1]) / st.s;
          var u = hx / PW + 0.5, v = hy / PH + 0.5;
          if (u < 0 || u > 1 || v < 0 || v > 1) { st.hoverT = 0; return false; }
          st.hoverT = 1; st.mouse = [u, v]; return true;
        },
        resize: resize,
        dispose: function () { cancelAnimationFrame(raf); io.disconnect(); if (ro) ro.disconnect(); canvas.remove(); }
      };
    });
  }

  window.RestaurarGL = { mount: mount };
})();
