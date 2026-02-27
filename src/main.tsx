
import "./styles/global.css";
import "books-ui/styles";
import "../src/shared/core/styles/stylesheet/global.css";
import "../src/shared/ui/styles/stylesheet/global.css";
import "@ui/styles/index.css";

import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { Header } from "./components";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter basename="/">
    <Header />
    <App />
  </HashRouter>,
);

