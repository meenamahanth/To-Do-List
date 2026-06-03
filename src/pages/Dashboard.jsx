import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Typography, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Button,
  useTheme
} from '@mui/material';
import { 
  FiBriefcase, 
  FiCheckCircle, 
  FiClock, 
  FiAlertOctagon, 
  FiZap, 
  FiArrowRight, 
  FiInbox,
  FiPlus
} from 'react-icons/fi';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTasks } from '../context/TaskContext';
import GlassCard from '../components/common/GlassCard';
import AnimatedCounter from '../components/common/AnimatedCounter';
import CustomBadge from '../components/common/CustomBadge';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { tasks, addTask } = useTasks();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  // Metrics Calculations
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status !== 'completed').length;
    
    // High Priority Tasks
    const highPriority = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length;

    // Overdue tasks (due date is in the past and status is not completed)
    const todayStr = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(
      (t) => t.dueDate < todayStr && t.status !== 'completed'
    ).length;

    return { total, completed, pending, overdue, highPriority };
  }, [tasks]);

  // Recharts: Productivity Trends (Mock completions over last 7 days)
  const areaChartData = [
    { day: 'Mon', completed: 2, created: 3 },
    { day: 'Tue', completed: 4, created: 2 },
    { day: 'Wed', completed: 3, created: 5 },
    { day: 'Thu', completed: 6, created: 4 },
    { day: 'Fri', completed: 5, created: 3 },
    { day: 'Sat', completed: 2, created: 1 },
    { day: 'Sun', completed: 4, created: 2 },
  ];

  // Recharts: Task Completion by Category
  const barChartData = useMemo(() => {
    const categories = ['Work', 'Personal', 'Design', 'Marketing', 'Dev'];
    return categories.map((cat) => {
      const catTasks = tasks.filter((t) => t.category.toLowerCase() === cat.toLowerCase());
      const completed = catTasks.filter((t) => t.status === 'completed').length;
      const pending = catTasks.filter((t) => t.status !== 'completed').length;
      return { category: cat, Completed: completed, Pending: pending };
    });
  }, [tasks]);

  // Recharts: Category Distribution Data
  const pieChartData = useMemo(() => {
    const categories = ['Work', 'Personal', 'Design', 'Marketing', 'Dev'];
    const data = categories.map((cat) => {
      const count = tasks.filter((t) => t.category.toLowerCase() === cat.toLowerCase()).length;
      return { name: cat, value: count };
    }).filter(item => item.value > 0);

    return data;
  }, [tasks]);

  // Vibrant custom chart colors
  const COLORS = ['#6366f1', '#fb923c', '#f472b6', '#2dd4bf', '#a78bfa'];

  // Recent high-priority/urgent tasks listing
  const urgentTasks = useMemo(() => {
    return tasks
      .filter((t) => t.priority === 'high' && t.status !== 'completed')
      .slice(0, 4);
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
      {/* Welcome Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
            Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep track of your workspace status, efficiency, and task analytics.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<FiPlus />}
          onClick={() => navigate('/tasks')}
        >
          New Task
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3}>
        {[
          { label: 'Total Tasks', value: metrics.total, icon: FiInbox, color: '#6366f1', shadow: 'rgba(99, 102, 241, 0.15)' },
          { label: 'Completed Tasks', value: metrics.completed, icon: FiCheckCircle, color: '#10b981', shadow: 'rgba(16, 185, 129, 0.15)' },
          { label: 'Pending Tasks', value: metrics.pending, icon: FiBriefcase, color: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.15)' },
          { label: 'Overdue Tasks', value: metrics.overdue, icon: FiClock, color: '#ef4444', shadow: 'rgba(239, 68, 68, 0.15)' },
          { label: 'High Priority', value: metrics.highPriority, icon: FiZap, color: '#f59e0b', shadow: 'rgba(245, 158, 11, 0.15)' },
        ].map((card, idx) => (
          <Grid item xs={12} sm={6} md={2.4} key={idx}>
            <GlassCard
              sx={{
                borderLeft: `4px solid ${card.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2.5,
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  <AnimatedCounter value={card.value} />
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  backgroundColor: `${card.color}15`, 
                  borderRadius: '10px', 
                  p: 1.25, 
                  display: 'flex', 
                  color: card.color,
                  boxShadow: `0 4px 10px ${card.shadow}`
                }}
              >
                <card.icon size={22} />
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      {/* Main Charts Area */}
      <Grid container spacing={3}>
        {/* Productivity Trends */}
        <Grid item xs={12} md={8}>
          <GlassCard sx={{ height: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Productivity Trends (7 Days)
            </Typography>
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke={isDark ? '#475569' : '#94a3b8'} style={{ fontSize: '0.8rem' }} />
                  <YAxis stroke={isDark ? '#475569' : '#94a3b8'} style={{ fontSize: '0.8rem' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderRadius: '10px', 
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` 
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="completed" name="Completed Tasks" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                  <Area type="monotone" dataKey="created" name="Newly Created" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>

        {/* Category distribution */}
        <Grid item xs={12} md={4}>
          <GlassCard sx={{ height: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Category Distribution
            </Typography>
            <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderRadius: '10px', 
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` 
                    }} 
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '0.75rem' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Row 3: Category Completion Bar Chart & Urgent Tasks List */}
      <Grid container spacing={3}>
        {/* Task Completion by Category */}
        <Grid item xs={12} md={7}>
          <GlassCard sx={{ height: 360, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Workload Status by Category
            </Typography>
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" stroke={isDark ? '#475569' : '#94a3b8'} style={{ fontSize: '0.8rem' }} />
                  <YAxis stroke={isDark ? '#475569' : '#94a3b8'} style={{ fontSize: '0.8rem' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderRadius: '10px', 
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` 
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                  <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pending" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>

        {/* High Priority / Urgent Tasks */}
        <Grid item xs={12} md={5}>
          <GlassCard sx={{ height: 360, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                High Priority Focus
              </Typography>
              <IconButton onClick={() => navigate('/tasks')} size="small" color="primary">
                <FiArrowRight />
              </IconButton>
            </Box>
            {urgentTasks.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 1.5 }}>
                <FiCheckCircle size={32} style={{ color: '#10b981' }} />
                <Typography variant="body2" color="text.secondary">All high priority tasks completed!</Typography>
              </Box>
            ) : (
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflowY: 'auto' }}>
                {urgentTasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        px: 1, 
                        py: 1,
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                              {task.title}
                            </Typography>
                            <CustomBadge type="priority" value="high" size="small" />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Due: {task.dueDate}
                            </Typography>
                            <CustomBadge type="category" value={task.category} size="small" />
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="middle" component="li" sx={{ opacity: 0.5 }} />
                  </React.Fragment>
                ))}
              </List>
            )}
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
