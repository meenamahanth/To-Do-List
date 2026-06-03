import React, { useMemo, useState } from 'react';
import { Box, Typography, Modal, Button, Divider } from '@mui/material';
import { FiCalendar, FiClock, FiTag, FiCheckSquare } from 'react-icons/fi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTasks } from '../context/TaskContext';
import GlassCard from '../components/common/GlassCard';
import CustomBadge from '../components/common/CustomBadge';
import { motion } from 'framer-motion';

const Calendar = () => {
  const { tasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);

  // Transform Tasks to FullCalendar Events format
  const events = useMemo(() => {
    return tasks.map((task) => {
      // Choose color based on priority
      let color = '#3b82f6'; // default low
      if (task.status === 'completed') {
        color = '#10b981'; // Green for completed
      } else if (task.priority === 'high') {
        color = '#ef4444'; // Red
      } else if (task.priority === 'medium') {
        color = '#f59e0b'; // Yellow
      }

      return {
        id: task.id,
        title: task.title,
        start: task.dueDate,
        allDay: true,
        backgroundColor: color,
        borderColor: color,
        extendedProps: { ...task }
      };
    });
  }, [tasks]);

  const handleEventClick = (info) => {
    setSelectedTask(info.event.extendedProps);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
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
          Calendar Schedule
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track milestones, deadline schedules, and category distributions over time.
        </Typography>
      </Box>

      {/* Calendar Wrapper */}
      <GlassCard sx={{ p: { xs: 1.5, md: 3 } }} hoverable={false}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          height="70vh"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
        />
      </GlassCard>

      {/* Task Info Modal */}
      <Modal
        open={Boolean(selectedTask)}
        onClose={handleCloseModal}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Box sx={{ width: '100%', maxWidth: 460 }}>
          {selectedTask && (
            <GlassCard sx={{ borderLeft: `5px solid ${selectedTask.status === 'completed' ? '#10b981' : selectedTask.priority === 'high' ? '#ef4444' : '#f59e0b'}` }} hoverable={false}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <CustomBadge type="category" value={selectedTask.category} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CustomBadge type="priority" value={selectedTask.priority} />
                  <CustomBadge type="status" value={selectedTask.status} />
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                {selectedTask.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '0.875rem', lineHeight: 1.5 }}>
                {selectedTask.description}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiCalendar style={{ color: '#94a3b8' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Due: {selectedTask.dueDate}
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  <Box 
                    component="img" 
                    src={selectedTask.assignee.avatar} 
                    alt={selectedTask.assignee.name}
                    sx={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {selectedTask.assignee.name}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCloseModal}>
                  Close Info
                </Button>
              </Box>
            </GlassCard>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Calendar;
