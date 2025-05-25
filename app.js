
document.addEventListener('DOMContentLoaded', () => {
  const pairSelect = document.getElementById('pair');
  const timeframeSelect = document.getElementById('timeframe');
  const indikatorSelects = [
    document.getElementById('indikator1'),
    document.getElementById('indikator2'),
    document.getElementById('indikator3')
  ];

  fetch('./data/firebase-free-data.json')
    .then(res => res.json())
    .then(data => {
      // Populate pair list
      Object.keys(data.anomali).forEach(pair => {
        const opt = document.createElement('option');
        opt.value = pair;
        opt.textContent = pair;
        pairSelect.appendChild(opt);
      });

      pairSelect.addEventListener('change', () => updateAnomali(data));
      indikatorSelects.forEach(select => {
        select.innerHTML = '';
        ['RSI', 'MACD', 'Stochastic', 'CCI'].forEach(ind => {
          const opt = document.createElement('option');
          opt.value = ind;
          opt.textContent = ind;
          select.appendChild(opt);
        });
      });

      timeframeSelect.innerHTML = '';
      ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN'].forEach(tf => {
        const opt = document.createElement('option');
        opt.value = tf;
        opt.textContent = tf;
        timeframeSelect.appendChild(opt);
      });

      updateAnomali(data);
    });

  function updateAnomali(data) {
    const pair = pairSelect.value || 'GBP/USD';
    const info = data.anomali[pair];
    document.getElementById('pair-label').textContent = pair;
    document.getElementById('myfxbook-value').textContent = info.myfxbook;
    document.getElementById('fxblue-value').textContent = info.fxblue;
    document.getElementById('tradingview-value').textContent = info.tradingview;

    const sources = [info.myfxbook, info.fxblue, info.tradingview];
    const buyCount = sources.filter(x => x === 'Buy').length;
    const sellCount = sources.filter(x => x === 'Sell').length;

    let anomali = '-', tujuan = '-';
    if (buyCount >= 2) {
      anomali = 'Sell';
      tujuan = 'Buy';
    } else if (sellCount >= 2) {
      anomali = 'Buy';
      tujuan = 'Sell';
    }

    document.getElementById('anomali-value').textContent = anomali;
    document.getElementById('anomali-value').className = anomali.toLowerCase();
    document.getElementById('tujuan-value').textContent = tujuan;
    document.getElementById('tujuan-value').className = tujuan.toLowerCase();
  }
});
