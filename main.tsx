import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

// Vite + React의 기본 진입점 역할
ReactDOM.createRoot(document.getElementById("root")!).render(
  // 1. <React.StrictMode>를 제거합니다.
  //    이것이 배포 환경에서 '앱 멈춤' 현상을 일으키는
  //    가장 유력한 원인입니다.
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);