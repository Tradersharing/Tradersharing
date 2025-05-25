// Contoh daftar pair lengkap termasuk XAUUSD
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

const pairSelect = document.getElementById("pair");
const timeframeSelect = document.getElementById("timeframe");
const indikator1Select = document.getElementById("indikator1");
const indikator2Select = document.getElementById("indikator2");
const indikator3Select = document.getElementById("indikator3");

const anomaliDataDiv = document.getElementById("anomali-data");
const teknikalDataDiv = document.getElementById("teknikal-data");
const newsListUl = document.getElementById("news-list");
const popupNotifDiv = document.getElementById("popup-notif");

function populateSelect(selectElem, options, defaultVal=null) {
  selectElem.innerHTML = "";
  options.forEach(opt => {
    const el = document.createElement("option");
    el.value = opt;
    el.textContent = opt;
    selectElem.appendChild(el);
  });
  if (defaultVal) selectElem.value = defaultVal;
}

function showPopupNotif(message) {
  popupNotifDiv.textContent = message;
  popupNotifDiv.classList.remove("hidden");
  setTimeout(() => popupNotifDiv.classList.add("hidden"), 4000);
}

function fetchRealtimeData(pair, timeframe, indikatorArr) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        anomali: `Anomali pada ${pair} di TF ${timeframe}: Buy 65%, Sell 35%`,
        tujuan: `Target TP 40 pips`,
        teknikal: indikatorArr.length === 0 ?
          "Pilih indikator untuk lihat sinyal teknikal" :
          `Sinyal teknikal gabungan (${indikatorArr.join(", ")}): Buy 70%, Sell 30%`
      });
    }, 1000);
  });
}

function updateData() {
  const pair = pairSelect.value;
  const timeframe = timeframeSelect.value;
  const indikatorArr = [indikator1Select.value, indikator2Select.value, indikator3Select.value].filter(i => i);

  document.getElementById("pair-label").textContent = pair;
  document.getElementById("anomali-value").textContent = "Memuat...";
  document.getElementById("tujuan-value").textContent = "Memuat...";
  teknikalDataDiv.textContent = "Memuat data...";
  newsListUl.innerHTML = "";
  document.getElementById("anomali-sumber").innerHTML = "";

  // Update data anomali dan teknikal
  fetchRealtimeData(pair, timeframe, indikatorArr)
    .then(data => {
      let isBuy = data.anomali.includes("Buy");

      document.getElementById("anomali-value").textContent = isBuy ? "Buy" : "Sell";
      document.getElementById("tujuan-value").textContent = isBuy ? "Buy" : "Sell";

      teknikalDataDiv.innerHTML = `
        Buy % = ${["lemah", "sedang", "netral", "kuat"][Math.floor(Math.random() * 4)]}<br>
        Sell % = ${["lemah", "sedang", "netral", "kuat"][Math.floor(Math.random() * 4)]}
      `;

      const sumber = [
        "• myfxbook buy 70% sell 30%",
        "• fxblue buy 65% sell 35%",
        "• tradingview buy 60% sell 40%"
      ];
      sumber.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        document.getElementById("anomali-sumber").appendChild(li);
      });
    });

  // === BAGIAN NEWS REVISI MULAI DI SINI ===
  const proxy = "https://corsproxy.io/?";
  const api = "https://financialmodelingprep.com/api/v3/fx_calendar?apikey=G5P1iNxCJ5OQ68rUuNgqXytiGeb3LXD0";
  const [base, quote] = pair.includes("/") ? pair.split("/") : [pair.slice(0, 3), pair.slice(3, 6)];

  fetch(proxy + api)
    .then(res => res.json())
    .then(data => {
      // Data dari API ada di objek data.calendar (array)
      const calendar = data.calendar || [];

      // Filter news berdasarkan base atau quote
      const filtered = calendar.filter(item =>
        item.currency === base || item.currency === quote
      );

      newsListUl.innerHTML = "";
      if (filtered.length === 0) {
        newsListUl.innerHTML = "<li>Hari ini tidak ada berita penting.</li>";
      } else {
        filtered.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item.event;
          newsListUl.appendChild(li);
        });
      }
    })
    .catch(() => {
      newsListUl.innerHTML = "<li>Gagal memuat berita.</li>";
    });
  // === BAGIAN NEWS REVISI SELESAI ===
}

window.addEventListener("DOMContentLoaded", () => {
  populateSelect(pairSelect, pairs.map(p => p.includes("/") ? p : `${p.slice(0,3)}/${p.slice(3,6)}`), "EUR/USD");
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
