
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

window.addEventListener("DOMContentLoaded", () => {
  populateSelect(document.getElementById("pair"), pairs.map(p => p.includes("/") ? p : `${p.slice(0,3)}/${p.slice(3,6)}`), "EUR/USD");
  populateSelect(document.getElementById("timeframe"), timeframes, "H1");
  populateSelect(document.getElementById("indikator1"), indikatorMT4);
  populateSelect(document.getElementById("indikator2"), indikatorMT4);
  populateSelect(document.getElementById("indikator3"), indikatorMT4);
});
