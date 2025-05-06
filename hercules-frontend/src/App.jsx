import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Typography, Box, Paper } from "@mui/material";
import KPIChart from "./components/KPIChart";
import BatchForm from "./components/BatchForm";
import Services from "./components/Services";
import NavigationComponent from "./components/NavigationComponent";
import Topbar from "./components/Topbar";
import AdminPage from "./components/AdminPage";
import { LogoProvider } from "./contexts/LogoContext";

const App = () => {
  return (
    <LogoProvider>
      <Router>
        <Topbar />
        <NavigationComponent />
        <Container maxWidth="lg">
          <Box my={4}>
          <Paper
              elevation={3}
              sx={{ padding: 2 }}
              style={{ width: "100%", padding: 20, margin: "0 auto", marginLeft: "6%" }}
            >
              <Routes>
                <Route path="/" element={<KPIChart />} />
                <Route path="/batches" element={<BatchForm />} />
                <Route path="/services" element={<Services />} />
                <Route path="/Admin" element={<AdminPage />} />
              </Routes>
            </Paper>
          </Box>
        </Container>
      </Router>
    </LogoProvider>
  );
};

export default App;