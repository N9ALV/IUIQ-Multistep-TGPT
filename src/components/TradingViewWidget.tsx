import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  exchange?: string;
}

function TradingViewWidget({ symbol, exchange = 'NASDAQ' }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget
    container.current.innerHTML = '';

    // Create the widget container structure
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = 'calc(100% - 32px)';
    widgetContainer.style.width = '100%';

    // Create copyright div
    const copyrightDiv = document.createElement('div');
    copyrightDiv.className = 'tradingview-widget-copyright';
    copyrightDiv.innerHTML = `
      <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        <span class="text-slate-600 text-xs">Track all markets on TradingView</span>
      </a>
    `;

    // Append elements to container
    container.current.appendChild(widgetContainer);
    container.current.appendChild(copyrightDiv);

    // Create and configure the script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "allow_symbol_change": false,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": true,
      "hotlist": false,
      "interval": "D",
      "locale": "en",
      "save_image": true,
      "style": "3",
      "symbol": `${exchange}:${symbol}`,
      "theme": "dark",
      "timezone": "exchange",
      "watchlist": [],
      "withdateranges": false,
      "studies": [],
      "autosize": true,
      "overrides": {
        "mainSeriesProperties.barStyle.upColor": "#CCD3DA",
        "mainSeriesProperties.barStyle.downColor": "#4054b2",
        "mainSeriesProperties.candleStyle.upColor": "#CCD3DA",
        "mainSeriesProperties.candleStyle.downColor": "#4054b2",
        "mainSeriesProperties.candleStyle.drawWick": true,
        "mainSeriesProperties.candleStyle.drawBorder": true,
        "mainSeriesProperties.candleStyle.borderColor": "#E4E4E4",
        "mainSeriesProperties.candleStyle.borderUpColor": "#f9fafb",
        "mainSeriesProperties.candleStyle.borderDownColor": "#4054b2",
        "mainSeriesProperties.candleStyle.wickUpColor": "#c4c5c6",
        "mainSeriesProperties.candleStyle.wickDownColor": "#4054b2"
      }
    });

    // Append script to the main container, not the widget container
    container.current.appendChild(script);
  }, [symbol, exchange]);

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height: "400px", width: "100%" }}
    />
  );
}

export default memo(TradingViewWidget);