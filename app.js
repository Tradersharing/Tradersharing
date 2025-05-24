
document.addEventListener("DOMContentLoaded", () => {
  const anomaliBox = document.getElementById("anomali-content");
  const tujuanBox = document.getElementById("tujuan-content");
  const newsBox = document.getElementById("news-content");
  const indikatorBox = document.getElementById("indikator-content");

  anomaliBox.textContent = "Live: Loading anomali...";
  tujuanBox.textContent = "Live: Loading tujuan...";
  newsBox.textContent = "Live: Loading news...";
  indikatorBox.textContent = "Live: Loading indikator...";

  // Dummy real-time simulation
  setTimeout(() => {
    anomaliBox.textContent = "Anomali: USD menguat vs CHF";
    tujuanBox.textContent = "Tujuan: SELL di area 0.9100";
    newsBox.textContent = "USD: NFP akan dirilis Jumat, CHF: Tidak ada news besar";
    indikatorBox.textContent = "Buy: 30% | Sell: 70% (Kuat)";
  }, 1000);
});
