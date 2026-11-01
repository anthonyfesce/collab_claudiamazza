#!/usr/bin/env node
// Genera immagini di PROVA (paesaggi astratti) per vedere l'impaginazione prima che arrivino le foto di Claudia.
// Non sono fotografie: vanno cancellate, insieme a public/images/demo/, quando entrano le foto vere.
//   cd tools && node make-demo-images.mjs
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'images', 'demo');
await mkdir(out, { recursive: true });

// generatore pseudo-casuale ripetibile: stesse immagini a ogni esecuzione
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);

// palette per serie: cielo alto, cielo basso, sole, colline (dalla più lontana alla più vicina)
const PALETTES = [
  { sky: ['#e9d9c4', '#f3b88a'], sun: '#fff2d6', hills: ['#b98f7a', '#7d5a52', '#3d2b2e'] },
  { sky: ['#cfd8de', '#eef1f2'], sun: '#ffffff', hills: ['#9fb0b8', '#66808c', '#2f4450'] },
  { sky: ['#1d2a3a', '#d98a5f'], sun: '#ffd9a0', hills: ['#6b4a55', '#3b2c40', '#17141f'] },
  { sky: ['#dfe6d3', '#f4efdc'], sun: '#fffbe8', hills: ['#a9b58c', '#77875f', '#3f4d36'] },
];

function svg(w, h, p, r) {
  const cx = w * (0.25 + r() * 0.5);
  const cy = h * (0.3 + r() * 0.2);
  const hills = p.hills
    .map((c, i) => {
      const base = h * (0.55 + i * 0.12 + r() * 0.04);
      const a = h * (0.05 + r() * 0.08);
      const ph = r() * 6;
      let d = `M0 ${h} L0 ${base}`;
      for (let x = 0; x <= w; x += w / 24) d += ` L${x.toFixed(0)} ${(base + Math.sin(x / w * 5 + ph) * a).toFixed(0)}`;
      return `<path d="${d} L${w} ${h} Z" fill="${c}"/>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>
      <radialGradient id="g"><stop offset="0" stop-color="${p.sun}" stop-opacity=".95"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#s)"/>
    <circle cx="${cx}" cy="${cy}" r="${Math.min(w, h) * 0.32}" fill="url(#g)"/>
    ${hills}
  </svg>`;
}

async function make(name, w, h, pal, seed) {
  const noise = Buffer.alloc(w * h * 3);
  const rn = rng(seed + 99);
  for (let i = 0; i < noise.length; i++) noise[i] = 118 + Math.floor(rn() * 20);
  const base = await sharp(Buffer.from(svg(w, h, PALETTES[pal], rng(seed)))).png().toBuffer();
  await sharp(base)
    .composite([{ input: noise, raw: { width: w, height: h, channels: 3 }, blend: 'soft-light' }])
    .webp({ quality: 72 })
    .toFile(path.join(out, name));
}

// 4 serie; ogni serie ha una copertina 4:5 e 5 immagini con proporzioni diverse
const SHAPES = [[1600, 1067], [1067, 1600], [1600, 1067], [1400, 1400], [1600, 1067]];
let n = 0;
for (let s = 0; s < 4; s++) {
  await make(`serie-${s + 1}-cover.webp`, 1000, 1250, s, 1000 + s * 10);
  for (let i = 0; i < SHAPES.length; i++) {
    const [w, h] = SHAPES[i];
    await make(`serie-${s + 1}-${String(i + 1).padStart(2, '0')}.webp`, w, h, s, ++n * 7);
  }
}
// immagine larga per la prima pagina
await make('hero.webp', 2400, 1400, 2, 4242);
console.log('Immagini di prova create in public/images/demo/');
