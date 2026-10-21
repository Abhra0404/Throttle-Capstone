import { holdings } from "../../data/mockData";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function Holdings() {
  return (
    <section className="panel holdings-panel">
      <div className="panel-heading">
        <div>
          <h2>Your holdings</h2>
          <p className="muted">Stocks in your portfolio</p>
        </div>

        <button className="subtle-button">
          View portfolio <span>→</span>
        </button>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. price</th>
              <th>Current price</th>
              <th>Returns</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((holding) => {
              const pnl =
                (holding.currentPrice - holding.averagePrice) *
                holding.quantity;

              const invested =
                holding.averagePrice * holding.quantity;

              const percentage =
                invested > 0 ? (pnl / invested) * 100 : 0;

              const positive = pnl >= 0;

              return (
                <tr key={holding.symbol}>
                  <td>
                    <div className="table-stock">
                      <div className="stock-logo small-logo">
                        {holding.symbol.slice(0, 2)}
                      </div>

                      <div>
                        <strong>{holding.symbol}</strong>
                        <span>{holding.name}</span>
                      </div>
                    </div>
                  </td>

                  <td>{holding.quantity}</td>
                  <td>{money(holding.averagePrice)}</td>
                  <td>{money(holding.currentPrice)}</td>

                  <td>
                    <div
                      className={
                        positive
                          ? "return-positive"
                          : "return-negative"
                      }
                    >
                      <strong>
                        {positive ? "+" : ""}
                        {money(pnl)}
                      </strong>

                      <span>
                        {positive ? "+" : ""}
                        {percentage.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}