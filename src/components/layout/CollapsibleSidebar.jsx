import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton, Tooltip, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid, 
  FiCheckSquare, 
  FiColumns, 
  FiCalendar, 
  FiTrendingUp, 
  FiUser, 
  FiSettings, 
  FiChevronLeft, 
  FiChevronRight, 
  FiActivity 
} from 'react-icons/fi';
import { useAppTheme } from '../../context/ThemeContext';

const navigationItems = [
  { path: '/', label: 'Dashboard', icon: FiGrid },
  { path: '/tasks', label: 'My Tasks', icon: FiCheckSquare },
  { path: '/kanban', label: 'Kanban Board', icon: FiColumns },
  { path: '/calendar', label: 'Calendar', icon: FiCalendar },
  { path: '/analytics', label: 'Analytics', icon: FiTrendingUp },
  { path: '/profile', label: 'Profile', icon: FiUser },
  { path: '/settings', label: 'Settings', icon: FiSettings },
];

const CollapsibleSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { mode } = useAppTheme();
  const location = useLocation();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      component={motion.div}
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor: mode === 'dark' ? 'rgba(10, 15, 30, 0.65)' : 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Brand Section */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', height: 70 }}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <Box
              key="logo-expanded"
              component={motion.div}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <Box 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '8px', 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                }}
              >
                <FiActivity size={18} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AetherFlow
              </Typography>
            </Box>
          ) : (
            <Box
              key="logo-collapsed"
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
              }}
            >
              <FiActivity size={20} />
            </Box>
          )}
        </AnimatePresence>

        {!isCollapsed && (
          <IconButton onClick={handleToggle} size="small" sx={{ color: 'text.secondary' }}>
            <FiChevronLeft size={18} />
          </IconButton>
        )}
      </Box>

      {isCollapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          <IconButton onClick={handleToggle} size="small" sx={{ color: 'text.secondary', backgroundColor: 'action.hover' }}>
            <FiChevronRight size={18} />
          </IconButton>
        </Box>
      )}

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      {/* Navigation list */}
      <Box sx={{ flexGrow: 1, px: 1.5, py: 3, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tooltip
              key={item.path}
              title={isCollapsed ? item.label : ''}
              placement="right"
              arrow
            >
              <Box
                component={NavLink}
                to={item.path}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: isCollapsed ? 1.5 : 2,
                  py: 1.5,
                  borderRadius: '12px',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  textDecoration: 'none',
                  position: 'relative',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.925rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
              >
                {/* Active Pill Selector animation */}
                {isActive && (
                  <Box
                    component={motion.div}
                    layoutId="active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: mode === 'dark' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(99, 102, 241, 0.08)',
                      borderLeft: (theme) => `3px solid ${theme.palette.primary.main}`,
                      borderRadius: '12px',
                      zIndex: -1,
                    }}
                  />
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={20} style={{ color: isActive ? 'inherit' : undefined }} />
                </Box>

                {!isCollapsed && (
                  <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                    {item.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* Collapse Footer section */}
      {!isCollapsed && (
        <Box sx={{ p: 2.5, backgroundColor: 'action.hover', mx: 2, mb: 3, borderRadius: '12px' }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
            Pro Status
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700, mt: 0.5 }}>
            Unlimited Workspace
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CollapsibleSidebar;
