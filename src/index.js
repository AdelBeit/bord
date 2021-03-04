import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./styles/custom.scss";
// login with google
import { Auth0Provider } from "@auth0/auth0-react";
import { auth0_domain, auth0_clientId } from "./utils/publicEnv";

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0_domain}
      clientId={auth0_clientId}
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
