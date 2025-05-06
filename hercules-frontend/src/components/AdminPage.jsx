// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Stack,
//   Avatar
// } from '@mui/material';
// import { UploadFile, Image, AdminPanelSettings } from '@mui/icons-material';
// import { LogoContext } from "../contexts/LogoContext.jsx"; // Adjust path if needed

// const API_BASE = 'http://localhost:5000'; // Flask backend address

// const AdminPage = () => {
//   const [logo, setLogo] = useState(null);
//   const [preview, setPreview] = useState('');
//   const [uploadedLogo, setUploadedLogo] = useState('');
//   const { setLogoUrl } = useContext(LogoContext);

//   // Fetch the uploaded logo when the component mounts
//   useEffect(() => {
//     axios.get(`${API_BASE}/api/logo`)
//       .then((res) => {
//         if (res.data.logoUrl) {
//           const fullUrl = `${API_BASE}${res.data.logoUrl}`;
//           setUploadedLogo(fullUrl);
//           setLogoUrl(fullUrl);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to load current logo:", err);
//       });
//   }, [setLogoUrl]);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setLogo(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   // Handle file upload to the backend
//   const handleUpload = async () => {
//     if (!logo) return;

//     const formData = new FormData();
//     formData.append('logo', logo);

//     try {
//       const res = await axios.post(`${API_BASE}/api/logo`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       if (res.data.logoUrl) {
//         const fullUrl = `${API_BASE}${res.data.logoUrl}`;
//         setUploadedLogo(fullUrl);
//         setLogoUrl(fullUrl); // 👈 Update Topbar immediately
//       }
//       setLogo(null);
//       setPreview('');
//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
//       <Card sx={{ p: 3, boxShadow: 4 }}>
//         <CardContent>
//           <Stack direction="row" spacing={2} alignItems="center" mb={2}>
//             <Avatar>
//               <AdminPanelSettings />
//             </Avatar>
//             <Typography variant="h5" fontWeight={600}>
//               Admin Panel - Upload Logo
//             </Typography>
//           </Stack>

//           {/* File Picker */}
//           <Box mb={2}>
//             <input
//               accept="image/*"
//               id="upload-logo"
//               type="file"
//               onChange={handleFileChange}
//               style={{ display: 'none' }}
//             />
//             <label htmlFor="upload-logo">
//               <Button
//                 variant="contained"
//                 color="primary"
//                 component="span"
//                 startIcon={<Image />}
//               >
//                 Choose File
//               </Button>
//             </label>
//             <Typography variant="body2" sx={{ mt: 1 }}>
//               {logo ? logo.name : 'No file chosen'}
//             </Typography>
//           </Box>

//           {/* Image Preview */}
//           {preview && (
//             <Box mb={2}>
//               <Typography variant="subtitle2">Preview:</Typography>
//               <Box
//                 component="img"
//                 src={preview}
//                 alt="Preview"
//                 sx={{ width: 150, height: 'auto', borderRadius: 1, boxShadow: 2 }}
//               />
//             </Box>
//           )}

//           {/* Upload Button */}
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<UploadFile />}
//             onClick={handleUpload}
//             disabled={!logo}
//             fullWidth
//             sx={{ mb: 3 }}
//           >
//             Upload Logo
//           </Button>

//           {/* Display Current Logo */}
//           <Typography variant="subtitle1" fontWeight={600}>
//             Current Logo:
//           </Typography>
//           {uploadedLogo && (
//             <Box mt={1}>
//               <Box
//                 component="img"
//                 src={uploadedLogo}
//                 alt="Current Logo"
//                 sx={{ width: 150, height: 'auto', borderRadius: 1, boxShadow: 2 }}
//               />
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default AdminPage;








// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Stack,
//   Avatar
// } from '@mui/material';
// import {
//   UploadFile,
//   Image,
//   AdminPanelSettings
// } from '@mui/icons-material';
// import { LogoContext } from "../contexts/LogoContext.jsx"; // Adjust path if needed

// const API_BASE = 'http://localhost:5000'; // Flask backend address

// const AdminPage = () => {
//   const [logo, setLogo] = useState(null);
//   const [preview, setPreview] = useState('');
//   const [uploadedLogo, setUploadedLogo] = useState('');
//   const { setLogoUrl } = useContext(LogoContext);

//   const [smtpForm, setSmtpForm] = useState({
//     host: '',
//     port: '',
//     username: '',
//     password: '',
//     sender: '',
//     recipient: ''
//   });

//   // Fetch the uploaded logo when the component mounts
//   useEffect(() => {
//     axios.get(`${API_BASE}/api/logo`)
//       .then((res) => {
//         if (res.data.logoUrl) {
//           const fullUrl = `${API_BASE}${res.data.logoUrl}`;
//           setUploadedLogo(fullUrl);
//           setLogoUrl(fullUrl);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to load current logo:", err);
//       });
//   }, [setLogoUrl]);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setLogo(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   // Handle logo upload
//   const handleUpload = async () => {
//     if (!logo) return;

//     const formData = new FormData();
//     formData.append('logo', logo);

//     try {
//       const res = await axios.post(`${API_BASE}/api/logo`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       if (res.data.logoUrl) {
//         const fullUrl = `${API_BASE}${res.data.logoUrl}`;
//         setUploadedLogo(fullUrl);
//         setLogoUrl(fullUrl); // 👈 Update Topbar immediately
//       }
//       setLogo(null);
//       setPreview('');
//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };

//   // Handle SMTP form changes
//   const handleSMTPChange = (e) => {
//     const { name, value } = e.target;
//     setSmtpForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const saveSMTPSettings = async () => {
//     try {
//       await axios.post(`${API_BASE}/api/settings/smtp`, smtpForm);
//       alert('SMTP settings saved');
//     } catch (err) {
//       console.error("Failed to save SMTP settings:", err);
//       alert('Failed to save SMTP settings');
//     }
//   };

//   const sendTestEmail = async () => {
//     try {
//       await axios.post(`${API_BASE}/api/settings/send-test-email`);
//       alert('Test email sent');
//     } catch (err) {
//       console.error("Failed to send test email:", err);
//       alert('Failed to send test email');
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
//       <Card sx={{ p: 3, boxShadow: 4 }}>
//         <CardContent>
//           {/* Logo Section */}
//           <Stack direction="row" spacing={2} alignItems="center" mb={2}>
//             <Avatar>
//               <AdminPanelSettings />
//             </Avatar>
//             <Typography variant="h5" fontWeight={600}>
//               Admin Panel - Upload Logo
//             </Typography>
//           </Stack>

//           {/* File Picker */}
//           <Box mb={2}>
//             <input
//               accept="image/*"
//               id="upload-logo"
//               type="file"
//               onChange={handleFileChange}
//               style={{ display: 'none' }}
//             />
//             <label htmlFor="upload-logo">
//               <Button
//                 variant="contained"
//                 color="primary"
//                 component="span"
//                 startIcon={<Image />}
//               >
//                 Choose File
//               </Button>
//             </label>
//             <Typography variant="body2" sx={{ mt: 1 }}>
//               {logo ? logo.name : 'No file chosen'}
//             </Typography>
//           </Box>

//           {/* Image Preview */}
//           {preview && (
//             <Box mb={2}>
//               <Typography variant="subtitle2">Preview:</Typography>
//               <Box
//                 component="img"
//                 src={preview}
//                 alt="Preview"
//                 sx={{ width: 150, height: 'auto', borderRadius: 1, boxShadow: 2 }}
//               />
//             </Box>
//           )}

//           {/* Upload Button */}
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<UploadFile />}
//             onClick={handleUpload}
//             disabled={!logo}
//             fullWidth
//             sx={{ mb: 3 }}
//           >
//             Upload Logo
//           </Button>

//           {/* Display Current Logo */}
//           <Typography variant="subtitle1" fontWeight={600}>
//             Current Logo:
//           </Typography>
//           {uploadedLogo && (
//             <Box mt={1}>
//               <Box
//                 component="img"
//                 src={uploadedLogo}
//                 alt="Current Logo"
//                 sx={{ width: 150, height: 'auto', borderRadius: 1, boxShadow: 2 }}
//               />
//             </Box>
//           )}

//           {/* SMTP Settings */}
//           <Typography variant="h6" fontWeight={600} mt={5}>
//             SMTP Settings
//           </Typography>
//           <Stack spacing={2} mt={2}>
//             {['host', 'port', 'username', 'password', 'sender', 'recipient'].map((field) => (
//               <input
//                 key={field}
//                 type={field === 'password' ? 'password' : 'text'}
//                 name={field}
//                 placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                 value={smtpForm[field]}
//                 onChange={handleSMTPChange}
//                 style={{
//                   padding: '10px',
//                   borderRadius: '4px',
//                   border: '1px solid #ccc',
//                   fontSize: '14px'
//                 }}
//               />
//             ))}

//             <Button
//               variant="outlined"
//               color="primary"
//               onClick={saveSMTPSettings}
//             >
//               Save SMTP Settings
//             </Button>

//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={sendTestEmail}
//             >
//               Send Test Email
//             </Button>
//           </Stack>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default AdminPage;








// src/pages/AdminPage.jsx

// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Stack,
//   Avatar
// } from '@mui/material';
// import { UploadFile, Image, AdminPanelSettings } from '@mui/icons-material';
// import { LogoContext } from "../contexts/LogoContext.jsx";
// import SMTPSettings from '../components/SMTPSettings';

// const API_BASE = 'http://localhost:5000';

// const AdminPage = () => {
//   const [logo, setLogo] = useState(null);
//   const [preview, setPreview] = useState('');
//   const [uploadedLogo, setUploadedLogo] = useState('');
//   const { setLogoUrl } = useContext(LogoContext);

//   useEffect(() => {
//     axios.get(`${API_BASE}/api/logo`)
//       .then((res) => {
//         if (res.data.logoUrl) {
//           const fullUrl = `${API_BASE}${res.data.logoUrl}`;
//           setUploadedLogo(fullUrl);
//           setLogoUrl(fullUrl);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to load current logo:", err);
//       });
//   }, [setLogoUrl]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setLogo(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleUpload = async () => {
//     if (!logo) return;

//     const formData = new FormData();
//     formData.append('logo', logo);

//     try {
//       const res = await axios.post(`${API_BASE}/api/logo`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       if (res.data.logoUrl) {
//         const fullUrl = `${API_BASE}${res.data.logoUrl}`;
//         setUploadedLogo(fullUrl);
//         setLogoUrl(fullUrl);
//       }
//       setLogo(null);
//       setPreview('');
//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
//       <Card sx={{ p: 3, boxShadow: 4, mb: 4 }}>
//         <CardContent>
//           <Stack direction="row" spacing={2} alignItems="center" mb={2}>
//             <Avatar>
//               <AdminPanelSettings />
//             </Avatar>
//             <Typography variant="h5" fontWeight={600}>
//               Admin Panel - Upload Logo
//             </Typography>
//           </Stack>

//           <Box mb={2}>
//             <input
//               accept="image/*"
//               id="upload-logo"
//               type="file"
//               onChange={handleFileChange}
//               style={{ display: 'none' }}
//             />
//             <label htmlFor="upload-logo">
//               <Button
//                 variant="contained"
//                 color="primary"
//                 component="span"
//                 startIcon={<Image />}
//               >
//                 Choose File
//               </Button>
//             </label>
//             <Typography variant="body2" sx={{ mt: 1 }}>
//               {logo ? logo.name : 'No file chosen'}
//             </Typography>
//           </Box>

//           {preview && (
//             <Box mb={2}>
//               <Typography variant="subtitle2">Preview:</Typography>
//               <Box
//                 component="img"
//                 src={preview}
//                 alt="Preview"
//                 sx={{ width: 150, height: 'auto', borderRadius: 1, boxShadow: 2 }}
//               />
//             </Box>
//           )}

//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<UploadFile />}
//             onClick={handleUpload}
//             disabled={!logo}
//             fullWidth
//             sx={{ mb: 3 }}
//           >
//             Upload Logo
//           </Button>

//           <Typography variant="subtitle1" fontWeight={600}>
//             Current Logo:
//           </Typography>
//           {uploadedLogo && (
//             <Box mt={1}>
//               <Box
//                 component="img"
//                 src={uploadedLogo}
//                 alt="Current Logo"
//                 sx={{ width: 150, height: 'auto', borderRadius: 1, boxShadow: 2 }}
//               />
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* SMTP Settings Section */}
//       <SMTPSettings />
//     </Box>
//   );
// };

// export default AdminPage;









import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar
} from '@mui/material';
import { UploadFile, Image, AdminPanelSettings } from '@mui/icons-material';
import { LogoContext } from "../contexts/LogoContext.jsx";
import SMTPSettings from '../components/SMTPSettings';
import ReportScheduler from '../components/ReportScheduler';

const API_BASE = 'http://127.0.0.1:5000';

const AdminPage = () => {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadedLogo, setUploadedLogo] = useState('');
  const { setLogoUrl } = useContext(LogoContext);

  useEffect(() => {
    axios.get(`${API_BASE}/api/logo`)
      .then((res) => {
        if (res.data.logoUrl) {
          const fullUrl = `${API_BASE}${res.data.logoUrl}`;
          setUploadedLogo(fullUrl);
          setLogoUrl(fullUrl);
        }
      })
      .catch((err) => {
        console.error("Failed to load current logo:", err);
      });
  }, [setLogoUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!logo) return;

    const formData = new FormData();
    formData.append('logo', logo);

    try {
      const res = await axios.post(`${API_BASE}/api/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.logoUrl) {
        const fullUrl = `${API_BASE}${res.data.logoUrl}`;
        setUploadedLogo(fullUrl);
        setLogoUrl(fullUrl);
      }
      setLogo(null);
      setPreview('');
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card sx={{ p: 3, boxShadow: 4, mb: 4 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Avatar>
              <AdminPanelSettings />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              Admin Panel - Upload Logo
            </Typography>
          </Stack>

          <Box mb={2}>
            <input
              accept="image/*"
              id="upload-logo"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="upload-logo">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<Image />}
              >
                Choose File
              </Button>
            </label>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {logo ? logo.name : 'No file chosen'}
            </Typography>
          </Box>

          {preview && (
            <Box mb={2}>
              <Typography variant="subtitle2">Preview:</Typography>
              <Box
                component="img"
                src={preview}
                alt="Preview"
                sx={{ width: 150, height: 'auto', borderRadius: 1, boxShadow: 2 }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadFile />}
            onClick={handleUpload}
            disabled={!logo}
            fullWidth
            sx={{ mb: 3 }}
          >
            Upload Logo
          </Button>

          <Typography variant="subtitle1" fontWeight={600}>
            Current Logo:
          </Typography>
          {uploadedLogo && (
            <Box mt={1}>
              <Box
                component="img"
                src={uploadedLogo}
                alt="Current Logo"
                sx={{ width: 150, height: 'auto', borderRadius: 1, boxShadow: 2 }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* SMTP Settings Section */}
      <SMTPSettings />

      {/* Report Scheduler Section */}
      <ReportScheduler />
    </Box>
  );
};

export default AdminPage;
