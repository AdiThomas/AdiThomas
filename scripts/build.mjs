// Regenerates every SVG in assets/ (dark and light versions) from the data below.
//   node scripts/build.mjs
// SVGs shown through <img> on GitHub can't load web fonts, so every font stack
// falls back to fonts that ship with Windows, macOS and Linux.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(out, { recursive: true });

/* ---------------- content ---------------- */

const ME = {
  kana: 'アディティヤ・トーマス',
  name: 'Aditya Thomas',
  role: 'Software Engineer at Magna International',
  school: 'B.Eng. Computer Engineering · University of Guelph · Class of 2027',
  pitch: [
    'I build software for the factory floor: plant dashboards,',
    'data pipelines, and the infrastructure that keeps them running.',
  ],
  coords: '43.5448° N  80.2482° W  ·  GUELPH, ON',
};

const PROJECTS = [
  {
    file: 'hip-gpt2', name: 'hip-gpt2', status: ['Benchmarked', 'green'],
    desc: 'Six hand-written HIP matrix-multiply kernels, from a naive baseline to matrix cores, feeding a C++/HIP GPT-2 inference engine with no PyTorch at runtime.',
    meta: 'vs hipBLAS on RTX 4060 · perf CI on every commit',
    tags: ['C++', 'HIP / CUDA', 'GPU kernels', 'Python'],
  },
  {
    file: 'pivault', name: 'PiVault', status: ['In progress', 'amber'],
    desc: 'Self-hosted photo and file cloud on a Raspberry Pi 5, with its own iPhone app for camera-roll backup. Reachable anywhere over Tailscale with zero open ports.',
    meta: 'mergerfs + SnapRAID · nightly restic backups · Grafana',
    tags: ['FastAPI', 'React Native', 'PostgreSQL', 'Ansible'],
  },
  {
    file: 'ds-automation-pipeline', name: 'ds-automation-pipeline', status: ['Collab', 'blue'],
    desc: 'An unattended pipeline that turns one Shopify product into two 15-second video ads a day and publishes them to Shorts, Reels and TikTok.',
    meta: 'with haashirk20 · 365 tests · idempotent publishing',
    tags: ['TypeScript', 'Node 24', 'SQLite', 'Claude API', 'Docker'],
  },
  {
    file: 'clogguard', name: 'ClogGuard · capstone', status: ['Proposal', 'amber'],
    desc: 'Detects developing nozzle clogs on a Klipper 3D printer, recovers safely when it can, and pauses and alerts when it can\'t. Team of four, Group 51.',
    meta: 'client: U of Guelph 3D Printing Lab · sensor-agnostic ML',
    tags: ['Python', 'Klipper', 'Embedded', 'ML'],
  },
  {
    file: 'copilot', name: 'Enterprise AI Ops Copilot', status: ['Early stage', 'grey'],
    desc: 'A multi-agent IT support and knowledge assistant: retrieval over internal docs with pgvector and automated workflows in n8n.',
    meta: 'RAG · multi-agent · Docker Compose',
    tags: ['FastAPI', 'pgvector', 'Redis', 'n8n'],
  },
  {
    file: 'site', name: 'adithomas.github.io', status: ['Live', 'green'],
    desc: 'My interactive portfolio: drive a lap around a circuit and each sector opens a section of the site.',
    meta: 'vanilla JS · canvas · no framework',
    tags: ['JavaScript', 'Canvas', 'CSS'],
  },
];

const TOOLKIT = [
  ['Languages', ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'C', 'HIP / CUDA', 'SQL', 'Bash', 'PowerShell']],
  ['Frameworks', ['FastAPI', 'React', 'React Native', 'Node.js', 'Expo', 'Remotion']],
  ['Data', ['PostgreSQL', 'SQLite', 'Databricks', 'Power BI', 'Grafana', 'Prometheus']],
  ['Infra', ['Docker', 'GitHub Actions', 'Ansible', 'Linux', 'Tailscale', 'Raspberry Pi', 'MES integration']],
];

/* ---------------- theme ---------------- */

const THEMES = {
  dark: {
    bg: '#0d1117', panel: '#11161d', line: '#262c36', grid: '#1b212a',
    fg: '#e6edf3', body: '#c9d1d9', dim: '#8b949e', faint: '#5b636e',
    accent: '#e5484d', chip: '#161b22',
    green: '#3fb950', amber: '#d29922', blue: '#58a6ff', grey: '#8b949e',
  },
  light: {
    bg: '#ffffff', panel: '#f6f8fa', line: '#d0d7de', grid: '#eaeef2',
    fg: '#1f2328', body: '#31363c', dim: '#59636e', faint: '#8c959f',
    accent: '#cf222e', chip: '#ffffff',
    green: '#1a7f37', amber: '#9a6700', blue: '#0969da', grey: '#59636e',
  },
};

const SANS = `'Segoe UI','Inter',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif`;
const MONO = `'Cascadia Mono',Consolas,'SF Mono',Menlo,'DejaVu Sans Mono',monospace`;
const JP = `'Hiragino Sans','Yu Gothic UI','Yu Gothic','Meiryo','Noto Sans CJK JP','Noto Sans JP',sans-serif`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const monoW = (s, size) => s.length * size * 0.6; // monospace advance is ~0.6em

function wrap(text, maxChars) {
  const lines = [];
  let cur = '';
  for (const w of text.split(' ')) {
    if ((cur + ' ' + w).trim().length > maxChars) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

function chips(tags, x, y, t, size = 12) {
  let s = '', cx = x;
  for (const tag of tags) {
    const w = monoW(tag, size) + 20;
    s += `<rect x="${cx}" y="${y}" width="${w}" height="26" rx="6" fill="${t.chip}" stroke="${t.line}"/>`;
    s += `<text x="${cx + w / 2}" y="${y + 17.5}" text-anchor="middle" font-family="${MONO}" font-size="${size}" fill="${t.body}">${esc(tag)}</text>`;
    cx += w + 8;
  }
  return s;
}

/* ---------------- hero ---------------- */

// Topographic contours around a peak, plus a mountain road (touge) with hairpins.
function contours(cx, cy, t) {
  let s = '';
  for (let k = 1; k <= 9; k++) {
    const r = 18 + k * 21;
    const pts = [];
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const n = 1 + 0.13 * Math.sin(3 * a + k * 0.7) + 0.07 * Math.cos(5 * a - k);
      pts.push(`${(cx + Math.cos(a) * r * 1.45 * n).toFixed(1)},${(cy + Math.sin(a) * r * 0.82 * n).toFixed(1)}`);
    }
    s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${t.dim}" stroke-opacity="${(0.32 - k * 0.025).toFixed(3)}" stroke-width="1"/>`;
  }
  return s;
}

const ROAD = 'M700,300 C770,296 840,270 800,236 C764,206 742,186 812,170 C888,152 930,188 960,150 C986,118 930,104 984,84 C1040,64 1084,104 1120,70 C1146,46 1172,40 1210,38';

function hero(t, mode) {
  const W = 1200, H = 320;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">${ME.name}</title>
  <desc id="d">${esc(ME.role)}. ${esc(ME.school)}. ${esc(ME.pitch.join(' '))}</desc>
  <defs>
    <clipPath id="r"><rect width="${W}" height="${H}" rx="12"/></clipPath>
    <linearGradient id="fadeL" x1="0" x2="1"><stop offset="0" stop-color="${t.bg}"/><stop offset=".55" stop-color="${t.bg}"/><stop offset=".75" stop-color="${t.bg}" stop-opacity="0"/></linearGradient>
  </defs>
  <style>
    .road { stroke-dasharray: 900; animation: draw 2.4s cubic-bezier(.4,0,.2,1) .2s both; }
    .dot { offset-path: path('${ROAD}'); offset-distance: 0%; animation: run 9s cubic-bezier(.45,0,.55,1) 2.6s infinite; opacity: 0; }
    @keyframes draw { from { stroke-dashoffset: 900; } to { stroke-dashoffset: 0; } }
    @keyframes run { 0% { offset-distance: 0%; opacity: 0; } 6% { opacity: 1; } 94% { opacity: 1; } 100% { offset-distance: 100%; opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .road { animation: none; } .dot { animation: none; opacity: 0; } }
  </style>
  <g clip-path="url(#r)">
    <rect width="${W}" height="${H}" fill="${t.bg}"/>
    ${contours(1010, 150, t)}
    <path d="${ROAD}" fill="none" stroke="${t.line}" stroke-width="9" stroke-linecap="round"/>
    <path class="road" d="${ROAD}" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round"/>
    <circle class="dot" r="4.5" fill="${t.accent}"/>
    <rect width="${W}" height="${H}" fill="url(#fadeL)"/>

    <text x="56" y="70" font-family="${JP}" font-size="15" letter-spacing="3" fill="${t.accent}">${ME.kana}</text>
    <text x="54" y="132" font-family="${SANS}" font-size="56" font-weight="700" letter-spacing="-1" fill="${t.fg}">${ME.name}</text>
    <text x="56" y="172" font-family="${SANS}" font-size="22" font-weight="600" fill="${t.body}">${esc(ME.role)}</text>
    <text x="56" y="200" font-family="${SANS}" font-size="15" fill="${t.dim}">${esc(ME.school)}</text>
    <line x1="56" x2="96" y1="226" y2="226" stroke="${t.accent}" stroke-width="2"/>
    ${ME.pitch.map((l, i) => `<text x="56" y="${254 + i * 24}" font-family="${SANS}" font-size="17" fill="${t.body}">${esc(l)}</text>`).join('\n    ')}

    <text x="${W - 40}" y="${H - 28}" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="1.5" fill="${t.faint}">${ME.coords}</text>
    <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="${t.line}"/>
  </g>
</svg>`;
}

/* ---------------- project cards ---------------- */

function card(p, i, t) {
  const W = 600, H = 240;
  const [label, tone] = p.status;
  const pillW = label.length * 7.4 + 34;
  const lines = wrap(p.desc, 64).slice(0, 3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(p.name)}: ${esc(p.desc)}">
  <defs><clipPath id="r"><rect width="${W}" height="${H}" rx="10"/></clipPath></defs>
  <g clip-path="url(#r)">
    <rect width="${W}" height="${H}" fill="${t.panel}"/>
    <text x="28" y="44" font-family="${MONO}" font-size="12" letter-spacing="1" fill="${t.accent}">${String(i + 1).padStart(2, '0')}</text>
    <text x="56" y="45" font-family="${SANS}" font-size="23" font-weight="600" fill="${t.fg}">${esc(p.name)}</text>
    <rect x="${W - 28 - pillW}" y="25" width="${pillW}" height="24" rx="12" fill="none" stroke="${t[tone]}" stroke-opacity=".7"/>
    <circle cx="${W - 28 - pillW + 14}" cy="37" r="3.5" fill="${t[tone]}"/>
    <text x="${W - 28 - pillW + 23}" y="41" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing=".5" fill="${t[tone]}">${esc(label.toUpperCase())}</text>
    ${lines.map((l, k) => `<text x="28" y="${86 + k * 23}" font-family="${SANS}" font-size="15.5" fill="${t.body}">${esc(l)}</text>`).join('\n    ')}
    <text x="28" y="168" font-family="${MONO}" font-size="12" fill="${t.dim}">${esc(p.meta)}</text>
    ${chips(p.tags, 28, 186, t)}
    <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="10" fill="none" stroke="${t.line}"/>
  </g>
</svg>`;
}

/* ---------------- toolkit ---------------- */

function toolkit(t) {
  const W = 1200, rowH = 46, top = 28;
  const H = top * 2 + TOOLKIT.length * rowH - 20;
  const rows = TOOLKIT.map(([label, items], i) => {
    const y = top + i * rowH;
    return `<text x="32" y="${y + 17.5}" font-family="${MONO}" font-size="11" letter-spacing="1.5" fill="${t.faint}">${label.toUpperCase()}</text>
    ${chips(items, 168, y, t, 12.5)}`;
  }).join('\n    ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Toolkit: ${esc(TOOLKIT.map(([l, it]) => `${l}: ${it.join(', ')}`).join('. '))}">
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="10" fill="${t.panel}" stroke="${t.line}"/>
    ${rows}
</svg>`;
}

/* ---------------- write ---------------- */

for (const [mode, t] of Object.entries(THEMES)) {
  writeFileSync(join(out, `hero-${mode}.svg`), hero(t, mode));
  writeFileSync(join(out, `toolkit-${mode}.svg`), toolkit(t));
  PROJECTS.forEach((p, i) => writeFileSync(join(out, `card-${p.file}-${mode}.svg`), card(p, i, t)));
}
console.log(`wrote ${2 * (2 + PROJECTS.length)} SVGs to ${out}`);
