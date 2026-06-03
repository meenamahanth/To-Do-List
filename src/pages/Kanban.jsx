import React, { useMemo, useState } from 'react';
import { Box, Typography, Card, Divider } from '@mui/material';
import { FiPlus, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import CustomBadge from '../components/common/CustomBadge';
import GlassCard from '../components/common/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS = [
  { id: 'todo', title: 'To Do', borderTopColor: '#94a3b8' },
  { id: 'in-progress', title: 'In Progress', borderTopColor: '#3b82f6' },
  { id: 'review', title: 'Review', borderTopColor: '#a78bfa' },
  { id: 'completed', title: 'Completed', borderTopColor: '#10b981' }
];

const Kanban = () => {
  const { tasks, updateTask, addTask } = useTasks();
  const [draggingId, setDraggingId] = useState(null);

  // Group tasks by column
  const tasksByColumn = useMemo(() => {
    const groups = {
      'todo': [],
      'in-progress': [],
      'review': [],
      'completed': []
    };
    tasks.forEach(task => {
      const col = task.status || 'todo';
      if (groups[col]) {
        groups[col].push(task);
      } else {
        groups['todo'].push(task);
      }
    });
    return groups;
  }, [tasks]);

  // Handle Drag Events
  const handleDragStart = (e, taskId) => {
    setDraggingId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggingId;
    if (taskId) {
      updateTask(taskId, { status: targetStatus });
    }
    setDraggingId(null);
  };

  // Add quick task to column
  const handleQuickAdd = (columnId) => {
    addTask({
      title: `New Quick Task (${COLUMNS.find(c => c.id === columnId)?.title})`,
      description: 'Fill in details by editing this task.',
      status: columnId,
      priority: 'medium',
      category: 'Work',
      subtasks: []
    });
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%', overflow: 'hidden' }}
    >
      {/* Page Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
          Kanban Board
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Drag and drop cards between status lists to organize your workflow progression.
        </Typography>
      </Box>

      {/* Kanban Board Grid */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 3, 
          overflowX: 'auto', 
          pb: 2,
          flexGrow: 1,
          alignItems: 'flex-start',
          minHeight: '65vh'
        }}
      >
        {COLUMNS.map((column) => {
          const columnTasks = tasksByColumn[column.id] || [];
          
          return (
            <Box
              key={column.id}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              sx={{
                flex: '1 0 280px',
                maxWidth: 340,
                borderRadius: '16px',
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.35)' : 'rgba(15, 23, 42, 0.02)',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxHeight: '75vh',
                transition: 'background-color 0.2s ease',
              }}
            >
              {/* Column Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: column.borderTopColor }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {column.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      px: 1,
                      py: 0.25,
                      borderRadius: '8px',
                      fontWeight: 600
                    }}
                  >
                    {columnTasks.length}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleQuickAdd(column.id)} size="small" color="primary">
                  <FiPlus size={16} />
                </IconButton>
              </Box>

              <Divider sx={{ opacity: 0.5 }} />

              {/* Tasks List */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2, 
                  overflowY: 'auto',
                  flexGrow: 1,
                  pr: 0.5,
                  minHeight: 120
                }}
              >
                <AnimatePresence mode="popLayout">
                  {columnTasks.map((task) => (
                    <Box
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      sx={{ 
                        cursor: 'grab', 
                        opacity: draggingId === task.id ? 0.35 : 1,
                        transition: 'opacity 0.25s ease'
                      }}
                    >
                      <Box
                        component={motion.div}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      >
                        <GlassCard
                          sx={{
                            p: 2.25,
                            borderLeft: `3px solid ${column.borderTopColor}`,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: (theme) => theme.palette.mode === 'dark'
                                ? '0 6px 20px rgba(0,0,0,0.45)'
                                : '0 6px 20px rgba(99, 102, 241, 0.08)'
                            }
                          }}
                          hoverable={false}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <CustomBadge type="category" value={task.category} size="small" />
                            <CustomBadge type="priority" value={task.priority} size="small" />
                          </Box>

                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 700, 
                              lineHeight: 1.3,
                              color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                              textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                            }}
                          >
                            {task.title}
                          </Typography>

                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                              mt: 0.75, 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.4
                            }}
                          >
                            {task.description}
                          </Typography>

                          <Divider sx={{ my: 1.5, opacity: 0.4 }} />

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <FiCalendar style={{ color: '#94a3b8' }} size={13} />
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                {task.dueDate}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {task.subtasks?.length > 0 && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                </Typography>
                              )}
                              <Box 
                                component="img" 
                                src={task.assignee.avatar} 
                                alt={task.assignee.name}
                                sx={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}
                              />
                            </Box>
                          </Box>
                        </GlassCard>
                      </Box>
                    </Box>
                  ))}
                </AnimatePresence>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Kanban;
