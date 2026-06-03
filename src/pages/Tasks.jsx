import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  IconButton, 
  TextField, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControl, 
  InputLabel, 
  Select, 
  LinearProgress, 
  CardActions,
  Checkbox,
  FormControlLabel,
  Divider,
  Drawer
} from '@mui/material';
import { 
  FiGrid, 
  FiList, 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiCheckCircle, 
  FiCalendar,
  FiBriefcase
} from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import GlassCard from '../components/common/GlassCard';
import CustomBadge from '../components/common/CustomBadge';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, toggleSubtask, addSubtask } = useTasks();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Dialog State (Create/Edit)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null for create
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'Work',
    status: 'todo',
    dueDate: '',
    subtaskText: ''
  });

  // Task Details Drawer States
  const [detailTaskId, setDetailTaskId] = useState(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const detailTask = useMemo(() => {
    return tasks.find(t => t.id === detailTaskId);
  }, [tasks, detailTaskId]);

  const handleAddSubtaskSubmit = (e) => {
    e.preventDefault();
    if (newSubtaskTitle.trim() && detailTaskId) {
      addSubtask(detailTaskId, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || task.category.toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  // Open dialog for create
  const handleCreateOpen = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'Work',
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0],
      subtaskText: ''
    });
    setDialogOpen(true);
  };

  // Open dialog for edit
  const handleEditOpen = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      status: task.status,
      dueDate: task.dueDate,
      subtaskText: ''
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      updateTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        status: formData.status,
        dueDate: formData.dueDate
      });
    } else {
      addTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        status: formData.status,
        dueDate: formData.dueDate,
        subtasks: []
      });
    }
    handleDialogClose();
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
      {/* Header and Add Task */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
            My Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal backlog, filter by priorities, and organize workflows.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<FiPlus />}
          onClick={handleCreateOpen}
        >
          Add Task
        </Button>
      </Box>

      {/* Control Panel (Filters & Toggle) */}
      <GlassCard sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }} hoverable={false}>
        {/* Filters Group */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexGrow: 1, alignItems: 'center' }}>
          <TextField
            placeholder="Search tasks..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <FiSearch style={{ marginRight: 8, color: '#94a3b8' }} />,
            }}
            sx={{ width: { xs: '100%', sm: 200 } }}
          />

          <FormControl size="small" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel>Priority</InputLabel>
            <Select value={priorityFilter} label="Priority" onChange={(e) => setPriorityFilter(e.target.value)}>
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel>Category</InputLabel>
            <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
              <MenuItem value="Dev">Dev</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* View Mode Toggle */}
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
          <IconButton 
            color={viewMode === 'grid' ? 'primary' : 'default'} 
            onClick={() => setViewMode('grid')}
            sx={{ backgroundColor: viewMode === 'grid' ? 'action.selected' : 'transparent' }}
          >
            <FiGrid size={18} />
          </IconButton>
          <IconButton 
            color={viewMode === 'list' ? 'primary' : 'default'} 
            onClick={() => setViewMode('list')}
            sx={{ backgroundColor: viewMode === 'list' ? 'action.selected' : 'transparent' }}
          >
            <FiList size={18} />
          </IconButton>
        </Box>
      </GlassCard>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <GlassCard sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }} hoverable={false}>
          <FiBriefcase size={48} style={{ color: '#94a3b8' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>No tasks found</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting your filters or search criteria.</Typography>
        </GlassCard>
      )}

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => {
              const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
              const totalSubtasks = task.subtasks?.length || 0;
              const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

              return (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={task.id}
                  component={motion.div}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard 
                    onClick={() => setDetailTaskId(task.id)}
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Header badges */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <CustomBadge type="category" value={task.category} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <CustomBadge type="priority" value={task.priority} />
                        <CustomBadge type="status" value={task.status} />
                      </Box>
                    </Box>

                    {/* Task Title & Description */}
                    <Box sx={{ flexGrow: 1, mb: 2.5 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                          lineHeight: 1.3
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mt: 1, 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontSize: '0.85rem'
                        }}
                      >
                        {task.description}
                      </Typography>
                    </Box>

                    {/* Subtasks Progress */}
                    {totalSubtasks > 0 && (
                      <Box sx={{ mb: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            Subtasks
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            {completedSubtasks}/{totalSubtasks}
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
                      </Box>
                    )}

                    <Divider sx={{ opacity: 0.5, mb: 1.5 }} />

                    {/* Footer / Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <FiCalendar style={{ color: '#94a3b8' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          {task.dueDate}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          color={task.status === 'completed' ? 'success' : 'default'}
                          onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
                        >
                          <FiCheckCircle size={16} />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditOpen(task); }}>
                          <FiEdit size={16} />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}>
                          <FiTrash2 size={16} />
                        </IconButton>
                      </Box>
                    </Box>
                  </GlassCard>
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>
      ) : (
        /* List View */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <Box
                key={task.id}
                component={motion.div}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard 
                  onClick={() => setDetailTaskId(task.id)}
                  sx={{ p: 2, cursor: 'pointer' }} 
                  hoverable={true}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={0.75} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'center' } }}>
                      <Checkbox 
                        checked={task.status === 'completed'} 
                        onChange={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
                        color="success"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 700, 
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        noWrap 
                        sx={{ fontSize: '0.8rem', mt: 0.25 }}
                      >
                        {task.description}
                      </Typography>
                    </Grid>

                    <Grid item xs={4} sm={1.5} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CustomBadge type="category" value={task.category} />
                    </Grid>

                    <Grid item xs={4} sm={1.5} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CustomBadge type="priority" value={task.priority} />
                    </Grid>

                    <Grid item xs={4} sm={1.5} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CustomBadge type="status" value={task.status} />
                    </Grid>

                    <Grid item xs={12} sm={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', sm: 'center' } }}>
                      <FiCalendar style={{ color: '#94a3b8' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {task.dueDate}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditOpen(task); }}>
                        <FiEdit size={16} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}>
                        <FiTrash2 size={16} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </GlassCard>
              </Box>
            ))}
          </AnimatePresence>
        </Box>
      )}

      {/* Task Creation & Modification Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1.5,
            width: '100%',
            maxWidth: 500,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingTask ? 'Edit Task' : 'Create Task'}
        </DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    label="Priority"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="Work">Work</MenuItem>
                    <MenuItem value="Personal">Personal</MenuItem>
                    <MenuItem value="Design">Design</MenuItem>
                    <MenuItem value="Dev">Dev</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="todo">Todo</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="review">Review</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Due Date"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleDialogClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Task Details Side Drawer (Linear/Notion style peak view) */}
      <Drawer
        anchor="right"
        open={Boolean(detailTaskId)}
        onClose={() => setDetailTaskId(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 450 },
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        {detailTask && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, height: '100%' }}>
            {/* Drawer Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CustomBadge type="category" value={detailTask.category} size="medium" />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CustomBadge type="priority" value={detailTask.priority} size="medium" />
                <CustomBadge type="status" value={detailTask.status} size="medium" />
              </Box>
            </Box>

            <Divider />

            {/* Task Meta and Details */}
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  textDecoration: detailTask.status === 'completed' ? 'line-through' : 'none',
                  color: detailTask.status === 'completed' ? 'text.secondary' : 'text.primary'
                }}
              >
                {detailTask.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {detailTask.description || 'No description provided.'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Task Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={detailTask.status}
                      label="Status"
                      onChange={(e) => updateTask(detailTask.id, { status: e.target.value })}
                    >
                      <MenuItem value="todo">Todo</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="review">Review</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={detailTask.priority}
                      label="Priority"
                      onChange={(e) => updateTask(detailTask.id, { priority: e.target.value })}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Subtasks / Checklists */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Checklist Subtasks
                <Typography variant="caption" color="text.secondary">
                  {detailTask.subtasks?.filter(s => s.completed).length || 0}/{detailTask.subtasks?.length || 0} completed
                </Typography>
              </Typography>

              <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0 }}>
                {detailTask.subtasks?.map((sub) => (
                  <ListItem 
                    key={sub.id} 
                    dense 
                    sx={{ 
                      p: 0,
                      borderRadius: '8px',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={sub.completed} 
                          onChange={() => toggleSubtask(detailTask.id, sub.id)}
                          color="primary"
                          sx={{ py: 0.5 }}
                        />
                      }
                      label={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            textDecoration: sub.completed ? 'line-through' : 'none',
                            color: sub.completed ? 'text.secondary' : 'text.primary',
                            fontWeight: 500
                          }}
                        >
                          {sub.title}
                        </Typography>
                      }
                      sx={{ mx: 0, width: '100%' }}
                    />
                  </ListItem>
                ))}
                {(!detailTask.subtasks || detailTask.subtasks.length === 0) && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mt: 1 }}>
                    No checklist items yet.
                  </Typography>
                )}
              </List>

              {/* Add Subtask Form */}
              <Box component="form" onSubmit={handleAddSubtaskSubmit} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                  placeholder="Add new subtask item..."
                  size="small"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  fullWidth
                />
                <Button type="submit" variant="outlined" sx={{ minWidth: 46, p: 0 }}>
                  <FiPlus size={18} />
                </Button>
              </Box>
            </Box>

            <Divider />

            {/* Drawer Footer / Assignee / Close */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box 
                  component="img" 
                  src={detailTask.assignee.avatar} 
                  alt={detailTask.assignee.name}
                  sx={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)' }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Assignee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{detailTask.assignee.name}</Typography>
                </Box>
              </Box>
              <Button variant="contained" onClick={() => setDetailTaskId(null)}>
                Done
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default Tasks;
