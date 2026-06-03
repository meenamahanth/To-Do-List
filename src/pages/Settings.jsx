import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  FormControlLabel, 
  Switch, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Divider 
} from '@mui/material';
import { 
  FiSettings, 
  FiBell, 
  FiEye, 
  FiGlobe, 
  FiUser, 
  FiMoon, 
  FiSun 
} from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import { useAppTheme } from '../context/ThemeContext';
import GlassCard from '../components/common/GlassCard';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, updateUserProfile } = useTasks();
  const { mode, toggleTheme } = useAppTheme();

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio
  });

  // Preferences States
  const [notifications, setNotifications] = useState({
    emailNotif: true,
    pushNotif: true,
    weeklyDigest: false
  });
  
  const [language, setLanguage] = useState('en');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(profileForm);
  };

  const handleNotifChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
          Workspace Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure profile settings, layout styles, and team notification preferences.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={7}>
          <GlassCard sx={{ height: '100%' }} hoverable={false}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <FiUser size={22} style={{ color: '#6366f1' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Profile Information
              </Typography>
            </Box>
            
            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Job Role"
                    name="role"
                    value={profileForm.role}
                    onChange={handleProfileChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bio Description"
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    multiline
                    rows={4}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button type="submit" variant="contained">
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </GlassCard>
        </Grid>

        {/* Preferences and Customizations */}
        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Theme & Visuals */}
          <GlassCard hoverable={false}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <FiEye size={22} style={{ color: '#06b6d4' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Appearance Preference
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Active Workspace Theme
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Toggle between Light and Dark interface modes.
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                onClick={toggleTheme}
                startIcon={mode === 'dark' ? <FiSun /> : <FiMoon />}
              >
                {mode === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </Button>
            </Box>
          </GlassCard>

          {/* Notifications Toggles */}
          <GlassCard hoverable={false}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <FiBell size={22} style={{ color: '#fb923c' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Notifications
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FormControlLabel
                control={<Switch checked={notifications.emailNotif} onChange={() => handleNotifChange('emailNotif')} color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Email Digests</Typography>
                    <Typography variant="caption" color="text.secondary">Receive weekly task summary digests.</Typography>
                  </Box>
                }
              />
              <Divider sx={{ opacity: 0.5 }} />
              <FormControlLabel
                control={<Switch checked={notifications.pushNotif} onChange={() => handleNotifChange('pushNotif')} color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>System Popups</Typography>
                    <Typography variant="caption" color="text.secondary">Show real-time browser desktop notifications.</Typography>
                  </Box>
                }
              />
            </Box>
          </GlassCard>

          {/* Language Selection */}
          <GlassCard hoverable={false}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <FiGlobe size={22} style={{ color: '#10b981' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                System Localization
              </Typography>
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <MenuItem value="en">English (US)</MenuItem>
                <MenuItem value="es">Español (ES)</MenuItem>
                <MenuItem value="fr">Français (FR)</MenuItem>
                <MenuItem value="de">Deutsch (DE)</MenuItem>
              </Select>
            </FormControl>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
