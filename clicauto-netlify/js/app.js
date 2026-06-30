'use strict';

/* ── Logos par défaut (Wikimedia Commons) ─────────────────── */
(function _initDefaultLogos() {
  const DEFAULTS = {
    'renault':'https://commons.wikimedia.org/wiki/Special:FilePath/Renault_2021_Text.svg',
    'dacia':'https://commons.wikimedia.org/wiki/Special:FilePath/Dacia_2021_logo.svg',
    'volkswagen':'https://commons.wikimedia.org/wiki/Special:FilePath/Volkswagen_-_Logo.svg',
    'peugeot':'https://commons.wikimedia.org/wiki/Special:FilePath/Peugeot_2021_Logo.svg',
    'citroen':'https://commons.wikimedia.org/wiki/Special:FilePath/Citroën_2022_logo.svg',
    'hyundai':'https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai_Motor_Company_logo.svg',
    'kia':'https://commons.wikimedia.org/wiki/Special:FilePath/KIA_logo2.svg',
    'toyota':'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota.svg',
    'nissan':'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_2020_logo.svg',
    'ford':'https://commons.wikimedia.org/wiki/Special:FilePath/Ford_Motor_Company_Logo.svg',
    'mercedes-benz':'https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_logo.svg',
    'bmw':'https://commons.wikimedia.org/wiki/Special:FilePath/BMW_logo_(gray).svg',
    'audi':'https://commons.wikimedia.org/wiki/Special:FilePath/Audi_logo_detail.svg',
    'seat':'https://commons.wikimedia.org/wiki/Special:FilePath/SEAT_logo.svg',
    'skoda':'https://commons.wikimedia.org/wiki/Special:FilePath/Skoda_auto_2016_logo.svg',
    'fiat':'https://commons.wikimedia.org/wiki/Special:FilePath/Fiat_logo.svg',
    'opel':'https://commons.wikimedia.org/wiki/Special:FilePath/Opel_logo_2021.svg',
    'mitsubishi':'https://commons.wikimedia.org/wiki/Special:FilePath/Mitsubishi_logo.svg',
    'suzuki':'https://commons.wikimedia.org/wiki/Special:FilePath/Suzuki_logo_2.svg',
    'mazda':'https://commons.wikimedia.org/wiki/Special:FilePath/Mazda_logo.svg',
    'honda':'https://commons.wikimedia.org/wiki/Special:FilePath/Honda_Logo.svg',
    'chevrolet':'https://commons.wikimedia.org/wiki/Special:FilePath/Chevrolet.svg',
    'alfa romeo':'https://commons.wikimedia.org/wiki/Special:FilePath/Alfa_Romeo_logo.svg',
    'volvo':'https://commons.wikimedia.org/wiki/Special:FilePath/Volvo-cars-logo.svg',
    'land rover':'https://commons.wikimedia.org/wiki/Special:FilePath/Land_Rover_logo.svg',
    'jeep':'https://commons.wikimedia.org/wiki/Special:FilePath/Jeep_logo.svg',
    'porsche':'https://commons.wikimedia.org/wiki/Special:FilePath/Porsche_logo.svg',
    'subaru':'https://commons.wikimedia.org/wiki/Special:FilePath/Subaru_logo.svg',
    'lexus':'https://commons.wikimedia.org/wiki/Special:FilePath/Lexus_logo.svg',
    'jaguar':'https://commons.wikimedia.org/wiki/Special:FilePath/Jaguar_Cars_logo.svg',
    'mini':'https://commons.wikimedia.org/wiki/Special:FilePath/MINI_logo_black.svg',
    'isuzu':'https://commons.wikimedia.org/wiki/Special:FilePath/Isuzu_logo.svg',
  };
  try {
    const logos = JSON.parse(localStorage.getItem('clicauto_brand_logos') || '{}');
    let changed = false;
    Object.entries(DEFAULTS).forEach(([k, v]) => { if (!logos[k]) { logos[k] = v; changed = true; } });
    if (changed) localStorage.setItem('clicauto_brand_logos', JSON.stringify(logos));
  } catch {}
})();

/* ════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════ */
function _vehSub(p) {
  return [p.brand, p.model, p.years].filter(Boolean).join(' · ');
}

/* Exception optiques : GAUCHE = scaleX(-1), DROITE = naturelle (inverse du reste) */
function _shouldFlipPhoto(p) {
  if (p._cat === 'optiques') {
    return /GAUCHE/i.test(p.side || p.name || '');
  }
  return !!p._mirrorPhoto;
}

function _yearStr(years) {
  if (!years) return '';
  const m = years.match(/(\d{4})/g);
  if (!m) return years;
  if (m.length >= 2) return m[0] + '–' + m[m.length - 1];
  return m[0];
}

function _stripWord(str, word) {
  if (!word) return str;
  return str.replace(new RegExp('\\s*' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*', 'gi'), ' ').trim();
}

// Catégorie → forme singulière canonique (utilisée pour corriger n'importe quel nom futur)
const CAT_SINGULAR = {
  'feux-arriere': { find:/\bfeux\b/gi,          sing:'Feu'         },
  'optiques':     { find:/\boptiques?\b/gi,      sing:'Optique'     },
  'ailes':        { find:/\bailes?\b/gi,         sing:'Aile'        },
  'retroviseurs': { find:/\bretroviseurs?\b/gi,  sing:'Rétroviseur' },
  'portes':       { find:/\bportes?\b/gi,        sing:'Porte'       },
  'capots':       { find:/\bcapots?\b/gi,        sing:'Capot'       },
  'coffres':      { find:/\bcoffres?\b/gi,       sing:'Coffre'      },
  'vitres':       { find:/\bvitres?\b/gi,        sing:'Vitre'       },
  'radiateurs':   { find:/\bradiateurs?\b/gi,    sing:'Radiateur'   },
  'housses':      { find:/\bhousses?\b/gi,       sing:'Housse'      },
  'pare-chocs':   null,  // invariable
};

// Pluriel → singulier : noms ET adjectifs (clé = _norm() du pluriel)
const _SING_MAP = {
  // Noms de pièces
  'feux':'Feu','ailes':'Aile','optiques':'Optique',
  'retroviseurs':'Rétroviseur','retros':'Rétro',
  'portes':'Porte','capots':'Capot','coffres':'Coffre',
  'vitres':'Vitre','radiateurs':'Radiateur','housses':'Housse',
  'phares':'Phare','boucliers':'Bouclier','grilles':'Grille',
  'jantes':'Jante','spoilers':'Spoiler','becquets':'Becquet',
  'marchepieds':'Marchepied','passages':'Passage',
  // Adjectifs couleur
  'rouges':'Rouge','blancs':'Blanc','blanches':'Blanche',
  'noirs':'Noir','noires':'Noire','gris':'Gris',
  'chromes':'Chromé','fumes':'Fumé','teintes':'Teinté',
  'transparents':'Transparent','clairs':'Clair','sombres':'Sombre',
  'bleus':'Bleu','bleues':'Bleue','verts':'Vert','vertes':'Verte',
  // Adjectifs position/type
  'arrieres':'Arrière','avants':'Avant',
  'lateraux':'Latéral','laterales':'Latérale',
  'interieurs':'Intérieur','interieures':'Intérieure',
  'exterieurs':'Extérieur','exterieures':'Extérieure',
  'complets':'Complet','completes':'Complète',
  'electriques':'Électrique','neufs':'Neuf',
};

function _singularize(name, catId) {
  // 1. Remplacement spécifique à la catégorie (nom principal)
  if (catId && CAT_SINGULAR[catId]) {
    const { find, sing } = CAT_SINGULAR[catId];
    name = name.replace(find, (m) => m[0] === m[0].toUpperCase() ? sing : sing.toLowerCase());
  }
  // 2. Passage mot par mot pour les adjectifs et noms restants (toujours appliqué)
  return name.split(/\s+/).map(w => {
    if (!w) return w;
    const k = _norm(w);
    if (!_SING_MAP[k]) return w;
    // Preserve original capitalisation: uppercase first char → use map's form, else lowercase
    const startsUpper = w[0] && w[0] !== w[0].toLowerCase();
    return startsUpper ? _SING_MAP[k] : _SING_MAP[k].toLowerCase();
  }).join(' ');
}

function _displayName(p) {
  let name = p.name || '';
  name = _stripWord(name, p.side);
  name = _stripWord(name, p.brand);
  // Strip full model ("Sandero 3") then short base name ("Sandero")
  name = _stripWord(name, p.model);
  if (p.model) {
    const shortMod = _shortModelDisplay(p.model);
    if (shortMod && shortMod !== p.model) name = _stripWord(name, shortMod);
  }
  // Strip year ranges and standalone years — already shown in the vehicle subtitle
  name = name.replace(/\b(19|20)\d{2}\s*[-–\/]\s*(19|20)\d{2}\b/g, ' ');
  name = name.replace(/\b(19|20)\d{2}\b/g, ' ');
  name = name.replace(/\s{2,}/g, ' ').trim();
  return _singularize(name, p._cat);
}

/* ════════════════════════════════════════
   STATE
   ════════════════════════════════════════ */
const S = {
  brand:   0,
  model:   0,
  year:    0,
  cat:     0,
  cart:    [],
  vehicle: null
};

/* ════════════════════════════════════════
   SIZING — dimensions fixées en JS, pas en CSS
   ════════════════════════════════════════ */
function _sizeApp() {
  if (window.innerWidth >= 1024) {
    _initPcMode();
    return;
  }
  const app = document.getElementById('app');
  if (!app) return;
  if (window.innerWidth >= 500) {
    /* Desktop : iPhone mockup 430 × 92vh centré */
    const h = Math.round(Math.min(window.innerHeight * 0.92, 932));
    app.style.width    = '430px';
    app.style.height   = h + 'px';
    app.style.position = 'relative';
    app.style.top      = '';
    app.style.left     = '';
  } else {
    /* Mobile : plein écran exact en pixels */
    app.style.width    = window.innerWidth  + 'px';
    app.style.height   = window.innerHeight + 'px';
    app.style.position = 'fixed';
    app.style.top      = '0';
    app.style.left     = '0';
  }
}
window.addEventListener('resize', _sizeApp);

/* ════════════════════════════════════════
   PAGE NAVIGATION
   Principe :
   • visibility:hidden (CSS) = caché sans reflow
   • transform: translateX GPU-accéléré = 60 fps garanti
   • Aucun changement display → zéro layout recalculation
   ════════════════════════════════════════ */
let _current = 'pg-vehicle';
const PAGE_IDS = ['pg-vehicle','pg-products','pg-checkout','pg-contact'];

let _navTimer = null;

function _pageEl(id) { return document.getElementById(id); }
function _cls()      { return 'page'; } /* compat legacy */

function goPage(toId, opts = {}) {
  if (_current === toId) return;
  const fromId = _current;
  const back   = opts.back || false;
  const toEl   = _pageEl(toId);
  const fromEl = _pageEl(fromId);
  if (!toEl || !fromEl) return;

  _current = toId;
  clearTimeout(_navTimer);

  /* 1. Cache la page sortante (visibility:hidden via CSS) */
  fromEl.className = 'page';

  /* 2. Anime la page entrante — GPU transform, pas de reflow */
  toEl.scrollTop = 0;
  toEl.className = back ? 'page pg-in-l' : 'page pg-in-r';

  /* 3. Stable après animation */
  _navTimer = setTimeout(() => { toEl.className = 'page pg-active'; }, 330);
}

function goBack(toId) { goPage(toId, { back: true }); }

function goHome() {
  if (_current === 'pg-vehicle') return;
  PAGE_IDS.forEach(id => {
    if (id !== 'pg-vehicle') _pageEl(id).className = 'page';
  });
  const prev = _current;
  _current = prev === 'pg-vehicle' ? 'pg-contact' : prev;
  goPage('pg-vehicle', { back: true });
}

/* ════════════════════════════════════════
   DRUM PICKER — no logos, names only
   ════════════════════════════════════════ */
const ROW_H = 44;

/* Abrège le nom du modèle pour l'affichage dans le picker :
   "Classe A W176" → "Classe A", "Golf 7" → "Golf", "Corsa D" → "Corsa"
   Le nom complet est conservé dans S.vehicle pour le filtre page 2. */
function _shortModelDisplay(name) {
  if (!name || typeof name !== 'string') return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name;
  const last = parts[parts.length - 1];
  if (
    /^\d$/.test(last) ||              // chiffre seul : 1,2,3,7,8
    /^[A-Za-z]+\d+$/.test(last) ||   // lettre(s)+chiffre(s) : W176, F30, E90, B5, T6
    /^\d+[A-Za-z]+$/.test(last) ||   // chiffre(s)+lettre(s) : rare
    /^[A-Z]{1,3}$/.test(last)        // 1-3 lettres maj : B, C, BK, JL, TJ
  ) {
    const base = parts.slice(0, -1).join(' ');
    return base || name;
  }
  return name;
}

function _buildItems(colEl, items, isBrand) {
  const inner = colEl.querySelector('.pcol-inner');
  inner.innerHTML = '';
  // Logos de marques uploadés dans l'admin
  let brandLogos = {};
  if (isBrand) {
    try { brandLogos = JSON.parse(localStorage.getItem('clicauto_brand_logos') || '{}'); } catch {}
  }
  items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'pitem';
    div.dataset.i = i;
    const label = typeof item === 'number' ? item : (item.name || item);
    if (isBrand && brandLogos[String(label).toLowerCase()]) {
      const src = brandLogos[String(label).toLowerCase()];
      div.innerHTML = `<img class="pitem-logo" src="${src.replace(/"/g,'&quot;')}" alt="${label}">`;
    } else {
      div.innerHTML = `<span class="pitem-label">${label}</span>`;
    }
    inner.appendChild(div);
  });
}

function _syncHighlight(colEl) {
  const sc = colEl.scrollTop;
  const center = sc / ROW_H;
  colEl.querySelectorAll('.pitem').forEach((el, i) => {
    const d = Math.abs(i - center);
    const sel = d < .55;
    el.classList.toggle('is-sel',  sel);
    el.classList.toggle('is-near', d >= .55 && d < 1.55);
    el.style.opacity = Math.max(.08, 1 - d * .52);
    el.style.transform = '';

    const lbl = el.querySelector('.pitem-label');
    if (sel && lbl) {
      lbl.classList.remove('ticker');
      lbl.style.removeProperty('--tk');
      requestAnimationFrame(() => {
        const over = lbl.scrollWidth - lbl.offsetWidth;
        if (over > 4) {
          lbl.style.setProperty('--tk', `-${over + 8}px`);
          lbl.classList.add('ticker');
        }
      });
    } else if (lbl) {
      lbl.classList.remove('ticker');
      lbl.style.removeProperty('--tk');
    }
  });
}

function _scrollTo(colEl, idx, instant) {
  if (instant) colEl.scrollTop = idx * ROW_H;
  else colEl.scrollTo({ top: idx * ROW_H, behavior: 'smooth' });
}

/* Effet roulette smooth — une seule courbe organique, aucune rupture de phase */
function _colSpinIntro(colEl, duration, delay) {
  const n = colEl.querySelectorAll('.pitem').length;
  if (n < 3) return;
  const startIdx = Math.min(n - 1, Math.max(7, Math.floor(n * 0.82)));
  setTimeout(() => {
    colEl.style.scrollSnapType = 'none';
    colEl.scrollTop = startIdx * ROW_H;
    _syncHighlight(colEl);
    const startTop = startIdx * ROW_H;
    const t0 = performance.now();

    // Courbe unique : smoothstep sur un temps distordu
    // t^0.82 étire le début (départ doux), comprime la fin (atterrissage très progressif)
    // smoothstep garantit vitesse=0 au départ ET à l'arrivée — aucun à-coup
    const ease = t => {
      const u = Math.pow(t, 0.78);
      return u * u * (3 - 2 * u);
    };

    const frame = now => {
      const t = Math.min((now - t0) / duration, 1);
      colEl.scrollTop = Math.max(0, startTop * (1 - ease(t)));
      _syncHighlight(colEl);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        colEl.scrollTop = 0;
        _syncHighlight(colEl);
        // Restaure le snap immédiatement avec scroll-behavior:auto pour éviter
        // tout re-snap animé par le navigateur (cause du "disparaître/revenir")
        colEl.style.scrollBehavior = 'auto';
        colEl.style.scrollSnapType = '';
        requestAnimationFrame(() => { colEl.style.scrollBehavior = ''; });
      }
    };
    requestAnimationFrame(frame);
  }, delay);
}

function _attachColumn(colId, onEnd) {
  const col = document.getElementById(colId);
  let t;
  col.addEventListener('scroll', () => {
    _syncHighlight(col);
    clearTimeout(t);
    t = setTimeout(() => {
      const idx = Math.round(col.scrollTop / ROW_H);
      const max = col.querySelectorAll('.pitem').length - 1;
      const clamped = Math.max(0, Math.min(idx, max));
      _scrollTo(col, clamped);
      onEnd(clamped);
      _syncHighlight(col);
    }, 120);
  }, { passive: true });
}

// Construit les données du picker depuis les véhicules admin (clicauto_vehicles)
// Structure: [{name, models:[{shortName, years:[2026,...], variants:[{name,years:[]}]}]}]
let _PD = null;

function _parseYearsRange(s) {
  const nums = (s || '').match(/\d{4}/g) || [];
  if (!nums.length) return [];
  if (nums.length === 1) return [+nums[0]];
  const a = +nums[0], b = +nums[nums.length - 1];
  const from = Math.min(a, b), to = Math.max(a, b);
  const out = [];
  for (let y = to; y >= from; y--) out.push(y);
  return out;
}

function _buildPickerData() {
  let vehs = [];
  const fbVehs = window.FIREBASE_DATA && window.FIREBASE_DATA.vehicles;
  if (fbVehs && fbVehs.length) {
    vehs = fbVehs;
  } else {
    try { vehs = JSON.parse(localStorage.getItem('clicauto_vehicles') || '[]'); } catch {}
  }
  if (!vehs.length) return null;

  const bMap = {};
  vehs.forEach(v => {
    const bn = (v.brand || '').trim();
    const mn = (v.model || '').trim();
    if (!bn || !mn) return;
    const bk = bn.toLowerCase();
    if (!bMap[bk]) bMap[bk] = { name: bn, shortModels: {} };
    // Grouper par nom court
    const shortName = _shortModelDisplay(mn) || mn;
    const sk = shortName.toLowerCase();
    if (!bMap[bk].shortModels[sk]) bMap[bk].shortModels[sk] = { shortName, variants: {} };
    const mk = mn.toLowerCase();
    if (!bMap[bk].shortModels[sk].variants[mk]) {
      bMap[bk].shortModels[sk].variants[mk] = { name: mn, years: new Set() };
    }
    _parseYearsRange(v.years || '').forEach(y => bMap[bk].shortModels[sk].variants[mk].years.add(y));
  });

  return Object.values(bMap).map(b => ({
    name: b.name,
    models: Object.values(b.shortModels).map(sm => {
      const variants = Object.values(sm.variants).map(v => ({
        name: v.name,
        years: Array.from(v.years).sort((a, z) => z - a)
      }));
      // Union de toutes les années pour ce nom court
      const allYears = [...new Set(variants.flatMap(v => v.years))].sort((a, z) => z - a);
      return { shortName: sm.shortName, years: allYears, variants };
    })
  }));
}

function _pdYears(bIdx, mIdx) {
  try {
    const yrs = _PD[bIdx].models[mIdx].years;
    return (yrs && yrs.length) ? yrs : YEARS;
  } catch { return YEARS; }
}

// Résout l'année sélectionnée → nom complet du modèle (génération précise)
function _pdResolveModel(bIdx, mIdx, yearVal) {
  try {
    const modelGroup = _PD[bIdx].models[mIdx];
    if (!modelGroup) return null;
    // Trouver la variante dont l'intervalle couvre l'année choisie
    const match = modelGroup.variants.find(v => v.years.includes(yearVal));
    return match ? match.name : (modelGroup.variants[0] ? modelGroup.variants[0].name : modelGroup.shortName);
  } catch { return null; }
}

let _pickerListenersAttached = false;

let _pickerGetBrands = () => BRANDS;
let _pickerGetModels = bIdx => (BRANDS[bIdx] || BRANDS[0]).models;
let _pickerGetYears  = (bIdx, mIdx) => YEARS;
let _useAdminPicker  = false;

function _pickerFill() {
  const brandCol = document.getElementById('c-brand');
  const modelCol = document.getElementById('c-model');
  const yearCol  = document.getElementById('c-year');
  if (!brandCol || !modelCol || !yearCol) return;

  // Toujours utiliser la liste complète BRANDS — le picker admin Firebase
  // ne remplace plus la liste client (cause : picker vide sur iOS Safari)
  _PD = null;
  _useAdminPicker = false;

  const _dedup = bIdx => {
    const seen = new Set(); const out = [];
    ((BRANDS[bIdx] || BRANDS[0]).models || []).forEach(m => {
      const s = _shortModelDisplay(m) || m;
      const k = s.toLowerCase();
      if (!seen.has(k)) { seen.add(k); out.push(s); }
    });
    return out;
  };
  _pickerGetBrands = ()           => BRANDS;
  _pickerGetModels = bIdx         => _dedup(bIdx);
  _pickerGetYears  = (bIdx, mIdx) => YEARS;

  try {
    _buildItems(brandCol, BRANDS, true);
    _buildItems(modelCol, _dedup(0), false);
    _buildItems(yearCol,  YEARS, false);
  } catch(e) {
    console.error('[picker]', e);
  }
  S.brand = 0; S.model = 0; S.year = 0;

  // Double rAF : attend 2 frames pour que iOS Safari termine le layout
  // avant de fixer scrollTop — sinon le snap CSS réinitialise à une mauvaise position
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      brandCol.scrollTop = 0;
      modelCol.scrollTop = 0;
      yearCol.scrollTop  = 0;
      _syncHighlight(brandCol);
      _syncHighlight(modelCol);
      _syncHighlight(yearCol);
    });
  });
}

function initPicker() {
  const brandCol = document.getElementById('c-brand');
  const modelCol = document.getElementById('c-model');
  const yearCol  = document.getElementById('c-year');
  if (!brandCol || !modelCol || !yearCol) return;

  _pickerFill();

  // Attache les listeners UNE SEULE FOIS
  if (!_pickerListenersAttached) {
    _pickerListenersAttached = true;
    _attachColumn('c-brand', idx => {
      S.brand = idx; S.model = 0; S.year = 0;
      _buildItems(modelCol, _pickerGetModels(idx), false);
      _scrollTo(modelCol, 0, true); _syncHighlight(modelCol);
      _buildItems(yearCol, _pickerGetYears(idx, 0), false);
      _scrollTo(yearCol, 0, true); _syncHighlight(yearCol);
    });
    _attachColumn('c-model', idx => {
      S.model = idx; S.year = 0;
      _buildItems(yearCol, _pickerGetYears(S.brand, idx), false);
      _scrollTo(yearCol, 0, true); _syncHighlight(yearCol);
    });
    _attachColumn('c-year', idx => { S.year = idx; });
  }
}

/* ════════════════════════════════════════
   SEARCH (HOME + PRODUCTS PAGE)
   ════════════════════════════════════════ */
function _norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/* \u2500\u2500\u2500 Fuzzy distance (Levenshtein) \u2500\u2500\u2500 */
function _lev(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = a.length, n = b.length;
  let prev = Array.from({length:n+1},(_,i)=>i), curr = [];
  for (let i=1;i<=m;i++) {
    curr[0]=i;
    for (let j=1;j<=n;j++)
      curr[j]=a[i-1]===b[j-1]?prev[j-1]:1+Math.min(prev[j-1],prev[j],curr[j-1]);
    [prev,curr]=[curr,prev];
  }
  return prev[n];
}

function _fuzzyMatch(query, target) {
  if (!query || !target) return false;
  if (target.includes(query)) return true;
  const q = query, t = target;
  // Accept 1 error per 4 chars
  const maxDist = Math.floor(q.length / 4);
  if (maxDist === 0) return t.includes(q);
  // Sliding window comparison
  for (let i = 0; i <= t.length - q.length + maxDist; i++) {
    const window = t.slice(i, i + q.length + maxDist);
    if (_lev(q, window.slice(0, q.length)) <= maxDist) return true;
  }
  return false;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   MOTEUR DE RECHERCHE INTELLIGENT
   Couvre : FR \u00b7 Darija \u00b7 EN \u00b7 ES \u00b7 fautes d'orthographe
   Sugg\u00e8re d\u00e8s la 1\u00e8re lettre, filtre lettre par lettre
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

// Chaque entr\u00e9e = { w: mot normalis\u00e9, c: catId, pri: priorit\u00e9 }
// pri 0 = alias exact  pri 1 = variante  pri 2 = approximation
const _RAW_ALIASES = [
  // \u2500\u2500 PARE-CHOCS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['pare-chocs','pare-choc','parechoc','para choc','para-choc','bouclier',0,'pare-chocs'],
  ['bumper','banbir','benpir','bonbir','bamper','bumber','bunper',1,'pare-chocs'],
  ['parachoques','defensa','stosstange','paraurti',2,'pare-chocs'],
  // \u2500\u2500 CAPOTS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['capot','capot moteur','capot avant',0,'capots'],
  ['kapot','kabout','capo','gapo','kabo',1,'capots'],
  ['hood','bonnet','capo delantero',2,'capots'],
  // \u2500\u2500 PORTES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['portiere','porti\u00e8re','porte','porte avant','porte arriere',0,'portes'],
  ['lbab','bab','portogir','bortogir','bortogal','bortogear','porta',1,'portes'],
  ['door','car door','puerta','portiera','tur',2,'portes'],
  ['poignee porte','poignee','serrure porte','leve vitre',0,'portes'],
  // \u2500\u2500 OPTIQUES / PHARES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['optique','phare','phare avant','feu avant','projecteur','antibrouillard','xenon','led','drl',0,'optiques'],
  ['faro','far','fars','faros','nour',1,'optiques'],
  ['headlight','headlamp','fog light','koplamp','luz delantera',2,'optiques'],
  // \u2500\u2500 FEUX ARRI\u00c8RE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['feu arriere','feux arriere','feu arri\u00e8re','feux arri\u00e8re','feu stop','cabochon','cataphote','feu recul',0,'feux-arriere'],
  ['stop','stob','arret','stope',1,'feux-arriere'],
  ['tail light','brake light','rear light','luz trasera','achterlicht',2,'feux-arriere'],
  // \u2500\u2500 R\u00c9TROVISEURS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['retroviseur','r\u00e9troviseur','retro','coque retroviseur','glace retroviseur',0,'retroviseurs'],
  ['mir','miro','miroir lateral',1,'retroviseurs'],
  ['mirror','side mirror','wing mirror','espejo','retrovisor',2,'retroviseurs'],
  // \u2500\u2500 AILES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['aile','aile avant','aile arriere','passage de roue','passage roue',0,'ailes'],
  ['jnah','wenga','jhna',1,'ailes'],
  ['fender','wing','aleta','spatbord',2,'ailes'],
  // \u2500\u2500 VITRES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['vitre','vitrage','glace','pare-brise','parebrise','lunette arriere','carreau',0,'vitres'],
  ['zujaj','zuwaj','zuaj','zuwwaj','zwaj','zwej',1,'vitres'],
  ['window','windshield','windscreen','glass','parabrisa','cristal',2,'vitres'],
  // \u2500\u2500 COFFRES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['coffre','hayon','hayon arriere','malle arriere',0,'coffres'],
  ['cofr','kofr','cofer','cofri',1,'coffres'],
  ['trunk','boot','kofferraum','maletero',2,'coffres'],
  // \u2500\u2500 RADIATEURS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['radiateur','condenseur','intercooler','echangeur thermique',0,'radiateurs'],
  ['radyator','radyatir',1,'radiateurs'],
  ['radiator','cooler','refrigerateur',2,'radiateurs'],
  // \u2500\u2500 HOUSSES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  ['housse siege','housse','bache siege','couvre siege',0,'housses'],
  ['seat cover','cover','tapa asiento',2,'housses'],
];

// Marques (alias phon\u00e9tiques Darija + fautes)
const BRAND_ALIASES = {
  'volkswagen':['vw','wolks','folks','folkswagen','wolkswagen','volk'],
  'mercedes':  ['merc','mirse','benz','merci','mersides'],
  'bmw':       ['beamo','bimo','bim','bimw'],
  'renault':   ['reno','rino','renol','renou','renos'],
  'peugeot':   ['pejo','peijo','peuje','pojot','peujo'],
  'citroen':   ['sitron','citron','sitroen','citoen'],
  'hyundai':   ['hyondai','hyundei','hundai','hundei'],
  'toyota':    ['tiyota','toyotta','toyata','tyota'],
  'nissan':    ['nisan','nissa','nisaan'],
  'audi':      ['oudi','awdi','aode'],
  'fiat':      ['fiyat','fyat','fiyate'],
  'opel':      ['opil','opale'],
  'dacia':     ['datsia','dacia','dachia'],
  'kia':       ['kiya','kia'],
  'seat':      ['sseat','siete','siat'],
  'skoda':     ['scoda','skoda'],
  'ford':      ['forde','fourd'],
  'honda':     ['hunda','hounda'],
  'mazda':     ['mazida','mezda'],
  'mitsubishi':['mitsubi','mitsibishi','subishi'],
  'suzuki':    ['suzugi','zuzuki'],
  'jeep':      ['djeep','jip'],
  'land rover':['landrover','land rouver','landrouver'],
  'range rover':['range','renge'],
};

// Index plat { norm, catId, pri }  (construit une fois au d\u00e9marrage)
let _SIDX = null;
function _getSIDX() {
  if (_SIDX) return _SIDX;
  _SIDX = [];
  for (const row of _RAW_ALIASES) {
    const catId = row[row.length-1];
    const pri   = typeof row[row.length-2] === 'number' ? row[row.length-2] : 1;
    const words = row.slice(0, row.length - (typeof row[row.length-2]==='number'?2:1));
    for (const w of words) {
      if (typeof w !== 'string') continue;
      _SIDX.push({ norm: _norm(w), catId, pri });
    }
  }
  return _SIDX;
}

// Recherche cat\u00e9gories par pr\u00e9fixe + fuzzy
function _catsByQuery(qn) {
  if (!qn || qn.length < 1) return [];
  const idx = _getSIDX();
  const hits = {};   // catId \u2192 score (plus bas = meilleur)
  const maxErr = qn.length <= 2 ? 0 : qn.length <= 4 ? 1 : 2;

  for (const { norm, catId, pri } of idx) {
    if (hits[catId] !== undefined && hits[catId] <= pri) continue;
    // 1. Pr\u00e9fixe exact (le plus important)
    if (norm.startsWith(qn)) { hits[catId] = pri; continue; }
    // 2. Un mot de l'alias commence par la requ\u00eate
    if (norm.split(' ').some(w => w.startsWith(qn))) { hits[catId] = pri + 0.5; continue; }
    // 3. Contenu exact
    if (norm.includes(qn)) { hits[catId] = pri + 1; continue; }
    // 4. Fuzzy pr\u00e9fixe (fautes d'orthographe)
    if (qn.length >= 3 && maxErr > 0) {
      const win = norm.slice(0, qn.length + maxErr);
      if (_lev(qn, win) <= maxErr) { hits[catId] = pri + 2; continue; }
      if (norm.split(' ').some(w => w.length >= 3 && _lev(qn, w.slice(0,qn.length+1)) <= maxErr)) {
        hits[catId] = pri + 2.5;
      }
    }
  }
  // Trier par score
  return Object.entries(hits).sort((a,b) => a[1]-b[1]).map(([c])=>c);
}

// Normalise marques (alias \u2192 nom officiel)
function _normBrand(raw) {
  const r = _norm(raw);
  for (const [brand, aliases] of Object.entries(BRAND_ALIASES)) {
    if (r === _norm(brand) || aliases.some(a => r === a || _lev(r, a) <= 1)) return brand;
  }
  return r;
}

/* ════════════════════════════════════════
   SCAN — OCR carte grise / pièce
   ════════════════════════════════════════ */
let _scanAbortFlag = false;

function _scanShowOverlay(msg) {
  const ov = document.getElementById('scan-overlay');
  const sp = document.getElementById('scan-spinner');
  const si = document.getElementById('scan-success-icon');
  const m  = document.getElementById('scan-msg');
  const cb = document.getElementById('scan-cancel-btn');
  if (!ov) return;
  if (sp) sp.style.display = '';
  if (si) si.style.display = 'none';
  if (m) m.textContent = msg;
  if (cb) cb.style.display = '';
  ov.style.display = 'flex';
}

function _scanUpdateMsg(msg) {
  const m = document.getElementById('scan-msg');
  if (m) m.textContent = msg;
}

function _scanShowSuccess(lines) {
  const sp = document.getElementById('scan-spinner');
  const si = document.getElementById('scan-success-icon');
  const m  = document.getElementById('scan-msg');
  const cb = document.getElementById('scan-cancel-btn');
  if (sp) sp.style.display = 'none';
  if (si) si.style.display = '';
  if (m) m.innerHTML = lines.map(l => `<span>${l}</span>`).join('<br>');
  if (cb) cb.style.display = 'none';
}

function _scanHide() {
  const ov = document.getElementById('scan-overlay');
  if (ov) ov.style.display = 'none';
}

function cancelScan() {
  _scanAbortFlag = true;
  _scanHide();
}

async function _loadTesseract() {
  if (window.Tesseract) return window.Tesseract;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.onload = () => resolve(window.Tesseract);
    s.onerror = () => reject(new Error('Tesseract CDN unavailable'));
    document.head.appendChild(s);
  });
}

function _parseVehicleFromScan(rawText) {
  const text = (rawText || '').replace(/\|/g, 'I');
  const up   = text.toUpperCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ').trim();

  // --- Champs carte grise (format CE : D.1 marque, D.2 type, B date) ---
  const d1m = up.match(/D\s*\.?\s*1\s*[:\-]?\s*([A-Z][A-Z\s\-]{1,22})/);
  const d2m = up.match(/D\s*\.?\s*2\s*[:\-]?\s*([A-Z0-9][A-Z0-9\s\-]{1,22})/);
  const bDate = text.match(/\b(\d{2})[\/\-](\d{2})[\/\-]((19|20)\d{2})\b/);
  const cgBrand = d1m ? d1m[1].trim().split(/\s+/)[0] : null;
  const cgYear  = bDate ? bDate[3] : null;

  // --- Correspondance marques ---
  const ALIASES = {
    'VOLKSWAGEN':'Volkswagen','VW':'Volkswagen',
    'RENAULT':'Renault','RENAUL':'Renault',
    'PEUGEOT':'Peugeot',
    'CITROEN':'Citroën','CITRO':'Citroën',
    'DACIA':'Dacia',
    'BMW':'BMW',
    'MERCEDES BENZ':'Mercedes-Benz','MERCEDES-BENZ':'Mercedes-Benz','MERCEDES':'Mercedes-Benz',
    'AUDI':'Audi',
    'TOYOTA':'Toyota',
    'FORD':'Ford',
    'OPEL':'Opel','VAUXHALL':'Opel',
    'FIAT':'Fiat',
    'SEAT':'Seat',
    'SKODA':'Skoda',
    'HYUNDAI':'Hyundai',
    'KIA':'Kia',
    'NISSAN':'Nissan',
    'HONDA':'Honda',
    'MAZDA':'Mazda',
    'MITSUBISHI':'Mitsubishi',
    'SUZUKI':'Suzuki',
    'VOLVO':'Volvo',
    'CHEVROLET':'Chevrolet',
    'ALFA ROMEO':'Alfa Romeo','ALFA':'Alfa Romeo',
    'LAND ROVER':'Land Rover','RANGE ROVER':'Land Rover',
    'JEEP':'Jeep',
    'PORSCHE':'Porsche',
    'SUBARU':'Subaru',
    'LEXUS':'Lexus',
    'JAGUAR':'Jaguar',
    'MINI':'Mini',
    'ISUZU':'Isuzu',
  };

  let foundBrand = null;

  // Priorité au champ D.1
  if (cgBrand) foundBrand = ALIASES[cgBrand] || null;

  // Sinon, scan complet (plus long en premier)
  if (!foundBrand) {
    const sorted = Object.keys(ALIASES).sort((a, b) => b.length - a.length);
    for (const alias of sorted) {
      if (up.includes(alias)) { foundBrand = ALIASES[alias]; break; }
    }
  }

  // --- Année ---
  let year = cgYear || null;
  if (!year) {
    const ym = up.match(/\b(19[8-9]\d|200\d|201\d|202[0-6])\b/g);
    if (ym && ym.length) year = ym[0];
  }

  // --- Modèle ---
  let foundModel = null;
  if (foundBrand) {
    const bObj = (BRANDS || []).find(b => b.name === foundBrand);
    if (bObj && bObj.models) {
      const sorted = [...bObj.models].sort((a, b) => b.length - a.length);
      for (const m of sorted) {
        const mu = m.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        if (up.includes(mu)) { foundModel = m; break; }
      }
    }
  }

  return { brand: foundBrand, model: foundModel, year };
}

async function startScan() {
  _scanAbortFlag = false;

  // Sélection d'image (camera sur mobile, fichier sur desktop)
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    fileInput.capture = 'environment';
  }

  fileInput.onchange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || _scanAbortFlag) return;

    _scanShowOverlay('Chargement du moteur OCR…');

    try {
      // Chargement Tesseract.js (CDN, une seule fois)
      const Tesseract = await _loadTesseract();
      if (_scanAbortFlag) return;

      _scanUpdateMsg('Lecture de l\'image…');

      const { data: { text } } = await Tesseract.recognize(file, 'fra+ara', {
        logger: m => {
          if (_scanAbortFlag) return;
          if (m.status === 'loading language traineddata') _scanUpdateMsg('Chargement du modèle de langue…');
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            _scanUpdateMsg(`Analyse du texte… ${pct}%`);
          }
        }
      });

      if (_scanAbortFlag) return;

      const result = _parseVehicleFromScan(text);

      if (result.brand) {
        // ✅ Véhicule identifié → filtrer le catalogue
        S.vehicle = {
          brand: result.brand,
          model: result.model || '',
          year:  result.year  || ''
        };
        const lines = [
          '✓ Véhicule trouvé',
          [result.brand, result.model, result.year].filter(Boolean).join(' · ')
        ];
        _scanShowSuccess(lines);
        setTimeout(() => { _scanHide(); openProducts(); }, 1400);

      } else {
        // 🔍 Pas de véhicule → chercher la pièce par texte
        const cleaned = text
          .replace(/\n+/g, ' ')
          .replace(/[^a-zA-ZÀ-ÿ0-9\s\-]/g, ' ')
          .replace(/\s{2,}/g, ' ').trim()
          .slice(0, 80);

        _scanHide();

        if (cleaned.length > 2) {
          // Injecter dans la barre de recherche et déclencher la recherche
          const inp = document.getElementById('home-search-input');
          if (inp) {
            inp.value = cleaned;
            inp.dispatchEvent(new Event('input'));
            // Scroll vers la barre
            inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
            inp.focus();
          }
        } else {
          alert('Impossible de lire le texte. Réessayez avec une photo plus nette.');
        }
      }

    } catch (err) {
      _scanHide();
      if (!_scanAbortFlag) {
        alert('Erreur lors de l\'analyse. Vérifiez votre connexion internet et réessayez.');
      }
    }
  };

  fileInput.click();
}

function handleSearch() {
  const btn = document.getElementById('btn-search');
  btn.classList.add('loading');
  btn.disabled = true;

  const brands = _pickerGetBrands();
  const brandEntry = brands[S.brand];
  const brandName = brandEntry
    ? (typeof brandEntry === 'string' ? brandEntry : (brandEntry.name || null))
    : null;

  if (brandName) {
    const years = _pickerGetYears(S.brand, S.model);
    const yearVal = years[S.year];

    let fullModelName;
    if (_useAdminPicker) {
      // Résolution précise : l'année sélectionnée détermine la génération exacte
      fullModelName = _pdResolveModel(S.brand, S.model, yearVal)
        || (_pickerGetModels(S.brand)[S.model] || '');
    } else {
      const modelEntry = _pickerGetModels(S.brand)[S.model];
      fullModelName = modelEntry ? (typeof modelEntry === 'string' ? modelEntry : (modelEntry.name || '')) : '';
    }

    S.vehicle = { brand: brandName, model: fullModelName, year: yearVal !== undefined ? String(yearVal) : '' };
  } else {
    S.vehicle = null;
  }

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;
    openProducts();
  }, 380);
}

function _stripWhiteBg(dataUrl, cb, outW, outH) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    // 1. Dessiner sur canvas
    const cv = document.createElement('canvas');
    cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, cv.width, cv.height);
    const px = d.data; const w = cv.width; const h = cv.height;

    // 2. Flood-fill depuis les 4 coins pour effacer le fond blanc
    const vis = new Uint8Array(w * h);
    const thr = 235;
    const fill = (sx, sy) => {
      const stack = [sy * w + sx];
      while (stack.length) {
        const pos = stack.pop();
        if (pos < 0 || pos >= w * h || vis[pos]) continue;
        vis[pos] = 1;
        const i = pos * 4;
        if (px[i] < thr || px[i+1] < thr || px[i+2] < thr) continue;
        px[i+3] = 0;
        const x = pos % w, y = (pos / w) | 0;
        if (x > 0)   stack.push(pos - 1);
        if (x < w-1) stack.push(pos + 1);
        if (y > 0)   stack.push(pos - w);
        if (y < h-1) stack.push(pos + w);
      }
    };
    fill(0, 0); fill(w-1, 0); fill(0, h-1); fill(w-1, h-1);
    ctx.putImageData(d, 0, 0);

    // 3. Auto-crop : bounding box des pixels non-transparents
    let minX = w, maxX = 0, minY = h, maxY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (px[(y * w + x) * 4 + 3] > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX <= minX || maxY <= minY) { cb(dataUrl); return; }

    // 4. Ajouter une marge de 4%
    const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.04);
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
    const cw = maxX - minX + 1, ch = maxY - minY + 1;

    // 5. Recentrer dans un carré final (outW×outH ou 400×280)
    const dw = outW || 400, dh = outH || 280;
    const scale = Math.min(dw / cw, dh / ch);
    const sw = Math.round(cw * scale), sh = Math.round(ch * scale);
    const dx = Math.round((dw - sw) / 2), dy = Math.round((dh - sh) / 2);

    const out = document.createElement('canvas');
    out.width = dw; out.height = dh;
    const octx = out.getContext('2d');
    octx.drawImage(cv, minX, minY, cw, ch, dx, dy, sw, sh);

    const webp = out.toDataURL('image/webp', 0.88);
    cb(webp.startsWith('data:image/webp') ? webp : out.toDataURL('image/png'));
  };
  img.onerror = () => cb(dataUrl);
  img.src = dataUrl;
}

function _findVehiclePhoto(brand, model, year) {
  const bl = (brand || '').toLowerCase();
  const ml = (model || '').toLowerCase();

  // 1. clicauto_vehicles — priorité absolue (photo dédiée au véhicule)
  try {
    const vehs = JSON.parse(localStorage.getItem('clicauto_vehicles') || '[]');
    // Exact : marque + modèle + année dans la plage
    const exact = vehs.find(v =>
      (v.brand || '').toLowerCase() === bl &&
      (v.model || '').toLowerCase() === ml &&
      _yearInRange(v.years, year) &&
      v.carPhoto
    );
    if (exact) return exact.carPhoto;
    // Fallback : marque + modèle (ignorer année)
    const byModel = vehs.find(v =>
      (v.brand || '').toLowerCase() === bl &&
      (v.model || '').toLowerCase() === ml &&
      v.carPhoto
    );
    if (byModel) return byModel.carPhoto;
    // Fallback large : marque + début de nom de modèle
    const byRoot = vehs.find(v =>
      (v.brand || '').toLowerCase() === bl &&
      (v.model || '').toLowerCase().startsWith(ml.split(' ')[0]) &&
      v.carPhoto
    );
    if (byRoot) return byRoot.carPhoto;
  } catch {}

  // 2. clicauto_custom_products — photo portée par un article
  try {
    const prods = JSON.parse(localStorage.getItem('clicauto_custom_products') || '[]');
    const match = prods.find(p =>
      (p.brand || '').toLowerCase() === bl &&
      (p.model || '').toLowerCase() === ml &&
      p.carPhoto
    );
    if (match) return match.carPhoto;
  } catch {}

  return null;
}

function openProducts() {
  const brand = S.vehicle ? S.vehicle.brand : null;
  const model = S.vehicle ? S.vehicle.model : null;
  const year  = S.vehicle ? S.vehicle.year  : null;

  // Label en-tête
  const labelEl = document.getElementById('veh-label');
  if (labelEl) {
    labelEl.textContent = brand && model
      ? `${brand} ${model}${year ? ' — ' + year : ''}`
      : 'Tout notre catalogue';
  }

  const thumbEl = document.getElementById('prod-veh-thumb');
  if (thumbEl) {
    thumbEl.innerHTML = '';
    if (brand) {
      const b = (BRANDS || []).find(x => x.name === brand) || null;
      const carPhoto = _findVehiclePhoto(brand, model, year);
      // Logo de marque uploadé dans l'admin
      let brandLogo = null;
      try {
        const logos = JSON.parse(localStorage.getItem('clicauto_brand_logos') || '{}');
        brandLogo = logos[brand.toLowerCase()] || null;
      } catch {}
      const img = document.createElement('img');
      img.style.cssText = 'width:100%;height:100%;object-fit:contain';
      if (carPhoto) {
        img.alt = `${brand} ${model}`;
        const fallback = brandLogo
          ? () => { const li = document.createElement('img'); li.src = brandLogo; li.style.cssText = 'width:100%;height:100%;object-fit:contain'; thumbEl.innerHTML = ''; thumbEl.appendChild(li); }
          : b ? () => { thumbEl.innerHTML = `<div class="veh-logo-brand">${b.logo}</div>`; } : null;
        if (fallback) img.onerror = fallback;
        _stripWhiteBg(carPhoto, url => { img.src = url; });
        thumbEl.appendChild(img);
      } else if (brandLogo) {
        img.src = brandLogo; img.alt = brand;
        thumbEl.appendChild(img);
      } else if (b) {
        img.alt = b.name;
        img.onerror = () => { thumbEl.innerHTML = `<div class="veh-logo-brand">${b.logo}</div>`; };
        _stripWhiteBg(`assets/vehicles/${b.id}.png`, url => { img.src = url; });
        thumbEl.appendChild(img);
      }
    }
  }
  _searchMode = false;
  const inp = document.getElementById('manual-search-input');
  const clr = document.getElementById('manual-search-clear');
  if (inp) inp.value = '';
  if (clr) clr.style.display = 'none';
  const catRail = document.getElementById('cat-rail');
  const catDots = document.getElementById('scroll-dots');
  if (catRail) catRail.style.display = '';
  if (catDots) catDots.style.display = '';
  buildCategories();
  loadProducts(S.cat);
  updateCart();
  initSearchBar();
  goPage('pg-products');
}

/* ─── Home page quick search ─── */
let _homeSearchReady = false;

function initHomeSearch() {
  if (_homeSearchReady) return;
  const inp  = document.getElementById('home-search-input');
  const clr  = document.getElementById('home-search-clear');
  const sugg = document.getElementById('home-suggestions');
  if (!inp) return;
  _homeSearchReady = true;

  function showHomeSuggestions(q) {
    if (!sugg) return;
    q = (q || '').trim();
    if (q.length < 1) { sugg.style.display = 'none'; return; }
    const parsed  = _parseQuery(q);
    const results = _applyFilters(_getSearchPool(parsed.catIds), parsed).slice(0, 12);
    if (!results.length) { sugg.style.display = 'none'; return; }
    sugg.innerHTML = results.map((p, i) =>
      `<div class="sugg-item" data-i="${i}" tabindex="0">${_suggItemInner(p)}</div>`
    ).join('');
    sugg.style.display = 'block';
    sugg.querySelectorAll('.sugg-item').forEach((el, i) => {
      el.addEventListener('click', () => {
        sugg.style.display = 'none';
        inp.value = '';
        if (clr) clr.style.display = 'none';
        const p = results[i];
        S.vehicle = { brand: '', model: '', year: 0 };
        openProducts();
        setTimeout(() => openProductDetail(p), 440);
      });
    });
  }

  inp.addEventListener('input', () => {
    if (clr) clr.style.display = inp.value.trim() ? 'flex' : 'none';
    showHomeSuggestions(inp.value);
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sugg && (sugg.style.display = 'none');
      const q = inp.value.trim();
      if (!q) return;
      S.vehicle = { brand: '', model: '', year: 0 };
      openProducts();
      setTimeout(() => {
        const pi = document.getElementById('manual-search-input');
        const pc = document.getElementById('manual-search-clear');
        if (pi) { pi.value = q; if (pc) pc.style.display = 'flex'; }
        doManualSearch(q);
      }, 430);
    }
    if (e.key === 'Escape') { inp.value = ''; if (clr) clr.style.display = 'none'; if (sugg) sugg.style.display = 'none'; }
  });
  if (clr) clr.addEventListener('click', () => {
    inp.value = ''; clr.style.display = 'none';
    if (sugg) sugg.style.display = 'none';
    inp.focus();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (sugg && !inp.contains(e.target) && !sugg.contains(e.target)) sugg.style.display = 'none';
  });
}

/* ─── Shared suggestion item builder ─── */
function _suggItemInner(p) {
  const img = p.img ? `<img src="${p.img}" alt="" loading="lazy" onerror="this.style.display='none'">` : '';
  const _dn = _displayName(p); const name = _dn.length > 55 ? _dn.slice(0, 54) + '…' : _dn;
  return `
    <div class="sugg-thumb">${img}</div>
    <div class="sugg-info">
      <div class="sugg-name">${name}</div>
      <div class="sugg-price">${p.price.toLocaleString('fr-MA')} DH</div>
    </div>
    <svg class="sugg-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>`;
}

/* ─── Products page search ─── */
let _searchTimer = null;
let _searchMode = false;
let _searchBarReady = false;

const EXCLUDED_CATS = new Set(['accessoires', 'autoradios']);

/* ─── Piece-type → category map (longest keywords checked first) ─── */
const PIECE_KEYWORDS = [
  ['pare-chocs',    ['pare-choc avant','pare-choc arriere','pare choc avant','pare choc arriere',
                     'parechoc avant','parechoc arriere','pare-choc','parechoc','pare choc',
                     'bumper','bouclier avant','bouclier arriere','calandre','masque avant','masque arriere']],
  ['optiques',      ['feu avant gauche','feu avant droit','phare avant','phare gauche','phare droit',
                     'phare led','antibrouillard avant','antibrouillard','projecteur','optique avant',
                     'feu avant','feux avant','phare','optique','drl']],
  ['feux-arriere',  ['feu arriere gauche','feu arriere droit','feux arriere','feu arriere',
                     'cabochon arriere','cataphothe','catafoot','feu stop','feu recul']],
  ['retroviseurs',  ['retroviseur exterieur','retroviseur gauche','retroviseur droit',
                     'glace retroviseur','coque retroviseur','cache retroviseur',
                     'boitier retroviseur','retroviseur','retro ']],
  ['ailes',         ['aile avant gauche','aile avant droite','aile arriere gauche','aile arriere droite',
                     'passage de roue','passage roue','aile avant','aile arriere','aile gauche','aile droite','aile ']],
  ['portes',        ['portiere avant','portiere arriere','porte avant','porte arriere',
                     'poignee porte','leve vitre','serrure porte','portiere','porte ']],
  ['capots',        ['capot avant','capot moteur','capot']],
  ['vitres',        ['pare-brise','parebrise','lunette arriere','vitre laterale','vitre lat',
                     'glace avant','glace arriere','glace lat']],
  ['radiateurs',    ['radiateur eau','radiateur moteur','condenseur clim','intercooler','radiateur']],
  ['coffres',       ['hayon arriere','hayon','coffre arriere','coffre']],
  ['housses',       ['housse siege','bache de siege','couvre siege','housse']],
];

/* Load manually-added products from admin panel into PRODUCTS */
function _loadCustomProducts() {
  try {
    for (const cat of Object.keys(PRODUCTS)) {
      PRODUCTS[cat] = PRODUCTS[cat].filter(p => !p._fromAdmin);
    }
    // Firestore en priorité, localStorage en fallback
    const fbProds = window.FIREBASE_DATA && window.FIREBASE_DATA.products;
    const custom = (fbProds && fbProds.length)
      ? fbProds
      : JSON.parse(localStorage.getItem('clicauto_custom_products') || '[]');
    custom.forEach(p => {
      const cat = p._cat;
      if (!cat || !PRODUCTS[cat]) return;
      if (!PRODUCTS[cat].some(e => e.id === p.id)) {
        PRODUCTS[cat].unshift({ ...p, _fromAdmin: true });
      }
    });
  } catch (e) { /* ignore */ }
}
_loadCustomProducts();

/* Rafraîchit la page produits mobile si elle est active */
function _renderProductsPage() {
  if (_current !== 'pg-products') return;
  buildCategories();
  loadProducts(S.cat);
}

/* Appelé par Firebase quand les données changent */
window._reloadProducts = function() {
  _flatProducts = null;
  _loadCustomProducts();
  _renderProductsPage();
  if (typeof window._pcRefresh === 'function') window._pcRefresh();
};

window._pickerFill = function() { _pickerFill(); };

let _flatProducts = null;
function _allProducts() {
  if (_flatProducts) return _flatProducts;
  _flatProducts = [];
  for (const cat of CATEGORIES) {
    if (EXCLUDED_CATS.has(cat.id)) continue;
    for (const p of (PRODUCTS[cat.id] || [])) {
      _flatProducts.push({ ...p, _cat: cat.id });
    }
  }
  return _flatProducts;
}

/* Pool de produits — supporte plusieurs catégories */
function _getSearchPool(catIds) {
  const ids = Array.isArray(catIds) ? catIds : (catIds ? [catIds] : []);
  if (ids.length === 1 && PRODUCTS[ids[0]]) {
    return (PRODUCTS[ids[0]] || []).map(p => ({ ...p, _cat: ids[0] }));
  }
  if (ids.length > 1) {
    return ids.flatMap(id => (PRODUCTS[id] || []).map(p => ({ ...p, _cat: id })));
  }
  return _allProducts();
}

/* Analyse la requête → { catIds, brand, model, year, rawTokens } */
function _parseQuery(q) {
  const rawQ = _norm(q).replace(/\s+/g,' ').trim();
  let t = rawQ;
  let year = '', brand = '', model = '';

  // 1. Année
  const ym = t.match(/\b(19|20)\d{2}\b/);
  if (ym) { year = ym[0]; t = t.replace(ym[0],'').replace(/\s+/g,' ').trim(); }

  // 2. Marques (longest first, exact + alias + fuzzy)
  const sortedBrands = [...BRANDS].sort((a,b) => b.name.length - a.name.length);
  for (const b of sortedBrands) {
    const bn = _norm(b.name);
    const allForms = [bn, ...(BRAND_ALIASES[bn]||[])];
    let matched = null;
    for (const form of allForms) {
      if (t.includes(form)) { matched = form; break; }
    }
    if (!matched) {
      // Fuzzy sur chaque token
      const toks = t.split(' ');
      for (const form of allForms) {
        const ft = toks.find(tok => tok.length >= 3 && _lev(tok, form) <= Math.max(1, Math.floor(form.length/5)));
        if (ft) { matched = ft; break; }
      }
    }
    if (matched) {
      brand = bn;
      t = t.replace(matched,'').replace(/\s+/g,' ').trim();
      break;
    }
  }

  // 3. Catégories via index multilingue (tous les tokens, puis la chaîne complète)
  const tokens = t.split(' ').filter(Boolean);
  let catIds = _catsByQuery(t);

  // Si pas trouvé sur la chaîne, tente token par token
  if (!catIds.length && tokens.length > 1) {
    for (const tok of tokens) {
      const c = _catsByQuery(tok);
      if (c.length) { catIds = c; t = t.replace(tok,'').replace(/\s+/g,' ').trim(); break; }
    }
  } else if (catIds.length) {
    t = '';  // la requête entière a servi à trouver la catégorie
  }

  model = t.replace(/\s+/g,' ').trim();
  const rawTokens = rawQ.split(' ').filter(Boolean);
  return { catIds, brand, model, year: year ? parseInt(year) : null, rawTokens };
}

/* Filtre + score — champs structurés + nom + fuzzy */
function _scoreProduct(p, { brand, model, year, rawTokens, catIds }) {
  const pb = _norm(p.brand), pm = _norm(p.model), pn = _norm(p.name);
  let score = 0;

  if (brand) {
    const brandMatch = pb.includes(brand) || brand.includes(pb) ||
      (BRAND_ALIASES[brand]||[]).some(a => pb.includes(a));
    if (!brandMatch) return -1;
    score += 10;
  }

  if (model && model.length >= 2) {
    if (pm.includes(model) || model.includes(pm)) score += 8;
    else if (_fuzzyMatch(model, pm)) score += 5;
    else if (pn.includes(model)) score += 3;
    else if (_fuzzyMatch(model, pn)) score += 1;
    else if (!pm) score += 0; // champ vide → on garde (data gap)
    else return -1;
  }

  if (year && !_yearInRange(p.years, year)) return -1;

  // Si aucun filtre structuré, chaque token doit matcher quelque part
  if (!brand && !model && !year && rawTokens && rawTokens.length && !catIds.length) {
    const hay = [pn, pb, pm].join(' ');
    const allMatch = rawTokens.every(tok =>
      tok.length < 2 || hay.includes(tok) || _catsByQuery(tok).includes(p._cat) || _fuzzyMatch(tok, hay)
    );
    if (!allMatch) return -1;
  }

  return score;
}

function _applyFilters(pool, parsed) {
  const results = [];
  for (const p of pool) {
    const s = _scoreProduct(p, parsed);
    if (s >= 0) results.push({ p, s });
  }
  return results.sort((a,b) => b.s - a.s).map(r => r.p);
}

function doManualSearch(raw) {
  const q       = (raw || '').trim();
  const grid    = document.getElementById('prod-grid');
  const rc      = document.getElementById('result-count');
  const catRail = document.getElementById('cat-rail');
  const catDots = document.getElementById('scroll-dots');
  const sugg    = document.getElementById('prod-suggestions');

  // Always hide suggestions dropdown on full search
  if (sugg) sugg.style.display = 'none';

  if (!q) {
    _searchMode = false;
    grid.classList.remove('search-list-mode');
    if (catRail) catRail.style.display = '';
    if (catDots) catDots.style.display = '';
    document.getElementById('veh-label').textContent = S.vehicle
      ? `${S.vehicle.brand} ${S.vehicle.model} — ${S.vehicle.year}` : '';
    loadProducts(S.cat);
    return;
  }

  _searchMode = true;
  if (catRail) catRail.style.display = 'none';
  if (catDots) catDots.style.display = 'none';

  const parsed  = _parseQuery(q);
  const pool    = _getSearchPool(parsed.catIds);
  const results = _applyFilters(pool, parsed).slice(0, 300);

  // Label de compréhension
  const catLabel = parsed.catIds && parsed.catIds.length
    ? parsed.catIds.map(id => (CATEGORIES.find(c=>c.id===id)||{}).name).filter(Boolean).join(', ')
    : '';
  const parts = [catLabel, parsed.brand, parsed.model, parsed.year].filter(Boolean);
  const understood = parts.length ? ` — <em>${parts.join(' › ')}</em>` : '';
  if (rc) rc.innerHTML = `${results.length} pièce${results.length !== 1 ? 's' : ''} trouvée${results.length !== 1 ? 's' : ''}${understood}`;

  // Instant list render (no delay, no skeleton)
  grid.classList.add('search-list-mode');
  grid.innerHTML = '';
  grid.style.opacity = '1';

  if (!results.length) {
    grid.classList.remove('search-list-mode');
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px 0;color:#8E8E93">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="margin:0 auto 12px;display:block"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <div style="font-size:14px;font-weight:500">Aucun résultat pour "<strong>${q}</strong>"</div>
        <div style="font-size:12px;margin-top:6px;color:#aaa">Essayez avec la marque seule, puis ajoutez le modèle.</div>
      </div>`;
    return;
  }

  results.forEach(p => grid.appendChild(_makeSearchListItem(p)));
}

/* instant list item (search results view) */
function _makeSearchListItem(p) {
  const el = document.createElement('div');
  el.className = 'search-list-item';
  const veh = _vehSub(p);
  el.innerHTML = `
    <div class="sli-thumb">
      <img src="${p.img || ''}" alt="" loading="lazy" onerror="this.style.display='none'">
    </div>
    <div class="sli-info">
      <div class="sli-name">${_displayName(p)}</div>
      ${veh ? `<div class="sli-veh">${veh}</div>` : ''}
      <div class="sli-price">${p.price.toLocaleString('fr-MA')} DH</div>
    </div>
    <svg class="sli-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>`;
  el.addEventListener('click', () => openProductDetail(p, el));
  return el;
}

function initSearchBar() {
  if (_searchBarReady) return;
  const inp  = document.getElementById('manual-search-input');
  const clr  = document.getElementById('manual-search-clear');
  const sugg = document.getElementById('prod-suggestions');
  if (!inp) return;
  _searchBarReady = true;

  function showProdSuggestions(q) {
    if (!sugg) return;
    q = (q || '').trim();
    if (q.length < 1) { sugg.style.display = 'none'; return; }
    const parsed  = _parseQuery(q);
    const results = _applyFilters(_getSearchPool(parsed.catIds), parsed).slice(0, 10);
    if (!results.length) { sugg.style.display = 'none'; return; }
    sugg.innerHTML = results.map((p, i) =>
      `<div class="sugg-item" data-i="${i}">${_suggItemInner(p)}</div>`
    ).join('');
    sugg.style.display = 'block';
    sugg.querySelectorAll('.sugg-item').forEach((el, i) => {
      el.addEventListener('click', () => {
        sugg.style.display = 'none';
        openProductDetail(results[i]);
      });
    });
  }

  inp.addEventListener('input', () => {
    const v = inp.value.trim();
    if (clr) clr.style.display = v ? 'flex' : 'none';
    showProdSuggestions(v);
    // Full list search with tiny debounce
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => { if (sugg) sugg.style.display = 'none'; doManualSearch(v); }, 280);
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); if (sugg) sugg.style.display = 'none'; doManualSearch(inp.value); }
    if (e.key === 'Escape') { inp.value = ''; if (clr) clr.style.display = 'none'; if (sugg) sugg.style.display = 'none'; doManualSearch(''); }
  });
  if (clr) clr.addEventListener('click', () => {
    inp.value = ''; clr.style.display = 'none';
    if (sugg) sugg.style.display = 'none';
    doManualSearch(''); inp.focus();
  });
  // Close suggestions on outside click
  document.addEventListener('click', e => {
    if (sugg && !inp.contains(e.target) && !sugg.contains(e.target)) sugg.style.display = 'none';
  });
}

/* ════════════════════════════════════════
   CATEGORIES
   ════════════════════════════════════════ */
/* ════════════════════════════════════════
   CAROUSEL 3D — scroll-driven transforms
   Centre = scale(1), côtés = shrink + rotateY
   ════════════════════════════════════════ */
let _carouselRaf = null;
let _carouselActive = -1;

/* Catégories visibles = celles qui ont au moins 1 produit */
let _VISIBLE_CATS = [];

function _computeVisibleCats() {
  _VISIBLE_CATS = CATEGORIES.filter(c => (PRODUCTS[c.id] || []).length > 0);
}

function buildCategories() {
  _computeVisibleCats();
  // Clamp immédiatement pour que loadProducts() appelé juste après soit correct
  if (_VISIBLE_CATS.length) {
    S.cat = Math.min(S.cat || 0, _VISIBLE_CATS.length - 1);
  }

  const rail = document.getElementById('cat-rail');
  const dots = document.getElementById('scroll-dots');
  rail.innerHTML = '';
  if (dots) dots.innerHTML = '';

  _VISIBLE_CATS.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.dataset.idx = i;
    card.dataset.catId = c.id;
    card.innerHTML = `
      <div class="cat-card-img" id="cat-img-${i}">
        <img src="${c.img || ''}"
             alt="${c.name}"
             onerror="document.getElementById('cat-img-${i}').classList.add('no-img')">
        <div class="cat-card-ico">${CAT_ICON[c.icon](false)}</div>
      </div>
      <span class="cat-card-name">${c.name}</span>`;
    card.addEventListener('click', () => _scrollToCard(i));
    rail.appendChild(card);

    if (dots) {
      const dot = document.createElement('div');
      dot.className = 'scroll-dot';
      dots.appendChild(dot);
    }
  });

  requestAnimationFrame(() => {
    /* Frame 1 — mesure le vrai offsetWidth puis injecte le padding en pixel */
    const pad = Math.max(0, (rail.offsetWidth - 120) / 2);
    rail.style.paddingLeft        = pad + 'px';
    rail.style.paddingRight       = pad + 'px';
    rail.style.scrollPaddingLeft  = pad + 'px';
    rail.style.scrollPaddingRight = pad + 'px';

    requestAnimationFrame(() => {
      /* Frame 2 — layout stabilisé, on peut scroller avec précision */
      _updateCarousel3D(rail, true);
      _scrollToCard(S.cat, false);
    });
  });

  rail.addEventListener('scroll', () => {
    if (_carouselRaf) return;
    _carouselRaf = requestAnimationFrame(() => {
      _carouselRaf = null;
      _updateCarousel3D(rail, false);
    });
  }, { passive: true });
}

function _updateCarousel3D(rail, initial) {
  const cards = rail.querySelectorAll('.cat-card');
  if (!cards.length) return;

  const railCenter = rail.scrollLeft + rail.offsetWidth / 2;
  let closestIdx = 0;
  let minDist = Infinity;

  cards.forEach((card, i) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const rawDist    = cardCenter - railCenter;
    const absDist    = Math.abs(rawDist);
    if (absDist < minDist) { minDist = absDist; closestIdx = i; }

    /* t : 0 = centré, 1 = à la limite du viewport */
    const t = Math.min(1, absDist / (rail.offsetWidth * 0.42));
    const tSmooth = t * t * (3 - 2 * t);

    const scale   = 1 - tSmooth * 0.22;               /* 1.0 → 0.78 */
    const rotY    = (rawDist > 0 ? -1 : 1) * tSmooth * 32; /* ±32° */
    const tz      = -tSmooth * 40;                     /* recule 40px en Z */
    const opacity = 1 - tSmooth * 0.50;               /* 1 → 0.50 */
    const blur    = tSmooth * 1.5;                     /* 0 → 1.5px */

    card.style.transform = `perspective(600px) scale(${scale.toFixed(3)}) rotateY(${rotY.toFixed(1)}deg) translateZ(${tz.toFixed(1)}px)`;
    card.style.opacity   = opacity.toFixed(3);
    card.style.filter    = blur > 0.08 ? `blur(${blur.toFixed(2)}px)` : '';
  });

  if (closestIdx !== _carouselActive || initial) {
    _carouselActive = closestIdx;
    cards.forEach((c, i) => c.classList.toggle('cc-active', i === closestIdx));
    document.querySelectorAll('.scroll-dot').forEach((d, i) => d.classList.toggle('on', i === closestIdx));

    if (!initial && S.cat !== closestIdx) {
      S.cat = closestIdx;
      loadProducts(closestIdx);
    }
  }
}

function _scrollToCard(idx, animate) {
  const rail = document.getElementById('cat-rail');
  const card = rail.querySelectorAll('.cat-card')[idx];
  if (!card) return;

  /* Position exacte : bord gauche du rail + moitié rail − moitié carte */
  const tl = Math.round(card.offsetLeft - (rail.offsetWidth - card.offsetWidth) / 2);
  const target = Math.max(0, tl);

  rail.style.scrollSnapType = 'none';
  if (animate === false) {
    rail.scrollLeft = target;
    requestAnimationFrame(() => { rail.style.scrollSnapType = ''; });
  } else {
    rail.scrollTo({ left: target, behavior: 'smooth' });
    setTimeout(() => { rail.style.scrollSnapType = ''; }, 500);
  }
}

function selectCat(i) { _scrollToCard(i); }

/* ════════════════════════════════════════
   PRODUCTS
   ════════════════════════════════════════ */
function _yearInRange(yearsStr, vehicleYear) {
  if (!yearsStr || !vehicleYear) return true;
  // Normalize all dash variants (–, —, -) to hyphen
  const y = yearsStr.trim().replace(/[–—]/g, '-');
  if (!y) return true;
  if (y.endsWith('+')) return vehicleYear >= parseInt(y);
  if (y.includes('-')) {
    const parts = y.split('-').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parts.length >= 2) return vehicleYear >= parts[0] && vehicleYear <= parts[1];
    if (parts.length === 1) return vehicleYear === parts[0];
    return true;
  }
  return vehicleYear === parseInt(y);
}

function loadProducts(catIdx) {
  const grid = document.getElementById('prod-grid');
  const cat = _VISIBLE_CATS[catIdx] || _VISIBLE_CATS[0];
  if (!cat) return;
  const catId = cat.id;
  const vehicleYear = S.vehicle ? parseInt(S.vehicle.year) : null;
  const selBrand = S.vehicle ? _norm(S.vehicle.brand) : null;
  const selModel = S.vehicle ? _norm(S.vehicle.model) : null;

  const prods = (PRODUCTS[catId] || []).filter(p => {
    if (!_yearInRange(p.years, vehicleYear)) return false;
    if (!selBrand || !p.brand) return true;
    const pb = _norm(p.brand);
    if (pb && !selBrand.includes(pb) && !pb.includes(selBrand)) return false;
    if (selModel && p.model) {
      const pm = _norm(p.model);
      if (pm && !pm.includes(selModel) && !selModel.includes(pm)) return false;
    }
    return true;
  });

  grid.innerHTML = '';
  grid.style.opacity = '0';

  for (let k = 0; k < 4; k++) {
    const sk = document.createElement('div');
    sk.className = 'pcard';
    sk.innerHTML = `
      <div style="aspect-ratio:1/1;background:#f2f2f7">
        <div class="skeleton" style="height:100%;border-radius:0"></div>
      </div>
      <div style="padding:8px 10px 12px">
        <div class="skeleton" style="height:14px;width:40%;margin-bottom:6px"></div>
        <div class="skeleton" style="height:12px;width:90%;margin-bottom:4px"></div>
        <div class="skeleton" style="height:16px;width:45%"></div>
      </div>`;
    grid.appendChild(sk);
  }
  grid.style.opacity = '1';

  setTimeout(() => {
    grid.innerHTML = '';
    const rc = document.getElementById('result-count');
    if (rc) rc.textContent = `${prods.length} pièces trouvées`;
    if (!prods.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px 0;color:#8E8E93">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="margin:0 auto 12px;display:block"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <div style="font-size:14px;font-weight:500">Aucune pièce disponible</div>
        </div>`;
      return;
    }
    prods.forEach(p => grid.appendChild(_makeCard(p)));
  }, 280);
}

/* ════════════════════════════════════════
   PRODUCT CARD FACTORY
   ════════════════════════════════════════ */
function _makeCard(p, extraBadge) {
  const card = document.createElement('div');
  card.className = 'pcard';
  const sideTag = p.side ? `<span class="hi-mark">${p.side}</span>` : '';
  const extra   = extraBadge ? `<span class="pcard-badge pcard-badge-cat">${extraBadge}</span>` : '';
  const vehLine = [p.brand, p.model].filter(Boolean).join(' · ');
  const yearPill = p.years ? `<span class="pcard-year-badge">${_yearStr(p.years)}</span>` : '';
  const _CAT_PART = {'feux-arriere':'tl','portes':'dr','pare-chocs':'fb','ailes':'fen','optiques':'hl','retroviseurs':'mir','capots':'hood','coffres':'trunk'};
  const _partKey = p.part || _CAT_PART[p._cat] || 'fb';
  const _partSvg = PART_SVG[_partKey] || PART_SVG.fb;
  card.innerHTML = `
    <div class="pcard-img">
      <img src="${p.img || ''}" alt="${p.name}" loading="lazy"
           ${_shouldFlipPhoto(p) ? 'style="transform:scaleX(-1)"' : ''}
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="pcard-img-fallback" style="display:none">${_partSvg}</div>
      <button class="pcard-cart-btn" aria-label="Ajouter au panier">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </button>
    </div>
    <div class="pcard-info">
      <div class="pcard-name">${_displayName(p)}${sideTag}</div>
      ${vehLine ? `<div class="pcard-veh">${vehLine}</div>` : ''}
      ${(yearPill || extra) ? `<div class="pcard-meta-row">${yearPill}${extra}</div>` : ''}
      <div class="pcard-bottom">
        <div class="pcard-price">${p.price.toLocaleString('fr-MA')} <span>DH</span></div>
        <button class="pcard-order-btn" aria-label="Commander">Commander</button>
      </div>
    </div>`;
  card.querySelector('.pcard-cart-btn').addEventListener('click', e => {
    e.stopPropagation();
    addToCartDirect(p, e.currentTarget);
  });
  card.querySelector('.pcard-order-btn').addEventListener('click', e => {
    e.stopPropagation();
    openProductDetail(p, card);
  });
  card.addEventListener('click', () => openProductDetail(p, card));
  return card;
}

/* ════════════════════════════════════════
   PRODUCT DETAIL MODAL
   ════════════════════════════════════════ */
let _pdProduct  = null;
let _pdPhotoIdx = 0;
let _pdPhotos   = [];
let _pdTouchX   = 0;

function openProductDetail(product, cardEl) {
  _pdProduct  = product;
  _pdPhotos   = (product.imgs && product.imgs.length) ? product.imgs : (product.img ? [product.img] : []);
  _pdPhotoIdx = 0;

  if (cardEl) {
    cardEl.style.transition = 'transform .18s cubic-bezier(.34,1.5,.64,1)';
    cardEl.style.transform  = 'scale(.95)';
    setTimeout(() => { cardEl.style.transform = ''; cardEl.style.transition = ''; }, 220);
  }

  const overlay = document.getElementById('pd-overlay');
  const sheet   = document.getElementById('pd-sheet');
  if (!overlay || !sheet) return;

  const veh = _vehSub(product);
  const pdNameEl = document.getElementById('pd-name');
  const sideSpan = product.side ? ` <span class="hi-mark">${product.side}</span>` : '';
  pdNameEl.innerHTML = _displayName(product) + sideSpan;
  document.getElementById('pd-veh').textContent = veh;
  document.getElementById('pd-price').textContent = product.price.toLocaleString('fr-MA') + ' DH';

  // Bannière voiture désactivée — la carPhoto apparaît dans prod-veh-thumb (header produits)
  const carBanner = document.getElementById('pd-car-banner');
  if (carBanner) carBanner.style.display = 'none';

  _pdRenderPhotos();

  overlay.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.classList.add('is-open');
    sheet.classList.add('is-open');
  }));
}

function closeProductDetail() {
  const overlay = document.getElementById('pd-overlay');
  const sheet   = document.getElementById('pd-sheet');
  if (!overlay) return;
  overlay.classList.remove('is-open');
  if (sheet) sheet.classList.remove('is-open');
  setTimeout(() => { overlay.style.display = 'none'; }, 400);
}

function _pdRenderPhotos() {
  const track  = document.getElementById('pd-track');
  const dotsEl = document.getElementById('pd-photo-dots');
  if (!track) return;
  track.innerHTML = '';
  if (!_pdPhotos.length) {
    const slide = document.createElement('div');
    slide.className = 'pd-slide pd-slide-empty';
    slide.innerHTML = '<div class="pd-no-photo">📦</div>';
    track.appendChild(slide);
    if (dotsEl) dotsEl.innerHTML = '';
    return;
  }
  const _flipStyle = _shouldFlipPhoto(_pdProduct) ? 'transform:scaleX(-1);cursor:zoom-in' : 'cursor:zoom-in';
  _pdPhotos.forEach((url, i) => {
    const slide = document.createElement('div');
    slide.className = 'pd-slide';
    slide.innerHTML = `<img src="${url}" alt="photo ${i+1}" onerror="this.style.opacity='.15'" style="${_flipStyle}">`;
    const zoomUrl = url; // url locale, pas transformée
    slide.querySelector('img').addEventListener('click', e => { e.stopPropagation(); openImgZoom(zoomUrl, _shouldFlipPhoto(_pdProduct)); });
    track.appendChild(slide);
  });
  if (dotsEl) {
    dotsEl.innerHTML = '';
    if (_pdPhotos.length > 1) {
      _pdPhotos.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'pd-dot' + (i === 0 ? ' on' : '');
        d.addEventListener('click', () => _pdGoTo(i));
        dotsEl.appendChild(d);
      });
    }
  }
  _pdGoTo(0, true);
  _pdAttachSwipe();
}

function _pdGoTo(idx, instant) {
  _pdPhotoIdx = Math.max(0, Math.min(idx, _pdPhotos.length - 1));
  const track = document.getElementById('pd-track');
  if (!track) return;
  track.style.transition = instant ? 'none' : 'transform .32s cubic-bezier(.4,0,.2,1)';
  track.style.transform  = `translateX(${-_pdPhotoIdx * 100}%)`;
  document.querySelectorAll('#pd-photo-dots .pd-dot').forEach((d, i) =>
    d.classList.toggle('on', i === _pdPhotoIdx));
  const al = document.getElementById('pd-arrow-l');
  const ar = document.getElementById('pd-arrow-r');
  if (al) al.style.opacity = _pdPhotoIdx > 0 ? '1' : '0';
  if (ar) ar.style.opacity = _pdPhotoIdx < _pdPhotos.length - 1 ? '1' : '0';
}

function _pdAttachSwipe() {
  const gallery = document.getElementById('pd-gallery');
  if (!gallery || gallery._swipeReady) return;
  gallery._swipeReady = true;
  gallery.addEventListener('touchstart', e => { _pdTouchX = e.touches[0].clientX; }, { passive: true });
  gallery.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - _pdTouchX;
    if (Math.abs(dx) > 40) dx < 0 ? _pdGoTo(_pdPhotoIdx + 1) : _pdGoTo(_pdPhotoIdx - 1);
  }, { passive: true });
}

function openImgZoom(src, mirror) {
  const overlay = document.getElementById('img-zoom-overlay');
  const img     = document.getElementById('img-zoom-img');
  if (!overlay || !img) return;
  img.src = src;
  img.style.transform = mirror ? 'scaleX(-1)' : '';
  overlay.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('is-open')));
}
function closeImgZoom() {
  const overlay = document.getElementById('img-zoom-overlay');
  if (!overlay) return;
  overlay.classList.remove('is-open');
  setTimeout(() => { overlay.style.display = 'none'; }, 320);
}

function _pdAddCart() {
  if (!_pdProduct) return;
  const btn = document.getElementById('pd-add-btn');
  addToCartDirect(_pdProduct, btn);
}

/* ════════════════════════════════════════
   ADD TO CART
   ════════════════════════════════════════ */
function addToCartDirect(product, btn) {
  S.cart.push({ ...product, qty: 1 });
  updateCart();
  btn.classList.add('added');
  setTimeout(() => { btn.classList.remove('added'); }, 1400);
}

/* ════════════════════════════════════════
   CART
   ════════════════════════════════════════ */
function updateCart() {
  const badge = document.getElementById('cart-count');
  if (badge) { const n = S.cart.length; badge.textContent = n || ''; badge.style.display = n ? 'flex' : 'none'; }
  const pcBadge = document.getElementById('pc-cart-count');
  if (pcBadge) pcBadge.textContent = S.cart.length || '0';
}

function _cartItemHTML(item, i) {
  const imgSrc = item.img || '';
  const veh = _vehSub(item);
  return `
    <div class="drawer-item">
      <div class="drawer-thumb">
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${item.name}" onerror="this.style.display='none'">`
          : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--label-3)" stroke-width="1.4" stroke-linecap="round"><rect x="2" y="7" width="20" height="13" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`
        }
      </div>
      <div class="drawer-item-info">
        <div class="drawer-item-name">${item.name}</div>
        <div class="drawer-item-veh">${veh}</div>
      </div>
      <div class="drawer-item-right">
        <div class="drawer-item-price">${item.price.toLocaleString('fr-MA')} DH</div>
        <button class="drawer-item-remove" onclick="removeCartItem(${i})" aria-label="Supprimer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>`;
}

function removeCartItem(i) {
  S.cart.splice(i, 1);
  updateCart();
  openCart(); // re-render
}

function openCart() {
  const list     = document.getElementById('cart-items');
  const countEl  = document.getElementById('cart-drawer-count');
  const totalEl  = document.getElementById('cart-drawer-total');
  const orderBtn = document.getElementById('cart-order-btn');
  if (!list) return;
  const n = S.cart.length;
  if (countEl) countEl.textContent = `${n} article${n !== 1 ? 's' : ''}`;

  if (n === 0) {
    list.innerHTML = `<div class="drawer-empty">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <p>Votre panier est vide</p></div>`;
    if (totalEl)  totalEl.style.display = 'none';
    if (orderBtn) orderBtn.style.display = 'none';
  } else {
    list.innerHTML = S.cart.map((item, i) => _cartItemHTML(item, i)).join('');
    const total = S.cart.reduce((s, p) => s + p.price, 0);
    if (totalEl) {
      totalEl.style.display = 'flex';
      document.getElementById('cart-total-amount').textContent = total.toLocaleString('fr-MA') + ' DH';
    }
    if (orderBtn) orderBtn.style.display = 'flex';
  }
  openModal('cart-drawer');
}

/* ════════════════════════════════════════
   CHECKOUT
   ════════════════════════════════════════ */
let _checkoutItems = []; // products being ordered

function openCartCheckout() {
  if (!S.cart.length) return;
  if (window.innerWidth >= 1024) { _pcOpenCartCheckout(); return; }
  _checkoutItems = [...S.cart];
  closeModal('cart-drawer');
  _buildCheckoutItems();
  goPage('pg-checkout');
}

function openCheckout(product) {
  if (window.innerWidth >= 1024) { _pcOpenCheckout(product); return; }
  const inCart = S.cart.some(c => c.id === product.id);
  _checkoutItems = inCart ? [...S.cart] : [...S.cart, product];
  _buildCheckoutItems();
  goPage('pg-checkout');
}

function _buildCheckoutItems() {
  const list = document.getElementById('ck-items-list');
  const totalRow = document.getElementById('ck-total-row');
  if (!list) return;

  const _CP = {'feux-arriere':'tl','portes':'dr','pare-chocs':'fb','ailes':'fen','optiques':'hl','retroviseurs':'mir','capots':'hood','coffres':'trunk'};
  list.innerHTML = _checkoutItems.map(p => {
    const imgSrc = p.img || '';
    const veh = _vehSub(p);
    const ckSvg = PART_SVG[p.part || _CP[p._cat] || 'fb'] || PART_SVG.fb;
    return `
      <div class="ck-item">
        <div class="ck-item-img">
          ${imgSrc
            ? `<img src="${imgSrc}" alt="${p.name}" ${_shouldFlipPhoto(p)?'style="transform:scaleX(-1)"':''} onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
               <div class="ck-item-img-fb" style="display:none">${ckSvg}</div>`
            : `<div class="ck-item-img-fb">${ckSvg}</div>`
          }
        </div>
        <div class="ck-item-info">
          <div class="ck-item-name">${p.name}</div>
          ${veh ? `<div class="ck-item-veh">${veh}${p.side ? ' · ' + p.side : ''}</div>` : ''}
          <div class="ck-item-price">${p.price.toLocaleString('fr-MA')} DH</div>
        </div>
      </div>`;
  }).join('');

  if (totalRow) {
    if (_checkoutItems.length > 1) {
      const total = _checkoutItems.reduce((s, p) => s + p.price, 0);
      document.getElementById('ck-total-amount').textContent = total.toLocaleString('fr-MA') + ' DH';
      totalRow.style.display = 'flex';
    } else {
      totalRow.style.display = 'none';
    }
  }
}

function handleOrder() {
  const name  = document.getElementById('f-name').value.trim();
  const addr  = document.getElementById('f-addr').value.trim();
  const phone = document.getElementById('f-tel').value.trim();

  const errors = [];
  if (!name)  errors.push(document.getElementById('f-name'));
  if (!phone) errors.push(document.getElementById('f-tel'));

  if (errors.length) {
    errors.forEach(inp => {
      inp.style.borderColor = '#FF453A';
      setTimeout(() => inp.style.borderColor = '', 2200);
    });
    errors[0].closest('.f-field').style.animation = 'shake .4s';
    setTimeout(() => errors[0].closest('.f-field').style.animation = '', 400);
    return;
  }

  // Sauvegarde commande + notification admin (dans un try séparé pour ne pas bloquer le modal)
  try {
    const order = {
      id: 'order-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
      date: new Date().toISOString(),
      client: { name, phone, addr },
      items: _checkoutItems.map(p => ({
        id: p.id || '', name: p.name || '', brand: p.brand || '', model: p.model || '',
        years: p.years || '', price: +p.price || 0, img: p.img || null,
      })),
      total: _checkoutItems.reduce((s, p) => s + (+p.price || 0), 0),
      status: 'pending',
    };
    const _existing = JSON.parse(localStorage.getItem('clicauto_orders') || '[]');
    _existing.unshift(order);
    try {
      localStorage.setItem('clicauto_orders', JSON.stringify(_existing));
    } catch(e) {
      if (e.name === 'QuotaExceededError') {
        alert('Espace de stockage plein. Veuillez contacter directement via WhatsApp.');
        return;
      }
    }

    // Sauvegarder dans Firestore si disponible
    if (window._fsOps) window._fsOps.saveOrder(order);

    // Notification instantanée vers l'admin si ouvert dans un autre onglet
    try {
      const _bc = new BroadcastChannel('clicauto-sync');
      _bc.postMessage({ type: 'new-order', id: order.id });
      _bc.close();
    } catch (_) {}
  } catch (err) {
    console.warn('ClicAuto: impossible de sauvegarder la commande en localStorage', err);
  }

  // Vide le panier, affiche la confirmation (toujours exécuté même si la sauvegarde a échoué)
  _checkoutItems.forEach(p => {
    if (!S.cart.find(c => c.id === p.id)) {
      S.cart.push({ ...p, buyer: { name, addr, phone } });
    }
  });
  updateCart();
  openModal('modal-order');
}

/* ════════════════════════════════════════
   CONTACT
   ════════════════════════════════════════ */
let _ctPhotos = [];

function ctAddPhotos(input) {
  const thumbs = document.getElementById('ct-photo-thumbs');
  Array.from(input.files).forEach(file => {
    if (_ctPhotos.length >= 5) return;
    const reader = new FileReader();
    reader.onload = e => {
      const idx = _ctPhotos.length;
      _ctPhotos.push(e.target.result);
      const wrap = document.createElement('div');
      wrap.className = 'cf-photo-thumb';
      wrap.dataset.idx = idx;
      wrap.innerHTML = `<img src="${e.target.result}"><button class="cf-photo-thumb-del" onclick="ctRemovePhoto(${idx})">✕</button>`;
      thumbs.appendChild(wrap);
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function ctRemovePhoto(idx) {
  _ctPhotos.splice(idx, 1);
  const thumbs = document.getElementById('ct-photo-thumbs');
  thumbs.innerHTML = '';
  _ctPhotos.forEach((src, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'cf-photo-thumb';
    wrap.innerHTML = `<img src="${src}"><button class="cf-photo-thumb-del" onclick="ctRemovePhoto(${i})">✕</button>`;
    thumbs.appendChild(wrap);
  });
}

function handleContact() {
  const name  = document.getElementById('ct-name').value.trim();
  const phone = document.getElementById('ct-phone').value.trim();
  const city  = document.getElementById('ct-city').value;
  const errors = [];
  if (!name)  errors.push(document.getElementById('ct-name'));
  if (!phone) errors.push(document.getElementById('ct-phone'));
  if (!city)  errors.push(document.getElementById('ct-city'));
  if (errors.length) {
    errors.forEach(inp => {
      inp.style.borderColor = '#FF453A';
      inp.style.boxShadow = '0 0 0 3px rgba(255,59,48,.15)';
      setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 2200);
    });
    errors[0].focus();
    return;
  }
  const btn = document.getElementById('btn-send');
  btn.classList.add('loading');
  btn.disabled = true;
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;

    // Sauvegarder dans localStorage pour l'admin (sans photos — trop volumineuses)
    const _msgText = document.getElementById('ct-msg').value.trim();
    const _photoCount = _ctPhotos.length;
    try {
      const newMsg = {
        id: Date.now().toString(),
        name,
        phone,
        city,
        message: _msgText,
        photoCount: _photoCount,
        date: new Date().toISOString(),
        status: 'new'
      };
      const msgs = JSON.parse(localStorage.getItem('clicauto_messages') || '[]');
      msgs.push(newMsg);
      localStorage.setItem('clicauto_messages', JSON.stringify(msgs));
      if (window._fsOps) window._fsOps.saveMessage(newMsg);
    } catch(e) {
      console.error('Erreur sauvegarde message:', e);
    }

    openModal('modal-contact');
    ['ct-name','ct-phone','ct-city','ct-msg'].forEach(id => { document.getElementById(id).value = ''; });
    _ctPhotos = [];
    document.getElementById('ct-photo-thumbs').innerHTML = '';
  }, 900);
}

/* ════════════════════════════════════════
   MODALS
   ════════════════════════════════════════ */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('open');
  if (id === 'modal-order') {
    S.cart = [];
    updateCart();
    if (window.innerWidth < 1024) goBack('pg-products');
  }
  if (id === 'modal-contact' && window.innerWidth < 1024) goBack('pg-vehicle');
}

/* ════════════════════════════════════════
   SCROLL HEADER
   ════════════════════════════════════════ */
function initScrollHeader() {
  const page = document.getElementById('pg-products');
  const head = document.getElementById('prod-head');
  page.addEventListener('scroll', () => {
    head.classList.toggle('is-top', page.scrollTop < 4);
  }, { passive: true });
  head.classList.add('is-top');
}

/* ════════════════════════════════════════
   RIPPLE
   ════════════════════════════════════════ */
function addRipple(el) {
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.addEventListener('click', e => {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = el.getBoundingClientRect();
    r.style.left = `${e.clientX - rect.left}px`;
    r.style.top  = `${e.clientY - rect.top}px`;
    el.appendChild(r);
    setTimeout(() => r.remove(), 680);
  });
}

/* ════════════════════════════════════════
   PC E-COMMERCE MODE (≥ 1024 px)
   ════════════════════════════════════════ */

let _pcCat     = 'all';
let _pcBrand   = 'all';
let _pcSearch  = '';
let _pcVehicle = null;    /* { brand, model, year } ou null */
let _pcInited  = false;
let _pcCheckoutItems = [];

/* ── Filtres catégorie ── */
function _pcSetCat(catId) {
  _pcCat   = catId;
  _pcBrand = 'all';
  document.querySelectorAll('#pc-cat-filters .pc-filter-item').forEach(b =>
    b.classList.toggle('active', b.dataset.val === catId));
  _buildPcBrandFilters();
  _renderPcGrid();
}

/* ── Filtres marque ── */
function _pcSetBrand(brand) {
  _pcBrand = brand;
  document.querySelectorAll('#pc-brand-filters .pc-filter-item').forEach(b =>
    b.classList.toggle('active', b.dataset.val === brand));
  _renderPcGrid();
}

/* ── Tri ── */
function _pcSetSort() { _renderPcGrid(); }

/* ── Effacer recherche ── */
function _pcClearSearch() {
  const inp = document.getElementById('pc-search-input');
  const clr = document.getElementById('pc-search-clear');
  if (inp) inp.value = '';
  if (clr) clr.style.display = 'none';
  _pcSearch = '';
  _renderPcGrid();
}

/* ── Filtre véhicule ── */
function _buildPcVehicleFilter() {
  const brandSel = document.getElementById('pc-veh-brand');
  if (!brandSel) return;
  brandSel.innerHTML = '<option value="">Sélectionner…</option>';

  const pickerData = _buildPickerData();
  const brands = pickerData ? pickerData.map(b => b.name) : BRANDS.map(b => b.name);
  brands.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name; opt.textContent = name;
    brandSel.appendChild(opt);
  });
}

function _pcVehBrandChange() {
  const brand    = document.getElementById('pc-veh-brand').value;
  const modelSel = document.getElementById('pc-veh-model');
  const yearSel  = document.getElementById('pc-veh-year');
  const applyBtn = document.getElementById('pc-veh-apply');

  modelSel.innerHTML = '<option value="">— choisir le modèle —</option>';
  yearSel.innerHTML  = '<option value="">Toutes les années</option>';
  modelSel.disabled  = !brand;
  yearSel.disabled   = true;
  if (applyBtn) applyBtn.disabled = !brand;

  if (!brand) return;

  const pickerData = _buildPickerData();
  let models = [];
  if (pickerData) {
    const bd = pickerData.find(b => b.name === brand);
    if (bd) models = bd.models.map(m => m.shortName);
  } else {
    const bd = BRANDS.find(b => b.name === brand);
    if (bd) models = bd.models;
  }
  models.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = m;
    modelSel.appendChild(opt);
  });
}

function _pcVehModelChange() {
  const brand    = document.getElementById('pc-veh-brand').value;
  const model    = document.getElementById('pc-veh-model').value;
  const yearSel  = document.getElementById('pc-veh-year');
  yearSel.innerHTML = '<option value="">Toutes les années</option>';
  yearSel.disabled  = !model;
  if (!model) return;

  const pickerData = _buildPickerData();
  let years = YEARS;
  if (pickerData && brand) {
    const bd = pickerData.find(b => b.name === brand);
    if (bd) {
      const md = bd.models.find(m => m.shortName === model);
      if (md && md.years.length) years = md.years;
    }
  }
  years.forEach(y => {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y;
    yearSel.appendChild(opt);
  });
}

function _pcApplyVehicle() {
  const brand = document.getElementById('pc-veh-brand').value;
  if (!brand) return;
  const model = document.getElementById('pc-veh-model').value;
  const year  = document.getElementById('pc-veh-year').value;
  _pcVehicle  = { brand, model: model || '', year: year ? parseInt(year) : null };
  const clrBtn = document.getElementById('pc-veh-clear');
  if (clrBtn) clrBtn.style.display = '';
  _renderPcGrid();
  _updatePcFiltersBar();
}

function _pcClearVehicle() {
  _pcVehicle = null;
  const brandSel = document.getElementById('pc-veh-brand');
  const modelSel = document.getElementById('pc-veh-model');
  const yearSel  = document.getElementById('pc-veh-year');
  const applyBtn = document.getElementById('pc-veh-apply');
  const clrBtn   = document.getElementById('pc-veh-clear');
  if (brandSel) brandSel.value = '';
  if (modelSel) { modelSel.innerHTML = '<option value="">— choisir la marque —</option>'; modelSel.disabled = true; }
  if (yearSel)  { yearSel.innerHTML = '<option value="">Toutes les années</option>'; yearSel.disabled = true; }
  if (applyBtn) applyBtn.disabled = true;
  if (clrBtn)   clrBtn.style.display = 'none';
  _renderPcGrid();
  _updatePcFiltersBar();
}

/* ── Barre de filtres actifs ── */
function _updatePcFiltersBar() {
  const bar = document.getElementById('pc-filters-bar');
  if (!bar) return;
  bar.innerHTML = '';

  const chips = [];
  if (_pcVehicle) {
    let lbl = _pcVehicle.brand;
    if (_pcVehicle.model) lbl += ' ' + _pcVehicle.model;
    if (_pcVehicle.year)  lbl += ' ' + _pcVehicle.year;
    chips.push({ label: lbl, clear: _pcClearVehicle });
  }
  if (_pcCat !== 'all') {
    const catName = (CATEGORIES.find(c => c.id === _pcCat) || {}).name || _pcCat;
    chips.push({ label: catName, clear: () => _pcSetCat('all') });
  }
  if (_pcBrand !== 'all') {
    chips.push({ label: _pcBrand, clear: () => _pcSetBrand('all') });
  }
  if (_pcSearch) {
    chips.push({ label: `"${_pcSearch}"`, clear: _pcClearSearch });
  }

  if (!chips.length) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';

  chips.forEach(({ label, clear }) => {
    const chip = document.createElement('button');
    chip.className = 'pc-filter-chip';
    chip.innerHTML = `${label} <span>×</span>`;
    chip.onclick = clear;
    bar.appendChild(chip);
  });

  if (chips.length > 1) {
    const btn = document.createElement('button');
    btn.className = 'pc-reset-all-btn';
    btn.textContent = 'Tout effacer';
    btn.onclick = () => {
      _pcClearVehicle();
      _pcCat = 'all'; _pcBrand = 'all'; _pcSearch = '';
      const inp = document.getElementById('pc-search-input');
      if (inp) inp.value = '';
      const clr = document.getElementById('pc-search-clear');
      if (clr) clr.style.display = 'none';
      document.querySelectorAll('#pc-cat-filters .pc-filter-item').forEach(b =>
        b.classList.toggle('active', b.dataset.val === 'all'));
      _buildPcBrandFilters();
      _renderPcGrid();
      _updatePcFiltersBar();
    };
    bar.appendChild(btn);
  }
}

/* ── Construction sidebar catégories ── */
function _buildPcCatFilters() {
  const el = document.getElementById('pc-cat-filters');
  if (!el) return;
  el.innerHTML = '';
  const total = _allProducts().length;

  const mkBtn = (val, label, count, active) => {
    const btn = document.createElement('button');
    btn.className = 'pc-filter-item' + (active ? ' active' : '');
    btn.dataset.val = val;
    btn.innerHTML = `${label}<span class="pc-filter-count">${count}</span>`;
    return btn;
  };

  const allBtn = mkBtn('all', 'Tous les produits', total, _pcCat === 'all');
  allBtn.onclick = () => _pcSetCat('all');
  el.appendChild(allBtn);

  for (const cat of CATEGORIES) {
    const count = (PRODUCTS[cat.id] || []).length;
    if (!count) continue;
    const btn = mkBtn(cat.id, cat.name, count, _pcCat === cat.id);
    btn.onclick = () => _pcSetCat(cat.id);
    el.appendChild(btn);
  }
}

/* ── Construction sidebar marques ── */
function _buildPcBrandFilters() {
  const el = document.getElementById('pc-brand-filters');
  if (!el) return;
  el.innerHTML = '';

  const pool = _pcCat === 'all' ? _allProducts() : _allProducts().filter(p => p._cat === _pcCat);
  const counts = {};
  pool.forEach(p => { if (p.brand) counts[p.brand] = (counts[p.brand] || 0) + 1; });
  const brands = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (!brands.length) {
    el.innerHTML = '<div style="color:var(--label-4);font-size:13px;padding:4px 10px">—</div>';
    return;
  }

  const allBtn = document.createElement('button');
  allBtn.className = 'pc-filter-item' + (_pcBrand === 'all' ? ' active' : '');
  allBtn.dataset.val = 'all';
  allBtn.textContent = 'Toutes les marques';
  allBtn.onclick = () => _pcSetBrand('all');
  el.appendChild(allBtn);

  brands.slice(0, 20).forEach(([brand, count]) => {
    const btn = document.createElement('button');
    btn.className = 'pc-filter-item' + (_pcBrand === brand ? ' active' : '');
    btn.dataset.val = brand;
    btn.innerHTML = `${brand}<span class="pc-filter-count">${count}</span>`;
    btn.onclick = () => _pcSetBrand(brand);
    el.appendChild(btn);
  });
}

/* ── Initialisation recherche ── */
function _initPcSearch() {
  const inp = document.getElementById('pc-search-input');
  const clr = document.getElementById('pc-search-clear');
  if (!inp) return;
  let _timer;
  inp.addEventListener('input', () => {
    const v = inp.value.trim();
    if (clr) clr.style.display = v ? 'flex' : 'none';
    clearTimeout(_timer);
    _timer = setTimeout(() => { _pcSearch = v; _renderPcGrid(); }, 250);
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Escape') _pcClearSearch();
  });
}

/* ── Rendu de la grille ── */
function _renderPcGrid() {
  const grid = document.getElementById('pc-grid');
  const rc   = document.getElementById('pc-result-count');
  if (!grid) return;

  let prods = _pcCat === 'all' ? _allProducts() : _allProducts().filter(p => p._cat === _pcCat);
  if (_pcBrand !== 'all') prods = prods.filter(p => p.brand === _pcBrand);

  /* Filtre véhicule */
  if (_pcVehicle) {
    const { brand, model, year } = _pcVehicle;
    prods = prods.filter(p => {
      if (brand && _norm(p.brand) !== _norm(brand)) return false;
      if (model) {
        const pm = _norm(p.model), sm = _norm(model);
        if (pm && !pm.includes(sm) && !sm.includes(pm)) return false;
      }
      if (year && !_yearInRange(p.years, year)) return false;
      return true;
    });
  }

  /* Filtre texte */
  if (_pcSearch) {
    const parsed = _parseQuery(_pcSearch);
    prods = _applyFilters(prods, parsed);
  }

  /* Tri */
  const sortEl = document.getElementById('pc-sort');
  if (sortEl) {
    if (sortEl.value === 'price-asc')  prods = [...prods].sort((a, b) => a.price - b.price);
    if (sortEl.value === 'price-desc') prods = [...prods].sort((a, b) => b.price - a.price);
  }

  if (rc) rc.textContent = `${prods.length} produit${prods.length !== 1 ? 's' : ''}`;
  grid.innerHTML = '';

  if (!prods.length) {
    grid.innerHTML = `
      <div class="pc-empty">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <div class="pc-empty-title">Aucun produit trouvé</div>
        <div class="pc-empty-sub">Modifiez vos filtres ou contactez-nous sur WhatsApp</div>
      </div>`;
    _updatePcFiltersBar();
    return;
  }

  const showCatBadge = _pcCat === 'all' && !_pcSearch && !_pcVehicle;
  prods.forEach(p => {
    const catName = showCatBadge ? ((CATEGORIES.find(c => c.id === p._cat) || {}).name || null) : null;
    grid.appendChild(_makeCard(p, catName));
  });

  _updatePcFiltersBar();
}

/* ── PC Checkout ── */
function _pcOpenCheckout(product) {
  const inCart = S.cart.some(c => c.id === product.id);
  _pcCheckoutItems = inCart ? [...S.cart] : [...S.cart, product];
  _pcBuildCheckoutItems();
  const ov = document.getElementById('pc-checkout-overlay');
  if (!ov) return;
  ov.style.display = 'flex';
  requestAnimationFrame(() => ov.classList.add('is-open'));
}

function _pcOpenCartCheckout() {
  if (!S.cart.length) return;
  _pcCheckoutItems = [...S.cart];
  closeModal('cart-drawer');
  _pcBuildCheckoutItems();
  const ov = document.getElementById('pc-checkout-overlay');
  if (!ov) return;
  ov.style.display = 'flex';
  requestAnimationFrame(() => ov.classList.add('is-open'));
}

function _pcCloseCheckout() {
  const ov = document.getElementById('pc-checkout-overlay');
  if (!ov) return;
  ov.classList.remove('is-open');
  setTimeout(() => { ov.style.display = 'none'; }, 300);
}

function _pcBuildCheckoutItems() {
  const el      = document.getElementById('pc-ck-items');
  const totalEl = document.getElementById('pc-ck-total');
  if (!el) return;

  const _CP = {'feux-arriere':'tl','portes':'dr','pare-chocs':'fb','ailes':'fen','optiques':'hl','retroviseurs':'mir','capots':'hood','coffres':'trunk'};
  el.innerHTML = _pcCheckoutItems.map(p => {
    const veh = _vehSub(p);
    const svg = PART_SVG[p.part || _CP[p._cat] || 'fb'] || PART_SVG.fb;
    return `
      <div class="pc-ck-item">
        <div class="pc-ck-item-thumb">
          ${p.img
            ? `<img src="${p.img}" alt="${p.name}" ${_shouldFlipPhoto(p)?'style="transform:scaleX(-1)"':''}
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
               <div style="display:none">${svg}</div>`
            : `<div>${svg}</div>`}
        </div>
        <div class="pc-ck-item-info">
          <div class="pc-ck-item-name">${p.name}${p.side ? ` <span class="hi-mark">${p.side}</span>` : ''}</div>
          ${veh ? `<div class="pc-ck-item-veh">${veh}</div>` : ''}
        </div>
        <div class="pc-ck-item-price">${p.price.toLocaleString('fr-MA')} DH</div>
      </div>`;
  }).join('');

  if (totalEl) {
    if (_pcCheckoutItems.length > 1) {
      const total = _pcCheckoutItems.reduce((s, p) => s + p.price, 0);
      totalEl.style.display = 'flex';
      totalEl.innerHTML = `<span>Total commande</span><span>${total.toLocaleString('fr-MA')} DH</span>`;
    } else {
      totalEl.style.display = 'none';
    }
  }

  ['pc-f-name','pc-f-tel','pc-f-addr'].forEach(id => {
    const f = document.getElementById(id); if (f) f.value = '';
  });
}

function _pcHandleOrder() {
  const name  = (document.getElementById('pc-f-name')?.value || '').trim();
  const phone = (document.getElementById('pc-f-tel')?.value  || '').trim();
  const addr  = (document.getElementById('pc-f-addr')?.value || '').trim();

  const errors = [];
  if (!name)  errors.push(document.getElementById('pc-f-name'));
  if (!phone) errors.push(document.getElementById('pc-f-tel'));

  if (errors.length) {
    errors.forEach(inp => {
      if (!inp) return;
      inp.style.borderColor = '#FF453A';
      inp.style.boxShadow   = '0 0 0 3px rgba(255,59,48,.15)';
      setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 2200);
    });
    if (errors[0]) errors[0].focus();
    return;
  }

  try {
    const order = {
      id: 'order-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
      date: new Date().toISOString(),
      client: { name, phone, addr },
      items: _pcCheckoutItems.map(p => ({
        id: p.id||'', name: p.name||'', brand: p.brand||'', model: p.model||'',
        years: p.years||'', price: +p.price||0, img: p.img||null,
      })),
      total: _pcCheckoutItems.reduce((s, p) => s + (+p.price||0), 0),
      status: 'pending',
    };
    const existing = JSON.parse(localStorage.getItem('clicauto_orders') || '[]');
    existing.unshift(order);
    localStorage.setItem('clicauto_orders', JSON.stringify(existing));
    if (window._fsOps) window._fsOps.saveOrder(order);
    try { const bc = new BroadcastChannel('clicauto-sync'); bc.postMessage({ type:'new-order', id:order.id }); bc.close(); } catch(_) {}
  } catch(e) { console.warn('Erreur sauvegarde commande:', e); }

  S.cart = [];
  updateCart();
  _pcCloseCheckout();
  openModal('modal-order');
}

/* ── PC Contact ── */
function _pcOpenContact() {
  const ov = document.getElementById('pc-contact-overlay');
  if (!ov) return;
  ov.style.display = 'flex';
  requestAnimationFrame(() => ov.classList.add('is-open'));
}

function _pcCloseContact() {
  const ov = document.getElementById('pc-contact-overlay');
  if (!ov) return;
  ov.classList.remove('is-open');
  setTimeout(() => { ov.style.display = 'none'; }, 300);
}

function _pcHandleContact() {
  const name  = (document.getElementById('pc-ct-name')?.value  || '').trim();
  const phone = (document.getElementById('pc-ct-phone')?.value || '').trim();
  const city  = (document.getElementById('pc-ct-city')?.value  || '');

  const errors = [];
  if (!name)  errors.push(document.getElementById('pc-ct-name'));
  if (!phone) errors.push(document.getElementById('pc-ct-phone'));
  if (!city)  errors.push(document.getElementById('pc-ct-city'));

  if (errors.length) {
    errors.forEach(inp => {
      if (!inp) return;
      inp.style.borderColor = '#FF453A';
      inp.style.boxShadow   = '0 0 0 3px rgba(255,59,48,.15)';
      setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 2200);
    });
    if (errors[0]) errors[0].focus();
    return;
  }

  const btn = document.getElementById('pc-ct-submit');
  if (btn) { btn.disabled = true; btn.style.opacity = '.6'; }

  setTimeout(() => {
    if (btn) { btn.disabled = false; btn.style.opacity = ''; }
    const msg = (document.getElementById('pc-ct-msg')?.value || '').trim();
    try {
      const newMsg = { id: Date.now().toString(), name, phone, city, message: msg, date: new Date().toISOString(), status: 'new' };
      const msgs = JSON.parse(localStorage.getItem('clicauto_messages') || '[]');
      msgs.push(newMsg);
      localStorage.setItem('clicauto_messages', JSON.stringify(msgs));
      if (window._fsOps) window._fsOps.saveMessage(newMsg);
    } catch(e) { console.error('Erreur sauvegarde message:', e); }
    _pcCloseContact();
    openModal('modal-contact');
    ['pc-ct-name','pc-ct-phone','pc-ct-city','pc-ct-msg'].forEach(id => {
      const f = document.getElementById(id); if (f) f.value = '';
    });
  }, 800);
}

/* ── Init PC ── */
function _initPcMode() {
  if (window.innerWidth < 1024) return;
  if (!_pcInited) {
    _pcInited = true;
    _buildPcVehicleFilter();
    _buildPcCatFilters();
    _buildPcBrandFilters();
    _initPcSearch();

    /* PC overlays : Échap pour fermer */
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      _pcCloseCheckout(); _pcCloseContact();
    });
  }
  _renderPcGrid();
}

window._pcRefresh = function() {
  if (window.innerWidth < 1024 || !_pcInited) return;
  _buildPcVehicleFilter();
  _buildPcCatFilters();
  _buildPcBrandFilters();
  _renderPcGrid();
};

/* ════════════════════════════════════════
   INIT
   ════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* 1. Sizing immédiat avant tout rendu */
  _sizeApp();

  /* Fermer modals au clic extérieur + touche Échap (mobile ET PC) */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
      closeProductDetail();
    }
  });
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
  });

  /* PC mode — arrêt ici (pas besoin du picker mobile) */
  if (window.innerWidth >= 1024) { _initPcMode(); return; }

  /* 2. État initial : seule pg-vehicle visible, les autres visibility:hidden */
  PAGE_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = '';
    el.className = id === 'pg-vehicle' ? 'page pg-active' : 'page';
  });

  initPicker();
  initScrollHeader();
  initHomeSearch();

  window.addEventListener('storage', e => {
    if (e.key !== 'clicauto_vehicles') return;
    _pickerFill();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) _pickerFill();
  });

  ['btn-search', 'btn-buy', 'btn-send'].forEach(id => {
    const el = document.getElementById(id);
    if (el) addRipple(el);
  });
});
