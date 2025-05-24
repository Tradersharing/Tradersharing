const pairs = ["EURUSD","USDJPY","GBPUSD","USDCHF","USDCAD","AUDUSD","NZDUSD",
"EURJPY","EURGBP","EURAUD","EURCHF","EURCAD","EURNZD","GBPJPY",
"GBPCHF","AUDJPY","CHFJPY","CADJPY","AUDCAD","AUDCHF","AUDNZD",
"CADCHF","NZDJPY","NZDCAD","XAUUSD"];

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

const pairLabelSpan = document.getElementById("pair-label");
const anomaliSpan = document.getElementById("anomali-value");
const tujuanSpan = document.getElementById("tujuan-value");
const teknikalDataDiv = document.getElementById("teknikal-data");
const newsList = document.getElementById("news-list");

function populateSelect(selectElem, options, defaultVal = null) {
  selectElem.innerHTML = "";
  options.forEach(opt => {
    const el = document.createElement("option");
    el.value = opt;
    el.textContent = opt;
    selectElem.appendChild(el);
  });
  if (defaultVal) selectElem.value = defaultVal;
}

function updateLabelOnly() {
  const pair = pairSelect.value;
  pairLabelSpan.textContent = pair;
}

// Realtime dari Firebase
function fetchRealtimeData() {
  const anomaliRef = database.ref("anomali");
  const newsRef = database.ref("news");
  const teknikalRef = database.ref("teknikal");

  // Anomali
  anomaliRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      anomaliSpan.textContent = data.anomali;
      tujuanSpan.textContent = data.tujuan;

      anomaliSpan.className = data.anomali === "Buy" ? "buy" : "sell";
      tujuanSpan.className = data.tujuan === "Buy" ? "buy" : "sell";

      document.getElementById("anomaliOutput").innerHTML = `
        <strong style="color:${data.anomali === 'Buy' ? 'green' : 'red'}">${data.anomali}</strong> | 
        <strong>${data.tujuan}</strong><br/>
        <div class="text-sm mt-1">
          • Myfxbook: ${data.myfxbook} <br/>
          • FXBlue: ${data.fxblue} <br/>
          • TradingView: ${data.tradingview}
        </div>
      `;
    } else {
      anomaliSpan.textContent = "-";
      tujuanSpan.textContent = "-";
      document.getElementById("anomaliOutput").innerHTML = "Tidak ada data anomali.";
    }
  });

  // News
  newsRef.on("value", (snapshot) => {
    const data = snapshot.val();
    const newsOutput = document.getElementById("newsOutput");
    newsList.innerHTML = "";
    if (data) {
      const items = Object.values(data);
      newsOutput.innerHTML = items.map((item) => `• ${item}`).join("<br/>");
      items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        newsList.appendChild(li);
      });
    } else {
      newsOutput.innerHTML = "• Tidak ada berita penting hari ini.";
      newsList.innerHTML = "<li>Tidak ada berita penting hari ini.</li>";
    }
  });

  // Teknikal
  teknikalRef.on("value", (snapshot) => {
    const data = snapshot.val();
    const teknikalOutput = document.getElementById("teknikalOutput");

    if (data && Object.keys(data).length > 0) {
      let hasil = `<strong style="color:${data.rekomendasi === 'Buy' ? 'green' : 'red'}">
        ${data.rekomendasi}</strong> - <em>${data.kekuatan}</em>`;
      teknikalOutput.innerHTML = hasil;
      teknikalDataDiv.textContent = `Sinyal gabungan: ${data.rekomendasi} (${data.kekuatan})`;
    } else {
      teknikalOutput.innerHTML = "Silakan pilih indikator terlebih dahulu.";
      teknikalDataDiv.textContent = "Pilih indikator untuk melihat sinyal teknikal.";
    }
  });
}

// Inisialisasi
window.addEventListener("DOMContentLoaded", () => {
  populateSelect(pairSelect, pairs, "EURUSD");
  populateSelect(timeframeSelect, timeframes, "H1");
  populateSelect(indikator1Select, indikatorMT4);
  populateSelect(indikator2Select, indikatorMT4);
  populateSelect(indikator3Select, indikatorMT4);
  updateLabelOnly();
  fetchRealtimeData();

  pairSelect.addEventListener("change", updateLabelOnly);
  timeframeSelect.addEventListener("change", updateLabelOnly);
  indikator1Select.addEventListener("change", updateLabelOnly);
  indikator2Select.addEventListener("change", updateLabelOnly);
  indikator3Select.addEventListener("change", updateLabelOnly);
});
