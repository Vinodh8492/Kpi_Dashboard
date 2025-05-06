// import React, { useState } from 'react';

// export default function SMTPSettings() {
//   const [form, setForm] = useState({
//     host: '', port: '', username: '', password: '', sender: '', recipient: ''
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     await fetch('/api/settings/smtp', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });
//   };

//   const handleTest = async () => {
//     await fetch('/api/settings/send-test-email', { method: 'POST' });
//   };

//   return (
//     <div>
//       <h3>SMTP Settings</h3>
//       {Object.keys(form).map(key => (
//         <input
//           key={key}
//           name={key}
//           placeholder={key}
//           type={key === 'password' ? 'password' : 'text'}
//           value={form[key]}
//           onChange={handleChange}
//         />
//       ))}
//       <button onClick={handleSave}>Save</button>
//       <button onClick={handleTest}>Send Test Email</button>
//     </div>
//   );
// }


// src/components/SMTPSettings.jsx

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Box, Typography, Button, Stack, Divider } from '@mui/material';

// const API_BASE = 'http://localhost:5000';

// export default function SMTPSettings() {
//   const [profiles, setProfiles] = useState({});
//   const [active, setActive] = useState('');
//   const [newProfile, setNewProfile] = useState({
//     name: '',
//     host: '',
//     port: '',
//     username: '',
//     password: '',
//     sender: ''
//   });
//   const [testRecipient, setTestRecipient] = useState('');

//   useEffect(() => {
//     loadProfiles();
//   }, []);

//   const loadProfiles = async () => {
//     const res = await axios.get(`${API_BASE}/api/settings/smtp-profiles`);
//     setProfiles(res.data.profiles || {});
//     setActive(res.data.active || '');
//   };

//   const handleInput = (e) => {
//     const { name, value } = e.target;
//     setNewProfile(prev => ({ ...prev, [name]: value }));
//   };

//   const addProfile = async () => {
//     if (!newProfile.name) return alert('Name is required');
//     await axios.post(`${API_BASE}/api/settings/smtp-profiles`, newProfile);
//     await loadProfiles();
//     setNewProfile({ name: '', host: '', port: '', username: '', password: '', sender: '' });
//   };

//   const activateProfile = async (name) => {
//     await axios.post(`${API_BASE}/api/settings/smtp-profiles/activate`, { name });
//     setActive(name);
//   };

//   const sendTest = async () => {
//     if (!testRecipient) return alert("Enter a recipient email");
//     try {
//       await axios.post(`${API_BASE}/api/settings/send-test-email`, { recipient: testRecipient });
//       alert('Test email sent');
//     } catch (err) {
//       alert('Failed: ' + err.response?.data?.error || err.message);
//     }
//   };

//   return (
//     <Box sx={{ mt: 4 }}>
//       <Typography variant="h5" gutterBottom>SMTP Profiles</Typography>

//       <Box>
//         {Object.keys(profiles).map(name => (
//           <Stack direction="row" spacing={2} alignItems="center" key={name} sx={{ mb: 1 }}>
//             <Typography>{name}</Typography>
//             {active === name ? (
//               <Typography fontWeight={600} color="green">Active</Typography>
//             ) : (
//               <Button onClick={() => activateProfile(name)}>Set Active</Button>
//             )}
//           </Stack>
//         ))}
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       <Typography variant="h6">Add New Profile</Typography>
//       <Stack spacing={1} mt={1}>
//         {['name', 'host', 'port', 'username', 'password', 'sender'].map(field => (
//           <input
//             key={field}
//             name={field}
//             placeholder={field}
//             type={field === 'password' ? 'password' : 'text'}
//             value={newProfile[field]}
//             onChange={handleInput}
//             style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
//           />
//         ))}
//         <Button onClick={addProfile} variant="outlined">Add Profile</Button>
//       </Stack>

//       <Divider sx={{ my: 3 }} />

//       <Typography variant="h6">Send Test Email from Active Profile</Typography>
//       <input
//         placeholder="Recipient Email"
//         value={testRecipient}
//         onChange={e => setTestRecipient(e.target.value)}
//         style={{ padding: '8px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
//       />
//       <Button onClick={sendTest} variant="contained" color="secondary" sx={{ mt: 1 }}>
//         Send Test Email
//       </Button>
//     </Box>
//   );
// }






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, Stack, Divider, TextField,
  Paper, Chip, Grid, InputAdornment
} from '@mui/material';
import { CheckCircle, AlternateEmail, Send, Add } from '@mui/icons-material';

const API_BASE = 'http://localhost:5000';

export default function SMTPSettings() {
  const [profiles, setProfiles] = useState({});
  const [active, setActive] = useState('');
  const [newProfile, setNewProfile] = useState({
    name: '',
    host: '',
    port: '',
    username: '',
    password: '',
    sender: ''
  });
  const [testRecipient, setTestRecipient] = useState('');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const res = await axios.get(`${API_BASE}/api/settings/smtp-profiles`);
    setProfiles(res.data.profiles || {});
    setActive(res.data.active || '');
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({ ...prev, [name]: value }));
  };

  const addProfile = async () => {
    if (!newProfile.name) return alert('Name is required');
    await axios.post(`${API_BASE}/api/settings/smtp-profiles`, newProfile);
    await loadProfiles();
    setNewProfile({ name: '', host: '', port: '', username: '', password: '', sender: '' });
  };

  const activateProfile = async (name) => {
    await axios.post(`${API_BASE}/api/settings/smtp-profiles/activate`, { name });
    setActive(name);
  };

  const sendTest = async () => {
    if (!testRecipient) return alert("Enter a recipient email");
    try {
      await axios.post(`${API_BASE}/api/settings/send-test-email`, { recipient: testRecipient });
      alert('Test email sent');
    } catch (err) {
      alert('Failed: ' + err.response?.data?.error || err.message);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>SMTP Profiles</Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Available Profiles</Typography>
        {Object.keys(profiles).length === 0 ? (
          <Typography color="text.secondary">No profiles added yet.</Typography>
        ) : (
          Object.keys(profiles).map(name => (
            <Stack direction="row" spacing={2} alignItems="center" key={name} sx={{ mb: 1 }}>
              <Typography>{name}</Typography>
              {active === name ? (
                <Chip icon={<CheckCircle />} label="Active" color="success" size="small" />
              ) : (
                <Button variant="outlined" size="small" onClick={() => activateProfile(name)}>
                  Set Active
                </Button>
              )}
            </Stack>
          ))
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Add New Profile</Typography>
        <Grid container spacing={2}>
          {['name', 'host', 'port', 'username', 'password', 'sender'].map(field => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                value={newProfile[field]}
                onChange={handleInput}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              onClick={addProfile}
              variant="contained"
              startIcon={<Add />}
              fullWidth
            >
              Add Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Send Test Email from Active Profile</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Recipient Email"
            value={testRecipient}
            onChange={e => setTestRecipient(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start"><AlternateEmail /></InputAdornment>
            }}
          />
          <Button
            onClick={sendTest}
            variant="contained"
            endIcon={<Send />}
            color="warning"
          >
            Send Test Email
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
