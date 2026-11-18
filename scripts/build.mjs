// Regenerates the SVGs in assets/ from the data below.
//   node scripts/build.mjs
// SVGs shown through <img> on GitHub can't load web fonts, so every font stack
// falls back to fonts that ship with Windows/macOS/Linux.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(out, { recursive: true });

const C = {
  bg: '#0b0d10', panel: '#13171c', panel2: '#1a1f26', line: '#262d36',
  fg: '#eef1f4', dim: '#8b95a1', faint: '#5f6873',
  accent: '#ff5a36', red: '#e5383b', purple: '#b46cff', green: '#3ddc84', yellow: '#ffd23f',
};
const DISPLAY = `'Bahnschrift','Arial Narrow','Roboto Condensed','Helvetica Neue',Arial,sans-serif`;
const BODY = `'Segoe UI','Inter',-apple-system,'Helvetica Neue',Arial,sans-serif`;
const MONO = `'Cascadia Mono',Consolas,'SF Mono',Menlo,'DejaVu Sans Mono',monospace`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Red/white kerb along a horizontal edge.
function kerb(y, w, h = 8) {
  let s = '';
  for (let x = 0, i = 0; x < w; x += 24, i++) s += `<rect x="${x}" y="${y}" width="24" height="${h}" fill="${i % 2 ? '#e9ecef' : C.red}"/>`;
  return s;
}

/* ---------------- banner ---------------- */
function banner() {
  const W = 1200, H = 360;
  // speed trace: a lap's worth of throttle/brake shaped as a smooth-ish polyline
  const pts = [];
  const shape = [0.2, 0.55, 0.9, 0.95, 0.35, 0.25, 0.7, 0.92, 0.98, 0.4, 0.3, 0.6, 0.85, 0.5, 0.2, 0.65, 0.9, 0.97, 0.3];
  const x0 = 640, x1 = 1150, y0 = 262, y1 = 118;
  for (let i = 0; i <= 120; i++) {
    const t = i / 120, f = t * (shape.length - 1), k = Math.floor(f), r = f - k;
    const a = shape[k], b = shape[Math.min(k + 1, shape.length - 1)];
    const v = a + (b - a) * (r * r * (3 - 2 * r));
    pts.push(`${(x0 + (x1 - x0) * t).toFixed(1)},${(y0 - (y0 - y1) * v).toFixed(1)}`);
  }
  const trace = pts.join(' ');
  const sectors = [
    ['S1', 'ABOUT', C.purple, '28.114'],
    ['S2', 'EXPERIENCE', C.green, '31.702'],
    ['S3', 'PROJECTS', C.green, '24.381'],
    ['S4', 'SKILLS', C.yellow, '19.950'],
  ];
  const sw = (x1 - x0) / 4;
  const sectorSvg = sectors.map(([s, label, col, time], i) => {
    const x = x0 + i * sw;
    return `<rect x="${x + 2}" y="284" width="${sw - 4}" height="4" rx="2" fill="${col}"/>
    <text x="${x + 2}" y="306" font-family="${MONO}" font-size="12" fill="${C.dim}">${s} · ${label}</text>
    <text x="${x + 2}" y="326" font-family="${MONO}" font-size="15" font-weight="700" fill="${col}">${time}</text>`;
  }).join('\n');
  const grid = [0, 1, 2, 3].map((i) => `<line x1="${x0}" x2="${x1}" y1="${y1 + i * 48}" y2="${y1 + i * 48}" stroke="${C.line}" stroke-dasharray="2 6"/>`).join('');
  const dividers = [1, 2, 3].map((i) => `<line x1="${x0 + i * sw}" x2="${x0 + i * sw}" y1="${y1 - 6}" y2="${y0 + 4}" stroke="${C.yellow}" stroke-opacity=".35" stroke-dasharray="3 5"/>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">Aditya Thomas</title>
  <desc id="d">Software engineer in automotive manufacturing. Pit-wall style header with a live speed trace.</desc>
  <defs>
    <clipPath id="r"><rect width="${W}" height="${H}" rx="14"/></clipPath>
    <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="${C.accent}" stop-opacity=".18"/><stop offset=".6" stop-color="${C.accent}" stop-opacity="0"/></linearGradient>
    <linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${C.accent}" stop-opacity=".28"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></linearGradient>
    <pattern id="carbon" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${C.bg}"/><path d="M0 8L8 0" stroke="#11151a" stroke-width="2"/></pattern>
  </defs>
  <style>
    .draw { stroke-dasharray: 1400; stroke-dashoffset: 1400; animation: draw 6s cubic-bezier(.5,0,.3,1) infinite; }
    .areaf { opacity: 0; animation: fill 6s ease-in-out infinite; }
    .live { animation: blink 1.2s steps(2, start) infinite; }
    .car { offset-path: path('M${pts.map((p, i) => (i ? 'L' : '') + p.replace(',', ' ')).join(' ')}'); animation: drive 6s cubic-bezier(.5,0,.3,1) infinite; }
    @keyframes draw { 0% { stroke-dashoffset: 1400 } 70%, 100% { stroke-dashoffset: 0 } }
    @keyframes fill { 0%, 55% { opacity: 0 } 75%, 92% { opacity: 1 } 100% { opacity: 0 } }
    @keyframes blink { to { visibility: hidden } }
    @keyframes drive { 0% { offset-distance: 0% } 70%, 100% { offset-distance: 100% } }
    @media (prefers-reduced-motion: reduce) { .draw, .car { animation: none; stroke-dashoffset: 0 } .areaf { animation: none; opacity: 1 } .live { animation: none } }
  </style>
  <g clip-path="url(#r)">
    <rect width="${W}" height="${H}" fill="url(#carbon)"/>
    <rect width="${W}" height="${H}" fill="url(#fade)"/>
    <rect x="0" y="0" width="8" height="${H}" fill="${C.accent}"/>

    <!-- top strip -->
    <text x="44" y="50" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${C.dim}">PIT WALL · CIRCUIT AT-26</text>
    <circle cx="1088" cy="45" r="5" fill="${C.red}" class="live"/>
    <text x="1100" y="50" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="2" fill="${C.fg}">LIVE</text>

    <!-- driver -->
    <text x="40" y="196" font-family="${DISPLAY}" font-size="150" font-weight="700" font-style="italic" fill="${C.accent}" letter-spacing="-6">26</text>
    <text x="236" y="132" font-family="${DISPLAY}" font-size="58" font-weight="700" letter-spacing="1" fill="${C.fg}">ADITYA</text>
    <text x="236" y="190" font-family="${DISPLAY}" font-size="58" font-weight="700" letter-spacing="1" fill="${C.fg}">THOMAS</text>
    <text x="44" y="244" font-family="${BODY}" font-size="21" fill="${C.fg}">Software Engineer · Automotive manufacturing</text>
    <text x="44" y="274" font-family="${BODY}" font-size="16" fill="${C.dim}">I build the software behind production lines: full-stack apps,</text>
    <text x="44" y="296" font-family="${BODY}" font-size="16" fill="${C.dim}">pipelines and dashboards that turn plant-floor data into decisions.</text>
    <text x="44" y="330" font-family="${MONO}" font-size="13" fill="${C.faint}">MAGNA INTERNATIONAL · U OF GUELPH B.ENG COMPE '26 · ONTARIO, CA</text>

    <!-- telemetry -->
    <text x="${x0}" y="96" font-family="${MONO}" font-size="12" letter-spacing="2" fill="${C.dim}">SPEED TRACE · BEST LAP</text>
    <text x="${x1}" y="96" text-anchor="end" font-family="${MONO}" font-size="12" fill="${C.purple}">1:44.147</text>
    ${grid}
    ${dividers}
    <polygon class="areaf" points="${x0},${y0} ${trace} ${x1},${y0}" fill="url(#area)"/>
    <polyline points="${trace}" fill="none" stroke="${C.purple}" stroke-opacity=".55" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>
    <polyline class="draw" points="${trace}" fill="none" stroke="${C.accent}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <circle class="car" r="6" fill="${C.fg}" stroke="${C.accent}" stroke-width="3"/>
    ${sectorSvg}

    ${kerb(H - 8, W)}
  </g>
</svg>
`;
}

/* ---------------- project cards ---------------- */
const projects = [
  {
    file: 'card-hip-gpt2.svg', pos: 'P1', name: 'hip-gpt2', status: 'RESULTS IN', statusColor: C.green,
    line1: 'Six hand-written HIP GEMM kernels, naive → tensor cores,',
    line2: 'feeding a C++/HIP GPT-2 inference engine. No PyTorch at runtime.',
    stat: 'benchmarked vs hipBLAS · RTX 4060 · MI300X next',
    chips: ['HIP', 'C++', 'CUDA', 'Python'],
  },
  {
    file: 'card-pivault.svg', pos: 'P2', name: 'PiVault', status: 'WIP', statusColor: C.yellow,
    line1: 'Self-hosted photo & file cloud on a Raspberry Pi 5,',
    line2: 'with its own iPhone app for camera-roll backup.',
    stat: 'Tailscale only · zero open router ports',
    chips: ['FastAPI', 'React Native', 'Postgres', 'Ansible'],
  },
  {
    file: 'card-capstone.svg', pos: 'P3', name: 'ClogGuard', status: 'PROPOSAL', statusColor: C.yellow,
    line1: 'Capstone: catch developing nozzle clogs on desktop FDM',
    line2: '3D printers before a print fails, and correct them.',
    stat: 'Klipper · sensors · U of Guelph 3D Printing Lab',
    chips: ['Klipper', 'Embedded', 'Python', 'Hardware'],
  },
  {
    file: 'card-site.svg', pos: 'P4', name: 'adithomas.github.io', status: 'LIVE', statusColor: C.green,
    line1: 'My portfolio is a circuit. Drive the lap with the arrow keys',
    line2: 'and each sector opens a section. Or let the autopilot drive.',
    stat: 'vanilla JS · canvas · no framework',
    chips: ['JavaScript', 'Canvas', 'CSS'],
  },
];

function card(p) {
  const W = 600, H = 210;
  let cx = 24;
  const chips = p.chips.map((c) => {
    const w = Math.round(c.length * 7.6 + 20);
    const s = `<rect x="${cx}" y="162" width="${w}" height="26" rx="4" fill="${C.panel2}" stroke="${C.line}"/><text x="${cx + w / 2}" y="179.5" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${C.fg}">${esc(c)}</text>`;
    cx += w + 8;
    return s;
  }).join('');
  const sw = Math.round(p.status.length * 8 + 26);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`${p.name}: ${p.line1} ${p.line2}`)}">
  <defs><clipPath id="r"><rect width="${W}" height="${H}" rx="12"/></clipPath></defs>
  <g clip-path="url(#r)">
    <rect width="${W}" height="${H}" fill="${C.panel}"/>
    <rect width="${W}" height="${H}" rx="12" fill="none" stroke="${C.line}" stroke-width="2"/>
    <rect width="6" height="${H}" fill="${C.accent}"/>
    <text x="24" y="50" font-family="${DISPLAY}" font-size="30" font-weight="700" font-style="italic" fill="${C.accent}">${p.pos}</text>
    <text x="74" y="49" font-family="${DISPLAY}" font-size="28" font-weight="700" fill="${C.fg}">${esc(p.name)}</text>
    <rect x="${W - 24 - sw}" y="26" width="${sw}" height="26" rx="13" fill="none" stroke="${p.statusColor}"/>
    <circle cx="${W - 24 - sw + 14}" cy="39" r="4" fill="${p.statusColor}"/>
    <text x="${W - 24 - sw + 24}" y="43.5" font-family="${MONO}" font-size="12" font-weight="700" fill="${p.statusColor}">${p.status}</text>
    <text x="24" y="88" font-family="${BODY}" font-size="16" fill="${C.fg}">${esc(p.line1)}</text>
    <text x="24" y="111" font-family="${BODY}" font-size="16" fill="${C.fg}">${esc(p.line2)}</text>
    <text x="24" y="142" font-family="${MONO}" font-size="13" fill="${C.dim}">› ${esc(p.stat)}</text>
    ${chips}
  </g>
</svg>
`;
}

/* ---------------- section headers ---------------- */
function header(file, code, title, color = C.accent) {
  const W = 1200, H = 56;
  return [file, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">
  <rect x="0" y="12" width="6" height="32" fill="${color}"/>
  <text x="22" y="38" font-family="${MONO}" font-size="15" font-weight="700" letter-spacing="2" fill="${color}">${esc(code)}</text>
  <text x="${22 + code.length * 10 + 18}" y="40" font-family="${DISPLAY}" font-size="28" font-weight="700" letter-spacing="1" fill="#8b95a1">${esc(title)}</text>
  <line x1="${22 + code.length * 10 + 18 + title.length * 17 + 20}" x2="${W}" y1="29" y2="29" stroke="#8b95a1" stroke-opacity=".35" stroke-dasharray="2 6" stroke-width="2"/>
</svg>
`];
}

/* ---------------- toolkit ---------------- */
function toolkit() {
  const rows = [
    ['LANGUAGES', ['Java', 'TypeScript', 'JavaScript', 'Python', 'C++', 'HIP / CUDA', 'SQL', 'Bash', 'PowerShell']],
    ['APPS & DATA', ['React', 'React Native', 'FastAPI', 'PostgreSQL', 'SQLite', 'Databricks', 'Power BI', 'Grafana']],
    ['INFRA', ['Linux', 'Docker', 'GitHub Actions', 'Ansible', 'Tailscale', 'Raspberry Pi', 'MES integration']],
  ];
  const W = 1200, rowH = 54, H = rows.length * rowH + 24;
  let body = '';
  rows.forEach(([label, items], r) => {
    const y = 20 + r * rowH;
    body += `<text x="24" y="${y + 23}" font-family="${MONO}" font-size="12" letter-spacing="2" fill="${C.dim}">${esc(label)}</text>`;
    let x = 170;
    for (const it of items) {
      const w = Math.round(it.length * 8.2 + 26);
      body += `<rect x="${x}" y="${y}" width="${w}" height="34" rx="5" fill="${C.panel2}" stroke="${C.line}"/><text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" font-family="${MONO}" font-size="13.5" fill="${C.fg}">${esc(it)}</text>`;
      x += w + 10;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Toolkit: ${esc(rows.map((r) => r[1].join(', ')).join('; '))}">
  <rect width="${W}" height="${H}" rx="12" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/>
  ${body}
</svg>
`;
}

const files = [
  ['banner.svg', banner()],
  ['toolkit.svg', toolkit()],
  ...projects.map((p) => [p.file, card(p)]),
  header('h-grid.svg', '01', 'THE GRID'),
  header('h-stints.svg', '02', 'STINT HISTORY'),
  header('h-toolkit.svg', '03', 'TOOLKIT'),
  header('h-paddock.svg', '04', 'ALSO IN THE PADDOCK'),
];
for (const [name, svg] of files) writeFileSync(join(out, name), svg);
console.log(`wrote ${files.length} files to ${out}`);
