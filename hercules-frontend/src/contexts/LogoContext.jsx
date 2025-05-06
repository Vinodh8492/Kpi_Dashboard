import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Aghtia from "../assets/image1.png"; // default logo fallback

const API_BASE = "http://127.0.0.1:5000";

export const LogoContext = createContext();

export const LogoProvider = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState(Aghtia); // Default to Aghtia

  useEffect(() => {
    axios.get(`${API_BASE}/api/logo`)
      .then((res) => {
        const path = res.data.logoUrl;
        if (path && path.trim() !== "") {
          const fullUrl = `${API_BASE}${path}?t=${Date.now()}`;
          setLogoUrl(fullUrl);
        } else {
          setLogoUrl(Aghtia); // fallback to default
        }
      })
      .catch((err) => {
        console.error("Error loading logo:", err);
        setLogoUrl(Aghtia); // fallback to default on error
      });
  }, []);

  return (
    <LogoContext.Provider value={{ logoUrl, setLogoUrl }}>
      {children}
    </LogoContext.Provider>
  );
};
