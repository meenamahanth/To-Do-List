import React, { useMemo } from 'react';
import { Box, Typography, Grid, Avatar, Divider } from '@mui/material';
import { 
  FiCheckCircle, 
  FiZap, 
  FiCalendar, 
  FiAward, 
  FiMail, 
  FiClock, 
  FiLayers 
} from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import GlassCard from '../components/common/GlassCard';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, tasks } = useTasks();

  // Tasks statistics calculations
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    
    // Find most common category
    const catCounts = {};
    tasks.forEach(t => {
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });
    
    let favoriteCategory = 'None';
    let maxCount = 0;
    Object.entries(catCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteCategory = cat;
      }
    });

    return { total, completed, pending, favoriteCategory };
  }, [tasks]);

  // Mock Activity Timeline items
  const timelineActivities = [
    { id: 1, title: 'Refactored Context State', desc: 'Resolved rendering latency issues.', date: 'Today, 11:32 AM', icon: FiZap, color: '#8b5cf6' },
    { id: 2, title: 'Completed: Fix Profile Timeline Glitch', desc: 'Added stable key sorting parameters.', date: 'Yesterday, 4:15 PM', icon: FiCheckCircle, color: '#10b981' },
    { id: 3, title: 'Created Task: Design SaaS Landing Page', desc: 'Added subtask trees and Figma layout items.', date: 'June 1, 2026', icon: FiLayers, color: '#06b6d4' },
    { id: 4, title: 'Earned Badge: Workflow Master', desc: 'Completed 10 tasks in a single calendar sprint.', date: 'May 28, 2026', icon: FiAward, color: '#fb923c' }
  ];

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
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your portfolio identity, workspace metrics, and timeline accomplishments.
        </Typography>
      </Box>

      {/* Profile Card and Stats */}
      <Grid container spacing={3}>
        {/* User Card */}
        <Grid item xs={12} md={4}>
          <GlassCard 
            sx={{ 
              p: 0, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center'
            }}
            hoverable={false}
          >
            {/* Banner Background */}
            <Box 
              sx={{ 
                height: 120, 
                width: '100%', 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }} 
            />
            {/* User Photo */}
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                width: 100,
                height: 100,
                mt: -6,
                border: '4px solid',
                borderColor: 'background.paper',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Box sx={{ p: 4, pt: 2, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {user.role}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.6, px: 1 }}>
                {user.bio}
              </Typography>

              <Divider sx={{ my: 1, opacity: 0.5 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
                <FiMail size={16} />
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </Grid>

        {/* Stats and Accomplishments Timeline */}
        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Key Metrics */}
          <Grid container spacing={2}>
            {[
              { label: 'Completed Tasks', value: stats.completed, icon: FiCheckCircle, color: '#10b981' },
              { label: 'Pending Tasks', value: stats.pending, icon: FiClock, color: '#3b82f6' },
              { label: 'Active Streak', value: `${user.activeStreak} days`, icon: FiZap, color: '#f59e0b' },
              { label: 'Main Category', value: stats.favoriteCategory, icon: FiLayers, color: '#8b5cf6' }
            ].map((stat, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <GlassCard sx={{ textAlign: 'center', p: 2.5 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: stat.color, 
                      backgroundColor: `${stat.color}12`,
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      mx: 'auto',
                      mb: 1.5
                    }}
                  >
                    <stat.icon size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mt: 0.5, display: 'block' }}>
                    {stat.label}
                  </Typography>
                </GlassCard>
              </Grid>
            ))}
          </Grid>

          {/* Activity Timeline */}
          <GlassCard sx={{ flexGrow: 1 }} hoverable={false}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Activity Accomplishments
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, position: 'relative', pl: 3.5 }}>
              {/* Timeline Connector Line */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  left: 11, 
                  top: 8, 
                  bottom: 8, 
                  width: '2px', 
                  backgroundColor: 'divider',
                  zIndex: 0
                }} 
              />
              
              {timelineActivities.map((act) => (
                <Box 
                  key={act.id} 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 0.5, 
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {/* Timeline Node Point */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      left: -32, 
                      top: 2, 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: 'background.paper',
                      border: `2px solid ${act.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: act.color,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <act.icon size={11} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {act.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {act.date}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {act.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
