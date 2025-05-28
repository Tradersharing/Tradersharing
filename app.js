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

function updateSinyalMyfxbook() {
  const session = "9UtvFTG9S31Z4vO1aDW31671626"; // ganti kalau expired
  const api = `https://www.myfxbook.com/api/get-community-outlook.json?session=${session}`;
  const proxy = "https://corsproxy.io/?";
  const box = document.getElementById("sinyal-box");
  const pair = document.getElementById("pair").value.replace("/", "");

const proxy = "https://api.allorigins.win/raw?url=";
fetch(proxy + encodeURIComponent(api))

  window.addEventListener("DOMContentLoaded", () => {
  updateNews();
  updateSinyalMyfxbook();
});

  
  fetch(proxy + api)
    .then(res => res.json())
    .then(data => {
      const outlook = data.communityOutlook || [];
      const info = outlook.find(item => item.name === pair);
      if (!info) {
        box.innerHTML = "Tidak ada data untuk pair ini.";
        return;
      }

      const buy = parseFloat(info.longPercentage);
      const sell = parseFloat(info.shortPercentage);
      const entry = buy > sell ? parseFloat(info.avgLongPrice) : parseFloat(info.avgShortPrice);
      const arah = buy > sell ? "BUY" : "SELL";
      const icon = arah === "BUY" ? "📈" : "📉";

      const tp1 = arah === "BUY" ? (entry + 0.0020) : (entry - 0.0020);
      const tp2 = arah === "BUY" ? (entry + 0.0050) : (entry - 0.0050);
      const tp3 = arah === "BUY" ? (entry + 0.1000) : (entry - 0.1000);
      const sl1 = arah === "BUY" ? (entry - 0.0020) : (entry + 0.0020);

      box.innerHTML = `
        <b>➤ New Signal ${pair} : ${arah}</b> ${icon}<br>
        <b>Entry:</b> ${entry.toFixed(5)}<br><br>
        <b>Take Profit:</b><br>
        TP1: ${tp1.toFixed(5)}<br>
        TP2: ${tp2.toFixed(5)}<br>
        TP3: ${tp3.toFixed(5)}<br><br>
        <b>Stop Loss:</b><br>
        SL1: ${sl1.toFixed(5)}<br>
        SL2: 50 pips dari harga entry
      `;
    })
    .catch(() => {
      box.innerHTML = "Gagal ambil data Myfxbook (mungkin karena proxy).";
    });
}


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

function updateTeknikal() {
  const indikator1 = document.getElementById("indikator1").value;
  const indikator2 = document.getElementById("indikator2").value;
  const indikator3 = document.getElementById("indikator3").value;
  const dataBox = document.getElementById("teknikal-data");

  const kombinasi = [indikator1, indikator2, indikator3].filter(i => i);
  if (kombinasi.length === 0) {
    dataBox.textContent = "Silakan pilih indikator teknikal.";
    return;
  }

  const sinyal = ["Buy", "Sell"][Math.floor(Math.random() * 2)];
  const persenBuy = sinyal === "Buy" ? 75 : 35;
  const persenSell = 100 - persenBuy;

  dataBox.innerHTML = `
    <div>Buy % = <strong>${persenBuy}%</strong></div>
    <div>Sell % = <strong>${persenSell}%</strong></div>
    <div style="margin-top:8px;font-size:0.9rem;">Sinyal dari: ${kombinasi.join(", ")}</div>
  `;
}

function updateNews() {
  const pair = document.getElementById("pair").value.replace("/", "");
  const base = pair.slice(0, 3).toUpperCase();
  const quote = pair.slice(3, 6).toUpperCase();

  const newsList = document.getElementById("news-list");
  newsList.innerHTML = "<li>Memuat berita...</li>";

  const proxy = "https://corsproxy.io/?";
  const api = "https://financialmodelingprep.com/api/v3/fx_calendar?apikey=G5P1iNxCJ5OQ68rUuNgqXytiGeb3LXD0";

  fetch(proxy + api)
    .then(res => res.json())
    .then(data => {
      const items = (data.calendar || []).filter(item =>
        item.currency === base || item.currency === quote
      );

      newsList.innerHTML = "";
      if (items.length === 0) {
        newsList.innerHTML = "<li>Tidak ada berita penting hari ini.</li>";
      } else {
        items.forEach(item => {
          const li = document.createElement("li");
          li.textContent = `${item.date} - ${item.event}`;
          newsList.appendChild(li);
        });
      }
    })
    .catch(() => {
      newsList.innerHTML = "<li>Gagal memuat berita.</li>";
    });
}

window.addEventListener("DOMContentLoaded", () => {
  populateSelect(document.getElementById("pair"), pairs.map(p => p.includes("/") ? p : `${p.slice(0,3)}/${p.slice(3,6)}`), "EUR/USD");
  populateSelect(document.getElementById("timeframe"), timeframes, "H1");
  populateSelect(document.getElementById("indikator1"), indikatorMT4);
  populateSelect(document.getElementById("indikator2"), indikatorMT4);
  populateSelect(document.getElementById("indikator3"), indikatorMT4);

  document.getElementById("indikator1").addEventListener("change", updateTeknikal);
  document.getElementById("indikator2").addEventListener("change", updateTeknikal);
  document.getElementById("indikator3").addEventListener("change", updateTeknikal);
  document.getElementById("pair").addEventListener("change", updateNews);

  updateTeknikal();
  updateNews();
});
