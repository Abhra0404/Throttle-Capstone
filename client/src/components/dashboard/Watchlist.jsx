import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { stocks } from "../../data/mockData";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

function Change({ value }) {
  const positive = value >= 0;

  return (
    <span className={`change ${positive ? "positive" : "negative"}`}>
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export default function Watchlist({
  selectedSymbol,
  setSelectedSymbol,
}) {
  const [search, setSearch] = useState("");

  const filteredStocks = stocks.filter((stock) =>
    `${stock.symbol} ${stock.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Market watch</h2>
          <p className="muted">Your tracked stocks</p>
        </div>

        <button className="icon-button" aria-label="Add stock">
          <Plus size={18} />
        </button>
      </div>

      <div className="search-box">
        <Search size={15} />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search stocks..."
        />

        <kbd>⌘ K</kbd>
      </div>

      <div className="stock-list">
        {filteredStocks.map((stock) => (
          <button
            key={stock.symbol}
            className={`stock-row ${
              selectedSymbol === stock.symbol
                ? "stock-row-active"
                : ""
            }`}
            onClick={() => setSelectedSymbol(stock.symbol)}
          >
            <div className="stock-logo">
              {stock.symbol.slice(0, 2)}
            </div>

            <div className="stock-info">
              <strong>{stock.symbol}</strong>
              <span>{stock.name}</span>
            </div>

            <div className="stock-price">
              <strong>{money(stock.price)}</strong>
              <Change value={stock.changePercent} />
            </div>
          </button>
        ))}

        {filteredStocks.length === 0 && (
          <div className="empty-state">
            No stocks match your search.
          </div>
        )}
      </div>

      <button
        className="text-button"
        onClick={() => setSearch("")}
      >
        View all tracked stocks <span>→</span>
      </button>
    </section>
  );
}