import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { Button } from "./components/Button.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/flow"
          element={
            <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
              <div className="text-xl">
                Die "Elektro Flow" Seite wurde verschoben.
              </div>
              <Button
                type="primary"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Zur neuen Seite
              </Button>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
