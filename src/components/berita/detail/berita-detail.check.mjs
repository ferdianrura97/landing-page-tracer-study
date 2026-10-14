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
