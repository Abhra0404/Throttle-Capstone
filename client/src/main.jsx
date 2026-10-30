
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import AppRouter from "./AppRouter";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PortfolioProvider>
          <AppRouter />
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
