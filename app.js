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

// Populate select options
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

// Fetch Helper
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

// Myfxbook & TradingView dummy, replace with real API if available
async function getMyfxbookStats(pair) {
  // Replace with real API endpoint if publicly available
  return {buy: Math.floor(Math.random()*100), sell: Math.floor(Math.random()*100)};
}
async function getTradingViewStats(pair) {
  // Replace with real API endpoint if publicly available
  return {buy: Math.floor(Math.random()*100), sell: Math.floor(Math.random()*100)};
}

// AlphaVantage News
async function getNews(pair) {
  // AlphaVantage documentation: https://www.alphavantage.co/documentation/#news
  const apiKey = "O40SWMY3YUWGSTRR";
  let symbol = pair.replace("/", "");
  let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=FX:${symbol}&apikey=${apiKey}`;
  try {
    let json = await fetchJSON(url);
    if (!json.feed || !json.feed.length) return [];
    // filter news by symbol in title
    return json.feed.filter(n =>
      n.title && n.title.toLowerCase().includes(pair.toLowerCase().replace("/", ""))
    );
  } catch {
    return [];
  }
}

// Yahoo Finance Teknikal Price Action (dummy logic, replace with real API for production)
async function getYahooSignals(pair, indicators) {
  if (!indicators.length) return { buy: 0, sell: 0, none: 100 };
  if (indicators.length === 1) {
    let buy = Math.floor(Math.random() * 100);
    let sell = 100 - buy;
    return { buy, sell, none: 0 };
  } else {
    let totalBuy = 0;
    let totalSell = 0;
    indicators.forEach(() => {
      let buy = Math.floor(Math.random() * 100);
      let sell = 100 - buy;
      totalBuy += buy;
      totalSell += sell;
    });
    return {
      buy: Math.round(totalBuy / indicators.length),
      sell: Math.round(totalSell / indicators.length),
      none: 0
    };
  }
}

// Update News Box
async function updateNews(pair) {
  const newsList = document.getElementById("news-list");
  newsList.innerHTML = "<li>Memuat berita...</li>";
  const news = await getNews(pair);
  newsList.innerHTML = "";
  if (!news.length) {
    newsList.innerHTML = "<li>Tidak ada berita penting hari ini</li>";
    return;
  }
  news.forEach(n => {
    let li = document.createElement("li");
    li.textContent = n.title;
    newsList.appendChild(li);
  });
}

// Update Myfxbook & Trading View
async function updateStats(pair) {
  const myfx = await getMyfxbookStats(pair);
  const tv = await getTradingViewStats(pair);
  document.getElementById("myfxbook-buy").textContent = myfx.buy + "%";
  document.getElementById("myfxbook-sell").textContent = myfx.sell + "%";
  document.getElementById("tradingview-buy").textContent = tv.buy + "%";
  document.getElementById("tradingview-sell").textContent = tv.sell + "%";
}

// Update Teknikal Box
async function updateTeknikal(pair) {
  const selectedIndicators = [];
  if (document.getElementById("indikator1").value) selectedIndicators.push(document.getElementById("indikator1").value);
  if (document.getElementById("indikator2").value) selectedIndicators.push(document.getElementById("indikator2").value);
  if (document.getElementById("indikator3").value) selectedIndicators.push(document.getElementById("indikator3").value);

  // Remove "none" if only one selected
  let signals = await getYahooSignals(pair, selectedIndicators.filter(Boolean));
  document.getElementById("buy-value").textContent = signals.buy + "%";
  document.getElementById("sell-value").textContent = signals.sell + "%";
  document.getElementById("buy-detail").textContent = selectedIndicators.length === 1 ? "none" : `${selectedIndicators.length} indikator`;
  document.getElementById("sell-detail").textContent = selectedIndicators.length === 1 ? "none" : `${selectedIndicators.length} indikator`;
  document.getElementById("indicator-link").textContent = selectedIndicators.length + " indicators";
}

// Event bindings and initial load
window.addEventListener("DOMContentLoaded", async () => {
  populateSelect(document.getElementById("pair"), pairs.map(p => p.includes("/") ? p : `${p.slice(0,3)}/${p.slice(3,6)}`), "EUR/USD");
  populateSelect(document.getElementById("timeframe"), timeframes, "H1");
  populateSelect(document.getElementById("indikator1"), indikatorMT4);
  populateSelect(document.getElementById("indikator2"), indikatorMT4);
  populateSelect(document.getElementById("indikator3"), indikatorMT4);

  let pair = document.getElementById("pair").value;
  updateNews(pair);
  updateStats(pair);
  updateTeknikal(pair);

  document.getElementById("pair").addEventListener("change", (e) => {
    let pair = e.target.value;
    updateNews(pair);
    updateStats(pair);
    updateTeknikal(pair);
  });
  ["indikator1", "indikator2", "indikator3"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
      let pair = document.getElementById("pair").value;
      updateTeknikal(pair);
    });
  });
});
