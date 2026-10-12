import assert from "node:assert";

// Self-check logic filter berita & static tag
const mockNews = [
  { id: 1, title: "Survei Tracer Study Serentak Kaltim", tag: "Kebijakan & Evaluasi", desc: "Deskripsi 1", author: "Humas" },
  { id: 2, title: "Peluang Kerja Vokasi IKN", tag: "Peluang Karir & IKN", desc: "Deskripsi 2", author: "Bidang SMK" },
  { id: 3, title: "Beasiswa Kuliah Alumni Unggul", tag: "Beasiswa & Kuliah", desc: "Deskripsi 3", author: "Disdikbud" }
];

const filterByCategory = (items, cat) => cat === "Semua" ? items : items.filter((i) => i.tag === cat);
assert.strictEqual(filterByCategory(mockNews, "Semua").length, 3);
assert.strictEqual(filterByCategory(mockNews, "Peluang Karir & IKN").length, 1);

const filterBySearch = (items, kw) => !kw ? items : items.filter((i) =>
  i.title.toLowerCase().includes(kw.toLowerCase()) ||
  i.desc.toLowerCase().includes(kw.toLowerCase())
);
assert.strictEqual(filterBySearch(mockNews, "ikn").length, 1);
assert.strictEqual(filterBySearch(mockNews, "tracer").length, 1);

console.log("Berita filter logic assertions passed.");
