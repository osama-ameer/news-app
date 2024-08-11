import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ArticleProvider } from "./context/ArticleContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/news-app">
      <ArticleProvider>
        <App />
      </ArticleProvider>
    </BrowserRouter>
  </React.StrictMode>
);
