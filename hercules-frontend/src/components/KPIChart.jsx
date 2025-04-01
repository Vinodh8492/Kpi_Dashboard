import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box, Toolbar, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Pie, Line, Bar } from "react-chartjs-2";
import axios from "axios";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  BarElement,
  Title
} from "chart.js";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";



ChartJS.register(ArcElement,  BarElement, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const drawerWidth = 240; // Sidebar width

const Dashboard = () => {
  const [kpiData, setKpiData] = useState([]);
  const [pieData, setPieData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [barData, setBarData] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null);
  


  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/kpi");
        let data = response.data;
  
        console.log("✅ Data Type:", typeof data);
  
        // **Check if response is a string and try parsing**
        if (typeof data === "string") {
          try {
            data = JSON.parse(data.replace(/NaN/g, "null")); // Replace `NaN` with `null` before parsing
          } catch (parseError) {
            console.error("❌ Error parsing JSON:", parseError.message);
            return;
          }
        }
  
        // **Ensure data is an array**
        if (!Array.isArray(data)) {
          console.error("❌ Error: Expected an array but received:", data);
          return;
        }
  
        console.log("✅ Data is an array with", data.length, "items.");
  
        // **Sanitize Data: Handle null, undefined, and NaN values**
        data = data.map(item => ({
          ...item,
          "Batch Transfer Time": item["Batch Transfer Time"] ? Number(item["Batch Transfer Time"]) || 0 : 0, 
          "Batch Act Start": item["Batch Act Start"] || "N/A",
          "Product Name": item["Product Name"] || "Unknown",
        }));
  
        console.log("✅ Sanitized Data:", data);
  
        // **Filter data based on selected date**
        if (selectedDate) {
          const filteredData = data.filter(item => {
            const batchDate = new Date(item["Batch Act Start"]);
            return batchDate.toDateString() === selectedDate.toDateString();
          });
          data = filteredData;
        }
  
        // **Processing KPI Metrics**
        const totalBatches = data.length;
        const uniqueProductsSet = new Set();
        const productCounts = {};
        const batchTimeline = {};
  
        data.forEach(item => {
          if (item["Product Name"]) {
            uniqueProductsSet.add(item["Product Name"]);
            productCounts[item["Product Name"]] = (productCounts[item["Product Name"]] || 0) + 1;
          }
  
          if (item["Batch Act Start"] !== "N/A") {
            const batchDate = new Date(item["Batch Act Start"]);
            if (!isNaN(batchDate)) {
              const formattedDate = batchDate.toDateString();
              batchTimeline[formattedDate] = (batchTimeline[formattedDate] || 0) + 1;
            }
          }
        });
  
        const uniqueProducts = uniqueProductsSet.size || 1;
        const batchesPerProduct = (totalBatches / uniqueProducts).toFixed(2);
        const latestBatchDate = data.length && data[data.length - 1]["Batch Act Start"] !== "N/A"
          ? new Date(data[data.length - 1]["Batch Act Start"]).toDateString()
          : "N/A";
  
        console.log("✅ Processed Metrics:", { totalBatches, uniqueProducts, batchesPerProduct, latestBatchDate });
  
        // **Set State for Charts**
        setPieData({
          labels: Object.keys(productCounts),
          datasets: [
            {
              data: Object.values(productCounts),
              backgroundColor: ["#3f51b5", "#ffb300", "#4caf50", "#0097a7"]
            }
          ]
        });
  
        setBarData({
          labels: Object.keys(productCounts), // Get the batch names or keys
          datasets: [
            {
              label: "Batches Over Product Name",
              data: Object.values(productCounts), // Get the counts of products
              backgroundColor: ["#3f51b5", "#ffb300", "#4caf50", "#0097a7"]
            }
          ]
        });
  
        setLineData({
          labels: Object.keys(batchTimeline),
          datasets: [
            {
              label: "Batches Over Time",
              data: Object.values(batchTimeline),
              borderColor: "#3f51b5",
              fill: true,
              backgroundColor: "rgba(63, 81, 181, 0.2)"
            }
          ]
        });
  
        setKpiData([
          { title: "Total Batches", value: totalBatches, color: "#3f51b5" },
          { title: "Unique Products", value: uniqueProducts, color: "#4caf50" },
          { title: "Batches per Product", value: batchesPerProduct, color: "#ffb300" },
          { title: "Latest Batch Date", value: latestBatchDate, color: "#0097a7" }
        ]);
  
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      }
    };
  
    fetchData();
  }, [selectedDate]); // Re-fetch when selectedDate changes
  

  



  return (
    <Box sx={{ display: "flex", justifyContent:"center" }}>
      {/* Sidebar */}

     

      {/* Main Dashboard Content */}
    
      <Box component="main" sx={{ flexGrow: 1, p: 3 , display: "flex", justifyContent: "center" }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      label="Select Date"
      value={selectedDate}
      onChange={(newDate) => setSelectedDate(newDate)}
      renderInput={(params) => <TextField {...params} fullWidth style={{
        backgroundColor: '#f5f5f5',  // Simple background color
        borderRadius: '5px',          // Rounded corners           // Padding inside the input
        marginBottom: '16px',
        marginLeft : '15px'     // Space below the DatePicker
      }} />}
      inputFormat="MM/dd/yyyy"
    />
  </LocalizationProvider>
     
        <Toolbar /> {/* Space for top margin */}
        <Grid container spacing={2} padding={2}>
  {/* KPI Cards */}
  {kpiData.map((item, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <Card sx={{ backgroundColor: item.color, color: "white", textAlign: "center", height: "150px" }}>
        <CardContent>
          <Typography variant="h5">{item.value}</Typography>
          <Typography variant="subtitle1">{item.title}</Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}


{/* Bar Chart - Products by Batch Name */}
<Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      <Typography variant="h6">Product Distribution</Typography>
      {/* Only render the Bar chart with axes and Pie chart inside */}
      {barData && barData.labels && barData.datasets && barData.datasets[0].data && barData.labels.length > 0 ? (
        <div style={{ position: 'relative', width: '100%', height: '500px' }}> {/* Increase height here */}
          {/* Bar chart axes */}
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  enabled: false, // Hide default tooltips if needed
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    display: true, // Ensures that the x-axis labels are displayed
                  },
                  grid: {
                    display: true, // Ensure x-axis grid is visible
                    color: 'rgba(0, 0, 0, 0.1)', // Customize grid color
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    display: true, // Ensures that the y-axis labels are displayed
                  },
                  grid: {
                    display: true, // Ensure y-axis grid is visible
                    color: 'rgba(0, 0, 0, 0.1)', // Customize grid color
                  },
                },
              },
            }}
            height={500} // Increase height here
          />
          {/* Pie Chart overlay inside Bar Chart container */}
          {pieData && pieData.labels && pieData.datasets && pieData.datasets[0].data && pieData.labels.length > 0 && (
            <div
              style={{
                position: 'absolute',
                width: '70%',  // Adjust width to your needs
                height: '70%', // Adjust height to your needs
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Pie data={pieData} options={{ responsive: true }} width={100} height={100} />
            </div>
          )}
        </div>
      ) : (
        <Typography>Loading data...</Typography>
      )}
    </CardContent>
  </Card>
</Grid>


  

          <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Product Distribution</Typography>
            {/* Only render the Pie chart inside the Bar chart's axis */}
            {barData && barData.labels && barData.datasets && barData.datasets[0].data && barData.labels.length > 0 ? (
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                {/* This is the container for the Bar chart axes only */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    border: '2px solid #3f51b5', // To display the axis' border
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* Pie Chart overlay inside Bar Chart container */}
                  {pieData && pieData.labels && pieData.datasets && pieData.datasets[0].data && pieData.labels.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Pie data={pieData} options={{ responsive: true }} width={100} height={100} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Typography>Loading data...</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
  

  

          {/* Charts */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Product Distribution</Typography>
                {pieData && <Pie data={pieData} />}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Batch Timeline</Typography>
                {lineData && <Line data={lineData} />}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
