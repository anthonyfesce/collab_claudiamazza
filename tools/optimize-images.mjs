#!/usr/bin/env node
// Prepara le foto di una serie per il web e stampa il codice HTML da incollare in public/index.html.
//
//   cd tools && npm install            (solo la prima volta)
//   node optimize-images.mjs <cartella-originali> <slug-serie> [--alt "testo"]
//
// Esempio:
//   node optimize-images.mjs ~/originali/mare-d-inverno mare-d-inverno
//
// Le foto vengono ordinate per nome file (01-, 02-, ...). Gli originali NON vengono copiati nella repository:
// in public/images/<slug>/ finiscono solo le versioni web (WebP, più larghezze). I metadati (GPS, modello
// di fotocamera, ecc.) vengono rimossi, l'orientamento viene applicato e il colore convertito in sRGB.
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const WIDTHS = [480, 960, 1600, 2400];
const QUALITY = 82;
const EXT = /\.(jpe?g|png|webp)$/i;

const args = process.argv.slice(2);
const [srcDir, slug] = args.filter((a) => !a.startsWith('--'));
if (!srcDir || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Uso: node optimize-images.mjs <cartella-originali> <slug-serie>\nLo slug usa solo lettere minuscole, numeri e trattini.');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'images', slug);
await mkdir(outDir, { recursive: true });

const files = (await readdir(srcDir)).filter((f) => EXT.test(f)).sort();
if (!files.length) {
  console.error(`Nessuna immagine (jpg, png, webp) in ${srcDir}`);
  process.exit(1);
}

const slugify = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const figures = [];
for (const file of files) {
  const base = slugify(path.parse(file).name);
  const input = path.join(srcDir, file);
  const meta = await sharp(input).rotate().metadata();
  // dopo rotate() larghezza e altezza possono essere scambiate: le leggo dal risultato reale
  const { info } = await sharp(input).rotate().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  const made = [];
  for (const width of WIDTHS) {
    const target = Math.min(width, w); // niente ingrandimenti oltre l'originale
    const name = `${base}-${target}.webp`;
    await sharp(input)
      .rotate()
      .resize({ width: target, withoutEnlargement: true })
      .toColourspace('srgb')
      .webp({ quality: QUALITY })
      .toFile(path.join(outDir, name));
    made.push({ name, width: target });
    if (width >= w) break; // l'ultima versione è la larghezza originale
  }

  const srcset = made.map((m) => `/images/${slug}/${m.name} ${m.width}w`).join(', ');
  const small = made.find((m) => m.width >= 960) ?? made[made.length - 1];
  const big = made[made.length - 1];
  figures.push(
    `          <figure class="photo" style="--w:${w};--h:${h}">\n` +
      `            <a href="/images/${slug}/${big.name}" data-caption="">\n` +
      `              <img src="/images/${slug}/${small.name}" srcset="${srcset}" sizes="(max-width: 520px) 100vw, 50vw" width="${w}" height="${h}" loading="lazy" alt="[ALT DA SCRIVERE: ${file}]">\n` +
      `            </a>\n` +
      `          </figure>`,
  );
  console.error(`ok  ${file}  ${meta.width}x${meta.height}  ->  ${made.length} versioni`);
}

console.log(`<div class="gallery">\n${figures.join('\n')}\n        </div>`);
console.error(`\nFatto: ${files.length} foto in public/images/${slug}/. Incolla il blocco stampato sopra nella serie giusta e scrivi i testi alternativi (alt).`);
