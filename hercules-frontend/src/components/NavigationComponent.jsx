import React from 'react';
import Hercules from '../assets/Hercules.png';
import { Link } from 'react-router-dom'; // Using Link for routing

const NavigationComponent = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',  // Align elements vertically
        position: 'fixed',        // Fixes the sidebar to the left
        top: 0,                   // Sticks it to the top of the page
        left: 15,                  // Sticks it to the left of the page
        height: '100vh',          // Full height of the page
        width: '150px',           // Adjust sidebar width as needed
        background: '#f0f0f0',
        padding: '25px',          // Padding inside the sidebar
        boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)', // Optional: Shadow for better visibility
      }}
    >
      <div style={{ marginBottom: '20px', marginTop:'10px' }}>
        <img src={Hercules} alt="Logo" style={{ height: '40px', width:'150px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
        <Link to="/" style={{ margin: '10px 0', fontSize:'25px', textDecoration: 'none', color: '#000' }}>Home</Link>
        <Link to="/batches" style={{ margin: '10px 0', fontSize:'25px', textDecoration: 'none', color: '#000' }}>Batches</Link>
        <Link to="/services" style={{ margin: '10px 0', fontSize:'25px', textDecoration: 'none', color: '#000' }}>Services</Link>
        <Link to="/contact" style={{ margin: '10px 0', fontSize:'25px', textDecoration: 'none', color: '#000' }}>Contact</Link>
      </div>
    </div>
  );
};

export default NavigationComponent;
