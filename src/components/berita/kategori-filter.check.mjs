import assert from 'node:assert';

const normalizeText = (text) =>
  (text || '')
    .trim()
    .toLowerCase()
    .replace(/&amp;/g, '&');

const news = [
  { id: 1, title: 'Berita Kebijakan', tag: 'Kebijakan & Evaluasi' },
  { id: 2, title: 'Berita IKN', tag: 'Peluang Karir & IKN' },
  { id: 3, title: 'Berita Beasiswa', tag: 'Beasiswa & Kuliah' },
];

const selectedCategory = 'Beasiswa & Kuliah';

const filtered = news.filter((item) => {
  return (
    selectedCategory === 'Semua' ||
    normalizeText(item.tag) === normalizeText(selectedCategory)
  );
});

assert.strictEqual(filtered.length, 1);
assert.strictEqual(filtered[0].id, 3);
assert.strictEqual(filtered[0].tag, 'Beasiswa & Kuliah');

// Cek encoding URL
const decodedFromUrl = decodeURIComponent('Beasiswa%20%26%20Kuliah');
assert.strictEqual(decodedFromUrl, 'Beasiswa & Kuliah');
assert.strictEqual(normalizeText(decodedFromUrl), normalizeText(news[2].tag));

console.log('Self-check filter kategori via query string lulus 100%');
