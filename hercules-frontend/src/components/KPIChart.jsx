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
  
  const [barDataTolerance, setBarDataTolerance] = useState(null);
  const [lineDataProduction, setLineDataProduction] = useState(null);
  const [barDataLotTracking, setBarDataLotTracking] = useState(null)
  const [barDataProduction, setBarDataProduction] = useState(null)

  const navigate = useNavigate();

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const handleStartDateChange = (newDate) => {
    if (newDate) {
      const updatedStartDate = new Date(newDate);
      updatedStartDate.setHours(7, 0, 0, 0); // Set time to 7 AM
      setSelectedStartDate(updatedStartDate);
    }
  };
  
  const handleEndDateChange = (newDate) => {
    if (newDate) {
      const updatedEndDate = new Date(newDate);
      updatedEndDate.setHours(7, 0, 0, 0); // Set time to 7 AM
      setSelectedEndDate(updatedEndDate);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/api/kpi");
            let data = response.data;

            console.log("✅ Data Type:", typeof data);

            if (typeof data === "string") {
                try {
                    data = JSON.parse(data.replace(/NaN/g, "null"));
                } catch (parseError) {
                    console.error("❌ Error parsing JSON:", parseError.message);
                    return;
                }
            }

            if (!Array.isArray(data)) {
                console.error("❌ Error: Expected an array but received:", data);
                return;
            }

            console.log("✅ Data is an array with", data.length, "items.");

            data = data.map(item => ({
                ...item,
                "Batch Transfer Time": item["Batch Transfer Time"] ? Number(item["Batch Transfer Time"]) || 0 : 0,
                "Batch Act Start": item["Batch Act Start"] || "N/A",
                "Batch Act End": item["Batch Act End"] || "N/A",
                "Planned Batch Completion Time": item["Planned Batch Completion Time"] || 0,
                "Actual Material Usage": item["Actual Material Usage"] || 0,
                "SetPoint Material Usage": item["SetPoint Material Usage"] || 1, 
                "Product Name": item["Product Name"] || "Unknown",
                "Order Status": item["Order Status"] || "Pending",
                "SetPoint": item["SetPoint"] || 0,
                "Tolerance": item["Tolerance"] || 0
            }));

            console.log("✅ Sanitized Data:", data);

            // **Filter data based on selected date range**
            if (selectedStartDate && selectedEndDate) {
                data = data.filter(item => {
                    const batchStartDate = new Date(item["Batch Act Start"]);
                    const batchEndDate = new Date(item["Batch Act End"]);

                    return batchStartDate >= selectedStartDate && batchEndDate <= selectedEndDate;
                });
            }

            const totalBatches = data.length;
            const uniqueProductsSet = new Set();
            const productCounts = {};
            const batchTimeline = {};

            let totalCompletionTime = 0;
            let plannedCompletionTime = 0;
            let totalMaterialUsage = 0;
            let totalSetPointUsage = 0;
            let accurateBatches = 0;
            let completedOrders = 0;
            let totalOrders = 0;
            let orderBacklogCount = 0;

            data.forEach(item => {
                if (item["Product Name"]) {
                    uniqueProductsSet.add(item["Product Name"]);
                    productCounts[item["Product Name"]] = (productCounts[item["Product Name"]] || 0) + 1;
                }

                if (item["Batch Act Start"] !== "N/A" && item["Batch Act End"] !== "N/A") {
                    const batchStart = new Date(item["Batch Act Start"]);
                    const batchEnd = new Date(item["Batch Act End"]);
                    if (!isNaN(batchStart) && !isNaN(batchEnd)) {
                        const batchTime = (batchEnd - batchStart) / (1000 * 60); 
                        totalCompletionTime += batchTime;
                        plannedCompletionTime += item["Planned Batch Completion Time"];
                    }
                }

                totalMaterialUsage += item["Actual Material Usage"];
                totalSetPointUsage += item["SetPoint Material Usage"];

                if (Math.abs(item["Actual Material Usage"] - item["SetPoint"]) <= item["Tolerance"]) {
                    accurateBatches++;
                }

                if (item["Order Status"] === "Completed") {
                    completedOrders++;
                }
                if (item["Order Status"]) {
                    totalOrders++;
                }
                if (item["Order Status"] === "Pending") {
                    orderBacklogCount++;
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

            // **Calculations for KPIs**
            const orderFulfillmentEfficiency = plannedCompletionTime > 0 
                ? ((totalCompletionTime / plannedCompletionTime) * 100).toFixed(2) 
                : 0;

            const materialUtilizationVariance = totalSetPointUsage > 0
                ? (((totalMaterialUsage - totalSetPointUsage) / totalSetPointUsage) * 100).toFixed(2)
                : 0;

            const batchAccuracyRate = totalBatches > 0
                ? ((accurateBatches / totalBatches) * 100).toFixed(2)
                : 0;

            const avgBatchCycleTime = totalBatches > 0
                ? (totalCompletionTime / totalBatches).toFixed(2)
                : 0;

            const orderCompletionRate = totalOrders > 0
                ? ((completedOrders / totalOrders) * 100).toFixed(2)
                : 0;

            console.log("✅ Processed Metrics:", { totalBatches, uniqueProducts, batchesPerProduct, latestBatchDate });

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
                labels: Object.keys(productCounts),
                datasets: [
                    {
                        label: "Batches Over Product Name",
                        data: Object.values(productCounts),
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

          

            let materialTolerance = {};

data.forEach(item => {
    if (item["SetPoint Material Usage"] > 0) {
        const tolerancePercentage = Math.abs(item["Actual Material Usage"] - item["SetPoint Material Usage"]) / item["SetPoint Material Usage"] * 100;
        materialTolerance[item["Product Name"]] = tolerancePercentage;
    }
});

// Sort materials by highest tolerance %
const sortedMaterials = Object.entries(materialTolerance)
    .sort((a, b) => b[1] - a[1])  // Sort descending
    .slice(0, 5);  // Get top 5 materials

setBarDataTolerance({
    labels: sortedMaterials.map(([name]) => name),
    datasets: [
        {
            label: "Highest Tolerance %",
            data: sortedMaterials.map(([_, tolerance]) => tolerance),
            backgroundColor: ["#ff5722", "#ff9800", "#f44336", "#e91e63", "#9c27b0"]
        }
    ]
});

console.log("✅ barDataTolerance Updated:", barDataTolerance);


const productionByDay = {
  Monday: 0,
  Tuesday: 0,
  Wednesday: 0,
  Thursday: 0,
  Friday: 0,
  Saturday: 0,
  Sunday: 0,
};

data.forEach((item) => {
  const batchDate = new Date(item["Batch Act Start"]);
  const dayOfWeek = batchDate.toLocaleDateString("en-US", { weekday: "long" });

  if (productionByDay.hasOwnProperty(dayOfWeek)) {
    productionByDay[dayOfWeek] += 1; // Increment count for that weekday
  }
});

// Convert the structured object into an array for Chart.js
const weekdayQuantities = Object.entries(productionByDay).map(([day, quantity]) => ({
  day,
  quantity,
}));

console.log("Processed Weekday Data for Chart:", weekdayQuantities); // Debugging

setBarDataProduction({
  labels: weekdayQuantities.map((entry) => entry.day), // Weekdays
  datasets: [
    {
      label: "Tasks Started Per Weekday",
      data: weekdayQuantities.map((entry) => entry.quantity),
      backgroundColor: "#42A5F5",
    },
  ],
});




      // Step 1: Extract Lot Numbers per Batch within the timeframe
const lotTrackingData = {};

data.forEach((item) => {
    const batchDate = new Date(item["Batch Act Start"]).toDateString();
    const lotNumber = item["Lot Number"] || "Unknown";  // Ensure lot numbers exist

    if (!lotTrackingData[batchDate]) {
        lotTrackingData[batchDate] = new Set();  // Use Set to store unique lot numbers
    }
    lotTrackingData[batchDate].add(lotNumber);
});

// Step 2: Convert to Array for Chart.js Format
const lotTrackingFormatted = Object.entries(lotTrackingData).map(([date, lots]) => ({
    date,
    count: lots.size,  // Get count of unique lot numbers per day
}));

// Step 3: Update Bar Chart Data State
setBarDataLotTracking({
    labels: lotTrackingFormatted.map((entry) => entry.date),  // Dates
    datasets: [
        {
            label: "Unique Lot Numbers Per Day",
            data: lotTrackingFormatted.map((entry) => entry.count),
            backgroundColor: "#673AB7",  // Purple color
        }
    ]
});

console.log("✅ Bar Data for Lot Tracking Updated:", lotTrackingFormatted);


        } catch (error) {
            console.error("❌ Error fetching dashboard data:", error);
        }
    };

    

    fetchData();
}, [selectedStartDate, selectedEndDate]); 

  

  



  return (
    <Box sx={{ display: "flex", justifyContent:"center" }}>
      {/* Sidebar */}

     

      {/* Main Dashboard Content */}
    
      <Box component="main" sx={{ flexGrow: 1, p: 3 , display: "flex", justifyContent: "center" }}>
     
        <Toolbar /> {/* Space for top margin */}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
  {/* Start Date Picker */}
  <DatePicker
    label="Select Start Date"
    value={selectedStartDate}
    onChange={handleStartDateChange}
    renderInput={(params) => (
      <TextField
        {...params}
        fullWidth
        sx={{
          position: "absolute",
          marginTop: "20px",
          right: "270px",
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
          width: "200px",
          zIndex: 10,
        }}
      />
    )}
    inputFormat="MM/dd/yyyy"
  />

  {/* End Date Picker */}
  <DatePicker
    label="Select End Date"
    value={selectedEndDate}
    onChange={handleEndDateChange}
    renderInput={(params) => (
      <TextField
        {...params}
        fullWidth
        sx={{
          position: "absolute",
          marginTop: "20px",
          right: "50px",
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
          width: "200px",
          zIndex: 10,
        }}
      />
    )}
    inputFormat="MM/dd/yyyy"
  />
</LocalizationProvider>;

  
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
  

      <Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      <Typography variant="h6">Materials with Highest Tolerance %</Typography>
      {barDataTolerance && <Bar data={barDataTolerance} />}
    </CardContent>
  </Card>
</Grid>


<Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      <Typography variant="h6">Tasks Started Per Weekday</Typography> {/* Updated title */}
      <div style={{ width: "100%", maxWidth: "600px", height: "300px", margin: "0 auto" }}>
        {barDataProduction ? (
          <Bar 
            data={barDataProduction} 
            options={{ 
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Tasks", // Y-axis label for clarity
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Weekdays", // X-axis label
                  },
                },
              },
            }}
          />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </div>
    </CardContent>
  </Card>
</Grid>




<Grid item xs={12} md={6}>
    <Card>
      <CardContent>
        <Typography variant="h6">Lot Tracking Over Time</Typography>
        {barDataLotTracking && <Bar data={barDataLotTracking} />}
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
