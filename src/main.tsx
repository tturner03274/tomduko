import "@fontsource-variable/nunito-sans";
import "@fontsource-variable/playfair-display";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import "./styles/brand.css";
import "./styles/brand-finish.css";
import "./styles/iq.css";
import "./styles/ultra.css";
import "./styles/ultra-finish.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
