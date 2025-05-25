// Data dasar
const pairs = [
  "EURUSD","USDJPY","GBPUSD","USDCHF","USDCAD","AUDUSD","NZDUSD",
  "EURJPY","EURGBP","EURAUD","EURCHF","EURCAD","EURNZD","GBPJPY",
  "GBPCHF","AUDJPY","CHFJPY","CADJPY","AUDCAD","AUDCHF","AUDNZD",
  "CADCHF","NZDJPY","NZDCAD","XAUUSD"
];

const timeframes = ["M1","M5","M15","M30","H1","H4","D1","W1","MN"];

const indikatorMT4 = [
  "Moving Average","MACD","RSI","Bollinger Bands","Stochastic",
  "ADX","CCI","ATR","Momentum","Williams %R",
  "Parabolic SAR","Ichimoku Kinko Hyo","Envelopes","DeMarker"
];

// Elemen DOM
const pairSelect = document.getElementById("pair");
const timeframeSelect = document.getElementById("timeframe");
const indikator1Select = document.getElementById("indikator1");
const indikator2Select = document.getElementById("indikator2");
const indikator3Select = document.getElementById("indikator3");

const newsListUl = document.getElementById("news-list");
const popupNotifDiv = document.getElementById("popup-notif");

// API Key GNews kamu di sini
const GNEWS_API_KEY = "7M31UV6P749OUDDE";

// Fungsi isi select box
function populateSelect(selectElem, options, defaultVal=null) {
  selectElem.innerHTML = "";
  options.forEach(opt => {
    const el = document.createElement("option");
    el.value = opt.includes("/") ? opt : `${opt.slice(0,3)}/${opt.slice(3,6)}`;
    el.textContent = opt.includes("/") ? opt : `${opt.slice(0,3)}/${opt.slice(3,6)}`;
    selectElem.appendChild(el);
  });
  if (defaultVal) selectElem.value = defaultVal;
}

// Popup notif sederhana
function showPopupNotif(message) {
  popupNotifDiv.textContent = message;
  popupNotifDiv.classList.remove("hidden");
  setTimeout(() => popupNotifDiv.classList.add("hidden"), 4000);
}

// Fetch berita dari GNews API, pakai proxy CORS supaya bisa jalan di GitHub Pages
async function fetchNews(query) {
  const proxy = "https://corsproxy.io/?";
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=id&max=5&apikey=${GNEWS_API_KEY}`;

  try {
    const res = await fetch(proxy + url);
    if (!res.ok) throw new Error("Gagal fetch news");
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      newsListUl.innerHTML = "<li>Tidak ada berita terbaru.</li>";
      return;
    }

    newsListUl.innerHTML = "";
    data.articles.forEach(article => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a> <br> <small>${new Date(article.publishedAt).toLocaleString()}</small>`;
      newsListUl.appendChild(li);
    });
  } catch (e) {
    newsListUl.innerHTML = "<li>Gagal memuat berita.</li>";
    console.error("Error fetchNews:", e);
  }
}

// Dummy fungsi updateData buat bagian anomali & teknikal, fokus di news
function updateData() {
  const pair = pairSelect.value.replace("/", "");
  // Update news sesuai pair (misal cari berita EURUSD jadi "EURUSD" keyword)
  fetchNews(pair);
}

// Event listener dan inisialisasi
window.addEventListener("DOMContentLoaded", () => {
  populateSelect(pairSelect, pairs, "EURUSD");
  populateSelect(timeframeSelect, timeframes, "H1");
  populateSelect(indikator1Select, indikatorMT4);
  populateSelect(indikator2Select, indikatorMT4);
  populateSelect(indikator3Select, indikatorMT4);

  updateData();

  pairSelect.addEventListener("change", updateData);
  timeframeSelect.addEventListener("change", updateData);
  indikator1Select.addEventListener("change", updateData);
  indikator2Select.addEventListener("change", updateData);
  indikator3Select.addEventListener("change", updateData);
});
