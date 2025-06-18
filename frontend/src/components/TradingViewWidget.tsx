// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'dark' | 'light';
  interval?: string;
  locale?: string;
  autosize?: boolean;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = memo(({
  symbol = 'NASDAQ:AAPL',
  theme = 'dark',
  interval = 'D',
  locale = 'en',
  autosize = true,
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = container.current;
    if (!current) return;
    // Remove previous script if any
    while (current.firstChild) {
      current.removeChild(current.firstChild);
    }
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize,
      symbol,
      interval,
      timezone: 'Etc/UTC',
      theme,
      style: '1',
      locale,
      allow_symbol_change: true,
      support_host: 'https://www.tradingview.com',
    });
    current.appendChild(script);
    return () => {
      // Cleanup script and widget
      while (current.firstChild) {
        current.removeChild(current.firstChild);
      }
    };
  }, [symbol, theme, interval, locale, autosize]);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div ref={container} className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }} />
      <div
        className="tradingview-widget-copyright"
        dangerouslySetInnerHTML={{
          __html:
            '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>',
        }}
      />
    </div>
  );
});

export default TradingViewWidget;
