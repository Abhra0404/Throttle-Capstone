import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { marketIndices } from "../../data/mockData";

export default function MarketOverview() {
  return (
    <section className="indices-grid">
      {marketIndices.map((index) => {
        const positive = index.change >= 0;
        const Icon = positive ? ArrowUpRight : ArrowDownRight;

        return (
          <div className="index-card" key={index.symbol}>
            <div className="index-top">
              <span>{index.name}</span>

              <span
                className={`index-indicator ${
                  positive ? "indicator-up" : "indicator-down"
                }`}
              >
                <Icon size={15} />
              </span>
            </div>

            <strong>
              {index.value.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>

            <div className="index-bottom">
              <span
                className={
                  positive ? "positive-text" : "negative-text"
                }
              >
                {positive ? "+" : ""}
                {index.change.toFixed(2)} (
                {index.changePercent.toFixed(2)}%)
              </span>

              <span className="muted">Today</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}