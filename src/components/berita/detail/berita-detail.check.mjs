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

// 2. Cek format URL share WhatsApp & X
const id = 1;
const judul = 'Survei Tracer Study';
const url = `http://localhost:3000/berita/${id}`;
const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${judul} - ${url}`)}`;
assert.ok(waUrl.includes('Survei%20Tracer%20Study'));
assert.ok(waUrl.includes('localhost%3A3000%2Fberita%2F1'));

console.log('Semua self-check berita detail lulus 100%.');
