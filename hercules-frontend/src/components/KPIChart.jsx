import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Toolbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button,
  CircularProgress,
  ButtonGroup,
  Menu,
} from "@mui/material";
import { Pie, Line, Bar, Doughnut } from "react-chartjs-2";
import { LineChart } from "@mui/x-charts/LineChart";
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
  Title,
  Filler,
} from "chart.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Diversity2OutlinedIcon from "@mui/icons-material/Diversity2Outlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Brightness7OutlinedIcon from "@mui/icons-material/Brightness7Outlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import ReactToPrint from "react-to-print";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "../App.css";
import { useRef } from "react";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler // ✅ Add this line
);

// Plugin to display text in center of doughnut chart
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    if (chart.config.type === "doughnut") {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;
      ctx.restore();const fontSize = (height / 180).toFixed(2);  // smaller font
      ctx.font = `${fontSize}em sans-serif`;
      
      // const fontSize = (height / 114).toFixed(2);
      // ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";

      // const text = chart.config.options.plugins.centerText.text || "";
      const text = `${chart.config.data.labels?.length || 0} Materials`;

      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  },
};


const Dashboard = () => {
  // State declarations
  const [kpiData, setKpiData] = useState([]);
  const [pieData, setPieData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [barDataTolerance, setBarDataTolerance] = useState(null);
  const [barDataLotTracking, setBarDataLotTracking] = useState(null);
  const [barDataProduction, setBarDataProduction] = useState(null);
  const [donutData, setDonutData] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [batchNames, setBatchNames] = useState([]);
  const [selectedBatchName, setSelectedBatchName] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [materialNames, setMaterialNames] = useState([]);
  const [batchCounts, setBatchCounts] = useState({});
  const [sumSP, setSumSP] = useState({});
  const [sumAct, setSumAct] = useState({});
  const [errKg, setErrKg] = useState({});
  const [errPercentage, setErrPercentage] = useState({});
  const [selectedCardColor, setSelectedCardColor] = useState("White");
  const [selectedCardBgColor, setSelectedCardBgColor] = useState("White");
  const [lineStrokeColor, setLineStrokeColor] = useState("#33691e"); // default dark
  const [pointFillColor, setPointFillColor] = useState("#a2cb74"); // default light
  const [gradientColors, setGradientColors] = useState([]);
  const [historicalBarData, setHistoricalBarData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [secondAnchorEl, setSecondAnchorEl] = useState(null);
  const [thirdAnchorEl, setThirdAnchorEl] = useState(null);
  const [activeTable, setActiveTable] = useState(null);
  const [viewReport, setViewReport] = useState(false); // kumar changes

  const [weekStartDate, setWeekStartDate] = useState(null);
  const [monthStartDate, setMonthStartDate] = useState(null);
  const [startDate, setStartDate] = useState(null);

  const dashboardRef = useRef();
  const bgColorOptions = [
    { name: "White", hex: "#ffffff" },

    { name: "Mint", hex: "#90ee90" },

    { name: "Steel Gray", hex: "#2F4F4F" },
    { name: "Charcoal", hex: "#36454F" },
    { name: "Slate Blue", hex: "#6A7FDB" },
    { name: "Olive Drab", hex: "#6B8E23" },
    { name: "Rust Red", hex: "#8B0000" },
    { name: "Safety Orange", hex: "#FF6F00" },

    { name: "Industrial Yellow Dark", hex: "#D4A628" },

    { name: "Midnight Blue", hex: "#191970" },
    { name: "Cobalt Blue", hex: "#0047AB" },
  ];
  const colorOptions = [
    // { name: "Dark Navy", hex: "#003f5c" },
    // { name: "Green", hex: "#74b030" },
    // { name: "Indigo", hex: "#2f4b7c" },
    // { name: "Lavender", hex: "#665191" },
    // { name: "Orchid", hex: "#a05195" },
    // { name: "Rose", hex: "#d45087" },
    // { name: "Coral", hex: "#f95d6a" },
    // { name: "Orange", hex: "#ff7c43" },
    // { name: "Gold", hex: "#ffa600" },

    { name: "Cool White", hex: "#F9F9F9" },
    { name: "Steel Gray", hex: "#2F4F4F" },
    { name: "Charcoal", hex: "#36454F" },
    { name: "Slate Blue", hex: "#6A7FDB" },
    { name: "Olive Drab", hex: "#6B8E23" },
    { name: "Rust Red", hex: "#8B0000" },
    { name: "Safety Orange", hex: "#FF6F00" },
    { name: "Industrial Yellow", hex: "#F4C542" },
    { name: "Concrete Gray", hex: "#D3D3D3" },
    { name: "Midnight Blue", hex: "#191970" },
    { name: "Cobalt Blue", hex: "#0047AB" },
    { name: "Jet Black", hex: "#000000" },
  ];

  const getHexByName = (name) => {
    const allOptions = [...colorOptions, ...bgColorOptions];
    const found = allOptions.find((c) => c.name === name);
    return found ? found.hex : "#000000";
  };

  const getTextColorForBackground = (colorName) => {
    const hex = getHexByName(colorName);
    const lightBackgrounds = [
      "#ffffff",
      "#ffefef",
      "#f8f9fa",
      "#fce4ec",
      "#ede7f6",
      "#fff3e0",
      "#90ee90",
    ];
    return lightBackgrounds.includes(hex.toLowerCase()) ? "#1a1a1a" : "#ffffff";
  };

  const getGradientColors = (baseColorHex) => {
    const base = baseColorHex.replace("#", "");
    const r = parseInt(base.substring(0, 2), 16);
    const g = parseInt(base.substring(2, 4), 16);
    const b = parseInt(base.substring(4, 6), 16);

    const steps = 12;
    const gradient = [];

    for (let i = 0; i < steps; i++) {
      const factor = i / (steps - 1); // Linear step
      const limit = 0.4; // Set minimum brightness to 40%

      // Don't let RGB values fall below 40% of original
      const minR = Math.max(Math.round(r * limit), 30);
      const minG = Math.max(Math.round(g * limit), 30);
      const minB = Math.max(Math.round(b * limit), 30);

      const newR = Math.round(r - (r - minR) * factor);
      const newG = Math.round(g - (g - minG) * factor);
      const newB = Math.round(b - (b - minB) * factor);

      gradient.push(`rgb(${newR}, ${newG}, ${newB})`);
    }

    return gradient;
  };

  const handleMenuClick = (event, menuType) => {
    switch (menuType) {
      case "uniqueNames":
        setAnchorEl(event.currentTarget);
        break;
      case "batchSummaries":
        setSecondAnchorEl(event.currentTarget);
        break;
      case "nfmReports":
        setThirdAnchorEl(event.currentTarget);
        break;
      default:
        break;
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSecondAnchorEl(null);
    setThirdAnchorEl(null);
  };

  const showTables = (tableName) => {
    setActiveTable(tableName);
    handleMenuClose();
  };

  // Date handlers
  const handleStartDateChange = (newDate) => {
    if (newDate) {
      const updatedStartDate = new Date(newDate);
      updatedStartDate.setHours(7, 0, 0, 0);
      setSelectedStartDate(updatedStartDate);
    }
  };

  const handleEndDateChange = (newDate) => {
    if (newDate) {
      const updatedEndDate = new Date(newDate);
      updatedEndDate.setHours(7, 0, 0, 0);
      setSelectedEndDate(updatedEndDate);
    }
  };

  // Batch selection handler
  const handleBatchChange = (event) => {
    setSelectedBatchName(event.target.value);
  };
  const applyFilters = () => {
    console.log("Filters applied:", {
      selectedStartDate,
      selectedEndDate,
      selectedBatchName,
      selectedProduct,
      selectedMaterial,
    });

    setRefreshFlag((prev) => !prev); 
  };

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/kpi");
        let data = response.data;
        // Parse data if it's a string
        if (typeof data === "string") {
          try {
            data = JSON.parse(data.replace(/NaN/g, "null"));
          } catch (parseError) {
            console.error("Error parsing JSON:", parseError.message);
            return;
          }
        }

        // Validate data structure
        if (!Array.isArray(data)) {
          console.error("Error: Expected an array but received:", data);
          return;
        }

        // Normalize data
        data = data.map((item) => ({
          ...item,
          "Batch Transfer Time": item["Batch Transfer Time"]
            ? Number(item["Batch Transfer Time"]) || 0
            : 0,
          "Batch Act Start": item["Batch Act Start"] || "N/A",
          "Batch Act End": item["Batch Act End"] || "N/A",
          "Planned Batch Completion Time":
            item["Planned Batch Completion Time"] || 0,
          "Actual Material Usage": item["Actual Material Usage"] || 0,
          "SetPoint Material Usage": item["SetPoint Material Usage"] || 1,
          "Product Name": item["Product Name"] || "Unknown",
          "Order Status": item["Order Status"] || "Pending",
          SetPoint: item["SetPoint"] || 0,
          Tolerance: item["Tolerance"] || 0,
          "Batch Name": item["Batch Name"] || "Unknown",
          "Lot Number": item["Lot Number"] || "Unknown",
          "Material Name": item["Material Name"] || "Unknown",
        }));

        // Set batch names for dropdown
        setBatchNames(
          Array.from(new Set(data.map((item) => item["Batch Name"])))
        );
        setProductNames(
          Array.from(new Set(data.map((item) => item["Product Name"])))
        );

        // Filter by date range if dates are selected
        if (selectedStartDate && selectedEndDate) {
          data = data.filter((item) => {
            const batchStartDate = new Date(item["Batch Act Start"]);
            const batchEndDate = new Date(item["Batch Act End"]);
            return (
              batchStartDate >= selectedStartDate &&
              batchEndDate <= selectedEndDate
            );
          });
        }

        // Filter by batch name if selected
        if (selectedBatchName.length > 0) {
          data = data.filter((item) =>
            selectedBatchName.includes(item["Batch Name"])
          );
        }

        // Filter by product if selected
        if (selectedProduct.length > 0) {
          data = data.filter((item) =>
            selectedProduct.includes(item["Product Name"])
          );
        }

        // Filter by material if selected
        if (selectedMaterial) {
          data = data.filter(
            (item) => item["Material Name"] === selectedMaterial
          );
        }




        // Calculate batch counts by product
        const batchCounts = data.reduce((acc, item) => {
          const productName = item["Product Name"] || "Unknown";
          acc[productName] = (acc[productName] || 0) + 1;
          return acc;
        }, {});
        setBatchCounts(batchCounts);

        // Calculate sum of set points by product
        const sumSP = data.reduce((acc, item) => {
          const productName = item["Product Name"] || "Unknown";
          const setPointFloat = parseFloat(item["SetPoint Float"]) || 0;
          acc[productName] = (acc[productName] || 0) + setPointFloat;
          return acc;
        }, {});
        setSumSP(sumSP);

        // Calculate sum of actual values by product
        const sumAct = data.reduce((acc, item) => {
          const productName = item["Product Name"] || "Unknown";
          const actualValueFloat = parseFloat(item["Actual Value Float"]) || 0;
          acc[productName] = (acc[productName] || 0) + actualValueFloat;
          return acc;
        }, {});
        setSumAct(sumAct);

        // Calculate error in kg by product
        const errKg = Object.keys(sumSP).reduce((acc, productName) => {
          acc[productName] =
            (sumAct[productName] || 0) - (sumSP[productName] || 0);
          return acc;
        }, {});
        setErrKg(errKg);

        // Calculate error percentage by product
        const errPercentage = Object.keys(sumSP).reduce((acc, productName) => {
          const sumSPValue = sumSP[productName] || 0;
          const sumActValue = sumAct[productName] || 0;
          const errKgValue = sumActValue - sumSPValue;
          const errPercent =
            sumSPValue !== 0
              ? ((errKgValue / sumSPValue) * 100).toFixed(2)
              : "0.00";
          acc[productName] = `${errPercent} %`;
          return acc;
        }, {});
        setErrPercentage(errPercentage);

        // Format the data for table display
        const formattedData = data.map((item) => {
          const productName = item["Product Name"] || "Unknown";
          return {
            batchGuid: item["Batch GUID"] || "Unknown",
            batchName: item["Batch Name"] || "Unknown",
            batchStart: item["Batch Act Start"] || "N/A",
            batchEnd: item["Batch Act End"] || "N/A",
            productName,
            materialName: item["Material Name"] || "Unknown",
            materialCode: item["Material Code"] || "Unknown",
            quantity: item["Quantity"] || 0,
            setPointFloat: item["SetPoint Float"] || 0,
            actualValueFloat: item["Actual Value Float"] || 0,
            sourceServer: item["Source Server"] || "Unknown",
            rootGuid: item["ROOTGUID"] || "Unknown",
            orderId: item["OrderId"] || "Unknown",
            batchCount: batchCounts[productName] || 0,
            totalSetPoint: (sumSP[productName] || 0).toFixed(2),
            totalActual: (sumAct[productName] || 0).toFixed(2),
            errKg: (errKg[productName] || 0).toFixed(2),
            errPercentage: errPercentage[productName] || "0.00 %",
          };
        });

        // Apply filters to formatted data
        let filteredData = formattedData.filter((item) => {
          const matchesBatch =
            selectedBatchName.length === 0 ||
            selectedBatchName.includes(item.batchName);
          const matchesProduct =
            selectedProduct.length === 0 ||
            selectedProduct.includes(item.productName);
          return matchesBatch || matchesProduct; // Instead of AND, we use OR
        });
        if (
          (Array.isArray(selectedBatchName) && selectedBatchName.length > 0) ||
          (Array.isArray(selectedProduct) && selectedProduct.length > 0)
        ) {
          filteredData = filteredData.filter(
            (item) =>
              selectedBatchName.length === 0 ||
              selectedBatchName.includes(item.batchName) ||
              selectedProduct.length === 0 ||
              selectedProduct.includes(item.productName)
          );
        }
        // Remove duplicates based on product name
        const uniqueBatchData = Object.values(
          filteredData.reduce((acc, item) => {
            if (!acc[item.productName]) {
              acc[item.productName] = item;
            }
            return acc;
          }, {})
        );

        setBatchData(uniqueBatchData);

        // Calculate KPIs and prepare chart data
        calculateKPIsAndCharts(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const calculateKPIsAndCharts = (data) => {
      const totalBatches = data.length;
      const uniqueProductsSet = new Set();
      const productCounts = {};
      const batchTimeline = {};
      const orderStatusCounts = {
        Completed: 0,
        Pending: 0,
        InProgress: 0,
        Cancelled: 0,
      };
      const selectedHex = getHexByName(selectedCardBgColor);
      const gradientColors = getGradientColors(selectedHex);
      const lineStrokeColor = gradientColors[gradientColors.length - 1]; // darkest
      const pointFillColor = gradientColors[0]; // lightest

      let totalCompletionTime = 0;
      let plannedCompletionTime = 0;
      let totalMaterialUsage = 0;
      let totalSetPointUsage = 0;
      let accurateBatches = 0;
      let completedOrders = 0;
      let totalOrders = 0;
      let orderBacklogCount = 0;

      data.forEach((item) => {
        // Count products
        if (item["Product Name"]) {
          uniqueProductsSet.add(item["Product Name"]);
          productCounts[item["Product Name"]] =
            (productCounts[item["Product Name"]] || 0) + 1;
        }

        // Count order statuses
        if (item["Order Status"]) {
          orderStatusCounts[item["Order Status"]] =
            (orderStatusCounts[item["Order Status"]] || 0) + 1;
        }

        // Calculate batch times
        if (
          item["Batch Act Start"] !== "N/A" &&
          item["Batch Act End"] !== "N/A"
        ) {
          const batchStart = new Date(item["Batch Act Start"]);
          const batchEnd = new Date(item["Batch Act End"]);
          if (!isNaN(batchStart) && !isNaN(batchEnd)) {
            const batchTime = (batchEnd - batchStart) / (1000 * 60);
            totalCompletionTime += batchTime;
            plannedCompletionTime += item["Planned Batch Completion Time"];
          }
        }

        // Material usage
        totalMaterialUsage += item["Actual Material Usage"];
        totalSetPointUsage += item["SetPoint Material Usage"];

        // Accurate batches
        if (
          Math.abs(item["Actual Material Usage"] - item["SetPoint"]) <=
          item["Tolerance"]
        ) {
          accurateBatches++;
        }

        // Order status counts
        if (item["Order Status"] === "Completed") {
          completedOrders++;
        }
        if (item["Order Status"]) {
          totalOrders++;
        }
        if (item["Order Status"] === "Pending") {
          orderBacklogCount++;
        }

        // Batch timeline
        if (item["Batch Act Start"] !== "N/A") {
          const batchDate = new Date(item["Batch Act Start"]);
          if (!isNaN(batchDate)) {
            const formattedDate = batchDate.toDateString();
            batchTimeline[formattedDate] =
              (batchTimeline[formattedDate] || 0) + 1;
          }
        }
      });

      // Set material names for dropdown
      const uniqueMaterialNames = Array.from(
        new Set(
          data.map((item) => item["Material Name"]).filter((name) => name)
        )
      );
      setMaterialNames(uniqueMaterialNames);

      // Calculate derived metrics
      const uniqueProducts = uniqueProductsSet.size || 1;
      const batchesPerProduct = (totalBatches / uniqueProducts).toFixed(2);
      const latestBatchDate =
        data.length && data[data.length - 1]["Batch Act Start"] !== "N/A"
          ? new Date(data[data.length - 1]["Batch Act Start"]).toDateString()
          : "N/A";

      // Set KPI data
      setKpiData([
        {
          title: "Total Batches",
          value: totalBatches,
          color: "#3f51b5",
          percentage: 10,
        },
        {
          title: "Unique Products",
          value: uniqueProducts,
          color: "#4caf50",
          percentage: 5,
        },
        {
          title: "Batches per Product",
          value: batchesPerProduct,
          color: "#ffb300",
          percentage: -2,
        },
        {
          title: "Latest Batch Date",
          value: latestBatchDate,
          color: "#0097a7",
          percentage: 0,
        },
      ]);

      // Set product distribution chart data
      setPieData({
        labels: Object.keys(productCounts),
        datasets: [
          {
            data: Object.values(productCounts),
            backgroundColor: gradientColors,

            // [
            //   "#f1f8e9", // lightest green
            //   "#e6f2d9",
            //   "#dbebc8",
            //   "#cfe5b8",
            //   "#c4dea7",
            //   "#b9d896",
            //   "#add185",
            //   "#a2cb74",
            //   "#97c463",
            //   "#8bbd52",
            //   "#7fb741",
            //   "#74b030",
            //   "#689f38", // base medium green from your image
            //   "#558b2f",
            //   "#33691e"  // darkest green
            // ],
            borderWidth: 1,
          },
        ],
      });

      // Set bar chart data for products
      setBarData({
        labels: Object.keys(productCounts),
        datasets: [
          {
            label: "Batches by Product",
            data: Object.values(productCounts),
            backgroundColor: gradientColors,
            //  [
            //   "#f1f8e9", // lightest green
            //   "#e6f2d9",
            //   "#dbebc8",
            //   "#cfe5b8",
            //   "#c4dea7",
            //   "#b9d896",
            //   "#add185",
            //   "#a2cb74",
            //   "#97c463",
            //   "#8bbd52",
            //   "#7fb741",
            //   "#74b030",
            //   "#689f38", // base medium green from your image
            //   "#558b2f",
            //   "#33691e"  // darkest green
            // ],
          },
        ],
      });

      // Set line chart data for batch timeline
      setLineData({
        labels: Object.keys(batchTimeline),
        datasets: [
          {
            label: "Batches Over Time",
            data: Object.values(batchTimeline),
            borderColor: gradientColors,
            backgroundColor: gradientColors,
            //  [
            //   "#f1f8e9", // lightest green
            //   "#e6f2d9",
            //   "#dbebc8",
            //   "#cfe5b8",
            //   "#c4dea7",
            //   "#b9d896",
            //   "#add185",
            //   "#a2cb74",
            //   "#97c463",
            //   "#8bbd52",
            //   "#7fb741",
            //   "#74b030",
            //   "#689f38", // base medium green from your image
            //   "#558b2f",
            //   "#33691e"  // darkest green
            // ],
            fill: true,
            tension: 0.1,
          },
        ],
      });
      setHistoricalBarData({
        labels: Object.keys(batchTimeline),
        datasets: [
          {
            label: "Historical Batch Count",
            data: Object.values(batchTimeline),
            backgroundColor: gradientColors,
          },
        ],
      });

      // Calculate material tolerance data
      let materialTolerance = {};
      data.forEach((item) => {
        if (item["SetPoint Material Usage"] > 0) {
          const tolerancePercentage =
            (Math.abs(
              item["Actual Material Usage"] - item["SetPoint Material Usage"]
            ) /
              item["SetPoint Material Usage"]) *
            100;
          materialTolerance[item["Product Name"]] = tolerancePercentage;
        }
      });

      // Sort and get top 5 materials by tolerance
      const sortedMaterials = Object.entries(materialTolerance)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setBarDataTolerance({
        labels: sortedMaterials.map(([name]) => name),
        datasets: [
          {
            label: "Highest Tolerance %",
            data: sortedMaterials.map(([_, tolerance]) => tolerance),
            backgroundColor: gradientColors,
            // [
            //   // "#f1f8e9", // lightest green
            //   // "#e6f2d9",
            //   // "#dbebc8",
            //   // "#cfe5b8",
            //   // "#c4dea7",
            //   // "#b9d896",
            //   // "#add185",
            //   "#a2cb74",
            //   "#97c463",
            //   "#8bbd52",
            //   "#7fb741",
            //   "#74b030",
            //   "#689f38", // base medium green from your image
            //   "#558b2f",
            //   "#33691e"  // darkest green
            // ],
          },
        ],
      });

      // Calculate production by weekday
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
        const dayOfWeek = batchDate.toLocaleDateString("en-US", {
          weekday: "long",
        });

        if (productionByDay.hasOwnProperty(dayOfWeek)) {
          productionByDay[dayOfWeek] += 1;
        }
      });

      setBarDataProduction({
        labels: Object.keys(productionByDay),
        datasets: [
          {
            label: "Tasks Started Per Weekday",
            data: Object.values(productionByDay),
            backgroundColor: gradientColors,
            // [
            //   // "#f1f8e9", // lightest green
            //   // "#e6f2d9",
            //   // "#dbebc8",
            //   // "#cfe5b8",
            //   // "#c4dea7",
            //   // "#b9d896",
            //   // "#add185",
            //   "#a2cb74",
            //   "#97c463",
            //   "#8bbd52",
            //   "#7fb741",
            //   "#74b030",
            //   "#689f38", // base medium green from your image
            //   "#558b2f",
            //   "#33691e"  // darkest green
            // ],
          },
        ],
      });

      // Calculate lot tracking data
      const lotTrackingData = {};
      data.forEach((item) => {
        const batchDate = new Date(item["Batch Act Start"]).toDateString();
        const lotNumber = item["Lot Number"] || "Unknown";

        if (!lotTrackingData[batchDate]) {
          lotTrackingData[batchDate] = new Set();
        }
        lotTrackingData[batchDate].add(lotNumber);
      });

      const lotTrackingFormatted = Object.entries(lotTrackingData).map(
        ([date, lots]) => ({
          date,
          count: lots.size,
        })
      );

      setBarDataLotTracking({
        labels: lotTrackingFormatted.map((entry) => entry.date),
        datasets: [
          {
            label: "Unique Lot Numbers Per Day",
            data: lotTrackingFormatted.map((entry) => entry.count),
            backgroundColor: gradientColors,
            // [
            //   // "#f1f8e9", // lightest green
            //   // "#e6f2d9",
            //   // "#dbebc8",
            //   // "#cfe5b8",
            //   // "#c4dea7",
            //   // "#b9d896",
            //   // "#add185",
            //   "#a2cb74",
            //   "#97c463",
            //   "#8bbd52",
            //   "#7fb741",
            //   "#74b030",
            //   "#689f38", // base medium green from your image
            //   "#558b2f",
            //   "#33691e"  // darkest green
            // ],
          },
        ],
      });
      // Set order status doughnut chart data
      setDonutData({
        labels: Object.keys(productCounts),
        datasets: [
          {
            data: Object.values(productCounts),
            backgroundColor: gradientColors,
            // [
            //   "#f1f8e9", // lightest green
            //   "#e6f2d9",
            //   "#dbebc8",
            //   "#cfe5b8",
            //   "#c4dea7",
            //   "#b9d896",
            //   "#add185",
            //   "#a2cb74",
            //   "#97c463",
            //   "#8bbd52",
            //   "#7fb741",
            //   "#74b030",
            //   "#689f38", // base medium green from your image
            //   "#558b2f",
            //   "#33691e"  // darkest green
            // ],
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, [
    selectedStartDate,
    selectedEndDate,
    selectedBatchName,
    selectedProduct,
    selectedMaterial,
    selectedCardBgColor,
  ]);
  useEffect(() => {
    const selectedHex = getHexByName(selectedCardBgColor);
    const newGradient = getGradientColors(selectedHex);
    setGradientColors(newGradient); // 🆕 Add this
    setLineStrokeColor(newGradient[newGradient.length - 1]); // dark end
    setPointFillColor(newGradient[0]); // light start
  }, [selectedCardBgColor]);

  const iconStyles = {
    0: {
      background: "linear-gradient(#ef629a, 10%,#ffcc70)",
    },
    1: {
      background: "linear-gradient(#60b9fc,10%,#6bd3db)", // Light blue background
    },
    2: {
      background: "linear-gradient(blue, 10%, pink)", // Light green background
    },
    3: {
      background: "linear-gradient(#86e7d6,10%,#92ffc0)", // Light orange background
    },
  };

  const productBatchCount = batchData.reduce((acc, item) => {
    // Check if productName already exists in the accumulator object
    if (acc[item.productName]) {
      console.log("item product :", item.productName)
      acc[item.productName] += 1;  // Increment the count for this productName
    } else {
      acc[item.productName] = 1;  // Initialize the count to 1 if not already in the accumulator
    }
    return acc;
  }, {});

  console.log("batch data :", batchData)

  


  return (
    <div ref={dashboardRef} className="print-container">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 3 }}>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            {/* Left Side Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant={!showTable ? "contained" : "outlined"}
                onClick={() => setShowTable(false)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  px: 3,
                  background: !showTable ? "linear-gradient(to right, #1976d2, #2196f3)" : "transparent",
                  color: !showTable ? "#fff" : "#1976d2",
                  borderColor: "#1976d2",
                  boxShadow: !showTable ? "0px 4px 10px rgba(25, 118, 210, 0.3)" : "none",
                  "&:hover": {
                    background: !showTable ? "linear-gradient(to right, #1565c0, #1e88e5)" : "rgba(25, 118, 210, 0.08)"
                  }
                }}
              >
                Graphs
              </Button>
              <Button
                variant={showTable ? "contained" : "outlined"}
                onClick={() => setShowTable(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  px: 3,
                  background: showTable ? "linear-gradient(to right, #1976d2, #2196f3)" : "transparent",
                  color: showTable ? "#fff" : "#1976d2",
                  borderColor: "#1976d2",
                  boxShadow: showTable ? "0px 4px 10px rgba(25, 118, 210, 0.3)" : "none",
                  "&:hover": {
                    background: showTable ? "linear-gradient(to right, #1565c0, #1e88e5)" : "rgba(25, 118, 210, 0.08)"
                  }
                }}
              >
                Table
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.print()}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  px: 3,
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)"
                  }
                }}
              >
                Print
              </Button>
            </Box>

            {/* Right Side Dropdown with Modern Style */}
            <FormControl
              size="small"
              sx={{
                minWidth: 200,
                borderRadius: "12px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                px: 1,
                py: 0.5,
              }}
            >
              <InputLabel
                sx={{
                  fontWeight: "bold",
                  color: "#555",
                  backgroundColor: "#f9f9f9",
                  px: 0.5,
                  borderRadius: 1,
                }}
              >
                Card Background
              </InputLabel>
              <Select
                value={selectedCardBgColor}
                onChange={(e) => setSelectedCardBgColor(e.target.value)}
                label="Card Background"
                sx={{
                  borderRadius: "12px",
                  fontWeight: "medium",
                  backgroundColor: "#fff",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                    }
                  }
                }}
              >
                {bgColorOptions.map((option) => (
                  <MenuItem key={option.hex} value={option.name}>
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        backgroundColor: option.hex,
                        display: "inline-block",
                        borderRadius: "50%",
                        marginRight: 1,
                        border: "1px solid #ccc",
                        boxShadow: "inset 0 0 2px rgba(0,0,0,0.2)"
                      }}
                    />
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {showTable ? (
            <>
              {/* Table View */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Table Theme</InputLabel>
                  <Select
                    value={selectedCardBgColor}
                    onChange={(e) => setSelectedCardBgColor(e.target.value)}
                    label="Table Theme"
                  >
                    {bgColorOptions.map((option) => (
                      <MenuItem key={option.hex} value={option.name}>
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            backgroundColor: option.hex,
                            display: "inline-block",
                            borderRadius: "50%",
                            marginRight: 1,
                            border: "1px solid #ccc",
                          }}
                        />
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filters */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end", // Align all items at the bottom
                  gap: "11px", // Reduced gap for tighter spacing
                  px: 3,
                  py: 2,
                  overflowX: "auto", // Allow horizontal scrolling if needed
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                {/* Start Date */}
                <Box sx={{ minWidth: 180 }}>
                  <Typography variant="subtitle2" mb={1}>
                    Select Start Date:
                  </Typography>
                  <DatePicker
                    label="Start Date"
                    value={selectedStartDate}
                    onChange={handleStartDateChange}
                    inputFormat="MM/dd/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{
                          width: 180,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 1,
                        }}
                      />
                    )}
                  />
                </Box>

                {/* End Date */}
                <Box sx={{ minWidth: 180 }}>
                  <Typography variant="subtitle2" mb={1}>
                    Select End Date:
                  </Typography>
                  <DatePicker
                    label="End Date"
                    value={selectedEndDate}
                    onChange={handleEndDateChange}
                    inputFormat="MM/dd/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{
                          width: 180,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 1,
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Batch Dropdown */}
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" mb={1}>
                    Select Batch:
                  </Typography>
                  <FormControl size="small" sx={{ width: 200 }}>
                    <InputLabel>Select Batch</InputLabel>
                    <Select
                      multiple
                      value={selectedBatchName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedBatchName(value.includes("") ? [] : value);
                      }}
                      renderValue={(selected) => selected.join(", ")}
                      sx={{ backgroundColor: "#f8f9fa", borderRadius: 1 }}
                    >
                      <MenuItem value="">All Batches</MenuItem>
                      {batchNames.map((batch) => (
                        <MenuItem key={batch} value={batch}>
                          {selectedBatchName.includes(batch) ? "✔ " : ""}{" "}
                          {batch}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Product Dropdown */}
                <Box sx={{ minWidth: 180 }}>
                  <Typography variant="subtitle2" mb={1}>
                    Select Product:
                  </Typography>
                  <FormControl size="small" sx={{ width: 180 }}>
                    <InputLabel>Select Product</InputLabel>
                    <Select
                      multiple
                      value={selectedProduct}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedProduct(value.includes("") ? [] : value);
                      }}
                      renderValue={(selected) => selected.join(", ")}
                      sx={{ backgroundColor: "#f8f9fa", borderRadius: 1 }}
                    >
                      <MenuItem value="">All Products</MenuItem>
                      {productNames.map((product) => (
                        <MenuItem key={product} value={product}>
                          {selectedProduct.includes(product) ? "✔ " : ""}{" "}
                          {product}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Material Dropdown */}
                <Box sx={{ minWidth: 180 }}>
                  <Typography variant="subtitle2" mb={1}>
                    Select Material:
                  </Typography>
                  <FormControl size="small" sx={{ width: 180 }}>
                    <InputLabel>Material</InputLabel>
                    <Select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      sx={{ backgroundColor: "#f8f9fa", borderRadius: 1 }}
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
                <Box>
                  <Button
                    variant="contained"
                    onClick={() => setViewReport(true)}
                    sx={{
                      height: 40, // Matches the height of other controls
                      backgroundColor: "#1976d2",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                  >
                    View
                  </Button>
                </Box>
              </Box>

              <div>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    "& .MuiButton-root": {
                      borderRadius: "8px",
                    },
                  }}
                  aria-label="table controls"
                >
                  <Button
                    variant="contained"
                    onClick={() => setActiveTable("productBatchSummary")}
                    color={
                      activeTable === "productBatchSummary"
                        ? "primary"
                        : "inherit"
                    }
                  >
                    Product Batch Summary
                  </Button>

                  {/* <Button
                    variant="contained"
                    aria-controls="unique-names-menu"
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, "uniqueNames")}
                    endIcon={<ArrowDropDownIcon />}
                    color={
                      activeTable === "uniqueNames" ? "primary" : "inherit"
                    }
                  >
                    Unique Names
                  </Button> */}

                  <Button
                    variant="contained"
                    onClick={() => setActiveTable("batchMaterialSummary")}
                    color={
                      activeTable === "batchMaterialSummary"
                        ? "primary"
                        : "inherit"
                    }
                  >
                    Batch Material Summary
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTable("batchProductionSummary")}
                    color={
                      activeTable === "batchProductionSummary"
                        ? "primary"
                        : "inherit"
                    }
                  >
                    Batch Production Summary
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => setActiveTable("nfmWeekly")}
                    color={activeTable === "nfmWeekly" ? "primary" : "inherit"}
                  >
                    NFM Weekly
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => setActiveTable("nfmMonthly")}
                    color={activeTable === "nfmMonthly" ? "primary" : "inherit"}
                  >
                    NFM Monthly
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => setActiveTable("dailyReport")}
                    color={activeTable === "dailyReport" ? "primary" : "inherit"}
                  >
                    Daily Report
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => setActiveTable("materialConsumptionReport")}
                    color={activeTable === "materialConsumptionReport" ? "primary" : "inherit"}
                  >
                    Material Consumption Report
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => setActiveTable("detailedReport")}
                    color={activeTable === "detailedReport" ? "primary" : "inherit"}
                  >
                    Detailed Report
                  </Button>



                </Box>

                {/* Unique Names Dropdown Menu */}
                <Menu
                  id="unique-names-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => showTables("uniqueNames")}>
                    Show Unique Product/Batch Names
                  </MenuItem>
                </Menu>

                {/* Batch Summaries Dropdown Menu */}
                <Menu
                  id="batch-summaries-menu"
                  anchorEl={secondAnchorEl}
                  keepMounted
                  open={Boolean(secondAnchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => showTables("batchMaterialSummary")}>
                    Batch Material Summary
                  </MenuItem>
                  <MenuItem
                    onClick={() => showTables("batchProductionSummary")}
                  >
                    Batch Production Summary
                  </MenuItem>
                </Menu>

                {/* NFM Reports Dropdown Menu */}
                <Menu
                  id="nfm-reports-menu"
                  anchorEl={thirdAnchorEl}
                  keepMounted
                  open={Boolean(thirdAnchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => showTables("nfmWeekly")}>
                    NFM Weekly Report
                  </MenuItem>
                  <MenuItem onClick={() => showTables("nfmMonthly")}>
                    NFM Monthly Report
                  </MenuItem>
                </Menu>

                {activeTable === "nfmWeekly" && (
                  <Box sx={{
                    my: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold">Select Week Start Date:</Typography>
                    <input
                      type="date"
                      onChange={(e) => setWeekStartDate(new Date(e.target.value))}
                      style={{ padding: "6px", fontSize: "0.85rem" }}
                    />
                  </Box>
                )}

                {activeTable === "nfmMonthly" && (

                  <Box sx={{
                    my: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Select Month Start Date:
                    </Typography>
                    <input
                      type="date"
                      onChange={(e) => setMonthStartDate(new Date(e.target.value))}
                      style={{ padding: "6px", fontSize: "0.85rem" }}
                    />
                  </Box>

                )}

                {activeTable === "dailyReport" && (

                  <Box sx={{
                    my: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Select Date Start:
                    </Typography>
                    <input
                      type="date"
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      style={{ padding: "6px", fontSize: "0.85rem" }}
                    />
                  </Box>

                )}


                {viewReport && (
                  <TableContainer
                    component={Paper}
                    sx={{
                      maxWidth: "90%",
                      margin: "auto",
                      mt: 4,
                      // color: getTextColorForBackground(selectedCardBgColor),
                    }}
                  >
                    {activeTable === "productBatchSummary" && (
                      <>
                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", padding: 8 }}
                        >
                          Product Batch Summary
                        </Typography>

                        <Table
                          sx={{
                            borderCollapse: "collapse",
                            width: "100%",
                            tableLayout: "fixed",
                          }}
                        >
                          <TableHead
                            sx={{
                              backgroundColor: getHexByName(selectedCardBgColor),
                            }}
                          >
                            <TableRow>
                              {[
                                "Batch Name",
                                "Product Name",
                                "Batch Start",
                                "Batch End",
                                "Batch Quantity",
                                "Material Name",
                                "Material Code",
                                "SetPoint",
                                "Actual Value",
                                "Source Server",
                                "Order ID",
                              ].map((header) => (
                                <TableCell
                                  key={header}
                                  sx={{
                                    border: "1px solid black",
                                    fontWeight: "bold",
                                    color:
                                      getTextColorForBackground(
                                        selectedCardBgColor
                                      ),
                                    padding: "4px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {batchData.map((item, index) => (
                              <TableRow key={index}>
                                {[
                                  item.batchName,
                                  item.productName,
                                  item.batchStart,
                                  item.batchEnd,
                                  item.quantity,
                                  item.materialName,
                                  item.materialCode,
                                  item.setPointFloat?.toFixed(2),
                                  item.actualValueFloat?.toFixed(2),
                                  item.sourceServer,
                                  item.orderId,
                                ].map((value, i) => (
                                  <TableCell
                                    key={i}
                                    sx={{
                                      color: "#000",
                                      backgroundColor: "#fff",
                                      border: "1px solid black",
                                      padding: "4px",
                                      fontSize: "0.75rem",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {value}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}

                    {activeTable === "dailyReport" && (
                      <>
                        <Typography variant="h6" style={{ fontWeight: "bold", padding: 8 }}>
                          Daily Report Summary
                        </Typography>

                        {/* Display the selected period */}
                        {startDate && (
                          <Typography variant="subtitle2" style={{ paddingLeft: 16, marginBottom: 8 }}>
                            Production Period:{" "}
                            {new Date(startDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              weekday: "short",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            07:00 AM -{" "}
                            {new Date(new Date(startDate).setDate(startDate.getDate() + 1)).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              weekday: "short",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            07:00 AM
                          </Typography>
                        )}

                        <Table sx={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
                          <TableHead sx={{ backgroundColor: getHexByName(selectedCardBgColor) }}>
                            <TableRow>
                              {["Product Name", "No Of Batches", "Sum SP", "Sum Act", "Err Kg", "Err %"].map((header) => (
                                <TableCell
                                  key={header}
                                  sx={{
                                    border: "1px solid black",
                                    fontWeight: "bold",
                                    color: getTextColorForBackground(selectedCardBgColor),
                                    padding: "4px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {batchData
                              .filter((item) => {
                                if (!startDate) return true;

                                // Convert the batch start date to a Date object
                                const itemDate = new Date(item.batchStart);
                                const start = new Date(startDate);
                                start.setHours(7, 0, 0, 0); // Set to 7:00 AM on the selected date

                                const end = new Date(start);
                                end.setDate(start.getDate() + 1); // Set the next day at 7:00 AM
                                end.setHours(7, 0, 0, 0);

                                // Check if the item falls between the selected date and the next day at 7:00 AM
                                return itemDate >= start && itemDate < end;
                              })
                              .map((item, index) => {
                                const errPercentageRaw = item.errPercentage?.replace("%", "").trim();
                                const errPercentageNum = Number(errPercentageRaw);
                                const formattedErrPercentage = isNaN(errPercentageNum)
                                  ? "-"
                                  : `${errPercentageNum.toFixed(2)}%`;

                                return (
                                  <TableRow key={index}>
                                    {[
                                      item.productName,
                                      item.batchCount,
                                      isNaN(Number(item.setPointFloat)) ? "-" : Number(item.setPointFloat).toFixed(2),
                                      isNaN(Number(item.actualValueFloat)) ? "-" : Number(item.actualValueFloat).toFixed(2),
                                      isNaN(Number(item.errKg)) ? "-" : Number(item.errKg).toFixed(2),
                                      formattedErrPercentage,
                                    ].map((value, i) => {
                                      let color = "#000";
                                      if (i === 5 && value !== "-") {
                                        color = errPercentageNum < 0 ? "red" : "green";
                                      }

                                      return (
                                        <TableCell
                                          key={i}
                                          sx={{
                                            color,
                                            backgroundColor: "#fff",
                                            border: "1px solid black",
                                            padding: "4px",
                                            fontSize: "0.75rem",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontWeight: i === 5 ? "bold" : "normal",
                                          }}
                                        >
                                          {value}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </>
                    )}




                    {/* {activeTable === "uniqueNames" && (
                      <>
                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", p: 2 }}
                        >
                          Unique Product Names
                        </Typography>

                        <Table
                          sx={{
                            borderCollapse: "collapse",
                            width: "100%",
                            backgroundColor: getHexByName(selectedCardBgColor),
                          }}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  border: "1px solid black",
                                  fontWeight: "bold",
                                  color:
                                    getTextColorForBackground(
                                      selectedCardBgColor
                                    ),
                                }}
                              >
                                Product Name
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {batchData
                              .filter(
                                (value, index, self) =>
                                  index ===
                                  self.findIndex(
                                    (t) => t.productName === value.productName
                                  )
                              )
                              .map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell
                                    sx={{
                                      border: "1px solid black",
                                      backgroundColor: "#ffffff",
                                    }}
                                  >
                                    {item.productName}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>

                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", p: 2 }}
                        >
                          Unique Batch Names
                        </Typography>

                        <Table sx={{ borderCollapse: "collapse", width: "100%" }}>
                          <TableHead
                            sx={{
                              backgroundColor: getHexByName(selectedCardBgColor),
                            }}
                          >
                            <TableRow>
                              <TableCell
                                sx={{
                                  border: "1px solid black",
                                  fontWeight: "bold",
                                  color:
                                    getTextColorForBackground(
                                      selectedCardBgColor
                                    ),
                                }}
                              >
                                Batch Name
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {batchData
                              .filter(
                                (value, index, self) =>
                                  index ===
                                  self.findIndex(
                                    (t) => t.batchName === value.batchName
                                  )
                              )
                              .map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell
                                    sx={{
                                      border: "1px solid black",
                                      backgroundColor: "#ffffff",
                                    }}
                                  >
                                    {item.batchName}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
 */}
                    {activeTable === "batchMaterialSummary" && batchData.length > 0 && (
                      <div className="batch-container">
                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", padding: 16 }}
                        >
                          Batch Material Summary
                        </Typography>
                        <Table
                          sx={{
                            borderCollapse: "collapse",
                            width: "100%",
                            mt: 2,
                          }}
                        >
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: "#e3eafc",
                                color: "#1a237e",
                              }}
                            >
                              <TableCell
                                sx={{
                                  border: "1px solid #bdbdbd",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  fontSize: "1rem",
                                }}
                              >
                                Batch
                              </TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Material Name</TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Code</TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Set Point</TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Actual</TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Err Kg</TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Err %</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {batchData.map((item, index) => (
                              <TableRow key={index}>
                                {index === 0 && (
                                  <TableCell
                                    rowSpan={batchData.length}
                                    sx={{
                                      border: "1px solid #bdbdbd",
                                      verticalAlign: "top",
                                      minWidth: 220,
                                      backgroundColor: "#fff",
                                      fontSize: "1rem",
                                      padding: "12px 8px",
                                    }}
                                  >
                                    <div>
                                      <span style={{ fontWeight: 600 }}>
                                        Batch : {item.batchName}
                                      </span>
                                      <br />
                                      <span style={{ fontWeight: 600 }}>
                                        Product : {item.productName}
                                      </span>
                                      <br />
                                      <span>
                                        Started: <b>{item.batchStart}</b>
                                      </span>
                                      <br />
                                      <span>
                                        Ended: <b>{item.batchEnd}</b>
                                      </span>
                                      <br />
                                      <span>
                                        Quantity: <b>{item.quantity}</b>
                                      </span>
                                    </div>
                                  </TableCell>
                                )}
                                <TableCell sx={{ border: "1px solid #bdbdbd" }}>{item.materialName}</TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{item.materialCode}</TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{item.setPointFloat?.toFixed(2)}</TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{item.actualValueFloat?.toFixed(2)}</TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", textAlign: "center" }}>
                                  {(item.actualValueFloat - item.setPointFloat)?.toFixed(2)}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #bdbdbd",
                                    textAlign: "center",
                                    color:
                                      ((item.actualValueFloat - item.setPointFloat) / item.setPointFloat) * 100 > 3
                                        ? "#d32f2f"
                                        : ((item.actualValueFloat - item.setPointFloat) / item.setPointFloat) * 100 > 1
                                          ? "#388e3c"
                                          : "#333",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {(
                                    ((item.actualValueFloat - item.setPointFloat) / item.setPointFloat) *
                                    100
                                  )?.toFixed(2)}
                                  %
                                </TableCell>
                              </TableRow>
                            ))}
                            {/* Total Row */}
                            <TableRow sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                              <TableCell sx={{ border: "1px solid #bdbdbd" }}><strong>Total</strong></TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd" }}></TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd" }}></TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd" }}>
                                {batchData.reduce((sum, item) => sum + (item.setPointFloat || 0), 0).toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd" }}>
                                {batchData.reduce((sum, item) => sum + (item.actualValueFloat || 0), 0).toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd" }}>
                                {batchData
                                  .reduce((sum, item) => sum + (item.actualValueFloat - item.setPointFloat), 0)
                                  .toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ border: "1px solid #bdbdbd" }}>
                                {(
                                  (batchData.reduce((sum, item) => sum + (item.actualValueFloat - item.setPointFloat), 0) /
                                    batchData.reduce((sum, item) => sum + (item.setPointFloat || 0), 0)) *
                                  100
                                ).toFixed(2)}
                                %
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    {activeTable === "batchProductionSummary" && (
                      <>
                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", padding: 16 }}
                        >
                          Batch Production Summary
                        </Typography>
                        <Table
                          sx={{ borderCollapse: "collapse", width: "100%" }}
                        >
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor:
                                  getHexByName(selectedCardBgColor),
                                color:
                                  getTextColorForBackground(
                                    selectedCardBgColor
                                  ),
                              }}
                            >
                              {[
                                "Production Name",
                                "No of Batches",
                                "Sum SP",
                                "Sum Act",
                                "Err Kg",
                                "Err %",
                              ].map((header) => (
                                <TableCell
                                  key={header}
                                  sx={{
                                    border: "1px solid black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {batchData.map((item, index) => (
                              <TableRow key={index}>
                                {[
                                  item.batchName,
                                  item.quantity,
                                  isNaN(Number(item.setPointFloat))
                                    ? "-"
                                    : Number(item.setPointFloat).toFixed(2),
                                  isNaN(Number(item.actualValueFloat))
                                    ? "-"
                                    : Number(item.actualValueFloat).toFixed(2),
                                  isNaN(Number(item.errKg))
                                    ? "-"
                                    : Number(item.errKg).toFixed(2),
                                  (() => {
                                    const raw = item.errPercentage
                                      ?.replace("%", "")
                                      .trim();
                                    const num = Number(raw);
                                    if (isNaN(num)) return "-";
                                    return `${num.toFixed(2)}%`;
                                  })(),
                                ].map((value, i) => {
                                  let cellStyle = {
                                    fontWeight: "normal",
                                    color: "#000",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid black",
                                    padding: "4px",
                                    fontSize: "0.75rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  };
                                  // Apply color to error percentage column (index 5)
                                  if (
                                    i === 5 &&
                                    typeof value === "string" &&
                                    value.includes("%")
                                  ) {
                                    const percent = parseFloat(
                                      value.replace("%", "")
                                    );
                                    if (!isNaN(percent)) {
                                      cellStyle.color =
                                        percent < 0 ? "#FF0000" : "#00AA00";
                                      cellStyle.fontWeight = "bold"; // Make percentages bold
                                    }
                                  }
                                  return (
                                    <TableCell key={i} sx={cellStyle}>
                                      {value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}

                    {activeTable === "nfmWeekly" && (
                      <>
                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", padding: 16 }}
                        >
                          NFM ORDER REPORT WEEKLY
                        </Typography>

                        {weekStartDate && (
                          <Typography variant="subtitle2" style={{ paddingLeft: 16, marginBottom: 8 }}>
                            Production Period :{" "}
                            {new Date(weekStartDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              weekday: "short",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            07:00 AM -{" "}
                            {new Date(new Date(weekStartDate).setDate(new Date(weekStartDate).getDate() + 7)).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              weekday: "short",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            07:00 AM
                          </Typography>
                        )}


                        <Table sx={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: getHexByName(selectedCardBgColor),
                              }}
                            >
                              {[
                                "Product Name",
                                "No",
                                "Set Point",
                                "Actual",
                                "Err Kg",
                                "Err %",
                              ].map((header) => (
                                <TableCell
                                  key={header}
                                  sx={{
                                    border: "1px solid black",
                                    fontWeight: "bold",
                                    color: getTextColorForBackground(selectedCardBgColor),
                                    padding: "4px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {batchData
                              .filter(item => {
                                if (!weekStartDate) return true;

                                const itemDate = new Date(item.batchStart);
                                const start = new Date(weekStartDate);
                                start.setHours(7, 0, 0, 0); // Start from 7:00 AM of selected date

                                const end = new Date(start);
                                end.setDate(end.getDate() + 7); // 7 days later at 7:00 AM
                                end.setHours(7, 0, 0, 0);

                                return itemDate >= start && itemDate < end;
                              })

                              .map((item, index) => {

                                const errPercentRaw = item.errPercentage?.replace('%', '').trim();
                                const errPercentValue = Number(errPercentRaw);
                                const formattedErrPercent = isNaN(errPercentValue)
                                  ? "-"
                                  : `${errPercentValue.toFixed(2)}%`;

                                const rowValues = [
                                  item.productName,
                                  item.batchCount,
                                  isNaN(Number(item.setPointFloat)) ? "-" : Number(item.setPointFloat).toFixed(2),
                                  isNaN(Number(item.actualValueFloat)) ? "-" : Number(item.actualValueFloat).toFixed(2),
                                  isNaN(Number(item.errKg)) ? "-" : Number(item.errKg).toFixed(2),
                                  formattedErrPercent,
                                ];

                                return (
                                  <TableRow key={index}>
                                    {rowValues.map((value, i) => {
                                      let cellStyle = {
                                        fontWeight: i === 5 ? "bold" : "normal",
                                        color: "#000",
                                      };

                                      if (i === 5 && typeof value === "string" && value.includes("%")) {
                                        const numeric = parseFloat(value.replace("%", ""));
                                        if (!isNaN(numeric)) {
                                          cellStyle.color = numeric < 0 ? "red" : "green";
                                        }
                                      }

                                      return (
                                        <TableCell
                                          key={i}
                                          sx={{
                                            ...cellStyle,
                                            backgroundColor: "#fff",
                                            border: "1px solid black",
                                            padding: "4px",
                                            fontSize: "0.75rem",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {value}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })}
                          </TableBody>

                        </Table>
                      </>
                    )}


                    {activeTable === "nfmMonthly" && (
                      <>
                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", padding: 16 }}
                        >
                          NFM ORDER REPORT Monthly
                        </Typography>



                        {monthStartDate && (
                          <Typography variant="subtitle2" style={{ paddingLeft: 16, marginBottom: 8 }}>
                            Production Period :{" "}
                            {new Date(monthStartDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              weekday: "short",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            07:00 AM -{" "}
                            {new Date(new Date(monthStartDate).setMonth(new Date(monthStartDate).getMonth() + 1)).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              weekday: "short",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            07:00 AM
                          </Typography>
                        )}


                        <Table
                          sx={{
                            borderCollapse: "collapse",
                            width: "100%",
                            marginTop: 2,
                            tableLayout: "fixed"
                          }}
                        >
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: getHexByName(selectedCardBgColor),
                              }}
                            >
                              {[
                                "Product Name",
                                "No Of Batches",
                                "Sum SP",
                                "Sum Act",
                                "Err Kg",
                                "Err %",
                              ].map((header) => (
                                <TableCell
                                  key={header}
                                  sx={{
                                    border: "1px solid black",
                                    fontWeight: "bold",
                                    color: getTextColorForBackground(selectedCardBgColor),
                                    padding: "4px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {batchData
                              .filter((item) => {
                                if (!monthStartDate) return true;

                                const itemDate = new Date(item.batchStart);
                                const start = new Date(monthStartDate);
                                start.setHours(7, 0, 0, 0); // Start from 7:00 AM of selected date

                                const end = new Date(start);
                                end.setMonth(end.getMonth() + 1); // 1 month later at 7:00 AM
                                end.setHours(7, 0, 0, 0);

                                return itemDate >= start && itemDate < end;
                              })
                              .map((item, index) => {
                                const errPercentage = item.errPercentage?.replace("%", "").trim();
                                const numericErr = Number(errPercentage);
                                const formattedErrPercent = isNaN(numericErr)
                                  ? "-"
                                  : `${numericErr.toFixed(2)}%`;

                                return (
                                  <TableRow key={index}>
                                    {[
                                      item.productName,
                                      item.batchCount,
                                      isNaN(Number(item.setPointFloat))
                                        ? "-"
                                        : Number(item.setPointFloat).toFixed(2),
                                      isNaN(Number(item.actualValueFloat))
                                        ? "-"
                                        : Number(item.actualValueFloat).toFixed(2),
                                      isNaN(Number(item.errKg))
                                        ? "-"
                                        : Number(item.errKg).toFixed(2),
                                      formattedErrPercent,
                                    ].map((value, i) => {
                                      let cellStyle = {
                                        fontWeight: i === 5 ? "bold" : "normal",
                                        color: "#000", // default color
                                      };

                                      if (i === 5 && typeof value === "string" && value.includes("%")) {
                                        const numeric = parseFloat(value.replace("%", ""));
                                        if (!isNaN(numeric)) {
                                          cellStyle.color = `${numeric < 0 ? "red" : "green"} !important`;
                                        }
                                      }

                                      return (
                                        <TableCell
                                          key={i}
                                          sx={{
                                            ...cellStyle,
                                            backgroundColor: "#fff",
                                            border: "1px solid black",
                                            padding: "4px",
                                            fontSize: "0.75rem",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {value}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>

                                );
                              })}
                          </TableBody>
                        </Table>
                      </>
                    )}

                    {activeTable === "materialConsumptionReport" && (
                      <>
                        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", padding: 8 }}
                        >
                          Material Consumption Report Summary
                        </Typography>

                        <Table
                          sx={{
                            borderCollapse: "collapse",
                            width: "100%",
                            tableLayout: "fixed",
                          }}
                        >
                          <TableHead
                            sx={{
                              backgroundColor: getHexByName(selectedCardBgColor),
                            }}
                          >
                            <TableRow>
                              {[
                                "Material Name",
                                "Code",
                                "Planned KG",
                                "Actual KG",
                                "Difference %",
                              ].map((header) => (
                                <TableCell
                                  key={header}
                                  sx={{
                                    border: "1px solid black",
                                    fontWeight: "bold",
                                    color: getTextColorForBackground(selectedCardBgColor),
                                    padding: "4px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {batchData.map((item, index) => (
                              <TableRow key={index}>
                                {[
                                  item.materialName,
                                  item.materialCode,
                                  isNaN(Number(item.totalSetPoint)) ? "-" : Number(item.totalSetPoint).toFixed(2),
                                  isNaN(Number(item.totalActual)) ? "-" : Number(item.totalActual).toFixed(2),
                                  isNaN(Number(item.totalSetPoint)) || item.totalSetPoint === 0
                                    ? "-"
                                    : (() => {
                                      const diffPercentage = ((item.totalActual - item.totalSetPoint) / item.totalSetPoint) * 100;
                                      const formattedDiffPercentage = diffPercentage.toFixed(2) + "%";

                                      // Set the color based on whether the value is positive or negative
                                      const cellStyle = diffPercentage >= 0 ? { color: 'green' } : { color: 'red' };

                                      return (
                                        <span style={cellStyle}>{formattedDiffPercentage}</span>
                                      );
                                    })(),
                                ].map((value, i) => (
                                  <TableCell
                                    key={i}
                                    sx={{
                                      color: "#000",
                                      backgroundColor: "#fff",
                                      border: "1px solid black",
                                      padding: "4px",
                                      fontSize: "0.75rem",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      fontWeight: i === 4 ? "bold" : "normal",
                                    }}
                                  >
                                    {value}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}

                    {activeTable === "detailedReport" && (

                      <>
                        {/*        <Typography
                          variant="h6"
                          style={{ fontWeight: "bold", padding: 8 }}
                        >
                          Daily Report Summary
                        </Typography>

                        <Table
                          sx={{
                            borderCollapse: "collapse",
                            width: "100%",
                            tableLayout: "fixed",
                          }}
                        >
                          <TableHead
                            sx={{
                              backgroundColor: getHexByName(selectedCardBgColor),
                            }}
                          >
                            <TableRow>
                              {[
                                "Batch",
                                "Material Name",
                                "Code",
                                "Set Point",
                                "Actual",
                                "Error (Kg)",
                                "Error (%)",
                              ].map((header) => (
                                <TableCell
                                  key={header}
                                  sx={{
                                    border: "1px solid black",
                                    fontWeight: "bold",
                                    color: getTextColorForBackground(selectedCardBgColor),
                                    padding: "4px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {header}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {Object.entries(
                              batchData.reduce((acc, item) => {
                                const key = `${item.batchName?.trim()}___${item.productName?.trim()}`;
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(item);
                                return acc;
                              }, {})
                            ).map(([key, items], groupIndex) => {
                              const [batchName, productName] = key.split("___");

                              const totalSetPoint = items.reduce((sum, i) => sum + (parseFloat(i.setPointFloat) || 0), 0).toFixed(2);
                              const totalActual = items.reduce((sum, i) => sum + (parseFloat(i.actualValueFloat) || 0), 0).toFixed(2);
                              const totalErrKg = items.reduce((sum, i) => sum + (parseFloat(i.errKg) || 0), 0).toFixed(2);
                              const totalErrPercentage = (
                                items.reduce((sum, i) => {
                                  const val = parseFloat(i.errPercentage?.replace("%", ""));
                                  return sum + (isNaN(val) ? 0 : val);
                                }, 0) / items.length
                              ).toFixed(2);

                              return (
                                <React.Fragment key={groupIndex}>
                                  {items.map((item, idx) => (
                                    <TableRow key={idx}>
                                      {/* Repeat batch information for every material */}
                        {/* <TableCell
                                        sx={{
                                          border: "1px solid black",
                                          fontSize: "0.75rem",
                                          verticalAlign: "top",
                                          whiteSpace: "normal",
                                          fontWeight: "bold",
                                          padding: "6px",
                                        }}
                                      >
                                        Batch: <b>{item.batchName}</b><br />
                                        Product: <b>{item.productName}</b><br />
                                        Started: <b>{item.startedTime || "-"}</b><br />
                                        Ended: <b>{item.endedTime || "-"}</b><br />
                                        Quantity: <b>{item.quantity || "-"}</b>
                                      </TableCell>
                                      <TableCell sx={{ border: "1px solid black", fontSize: "0.75rem", padding: "4px" }}>{item.materialName || "-"}</TableCell>
                                      <TableCell sx={{ border: "1px solid black", fontSize: "0.75rem", padding: "4px" }}>{item.materialCode || "-"}</TableCell>
                                      <TableCell sx={{ border: "1px solid black", fontSize: "0.75rem", padding: "4px" }}>{parseFloat(item.setPointFloat || 0).toFixed(2)}</TableCell>
                                      <TableCell sx={{ border: "1px solid black", fontSize: "0.75rem", padding: "4px" }}>{parseFloat(item.actualValueFloat || 0).toFixed(2)}</TableCell>
                                      <TableCell sx={{ border: "1px solid black", fontSize: "0.75rem", padding: "4px" }}>{parseFloat(item.errKg || 0).toFixed(2)}</TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid black",
                                          fontSize: "0.75rem",
                                          padding: "4px",
                                          color: parseFloat(item.errPercentage) < 0 ? "red" : "green",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item.errPercentage ? `${parseFloat(item.errPercentage).toFixed(2)}%` : "-"}
                                      </TableCell>
                                    </TableRow> */}
                        {/* ))} */}
                        {/* Total row */}
                        {/* <TableRow>
                                    <TableCell colSpan={2} sx={{ fontWeight: "bold", fontSize: "0.75rem", padding: "4px", background: "#f0f0f0", border: "1px solid black" }}>Total</TableCell>
                                    {[totalSetPoint, totalActual, totalErrKg, `${totalErrPercentage}%`].map((val, idx) => (
                                      <TableCell
                                        key={idx}
                                        sx={{
                                          fontWeight: "bold",
                                          fontSize: "0.75rem",
                                          padding: "4px",
                                          background: "#f0f0f0",
                                          border: "1px solid black",
                                          color: idx === 3 && parseFloat(val) < 0 ? "red" : "#000"
                                        }}
                                      >
                                        {val}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </React.Fragment>
                              );
                            })}
                          </TableBody>


                        </Table> */}
                        {/* */}


                        {/* added batch material summary */}
                        <div className="batch-container">
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold", padding: 16 }}
                          >
                            Detailed Report Summary
                          </Typography>
                          <Table
                            sx={{
                              borderCollapse: "collapse",
                              width: "100%",
                              mt: 2,
                            }}
                          >
                            <TableHead>
                              <TableRow
                                sx={{
                                  backgroundColor: "#e3eafc",
                                  color: "#1a237e",
                                }}
                              >
                                <TableCell
                                  sx={{
                                    border: "1px solid #bdbdbd",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    fontSize: "1rem",
                                  }}
                                >
                                  Batch
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Material Name</TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Code</TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Set Point</TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Actual</TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Err Kg</TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd", fontWeight: "bold", textAlign: "center" }}>Err %</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {batchData.map((item, index) => (
                                <TableRow key={index}>
                                  {index === 0 && (
                                    <TableCell
                                      rowSpan={batchData.length}
                                      sx={{
                                        border: "1px solid #bdbdbd",
                                        verticalAlign: "top",
                                        minWidth: 220,
                                        backgroundColor: "#fff",
                                        fontSize: "1rem",
                                        padding: "12px 8px",
                                      }}
                                    >
                                      <div>
                                        <span style={{ fontWeight: 600 }}>
                                          Batch : {item.batchName}
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: 600 }}>
                                          Product : {item.productName}
                                        </span>
                                        <br />
                                        <span>
                                          Started: <b>{item.batchStart}</b>
                                        </span>
                                        <br />
                                        <span>
                                          Ended: <b>{item.batchEnd}</b>
                                        </span>
                                        <br />
                                        <span>
                                          Quantity: <b>{item.quantity}</b>
                                        </span>
                                      </div>
                                    </TableCell>
                                  )}
                                  <TableCell sx={{ border: "1px solid #bdbdbd" }}>{item.materialName}</TableCell>
                                  <TableCell sx={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{item.materialCode}</TableCell>
                                  <TableCell sx={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{item.setPointFloat?.toFixed(2)}</TableCell>
                                  <TableCell sx={{ border: "1px solid #bdbdbd", textAlign: "center" }}>{item.actualValueFloat?.toFixed(2)}</TableCell>
                                  <TableCell sx={{ border: "1px solid #bdbdbd", textAlign: "center" }}>
                                    {(item.actualValueFloat - item.setPointFloat)?.toFixed(2)}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      border: "1px solid #bdbdbd",
                                      textAlign: "center",
                                      color:
                                        ((item.actualValueFloat - item.setPointFloat) / item.setPointFloat) * 100 > 3
                                          ? "#d32f2f"
                                          : ((item.actualValueFloat - item.setPointFloat) / item.setPointFloat) * 100 > 1
                                            ? "#388e3c"
                                            : "#333",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {(
                                      ((item.actualValueFloat - item.setPointFloat) / item.setPointFloat) *
                                      100
                                    )?.toFixed(2)}
                                    %
                                  </TableCell>
                                </TableRow>
                              ))}
                              {/* Total Row */}
                              <TableRow sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                                <TableCell sx={{ border: "1px solid #bdbdbd" }}><strong>Total</strong></TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd" }}></TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd" }}></TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd" }}>
                                  {batchData.reduce((sum, item) => sum + (item.setPointFloat || 0), 0).toFixed(2)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd" }}>
                                  {batchData.reduce((sum, item) => sum + (item.actualValueFloat || 0), 0).toFixed(2)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd" }}>
                                  {batchData
                                    .reduce((sum, item) => sum + (item.actualValueFloat - item.setPointFloat), 0)
                                    .toFixed(2)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #bdbdbd" }}>
                                  {(
                                    (batchData.reduce((sum, item) => sum + (item.actualValueFloat - item.setPointFloat), 0) /
                                      batchData.reduce((sum, item) => sum + (item.setPointFloat || 0), 0)) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </>

                    )}
                  </TableContainer>
                )}
              </div>
            </>
          ) : (
            // Graph View
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Date Pickers */}
              {/* Filters Row */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  alignItems: "center",
                  gap: 2,
                  // mb: 3,
                  marginLeft: "-39px",
                  px: 2,
                  py: 2,
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                  overflowX: "auto" // allows horizontal scroll if too narrow
                }}
              >
                {/* Start Date */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Start:</Typography>
                  <DatePicker
                    label="Start Date"
                    value={selectedStartDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ minWidth: 160, backgroundColor: "#f9f9f9", borderRadius: 1 }}
                        size="small"
                      />
                    )}
                    inputFormat="MM/dd/yyyy"
                  />
                </Box>

                {/* End Date */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">End:</Typography>
                  <DatePicker
                    label="End Date"
                    value={selectedEndDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ minWidth: 160, backgroundColor: "#f9f9f9", borderRadius: 1 }}
                        size="small"
                      />
                    )}
                    inputFormat="MM/dd/yyyy"
                  />
                </Box>

                {/* Batch Dropdown */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Batch:</Typography>
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Select Batch</InputLabel>
                    <Select
                      value={selectedBatchName}
                      onChange={handleBatchChange}
                      sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
                    >
                      <MenuItem value="">All Batches</MenuItem>
                      {batchNames.map((batch) => (
                        <MenuItem key={batch} value={batch}>
                          {batch}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Product Dropdown */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Product:</Typography>
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Select Product</InputLabel>
                    <Select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
                    >
                      <MenuItem value="">All Products</MenuItem>
                      {productNames.map((product) => (
                        <MenuItem key={product} value={product}>
                          {product}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Material Dropdown */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Material:</Typography>
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Select Material</InputLabel>
                    <Select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
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

                {/* View Button */}
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    px: 3,
                    background: "linear-gradient(to right, #1976d2, #2196f3)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(to right, #1565c0, #1e88e5)"
                    }
                  }}
                >
                  View
                </Button>

              </Box>




              {/* <div ref={dashboardRef}> */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {/* KPI Cards and Doughnut Chart */}
                  <Grid container spacing={3}>
                    {/* Top Section - KPI Cards (full width) */}

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        {kpiData.map((item, index) => (
                          <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                              sx={{
                                backgroundColor:
                                  getHexByName(selectedCardBgColor),
                                // color: getHexByName(selectedCardColor), // Apply selected text color
                                color:
                                  getTextColorForBackground(
                                    selectedCardBgColor
                                  ),
                                textAlign: "center",
                                height: "140px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                borderRadius: 2,
                                transition: "transform 0.3s ease-in-out",
                                px: 2,
                              }}
                            >
                              {/* Icon - Centered Top */}
                              <Box sx={{ mb: 1 }}>
                                {index === 0 && (
                                  <Diversity2OutlinedIcon
                                    sx={{
                                      fontSize: 36,
                                      color:
                                        getTextColorForBackground(
                                          selectedCardBgColor
                                        ),
                                    }}
                                  />
                                )}
                                {index === 1 && (
                                  <Brightness7OutlinedIcon
                                    sx={{
                                      fontSize: 36,
                                      color:
                                        getTextColorForBackground(
                                          selectedCardBgColor
                                        ),
                                    }}
                                  />
                                )}
                                {index === 2 && (
                                  <ArticleOutlinedIcon
                                    sx={{
                                      fontSize: 36,
                                      color:
                                        getTextColorForBackground(
                                          selectedCardBgColor
                                        ),
                                    }}
                                  />
                                )}
                                {index === 3 && (
                                  <CalendarMonthOutlinedIcon
                                    sx={{
                                      fontSize: 36,
                                      color:
                                        getTextColorForBackground(
                                          selectedCardBgColor
                                        ),
                                    }}
                                  />
                                )}
                              </Box>

                              {/* KPI Text */}
                              <CardContent sx={{ p: 0 }}>
                                <Typography variant="h6" fontWeight="bold">
                                  {item.value}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  {item.title}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    {/* Bottom Section */}
                    <Grid container spacing={2} sx={{ height: "100%" }}>
                      <Grid
                        item
                        container
                        spacing={2}
                        xs={12}
                        sx={{ height: "40%" }}
                      >
                                               {/* Left side - Doughnut chart (4 columns) */}
                                               <Grid item xs={12} md={4} sx={{ height: "100%" }}>
                          <Card
                            sx={{
                              backgroundColor: "#fff",
                              color: "#000",
                              height: "300px",
                            }}
                          >
                            <CardContent
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ textAlign: "center" }}
                              >
                                Recent Month
                              </Typography>
                              <Box sx={{ flex: 1 }}>
                                {donutData ? (
                                  <Doughnut
                                  data={donutData}
                                  plugins={[centerTextPlugin]}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: "70%", // wider filling
                                    plugins: {
                                      centerText: {}, // no need for text prop, it’s now inside plugin
                                      legend: {
                                        position: "right",
                                        labels: {
                                          boxWidth: 12,
                                          padding: 15,
                                        },
                                      },
                                      tooltip: {
                                        callbacks: {
                                          label: (context) => {
                                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                            const percentage = Math.round((context.parsed / total) * 100);
                                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                                          },
                                        },
                                      },
                                    },
                                  }}
                                />
                                
                                ) : (
                                  <Box
                                    sx={{
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <CircularProgress />
                                  </Box>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>

                        {/* Right side - Line chart (8 columns) */}
                        <Grid item xs={12} md={8} sx={{ height: "100%" }}>
                          <Card sx={{ height: "300px" }}>
                            <CardContent
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="h6" gutterBottom>
                                Performance Trend
                              </Typography>
                              <Box sx={{ flex: 1, width: "93%" }}>
                                {lineData ? (
                                  <LineChart
                                    sx={{
                                      height: "100%",
                                      "& .MuiMarkElement-root circle": {
                                        fill: "currentColor !important",
                                      },
                                    }}
                                    series={[
                                      {
                                        data: lineData.datasets[0].data,
                                        label: "Amount ($)",
                                        showMark: ({ index }) =>
                                          lineData.datasets[0].data[index] > 0,
                                        highlightScope: {
                                          faded: "global",
                                          highlighted: "item",
                                        },
                                        markType: "circle",
                                        color: lineStrokeColor, // keep the line dark
                                        markStyle: ({ index }) => {
                                          const color =
                                            gradientColors[
                                            index % gradientColors.length
                                            ];
                                          return {
                                            stroke: color,
                                            fill: color,
                                            r: 5,
                                          };
                                        },
                                        curve: "linear",
                                      },
                                    ]}
                                    xAxis={[
                                      {
                                        data: lineData.labels,
                                        scaleType: "band",
                                        tickLabelStyle: {
                                          angle: 0, // Rotate labels to avoid overlap
                                          textAnchor: "end", // Align nicely
                                        },
                                      },
                                    ]}
                                    yAxis={[
                                      {
                                        scaleType: "linear",
                                        min: 0,
                                        valueFormatter: (value) =>
                                          `$${value.toLocaleString()}`,
                                      },
                                    ]}
                                    margin={{
                                      left: 30,
                                      right: 30,
                                      top: 30,
                                      bottom: 50, // Add more bottom space
                                    }}
                                    slotProps={{
                                      legend: { hidden: true },
                                    }}
                                    grid={{
                                      horizontal: true,
                                      vertical: false,
                                    }}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <CircularProgress />
                                  </Box>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ height: "100%" }}>
                    {/* Row 1 */}
                    <Grid
                      item
                      container
                      spacing={2}
                      xs={12}
                      sx={{ height: "40%" }}
                    >
                      {/* Product Distribution Bar Chart */}
                      <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              Product Distribution
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              {barData ? (
                                <Bar
                                  data={barData}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: {
                                      duration: 1000,
                                      easing: "easeOutQuart",
                                    },
                                    plugins: { legend: { display: false } },
                                  }}
                                />
                              ) : (
                                <Typography>Loading product data...</Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Product Distribution Pie Chart */}
                      <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              By Product
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              {pieData ? (
                                <Pie
                                  data={pieData}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: {
                                      duration: 1000,
                                      easing: "easeOutBack",
                                    },
                                    plugins: {
                                      legend: { position: "right" },
                                      tooltip: {
                                        callbacks: {
                                          label: (context) => {
                                            const total =
                                              context.dataset.data.reduce(
                                                (a, b) => a + b,
                                                0
                                              );
                                            const percentage = Math.round(
                                              (context.parsed / total) * 100
                                            );
                                            return `${context.label}: ${context.parsed} batches (${percentage}%)`;
                                          },
                                        },
                                      },
                                    },
                                  }}
                                />
                              ) : (
                                <Typography>
                                  Loading production data...
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Row 2 */}
                    <Grid
                      item
                      container
                      spacing={2}
                      xs={12}
                      sx={{ height: "30%" }}
                    >
                      {/* Product Distribution Status & Bar Chart */}
                      <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              Product Distribution Status
                            </Typography>
                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                {donutData ? (
                                  <Doughnut
                                    data={donutData}
                                    plugins={[centerTextPlugin]}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      cutout: "70%",
                                      plugins: {
                                        centerText: {
                                          text: `${donutData.datasets[0].data.reduce(
                                            (a, b) => a + b,
                                            0
                                          )}%`,
                                        },
                                        legend: { position: "right" },
                                        tooltip: {
                                          callbacks: {
                                            label: (context) => {
                                              const total =
                                                context.dataset.data.reduce(
                                                  (a, b) => a + b,
                                                  0
                                                );
                                              const percentage = Math.round(
                                                (context.parsed / total) * 100
                                              );
                                              return `${context.label}: ${context.parsed} (${percentage}%)`;
                                            },
                                          },
                                        },
                                      },
                                    }}
                                  />
                                ) : (
                                  <Typography>
                                    Loading order status data...
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Batch Timeline Line Chart */}
                      <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              Batch Timeline
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              {lineData ? (
                                <Line
                                  data={lineData}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: {
                                      duration: 1000,
                                      easing: "easeInOutQuad",
                                    },
                                    elements: {
                                      line: { tension: 0.4 },
                                      point: { radius: 4, hoverRadius: 6 },
                                    },
                                  }}
                                />
                              ) : (
                                <Typography>
                                  Loading timeline data...
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Row 3 */}
                    <Grid
                      item
                      container
                      spacing={2}
                      xs={12}
                      sx={{ height: "30%" }}
                    >
                      {/* Material Tolerance Bar Chart */}
                      <Grid item xs={12} md={4} sx={{ height: "100%" }}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              Materials with Highest Tolerance %
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              {barDataTolerance ? (
                                <Bar
                                  data={barDataTolerance}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: {
                                      duration: 1000,
                                      easing: "easeOutElastic",
                                      delay: (context) =>
                                        context.dataIndex * 100,
                                    },
                                  }}
                                />
                              ) : (
                                <Typography>
                                  Loading tolerance data...
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Production by Weekday Bar Chart */}
                      <Grid item xs={12} md={4} sx={{ height: "100%" }}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              Tasks Started Per Weekday
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              {barDataProduction ? (
                                <Bar
                                  data={barDataProduction}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: {
                                      duration: 1000,
                                      easing: "easeInOutBack",
                                    },
                                  }}
                                />
                              ) : (
                                <Typography>
                                  Loading production data...
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Lot Tracking Bar Chart */}
                      <Grid item xs={12} md={4} sx={{ height: "100%" }}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              Lot Tracking Over Time
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              {barDataLotTracking ? (
                                <Bar
                                  data={barDataLotTracking}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: {
                                      duration: 1000,
                                      easing: "easeOutBounce",
                                    },
                                  }}
                                />
                              ) : (
                                <Typography>
                                  Loading lot tracking data...
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ height: "100%" }}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              Historical Batches by Date
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              {historicalBarData ? (
                                <Bar
                                  data={historicalBarData}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: {
                                      duration: 1000,
                                      easing: "easeInOutSine",
                                    },
                                    plugins: {
                                      tooltip: {
                                        callbacks: {
                                          label: (context) =>
                                            `${context.parsed.y} batches`,
                                        },
                                      },
                                    },
                                  }}
                                />
                              ) : (
                                <Typography>
                                  Loading historical data...
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default Dashboard;