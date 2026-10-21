
import { useState } from "react";
import { Activity, ArrowUpRight, ShieldCheck } from "lucide-react";
import { stocks } from "../../data/mockData";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function QuickTrade({ selectedSymbol }) {
  const [side, setSide] = useState("BUY");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [reviewOrder, setReviewOrder] = useState(null);

  const stock =
    stocks.find((item) => item.symbol === selectedSymbol) || stocks[0];

  const validQuantity =
    /^\d+$/.test(quantity) && Number(quantity) > 0;

  const total = validQuantity ? Number(quantity) * stock.price : 0;

  function handleReview(event) {
    event.preventDefault();
    setMessage("");

    if (!validQuantity) {
      setMessage("Enter a valid whole-number quantity greater than zero.");
      return;
    }

    setReviewOrder({
      symbol: stock.symbol,
      name: stock.name,
      side,
      quantity: Number(quantity),
      price: stock.price,
      total,
    });
  }

  function closeReview() {
    setReviewOrder(null);
  }

  return (
    <section className="panel order-panel">
      <div className="panel-heading">
        <div>
          <h2>Quick trade</h2>
          <p className="muted">Simulated market order</p>
        </div>

        <div className="order-mode">
          <Activity size={14} /> PAPER
        </div>
      </div>

      <div className="order-tabs">
        <button
          type="button"
          className={side === "BUY" ? "buy-tab active" : ""}
          onClick={() => {
            setSide("BUY");
            setMessage("");
            setReviewOrder(null);
          }}
        >
          Buy
        </button>

        <button
          type="button"
          className={side === "SELL" ? "sell-tab active" : ""}
          onClick={() => {
            setSide("SELL");
            setMessage("");
            setReviewOrder(null);
          }}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleReview}>
        <label className="field-label">Instrument</label>

        <div className="instrument-field">
          <div className="stock-logo small-logo">
            {stock.symbol.slice(0, 2)}
          </div>

          <div className="instrument-copy">
            <strong>{stock.symbol}</strong>
            <span>{stock.name}</span>
          </div>

          <div className="instrument-price">
            <strong>{money(stock.price)}</strong>
            <span>Mock price</span>
          </div>
        </div>

        <label className="field-label" htmlFor="quantity">
          Quantity
        </label>

        <div className="quantity-field">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => {
              setQuantity(
                String(Math.max(1, (Number(quantity) || 1) - 1))
              );
              setMessage("");
              setReviewOrder(null);
            }}
          >
            −
          </button>

          <input
            id="quantity"
            inputMode="numeric"
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value);
              setMessage("");
              setReviewOrder(null);
            }}
          />

          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => {
              setQuantity(String((Number(quantity) || 0) + 1));
              setMessage("");
              setReviewOrder(null);
            }}
          >
            +
          </button>
        </div>

        <div className="order-summary">
          <span>Estimated order value</span>
          <strong>{money(total)}</strong>
        </div>

        <div className="order-summary">
          <span>Order type</span>
          <span className="market-type">Market</span>
        </div>

        <button
          className={`submit-order ${
            side === "SELL" ? "submit-sell" : ""
          }`}
          type="submit"
        >
          Review {side.toLowerCase()} order
          <ArrowUpRight size={16} />
        </button>

        {message && <p className="form-message">{message}</p>}

        <p className="order-disclaimer">
          <ShieldCheck size={14} />
          Paper trading only. No real money involved.
        </p>
      </form>

      {reviewOrder && (
        <div className="order-review">
          <div className="panel-heading">
            <div>
              <h2>Review order</h2>
              <p className="muted">Confirm the simulated order details</p>
            </div>
          </div>

          <div className="order-summary">
            <span>Action</span>
            <strong>{reviewOrder.side}</strong>
          </div>

          <div className="order-summary">
            <span>Instrument</span>
            <strong>{reviewOrder.symbol}</strong>
          </div>

          <div className="order-summary">
            <span>Quantity</span>
            <strong>{reviewOrder.quantity}</strong>
          </div>

          <div className="order-summary">
            <span>Reference price</span>
            <strong>{money(reviewOrder.price)}</strong>
          </div>

          <div className="order-summary">
            <span>Estimated total</span>
            <strong>{money(reviewOrder.total)}</strong>
          </div>

          <p className="form-message">
            Preview only. This order has not been submitted or executed.
          </p>

          <button
            type="button"
            className="subtle-button"
            onClick={closeReview}
          >
            Back to order
          </button>
        </div>
      )}
    </section>
  );
}
