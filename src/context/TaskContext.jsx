import React, { createContext, useContext, useState, useEffect } from 'react';
import initialTasks from '../mock/mockTasks.json';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('aetherflow_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aetherflow_user');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Carter',
      email: 'alex.carter@aetherflow.io',
      role: 'Lead UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&auto=format&q=80',
      bio: 'SaaS architect & visual designer crafting elegant, interactive frontend interfaces and design systems.',
      activeStreak: 12,
      efficiencyRate: 94
    };
  });

  const [notifications, setNotifications] = useState([
    { id: 'notif-1', message: "Sarah completed 'Refactor Context State'", type: 'success', time: '10m ago', read: false },
    { id: 'notif-2', message: "High Priority task 'Design SaaS Landing Page' is due today", type: 'warning', time: '1h ago', read: false },
    { id: 'notif-3', message: "Marcus Aurelius assigned 'Plan Q3 Roadmap' to you", type: 'info', time: '4h ago', read: true }
  ]);

  // Persist tasks and user data
  useEffect(() => {
    localStorage.setItem('aetherflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('aetherflow_user', JSON.stringify(user));
  }, [user]);

  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      category: taskData.category || 'Work',
      assignee: taskData.assignee || {
        name: user.name,
        avatar: user.avatar
      },
      subtasks: taskData.subtasks || []
    };
    setTasks((prev) => [newTask, ...prev]);
    addNotification(`Task "${newTask.title}" has been created.`, 'info');
  };

  const updateTask = (taskId, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updatedFields } : task))
    );
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (taskToDelete) {
      addNotification(`Task "${taskToDelete.title}" was deleted.`, 'error');
    }
  };

  const toggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === 'completed' ? 'todo' : 'completed';
          addNotification(
            `Task "${task.title}" marked as ${newStatus}.`,
            newStatus === 'completed' ? 'success' : 'info'
          );
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  const addSubtask = (taskId, title) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newSub = { id: `sub-${Date.now()}`, title, completed: false };
          return { ...task, subtasks: [...task.subtasks, newSub] };
        }
        return task;
      })
    );
  };

  const updateUserProfile = (profileData) => {
    setUser((prev) => ({ ...prev, ...profileData }));
    addNotification('Profile settings updated successfully.', 'success');
  };

  const addNotification = (message, type = 'info') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      message,
      type,
      time: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        user,
        notifications,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        toggleSubtask,
        addSubtask,
        updateUserProfile,
        addNotification,
        markAllNotificationsRead,
        clearNotifications,
        setTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
