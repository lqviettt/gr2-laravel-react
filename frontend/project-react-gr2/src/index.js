import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import RouterCustom from "./router";
import { CartProvider } from "./component/CartContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CartProvider>
    <ThemeProvider>
      <BrowserRouter>
        <RouterCustom />
      </BrowserRouter>
    </ThemeProvider>
  </CartProvider>
);
