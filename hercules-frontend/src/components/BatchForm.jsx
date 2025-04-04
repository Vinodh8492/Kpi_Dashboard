import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const BatchForm = () => {
  // Define state variables for each form field
  const navigate = useNavigate();  // Initialize navigation
  const [batch_guid, setBatchGuid] = useState("");
  const [batch_name, setBatchName] = useState("");
  const [product_name, setProductName] = useState("");
  const [batch_act_start, setBatchActStart] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert batch_act_start to correct format: "YYYY-MM-DD HH:MM:SS"
    const formattedDate = batch_act_start.replace("T", " ") + ":00";  
  
    // Ensure the state variables are set correctly before sending
    console.log("Formatted Date:", formattedDate);
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/kpi", {
        batch_guid,
        batch_name,
        product_name,
        batch_act_start: formattedDate,  // Send formatted date
      }, {
        headers: { "Content-Type": "application/json" }
      });
  
      console.log("Batch created successfully:", response.data);
      // Reset the form fields after successful submission
      setBatchGuid("");
      setBatchName("");
      setProductName("");
      setBatchActStart("");

      // Navigate back to the dashboard (adjust route as needed)
      navigate("/");  
    } catch (error) {
      console.error("Error creating batch:", error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <Box 
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Batch Data Creation</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Batch GUID"
          fullWidth
          margin="normal"
          value={batch_guid}
          onChange={(e) => setBatchGuid(e.target.value)}
          required
        />
        <TextField
          label="Batch Name"
          fullWidth
          margin="normal"
          value={batch_name}
          onChange={(e) => setBatchName(e.target.value)}
          required
        />
        <TextField
          label="Product Name"
          fullWidth
          margin="normal"
          value={product_name}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <TextField
          label="Batch Start Date"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={batch_act_start}
          onChange={(e) => setBatchActStart(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Batch
        </Button>
      </form>
    </Container>
    </Box>
  );
};

export default BatchForm;
