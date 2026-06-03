import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  InputBase, 
  IconButton, 
  Badge, 
  Avatar, 
  Menu, 
  MenuItem, 
  Typography, 
  Divider, 
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  FiSearch, 
  FiBell, 
  FiSun, 
  FiMoon, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import { useAppTheme } from '../../context/ThemeContext';
import { useTasks } from '../../context/TaskContext';
import { motion } from 'framer-motion';

const TopNavbar = () => {
  const { mode, toggleTheme } = useAppTheme();
  const { user, notifications, markAllNotificationsRead, clearNotifications } = useTasks();
  const navigate = useNavigate();

  // Notification menu state
  const [notifAnchor, setNotifAnchor] = useState(null);
  // Profile menu state
  const [profileAnchor, setProfileAnchor] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifOpen = (event) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => {
    setNotifAnchor(null);
    markAllNotificationsRead();
  };

  const handleProfileOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle style={{ color: '#10b981' }} />;
      case 'warning': return <FiAlertCircle style={{ color: '#f59e0b' }} />;
      case 'error': return <FiAlertCircle style={{ color: '#ef4444' }} />;
      default: return <FiInfo style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <Box
      sx={{
        height: 70,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: mode === 'dark' ? 'rgba(7, 10, 19, 0.45)' : 'rgba(248, 250, 252, 0.45)',
        backdropFilter: 'blur(16px)',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Search Input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: '10px',
          px: 2,
          py: 0.75,
          width: { xs: 180, sm: 300 },
          transition: 'all 0.2s ease',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`,
            width: { xs: 220, sm: 340 }
          }
        }}
      >
        <FiSearch style={{ color: mode === 'dark' ? '#94a3b8' : '#64748b' }} size={16} />
        <InputBase
          placeholder="Quick search (Press ⌘K)..."
          sx={{
            fontSize: '0.875rem',
            color: 'text.primary',
            width: '100%',
            fontFamily: 'inherit'
          }}
        />
      </Box>

      {/* Action Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        
        {/* Theme Toggle */}
        <IconButton 
          onClick={toggleTheme} 
          sx={{ color: 'text.secondary' }}
          component={motion.button}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            key={mode}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {mode === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </motion.div>
        </IconButton>

        {/* Notifications */}
        <IconButton 
          onClick={handleNotifOpen} 
          sx={{ color: 'text.secondary' }}
          component={motion.button}
          whileTap={{ scale: 0.9 }}
        >
          <Badge badgeContent={unreadCount} color="error" max={9}>
            <FiBell size={20} />
          </Badge>
        </IconButton>

        {/* Notification Menu Dropdown */}
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={handleNotifClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              width: 320,
              mt: 1.5,
              maxHeight: 400,
              borderRadius: '16px',
              p: 1.5,
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, pb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>
            <Typography 
              variant="caption" 
              color="primary" 
              sx={{ cursor: 'pointer', fontWeight: 600 }}
              onClick={clearNotifications}
            >
              Clear all
            </Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">All caught up!</Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <MenuItem 
                key={notif.id} 
                onClick={handleNotifClose}
                sx={{ 
                  borderRadius: '8px', 
                  mb: 0.5, 
                  py: 1,
                  display: 'flex', 
                  gap: 1.5, 
                  alignItems: 'flex-start',
                  backgroundColor: notif.read ? 'transparent' : 'action.hover'
                }}
              >
                <Box sx={{ mt: 0.25 }}>{getNotifIcon(notif.type)}</Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 600, fontSize: '0.85rem', whiteSpace: 'normal' }}>
                    {notif.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25, fontSize: '0.75rem' }}>
                    {notif.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>

        <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

        {/* User Profile Avatar / Dropdown trigger */}
        <Box 
          onClick={handleProfileOpen}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.25, 
            cursor: 'pointer',
            p: 0.5,
            borderRadius: '10px',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Avatar 
            src={user.avatar} 
            alt={user.name} 
            sx={{ 
              width: 36, 
              height: 36,
              boxShadow: (theme) => `0 2px 8px ${theme.palette.primary.main}30`,
              border: (theme) => `1.5px solid ${theme.palette.primary.main}`
            }} 
          />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
              {user.role}
            </Typography>
          </Box>
        </Box>

        {/* Profile Menu Dropdown */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              width: 220,
              mt: 1.5,
              borderRadius: '16px',
              p: 1,
            }
          }}
        >
          <Box sx={{ p: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          
          <MenuItem onClick={() => { handleProfileClose(); navigate('/profile'); }} sx={{ borderRadius: '8px' }}>
            <ListItemIcon><FiUser size={16} /></ListItemIcon>
            <ListItemText primary="My Profile" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
          
          <MenuItem onClick={() => { handleProfileClose(); navigate('/settings'); }} sx={{ borderRadius: '8px' }}>
            <ListItemIcon><FiSettings size={16} /></ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem onClick={handleProfileClose} sx={{ borderRadius: '8px', color: 'error.main' }}>
            <ListItemIcon><FiLogOut size={16} style={{ color: 'inherit' }} /></ListItemIcon>
            <ListItemText primary="Sign Out" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        </Menu>

      </Box>
    </Box>
  );
};

export default TopNavbar;
