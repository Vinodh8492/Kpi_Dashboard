import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Typography, Box, Paper } from "@mui/material";
import KPIChart from "./components/KPIChart";
import BatchForm from "./components/BatchForm";
import Services from "./components/Services";
import Contact from "./components/Contact";
import NavigationComponent from "./components/NavigationComponent";

const App = () => {
  return (
    <Router>
       <NavigationComponent />
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
             KPI Dashboard
          </Typography>
          
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Routes>
              <Route path="/" element={<KPIChart />} />
              <Route path="/batches" element={<BatchForm />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Paper>
        </Box>
      </Container>
    </Router>
  );
};

export default App;
