import React, { useMemo } from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import { 
  FiTrendingUp, 
  FiActivity, 
  FiClock, 
  FiAward 
} from 'react-icons/fi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  RadialBarChart,
  RadialBar,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { useTasks } from '../context/TaskContext';
import GlassCard from '../components/common/GlassCard';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { motion } from 'framer-motion';

const Analytics = () => {
  const { tasks } = useTasks();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Productivity Metrics calculations
  const analyticsData = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Average completion time mock: e.g. 1.8 days
    const avgTime = "1.6 days";
    // Active streaks: e.g. 12 days
    const streak = 12;

    return { total, completed, rate, avgTime, streak };
  }, [tasks]);

  // Recharts: Workload Radar Data
  const radarData = useMemo(() => {
    const categories = ['Work', 'Personal', 'Design', 'Marketing', 'Dev'];
    return categories.map((cat) => {
      const count = tasks.filter((t) => t.category.toLowerCase() === cat.toLowerCase()).length;
      const completed = tasks.filter(
        (t) => t.category.toLowerCase() === cat.toLowerCase() && t.status === 'completed'
      ).length;
      return { 
        subject: cat, 
        Allocated: count * 10, // Scale for nice Radar spacing
        Completed: completed * 10 
      };
    });
  }, [tasks]);

  // Recharts: Completion Velocity (Mock weeks trend)
  const trendsData = [
    { name: 'Week 1', completed: 8, created: 10 },
    { name: 'Week 2', completed: 12, created: 14 },
    { name: 'Week 3', completed: 15, created: 11 },
    { name: 'Week 4', completed: 20, created: 18 },
  ];

  // Recharts: Priority Radial data
  const radialData = useMemo(() => {
    const high = tasks.filter(t => t.priority === 'high').length;
    const med = tasks.filter(t => t.priority === 'medium').length;
    const low = tasks.filter(t => t.priority === 'low').length;
    const total = high + med + low || 1;

    return [
      { name: 'Low Priority', value: Math.round((low / total) * 100), fill: '#3b82f6' },
      { name: 'Medium Priority', value: Math.round((med / total) * 100), fill: '#f59e0b' },
      { name: 'High Priority', value: Math.round((high / total) * 100), fill: '#ef4444' },
    ];
  }, [tasks]);

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
          Workspace Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analyze productivity vectors, completion speed parameters, and priority ratios.
        </Typography>
      </Box>

      {/* Grid of Key Performance Indicators (KPIs) */}
      <Grid container spacing={3}>
        {[
          { label: 'Completion Efficiency', value: `${analyticsData.rate}%`, icon: FiTrendingUp, color: '#6366f1' },
          { label: 'Avg Resolution Speed', value: analyticsData.avgTime, icon: FiClock, color: '#06b6d4' },
          { label: 'Active Productivity Streak', value: `${analyticsData.streak} days`, icon: FiActivity, color: '#10b981' },
          { label: 'Workspace Health Score', value: 'A+', icon: FiAward, color: '#fb923c' }
        ].map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <GlassCard sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
              <Box 
                sx={{ 
                  backgroundColor: `${kpi.color}15`, 
                  borderRadius: '12px', 
                  p: 1.5, 
                  display: 'flex', 
                  color: kpi.color,
                  boxShadow: `0 4px 10px ${kpi.color}10`
                }}
              >
                <kpi.icon size={24} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  {kpi.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.25 }}>
                  {kpi.value}
                </Typography>
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      {/* Row 2: Completion trends & Priority distribution */}
      <Grid container spacing={3}>
        {/* Completion Trends */}
        <Grid item xs={12} md={7}>
          <GlassCard sx={{ height: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Performance Over Time (Weekly)
            </Typography>
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94a3b8'} style={{ fontSize: '0.8rem' }} />
                  <YAxis stroke={isDark ? '#475569' : '#94a3b8'} style={{ fontSize: '0.8rem' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderRadius: '10px', 
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` 
                    }} 
                  />
                  <Area type="monotone" dataKey="completed" name="Completed Tasks" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#completedGradient)" />
                  <Area type="monotone" dataKey="created" name="Assigned backlogs" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>

        {/* Priority Density (Radial Bar) */}
        <Grid item xs={12} md={5}>
          <GlassCard sx={{ height: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Priority Density Ratio
            </Typography>
            <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={260}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="30%" 
                  outerRadius="80%" 
                  barSize={12} 
                  data={radialData}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff', fontSize: '0.65rem', fontWeight: 'bold' }}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '0.75rem' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderRadius: '10px', 
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` 
                    }} 
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Row 3: Radar breakdown & Productivity comparison */}
      <Grid container spacing={3}>
        {/* Workload Radar */}
        <Grid item xs={12} md={6}>
          <GlassCard sx={{ height: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Workload Footprint by Segment
            </Typography>
            <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} />
                  <PolarAngleAxis dataKey="subject" stroke={isDark ? '#cbd5e1' : '#475569'} style={{ fontSize: '0.8rem', fontWeight: 600 }} />
                  <PolarRadiusAxis stroke={isDark ? '#475569' : '#94a3b8'} style={{ fontSize: '0.7rem' }} />
                  <Radar name="Total Assigned" dataKey="Allocated" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                  <Radar name="Completed" dataKey="Completed" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderRadius: '10px', 
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` 
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>

        {/* Productivity Comparison Bar Chart */}
        <Grid item xs={12} md={6}>
          <GlassCard sx={{ height: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Team Completion Performance
            </Typography>
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Alex', completed: 15, target: 12 },
                    { name: 'Sarah', completed: 18, target: 14 },
                    { name: 'Marcus', completed: 11, target: 12 },
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94a3b8'} style={{ fontSize: '0.8rem' }} />
                  <YAxis stroke={isDark ? '#475569' : '#94a3b8'} style={{ fontSize: '0.8rem' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderRadius: '10px', 
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` 
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                  <Bar dataKey="completed" name="Completed Tasks" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Sprint Target" fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
