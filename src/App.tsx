import React, { useEffect } from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./context-api/AuthProvider";
import ModalProvider from "./context-api/ModalProvider";
import FooterProvider from "./context-api/FooterProvider";
import SnowFlakeProvider from "./context-api/SnowFlakeProvider";
import SnowFlake from "./components/SnowFlake";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainRoute from "./features/MainRoute";
import ModalContainer from "./features/ModalContainer";

function App() {
  useEffect(() => {
    document.title = "Grade PTIT";
  }, []);

  return (
    <AuthProvider>
      <ModalProvider>
        <FooterProvider>
          <SnowFlakeProvider>
            <SnowFlake />
            <div style={{ position: "relative" }}>
              <BrowserRouter>
                <MainRoute />
              </BrowserRouter>
              <ToastContainer />
              <ModalContainer />
            </div>
          </SnowFlakeProvider>
        </FooterProvider>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
