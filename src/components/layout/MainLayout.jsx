import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import CollapsibleSidebar from './CollapsibleSidebar';
import TopNavbar from './TopNavbar';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar Navigation */}
      <CollapsibleSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <Box
        component={motion.main}
        animate={{ 
          width: isCollapsed ? 'calc(100vw - 76px)' : 'calc(100vw - 260px)' 
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Top Header */}
        <TopNavbar />

        {/* Page Inner Content with transitions */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2.5, md: 4 }, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
