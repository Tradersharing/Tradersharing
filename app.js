
const telegramToken = "8127447550:AAGKdqsYEwxT9iEYWrrGgijakir9qTzJVsU";
const chatId = "@info_seputarforex";

function kirimKeTelegram(pesan) {
  fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: pesan,
      parse_mode: "HTML"
    })
  })
  .then(res => res.json())
  .then(data => console.log("Terkirim:", data.ok))
  .catch(err => console.error("Gagal kirim ke Telegram:", err.message));
}

function scanMyfxbookSinyal() {
  const session = "9UtvFTG9S31Z4vO1aDW31671626";
  const api = `https://corsproxy.io/?https://www.myfxbook.com/api/get-community-outlook.json?session=${session}`;
  const output = document.getElementById("signal-list");

  fetch(api)
    .then(res => res.json())
    .then(data => {
      const outlook = data.symbols || data.communityOutlook || [];
      const valid = outlook.filter(p =>
        parseFloat(p.longPercentage) >= 70 || parseFloat(p.shortPercentage) >= 70
      );

      output.innerHTML = "";
      if (valid.length === 0) {
        output.innerHTML = "<i>Belum ada sinyal saat ini.</i>";
      } else {
        valid.forEach(p => {
          const buy = parseFloat(p.longPercentage);
          const sell = parseFloat(p.shortPercentage);
          const isBuy = buy >= 70;
          const pair = p.name;
          const entry = isBuy ? parseFloat(p.avgLongPrice) : parseFloat(p.avgShortPrice);
          const arah = isBuy ? "BUY" : "SELL";
          const icon = isBuy ? "📈" : "📉";

          const tp1 = isBuy ? entry + 0.0020 : entry - 0.0020;
          const tp2 = isBuy ? entry + 0.0050 : entry - 0.0050;
          const tp3 = isBuy ? entry + 0.1000 : entry - 0.1000;
          const sl1 = isBuy ? entry - 0.0020 : entry + 0.0020;

          const pesan = `<b>➤ New signal ${pair} : ${arah}</b> ${icon}
<b>Entry:</b> ${entry.toFixed(5)}

<b>Take Profit:</b>
TP1: ${tp1.toFixed(5)}
TP2: ${tp2.toFixed(5)}
TP3: ${tp3.toFixed(5)}

<b>Stop Loss:</b>
SL1: ${sl1.toFixed(5)}
SL2: 50 pips dari harga entry`;

          output.innerHTML += `<div><b>${pair}</b> : ${arah} ${icon}<br>
            Buy: ${buy.toFixed(1)}% / Sell: ${sell.toFixed(1)}%</div><hr style="opacity:0.1">`;

          kirimKeTelegram(pesan);
        });
      }
    })
    .catch(() => {
      output.innerHTML = "<i>Gagal ambil data dari Myfxbook.</i>";
    });
}

window.addEventListener("DOMContentLoaded", () => {
  scanMyfxbookSinyal();
});
