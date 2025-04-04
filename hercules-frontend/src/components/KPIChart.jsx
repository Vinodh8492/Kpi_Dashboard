import React, { useEffect, useState } from "react";
import { Grid, FormControl,InputLabel, MenuItem,Select, Card, CardContent, Typography, Box, Toolbar, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Button, Checkbox } from "@mui/material";
import { Pie, Line, Bar } from "react-chartjs-2";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { format } from "date-fns";


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

  const [batchNames, setBatchNames] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBatchName, setSelectedBatchName] = useState([]); // Initialize it properly

  const [selectedProduct, setSelectedProduct] = useState([]);  // New state
  const [productNames, setProductNames] = useState([]); // Add this line

  const [selectedMaterial, setSelectedMaterial] = useState("");  // New State for Material
const [materialNames, setMaterialNames] = useState([]);

const [batchCounts, setBatchCounts] = useState({});
const [sumSP, setSumSP] = useState({});
const [sumAct, setSumAct] = useState({});
const [errKg, setErrKg] = useState({});
const [errPercentage, setErrPercentage] = useState({});



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

  const [batchData, setBatchData] = useState([]);
  
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
                "Tolerance": item["Tolerance"] || 0,
                "Batch Name": item["Batch Name"] || "Unknown"
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

          
            

        if (selectedMaterial) {
          data = data.filter(item => item["Material Name"] === selectedMaterial);
      }

          console.log("✅ Final Filtered Data:", data);

         // Step 1: Compute Aggregated Values
const batchCounts = data.reduce((acc, item) => {
  const productName = item["Product Name"] || "Unknown";
  acc[productName] = (acc[productName] || 0) + 1;
  return acc;
}, {});

setBatchCounts(batchCounts);

const sumSP = data.reduce((acc, item) => {
  const productName = item["Product Name"] || "Unknown";
  const setPointFloat = parseFloat(item["SetPoint Float"]) || 0;
  
  acc[productName] = (acc[productName] || 0) + setPointFloat;
  return acc;
}, {});
setSumSP(sumSP);

const sumAct = data.reduce((acc, item) => {
  const productName = item["Product Name"] || "Unknown";
  const actualValueFloat = parseFloat(item["Actual Value Float"]) || 0;
  
  acc[productName] = (acc[productName] || 0) + actualValueFloat;
  return acc;
}, {});
setSumAct(sumAct);

const errKg = Object.keys(sumSP).reduce((acc, productName) => {
  acc[productName] = (sumAct[productName] || 0) - (sumSP[productName] || 0);
  return acc;
}, {});
setErrKg(errKg);

const errPercentage = Object.keys(sumSP).reduce((acc, productName) => {
  const sumSPValue = sumSP[productName] || 0;
  const sumActValue = sumAct[productName] || 0;

  const errKgValue = sumActValue - sumSPValue;
  const errPercent = sumSPValue !== 0 ? ((errKgValue / sumSPValue) * 100).toFixed(2) : "0.00";

  acc[productName] = `${errPercent} %`;
  return acc;
}, {});
setErrPercentage(errPercentage);

// Step 2: Merge Computed Data into formattedData
// Step 1: Format the data first
const formattedData = data.map(item => {
  const productName = item["Product Name"] || "Unknown";

  return {
    batchName: item["Batch Name"] || "Unknown",
    batchStart: item["Batch Act Start"] || "N/A",
    batchEnd: item["Batch Act End"] || "N/A",
    productName,
    materialName: item["Material Name"] || "Unknown",
    quantity: item["Quantity"] || 0,
    setPointFloat: item["SetPoint Float"] || 0,
    actualValueFloat: item["Actual Value Float"] || 0,
    
    // Include calculated values
    batchCount: batchCounts[productName] || 0,
    totalSetPoint: (sumSP[productName] || 0).toFixed(2),
    totalActual: (sumAct[productName] || 0).toFixed(2),
    errKg: (errKg[productName] || 0).toFixed(2),
    errPercentage: errPercentage[productName] || "0.00 %"
  };
});

// Step 2: Apply filters AFTER formatting the data
let filteredData = formattedData;

if (Array.isArray(selectedBatchName) && selectedBatchName.length > 0) {
  filteredData = filteredData.filter(item => selectedBatchName.includes(item.batchName));
}

if (Array.isArray(selectedProduct) && selectedProduct.length > 0) {
  filteredData = filteredData.filter(item => selectedProduct.includes(item.productName));
}

// Step 3: Remove duplicates based on product name
const uniqueBatchData = Object.values(
  filteredData.reduce((acc, item) => {
    if (!acc[item.productName]) {
      acc[item.productName] = item; // Store only the first occurrence
    }
    return acc;
  }, {})
);

// Step 4: Set the unique batch data
setBatchData(uniqueBatchData);



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

            const uniqueBatchNames = Array.from(new Set(data.map(item => item["Batch Name"]).filter(name => name)));

            setBatchNames(uniqueBatchNames);

            const uniqueProductNames = Array.from(new Set(data.map(item => item["Product Name"]).filter(name => name)));
setProductNames(uniqueProductNames); // Save it for dropdown

const uniqueMaterialNames = Array.from(new Set(data.map(item => item["Material Name"]).filter(name => name)));
setMaterialNames(uniqueMaterialNames);






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
}, [selectedStartDate, selectedEndDate, selectedBatchName, selectedProduct, selectedMaterial]); 

  

const getRandomColors = (numColors) => {
  return Array.from({ length: numColors }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
};

// Apply unique colors to bars
if (barData && barData.labels && barData.datasets && barData.datasets[0].data) {
  barData.datasets[0].backgroundColor = getRandomColors(barData.datasets[0].data.length);
}

if (barDataProduction && barDataProduction.labels && barDataProduction.datasets && barDataProduction.datasets[0].data) {
  barDataProduction.datasets[0].backgroundColor = getRandomColors(barDataProduction.datasets[0].data.length);
}

if (barDataTolerance && barDataTolerance.labels && barDataTolerance.datasets && barDataTolerance.datasets[0].data) {
  barDataTolerance.datasets[0].backgroundColor = getRandomColors(barDataTolerance.datasets[0].data.length);
}

if (barDataLotTracking && barDataLotTracking.labels && barDataLotTracking.datasets && barDataLotTracking.datasets[0].data) {
  barDataLotTracking.datasets[0].backgroundColor = getRandomColors(barDataLotTracking.datasets[0].data.length);
}

if (pieData && pieData.labels && pieData.datasets && pieData.datasets[0].data) {
  pieData.datasets[0].backgroundColor = getRandomColors(pieData.datasets[0].data.length);
}

const [showTable, setShowTable] = useState(false);

console.log("batch Data :", batchData)
console.log("selected batch name :", selectedBatchName)

  return (
    <Box sx={{ display: "flex", justifyContent:"center", flexDirection:"column" }}>

<Box sx={{ 
      display: "flex", 
      gap: 2, 
      mb: 2, 
      ml : 10,
      position: "sticky",  // Keeps it visible
      top: 0,  // Sticks to the top
      backgroundColor: "white",  // Prevent overlap
      zIndex: 1000,  // Ensures it stays above other elements
      padding: "10px 0",
      width: "90%",
      justifyContent: "center",
      boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" // Light shadow for visibility
    }}>
    <Button 
      variant={showTable ? "outlined" : "contained"} 
      onClick={() => setShowTable(false)}
      sx={{ height: '50px' }}
    >
      Show Graphs
    </Button>

    <Button 
      variant={showTable ? "contained" : "outlined"} 
      onClick={() => setShowTable(true)}
      sx={{ height: '50px' }}
    >
      Show Table
    </Button>
  </Box>
    
    
      {showTable ? (
       <TableContainer component={Paper} sx={{ maxWidth: "90%", margin: "auto", mt: 4 }}>

       {/* Add Filters (Start Date, End Date, and Batch Dropdown) */}
       <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
         
         {/* Start Date Picker */}
         <LocalizationProvider dateAdapter={AdapterDateFns}>
           <DatePicker
             label="Select Start Date"
             value={selectedStartDate}
             onChange={handleStartDateChange}
             renderInput={(params) => (
               <TextField {...params} sx={{ width: "200px", backgroundColor: "#f5f5f5", borderRadius: "5px" }} />
             )}
             inputFormat="MM/dd/yyyy"
           />
         </LocalizationProvider>

         {/* End Date Picker */}
         <LocalizationProvider dateAdapter={AdapterDateFns}>
           <DatePicker
             label="Select End Date"
             value={selectedEndDate}
             onChange={handleEndDateChange}
             renderInput={(params) => (
               <TextField {...params} sx={{ width: "200px", backgroundColor: "#f5f5f5", borderRadius: "5px" }} />
             )}
             inputFormat="MM/dd/yyyy"
           />
         </LocalizationProvider>

         {/* Batch Dropdown */}
<FormControl sx={{ width: "200px" }}>
  <InputLabel>Select Batch</InputLabel>
  <Select
    multiple
    value={selectedBatchName}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedBatchName(
        value.includes("") ? [] : value // Reset when "All Batches" is selected
      );
    }}
    sx={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}
    renderValue={(selected) => selected.join(", ")} // Show selected items
  >
    <MenuItem value="">All Batches</MenuItem>
    {batchNames.map((batch) => (
      <MenuItem key={batch} value={batch}>
        {selectedBatchName.includes(batch) ? "✔ " : ""} {batch}
      </MenuItem>
    ))}
  </Select>
</FormControl>

{/* Product Name Dropdown */}
<FormControl sx={{ width: "200px" }}>
  <InputLabel>Select Product</InputLabel>
  <Select
    multiple
    value={selectedProduct}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedProduct(
        value.includes("") ? [] : value // Reset when "All Products" is selected
      );
    }}
    sx={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}
    renderValue={(selected) => selected.join(", ")} // Show selected items
  >
    <MenuItem value="">All Products</MenuItem>
    {productNames.map((product) => (
      <MenuItem key={product} value={product}>
        {selectedProduct.includes(product) ? "✔ " : ""} {product}
      </MenuItem>
    ))}
  </Select>
</FormControl>


<FormControl sx={{ width: "200px" }}>
  <InputLabel>Select Material</InputLabel>
  <Select
    value={selectedMaterial}
    onChange={(e) => setSelectedMaterial(e.target.value)}
    sx={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}
  >
    <MenuItem value="">All Materials</MenuItem>
    {materialNames.map((material) => (
      <MenuItem key={material} value={material}>
        {material}
      </MenuItem>
    ))}
  </Select>
</FormControl>



       </Box>

{/* Display Selected Date Range */}
<Box sx={{ width: "100%", mt: 2 }}>
  <Typography variant="h6" sx={{color: "#333" }}>
  <span style={{ fontWeight: "bold" }}>Date Range:</span>  {selectedStartDate ? format(new Date(selectedStartDate), "MM/dd/yyyy") : "Start Date"} 7:00 to <span></span> 
                {selectedEndDate ? format(new Date(selectedEndDate), "MM/dd/yyyy") : "End Date"}  7:00
  </Typography>

  {/* Selected Products */}
  <Typography variant="h6" sx={{ color: "#333", mt: 1 }}>
  <span style={{ fontWeight: "bold" }}>Selected Products:</span> {selectedProduct && selectedProduct.length > 0 ? selectedProduct.join(", ") : "All Products"}
</Typography>

{/* Selected Batches */}
<Typography variant="h6" sx={{ color: "#333", mt: 1 }}>
  <span style={{ fontWeight: "bold" }}>Selected Batches:</span> {selectedBatchName && selectedBatchName.length > 0 ? selectedBatchName.join(", ") : "All Batches"}
</Typography>

</Box>


       {/* Table Data */}
       <Table>
    <TableHead>
        <TableRow>
            <TableCell><b>Product Name</b></TableCell> {/* New Serial Number Column */}
            <TableCell><b>No.of Batches</b></TableCell>
            <TableCell><b>Sum SP</b></TableCell>
            <TableCell><b>Sum Act</b></TableCell>
            <TableCell><b>Err Kg</b></TableCell>
            <TableCell><b>Err %</b></TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {batchData.map((item, index) => (
            <TableRow key={index}>
                <TableCell>{item.productName}</TableCell> {/* Serial Number */}
                <TableCell>{item.batchCount}</TableCell>
                <TableCell>{item.totalSetPoint}</TableCell>
                <TableCell>{item.totalActual}</TableCell>
                <TableCell>{item.errKg}</TableCell>
                <TableCell>{item.errPercentage}</TableCell>
            </TableRow>
        ))}
    </TableBody>
</Table>

   </TableContainer>
      ) : ( <Box component="main" sx={{ maxWidth: "90%", margin: "auto", mt: "-20px" }}>
     
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

<label>Select Batch: </label>
<select
style={{
  width: "200px",
  height: "50px",
  padding: "8px",
  fontSize: "16px",
  border: "2px solid #007bff",
  borderRadius: "5px",
  backgroundColor: "#f8f9fa",
  color: "#333",
  cursor: "pointer",
  outline: "none",
}}
value={selectedBatchName}  // Ensure state is tracked correctly
onChange={(e) => setSelectedBatchName(e.target.value)}
>
<option value="">All Batches</option>
{batchNames.map((batch) => (
  <option key={batch} value={batch}>
    {batch}
  </option>
))}
</select>

<label>Select Product: </label>
<select
  style={{
    width: "200px",
    height: "50px",
    padding: "8px",
    fontSize: "16px",
    border: "2px solid #007bff",
    borderRadius: "5px",
    backgroundColor: "#f8f9fa",
    color: "#333",
    cursor: "pointer",
    outline: "none",
  }}
  value={selectedProduct}  // Ensuring selected value is tracked
  onChange={(e) => setSelectedProduct(e.target.value)}
>
  <option value="">All Products</option>
  {productNames.map((product) => (
    <option key={product} value={product}>
      {product}
    </option>
  ))}
</select>


<label>Select Material: </label>
    <select
      style={{
        width: "200px",
        height: "50px",
        padding: "8px",
        fontSize: "16px",
        border: "2px solid #28a745",
        borderRadius: "5px",
        backgroundColor: "#f8f9fa",
        color: "#333",
        cursor: "pointer",
        outline: "none",
        marginLeft: "10px"
      }}
      value={selectedMaterial}  
      onChange={(e) => setSelectedMaterial(e.target.value)}
    >
      <option value="">All Materials</option>
      {materialNames.map((material) => (
        <option key={material} value={material}>
          {material}
        </option>
      ))}
    </select>




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

      
    </Box>)}

     

      {/* Main Dashboard Content */}
    
      
    </Box>
  );
};

export default Dashboard;
