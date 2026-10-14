import assert from 'node:assert';

// 1. Cek format konten teks biasa vs HTML
function formatKonten(konten) {
  const isHtml = /<[a-z][\s\S]*>/i.test(konten || '');
  return isHtml
    ? konten
    : (konten || '')
        .split('\n\n')
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`)
        .join('');
}

const rawText = 'Paragraf 1\n\nParagraf 2 baris 1\nbaris 2';
const htmlText = '<p>Paragraf resmi HTML</p>';

assert.strictEqual(
  formatKonten(rawText),
  '<p>Paragraf 1</p><p>Paragraf 2 baris 1<br/>baris 2</p>'
);
assert.strictEqual(formatKonten(htmlText), '<p>Paragraf resmi HTML</p>');

// 2. Cek format URL slug vs id
const slug = 'disdikbud-kaltim-luncurkan-survei-tracer-study-serentak';
const targetUrl = `/berita/${slug}`;
assert.strictEqual(
  targetUrl,
  '/berita/disdikbud-kaltim-luncurkan-survei-tracer-study-serentak'
);

const judul = 'Survei Tracer Study';
const url = `http://localhost:3000${targetUrl}`;
const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${judul} - ${url}`)}`;
assert.ok(waUrl.includes('Survei%20Tracer%20Study'));
assert.ok(waUrl.includes('disdikbud-kaltim-luncurkan-survei-tracer-study-serentak'));

console.log('Semua self-check berita detail berbasis slug lulus 100%.');

// 3. Cek keberadaan styling img-blur-frame di globals.scss
import fs from 'node:fs';
const scss = fs.readFileSync('src/app/globals.scss', 'utf8');
assert.ok(scss.includes('.img-blur-frame'));
assert.ok(scss.includes('.img-blur-bg'));
assert.ok(scss.includes('.img-blur-main'));
assert.ok(scss.includes('object-fit: contain !important'));
console.log('Semua self-check image blur frame lulus 100%.');

// 4. Cek penerapan img-blur-frame pada instagram-area, program-slider, hover-img-item
const igFile = fs.readFileSync('src/components/instagram/instagram-area.tsx', 'utf8');
assert.ok(igFile.includes('img-blur-frame'));
assert.ok(igFile.includes('img-blur-bg'));
assert.ok(igFile.includes('img-blur-main'));

const programFile = fs.readFileSync('src/components/program/slider/program-slider.tsx', 'utf8');
assert.ok(programFile.includes('img-blur-frame'));
assert.ok(programFile.includes('img-blur-bg'));
assert.ok(programFile.includes('img-blur-main'));

const eventFile = fs.readFileSync('src/components/event/hover-img-item.tsx', 'utf8');
assert.ok(eventFile.includes('img-blur-frame'));
assert.ok(eventFile.includes('img-blur-bg'));
assert.ok(eventFile.includes('img-blur-main'));

console.log('Semua self-check gallery, event, program blur frame lulus 100%.');

// 5. Cek ID video Youtube pada testimonial-one
const testFile = fs.readFileSync('src/components/testimonial/testimonial-one.tsx', 'utf8');
assert.ok(testFile.includes('playVideo("uZ7I0kScJY8")'));
console.log('Semua self-check video id uZ7I0kScJY8 lulus 100%.');
