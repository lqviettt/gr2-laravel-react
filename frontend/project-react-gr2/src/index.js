import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import RouterCustom from "./router";
import { CartProvider } from "./component/CartContext";
import { BreadcrumbProvider } from "./component/BreadcrumbContext";
import { ToastContainer } from "react-toastify";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BreadcrumbProvider>
    <CartProvider>
      <ThemeProvider>
        <BrowserRouter>
          <RouterCustom />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </BrowserRouter>
      </ThemeProvider>
    </CartProvider>
  </BreadcrumbProvider>
);
