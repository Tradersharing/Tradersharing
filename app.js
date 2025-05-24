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

// Element DOM
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

// Simulasi data dummy
function fetchData(pair, timeframe, indikatorArr) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        anomali: "BUY",
        tujuan: "BUY",
        teknikal: indikatorArr.length ?
          `Sinyal teknikal gabungan (${indikatorArr.join(", ")}): Buy 70%, Sell 30%`
          : "Pilih indikator untuk melihat sinyal teknikal",
        news: [
          `${pair.slice(0,3)}: Data ekonomi penting rilis hari ini.`,
          `${pair.slice(3,6)}: Sentimen pasar sedang volatile.`
        ]
      });
    }, 1000);
  });
}

function updateAll() {
  const pair = pairSelect.value;
  const timeframe = timeframeSelect.value;
  const indikatorArr = [indikator1Select.value, indikator2Select.value, indikator3Select.value].filter(i => i);

  pairLabelSpan.textContent = pair;
  anomaliSpan.textContent = "Memuat...";
  tujuanSpan.textContent = "Memuat...";
  teknikalDataDiv.textContent = "Memuat sinyal teknikal...";
  newsList.innerHTML = "<li>Memuat berita...</li>";

  fetchData(pair, timeframe, indikatorArr).then(data => {
    anomaliSpan.textContent = data.anomali;
    tujuanSpan.textContent = data.tujuan;
    teknikalDataDiv.textContent = data.teknikal;

    anomaliSpan.className = data.anomali === "BUY" ? "buy" : "sell";
    tujuanSpan.className = data.tujuan === "BUY" ? "buy" : "sell";

    newsList.innerHTML = "";
    data.news.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      newsList.appendChild(li);
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  populateSelect(pairSelect, pairs, "EURUSD");
  populateSelect(timeframeSelect, timeframes, "H1");
  populateSelect(indikator1Select, indikatorMT4);
  populateSelect(indikator2Select, indikatorMT4);
  populateSelect(indikator3Select, indikatorMT4);
  updateAll();

  pairSelect.addEventListener("change", updateAll);
  timeframeSelect.addEventListener("change", updateAll);
  indikator1Select.addEventListener("change", updateAll);
  indikator2Select.addEventListener("change", updateAll);
  indikator3Select.addEventListener("change", updateAll);
});
