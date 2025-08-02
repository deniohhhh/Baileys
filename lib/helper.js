function markupHarga(harga) {
  if (harga < 5000) return harga + 500;
  if (harga <= 10000) return Math.ceil(harga * 1.05);
  return Math.ceil(harga * 1.04);
}

function formatProduk(produk) {
  return `📦 *${produk.nama}*\nKode: ${produk.buyer_sku_code}\nHarga: Rp${markupHarga(produk.harga)}\n`;
}

module.exports = { markupHarga, formatProduk };
